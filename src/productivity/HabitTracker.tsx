import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Flame, Calendar, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface Habit {
  id: string;
  name: string;
  completedDates: string[]; // ISO date strings YYYY-MM-DD
  streak: number;
  color: string;
}

const COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500',
  'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-pink-500',
];

// Map bg class → hex for inline styles where needed
const COLOR_HEX: Record<string, string> = {
  'bg-red-500': '#ef4444',
  'bg-orange-500': '#f97316',
  'bg-amber-500': '#f59e0b',
  'bg-green-500': '#22c55e',
  'bg-teal-500': '#14b8a6',
  'bg-blue-500': '#3b82f6',
  'bg-indigo-500': '#6366f1',
  'bg-violet-500': '#8b5cf6',
  'bg-pink-500': '#ec4899',
};

export const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habit_tracker_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[5]);
  const [pressedCell, setPressedCell] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('habit_tracker_data', JSON.stringify(habits));
  }, [habits]);

  const getDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d);
    }
    return dates;
  };

  const weekDates = getDates();
  const today = new Date().toISOString().split('T')[0];

  // Today's completion stats
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const completionPct = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  // Weekly completion rate per habit (last 7 days)
  const getWeeklyRate = (habit: Habit): number => {
    const completed = weekDates.filter(d => habit.completedDates.includes(d.toISOString().split('T')[0])).length;
    return Math.round((completed / 7) * 100);
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const habit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName,
      completedDates: [],
      streak: 0,
      color: selectedColor,
    };

    setHabits((prev) => [...prev, habit]);
    setNewHabitName('');
  };

  const toggleHabit = (habitId: string, dateStr: string) => {
    const cellKey = `${habitId}-${dateStr}`;
    setPressedCell(cellKey);
    setTimeout(() => setPressedCell(null), 300);

    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;

        const isCompleted = habit.completedDates.includes(dateStr);
        const newCompletedDates = isCompleted
          ? habit.completedDates.filter((d) => d !== dateStr)
          : [...habit.completedDates, dateStr];

        // Recalculate streak
        const sortedDates = [...newCompletedDates].sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime()
        );
        let streak = 0;
        const checkDate = new Date();
        const todayStr = checkDate.toISOString().split('T')[0];
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = checkDate.toISOString().split('T')[0];

        if (sortedDates.includes(todayStr)) {
          streak = 1;
          const current = new Date();
          current.setDate(current.getDate() - 1);
          while (sortedDates.includes(current.toISOString().split('T')[0])) {
            streak++;
            current.setDate(current.getDate() - 1);
          }
        } else if (sortedDates.includes(yesterdayStr)) {
          streak = 1;
          const current = new Date();
          current.setDate(current.getDate() - 2);
          while (sortedDates.includes(current.toISOString().split('T')[0])) {
            streak++;
            current.setDate(current.getDate() - 1);
          }
        } else {
          streak = 0;
        }

        return { ...habit, completedDates: newCompletedDates, streak };
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-lg text-white shadow-sm">
            <Calendar size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Habit Tracker</h1>
            <p className="text-xs text-slate-400">{totalHabits} habit{totalHabits !== 1 ? 's' : ''} tracked</p>
          </div>
        </div>
      </div>

      {/* Today's Progress Bar */}
      {totalHabits > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700">Today's Progress</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{completedToday}/{totalHabits}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                completionPct === 100
                  ? 'bg-emerald-100 text-emerald-700'
                  : completionPct >= 50
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {completionPct}%
              </span>
            </div>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                completionPct === 100 ? 'bg-emerald-500' : completionPct >= 50 ? 'bg-amber-500' : 'bg-indigo-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Add Habit Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">New Habit</p>
        <form onSubmit={addHabit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="e.g. Read 30 minutes, Exercise, Meditate..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-sm"
            />
            {/* Color Picker */}
            <div className="flex gap-2.5 mt-3 items-center">
              <span className="text-xs text-slate-400 font-medium shrink-0">Color:</span>
              <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    title={color.replace('bg-', '').replace('-500', '')}
                    className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${color} ${
                      selectedColor === color
                        ? 'scale-110 ring-2 ring-offset-2 ring-slate-400 shadow-md'
                        : 'hover:scale-110 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {selectedColor === color && (
                      <Check size={12} strokeWidth={3} className="text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={!newHabitName.trim()}
            className="h-[50px] px-6 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 shadow-sm"
          >
            <Plus size={18} />
            Add Habit
          </button>
        </form>
      </div>

      {/* Habits Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-4 px-6 font-semibold text-slate-500 text-xs uppercase tracking-wide w-1/3">Habit</th>
                {weekDates.map((date) => (
                  <th key={date.toString()} className="text-center py-4 px-2 font-medium text-slate-500 w-12">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-[10px] uppercase tracking-wide text-slate-400">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                        date.toISOString().split('T')[0] === today
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-700'
                      }`}>
                        {date.getDate()}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="text-center py-4 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide w-20">Streak</th>
                <th className="text-center py-4 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide w-20">Week</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {habits.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Flame size={24} className="text-slate-300" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-500">No habits yet</p>
                        <p className="text-xs mt-0.5">Add your first habit above to start tracking</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                habits.map((habit) => {
                  const weeklyRate = getWeeklyRate(habit);
                  const hexColor = COLOR_HEX[habit.color] || '#6366f1';
                  return (
                    <tr key={habit.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full shrink-0 ${habit.color}`} />
                          <span className="font-medium text-slate-900 text-sm">{habit.name}</span>
                        </div>
                      </td>
                      {weekDates.map((date) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const isCompleted = habit.completedDates.includes(dateStr);
                        const cellKey = `${habit.id}-${dateStr}`;
                        const isPressed = pressedCell === cellKey;

                        return (
                          <td key={dateStr} className="py-4 px-2 text-center">
                            <motion.button
                              onClick={() => toggleHabit(habit.id, dateStr)}
                              animate={{
                                scale: isPressed ? [1, 1.35, 0.9, 1.05, 1] : 1,
                              }}
                              transition={{ duration: 0.3 }}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto transition-colors ${
                                isCompleted
                                  ? 'text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                              }`}
                              style={isCompleted ? { backgroundColor: hexColor } : {}}
                            >
                              {isCompleted && <Check size={15} strokeWidth={3} />}
                            </motion.button>
                          </td>
                        );
                      })}

                      {/* Streak */}
                      <td className="py-4 px-4 text-center">
                        <div className={`flex items-center justify-center gap-1 font-bold text-sm ${habit.streak > 0 ? 'text-orange-500' : 'text-slate-300'}`}>
                          <Flame size={15} fill={habit.streak > 0 ? 'currentColor' : 'none'} />
                          {habit.streak}
                        </div>
                      </td>

                      {/* Weekly rate badge */}
                      <td className="py-4 px-4 text-center">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          weeklyRate === 100
                            ? 'bg-emerald-100 text-emerald-700'
                            : weeklyRate >= 57
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {weeklyRate}%
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

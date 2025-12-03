import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Flame, Calendar, Check } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  completedDates: string[]; // ISO date strings YYYY-MM-DD
  streak: number;
  color: string;
}

const COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500', 
  'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-pink-500'
];

export const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habit_tracker_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[5]);

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

    setHabits(prev => [...prev, habit]);
    setNewHabitName('');
  };

  const toggleHabit = (habitId: string, dateStr: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;

      const isCompleted = habit.completedDates.includes(dateStr);
      let newCompletedDates;
      
      if (isCompleted) {
        newCompletedDates = habit.completedDates.filter(d => d !== dateStr);
      } else {
        newCompletedDates = [...habit.completedDates, dateStr];
      }

      // Recalculate streak
      // Sort dates descending
      const sortedDates = [...newCompletedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      let streak = 0;
      let checkDate = new Date();
      
      // Check today or yesterday to start streak
      const todayStr = checkDate.toISOString().split('T')[0];
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = checkDate.toISOString().split('T')[0];

      if (sortedDates.includes(todayStr)) {
        streak = 1;
        let current = new Date();
        current.setDate(current.getDate() - 1);
        while (sortedDates.includes(current.toISOString().split('T')[0])) {
          streak++;
          current.setDate(current.getDate() - 1);
        }
      } else if (sortedDates.includes(yesterdayStr)) {
        streak = 1; // Streak preserved but not incremented for today yet
         let current = new Date();
        current.setDate(current.getDate() - 2);
        while (sortedDates.includes(current.toISOString().split('T')[0])) {
          streak++;
          current.setDate(current.getDate() - 1);
        }
      } else {
        streak = 0;
      }

      return {
        ...habit,
        completedDates: newCompletedDates,
        streak
      };
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md">
                <Calendar size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Habit Tracker</h1>
            </div>
          </div>
        </div>

        {/* Add Habit Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <form onSubmit={addHabit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Enter a new habit..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full transition-transform ${color} ${
                      selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-slate-300' : 'hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={!newHabitName.trim()}
              className="h-[50px] px-6 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
            >
              <Plus size={20} />
              Add Habit
            </button>
          </form>
        </div>

        {/* Habits Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left py-4 px-6 font-medium text-slate-500 w-1/3">Habit</th>
                  {weekDates.map(date => (
                    <th key={date.toString()} className="text-center py-4 px-2 font-medium text-slate-500 w-12">
                      <div className="flex flex-col items-center">
                        <span className="text-xs uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className={`text-sm font-bold ${
                          date.toISOString().split('T')[0] === today ? 'text-indigo-600' : 'text-slate-900'
                        }`}>
                          {date.getDate()}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="text-center py-4 px-6 font-medium text-slate-500 w-24">Streak</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {habits.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      No habits tracked yet. Start building your streak!
                    </td>
                  </tr>
                ) : (
                  habits.map(habit => (
                    <tr key={habit.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${habit.color}`} />
                          <span className="font-medium text-slate-900">{habit.name}</span>
                        </div>
                      </td>
                      {weekDates.map(date => {
                        const dateStr = date.toISOString().split('T')[0];
                        const isCompleted = habit.completedDates.includes(dateStr);
                        return (
                          <td key={dateStr} className="py-4 px-2 text-center">
                            <button
                              onClick={() => toggleHabit(habit.id, dateStr)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                isCompleted 
                                  ? `${habit.color} text-white shadow-sm scale-100` 
                                  : 'bg-slate-100 text-slate-300 hover:bg-slate-200 scale-90 hover:scale-100'
                              }`}
                            >
                              {isCompleted && <Check size={16} strokeWidth={3} />}
                            </button>
                          </td>
                        );
                      })}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1 text-orange-500 font-bold">
                          <Flame size={16} fill="currentColor" />
                          {habit.streak}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

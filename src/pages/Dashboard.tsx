import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  CheckSquare,
  ArrowRight,
  Zap,
  Maximize2,
  Minimize2,
  FileJson,
  Code2,
  Image as ImageIcon,
  Target,
  BookOpen,
  Timer,
  Flame,
  TrendingUp,
  Star,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

function getDashboardStats() {
  let tasksDone = 0;
  try {
    const tasks = JSON.parse(localStorage.getItem('task_manager_data') || '[]');
    tasksDone = tasks.filter((t: any) => t.status === 'done').length;
  } catch {}

  let noteCount = 0;
  try {
    const notes = JSON.parse(localStorage.getItem('note_taker_data') || '[]');
    noteCount = notes.length;
  } catch {}

  let pomodoroSessions = 0;
  try {
    pomodoroSessions = parseInt(localStorage.getItem('pomodoro_sessions') || '0', 10);
  } catch {}

  let habitStreak = 0;
  try {
    const habits = JSON.parse(localStorage.getItem('habit_tracker_data') || '[]');
    if (habits.length > 0) {
      const streaks = habits.map((h: any) => h.streak || 0);
      habitStreak = Math.max(...streaks);
    }
  } catch {}

  return { tasksDone, noteCount, pomodoroSessions, habitStreak };
}

function getWeeklyGoalProgress(): number {
  try {
    return parseInt(localStorage.getItem('pomodoro_sessions') || '0', 10);
  } catch {
    return 0;
  }
}

// Deterministic "random" heatmap using day-of-year seed so it doesn't re-render on each tick
function generateHeatmapData(): number[] {
  const day = Math.floor(Date.now() / 86_400_000);
  return Array.from({ length: 7 }, (_, i) => {
    const v = Math.sin(day * 9301 + i * 49297 + 233333) * 0.5 + 0.5;
    return Math.round(v * 4); // 0..4
  });
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const recentTools = [
  { name: 'JSON Formatter', path: '/tools/json-formatter', icon: FileJson, color: 'bg-orange-500' },
  { name: 'Code Snippets', path: '/tools/code-snippets', icon: Code2, color: 'bg-blue-500' },
  { name: 'Image Optimizer', path: '/tools/image-optimizer', icon: ImageIcon, color: 'bg-pink-500' },
];

const quickLinks = [
  { name: 'Pomodoro', path: '/tools/pomodoro', icon: Timer, color: 'bg-red-100 text-red-600', hoverBg: 'hover:bg-red-50', accentColor: 'text-red-500', label: 'Start focus' },
  { name: 'Tasks', path: '/tools/task-manager', icon: CheckSquare, color: 'bg-indigo-100 text-indigo-600', hoverBg: 'hover:bg-indigo-50', accentColor: 'text-indigo-500', label: 'View board' },
  { name: 'Notes', path: '/tools/note-taker', icon: BookOpen, color: 'bg-amber-100 text-amber-600', hoverBg: 'hover:bg-amber-50', accentColor: 'text-amber-500', label: 'Quick note' },
  { name: 'Habits', path: '/tools/habit-tracker', icon: Target, color: 'bg-emerald-100 text-emerald-600', hoverBg: 'hover:bg-emerald-50', accentColor: 'text-emerald-500', label: 'Check in' },
];

const WEEKLY_GOAL = 5;

const heatIntensity = ['bg-slate-100', 'bg-indigo-200', 'bg-indigo-300', 'bg-indigo-500', 'bg-indigo-700'];

const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] as never } },
};

export const Dashboard: React.FC = () => {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const greeting = useMemo(() => getGreeting(), []);
  const stats = useMemo(() => getDashboardStats(), []);
  const heatmap = useMemo(() => generateHeatmapData(), []);
  const weeklyProgress = useMemo(() => Math.min(getWeeklyGoalProgress(), WEEKLY_GOAL), []);
  const weeklyPct = Math.round((weeklyProgress / WEEKLY_GOAL) * 100);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      label: 'Tasks Done',
      value: stats.tasksDone.toString(),
      sub: 'from board',
      icon: CheckSquare,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      leftBorder: 'border-l-emerald-500',
      gradient: 'from-emerald-50/60',
    },
    {
      label: 'Focus Sessions',
      value: stats.pomodoroSessions.toString(),
      sub: 'pomodoros today',
      icon: Timer,
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-200',
      leftBorder: 'border-l-red-500',
      gradient: 'from-red-50/60',
    },
    {
      label: 'Best Streak',
      value: `${stats.habitStreak}d`,
      sub: 'habit streak',
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      leftBorder: 'border-l-orange-500',
      gradient: 'from-orange-50/60',
    },
    {
      label: 'Notes Saved',
      value: stats.noteCount.toString(),
      sub: 'in note taker',
      icon: BookOpen,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      leftBorder: 'border-l-violet-500',
      gradient: 'from-violet-50/60',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header — animated gradient greeting area */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] as never }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 px-7 py-6 shadow-lg shadow-indigo-200"
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-20 w-32 h-32 bg-violet-400/20 rounded-full blur-xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-indigo-200 uppercase tracking-widest mb-1">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-3xl font-bold text-white">
              {greeting}, Rushikesh
            </h1>
            <p className="text-indigo-200 mt-1 text-sm">Here's what's happening across your workspace.</p>
          </div>
          <Button
            onClick={() => setIsFocusMode(!isFocusMode)}
            variant={isFocusMode ? 'primary' : 'outline'}
            icon={isFocusMode ? Minimize2 : Maximize2}
            className={
              isFocusMode
                ? 'shadow-lg shadow-indigo-800/40 bg-white/20 border-white/30 text-white hover:bg-white/30'
                : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
            }
          >
            {isFocusMode ? 'Exit Focus' : 'Focus Mode'}
          </Button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isFocusMode ? (
          <motion.div
            key="focus"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center justify-center min-h-[55vh]"
          >
            <div className="text-8xl font-bold text-slate-900 mb-3 font-mono tabular-nums">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </div>
            <p className="text-xl text-slate-500 mb-12 font-medium">Stay focused. You got this.</p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              {quickLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group p-5 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex items-center gap-4"
                >
                  <div className={`p-3 ${link.color} rounded-xl group-hover:scale-110 transition-transform`}>
                    <link.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{link.name}</h3>
                    <p className="text-xs text-slate-500">{link.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={staggerChildren}
            className="space-y-8"
          >
            {/* Stat Cards — colored left border + subtle gradient */}
            <motion.div variants={staggerChildren} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  className={`relative bg-gradient-to-r ${stat.gradient} to-white p-5 rounded-2xl shadow-sm border ${stat.border} border-l-4 ${stat.leftBorder} flex items-center gap-4 group hover:shadow-md transition-all duration-200 overflow-hidden`}
                >
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                    <stat.icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500 font-medium truncate">{stat.label}</p>
                    <p className="text-[10px] text-slate-400 truncate">{stat.sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Weekly Goal + Activity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Weekly Goal Progress */}
              <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-500" />
                    <h2 className="text-sm font-bold text-slate-700">Weekly Goal</h2>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {weeklyProgress}/{WEEKLY_GOAL} sessions
                  </span>
                </div>
                <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${weeklyPct}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] as never }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {weeklyPct >= 100
                    ? '🎉 Goal smashed this week!'
                    : `${WEEKLY_GOAL - weeklyProgress} more focus session${WEEKLY_GOAL - weeklyProgress !== 1 ? 's' : ''} to hit your weekly goal`}
                </p>
              </motion.div>

              {/* 7-Day Activity Heatmap */}
              <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="text-amber-400" />
                  <h2 className="text-sm font-bold text-slate-700">Week Activity</h2>
                  <span className="text-[10px] text-slate-400 ml-auto">tool usage intensity</span>
                </div>
                <div className="flex items-end gap-2">
                  {heatmap.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div
                        className={`w-full rounded-md transition-all ${heatIntensity[val]}`}
                        style={{ height: `${(val + 1) * 10}px` }}
                      />
                      <span className="text-[10px] text-slate-400 font-medium">{DAYS[i]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick access + Recent + Inspiration */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Links — hover scale + shadow */}
              <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Access</h2>
                <div className="grid grid-cols-2 gap-3">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`group p-3 rounded-xl bg-slate-50 ${link.hoverBg} transition-all duration-200 border border-slate-100 hover:border-current hover:shadow-sm hover:scale-[1.03] flex flex-col gap-2`}
                    >
                      <div className={`w-8 h-8 ${link.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <link.icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{link.name}</p>
                        <p className={`text-[10px] ${link.accentColor} font-medium`}>{link.label}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Recent Tools */}
              <motion.div variants={fadeUp} className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Zap size={14} className="text-amber-500" />
                    Recent Tools
                  </h2>
                  <Link to="/tools/catalog" className="text-xs text-indigo-600 font-semibold hover:underline">
                    View All
                  </Link>
                </div>
                <div className="space-y-1">
                  {recentTools.map((tool) => (
                    <Link
                      key={tool.name}
                      to={tool.path}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all duration-150"
                    >
                      <div className={`w-8 h-8 ${tool.color} rounded-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                        <tool.icon size={16} />
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 flex-1">{tool.name}</span>
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-150" />
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Daily Inspiration — polished gradient card */}
              <motion.div
                variants={fadeUp}
                className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-2xl shadow-lg shadow-indigo-200 p-6 text-white flex flex-col justify-between"
              >
                {/* decorative circles */}
                <div className="pointer-events-none absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                <div className="pointer-events-none absolute bottom-0 left-0 w-24 h-24 bg-violet-500/30 rounded-full blur-lg" />

                <div className="relative">
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
                    <Coffee size={20} />
                  </div>
                  <p className="text-[10px] font-bold tracking-widest text-indigo-300 uppercase mb-2">Daily Inspiration</p>
                  <blockquote className="text-white/90 italic text-sm leading-relaxed font-medium">
                    "The only way to do great work is to love what you do."
                  </blockquote>
                  <p className="text-xs text-indigo-300 mt-3 font-semibold">— Steve Jobs</p>
                </div>
                <Link
                  to="/tools/catalog"
                  className="relative mt-6 w-full py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl font-semibold text-sm text-center transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40 flex items-center justify-center gap-1.5"
                >
                  Explore All Tools <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

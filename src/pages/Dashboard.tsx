import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, 
  CheckSquare, Clock, TrendingUp, 
  ArrowRight, Zap, 
  Maximize2, Minimize2,
  FileJson, Code2, Image as ImageIcon
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [greeting, setGreeting] = useState('');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      const hour = now.getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Focus Time', value: '2h 15m', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tasks Done', value: '12', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Productivity', value: '85%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const recentTools = [
    { name: 'JSON Formatter', path: '/tools/json-formatter', icon: FileJson, color: 'bg-orange-500' },
    { name: 'Code Snippets', path: '/tools/code-snippets', icon: Code2, color: 'bg-blue-500' },
    { name: 'Image Optimizer', path: '/tools/image-optimizer', icon: ImageIcon, color: 'bg-pink-500' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Focus Toggle */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              {greeting}, User <span className="text-2xl">👋</span>
            </h1>
            <p className="text-slate-500 mt-1">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isFocusMode 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isFocusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            {isFocusMode ? 'Exit Focus' : 'Focus Mode'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isFocusMode ? (
            <motion.div
              key="focus"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <div className="text-8xl font-bold text-slate-900 mb-4 font-mono">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
              <p className="text-xl text-slate-500 mb-12">Stay focused. You got this.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                <Link to="/tools/pomodoro" className="group p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all flex items-center gap-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Pomodoro</h3>
                    <p className="text-sm text-slate-500">Start a focus session</p>
                  </div>
                </Link>
                <Link to="/tools/task-manager" className="group p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                    <CheckSquare size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Tasks</h3>
                    <p className="text-sm text-slate-500">Check your todo list</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Tools */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Zap size={20} className="text-amber-500" />
                      Recent Tools
                    </h2>
                    <Link to="/tools/catalog" className="text-sm text-indigo-600 font-medium hover:underline">
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {recentTools.map((tool) => (
                      <Link
                        key={tool.name}
                        to={tool.path}
                        className="group p-4 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-colors border border-slate-100 hover:border-indigo-100"
                      >
                        <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                          <tool.icon size={20} />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">{tool.name}</h3>
                        <div className="flex items-center text-xs text-slate-500 group-hover:text-indigo-600">
                          Open Tool <ArrowRight size={12} className="ml-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick Actions / Quote */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
                      <Coffee size={20} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Daily Inspiration</h2>
                    <p className="text-indigo-100 italic">
                      "The only way to do great work is to love what you do."
                    </p>
                    <p className="text-xs text-indigo-200 mt-2">— Steve Jobs</p>
                  </div>
                  <Link 
                    to="/tools/catalog"
                    className="mt-6 w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-center hover:bg-indigo-50 transition-colors"
                  >
                    Explore All Tools
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

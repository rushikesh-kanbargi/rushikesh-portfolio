import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Calendar, CheckSquare, Flag, Filter, X, Columns, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Priority = 'none' | 'low' | 'medium' | 'high';

interface Task {
  id: string;
  text: string;
  status: 'todo' | 'in-progress' | 'done';
  category: string;
  priority: Priority;
  dueDate?: string;
  createdAt: number;
}

const CATEGORIES = [
  { id: 'work', name: 'Work', color: 'bg-blue-100 text-blue-700' },
  { id: 'personal', name: 'Personal', color: 'bg-green-100 text-green-700' },
  { id: 'learning', name: 'Learning', color: 'bg-purple-100 text-purple-700' },
  { id: 'urgent', name: 'Urgent', color: 'bg-red-100 text-red-700' },
];

const PRIORITIES: { id: Priority; label: string; color: string; dot: string; border: string }[] = [
  { id: 'none', label: 'None', color: 'text-slate-400', dot: 'bg-slate-200', border: 'border-l-transparent' },
  { id: 'low', label: 'Low', color: 'text-blue-500', dot: 'bg-blue-400', border: 'border-l-blue-400' },
  { id: 'medium', label: 'Medium', color: 'text-amber-500', dot: 'bg-amber-400', border: 'border-l-amber-400' },
  { id: 'high', label: 'High', color: 'text-red-500', dot: 'bg-red-500', border: 'border-l-red-500' },
];

const COLUMNS: {
  id: Task['status'];
  title: string;
  color: string;
  header: string;
  leftBorder: string;
  icon: React.ReactNode;
  emptyText: string;
}[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'bg-slate-50 border-slate-200',
    header: 'bg-white text-slate-700',
    leftBorder: 'border-l-slate-400',
    icon: <Columns size={14} />,
    emptyText: 'No tasks queued',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-blue-50/40 border-blue-100',
    header: 'bg-white text-blue-700',
    leftBorder: 'border-l-blue-500',
    icon: <Clock size={14} />,
    emptyText: 'Nothing in progress',
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-emerald-50/40 border-emerald-100',
    header: 'bg-white text-emerald-700',
    leftBorder: 'border-l-emerald-500',
    icon: <CheckCircle2 size={14} />,
    emptyText: 'No completed tasks',
  },
];

function priorityOf(p: Priority) {
  return { none: 0, low: 1, medium: 2, high: 3 }[p];
}

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('task_manager_data') || '[]');
      return saved.map((t: any) => ({
        ...t,
        status: t.status || (t.completed ? 'done' : 'todo'),
        priority: t.priority || 'none',
      }));
    } catch {
      return [];
    }
  });

  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('work');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('none');
  const [dueDate, setDueDate] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    localStorage.setItem('task_manager_data', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const task: Task = {
      id: crypto.randomUUID(),
      text: newTask.trim(),
      status: 'todo',
      category: selectedCategory,
      priority: selectedPriority,
      dueDate: dueDate || undefined,
      createdAt: Date.now(),
    };
    setTasks((prev) => [task, ...prev]);
    setNewTask('');
    setDueDate('');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    if (!draggedTaskId) return;
    setTasks((prev) => prev.map((t) => (t.id === draggedTaskId ? { ...t, status } : t)));
    setDraggedTaskId(null);
  };

  const getTasksByStatus = (status: Task['status']) => {
    let filtered = tasks.filter((t) => t.status === status);
    if (filterCategory) filtered = filtered.filter((t) => t.category === filterCategory);
    return filtered.sort((a, b) => priorityOf(b.priority) - priorityOf(a.priority));
  };

  const isOverdue = (task: Task) =>
    task.dueDate && task.status !== 'done' && new Date(task.dueDate) < new Date(new Date().toDateString());

  const totalTasks = tasks.length;
  const totalDone = tasks.filter((t) => t.status === 'done').length;
  const totalInProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const completionPct = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-sm">
              <CheckSquare size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Task Board</h1>
              <p className="text-xs text-slate-400">{totalTasks} total · {completionPct}% complete</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFilters || filterCategory ? 'bg-indigo-50 text-indigo-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Filter size={15} />
          Filter
          {filterCategory && <span className="w-4 h-4 bg-indigo-600 text-white rounded-full text-[9px] flex items-center justify-center">1</span>}
        </button>
      </div>

      {/* Stats Row */}
      {totalTasks > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', count: totalTasks, pct: 100, barColor: 'bg-slate-400', textColor: 'text-slate-700' },
            { label: 'In Progress', count: totalInProgress, pct: totalTasks > 0 ? (totalInProgress / totalTasks) * 100 : 0, barColor: 'bg-blue-500', textColor: 'text-blue-700' },
            { label: 'Done', count: totalDone, pct: completionPct, barColor: 'bg-emerald-500', textColor: 'text-emerald-700' },
          ].map(({ label, count, pct, barColor, textColor }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">{label}</span>
                <span className={`text-lg font-bold ${textColor}`}>{count}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${barColor} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {tasks.length > 0 && (
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}

      {/* Filter Row */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl border border-slate-200 p-4"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 mr-1">Category:</span>
              <button
                onClick={() => setFilterCategory(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  !filterCategory ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(filterCategory === cat.id ? null : cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filterCategory === cat.id ? cat.color + ' ring-2 ring-offset-1 ring-indigo-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Task */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">New Task</p>
        <form onSubmit={addTask} className="space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!newTask.trim()}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Category */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400 font-medium mr-1">Tag:</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? cat.color + ' ring-2 ring-offset-1 ring-indigo-500'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-slate-200 hidden sm:block" />

            {/* Priority */}
            <div className="flex items-center gap-1">
              <Flag size={13} className="text-slate-400 shrink-0 mr-1" />
              {PRIORITIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPriority(p.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                    selectedPriority === p.id
                      ? p.id === 'none' ? 'bg-slate-200 text-slate-700' : `${p.color} bg-slate-100 ring-2 ring-offset-1 ring-indigo-500`
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {p.id !== 'none' && <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />}
                  {p.label}
                </button>
              ))}
            </div>

            {/* Due date */}
            <div className="flex items-center gap-1.5 ml-auto">
              <Calendar size={13} className="text-slate-400" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-indigo-400 outline-none text-slate-600"
              />
              {dueDate && (
                <button type="button" onClick={() => setDueDate('')} className="text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`rounded-xl border border-l-4 ${column.color} ${column.leftBorder} min-h-64 transition-colors`}
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between px-4 py-3 ${column.header} rounded-t-xl border-b border-slate-100`}>
                <div className="flex items-center gap-2">
                  <span className="opacity-60">{column.icon}</span>
                  <h2 className="font-bold text-sm">{column.title}</h2>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                  {columnTasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div className="p-3 space-y-2">
                <AnimatePresence>
                  {columnTasks.map((task) => {
                    const category = CATEGORIES.find((c) => c.id === task.category);
                    const priority = PRIORITIES.find((p) => p.id === task.priority);
                    const overdue = isOverdue(task);
                    const priorityBorder = priority && priority.id !== 'none' ? priority.border : 'border-l-transparent';

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                          opacity: draggedTaskId === task.id ? 0.35 : 1,
                          scale: draggedTaskId === task.id ? 0.97 : 1,
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e as any, task.id)}
                        onDragEnd={() => setDraggedTaskId(null)}
                        className={`bg-white p-3.5 rounded-xl shadow-sm border border-l-4 cursor-move hover:shadow-md transition-all group ${priorityBorder} ${overdue ? 'border-red-200' : 'border-slate-200'}`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <p className={`text-slate-800 text-sm font-medium leading-snug flex-1 ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
                            {task.text}
                          </p>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0 p-0.5 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            {category && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${category.color}`}>
                                {category.name}
                              </span>
                            )}
                            {priority && priority.id !== 'none' && (
                              <span className={`text-[10px] font-semibold flex items-center gap-1 ${priority.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                                {priority.label}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {task.dueDate && (
                              <span className={`text-[10px] flex items-center gap-1 font-mono ${overdue ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                                <Calendar size={10} />
                                {overdue ? 'Overdue' : new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {columnTasks.length === 0 && (
                  <div className="h-28 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-300">
                    <span className="opacity-40">{column.icon}</span>
                    <span className="text-xs">{column.emptyText}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

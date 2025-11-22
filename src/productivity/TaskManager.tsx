import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle2, Circle, Trash2, Calendar, CheckSquare } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  dueDate?: string;
  createdAt: number;
}

const CATEGORIES = [
  { id: 'work', name: 'Work', color: 'bg-blue-100 text-blue-800' },
  { id: 'personal', name: 'Personal', color: 'bg-green-100 text-green-800' },
  { id: 'learning', name: 'Learning', color: 'bg-purple-100 text-purple-800' },
  { id: 'urgent', name: 'Urgent', color: 'bg-red-100 text-red-800' },
];

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('task_manager_data');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('work');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('task_manager_data', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      text: newTask,
      completed: false,
      category: selectedCategory,
      createdAt: Date.now(),
    };

    setTasks(prev => [task, ...prev]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md">
              <CheckSquare size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Task Manager</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Total</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.active}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Active</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Done</div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <form onSubmit={addTask} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
              <div className="flex gap-2 mt-3">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat.id
                        ? cat.color + ' ring-2 ring-offset-1 ring-indigo-500'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={!newTask.trim()}
              className="h-[50px] px-6 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus size={20} />
              Add
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Filters */}
          <div className="flex border-b border-slate-100">
            {(['all', 'active', 'completed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-4 text-sm font-medium transition-colors capitalize ${
                  filter === f 
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="divide-y divide-slate-100">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckSquare size={32} />
                </div>
                <p>No tasks found</p>
              </div>
            ) : (
              filteredTasks.map(task => {
                const category = CATEGORIES.find(c => c.id === task.category);
                return (
                  <div key={task.id} className="group flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`shrink-0 transition-colors ${
                        task.completed ? 'text-green-500' : 'text-slate-300 hover:text-indigo-500'
                      }`}
                    >
                      {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-slate-900 truncate transition-all ${
                        task.completed ? 'line-through text-slate-400' : ''
                      }`}>
                        {task.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${category?.color}`}>
                          {category?.name}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {stats.completed > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
              <button
                onClick={clearCompleted}
                className="text-sm text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} />
                Clear Completed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

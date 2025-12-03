import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Calendar, CheckSquare } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  status: 'todo' | 'in-progress' | 'done';
  category: string;
  createdAt: number;
}

const CATEGORIES = [
  { id: 'work', name: 'Work', color: 'bg-blue-100 text-blue-800' },
  { id: 'personal', name: 'Personal', color: 'bg-green-100 text-green-800' },
  { id: 'learning', name: 'Learning', color: 'bg-purple-100 text-purple-800' },
  { id: 'urgent', name: 'Urgent', color: 'bg-red-100 text-red-800' },
];

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-100 border-slate-200' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50 border-blue-100' },
  { id: 'done', title: 'Done', color: 'bg-green-50 border-green-100' },
];

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('task_manager_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration for old data structure
      if (parsed.length > 0 && !parsed[0].status) {
        return parsed.map((t: any) => ({
          ...t,
          status: t.completed ? 'done' : 'todo'
        }));
      }
      return parsed;
    }
    return [];
  });
  
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('work');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('task_manager_data', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      text: newTask,
      status: 'todo',
      category: selectedCategory,
      createdAt: Date.now(),
    };

    setTasks(prev => [task, ...prev]);
    setNewTask('');
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    // Create a transparent drag image or style the element
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = draggedTaskId;
    if (!taskId) return;

    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status } : t
    ));
    setDraggedTaskId(null);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(t => t.status === status);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md">
                <CheckSquare size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Task Board</h1>
            </div>
          </div>
          
          <div className="text-sm text-slate-500 font-medium">
            {tasks.length} Tasks Total
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
          <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? cat.color + ' ring-2 ring-offset-1 ring-indigo-500'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={!newTask.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
            >
              <Plus size={18} />
              Add Task
            </button>
          </form>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start h-full">
          {COLUMNS.map(column => (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id as Task['status'])}
              className={`rounded-xl p-4 min-h-[500px] border ${column.color} transition-colors`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-700 flex items-center gap-2">
                  {column.title}
                  <span className="px-2 py-0.5 bg-white rounded-full text-xs text-slate-500 border border-slate-200">
                    {getTasksByStatus(column.id as Task['status']).length}
                  </span>
                </h2>
              </div>

              <div className="space-y-3">
                {getTasksByStatus(column.id as Task['status']).map(task => {
                  const category = CATEGORIES.find(c => c.id === task.category);
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-move hover:shadow-md transition-all group ${
                        draggedTaskId === task.id ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <p className="text-slate-800 font-medium leading-snug">{task.text}</p>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${category?.color}`}>
                          {category?.name}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
                
                {getTasksByStatus(column.id as Task['status']).length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                    Drop items here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Command, 
  FileJson, 
  Regex, 
  FileCode, 
  Code2, 
  Share2, 
  Globe, 
  GitCompare, 
  FileText, 
  Sparkles, 
  Briefcase, 
  MessageSquare, 
  Timer, 
  CheckSquare, 
  BookOpen, 
  Calendar, 
  Bot,
  LayoutDashboard,
  Home,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react';

interface Action {
  id: string;
  name: string;
  section: string;
  icon: any;
  perform: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const actions: Action[] = useMemo(() => [
    // General
    { id: 'home', name: 'Go to Home', section: 'Navigation', icon: Home, perform: () => navigate('/') },
    { id: 'dashboard', name: 'Go to Dashboard', section: 'Navigation', icon: LayoutDashboard, perform: () => navigate('/tools') },
    { id: 'catalog', name: 'All Tools Catalog', section: 'Navigation', icon: LayoutDashboard, perform: () => navigate('/tools/catalog') },
    
    // Developer Tools
    { id: 'json', name: 'JSON Formatter', section: 'Developer Tools', icon: FileJson, perform: () => navigate('/tools/json-formatter') },
    { id: 'regex', name: 'Regex Tester', section: 'Developer Tools', icon: Regex, perform: () => navigate('/tools/regex-tester') },
    { id: 'markdown', name: 'Markdown Editor', section: 'Developer Tools', icon: FileCode, perform: () => navigate('/tools/markdown-editor') },
    { id: 'snippets', name: 'Code Snippets', section: 'Developer Tools', icon: Code2, perform: () => navigate('/tools/code-snippets') },
    { id: 'system-design', name: 'System Design Board', section: 'Developer Tools', icon: Share2, perform: () => navigate('/tools/system-design') },
    { id: 'api-client', name: 'API Client', section: 'Developer Tools', icon: Globe, perform: () => navigate('/tools/api-client') },
    { id: 'diff-checker', name: 'Diff Checker', section: 'Developer Tools', icon: GitCompare, perform: () => navigate('/tools/diff-checker') },
    { id: 'image-optimizer', name: 'Image Optimizer', section: 'Developer Tools', icon: ImageIcon, perform: () => navigate('/tools/image-optimizer') },

    // Career
    { id: 'resume', name: 'Resume Builder', section: 'Career', icon: FileText, perform: () => navigate('/resume-builder/dashboard') },
    { id: 'cover-letter', name: 'Cover Letter Generator', section: 'Career', icon: Sparkles, perform: () => navigate('/tools/cover-letter') },
    { id: 'job-tracker', name: 'Job Tracker', section: 'Career', icon: Briefcase, perform: () => navigate('/tools/job-tracker') },
    { id: 'mock-interview', name: 'Mock Interview', section: 'Career', icon: MessageSquare, perform: () => navigate('/tools/mock-interview') },

    // Productivity
    { id: 'pomodoro', name: 'Pomodoro Timer', section: 'Productivity', icon: Timer, perform: () => navigate('/tools/pomodoro') },
    { id: 'task-manager', name: 'Task Manager', section: 'Productivity', icon: CheckSquare, perform: () => navigate('/tools/task-manager') },
    { id: 'note-taker', name: 'Note Taker', section: 'Productivity', icon: BookOpen, perform: () => navigate('/tools/note-taker') },
    { id: 'habit-tracker', name: 'Habit Tracker', section: 'Productivity', icon: Calendar, perform: () => navigate('/tools/habit-tracker') },

    // Branding
    { id: 'blog', name: 'Tech Blog', section: 'Branding', icon: BookOpen, perform: () => navigate('/tools/blog') },
    { id: 'ask-ai', name: 'Ask My AI', section: 'Branding', icon: Bot, perform: () => navigate('/tools/ask-ai') },
  ], [navigate]);

  const filteredActions = useMemo(() => {
    if (!query) return actions;
    const lowerQuery = query.toLowerCase();
    return actions.filter(action => 
      action.name.toLowerCase().includes(lowerQuery) || 
      action.section.toLowerCase().includes(lowerQuery)
    );
  }, [query, actions]);

  const handleSelect = (action: Action) => {
    action.perform();
    onClose();
    setQuery('');
  };

  // Navigation within the list
  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          handleSelect(filteredActions[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [isOpen, filteredActions, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 z-[101] overflow-hidden flex flex-col max-h-[60vh]"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-4 border-b border-slate-100">
              <Search className="text-slate-400 mr-3" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 placeholder:text-slate-400"
              />
              <div className="hidden sm:flex items-center gap-1">
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs text-slate-500 font-mono">Esc</kbd>
              </div>
            </div>

            {/* Results */}
            <div className="overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <p>No results found.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredActions.map((action, index) => (
                    <button
                      key={action.id}
                      onClick={() => handleSelect(action)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        index === selectedIndex 
                          ? 'bg-indigo-50 text-indigo-700' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${index === selectedIndex ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                          <action.icon size={18} />
                        </div>
                        <div className="text-left">
                          <span className={`block font-medium ${index === selectedIndex ? 'text-indigo-900' : 'text-slate-900'}`}>
                            {action.name}
                          </span>
                          <span className={`text-xs ${index === selectedIndex ? 'text-indigo-500' : 'text-slate-400'}`}>
                            {action.section}
                          </span>
                        </div>
                      </div>
                      {index === selectedIndex && (
                        <ArrowRight size={16} className="text-indigo-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Command size={12} /> 
                  <span className="font-mono">Cmd+K</span> to open
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Use</span>
                <div className="flex gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-sm">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-sm">↓</kbd>
                </div>
                <span>to navigate</span>
                <kbd className="ml-2 px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-sm">↵</kbd>
                <span>to select</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

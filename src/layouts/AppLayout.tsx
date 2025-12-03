import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileJson, 
  Regex, 
  FileCode, 
  Code2, 
  Sparkles, 
  Briefcase, 
  MessageSquare, 
  Timer, 
  CheckSquare, 
  FileText, 
  BookOpen, 
  Bot,
  Menu,
  X,
  ChevronLeft,

  Home,
  Search,
  Image as ImageIcon
} from 'lucide-react';

const menuItems = [
  {
    category: 'Overview',
    items: [
      { name: 'Dashboard', path: '/tools', icon: LayoutDashboard },
      { name: 'All Tools', path: '/tools/catalog', icon: LayoutDashboard },
    ]
  },
  {
    category: 'Developer Tools',
    items: [
      { name: 'JSON Formatter', path: '/tools/json-formatter', icon: FileJson },
      { name: 'Regex Tester', path: '/tools/regex-tester', icon: Regex },
      { name: 'Markdown Editor', path: '/tools/markdown-editor', icon: FileCode },
      { name: 'Code Snippets', path: '/tools/code-snippets', icon: Code2 },
      { name: 'Image Optimizer', path: '/tools/image-optimizer', icon: ImageIcon },
    ]
  },
  {
    category: 'Career Suite',
    items: [
      { name: 'Resume Builder', path: '/resume-builder/dashboard', icon: FileText },
      { name: 'Cover Letter', path: '/tools/cover-letter', icon: Sparkles },
      { name: 'Job Tracker', path: '/tools/job-tracker', icon: Briefcase },
      { name: 'Mock Interview', path: '/tools/mock-interview', icon: MessageSquare },
    ]
  },
  {
    category: 'Productivity',
    items: [
      { name: 'Pomodoro', path: '/tools/pomodoro', icon: Timer },
      { name: 'Task Manager', path: '/tools/task-manager', icon: CheckSquare },
      { name: 'Note Taker', path: '/tools/note-taker', icon: BookOpen },
    ]
  },
  {
    category: 'Personal Branding',
    items: [
      { name: 'Tech Blog', path: '/tools/blog', icon: FileText },

      { name: 'Ask My AI', path: '/tools/ask-ai', icon: Bot },
    ]
  }
];

import { ResumeProvider } from '../resume-builder/context/ResumeContext';
import { CommandPalette } from '../components/CommandPalette';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ResumeProvider>
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      <div className="h-screen overflow-hidden bg-slate-50 flex text-slate-900">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            bg-white border-r border-slate-200
            transition-all duration-300 ease-in-out
            flex flex-col
            ${isSidebarOpen ? 'w-64' : 'w-20'}
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
            <Link to="/" className={`flex items-center gap-2 font-bold text-slate-900 overflow-hidden whitespace-nowrap ${!isSidebarOpen && 'justify-center w-full'}`}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0">
                <Code2 size={20} />
              </div>
              {isSidebarOpen && <span>DevPlatform</span>}
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <ChevronLeft size={16} className={`transition-transform ${!isSidebarOpen && 'rotate-180'}`} />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
              aria-label="Close Menu"
            >
              <X size={20} />
            </button>
          </div>



          {/* Search Button */}
          <div className="px-3 py-4">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors border border-slate-200
                ${!isSidebarOpen && 'justify-center'}
              `}
            >
              <Search size={20} />
              {isSidebarOpen && (
                <>
                  <span className="text-sm font-medium">Search...</span>
                  <div className="ml-auto flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono shadow-sm">Ctrl</kbd>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono shadow-sm">K</kbd>
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
            {menuItems.map((section, idx) => (
              <div key={idx}>
                {isSidebarOpen && (
                  <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {section.category}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                          ${isActive 
                            ? 'bg-indigo-50 text-indigo-600' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                          ${!isSidebarOpen && 'justify-center'}
                        `}
                        title={!isSidebarOpen ? item.name : undefined}
                        aria-label={item.name}
                      >
                        <item.icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                        {isSidebarOpen && <span>{item.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100">
            <Link
              to="/"
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors
                ${!isSidebarOpen && 'justify-center'}
              `}
              aria-label="Back to Portfolio"
            >
              <Home size={20} className="text-slate-400" />
              {isSidebarOpen && <span>Back to Portfolio</span>}
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
            <span className="ml-3 font-bold text-slate-900">DevPlatform</span>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </ResumeProvider>
  );
};

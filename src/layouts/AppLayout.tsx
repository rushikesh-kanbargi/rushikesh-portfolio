import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Image as ImageIcon,
  Share2,
  Globe,
  GitCompare,
  Calendar,
} from 'lucide-react';

const menuItems = [
  {
    category: 'Overview',
    items: [
      { name: 'Dashboard', path: '/tools', icon: LayoutDashboard },
      { name: 'All Tools', path: '/tools/catalog', icon: LayoutDashboard },
    ],
  },
  {
    category: 'Developer Tools',
    items: [
      { name: 'JSON Formatter', path: '/tools/json-formatter', icon: FileJson },
      { name: 'Regex Tester', path: '/tools/regex-tester', icon: Regex },
      { name: 'Markdown Editor', path: '/tools/markdown-editor', icon: FileCode },
      { name: 'Code Snippets', path: '/tools/code-snippets', icon: Code2 },
      { name: 'Image Optimizer', path: '/tools/image-optimizer', icon: ImageIcon },
      { name: 'API Client', path: '/tools/api-client', icon: Globe },
      { name: 'Diff Checker', path: '/tools/diff-checker', icon: GitCompare },
      { name: 'System Design', path: '/tools/system-design', icon: Share2 },
    ],
  },
  {
    category: 'Career Suite',
    items: [
      { name: 'Resume Builder', path: '/resume-builder/dashboard', icon: FileText },
      { name: 'Cover Letter', path: '/tools/cover-letter', icon: Sparkles },
      { name: 'Job Tracker', path: '/tools/job-tracker', icon: Briefcase },
      { name: 'Mock Interview', path: '/tools/mock-interview', icon: MessageSquare },
    ],
  },
  {
    category: 'Productivity',
    items: [
      { name: 'Pomodoro', path: '/tools/pomodoro', icon: Timer },
      { name: 'Task Manager', path: '/tools/task-manager', icon: CheckSquare },
      { name: 'Note Taker', path: '/tools/note-taker', icon: BookOpen },
      { name: 'Habit Tracker', path: '/tools/habit-tracker', icon: Calendar },
    ],
  },
  {
    category: 'Personal Branding',
    items: [
      { name: 'Tech Blog', path: '/tools/blog', icon: FileText },
      { name: 'Ask My AI', path: '/tools/ask-ai', icon: Bot },
    ],
  },
];

import { ResumeProvider } from '../resume-builder/context/ResumeContext';
import { CommandPalette } from '../components/CommandPalette';

// CSS tooltip for collapsed sidebar — no new deps needed
const SidebarTooltip: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="relative group/tip">
    {children}
    <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
      <div className="bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
        {label}
        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
      </div>
    </div>
  </div>
);

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const currentPageName = (() => {
    for (const section of menuItems) {
      const found = section.items.find((i) => i.path === location.pathname);
      if (found) return found.name;
    }
    return 'DevPlatform';
  })();

  return (
    <ResumeProvider>
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      <div className="h-screen overflow-hidden bg-slate-50 flex text-slate-900">
        {/* Mobile overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            bg-white border-r border-slate-200
            transition-all duration-300 ease-in-out
            flex flex-col shrink-0
            ${isSidebarOpen ? 'w-64' : 'w-[72px]'}
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
            <Link
              to="/"
              className={`flex items-center gap-2.5 font-bold text-slate-900 overflow-hidden whitespace-nowrap ${!isSidebarOpen && 'justify-center w-full'}`}
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
                <Code2 size={18} />
              </div>
              {isSidebarOpen && (
                <span className="font-bold text-slate-900 text-sm">DevPlatform</span>
              )}
            </Link>
            {isSidebarOpen && (
              <>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="hidden lg:block p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Collapse Sidebar"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="lg:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close Menu"
                >
                  <X size={20} />
                </button>
              </>
            )}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="hidden lg:flex w-full items-center justify-center p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors absolute right-0"
                aria-label="Expand Sidebar"
              >
                <ChevronLeft size={16} className="rotate-180" />
              </button>
            )}
          </div>

          {/* Search */}
          <div className={`px-3 py-3 shrink-0 ${!isSidebarOpen && 'flex justify-center'}`}>
            {!isSidebarOpen ? (
              <SidebarTooltip label="Search (⌘K)">
                <button
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors border border-slate-200"
                  title="Search (Ctrl K)"
                >
                  <Search size={16} className="shrink-0" />
                </button>
              </SidebarTooltip>
            ) : (
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors border border-slate-200 text-sm"
                title="Search (Ctrl K)"
              >
                <Search size={16} className="shrink-0" />
                <span className="font-medium flex-1 text-left">Search...</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono shadow-sm">⌘K</kbd>
                </div>
              </button>
            )}
          </div>

          {/* Nav — scrollable with gradient fade */}
          <div className="relative flex-1 min-h-0">
            <div className="h-full overflow-y-auto py-2 px-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
              {menuItems.map((section, idx) => (
                <div key={idx}>
                  {isSidebarOpen && (
                    <h3 className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      {section.category}
                    </h3>
                  )}
                  {!isSidebarOpen && idx > 0 && (
                    <div className="border-t border-slate-100 mb-2" />
                  )}
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      const linkEl = (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`
                            relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                            ${isActive
                              ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                            ${!isSidebarOpen && 'justify-center px-2'}
                          `}
                          title={!isSidebarOpen ? item.name : undefined}
                          aria-label={item.name}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full" />
                          )}
                          <item.icon
                            size={18}
                            className={`shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
                          />
                          {isSidebarOpen && (
                            <>
                              <span className="truncate flex-1">{item.name}</span>
                              {isActive && (
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full shrink-0" />
                              )}
                            </>
                          )}
                        </Link>
                      );
                      return !isSidebarOpen ? (
                        <SidebarTooltip key={item.path} label={item.name}>
                          {linkEl}
                        </SidebarTooltip>
                      ) : linkEl;
                    })}
                  </div>
                </div>
              ))}
              {/* bottom padding so last items aren't hidden under fade */}
              <div className="h-4" />
            </div>
            {/* gradient fade indicating more content below */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
          </div>

          {/* Footer — avatar + portfolio live link */}
          <div className="p-3 border-t border-slate-100 shrink-0 space-y-1">
            {/* User avatar initials badge */}
            {isSidebarOpen ? (
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 mb-1">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                  RK
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">Rushikesh K.</p>
                  <p className="text-[10px] text-slate-400 truncate">Senior SWE</p>
                </div>
              </div>
            ) : (
              <SidebarTooltip label="Rushikesh K. · Senior SWE">
                <div className="flex justify-center py-1 mb-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    RK
                  </div>
                </div>
              </SidebarTooltip>
            )}

            {/* Back to Portfolio with pulsing live dot */}
            {isSidebarOpen ? (
              <Link
                to="/"
                className="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                title="Back to Portfolio"
                aria-label="Back to Portfolio"
              >
                <Home size={18} className="text-slate-400 shrink-0 group-hover:text-slate-600 transition-colors" />
                <span className="flex-1 truncate">Back to Portfolio</span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[10px] text-emerald-500 font-semibold">Live</span>
                </span>
              </Link>
            ) : (
              <SidebarTooltip label="Portfolio Live">
                <Link
                  to="/"
                  className="relative flex items-center justify-center px-2 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  title="Back to Portfolio"
                  aria-label="Back to Portfolio"
                >
                  <Home size={18} className="text-slate-400 shrink-0" />
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </Link>
              </SidebarTooltip>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Mobile / Desktop Top Bar */}
          <div className="h-14 bg-white border-b border-slate-200 flex items-center px-4 shrink-0 gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-slate-500 min-w-0">
              <Link to="/tools" className="hover:text-indigo-600 transition-colors shrink-0 font-medium">
                DevPlatform
              </Link>
              {location.pathname !== '/tools' && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-900 font-semibold truncate">{currentPageName}</span>
                </>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Search size={14} />
                <span className="text-xs">Search</span>
                <kbd className="ml-1 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono shadow-sm">⌘K</kbd>
              </button>
            </div>
          </div>

          {/* Page Content with route transition */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="p-4 sm:p-6 lg:p-8 min-h-full"
              >
                <div className="max-w-7xl mx-auto">
                  <Outlet />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </ResumeProvider>
  );
};

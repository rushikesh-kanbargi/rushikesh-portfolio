import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileJson, Regex, FileCode, Code2, ArrowRight,
  Sparkles, Briefcase, MessageSquare,
  Timer, CheckSquare, FileText,
  BookOpen, Bot, Calendar, Share2, Globe, GitCompare, Image as ImageIcon, Search, X,
  Zap,
  type LucideIcon,
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
  tags: string[];
  featured?: boolean;
  shortcut?: string;
  borderColor?: string;
}

const allTools: { category: string; icon: LucideIcon; tools: Tool[] }[] = [
  {
    category: 'Developer Utilities',
    icon: Code2,
    tools: [
      {
        id: 'json-formatter',
        name: 'JSON Formatter',
        description: 'Validate, format, and minify your JSON data instantly.',
        icon: FileJson,
        path: '/tools/json-formatter',
        color: 'bg-orange-500',
        borderColor: 'border-orange-400',
        tags: ['json', 'format', 'validate', 'minify'],
        featured: true,
        shortcut: '⌘J',
      },
      {
        id: 'regex-tester',
        name: 'Regex Tester',
        description: 'Test and debug regular expressions with real-time highlighting.',
        icon: Regex,
        path: '/tools/regex-tester',
        color: 'bg-purple-500',
        borderColor: 'border-purple-400',
        tags: ['regex', 'pattern', 'test', 'debug'],
        shortcut: '⌘R',
      },
      {
        id: 'markdown-editor',
        name: 'Markdown Editor',
        description: 'Write and preview Markdown content with a split-screen editor.',
        icon: FileCode,
        path: '/tools/markdown-editor',
        color: 'bg-blue-500',
        borderColor: 'border-blue-400',
        tags: ['markdown', 'editor', 'preview'],
        shortcut: '⌘M',
      },
      {
        id: 'code-snippets',
        name: 'Code Snippets',
        description: 'Save and organize reusable code snippets with syntax highlighting.',
        icon: Code2,
        path: '/tools/code-snippets',
        color: 'bg-violet-500',
        borderColor: 'border-violet-400',
        tags: ['code', 'snippets', 'organize'],
      },
      {
        id: 'image-optimizer',
        name: 'Image Optimizer',
        description: 'Compress and convert images locally for better web performance.',
        icon: ImageIcon,
        path: '/tools/image-optimizer',
        color: 'bg-pink-500',
        borderColor: 'border-pink-400',
        tags: ['image', 'compress', 'optimize', 'convert'],
      },
      {
        id: 'api-client',
        name: 'API Client',
        description: 'Test HTTP requests and inspect responses directly in your browser.',
        icon: Globe,
        path: '/tools/api-client',
        color: 'bg-cyan-500',
        borderColor: 'border-cyan-400',
        tags: ['api', 'http', 'rest', 'request'],
      },
      {
        id: 'diff-checker',
        name: 'Diff Checker',
        description: 'Compare text or code to spot differences instantly.',
        icon: GitCompare,
        path: '/tools/diff-checker',
        color: 'bg-emerald-500',
        borderColor: 'border-emerald-400',
        tags: ['diff', 'compare', 'code', 'text'],
      },
      {
        id: 'system-design',
        name: 'System Design Board',
        description: 'Sketch system architectures with drag-and-drop nodes.',
        icon: Share2,
        path: '/tools/system-design',
        color: 'bg-rose-500',
        borderColor: 'border-rose-400',
        tags: ['system', 'design', 'architecture', 'diagram'],
      },
    ],
  },
  {
    category: 'Career Suite',
    icon: Briefcase,
    tools: [
      {
        id: 'resume-builder',
        name: 'Resume Builder',
        description: 'Create ATS-friendly resumes with a drag-and-drop builder.',
        icon: FileText,
        path: '/resume-builder/dashboard',
        color: 'bg-indigo-600',
        borderColor: 'border-indigo-500',
        tags: ['resume', 'cv', 'ats', 'career'],
        featured: true,
        shortcut: '⌘⇧R',
      },
      {
        id: 'cover-letter',
        name: 'AI Cover Letter',
        description: 'Generate tailored cover letters in seconds using Gemini AI.',
        icon: Sparkles,
        path: '/tools/cover-letter',
        color: 'bg-indigo-500',
        borderColor: 'border-indigo-400',
        tags: ['cover letter', 'ai', 'gemini', 'career'],
      },
      {
        id: 'job-tracker',
        name: 'Job Tracker',
        description: 'Track your job applications with a visual Kanban board.',
        icon: Briefcase,
        path: '/tools/job-tracker',
        color: 'bg-blue-600',
        borderColor: 'border-blue-500',
        tags: ['job', 'tracker', 'applications', 'kanban'],
      },
      {
        id: 'mock-interview',
        name: 'Mock Interview',
        description: 'Practice technical interviews with an AI-powered bot.',
        icon: MessageSquare,
        path: '/tools/mock-interview',
        color: 'bg-pink-500',
        borderColor: 'border-pink-400',
        tags: ['interview', 'practice', 'ai', 'technical'],
      },
    ],
  },
  {
    category: 'Productivity',
    icon: Timer,
    tools: [
      {
        id: 'pomodoro',
        name: 'Pomodoro Timer',
        description: 'Boost focus with a customizable timer for work and breaks.',
        icon: Timer,
        path: '/tools/pomodoro',
        color: 'bg-red-500',
        borderColor: 'border-red-400',
        tags: ['pomodoro', 'timer', 'focus', 'productivity'],
        featured: true,
        shortcut: '⌘P',
      },
      {
        id: 'task-manager',
        name: 'Task Manager',
        description: 'Organize your day with a categorized todo list and stats.',
        icon: CheckSquare,
        path: '/tools/task-manager',
        color: 'bg-indigo-600',
        borderColor: 'border-indigo-500',
        tags: ['tasks', 'todo', 'kanban', 'productivity'],
      },
      {
        id: 'note-taker',
        name: 'Note Taker',
        description: 'Capture ideas instantly with a markdown-supported note app.',
        icon: BookOpen,
        path: '/tools/note-taker',
        color: 'bg-amber-500',
        borderColor: 'border-amber-400',
        tags: ['notes', 'markdown', 'ideas', 'productivity'],
      },
      {
        id: 'habit-tracker',
        name: 'Habit Tracker',
        description: 'Build consistency with a daily habit tracking grid and streaks.',
        icon: Calendar,
        path: '/tools/habit-tracker',
        color: 'bg-emerald-500',
        borderColor: 'border-emerald-400',
        tags: ['habits', 'streak', 'consistency', 'tracking'],
      },
    ],
  },
  {
    category: 'Personal Branding',
    icon: Sparkles,
    tools: [
      {
        id: 'blog',
        name: 'Tech Blog',
        description: 'Read articles about web development, design, and career growth.',
        icon: BookOpen,
        path: '/tools/blog',
        color: 'bg-teal-500',
        borderColor: 'border-teal-400',
        tags: ['blog', 'articles', 'writing'],
      },
      {
        id: 'ask-ai',
        name: 'Ask My AI',
        description: 'Chat with an AI assistant trained on my resume and skills.',
        icon: Bot,
        path: '/tools/ask-ai',
        color: 'bg-violet-600',
        borderColor: 'border-violet-500',
        tags: ['ai', 'chat', 'assistant', 'skills'],
      },
    ],
  },
];

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.19, 1, 0.22, 1] as never }}
    >
      <Link
        to={tool.path}
        className={`group relative bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-transparent flex flex-col h-full overflow-hidden`}
      >
        {/* Colored top border revealed on hover */}
        <span
          className={`absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${tool.color}`}
        />

        {/* Featured badge */}
        {tool.featured && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-600 rounded-full text-[10px] font-bold tracking-wide">
            <Zap size={9} />
            Featured
          </span>
        )}

        <div className={`w-11 h-11 ${tool.color} rounded-xl flex items-center justify-center mb-4 text-white shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0`}>
          <tool.icon size={22} />
        </div>
        <h3 className="font-bold text-slate-900 mb-1.5 text-sm group-hover:text-indigo-600 transition-colors">
          {tool.name}
        </h3>
        <p className="text-xs text-slate-500 mb-4 flex-grow leading-relaxed">
          {tool.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-indigo-600 text-xs font-semibold group-hover:translate-x-1 transition-transform duration-300">
            Open <ArrowRight size={13} className="ml-1" />
          </div>
          {tool.shortcut && (
            <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono text-slate-400 group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:text-indigo-500 transition-colors">
              {tool.shortcut}
            </kbd>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export const PlatformHome: React.FC = () => {
  const [query, setQuery] = useState('');

  const filteredSections = useMemo(() => {
    if (!query.trim()) return allTools;
    const q = query.toLowerCase();
    return allTools
      .map((section) => ({
        ...section,
        tools: section.tools.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.includes(q))
        ),
      }))
      .filter((s) => s.tools.length > 0);
  }, [query]);

  const totalTools = allTools.reduce((acc, s) => acc + s.tools.length, 0);
  const totalResults = filteredSections.reduce((acc, s) => acc + s.tools.length, 0);

  return (
    <div className="space-y-10">
      {/* Hero — gradient background */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 px-8 py-10 text-center shadow-xl shadow-indigo-200/60">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 w-48 h-48 bg-violet-400/20 rounded-full blur-2xl" />

        <div className="relative max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-indigo-200 uppercase bg-white/10 border border-white/20 px-3 py-1 rounded-full mb-4">
            <Sparkles size={10} />
            {totalTools} tools &amp; counting
          </span>
          <h1 className="text-3xl font-bold text-white mb-3">
            Welcome to <span className="text-indigo-200">DevPlatform</span>
          </h1>
          <p className="text-indigo-200 mb-7 text-sm leading-relaxed">
            Your all-in-one workspace for development, career growth, and productivity.
          </p>

          {/* Search — more prominent with shortcut hint */}
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-24 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none shadow-lg text-slate-800 placeholder:text-slate-400"
            />
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={15} />
              </button>
            ) : (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono text-slate-400 shadow-sm">⌘</kbd>
                <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono text-slate-400 shadow-sm">K</kbd>
              </div>
            )}
          </div>

          {query && (
            <p className="text-sm text-indigo-200 mt-3">
              {totalResults} {totalResults === 1 ? 'tool' : 'tools'} found
            </p>
          )}
        </div>
      </div>

      {/* Sections */}
      {filteredSections.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Search size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-base font-medium">No tools match "{query}"</p>
          <button onClick={() => setQuery('')} className="mt-2 text-sm text-indigo-600 hover:underline">
            Clear search
          </button>
        </div>
      ) : (
        filteredSections.map((section) => (
          <div key={section.category}>
            <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2.5">
              <span className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                <section.icon className="text-indigo-600" size={16} />
              </span>
              {section.category}
              <span className="ml-0.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">
                {section.tools.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {section.tools.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

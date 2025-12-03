import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileJson, Regex, FileCode, Code2, ArrowRight, 
  Sparkles, Briefcase, MessageSquare, 
  Timer, CheckSquare, FileText, 
  BookOpen, Bot, Calendar, Share2, Globe, GitCompare, Image as ImageIcon
} from 'lucide-react';

const devTools = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Validate, format, and minify your JSON data instantly.',
    icon: FileJson,
    path: '/tools/json-formatter',
    color: 'bg-orange-500',
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions with real-time highlighting.',
    icon: Regex,
    path: '/tools/regex-tester',
    color: 'bg-purple-500',
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Editor',
    description: 'Write and preview Markdown content with a split-screen editor.',
    icon: FileCode,
    path: '/tools/markdown-editor',
    color: 'bg-blue-500',
  },
  {
    id: 'system-design',
    name: 'System Design Board',
    description: 'Sketch system architectures with drag-and-drop nodes.',
    icon: Share2,
    path: '/tools/system-design',
    color: 'bg-pink-500',
  },
  {
    id: 'api-client',
    name: 'API Client',
    description: 'Test HTTP requests and inspect responses directly in your browser.',
    icon: Globe,
    path: '/tools/api-client',
    color: 'bg-cyan-500',
  },
  {
    id: 'diff-checker',
    name: 'Diff Checker',
    description: 'Compare text or code to spot differences instantly.',
    icon: GitCompare,
    path: '/tools/diff-checker',
    color: 'bg-emerald-500',
  },
  {
    id: 'image-optimizer',
    name: 'Image Optimizer',
    description: 'Compress and convert images locally for better web performance.',
    icon: ImageIcon,
    path: '/tools/image-optimizer',
    color: 'bg-pink-500',
  },

];

const careerTools = [
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    description: 'Create ATS-friendly resumes with a drag-and-drop builder.',
    icon: FileText,
    path: '/resume-builder/dashboard',
    color: 'bg-indigo-600',
  },
  {
    id: 'cover-letter',
    name: 'AI Cover Letter',
    description: 'Generate tailored cover letters in seconds using Gemini AI.',
    icon: Sparkles,
    path: '/tools/cover-letter',
    color: 'bg-indigo-500',
  },
  {
    id: 'job-tracker',
    name: 'Job Tracker',
    description: 'Track your job applications with a visual Kanban board.',
    icon: Briefcase,
    path: '/tools/job-tracker',
    color: 'bg-blue-600',
  },
  {
    id: 'mock-interview',
    name: 'Mock Interview',
    description: 'Practice technical interviews with an AI-powered bot.',
    icon: MessageSquare,
    path: '/tools/mock-interview',
    color: 'bg-pink-500',
  },
];

const productivityTools = [
  {
    id: 'pomodoro',
    name: 'Pomodoro Timer',
    description: 'Boost focus with a customizable timer for work and breaks.',
    icon: Timer,
    path: '/tools/pomodoro',
    color: 'bg-red-500',
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    description: 'Organize your day with a categorized todo list and stats.',
    icon: CheckSquare,
    path: '/tools/task-manager',
    color: 'bg-indigo-600',
  },
  {
    id: 'note-taker',
    name: 'Note Taker',
    description: 'Capture ideas instantly with a markdown-supported note app.',
    icon: FileText,
    path: '/tools/note-taker',
    color: 'bg-amber-500',
  },
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    description: 'Build consistency with a daily habit tracking grid and streaks.',
    icon: Calendar,
    path: '/tools/habit-tracker',
    color: 'bg-emerald-500',
  },
];

const brandingTools = [
  {
    id: 'blog',
    name: 'Tech Blog',
    description: 'Read articles about web development, design, and career growth.',
    icon: BookOpen,
    path: '/tools/blog',
    color: 'bg-teal-500',
  },

  {
    id: 'ask-ai',
    name: 'Ask My AI',
    description: 'Chat with an AI assistant trained on my resume and skills.',
    icon: Bot,
    path: '/tools/ask-ai',
    color: 'bg-violet-600',
  },
];

export const PlatformHome: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Welcome to <span className="text-indigo-600">DevPlatform</span>
        </h1>
        <p className="text-lg text-slate-600">
          Your all-in-one workspace for development, career growth, and productivity.
        </p>
      </div>

      {/* Developer Tools Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Code2 className="text-indigo-600" size={24} />
          Developer Utilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {devTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 hover:border-indigo-200 flex flex-col"
            >
              <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4 text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <tool.icon size={24} />
              </div>
              
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {tool.name}
              </h3>
              
              <p className="text-sm text-slate-500 mb-4 flex-grow leading-relaxed">
                {tool.description}
              </p>
              
              <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                Open <ArrowRight size={14} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Career Suite Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Briefcase className="text-indigo-600" size={24} />
          Career Suite
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {careerTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 hover:border-indigo-200 flex flex-col"
            >
              <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4 text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <tool.icon size={24} />
              </div>
              
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {tool.name}
              </h3>
              
              <p className="text-sm text-slate-500 mb-4 flex-grow leading-relaxed">
                {tool.description}
              </p>
              
              <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                Open <ArrowRight size={14} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Productivity Tools Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Timer className="text-indigo-600" size={24} />
          Productivity Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productivityTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 hover:border-indigo-200 flex flex-col"
            >
              <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4 text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <tool.icon size={24} />
              </div>
              
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {tool.name}
              </h3>
              
              <p className="text-sm text-slate-500 mb-4 flex-grow leading-relaxed">
                {tool.description}
              </p>
              
              <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                Open <ArrowRight size={14} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Personal Branding Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Sparkles className="text-indigo-600" size={24} />
          Personal Branding
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandingTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 hover:border-indigo-200 flex flex-col"
            >
              <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4 text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <tool.icon size={24} />
              </div>
              
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {tool.name}
              </h3>
              
              <p className="text-sm text-slate-500 mb-4 flex-grow leading-relaxed">
                {tool.description}
              </p>
              
              <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                Open <ArrowRight size={14} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

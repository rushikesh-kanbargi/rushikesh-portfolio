import React, { lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SeoHead from '../components/SeoHead';

// Lazy load tools to prevent mega-bundle bloat
const JSONFormatter = lazy(() => import('../tools/JSONFormatter').then(m => ({ default: m.JSONFormatter })));
const RegexTester = lazy(() => import('../tools/RegexTester').then(m => ({ default: m.RegexTester })));
const MarkdownEditor = lazy(() => import('../tools/MarkdownEditor').then(m => ({ default: m.MarkdownEditor })));
const CodeSnippets = lazy(() => import('../tools/CodeSnippets').then(m => ({ default: m.CodeSnippets })));
const SystemDesignBoard = lazy(() => import('../developer/SystemDesignBoard').then(m => ({ default: m.SystemDesignBoard })));
const ApiClient = lazy(() => import('../developer/ApiClient').then(m => ({ default: m.ApiClient })));
const DiffChecker = lazy(() => import('../developer/DiffChecker').then(m => ({ default: m.DiffChecker })));
const ImageOptimizer = lazy(() => import('../tools/ImageOptimizer').then(m => ({ default: m.ImageOptimizer })));
const CoverLetterGenerator = lazy(() => import('../career/CoverLetterGenerator').then(m => ({ default: m.CoverLetterGenerator })));
const JobTracker = lazy(() => import('../career/JobTracker').then(m => ({ default: m.JobTracker })));
const MockInterview = lazy(() => import('../career/MockInterview').then(m => ({ default: m.MockInterview })));
const PomodoroTimer = lazy(() => import('../productivity/PomodoroTimer').then(m => ({ default: m.PomodoroTimer })));
const TaskManager = lazy(() => import('../productivity/TaskManager').then(m => ({ default: m.TaskManager })));
const NoteTaker = lazy(() => import('../productivity/NoteTaker').then(m => ({ default: m.NoteTaker })));
const HabitTracker = lazy(() => import('../productivity/HabitTracker').then(m => ({ default: m.HabitTracker })));
const Blog = lazy(() => import('../branding/TechBlog').then(m => ({ default: m.Blog })));
const AskMyAI = lazy(() => import('../branding/AskMyAI').then(m => ({ default: m.AskMyAI })));
const PlatformHome = lazy(() => import('./PlatformHome').then(m => ({ default: m.PlatformHome })));
const Dashboard = lazy(() => import('./Dashboard').then(m => ({ default: m.Dashboard })));

const BASE_URL = 'https://rushikesh-portfolio-delta.vercel.app';

const PERSON_REF = { '@id': `${BASE_URL}/#person` };

function toolSchema(name: string, slug: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    url: `${BASE_URL}/tools/${slug}`,
    description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: PERSON_REF,
  };
}

interface ToolMeta {
  title: string;
  description: string;
  path: string;
  schema?: object;
}

const toolsMeta: Record<string, ToolMeta> = {
  'json-formatter': {
    title: 'JSON Formatter & Validator',
    description: 'Free online JSON formatter, validator, and minifier. Beautify or minify JSON code instantly in your browser — no sign-up required.',
    path: '/tools/json-formatter',
    schema: toolSchema('JSON Formatter & Validator', 'json-formatter', 'Free online JSON formatter, validator, and minifier.'),
  },
  'regex-tester': {
    title: 'Regex Tester & Debugger',
    description: 'Free online regular expression tester. Write, test, and debug regex patterns with live match highlighting and group capture visualization.',
    path: '/tools/regex-tester',
    schema: toolSchema('Regex Tester & Debugger', 'regex-tester', 'Free online regex tester with live match highlighting.'),
  },
  'markdown-editor': {
    title: 'Markdown Editor with Live Preview',
    description: 'Free online Markdown editor with instant live preview. Write GitHub-flavored Markdown and see the rendered output side-by-side.',
    path: '/tools/markdown-editor',
    schema: toolSchema('Markdown Editor with Live Preview', 'markdown-editor', 'Free Markdown editor with live preview.'),
  },
  'code-snippets': {
    title: 'Code Snippets Manager',
    description: 'Free developer code snippets manager. Save, search, and organize reusable code snippets by language and tag.',
    path: '/tools/code-snippets',
    schema: toolSchema('Code Snippets Manager', 'code-snippets', 'Save and organize reusable code snippets.'),
  },
  'image-optimizer': {
    title: 'Image Optimizer & Converter',
    description: 'Free online image optimizer. Compress images and convert between PNG, JPEG, and WebP formats — right in your browser.',
    path: '/tools/image-optimizer',
    schema: toolSchema('Image Optimizer & Converter', 'image-optimizer', 'Compress and convert images in the browser.'),
  },
  'api-client': {
    title: 'REST API Client',
    description: 'Free online REST API client. Send HTTP requests, inspect responses, and test API endpoints — like Postman, right in your browser.',
    path: '/tools/api-client',
    schema: toolSchema('REST API Client', 'api-client', 'Browser-based REST API client for testing HTTP endpoints.'),
  },
  'diff-checker': {
    title: 'Code Diff Checker',
    description: 'Free online diff checker. Compare two blocks of text or code side-by-side and see additions, deletions, and changes highlighted.',
    path: '/tools/diff-checker',
    schema: toolSchema('Code Diff Checker', 'diff-checker', 'Compare two code blocks and see differences.'),
  },
  'system-design': {
    title: 'System Design Whiteboard',
    description: 'Free online system design whiteboard for developers and architects. Sketch distributed systems, microservices, and infrastructure diagrams.',
    path: '/tools/system-design',
    schema: toolSchema('System Design Whiteboard', 'system-design', 'Sketch system architecture and infrastructure diagrams.'),
  },
  'cover-letter': {
    title: 'AI Cover Letter Generator',
    description: 'Free AI-powered cover letter generator. Create tailored, professional cover letters for any job application in seconds.',
    path: '/tools/cover-letter',
    schema: toolSchema('AI Cover Letter Generator', 'cover-letter', 'Generate tailored cover letters with AI.'),
  },
  'job-tracker': {
    title: 'Job Application Tracker',
    description: 'Free job application tracker for developers. Organize applications, track status, and never lose sight of your job search pipeline.',
    path: '/tools/job-tracker',
    schema: toolSchema('Job Application Tracker', 'job-tracker', 'Track and organize your job applications.'),
  },
  'mock-interview': {
    title: 'Mock Interview Practice',
    description: 'Free mock interview practice tool for software engineers. Prepare for technical, behavioral, and system design interviews.',
    path: '/tools/mock-interview',
    schema: toolSchema('Mock Interview Practice', 'mock-interview', 'Practice technical and behavioral interview questions.'),
  },
  'pomodoro': {
    title: 'Pomodoro Timer for Developers',
    description: 'Free Pomodoro timer designed for developers. Boost focus with 25-minute deep work sessions and short breaks.',
    path: '/tools/pomodoro',
    schema: toolSchema('Pomodoro Timer', 'pomodoro', 'Pomodoro focus timer for deep work sessions.'),
  },
  'task-manager': {
    title: 'Developer Task Manager',
    description: 'Free minimal task manager for developers. Capture, prioritize, and track tasks without leaving your workflow.',
    path: '/tools/task-manager',
    schema: toolSchema('Developer Task Manager', 'task-manager', 'Minimal todo and task manager for developers.'),
  },
  'note-taker': {
    title: 'Markdown Note Taker',
    description: 'Free Markdown note-taking app for developers. Capture ideas, documentation, and notes with full Markdown formatting support.',
    path: '/tools/note-taker',
    schema: toolSchema('Markdown Note Taker', 'note-taker', 'Markdown-powered note taker for developers.'),
  },
  'habit-tracker': {
    title: 'Developer Habit Tracker',
    description: 'Free habit tracker for developers and engineers. Build consistent daily habits around coding, learning, and health.',
    path: '/tools/habit-tracker',
    schema: toolSchema('Developer Habit Tracker', 'habit-tracker', 'Track daily coding and learning habits.'),
  },
  'blog': {
    title: 'Tech Blog',
    description: 'Technical articles on React, TypeScript, OAuth 2.0, cybersecurity tooling, and full-stack development by Rushikesh Kanbargi.',
    path: '/tools/blog',
  },
  'ask-ai': {
    title: 'Ask My AI — Gemini-Powered Assistant',
    description: 'Ask anything about software engineering, React, TypeScript, or OAuth 2.0. Powered by Google Gemini AI.',
    path: '/tools/ask-ai',
  },
  'catalog': {
    title: 'Developer Tools Suite — All Tools',
    description: 'Free developer tools suite by Rushikesh Kanbargi. JSON formatter, regex tester, API client, resume builder, and 15+ more tools.',
    path: '/tools/catalog',
  },
  '': {
    title: 'Developer Tools Dashboard',
    description: 'A suite of free developer tools — JSON formatter, regex tester, API client, resume builder, and more. Built by Rushikesh Kanbargi.',
    path: '/tools',
  },
};

function ToolWithMeta({ slug, children }: { slug: string; children: React.ReactNode }) {
  const meta = toolsMeta[slug] ?? toolsMeta[''];
  return (
    <>
      <SeoHead
        title={meta.title}
        description={meta.description}
        path={meta.path}
        schema={meta.schema}
      />
      {children}
    </>
  );
}

export const ToolsPage: React.FC = () => {
  const location = useLocation();
  // For unknown sub-routes, extract slug from path
  const slug = location.pathname.replace(/^\/tools\/?/, '').split('/')[0] ?? '';

  return (
    <>
      {/* Fallback meta for any unmatched tool routes */}
      {!toolsMeta[slug] && (
        <SeoHead
          title="Developer Tools"
          description="Free developer tools suite by Rushikesh Kanbargi."
          path={location.pathname}
        />
      )}
      <Routes>
        <Route index element={<ToolWithMeta slug=""><Dashboard /></ToolWithMeta>} />
        <Route path="catalog" element={<ToolWithMeta slug="catalog"><PlatformHome /></ToolWithMeta>} />
        <Route path="json-formatter" element={<ToolWithMeta slug="json-formatter"><JSONFormatter /></ToolWithMeta>} />
        <Route path="regex-tester" element={<ToolWithMeta slug="regex-tester"><RegexTester /></ToolWithMeta>} />
        <Route path="markdown-editor" element={<ToolWithMeta slug="markdown-editor"><MarkdownEditor /></ToolWithMeta>} />
        <Route path="code-snippets" element={<ToolWithMeta slug="code-snippets"><CodeSnippets /></ToolWithMeta>} />
        <Route path="system-design" element={<ToolWithMeta slug="system-design"><SystemDesignBoard /></ToolWithMeta>} />
        <Route path="api-client" element={<ToolWithMeta slug="api-client"><ApiClient /></ToolWithMeta>} />
        <Route path="diff-checker" element={<ToolWithMeta slug="diff-checker"><DiffChecker /></ToolWithMeta>} />
        <Route path="image-optimizer" element={<ToolWithMeta slug="image-optimizer"><ImageOptimizer /></ToolWithMeta>} />
        <Route path="cover-letter" element={<ToolWithMeta slug="cover-letter"><CoverLetterGenerator /></ToolWithMeta>} />
        <Route path="job-tracker" element={<ToolWithMeta slug="job-tracker"><JobTracker /></ToolWithMeta>} />
        <Route path="mock-interview" element={<ToolWithMeta slug="mock-interview"><MockInterview /></ToolWithMeta>} />
        <Route path="pomodoro" element={<ToolWithMeta slug="pomodoro"><PomodoroTimer /></ToolWithMeta>} />
        <Route path="task-manager" element={<ToolWithMeta slug="task-manager"><TaskManager /></ToolWithMeta>} />
        <Route path="note-taker" element={<ToolWithMeta slug="note-taker"><NoteTaker /></ToolWithMeta>} />
        <Route path="habit-tracker" element={<ToolWithMeta slug="habit-tracker"><HabitTracker /></ToolWithMeta>} />
        <Route path="blog" element={<ToolWithMeta slug="blog"><Blog /></ToolWithMeta>} />
        <Route path="ask-ai" element={<ToolWithMeta slug="ask-ai"><AskMyAI /></ToolWithMeta>} />
      </Routes>
    </>
  );
};

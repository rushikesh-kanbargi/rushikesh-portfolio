import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { JSONFormatter } from '../tools/JSONFormatter';
import { RegexTester } from '../tools/RegexTester';
import { MarkdownEditor } from '../tools/MarkdownEditor';
import { CodeSnippets } from '../tools/CodeSnippets';
import { SystemDesignBoard } from '../developer/SystemDesignBoard';
import { ApiClient } from '../developer/ApiClient';
import { DiffChecker } from '../developer/DiffChecker';
import { ImageOptimizer } from '../tools/ImageOptimizer';
import { CoverLetterGenerator } from '../career/CoverLetterGenerator';
import { JobTracker } from '../career/JobTracker';
import { MockInterview } from '../career/MockInterview';
import { PomodoroTimer } from '../productivity/PomodoroTimer';
import { TaskManager } from '../productivity/TaskManager';
import { NoteTaker } from '../productivity/NoteTaker';
import { HabitTracker } from '../productivity/HabitTracker';
import { Blog } from '../branding/TechBlog';
import { AskMyAI } from '../branding/AskMyAI';
import { PlatformHome } from './PlatformHome';
import { Dashboard } from './Dashboard';

export const ToolsPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="catalog" element={<PlatformHome />} />
      <Route path="json-formatter" element={<JSONFormatter />} />
      <Route path="regex-tester" element={<RegexTester />} />
      <Route path="markdown-editor" element={<MarkdownEditor />} />
      <Route path="code-snippets" element={<CodeSnippets />} />
      <Route path="system-design" element={<SystemDesignBoard />} />
      <Route path="api-client" element={<ApiClient />} />
      <Route path="diff-checker" element={<DiffChecker />} />
      <Route path="image-optimizer" element={<ImageOptimizer />} />
      
      <Route path="cover-letter" element={<CoverLetterGenerator />} />
      <Route path="job-tracker" element={<JobTracker />} />
      <Route path="mock-interview" element={<MockInterview />} />

      <Route path="pomodoro" element={<PomodoroTimer />} />
      <Route path="task-manager" element={<TaskManager />} />
      <Route path="note-taker" element={<NoteTaker />} />
      <Route path="habit-tracker" element={<HabitTracker />} />

      <Route path="blog" element={<Blog />} />
      <Route path="ask-ai" element={<AskMyAI />} />
    </Routes>
  );
};

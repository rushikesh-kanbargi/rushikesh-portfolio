import { Routes, Route } from 'react-router-dom';
import { JSONFormatter } from '../tools/JSONFormatter';
import { RegexTester } from '../tools/RegexTester';
import { MarkdownEditor } from '../tools/MarkdownEditor';
import { CodeSnippets } from '../tools/CodeSnippets';
import { CoverLetterGenerator } from '../career/CoverLetterGenerator';
import { JobTracker } from '../career/JobTracker';
import { MockInterview } from '../career/MockInterview';
import { PomodoroTimer } from '../productivity/PomodoroTimer';
import { TaskManager } from '../productivity/TaskManager';
import { NoteTaker } from '../productivity/NoteTaker';
import { Blog } from '../branding/Blog';
import { Timeline } from '../branding/Timeline';
import { AskMyAI } from '../branding/AskMyAI';
import { PlatformHome } from './PlatformHome';

export const ToolsPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<PlatformHome />} />
      <Route path="json-formatter" element={<JSONFormatter />} />
      <Route path="regex-tester" element={<RegexTester />} />
      <Route path="markdown-editor" element={<MarkdownEditor />} />
      <Route path="code-snippets" element={<CodeSnippets />} />
      
      <Route path="cover-letter" element={<CoverLetterGenerator />} />
      <Route path="job-tracker" element={<JobTracker />} />
      <Route path="mock-interview" element={<MockInterview />} />

      <Route path="pomodoro" element={<PomodoroTimer />} />
      <Route path="task-manager" element={<TaskManager />} />
      <Route path="note-taker" element={<NoteTaker />} />

      <Route path="blog" element={<Blog />} />
      <Route path="timeline" element={<Timeline />} />
      <Route path="ask-ai" element={<AskMyAI />} />
    </Routes>
  );
};

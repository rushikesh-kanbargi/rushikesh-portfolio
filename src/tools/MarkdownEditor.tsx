import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, FileCode, Copy, Check, Trash2, Download,
  Bold, Italic, Heading, List, Code, Link as LinkIcon, Quote,
  Columns, LayoutTemplate, MonitorPlay
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type ViewMode = 'split' | 'editor' | 'preview';

export const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState('# Hello Markdown\n\nStart writing your markdown here...');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    setMarkdown(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg text-white shadow-md">
                <FileCode size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Markdown Editor</h1>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* View Toggles */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 mr-2">
              <button
                onClick={() => setViewMode('editor')}
                className={`p-1.5 rounded ${viewMode === 'editor' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                title="Editor Only"
              >
                <LayoutTemplate size={18} />
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded ${viewMode === 'split' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                title="Split View"
              >
                <Columns size={18} />
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`p-1.5 rounded ${viewMode === 'preview' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                title="Preview Only"
              >
                <MonitorPlay size={18} />
              </button>
            </div>

            <button
              onClick={() => setMarkdown('')}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Clear"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                copied ? 'bg-green-100 text-green-700' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-slate-200 border-b-0 rounded-t-xl p-2 flex flex-wrap gap-1 shrink-0">
          <button onClick={() => insertFormatting('**', '**')} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Bold">
            <Bold size={18} />
          </button>
          <button onClick={() => insertFormatting('*', '*')} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Italic">
            <Italic size={18} />
          </button>
          <button onClick={() => insertFormatting('# ')} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Heading">
            <Heading size={18} />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1 self-center" />
          <button onClick={() => insertFormatting('- ')} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="List">
            <List size={18} />
          </button>
          <button onClick={() => insertFormatting('> ')} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Quote">
            <Quote size={18} />
          </button>
          <button onClick={() => insertFormatting('```\n', '\n```')} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Code Block">
            <Code size={18} />
          </button>
          <button onClick={() => insertFormatting('[', '](url)')} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Link">
            <LinkIcon size={18} />
          </button>
        </div>

        {/* Editor & Preview */}
        <div className="flex-1 flex min-h-0 bg-white rounded-b-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Editor */}
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div className={`flex flex-col ${viewMode === 'split' ? 'w-1/2 border-r border-slate-200' : 'w-full'}`}>
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-slate-50/50"
                placeholder="Type your markdown here..."
                spellCheck={false}
              />
            </div>
          )}

          {/* Preview */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className={`flex flex-col ${viewMode === 'split' ? 'w-1/2' : 'w-full'} bg-white`}>
              <div className="flex-1 p-8 overflow-auto prose prose-slate max-w-none">
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

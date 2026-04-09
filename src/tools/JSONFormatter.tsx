import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Trash2, FileJson, AlertCircle, Upload, Download, Braces, ListTree, Info } from 'lucide-react';
import { JsonTree } from './components/JsonTree';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';

function parseJsonError(err: Error, input: string): { message: string; line?: number; col?: number } {
  const raw = err.message;
  // Try to extract position from error message
  const posMatch = raw.match(/position (\d+)/i) || raw.match(/at (\d+)/);
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10);
    const before = input.slice(0, pos);
    const lines = before.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    return { message: raw, line, col };
  }
  return { message: raw };
}

export const JSONFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [error, setError] = useState<{ message: string; line?: number; col?: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'code' | 'tree'>('code');
  const [charCount, setCharCount] = useState({ input: 0, output: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCharCount((prev) => ({ ...prev, input: input.length }));
  }, [input]);

  useEffect(() => {
    setCharCount((prev) => ({ ...prev, output: output.length }));
  }, [output]);

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setParsedData(null);
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError(parseJsonError(err as Error, input));
      setParsedData(null);
      setOutput('');
    }
  }, [input]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setParsedData(null);
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err) {
      setError(parseJsonError(err as Error, input));
      setParsedData(null);
      setOutput('');
    }
  }, [input]);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setParsedData(null);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setInput(text);
      try {
        const parsed = JSON.parse(text);
        setParsedData(parsed);
        setOutput(JSON.stringify(parsed, null, 2));
        setError(null);
      } catch (err) {
        setError(parseJsonError(err as Error, text));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcut: Ctrl/Cmd+Enter to format
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleFormat();
    }
  };

  return (
    <div className="flex flex-col h-full gap-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg text-white shadow-sm">
              <FileJson size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">JSON Formatter</h1>
              <p className="text-xs text-slate-400">Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono">Ctrl+Enter</kbd> to format</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,.txt"
            className="hidden"
          />
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()} icon={Upload}>
            <span className="hidden sm:inline">Upload</span>
          </Button>
          <Button onClick={handleDownload} disabled={!output} icon={Download}>
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: 520 }}>
        {/* Input */}
        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 text-sm">Input JSON</span>
              {charCount.input > 0 && (
                <span className="text-[10px] text-slate-400 font-mono">{charCount.input.toLocaleString()} chars</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50"
              title="Clear"
            >
              <Trash2 size={15} />
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={'Paste your JSON here...\n\nTip: Press Ctrl+Enter to format'}
            className="border-0 rounded-none focus:ring-0 bg-white flex-1 font-mono text-sm resize-none"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0 gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-slate-200 p-0.5 rounded-lg">
              <Button
                variant={viewMode === 'code' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('code')}
                className={`text-xs gap-1.5 ${viewMode === 'code' ? 'text-indigo-600 shadow-sm' : 'text-slate-500'}`}
              >
                <Braces size={13} />
                Code
              </Button>
              <Button
                variant={viewMode === 'tree' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('tree')}
                disabled={!parsedData}
                className={`text-xs gap-1.5 ${viewMode === 'tree' ? 'text-indigo-600 shadow-sm' : 'text-slate-500'}`}
              >
                <ListTree size={13} />
                Tree
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button onClick={handleFormat} size="sm" className="text-xs">
                Format
              </Button>
              <Button onClick={handleMinify} variant="secondary" size="sm" className="text-xs">
                Minify
              </Button>
              <div className="w-px h-6 bg-slate-200 mx-0.5" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!output}
                className={copied ? 'text-emerald-600 bg-emerald-50' : ''}
                title="Copy output"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </Button>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            {error ? (
              <div className="absolute inset-0 overflow-auto">
                <div className="p-4">
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-700 text-sm mb-1">Invalid JSON</p>
                      {(error.line || error.col) && (
                        <p className="text-xs text-red-500 font-mono mb-2 bg-red-100 inline-flex items-center gap-1 px-2 py-0.5 rounded">
                          <Info size={11} />
                          Line {error.line}, Column {error.col}
                        </p>
                      )}
                      <p className="text-sm text-red-600 font-mono leading-relaxed break-all">{error.message}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                    <Info size={11} />
                    Common fixes: check for trailing commas, unquoted keys, or mismatched brackets.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {viewMode === 'code' ? (
                  <Textarea
                    readOnly
                    value={output}
                    placeholder="Formatted result will appear here..."
                    className="border-0 rounded-none focus:ring-0 bg-slate-50 font-mono text-sm h-full resize-none"
                    spellCheck={false}
                  />
                ) : (
                  <div className="w-full h-full p-4 overflow-auto bg-slate-50">
                    {parsedData ? (
                      <JsonTree data={parsedData} />
                    ) : (
                      <p className="text-slate-400 text-sm italic">Parse valid JSON to see tree view</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Status bar */}
          {output && !error && (
            <div className="px-4 py-1.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">{charCount.output.toLocaleString()} chars</span>
              {copied && <span className="text-[10px] text-emerald-600 font-semibold">Copied!</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

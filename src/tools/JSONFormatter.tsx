import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Trash2, FileJson, AlertCircle, Upload, Download, Braces, ListTree } from 'lucide-react';
import { JsonTree } from './components/JsonTree';

export const JSONFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'code' | 'tree'>('code');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormat = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setParsedData(null);
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setParsedData(null);
      setOutput('');
    }
  };

  const handleMinify = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setParsedData(null);
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setParsedData(null);
      setOutput('');
    }
  };

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
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setInput(text);
      // Auto-format on upload
      try {
        const parsed = JSON.parse(text);
        setParsedData(parsed);
        setOutput(JSON.stringify(parsed, null, 2));
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    reader.readAsText(file);
    // Reset input
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

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg text-white shadow-md">
                <FileJson size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">JSON Formatter</h1>
            </div>
          </div>

          <div className="flex gap-2">
             <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload} 
              accept=".json" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              <Upload size={18} />
              <span className="hidden sm:inline">Upload</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={!output}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
          {/* Input Section */}
          <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <span className="font-medium text-slate-700">Input JSON</span>
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Clear"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
              className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              spellCheck={false}
            />
          </div>

          {/* Output Section */}
          <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2 bg-slate-200/50 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('code')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    viewMode === 'code' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Braces size={14} />
                    Code
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('tree')}
                  disabled={!parsedData}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    viewMode === 'tree' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  } disabled:opacity-50`}
                >
                  <div className="flex items-center gap-1">
                    <ListTree size={14} />
                    Tree
                  </div>
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleFormat}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
                >
                  Format
                </button>
                <button
                  onClick={handleMinify}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded transition-colors"
                >
                  Minify
                </button>
                <div className="w-px h-8 bg-slate-300 mx-1"></div>
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className={`p-1.5 rounded transition-colors ${
                    copied ? 'text-green-600 bg-green-50' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title="Copy Output"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex-1 relative overflow-hidden">
              {error ? (
                <div className="absolute inset-0 p-4 bg-red-50 text-red-600 font-mono text-sm overflow-auto">
                  <div className="flex items-center gap-2 mb-2 font-bold">
                    <AlertCircle size={18} />
                    Invalid JSON
                  </div>
                  {error}
                </div>
              ) : (
                <>
                  {viewMode === 'code' ? (
                    <textarea
                      readOnly
                      value={output}
                      placeholder="Result will appear here..."
                      className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-slate-50 text-slate-800"
                      spellCheck={false}
                    />
                  ) : (
                    <div className="w-full h-full p-4 overflow-auto bg-slate-50">
                      {parsedData ? (
                        <JsonTree data={parsedData} />
                      ) : (
                        <div className="text-slate-400 text-sm italic">Parse valid JSON to see tree view</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Trash2, FileJson, AlertCircle, Upload, Download, Braces, ListTree } from 'lucide-react';
import { JsonTree } from './components/JsonTree';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';

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
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              icon={Upload}
            >
              <span className="hidden sm:inline">Upload</span>
            </Button>
            <Button
              onClick={handleDownload}
              disabled={!output}
              icon={Download}
            >
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
          {/* Input Section */}
          <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <span className="font-medium text-slate-700">Input JSON</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                  title="Clear"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
              className="border-0 rounded-none focus:ring-0 bg-white"
              spellCheck={false}
            />
          </div>

          {/* Output Section */}
          <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2 bg-slate-200/50 p-1 rounded-lg">
                <Button
                  variant={viewMode === 'code' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('code')}
                  className={viewMode === 'code' ? 'text-indigo-600 shadow-sm' : 'text-slate-600'}
                >
                  <Braces size={14} />
                  Code
                </Button>
                <Button
                  variant={viewMode === 'tree' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('tree')}
                  disabled={!parsedData}
                  className={viewMode === 'tree' ? 'text-indigo-600 shadow-sm' : 'text-slate-600'}
                >
                  <ListTree size={14} />
                  Tree
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleFormat} size="sm">
                  Format
                </Button>
                <Button onClick={handleMinify} variant="secondary" size="sm">
                  Minify
                </Button>
                <div className="w-px h-8 bg-slate-300 mx-1"></div>
                <Button
                  variant={copied ? 'ghost' : 'ghost'}
                  size="sm"
                  onClick={handleCopy}
                  disabled={!output}
                  className={copied ? 'text-green-600 bg-green-50' : ''}
                  title="Copy Output"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </Button>
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
                    <Textarea
                      readOnly
                      value={output}
                      placeholder="Result will appear here..."
                      className="border-0 rounded-none focus:ring-0 bg-slate-50 font-mono"
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

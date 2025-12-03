import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GitCompare, Split, Columns, RotateCcw } from 'lucide-react';
import * as Diff from 'diff';

export const DiffChecker: React.FC = () => {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [diffResult, setDiffResult] = useState<Diff.Change[]>([]);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  useEffect(() => {
    const diff = Diff.diffLines(original, modified);
    setDiffResult(diff);
  }, [original, modified]);

  const handleClear = () => {
    setOriginal('');
    setModified('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md">
                <GitCompare size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Diff Checker</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg border border-slate-200 p-1 flex">
              <button
                onClick={() => setViewMode('split')}
                className={`p-2 rounded-md transition-colors flex items-center gap-2 text-sm font-medium ${
                  viewMode === 'split' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Columns size={16} />
                Split
              </button>
              <button
                onClick={() => setViewMode('unified')}
                className={`p-2 rounded-md transition-colors flex items-center gap-2 text-sm font-medium ${
                  viewMode === 'unified' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Split size={16} />
                Unified
              </button>
            </div>
            
            <button
              onClick={handleClear}
              className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              title="Clear All"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6 min-h-0">
          {/* Input Area */}
          <div className="grid grid-cols-2 gap-6 h-1/3 shrink-0">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">Original Text</label>
              <textarea
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                className="flex-1 p-4 bg-white border border-slate-200 rounded-xl resize-none outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                placeholder="Paste original text here..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">Modified Text</label>
              <textarea
                value={modified}
                onChange={(e) => setModified(e.target.value)}
                className="flex-1 p-4 bg-white border border-slate-200 rounded-xl resize-none outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                placeholder="Paste modified text here..."
              />
            </div>
          </div>

          {/* Diff Output */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Comparison Result</span>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1 text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Added
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Removed
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 font-mono text-sm">
              {viewMode === 'unified' ? (
                <div className="space-y-0.5">
                  {diffResult.map((part, index) => {
                    const color = part.added ? 'bg-green-100 text-green-800' : part.removed ? 'bg-red-100 text-red-800' : 'text-slate-600';
                    const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
                    return (
                      <div key={index} className={`${color} px-2 py-0.5 whitespace-pre-wrap break-all rounded-sm`}>
                        {part.value.split('\n').filter(line => line).map((line, i) => (
                          <div key={i}>{prefix}{line}</div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 h-full">
                  {/* Original Side */}
                  <div className="border-r border-slate-100 pr-4 overflow-auto">
                    {diffResult.map((part, index) => {
                      if (part.added) return null; // Skip additions in original view
                      const color = part.removed ? 'bg-red-100 text-red-800' : 'text-slate-600';
                      return (
                        <div key={index} className={`${color} px-2 py-0.5 whitespace-pre-wrap break-all rounded-sm`}>
                          {part.value}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Modified Side */}
                  <div className="pl-4 overflow-auto">
                    {diffResult.map((part, index) => {
                      if (part.removed) return null; // Skip removals in modified view
                      const color = part.added ? 'bg-green-100 text-green-800' : 'text-slate-600';
                      return (
                        <div key={index} className={`${color} px-2 py-0.5 whitespace-pre-wrap break-all rounded-sm`}>
                          {part.value}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {!original && !modified && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <GitCompare size={48} className="mb-4 opacity-20" />
                  <p>Enter text above to see the difference</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

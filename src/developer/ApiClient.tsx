import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Plus, Trash2, Clock, Globe, AlertCircle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface RequestHistory {
  id: string;
  method: string;
  url: string;
  timestamp: number;
  status?: number;
}

interface Header {
  key: string;
  value: string;
}

export const ApiClient: React.FC = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<Header[]>([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [history, setHistory] = useState<RequestHistory[]>(() => {
    const saved = localStorage.getItem('api_client_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');

  useEffect(() => {
    localStorage.setItem('api_client_history', JSON.stringify(history));
  }, [history]);

  const handleSend = async () => {
    if (!url) return;

    setIsLoading(true);
    setResponse(null);
    const startTime = Date.now();

    try {
      const requestHeaders: Record<string, string> = {};
      headers.forEach(h => {
        if (h.key && h.value) requestHeaders[h.key] = h.value;
      });

      const options: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        options.body = body;
        // Auto-add Content-Type if not present
        if (!requestHeaders['Content-Type']) {
          options.headers = { ...options.headers, 'Content-Type': 'application/json' };
        }
      }

      const res = await fetch(url, options);
      const data = await res.text();
      const endTime = Date.now();

      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch {
        parsedData = data;
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Array.from(res.headers.entries()),
        data: parsedData,
        time: endTime - startTime,
        size: new Blob([data]).size,
      });

      addToHistory(method, url, res.status);
    } catch (error: any) {
      setResponse({
        error: error.message || 'Network Error',
        status: 0,
      });
      addToHistory(method, url, 0);
    } finally {
      setIsLoading(false);
    }
  };

  const addToHistory = (method: string, url: string, status: number) => {
    setHistory(prev => {
      const newEntry = {
        id: crypto.randomUUID(),
        method,
        url,
        timestamp: Date.now(),
        status,
      };
      return [newEntry, ...prev].slice(0, 50); // Keep last 50
    });
  };

  const loadHistory = (item: RequestHistory) => {
    setMethod(item.method);
    setUrl(item.url);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 bg-green-50 border-green-200';
    if (status >= 300 && status < 400) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (status >= 400 && status < 500) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (status >= 500) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
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
                <Globe size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">API Client</h1>
            </div>
          </div>
        </div>

        <div className="flex gap-6 flex-1 min-h-0">
          {/* Main Request Area */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* URL Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter request URL"
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !url}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Send
                  </>
                )}
              </button>
            </div>

            {/* Request Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex border-b border-slate-200">
                {(['params', 'headers', 'body'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === tab
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-4 flex-1 overflow-y-auto">
                {activeTab === 'headers' && (
                  <div className="space-y-2">
                    {headers.map((header, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Key"
                          value={header.key}
                          onChange={(e) => updateHeader(index, 'key', e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={header.value}
                          onChange={(e) => updateHeader(index, 'value', e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => removeHeader(index)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addHeader}
                      className="mt-2 text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1"
                    >
                      <Plus size={16} /> Add Header
                    </button>
                  </div>
                )}

                {activeTab === 'body' && (
                  <div className="h-full flex flex-col">
                    <div className="text-xs text-slate-500 mb-2">JSON Body</div>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="flex-1 w-full p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                )}

                {activeTab === 'params' && (
                  <div className="text-center text-slate-500 py-8">
                    Query params editing coming soon. Add them directly to the URL for now.
                  </div>
                )}
              </div>
            </div>

            {/* Response Area */}
            {response && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(response.status)}`}>
                      {response.status} {response.statusText}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={14} /> {response.time}ms
                    </span>
                    <span className="text-xs text-slate-500">
                      {response.size} bytes
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden relative">
                  {response.error ? (
                    <div className="p-4 text-red-600 flex items-center gap-2">
                      <AlertCircle size={20} />
                      {response.error}
                    </div>
                  ) : (
                    <SyntaxHighlighter
                      language="json"
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, height: '100%', borderRadius: 0 }}
                    >
                      {typeof response.data === 'object' 
                        ? JSON.stringify(response.data, null, 2) 
                        : response.data}
                    </SyntaxHighlighter>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* History Sidebar */}
          <div className="w-64 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-slate-700">History</h2>
              <button 
                onClick={clearHistory}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadHistory(item)}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      item.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                      item.method === 'POST' ? 'bg-green-100 text-green-700' :
                      item.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {item.method}
                    </span>
                    <span className={`text-[10px] font-medium ${
                      item.status && item.status >= 200 && item.status < 300 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.status || 'ERR'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 truncate font-mono" title={item.url}>
                    {item.url}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </button>
              ))}
              {history.length === 0 && (
                <div className="text-center text-slate-400 py-8 text-sm">
                  No history yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code2, Search, Copy, Check, Tag, Plus, Trash2, Edit2, X, Save } from 'lucide-react';

interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
}

const DEFAULT_SNIPPETS: Snippet[] = [
  {
    id: '1',
    title: 'React UseOnClickOutside Hook',
    description: 'Custom hook to detect clicks outside of a specified element.',
    language: 'typescript',
    tags: ['react', 'hooks', 'typescript'],
    code: `import { useEffect, RefObject } from 'react';

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}`
  },
  {
    id: '2',
    title: 'Tailwind CSS Glassmorphism',
    description: 'Utility classes for creating a glassmorphism effect.',
    language: 'css',
    tags: ['css', 'tailwind', 'ui'],
    code: `.glass-panel {
  @apply bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl;
}

/* Usage */
<div className="glass-panel p-6 rounded-xl">
  Content
</div>`
  }
];

export const CodeSnippets: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    const saved = localStorage.getItem('code_snippets');
    return saved ? JSON.parse(saved) : DEFAULT_SNIPPETS;
  });
  
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Snippet>>({
    title: '',
    description: '',
    language: 'javascript',
    code: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    localStorage.setItem('code_snippets', JSON.stringify(snippets));
  }, [snippets]);

  const allTags = Array.from(new Set(snippets.flatMap(s => s.tags)));

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(search.toLowerCase()) || 
                          snippet.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? snippet.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      setSnippets(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setFormData(snippet);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingSnippet(null);
    setFormData({
      title: '',
      description: '',
      language: 'javascript',
      code: '',
      tags: []
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.code) return;

    if (editingSnippet) {
      setSnippets(prev => prev.map(s => s.id === editingSnippet.id ? { ...s, ...formData } as Snippet : s));
    } else {
      const newSnippet: Snippet = {
        id: crypto.randomUUID(),
        ...formData as Omit<Snippet, 'id'>,
        tags: formData.tags || []
      };
      setSnippets(prev => [newSnippet, ...prev]);
    }
    setIsModalOpen(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tagToRemove) }));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg text-white shadow-md">
                <Code2 size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Code Snippets</h1>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search snippets..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">New Snippet</span>
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedTag === null
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                selectedTag === tag
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Tag size={14} />
              {tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSnippets.map(snippet => (
            <div key={snippet.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              <div className="p-6 border-b border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{snippet.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-mono rounded uppercase">
                      {snippet.language}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(snippet)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(snippet.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-4">{snippet.description}</p>
                <div className="flex flex-wrap gap-2">
                  {snippet.tags.map(tag => (
                    <span key={tag} className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="relative flex-1 bg-slate-900 group/code">
                <div className="absolute right-4 top-4 opacity-0 group-hover/code:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopy(snippet.code, snippet.id)}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
                    title="Copy Code"
                  >
                    {copiedId === snippet.id ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                <pre className="p-6 overflow-x-auto text-sm font-mono text-slate-300">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        {filteredSnippets.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No snippets found matching your search.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">
                {editingSnippet ? 'Edit Snippet' : 'Create New Snippet'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g. React Hook"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Brief description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                  <select
                    value={formData.language}
                    onChange={e => setFormData(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                    <option value="json">JSON</option>
                    <option value="sql">SQL</option>
                    <option value="bash">Bash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addTag()}
                      className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Add tag..."
                    />
                    <button onClick={addTag} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-sm text-slate-600">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={14} /></button>
                    </span>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                <textarea
                  value={formData.code}
                  onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full h-64 p-4 font-mono text-sm bg-slate-900 text-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="// Paste your code here..."
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                <Save size={18} />
                Save Snippet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, FileText, Search, Edit3, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export const NoteTaker: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('note_taker_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    localStorage.setItem('note_taker_data', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      updatedAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setIsPreview(false);
  };

  const updateNote = (key: keyof Note, value: string) => {
    if (!activeNoteId) return;
    setNotes(prev => prev.map(n => 
      n.id === activeNoteId ? { ...n, [key]: value, updatedAt: Date.now() } : n
    ));
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(n => n.id !== id));
      if (activeNoteId === id) setActiveNoteId(null);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-lg text-white shadow-md">
                <FileText size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Note Taker</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex">
          {/* Sidebar */}
          <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
            <div className="p-4 border-b border-slate-200">
              <button
                onClick={createNote}
                className="w-full py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <Plus size={20} />
                New Note
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredNotes.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No notes found
                </div>
              ) : (
                filteredNotes.map(note => (
                  <div
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-colors group ${
                      activeNoteId === note.id ? 'bg-white border-l-4 border-l-amber-500 shadow-sm' : 'hover:bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-medium truncate pr-2 ${
                        activeNoteId === note.id ? 'text-slate-900' : 'text-slate-700'
                      }`}>
                        {note.title || 'Untitled Note'}
                      </h3>
                      <button
                        onClick={(e) => deleteNote(note.id, e)}
                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {note.content || 'No content'}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col bg-white">
            {activeNote ? (
              <>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => updateNote('title', e.target.value)}
                    placeholder="Note Title"
                    className="text-xl font-bold text-slate-900 bg-transparent border-none focus:ring-0 placeholder-slate-300 w-full mr-4"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsPreview(!isPreview)}
                      className={`p-2 rounded-lg transition-colors ${
                        isPreview ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:bg-slate-100'
                      }`}
                      title={isPreview ? 'Edit' : 'Preview'}
                    >
                      {isPreview ? <Edit3 size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden relative">
                  {isPreview ? (
                    <div className="absolute inset-0 p-8 overflow-y-auto prose prose-slate max-w-none">
                      <ReactMarkdown>{activeNote.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <textarea
                      value={activeNote.content}
                      onChange={(e) => updateNote('content', e.target.value)}
                      placeholder="Start writing..."
                      className="absolute inset-0 w-full h-full p-8 resize-none focus:outline-none text-slate-700 leading-relaxed"
                    />
                  )}
                </div>
                
                <div className="p-2 border-t border-slate-100 text-xs text-slate-400 text-right px-4">
                  {activeNote.content.length} characters
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                <FileText size={64} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a note or create a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

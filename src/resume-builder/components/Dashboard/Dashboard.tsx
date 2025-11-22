import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Copy, Trash2, FileText, Settings as SettingsIcon } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import type { ResumeMetadata } from '../../types';
import { ConfirmModal } from '../UI/ConfirmModal';

export const Dashboard: React.FC = () => {
  const { savedResumes, createNewResume, deleteResume, duplicateResume, loadResume } = useResume();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreateNew = () => {
    createNewResume();
    navigate('/resume-builder/editor');
  };

  const handleEdit = (id: string) => {
    loadResume(id);
    navigate('/resume-builder/editor');
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteResume(deleteId);
      setDeleteId(null);
    }
  };

  const handleDuplicate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    duplicateResume(id);
  };

  return (
    <div className="w-full bg-slate-50 pb-20">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/resume-builder')}>
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
              <FileText size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">ResumeX</h1>
          </div>
          <button 
            onClick={() => navigate('/resume-builder/settings')}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            title="Settings"
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">My Resumes</h2>
            <p className="text-slate-500">Manage and organize your professional documents.</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 transition-all duration-200"
          >
            <Plus size={20} />
            Create New Resume
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Card */}
          <div 
            onClick={handleCreateNew}
            className="group relative aspect-[3/4] bg-white rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center p-6"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-100 group-hover:scale-110 transition-all duration-300">
              <Plus size={32} className="text-slate-400 group-hover:text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Create New</h3>
            <p className="text-sm text-slate-500">Start from scratch</p>
          </div>

          {/* Resume Cards */}
          {savedResumes.map((resume: ResumeMetadata) => (
            <div 
              key={resume.id}
              onClick={() => handleEdit(resume.id)}
              className="group relative aspect-[3/4] bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Preview Area (Mock) */}
              <div className="absolute inset-0 bg-slate-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <div className="w-[80%] h-[80%] bg-white shadow-sm border border-slate-100 rounded-sm p-4 overflow-hidden opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-1/3 h-2 bg-slate-200 mb-4 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full"></div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full"></div>
                    <div className="w-2/3 h-1.5 bg-slate-100 rounded-full"></div>
                  </div>
                  <div className="mt-6 w-1/4 h-2 bg-slate-200 mb-3 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full"></div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-300" />

              {/* Card Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-slate-900 truncate pr-2">{resume.name}</h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleDuplicate(e, resume.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, resume.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Last updated: {new Date(resume.lastModified).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

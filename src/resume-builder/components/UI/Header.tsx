import React, { useState } from 'react';
import { FileText, RotateCcw, Download, PenTool, Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../../context/ResumeContext';
import { ConfirmModal } from './ConfirmModal';

interface HeaderProps {
  activeTab: 'content' | 'customize';
  setActiveTab: (tab: 'content' | 'customize') => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, showPreview, setShowPreview }) => {
  const { resetResume, loadSampleData } = useResume();
  const navigate = useNavigate();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  const confirmReset = () => {
    resetResume();
    setIsResetModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Dashboard Link */}
          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/resume-builder')}>
              <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                <FileText size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 hidden sm:block">
                ResumeX
              </h1>
            </div>
          </div>

          {/* Center Navigation (Tabs) - Hidden on Mobile if Preview is active */}
          <div className={`flex items-center p-1 bg-slate-100/80 rounded-lg border border-slate-200/50 ${showPreview ? 'hidden lg:flex' : 'flex'}`}>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'content'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <FileText size={16} />
              <span className="hidden sm:inline">Content</span>
            </button>
            <button
              onClick={() => setActiveTab('customize')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'customize'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <PenTool size={16} />
              <span className="hidden sm:inline">Customize</span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Preview Toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-all"
              aria-label={showPreview ? "Edit Mode" : "Preview Mode"}
            >
              {showPreview ? (
                <>
                  <Edit size={16} />
                  <span>Edit</span>
                </>
              ) : (
                <>
                  <Eye size={16} />
                  <span>Preview</span>
                </>
              )}
            </button>

            <button 
              onClick={loadSampleData}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
              title="Load Sample Data"
              aria-label="Load Sample Data"
            >
              <Download size={16} />
              <span className="hidden lg:inline">Sample</span>
            </button>

            <button 
              onClick={handleReset}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
              title="Reset Resume"
              aria-label="Reset Resume"
            >
              <RotateCcw size={16} />
              <span className="hidden lg:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={confirmReset}
        title="Reset Resume"
        message="Are you sure you want to reset all data? This cannot be undone."
        confirmText="Reset Everything"
        type="danger"
      />
    </>
  );
};

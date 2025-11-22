import React, { useState, useRef } from 'react';
import { FileText, Copy, Check, Download, Pen, Save } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface GeneratedOutputProps {
  generatedLetter: string;
  onUpdate: (text: string) => void;
}

export const GeneratedOutput: React.FC<GeneratedOutputProps> = ({ generatedLetter, onUpdate }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!contentRef.current) return;
    
    const element = contentRef.current;
    const opt = {
      margin: 1,
      filename: 'cover-letter.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    } as any;

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px] lg:h-auto">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          <FileText size={20} className="text-slate-500" />
          Generated Letter
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={!generatedLetter}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              isEditing ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            } disabled:opacity-50`}
          >
            {isEditing ? <Save size={16} /> : <Pen size={16} />}
            {isEditing ? 'Done' : 'Edit'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!generatedLetter}
            className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Download size={16} />
            PDF
          </button>
          <button
            onClick={handleCopy}
            disabled={!generatedLetter}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              copied ? 'bg-green-100 text-green-700' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            } disabled:opacity-50`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        {isEditing ? (
          <textarea
            value={generatedLetter}
            onChange={(e) => onUpdate(e.target.value)}
            className="w-full h-full p-6 resize-none focus:outline-none text-slate-800 leading-relaxed bg-transparent font-serif whitespace-pre-wrap"
            placeholder="Your generated cover letter will appear here..."
          />
        ) : (
          <div 
            ref={contentRef}
            className="w-full h-full p-8 overflow-y-auto text-slate-800 leading-relaxed font-serif whitespace-pre-wrap"
          >
            {generatedLetter || <span className="text-slate-400 font-sans">Your generated cover letter will appear here...</span>}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useResume } from '../../resume-builder/context/ResumeContext';
import { Pen, User } from 'lucide-react';

interface ManualCoverLetterBuilderProps {
  onUpdate: (text: string) => void;
}

export const ManualCoverLetterBuilder: React.FC<ManualCoverLetterBuilderProps> = ({ onUpdate }) => {
  const { resumeData } = useResume();
  
  const [formData, setFormData] = useState({
    senderName: resumeData.personalInfo.fullName || '',
    senderEmail: resumeData.personalInfo.email || '',
    senderPhone: resumeData.personalInfo.phone || '',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    recipientName: '',
    recipientTitle: 'Hiring Manager',
    companyName: '',
    companyAddress: '',
    salutation: 'Dear Hiring Manager,',
    opening: `I am writing to express my strong interest in the position at your company. With my background in ${resumeData.experience[0]?.position || 'software development'}, I am confident in my ability to contribute effectively to your team.`,
    body: 'I have been following your company\'s work and am impressed by your recent achievements. My experience aligns well with the requirements of this role, particularly my skills in...',
    closing: 'Thank you for considering my application. I look forward to the possibility of discussing how my skills and experience align with your needs.',
    signOff: 'Sincerely,'
  });

  useEffect(() => {
    const letter = `
${formData.senderName}
${formData.senderEmail} | ${formData.senderPhone}

${formData.date}

${formData.recipientName ? formData.recipientName + '\n' : ''}${formData.recipientTitle}
${formData.companyName}
${formData.companyAddress}

${formData.salutation}

${formData.opening}

${formData.body}

${formData.closing}

${formData.signOff}

${formData.senderName}
    `.trim();
    
    onUpdate(letter);
  }, [formData, onUpdate]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <Pen size={20} className="text-slate-500" />
        Manual Builder
      </h2>

      <div className="space-y-4">
        {/* Header Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Your Name</label>
            <input
              type="text"
              value={formData.senderName}
              onChange={e => handleChange('senderName', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
            <input
              type="text"
              value={formData.date}
              onChange={e => handleChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Recipient Info */}
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
            <User size={14} /> Recipient Details
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <input
              type="text"
              placeholder="Recipient Name (Optional)"
              value={formData.recipientName}
              onChange={e => handleChange('recipientName', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              placeholder="Title (e.g. Hiring Manager)"
              value={formData.recipientTitle}
              onChange={e => handleChange('recipientTitle', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={e => handleChange('companyName', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
             <input
              type="text"
              placeholder="Company Address (Optional)"
              value={formData.companyAddress}
              onChange={e => handleChange('companyAddress', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Content */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Salutation</label>
            <input
              type="text"
              value={formData.salutation}
              onChange={e => handleChange('salutation', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Opening Paragraph</label>
            <textarea
              value={formData.opening}
              onChange={e => handleChange('opening', e.target.value)}
              className="w-full h-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Body Paragraph(s)</label>
            <textarea
              value={formData.body}
              onChange={e => handleChange('body', e.target.value)}
              className="w-full h-32 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Closing Paragraph</label>
            <textarea
              value={formData.closing}
              onChange={e => handleChange('closing', e.target.value)}
              className="w-full h-20 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Sign-off</label>
              <input
                type="text"
                value={formData.signOff}
                onChange={e => handleChange('signOff', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

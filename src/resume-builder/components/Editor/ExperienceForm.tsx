import React from 'react';
import { useResume } from '../../context/ResumeContext';
import type { Experience } from '../../types';
import { Plus, Wand2, SpellCheck, Book, Briefcase } from 'lucide-react';
import { RichEditor } from '../UI/RichEditor';
import { ListItem } from '../UI/ListItem';
import { useAI } from '../../hooks/useAI';
import { ContentLibraryModal } from './ContentLibraryModal';

export const ExperienceForm: React.FC = () => {
  const { resumeData, updateSection } = useResume();
  const { experience } = resumeData;

  const addExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: '',
    };
    updateSection('experience', [newExperience, ...experience]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updatedExperience = [...experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    updateSection('experience', updatedExperience);
  };

  const deleteExperience = (index: number) => {
    const updatedExperience = experience.filter((_, i) => i !== index);
    updateSection('experience', updatedExperience);
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= experience.length) return;
    
    const updatedExperience = [...experience];
    [updatedExperience[index], updatedExperience[newIndex]] = [updatedExperience[newIndex], updatedExperience[index]];
    updateSection('experience', updatedExperience);
  };

  const { generate, improveGrammar, loading, error } = useAI();
  const [generatingIndex, setGeneratingIndex] = React.useState<number | null>(null);
  const [libraryModalOpen, setLibraryModalOpen] = React.useState<number | null>(null);

  const handleFixGrammar = async (index: number, text: string) => {
    if (!text || text === '<p><br></p>') return;
    
    setGeneratingIndex(index);
    const result = await improveGrammar(text);
    
    if (result) {
      updateExperience(index, 'description', result);
    }
    setGeneratingIndex(null);
  };

  const handleLibrarySelect = (text: string) => {
    if (libraryModalOpen === null) return;
    
    const htmlContent = `<ul><li>${text}</li></ul>`;
    const currentDesc = experience[libraryModalOpen].description || '';
    const newDesc = currentDesc ? `${currentDesc}${htmlContent}` : htmlContent;
    
    updateExperience(libraryModalOpen, 'description', newDesc);
  };

  const handleGenerateAI = async (index: number, position: string, company: string) => {
    if (!position) {
      alert('Please enter a Position Title first.');
      return;
    }
    
    setGeneratingIndex(index);
    const prompt = `Role: ${position}\nCompany: ${company}\n\nCreate 4-5 impactful bullet points for this role. Focus on achievements and metrics.`;
    
    const result = await generate(prompt);
    
    if (result) {
      const htmlContent = `<ul>${result.split('\n').map(line => `<li>${line.replace(/^•\s*/, '')}</li>`).join('')}</ul>`;
      const currentDesc = experience[index].description || '';
      const newDesc = currentDesc ? `${currentDesc}<br/>${htmlContent}` : htmlContent;
      
      updateExperience(index, 'description', newDesc);
    }
    setGeneratingIndex(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Work Experience</h2>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{experience.length} Items</span>
        </div>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={16} />
          <span>Add Position</span>
        </button>
      </div>

      <div className="space-y-4">
        {experience.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-colors group">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <Briefcase size={24} className="text-slate-400 group-hover:text-indigo-500" />
            </div>
            <h3 className="text-sm font-medium text-slate-900">No experience added yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-3">Add your professional work history.</p>
            <button
              onClick={addExperience}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              Add your first position
            </button>
          </div>
        ) : (
          experience.map((exp, index) => (
            <ListItem
              key={exp.id}
              title={exp.position || 'Untitled Position'}
              subtitle={exp.company ? `${exp.company} • ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}` : ''}
              onDelete={() => deleteExperience(index)}
              onMoveUp={index > 0 ? () => moveExperience(index, 'up') : undefined}
              onMoveDown={index < experience.length - 1 ? () => moveExperience(index, 'down') : undefined}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Position Title</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                    placeholder="MM/YYYY"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                      placeholder="MM/YYYY"
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-400"
                      disabled={exp.current}
                    />
                    <label className="flex items-center gap-2 text-sm whitespace-nowrap cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
                      />
                      <span className="text-slate-700">Current</span>
                    </label>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperience(index, 'location', e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFixGrammar(index, exp.description)}
                        disabled={loading || generatingIndex === index}
                        className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-2 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Fix grammar and improve clarity"
                      >
                        <SpellCheck size={12} className={loading && generatingIndex === index ? 'animate-spin' : ''} />
                        Fix Grammar
                      </button>
                      <button
                        onClick={() => setLibraryModalOpen(index)}
                        className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
                        title="Browse content library"
                      >
                        <Book size={12} />
                        Library
                      </button>
                      <button
                        onClick={() => handleGenerateAI(index, exp.position, exp.company)}
                        disabled={loading || generatingIndex === index}
                        className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Generate bullet points with AI"
                      >
                        <Wand2 size={12} className={loading && generatingIndex === index ? 'animate-spin' : ''} />
                        {loading && generatingIndex === index ? 'Generating...' : 'Generate AI'}
                      </button>
                    </div>
                  </div>
                  <RichEditor
                    value={exp.description}
                    onChange={(value) => updateExperience(index, 'description', value)}
                    placeholder="Describe your responsibilities and achievements..."
                  />
                  {error && generatingIndex === index && (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                  )}
                </div>
              </div>
            </ListItem>
          ))
        )}
      </div>
      
      <ContentLibraryModal
        isOpen={libraryModalOpen !== null}
        onClose={() => setLibraryModalOpen(null)}
        onSelect={handleLibrarySelect}
      />
    </div>
  );
};

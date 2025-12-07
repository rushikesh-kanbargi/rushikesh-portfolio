import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { type Language } from '../../types';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';

export const LanguagesForm: React.FC = () => {
  const { resumeData, updateSection } = useResume();
  const { languages } = resumeData;

  const addLanguage = () => {
    const newLanguage: Language = {
      id: crypto.randomUUID(),
      name: '',
      proficiency: 'Native',
    };
    updateSection('languages', [...languages, newLanguage]);
  };

  const removeLanguage = (id: string) => {
    updateSection('languages', languages.filter(l => l.id !== id));
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    updateSection('languages', languages.map(l => 
      l.id === id ? { ...l, [field]: value } : l
    ));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Languages</h2>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{languages.length} Items</span>
        </div>
        <Button onClick={addLanguage} icon={Plus} size="sm">
          Add Language
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {languages.map((lang) => (
          <div key={lang.id} className="relative p-4 bg-white border border-slate-200 rounded-lg shadow-sm group hover:border-indigo-300 transition-colors space-y-3">
            <button 
              onClick={() => removeLanguage(lang.id)}
              className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
            
            <Input
              value={lang.name}
              onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
              placeholder="Language (e.g. English)"
              className="font-medium"
            />
            
            <Select
              value={lang.proficiency}
              onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
              options={[
                { value: 'Native', label: 'Native' },
                { value: 'Fluent', label: 'Fluent' },
                { value: 'Advanced', label: 'Advanced' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Beginner', label: 'Beginner' },
              ]}
            />
          </div>
        ))}
      </div>

      {languages.length === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 text-sm">No languages added yet.</p>
          <Button variant="ghost" size="sm" onClick={addLanguage} className="mt-2">
            Add your first language
          </Button>
        </div>
      )}
    </div>
  );
};

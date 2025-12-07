import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { type Skill } from '../../types';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export const SkillsForm: React.FC = () => {
  const { resumeData, updateSection } = useResume();
  const { skills } = resumeData;

  const addSkill = () => {
    const newSkill: Skill = {
      id: crypto.randomUUID(),
      name: '',
      level: 3, // Default level
    };
    updateSection('skills', [...skills, newSkill]);
  };

  const removeSkill = (id: string) => {
    updateSection('skills', skills.filter(skill => skill.id !== id));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string | number) => {
    updateSection('skills', skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{skills.length} Items</span>
        </div>
        <Button onClick={addSkill} icon={Plus} size="sm">
          Add Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg shadow-sm group hover:border-indigo-300 transition-colors">
            <div className="flex-1">
              <Input
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                placeholder="Skill name"
                className="border-0 focus:ring-0 px-2 py-1 h-auto text-sm bg-transparent"
              />
            </div>
            <button 
              onClick={() => removeSkill(skill.id)}
              className="text-slate-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      
      {skills.length === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 text-sm">No skills added yet.</p>
          <Button variant="ghost" size="sm" onClick={addSkill} className="mt-2">
            Add your first skill
          </Button>
        </div>
      )}
    </div>
  );
};

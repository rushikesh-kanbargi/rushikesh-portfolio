import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { type Skill } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

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
    <div className="form-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Skills</h2>
        <button 
          onClick={addSkill}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {skills.map((skill) => (
          <div key={skill.id} style={{ 
            border: '1px solid var(--border-color)', 
            borderRadius: '0.5rem', 
            padding: '0.75rem',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
              placeholder="Skill name"
              style={{ flex: 1, minWidth: 0 }}
            />
            <button 
              onClick={() => removeSkill(skill.id)}
              style={{ color: '#ef4444', background: 'none', border: 'none', padding: '0.25rem' }}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

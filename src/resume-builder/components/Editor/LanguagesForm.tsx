import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { type Language } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

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
    <div className="form-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Languages</h2>
        <button 
          onClick={addLanguage}
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
        {languages.map((lang) => (
          <div key={lang.id} style={{ 
            border: '1px solid var(--border-color)', 
            borderRadius: '0.5rem', 
            padding: '0.75rem',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => removeLanguage(lang.id)}
                style={{ color: '#ef4444', background: 'none', border: 'none', padding: '0' }}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <input
              type="text"
              value={lang.name}
              onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
              placeholder="Language"
              style={{ width: '100%' }}
            />
            <select
              value={lang.proficiency}
              onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
            >
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Beginner">Beginner</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

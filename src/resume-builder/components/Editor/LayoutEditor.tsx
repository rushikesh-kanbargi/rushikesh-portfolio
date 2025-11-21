import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { ListItem } from '../UI/ListItem';

export const LayoutEditor: React.FC = () => {
  const { resumeData, setResumeData } = useResume();
  const { sectionsOrder, customSections } = resumeData;

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionsOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    
    setResumeData(prev => ({ ...prev, sectionsOrder: newOrder }));
  };

  const getSectionName = (id: string) => {
    // Check if it's a custom section
    const customSection = customSections.find(s => s.id === id);
    if (customSection) {
      return customSection.title;
    }

    // Standard sections mapping
    const nameMap: Record<string, string> = {
      'personal': 'Personal Info',
      'experience': 'Experience',
      'education': 'Education',
      'skills': 'Skills',
      'projects': 'Projects',
      'languages': 'Languages',
      'summary': 'Summary',
    };

    return nameMap[id] || id.charAt(0).toUpperCase() + id.slice(1);
  };

  return (
    <div className="form-section">
      <h2>Layout & Ordering</h2>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
        Reorder sections to change how they appear on your resume.
      </p>
      <div className="space-y-2">
        {sectionsOrder.map((sectionId, index) => (
          <ListItem
            key={sectionId}
            title={getSectionName(sectionId)}
            onMoveUp={index > 0 ? () => moveSection(index, 'up') : undefined}
            onMoveDown={index < sectionsOrder.length - 1 ? () => moveSection(index, 'down') : undefined}
          />
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { ModernTemplate } from '../../templates/ModernTemplate';
import { ProfessionalTemplate } from '../../templates/ProfessionalTemplate';

export const ResumePreview: React.FC = () => {
  const { resumeData } = useResume();
  const { meta } = resumeData;

  // Simple logic to switch templates based on columns for now
  // In a real app, we'd have a specific template selector
  if (meta.layout.columns === 2) {
    return <ProfessionalTemplate />;
  }

  return <ModernTemplate />;
};

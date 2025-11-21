import React from 'react';
import { useResume } from '../../context/ResumeContext';
import type { Education } from '../../types';
import { Plus } from 'lucide-react';
import { RichEditor } from '../UI/RichEditor';
import { ListItem } from '../UI/ListItem';

export const EducationForm: React.FC = () => {
  const { resumeData, updateSection } = useResume();
  const { education } = resumeData;

  const addEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: '',
    };
    updateSection('education', [newEducation, ...education]);
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updatedEducation = [...education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    updateSection('education', updatedEducation);
  };

  const deleteEducation = (index: number) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    updateSection('education', updatedEducation);
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= education.length) return;
    
    const updatedEducation = [...education];
    [updatedEducation[index], updatedEducation[newIndex]] = [updatedEducation[newIndex], updatedEducation[index]];
    updateSection('education', updatedEducation);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Education</h2>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Add Education</span>
        </button>
      </div>

      <div className="space-y-3">
        {education.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No education added yet.</p>
            <button
              onClick={addEducation}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first education
            </button>
          </div>
        ) : (
          education.map((edu, index) => (
            <ListItem
              key={edu.id}
              title={edu.institution || 'Untitled Institution'}
              subtitle={edu.degree ? `${edu.degree} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}` : ''}
              onDelete={() => deleteEducation(index)}
              onMoveUp={index > 0 ? () => moveEducation(index, 'up') : undefined}
              onMoveDown={index < education.length - 1 ? () => moveEducation(index, 'down') : undefined}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label>School / University</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    placeholder="School Name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    placeholder="e.g. Bachelor of Science"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Field of Study</label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => updateEducation(index, 'location', e.target.value)}
                    placeholder="e.g. Boston, MA"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                    placeholder="MM/YYYY"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                      placeholder="MM/YYYY"
                      className="form-input"
                      disabled={edu.current}
                    />
                    <label className="flex items-center gap-2 text-sm whitespace-nowrap cursor-pointer">
                      <input
                        type="checkbox"
                        checked={edu.current}
                        onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Current
                    </label>
                  </div>
                </div>
                <div className="form-group md:col-span-2">
                  <label>Description</label>
                  <RichEditor
                    value={edu.description}
                    onChange={(value) => updateEducation(index, 'description', value)}
                    placeholder="Additional details, honors, etc..."
                  />
                </div>
              </div>
            </ListItem>
          ))
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { useResume } from '../../context/ResumeContext';
import type { Project } from '../../types';
import { Plus } from 'lucide-react';
import { RichEditor } from '../UI/RichEditor';
import { ListItem } from '../UI/ListItem';

export const ProjectsForm: React.FC = () => {
  const { resumeData, updateSection } = useResume();
  const { projects } = resumeData;

  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: '',
      link: '',
    };
    updateSection('projects', [newProject, ...projects]);
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    updateSection('projects', updatedProjects);
  };

  const deleteProject = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    updateSection('projects', updatedProjects);
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= projects.length) return;
    
    const updatedProjects = [...projects];
    [updatedProjects[index], updatedProjects[newIndex]] = [updatedProjects[newIndex], updatedProjects[index]];
    updateSection('projects', updatedProjects);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Add Project</span>
        </button>
      </div>

      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No projects added yet.</p>
            <button
              onClick={addProject}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first project
            </button>
          </div>
        ) : (
          projects.map((project, index) => (
            <ListItem
              key={project.id}
              title={project.name || 'Untitled Project'}
              subtitle={project.technologies}
              onDelete={() => deleteProject(index)}
              onMoveUp={index > 0 ? () => moveProject(index, 'up') : undefined}
              onMoveDown={index < projects.length - 1 ? () => moveProject(index, 'down') : undefined}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(index, 'name', e.target.value)}
                    placeholder="e.g. E-commerce Platform"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Link (Optional)</label>
                  <input
                    type="text"
                    value={project.link}
                    onChange={(e) => updateProject(index, 'link', e.target.value)}
                    placeholder="https://..."
                    className="form-input"
                  />
                </div>
                <div className="form-group md:col-span-2">
                  <label>Technologies Used</label>
                  <input
                    type="text"
                    value={project.technologies}
                    onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                    placeholder="e.g. React, Node.js, MongoDB"
                    className="form-input"
                  />
                </div>
                <div className="form-group md:col-span-2">
                  <label>Description</label>
                  <RichEditor
                    value={project.description}
                    onChange={(value) => updateProject(index, 'description', value)}
                    placeholder="Describe the project and your role..."
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

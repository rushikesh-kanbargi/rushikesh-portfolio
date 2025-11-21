import React from 'react';
import { useResume } from '../../context/ResumeContext';
import type { CustomSectionItem } from '../../types';
import { Plus, Trash2 } from 'lucide-react';
import { RichEditor } from '../UI/RichEditor';
import { ListItem } from '../UI/ListItem';

interface CustomSectionFormProps {
  sectionId: string;
}

export const CustomSectionForm: React.FC<CustomSectionFormProps> = ({ sectionId }) => {
  const { resumeData, updateCustomSection, removeCustomSection } = useResume();
  const section = resumeData.customSections.find(s => s.id === sectionId);

  if (!section) return null;

  const addItem = () => {
    const newItem: CustomSectionItem = {
      id: crypto.randomUUID(),
      title: '',
      subtitle: '',
      description: '',
    };
    updateCustomSection(sectionId, { items: [newItem, ...section.items] });
  };

  const updateItem = (index: number, field: keyof CustomSectionItem, value: any) => {
    const updatedItems = [...section.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    updateCustomSection(sectionId, { items: updatedItems });
  };

  const deleteItem = (index: number) => {
    const updatedItems = section.items.filter((_, i) => i !== index);
    updateCustomSection(sectionId, { items: updatedItems });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= section.items.length) return;
    
    const updatedItems = [...section.items];
    [updatedItems[index], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[index]];
    updateCustomSection(sectionId, { items: updatedItems });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={section.title}
            onChange={(e) => updateCustomSection(sectionId, { title: e.target.value })}
            className="text-xl font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
          />
          <button
            onClick={() => removeCustomSection(sectionId)}
            className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
            title="Delete Section"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <button
          onClick={addItem}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Add Item</span>
        </button>
      </div>

      <div className="space-y-3">
        {section.items.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No items added yet.</p>
            <button
              onClick={addItem}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first item
            </button>
          </div>
        ) : (
          section.items.map((item, index) => (
            <ListItem
              key={item.id}
              title={item.title || 'Untitled Item'}
              subtitle={item.subtitle}
              onDelete={() => deleteItem(index)}
              onMoveUp={index > 0 ? () => moveItem(index, 'up') : undefined}
              onMoveDown={index < section.items.length - 1 ? () => moveItem(index, 'down') : undefined}
            >
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(index, 'title', e.target.value)}
                    placeholder="e.g. Volunteer Role"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Subtitle (Optional)</label>
                  <input
                    type="text"
                    value={item.subtitle}
                    onChange={(e) => updateItem(index, 'subtitle', e.target.value)}
                    placeholder="e.g. 2020 - 2021"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <RichEditor
                    value={item.description}
                    onChange={(value) => updateItem(index, 'description', value)}
                    placeholder="Details..."
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

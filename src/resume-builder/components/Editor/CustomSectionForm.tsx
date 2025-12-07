import React from 'react';
import { useResume } from '../../context/ResumeContext';
import type { CustomSectionItem } from '../../types';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
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
        <div className="flex items-center gap-3 flex-1 mr-4">
          <Input
            value={section.title}
            onChange={(e) => updateCustomSection(sectionId, { title: e.target.value })}
            className="text-xl font-semibold text-gray-800 !bg-transparent !border-0 !border-b !border-transparent hover:!border-gray-300 focus:!border-blue-500 !rounded-none !shadow-none !px-0"
            placeholder="Section Title"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeCustomSection(sectionId)}
            className="text-red-400 hover:text-red-600 hover:bg-red-50"
            title="Delete Section"
          >
            <Trash2 size={16} />
          </Button>
        </div>
        <Button
          onClick={addItem}
          icon={Plus}
          className="bg-blue-600 hover:bg-blue-700 shadow-sm"
        >
          Add Item
        </Button>
      </div>

      <div className="space-y-3">
        {section.items.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500 mb-2">No items added yet.</p>
            <Button
              variant="ghost"
              onClick={addItem}
              className="text-blue-600 hover:text-blue-700"
            >
              Add your first item
            </Button>
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
                  <Input
                    label="Title"
                    value={item.title}
                    onChange={(e) => updateItem(index, 'title', e.target.value)}
                    placeholder="e.g. Volunteer Role"
                  />
                </div>
                <div className="form-group">
                  <Input
                    label="Subtitle (Optional)"
                    value={item.subtitle}
                    onChange={(e) => updateItem(index, 'subtitle', e.target.value)}
                    placeholder="e.g. 2020 - 2021"
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

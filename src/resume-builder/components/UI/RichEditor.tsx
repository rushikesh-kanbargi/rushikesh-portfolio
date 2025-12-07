import { Textarea } from '../../../components/ui/Textarea';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichEditor: React.FC<RichEditorProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="rich-editor-container">
      <Textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] font-inherit text-[0.95rem]"
      />
    </div>
  );
};

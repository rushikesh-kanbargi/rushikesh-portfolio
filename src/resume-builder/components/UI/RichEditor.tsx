import React from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichEditor: React.FC<RichEditorProps> = ({ value, onChange, placeholder }) => {


  return (
    <div className="rich-editor-container">
      {/* <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      /> */}
      <textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input"
        style={{ minHeight: '120px', width: '100%', display: 'block', border: '1px solid #ccc', padding: '0.5rem' }}
      />
      <style>{`
        .rich-editor-container .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          font-family: inherit;
          font-size: 0.95rem;
        }
        .rich-editor-container .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background-color: #f9fafb;
        }
        .rich-editor-container .ql-editor {
          min-height: 120px;
        }
      `}</style>
    </div>
  );
};

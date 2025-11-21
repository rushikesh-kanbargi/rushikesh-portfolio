import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onToggle }) => {
  return (
    <div style={{ 
      border: '1px solid var(--border-color)', 
      borderRadius: '0.5rem', 
      marginBottom: '0.5rem', 
      backgroundColor: 'white',
      overflow: 'hidden',
      boxShadow: isOpen ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
      transition: 'box-shadow 0.2s'
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--text-color)',
          textAlign: 'left'
        }}
      >
        {title}
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      
      {isOpen && (
        <div style={{ 
          padding: '1rem', 
          borderTop: '1px solid var(--border-color)',
          backgroundColor: '#f9fafb' 
        }}>
          {children}
        </div>
      )}
    </div>
  );
};

export const Accordion: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="accordion">{children}</div>;
};

export { AccordionItem };

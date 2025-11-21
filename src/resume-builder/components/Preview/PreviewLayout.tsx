import React, { useState, useRef } from 'react';

interface PreviewLayoutProps {
  children: React.ReactNode;
}

export const PreviewLayout: React.FC<PreviewLayoutProps> = ({ children }) => {
  const [zoom, setZoom] = useState(0.8);
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#525659' }}>
      {/* Toolbar */}
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#323639', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 10
      }} className="no-print">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontWeight: 500 }}>Preview</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
            <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} style={{ color: 'white', cursor: 'pointer' }}>-</button>
            <span style={{ fontSize: '0.9em', minWidth: '3em', textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} style={{ color: 'white', cursor: 'pointer' }}>+</button>
          </div>
        </div>
        <button 
          onClick={() => handlePrint && handlePrint()}
          style={{ 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px', 
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.2s'
          }}
        >
          <span>Download PDF</span>
        </button>
      </div>

      {/* Scrollable Area */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '2rem',
        cursor: 'grab'
      }}>
        {/* Paper Sheet */}
        <div 
          className="print-content"
          style={{ 
            width: '210mm', 
            minHeight: '297mm', 
            backgroundColor: 'white', 
            boxShadow: '0 0 20px rgba(0,0,0,0.3)',
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <div ref={previewRef} style={{ height: '100%' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

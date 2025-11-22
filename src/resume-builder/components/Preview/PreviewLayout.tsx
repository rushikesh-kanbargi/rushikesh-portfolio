import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';

interface PreviewLayoutProps {
  children: React.ReactNode;
}

export const PreviewLayout: React.FC<PreviewLayoutProps> = ({ children }) => {
  const [zoom, setZoom] = useState(0.8);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Auto-scale on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const padding = 32; // 2rem padding
        const availableWidth = containerWidth - padding;
        const resumeWidth = 794; // 210mm in pixels at 96 DPI (approx)
        
        // On mobile, scale to fit width
        if (window.innerWidth < 1024) {
          const newZoom = Math.min(availableWidth / resumeWidth, 1);
          setZoom(newZoom);
        } else {
          // On desktop, default to 0.8 or fit if smaller
          setZoom(Math.min(0.8, availableWidth / resumeWidth));
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col bg-slate-700">
      {/* Toolbar */}
      <div className="p-2 sm:p-4 bg-slate-800 flex flex-wrap gap-3 justify-between items-center shadow-md z-10 no-print">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-white font-medium hidden sm:inline">Preview</span>
          <div className="flex items-center gap-1 sm:gap-2 bg-white/10 p-1 rounded-md">
            <button 
              onClick={() => setZoom(Math.max(0.3, zoom - 0.1))} 
              className="text-white hover:bg-white/10 p-1 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-white text-xs sm:text-sm min-w-[3em] text-center">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} 
              className="text-white hover:bg-white/10 p-1 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>
        <button 
          onClick={() => handlePrint && handlePrint()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium transition-colors text-sm sm:text-base"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>

      {/* Scrollable Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto flex justify-center p-4 sm:p-8 cursor-grab bg-slate-600/50"
      >
        {/* Paper Sheet */}
        <div 
          className="print-content bg-white shadow-2xl origin-top transition-transform duration-200 ease-out"
          style={{ 
            width: '210mm', 
            minHeight: '297mm', 
            transform: `scale(${zoom})`,
            marginBottom: `${(297 * zoom)}mm` // Add margin to bottom to allow scrolling past scaled content
          }}
        >
          <div ref={previewRef} className="h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { useResume } from '../../context/ResumeContext';

interface PreviewLayoutProps {
  children: React.ReactNode;
}

export const PreviewLayout: React.FC<PreviewLayoutProps> = ({ children }) => {
  const [zoom, setZoom] = useState(0.8);
  const [isDownloading, setIsDownloading] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const { resumeData } = useResume();
  
  // A4 dimensions
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  const A4_WIDTH_PX = 794; // 210mm at 96 DPI
  const A4_HEIGHT_PX = 1123; // 297mm at 96 DPI

  // Measure content height and update on changes
  useEffect(() => {
    const measureContent = () => {
      if (contentWrapperRef.current) {
        const height = contentWrapperRef.current.scrollHeight;
        setContentHeight(height);
      }
    };

    // Initial measurement
    measureContent();

    // Use ResizeObserver to watch for content changes
    const resizeObserver = new ResizeObserver(measureContent);
    if (contentWrapperRef.current) {
      resizeObserver.observe(contentWrapperRef.current);
    }

    // Also measure on window resize
    const handleResize = () => {
      measureContent();
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const padding = 32; // 2rem padding
        const availableWidth = containerWidth - padding;
        const resumeWidth = A4_WIDTH_PX;
        
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
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [children]);

  // Calculate number of pages needed
  const numPages = Math.ceil(contentHeight / A4_HEIGHT_PX) || 1;

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    
    setIsDownloading(true);
    try {
      const element = previewRef.current;
      const printContentElement = element.parentElement;
      
      if (!printContentElement) return;
      
      // Store original styles
      const originalTransform = printContentElement.style.transform;
      const originalMarginBottom = printContentElement.style.marginBottom;
      const originalMinHeight = element.style.minHeight;
      const originalWidth = printContentElement.style.width;
      const originalElementMargin = element.style.margin;
      const originalElementPadding = element.style.padding;
      const originalElementHeight = element.style.height;
      
      // Temporarily remove transform and set proper dimensions for PDF
      printContentElement.style.transform = 'none';
      printContentElement.style.marginBottom = '0';
      printContentElement.style.width = '210mm';
      element.style.minHeight = 'auto';
      element.style.height = 'auto';
      element.style.margin = '0';
      element.style.padding = '0';
      
      // Force a reflow
      void printContentElement.offsetHeight;
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const resumeName = resumeData.personalInfo?.fullName 
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '-')}-Resume`
        : 'Resume';
      
      // Use standard A4 dimensions
      const a4WidthPx = 794; // 210mm in pixels at 96 DPI
      
      // Use html2pdf with standard A4 format - it will automatically paginate
      const opt = {
        margin: [0, 0, 0, 0],
        filename: `${resumeName}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: a4WidthPx,
          height: element.scrollHeight,
          windowWidth: a4WidthPx,
          windowHeight: element.scrollHeight,
          scrollX: 0,
          scrollY: 0,
          allowTaint: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: [210, 297], // Explicit A4 dimensions - will paginate automatically
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          avoid: ['.no-break']
        },
        enableLinks: false
      };

      // @ts-ignore
      const worker = html2pdf().set(opt).from(element).save();
      await worker;
      
      // Restore original styles
      printContentElement.style.transform = originalTransform;
      printContentElement.style.marginBottom = originalMarginBottom;
      printContentElement.style.width = originalWidth;
      element.style.minHeight = originalMinHeight;
      element.style.height = originalElementHeight;
      element.style.margin = originalElementMargin;
      element.style.padding = originalElementPadding;
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
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
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium transition-colors text-sm sm:text-base"
        >
          <Download size={16} />
          <span className="hidden sm:inline">{isDownloading ? 'Generating...' : 'Download PDF'}</span>
          <span className="sm:hidden">{isDownloading ? '...' : 'PDF'}</span>
        </button>
      </div>

      {/* Scrollable Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto flex justify-center items-start p-4 sm:p-8 bg-slate-600/50"
      >
        {/* Pages Container */}
        <div 
          className="flex flex-col gap-4 origin-top transition-transform duration-200 ease-out relative"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Hidden content wrapper to measure actual height */}
          <div
            ref={contentWrapperRef}
            style={{
              position: 'absolute',
              visibility: 'hidden',
              width: `${A4_WIDTH_MM}mm`,
              top: '-9999px',
              left: 0,
              pointerEvents: 'none',
            }}
          >
            {children}
          </div>

          {/* Render each page with clipped content */}
          {Array.from({ length: numPages }).map((_, pageIndex) => {
            const pageStart = pageIndex * A4_HEIGHT_PX;
            
            return (
              <div
                key={pageIndex}
                className="print-content bg-white shadow-2xl"
                style={{
                  width: `${A4_WIDTH_MM}mm`,
                  height: `${A4_HEIGHT_MM}mm`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  ref={pageIndex === 0 ? previewRef : undefined}
                  style={{
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: `translateY(-${pageStart}px)`,
                  }}
                >
                  {children}
                </div>
                {/* Page number indicator */}
                {numPages > 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '12px',
                      fontSize: '10px',
                      color: '#999',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  >
                    Page {pageIndex + 1} of {numPages}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

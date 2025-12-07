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

  // Get Margins from meta (default to 20mm if missing)
  const margins = resumeData.meta?.spacing || {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20
  };

  // Convert mm to px (96 DPI -> 3.7795 px/mm)
  const pxPerMm = 3.7795;
  const marginTopPx = margins.marginTop * pxPerMm;
  const marginBottomPx = margins.marginBottom * pxPerMm;
  const marginLeftPx = margins.marginLeft * pxPerMm;
  const marginRightPx = margins.marginRight * pxPerMm;

  // Calculate content area dimensions
  const contentWidthPx = A4_WIDTH_PX - (marginLeftPx + marginRightPx);
  const contentHeightPerPagePx = A4_HEIGHT_PX - (marginTopPx + marginBottomPx);

  // Measure content height and update on changes
  useEffect(() => {
    const measureContent = () => {
      if (contentWrapperRef.current) {
        // We measure the scrollHeight of the wrapper which has constrained width
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
  }, [children, margins]); // Re-measure if margins change

  // Calculate number of pages needed
  // Note: contentHeight is the height of the narrower content column
  // We divide by the available height per page (A4 height - top/bottom margins)
  const numPages = Math.ceil(contentHeight / contentHeightPerPagePx) || 1;

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    
    setIsDownloading(true);
    try {
      // For PDF generation, we want to capture the FULL content as a single seamless strip
      // and let html2pdf handle the pagination and margins.
      // We grab the content from our hidden wrapper or the first page's content ref?
      // Actually, previewRef points to the first page's content div BUT that div is transformed.
      // Better to clone the contentWrapperRef content which is the full un-transformed list.
      
      const element = contentWrapperRef.current; // This has the full content
      if (!element) return;
      
      const resumeName = resumeData.personalInfo?.fullName 
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '-')}-Resume`
        : 'Resume';
      
      // Use html2pdf with user's margins
      const opt = {
        margin: [margins.marginTop, margins.marginLeft, margins.marginBottom, margins.marginRight] as [number, number, number, number],
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
          width: contentWidthPx, // Canvas width should match content width
          windowWidth: contentWidthPx,
          // height automatically calculated?
        },
        jsPDF: { 
          unit: 'mm', 
          format: [210, 297], 
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
          {/* Hidden content wrapper to measure actual height of content WITHOUT vertical margins */}
          <div
            ref={contentWrapperRef}
            style={{
              position: 'absolute',
              visibility: 'hidden',
              width: `${contentWidthPx}px`, // Constrain width based on L/R margins
              top: '-9999px',
              left: 0,
              pointerEvents: 'none',
            }}
          >
            {children}
          </div>

          {/* Render each page with clipped content */}
          {Array.from({ length: numPages }).map((_, pageIndex) => {
            // For Page N, we want to show content starting at offset N * contentHeightPerPage
            const contentStartOffset = pageIndex * contentHeightPerPagePx;
            
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
                {/* Safe Area Container: Defines the white space on the page where content lives */}
                <div
                  style={{
                    position: 'absolute',
                    top: `${marginTopPx}px`,
                    left: `${marginLeftPx}px`,
                    width: `${contentWidthPx}px`,
                    height: `${contentHeightPerPagePx}px`,
                    overflow: 'hidden',
                    // outline: '1px dashed #eee', // Debugging aid
                  }}
                >
                  <div
                    ref={pageIndex === 0 ? previewRef : undefined}
                    style={{
                      width: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      // Shift the content up to show the correct slice
                      transform: `translateY(-${contentStartOffset}px)`,
                    }}
                  >
                    {children}
                  </div>
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

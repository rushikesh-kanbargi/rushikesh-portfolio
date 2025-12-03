import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { type ResumeMeta } from '../../types';
import { COLOR_PALETTES, FONT_OPTIONS } from '../../data/designOptions';
import { Check } from 'lucide-react';

export const DesignEditor: React.FC = () => {
  const { resumeData, setResumeData } = useResume();
  const { meta } = resumeData;

  const updateMeta = (section: Exclude<keyof ResumeMeta, 'template'>, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        [section]: {
          ...prev.meta[section],
          [field]: value
        }
      }
    }));
  };

  const applyPalette = (palette: typeof COLOR_PALETTES[0]) => {
    setResumeData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        theme: {
          ...prev.meta.theme,
          ...palette.colors
        }
      }
    }));
  };

  return (
    <div className="form-section">
      <h2>Design Studio</h2>
      
      {/* Theme Section (Moved up for prominence) */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#6b7280', marginBottom: '1rem' }}>Color Theme</h3>
        
        {/* Color Palettes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Presets</label>
          <div className="grid grid-cols-3 gap-2">
            {COLOR_PALETTES.map((palette) => (
              <button
                key={palette.name}
                onClick={() => applyPalette(palette)}
                className="relative flex flex-col items-center gap-1 p-2 border rounded-lg hover:border-blue-500 transition-all"
                style={{
                  borderColor: meta.theme.primaryColor === palette.colors.primaryColor ? 'var(--primary-color)' : '#e5e7eb',
                  backgroundColor: meta.theme.primaryColor === palette.colors.primaryColor ? '#eff6ff' : 'white'
                }}
                title={palette.name}
              >
                <div className="flex gap-1">
                  <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: palette.colors.primaryColor }} />
                  <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: palette.colors.textColor }} />
                  <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: palette.colors.backgroundColor, border: '1px solid #eee' }} />
                </div>
                <span className="text-xs text-gray-600 truncate w-full text-center">{palette.name}</span>
                {meta.theme.primaryColor === palette.colors.primaryColor && (
                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                    <Check size={10} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Custom Accent Color</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="color"
              value={meta.theme.primaryColor}
              onChange={(e) => updateMeta('theme', 'primaryColor', e.target.value)}
              style={{ width: '50px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }}
            />
            <input
              type="text"
              value={meta.theme.primaryColor}
              onChange={(e) => updateMeta('theme', 'primaryColor', e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Typography Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#6b7280', marginBottom: '1rem' }}>Typography</h3>
        
        <div className="form-group">
          <label>Font Family</label>
          <select
            value={meta.typography.fontFamily}
            onChange={(e) => updateMeta('typography', 'fontFamily', e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Base Size</label>
            <input
              type="number"
              value={meta.typography.fontSize}
              onChange={(e) => updateMeta('typography', 'fontSize', parseInt(e.target.value))}
              min={10}
              max={18}
            />
          </div>
          <div className="form-group">
            <label>Line Height</label>
            <input
              type="number"
              value={meta.typography.lineHeight}
              onChange={(e) => updateMeta('typography', 'lineHeight', parseFloat(e.target.value))}
              min={1}
              max={2}
              step={0.1}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Name Size</label>
            <input
              type="number"
              value={meta.typography.nameSize}
              onChange={(e) => updateMeta('typography', 'nameSize', parseFloat(e.target.value))}
              min={1.5}
              max={4}
              step={0.1}
            />
          </div>
          <div className="form-group">
            <label>Heading Size</label>
            <input
              type="number"
              value={meta.typography.headingSize}
              onChange={(e) => updateMeta('typography', 'headingSize', parseFloat(e.target.value))}
              min={1}
              max={2}
              step={0.1}
            />
          </div>
        </div>
      </div>

      {/* Layout Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#6b7280', marginBottom: '1rem' }}>Layout</h3>
        
        <div className="form-group">
          <label>Columns</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => updateMeta('layout', 'columns', 1)}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: `1px solid ${meta.layout.columns === 1 ? 'var(--primary-color)' : 'var(--border-color)'}`,
                backgroundColor: meta.layout.columns === 1 ? '#eff6ff' : 'white',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Single
            </button>
            <button 
              onClick={() => updateMeta('layout', 'columns', 2)}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: `1px solid ${meta.layout.columns === 2 ? 'var(--primary-color)' : 'var(--border-color)'}`,
                backgroundColor: meta.layout.columns === 2 ? '#eff6ff' : 'white',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Double
            </button>
          </div>
        </div>

        {meta.layout.columns === 2 && (
          <div className="form-group">
            <label>Sidebar Position</label>
            <select
              value={meta.layout.sidebarPosition}
              onChange={(e) => updateMeta('layout', 'sidebarPosition', e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Header Layout</label>
          <select
            value={meta.layout.headerLayout}
            onChange={(e) => updateMeta('layout', 'headerLayout', e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
          >
            <option value="center">Center</option>
            <option value="left">Left Aligned</option>
            <option value="right">Right Aligned</option>
            <option value="photo-left">Photo Left</option>
            <option value="photo-right">Photo Right</option>
          </select>
        </div>
      </div>

      {/* Formatting Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#6b7280', marginBottom: '1rem' }}>Formatting</h3>
        
        <div className="form-group">
          <label>Date Format</label>
          <select
            value={meta.formatting.dateFormat}
            onChange={(e) => updateMeta('formatting', 'dateFormat', e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
          >
            <option value="MMM YYYY">Jan 2023</option>
            <option value="MM/YYYY">01/2023</option>
            <option value="YYYY">2023</option>
          </select>
        </div>

        <div className="form-group">
          <label>Skills Style</label>
          <select
            value={meta.formatting.skillsStyle}
            onChange={(e) => updateMeta('formatting', 'skillsStyle', e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
          >
            <option value="tags">Tags</option>
            <option value="bubbles">Bubbles</option>
            <option value="list">Comma List</option>
            <option value="bar">Progress Bar</option>
          </select>
        </div>
      </div>

      {/* Spacing Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#6b7280', marginBottom: '1rem' }}>Spacing</h3>
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">Page Margins (mm)</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Top</label>
              <input
                type="number"
                value={meta.spacing.marginTop}
                onChange={(e) => updateMeta('spacing', 'marginTop', parseInt(e.target.value))}
                min={0}
                max={50}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Bottom</label>
              <input
                type="number"
                value={meta.spacing.marginBottom}
                onChange={(e) => updateMeta('spacing', 'marginBottom', parseInt(e.target.value))}
                min={0}
                max={50}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Left</label>
              <input
                type="number"
                value={meta.spacing.marginLeft}
                onChange={(e) => updateMeta('spacing', 'marginLeft', parseInt(e.target.value))}
                min={0}
                max={50}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Right</label>
              <input
                type="number"
                value={meta.spacing.marginRight}
                onChange={(e) => updateMeta('spacing', 'marginRight', parseInt(e.target.value))}
                min={0}
                max={50}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Section Padding</label>
          <input
            type="range"
            value={meta.spacing.sectionPadding}
            onChange={(e) => updateMeta('spacing', 'sectionPadding', parseFloat(e.target.value))}
            min={0.5}
            max={3}
            step={0.1}
            style={{ width: '100%' }}
          />
        </div>

        <div className="form-group">
          <label>Item Spacing</label>
          <input
            type="range"
            value={meta.spacing.itemSpacing}
            onChange={(e) => updateMeta('spacing', 'itemSpacing', parseFloat(e.target.value))}
            min={0.5}
            max={2}
            step={0.1}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

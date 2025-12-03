import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { type ResumeMeta } from '../../types';
import { COLOR_PALETTES, FONT_OPTIONS } from '../../data/designOptions';
import { Check } from 'lucide-react';

interface RangeControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

const RangeControl: React.FC<RangeControlProps> = ({ label, value, onChange, min, max, step = 1, unit = '' }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <span className="text-xs text-gray-500">{value}{unit}</span>
    </div>
    <div className="flex items-center gap-3">
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-16 p-1 text-sm border rounded text-center"
      />
    </div>
  </div>
);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RangeControl
            label="Base Size"
            value={meta.typography.fontSize}
            onChange={(val) => updateMeta('typography', 'fontSize', val)}
            min={10}
            max={24}
            unit="px"
          />
          <RangeControl
            label="Line Height"
            value={meta.typography.lineHeight}
            onChange={(val) => updateMeta('typography', 'lineHeight', val)}
            min={1}
            max={2}
            step={0.1}
          />
          <RangeControl
            label="Name Size"
            value={meta.typography.nameSize}
            onChange={(val) => updateMeta('typography', 'nameSize', val)}
            min={1.5}
            max={5}
            step={0.1}
            unit="em"
          />
          <RangeControl
            label="Heading Size"
            value={meta.typography.headingSize}
            onChange={(val) => updateMeta('typography', 'headingSize', val)}
            min={1}
            max={3}
            step={0.1}
            unit="em"
          />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RangeControl
              label="Top"
              value={meta.spacing.marginTop}
              onChange={(val) => updateMeta('spacing', 'marginTop', val)}
              min={0}
              max={50}
              unit="mm"
            />
            <RangeControl
              label="Bottom"
              value={meta.spacing.marginBottom}
              onChange={(val) => updateMeta('spacing', 'marginBottom', val)}
              min={0}
              max={50}
              unit="mm"
            />
            <RangeControl
              label="Left"
              value={meta.spacing.marginLeft}
              onChange={(val) => updateMeta('spacing', 'marginLeft', val)}
              min={0}
              max={50}
              unit="mm"
            />
            <RangeControl
              label="Right"
              value={meta.spacing.marginRight}
              onChange={(val) => updateMeta('spacing', 'marginRight', val)}
              min={0}
              max={50}
              unit="mm"
            />
          </div>
        </div>

        <RangeControl
          label="Section Padding"
          value={meta.spacing.sectionPadding}
          onChange={(val) => updateMeta('spacing', 'sectionPadding', val)}
          min={0.5}
          max={4}
          step={0.1}
          unit="rem"
        />

        <RangeControl
          label="Item Spacing"
          value={meta.spacing.itemSpacing}
          onChange={(val) => updateMeta('spacing', 'itemSpacing', val)}
          min={0.5}
          max={3}
          step={0.1}
          unit="rem"
        />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, GripVertical } from 'lucide-react';

interface ListItemProps {
  title: string;
  subtitle?: string;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  onDelete,
  onMoveUp,
  onMoveDown,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white border border-slate-200 rounded-xl mb-3 overflow-hidden transition-all duration-200 hover:shadow-md ${className}`}>
      {/* Header / Summary View */}
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isOpen ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="text-slate-400 cursor-grab active:cursor-grabbing hover:text-slate-600 transition-colors">
            <GripVertical size={18} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-slate-900 truncate text-sm">
              {title || 'New Item'}
            </span>
            {subtitle && (
              <span className="text-xs text-slate-500 truncate mt-0.5">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(onMoveUp || onMoveDown) && (
            <div className="flex flex-col mr-2 gap-0.5">
              {onMoveUp && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
                  className="p-0.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                  title="Move Up"
                >
                  <ChevronUp size={14} />
                </button>
              )}
              {onMoveDown && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
                  className="p-0.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                  title="Move Down"
                >
                  <ChevronDown size={14} />
                </button>
              )}
            </div>
          )}
          
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
          
          {children && (
            <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronDown size={20} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content (Form) */}
      {isOpen && children && (
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

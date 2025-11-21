import React, { useState } from 'react';
import { X, Plus, Search, Book } from 'lucide-react';
import { CONTENT_LIBRARY } from '../../data/contentLibrary';

interface ContentLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (text: string) => void;
}

export const ContentLibraryModal: React.FC<ContentLibraryModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [selectedRole, setSelectedRole] = useState<keyof typeof CONTENT_LIBRARY>('Software Engineer');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const roles = Object.keys(CONTENT_LIBRARY) as Array<keyof typeof CONTENT_LIBRARY>;
  const bullets = CONTENT_LIBRARY[selectedRole];

  const filteredBullets = bullets.filter(bullet => 
    bullet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Book size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Content Library</h2>
              <p className="text-sm text-gray-500">Browse pre-written examples for inspiration</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Roles */}
          <div className="w-1/3 border-r border-gray-100 overflow-y-auto bg-gray-50 p-2">
            {roles.map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  selectedRole === role 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Main Content - Bullets */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search examples..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredBullets.length > 0 ? (
                filteredBullets.map((bullet, index) => (
                  <div 
                    key={index}
                    className="group p-3 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer"
                    onClick={() => onSelect(bullet)}
                  >
                    <p className="text-sm text-gray-700 mb-2">{bullet}</p>
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                        <Plus size={12} /> Add to Resume
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No examples found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

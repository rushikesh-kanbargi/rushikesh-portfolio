import React from 'react';

export const EditorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full lg:w-[50%] xl:w-[50%] h-[calc(100vh-64px)] overflow-y-auto bg-white border-r border-slate-200 shadow-sm z-10 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        {children}
      </div>
    </div>
  );
};

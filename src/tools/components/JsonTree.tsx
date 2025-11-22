import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Braces, Brackets } from 'lucide-react';

interface JsonTreeProps {
  data: any;
  name?: string;
  isLast?: boolean;
  level?: number;
}

export const JsonTree: React.FC<JsonTreeProps> = ({ data, name, isLast = true, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels

  const isObject = data !== null && typeof data === 'object';
  const isArray = Array.isArray(data);
  const isEmpty = isObject && Object.keys(data).length === 0;

  const toggle = () => setIsExpanded(!isExpanded);

  if (!isObject) {
    return (
      <div className="font-mono text-sm leading-6 hover:bg-slate-50/50 rounded px-1">
        <span className="text-slate-500 select-none">{'  '.repeat(level)}</span>
        {name && <span className="text-purple-600 font-medium">"{name}"</span>}
        {name && <span className="text-slate-400 mr-2">:</span>}
        {typeof data === 'string' ? (
          <span className="text-green-600">"{data}"</span>
        ) : typeof data === 'number' ? (
          <span className="text-orange-600">{data}</span>
        ) : typeof data === 'boolean' ? (
          <span className="text-blue-600">{data.toString()}</span>
        ) : (
          <span className="text-slate-400">null</span>
        )}
        {!isLast && <span className="text-slate-400">,</span>}
      </div>
    );
  }

  return (
    <div className="font-mono text-sm leading-6">
      <div 
        className="flex items-center hover:bg-slate-50/50 rounded px-1 cursor-pointer select-none"
        onClick={toggle}
      >
        <span className="text-slate-500">{'  '.repeat(level)}</span>
        <button className="p-0.5 mr-1 text-slate-400 hover:text-slate-600">
          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        
        {name && <span className="text-purple-600 font-medium">"{name}"</span>}
        {name && <span className="text-slate-400 mr-2">:</span>}
        
        <span className="text-slate-500 flex items-center gap-1">
          {isArray ? <Brackets size={12} /> : <Braces size={12} />}
          {isArray ? `Array(${data.length})` : `Object{${Object.keys(data).length}}`}
        </span>
        
        {!isExpanded && (
          <span className="text-slate-400 ml-1">
            {isArray ? '[...]' : '{...}'}
            {!isLast && ','}
          </span>
        )}
      </div>

      {isExpanded && !isEmpty && (
        <div>
          {Object.entries(data).map(([key, value], index, arr) => (
            <JsonTree
              key={key}
              name={isArray ? undefined : key}
              data={value}
              isLast={index === arr.length - 1}
              level={level + 1}
            />
          ))}
        </div>
      )}
      
      {isExpanded && (
        <div className="hover:bg-slate-50/50 rounded px-1">
           <span className="text-slate-500 select-none">{'  '.repeat(level)}</span>
           <span className="text-slate-400 ml-6">
             {isArray ? ']' : '}'}
             {!isLast && ','}
           </span>
        </div>
      )}
    </div>
  );
};

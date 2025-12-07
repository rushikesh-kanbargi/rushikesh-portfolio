import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Database, Server, Laptop, Cloud, HardDrive, Share2, X, Type, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

interface Node {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  label: string;
  width?: number;
  height?: number;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  fromHandle: HandlePosition;
  toHandle: HandlePosition;
}

type NodeType = 'server' | 'database' | 'client' | 'cloud' | 'storage' | 'balancer' | 'custom' | 'text';
type HandlePosition = 'top' | 'right' | 'bottom' | 'left';

const NODE_TYPES: { type: NodeType; icon: any; label: string; color: string }[] = [
  { type: 'server', icon: Server, label: 'Server', color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { type: 'database', icon: Database, label: 'Database', color: 'bg-green-100 text-green-600 border-green-200' },
  { type: 'client', icon: Laptop, label: 'Client', color: 'bg-purple-100 text-purple-600 border-purple-200' },
  { type: 'cloud', icon: Cloud, label: 'Cloud', color: 'bg-sky-100 text-sky-600 border-sky-200' },
  { type: 'storage', icon: HardDrive, label: 'Storage', color: 'bg-amber-100 text-amber-600 border-amber-200' },
  { type: 'balancer', icon: Share2, label: 'Balancer', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  { type: 'custom', icon: Plus, label: 'Custom', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  { type: 'text', icon: Type, label: 'Text', color: 'bg-transparent border-transparent' },
];

export const SystemDesignBoard: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [drawingConnection, setDrawingConnection] = useState<{
    fromNode: string;
    fromHandle: HandlePosition;
    currentX: number;
    currentY: number;
  } | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('system_design_board');
    if (saved) {
      const { nodes: savedNodes, connections: savedConnections } = JSON.parse(saved);
      setNodes(savedNodes || []);
      setConnections(savedConnections || []);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('system_design_board', JSON.stringify({ nodes, connections }));
  }, [nodes, connections]);

  const addNode = (type: NodeType) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type,
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
      label: type === 'text' ? 'Double click to edit' : NODE_TYPES.find(t => t.type === type)?.label || 'Node',
      width: type === 'text' ? 150 : 120,
      height: type === 'text' ? 40 : 100,
    };
    setNodes(prev => [...prev, newNode]);
  };

  const updateNodePosition = (id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  };

  const updateNodeLabel = (id: string, newLabel: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, label: newLabel } : n));
  };

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.from !== id && c.to !== id));
    if (selectedNode === id) setSelectedNode(null);
  };

  const deleteConnection = (id: string) => {
    setConnections(prev => prev.filter(c => c.id !== id));
    if (selectedConnection === id) setSelectedConnection(null);
  };

  const handleExport = async () => {
    if (canvasRef.current) {
      try {
        const canvas = await html2canvas(canvasRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
        });
        const link = document.createElement('a');
        link.download = 'system-design.png';
        link.href = canvas.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        // Fail silently or handle error
      }
    }
  };

  const getHandleCoords = (nodeId: string, handle: HandlePosition) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };

    // Default dimensions if not set
    const w = node.width || (node.type === 'text' ? 150 : 120);
    const h = node.height || (node.type === 'text' ? 40 : 100);

    // Node center position (x, y are top-left)
    // Actually, in our previous code x,y were top-left. Let's stick to that.
    // But we need to account for the padding/border of the node.
    // Let's assume standard size for simplicity or measure it.
    // For now, using fixed offsets based on typical rendering.
    
    // Center of the node
    const cx = node.x + w / 2;
    const cy = node.y + h / 2;

    switch (handle) {
      case 'top': return { x: cx, y: node.y };
      case 'right': return { x: node.x + w, y: cy };
      case 'bottom': return { x: cx, y: node.y + h };
      case 'left': return { x: node.x, y: cy };
    }
  };

  const getPath = (x1: number, y1: number, x2: number, y2: number, h1: HandlePosition, h2?: HandlePosition) => {
    // Simple bezier curve logic
    // Control points depend on handle direction
    const dist = Math.hypot(x2 - x1, y2 - y1) * 0.5;
    
    let cp1x = x1, cp1y = y1;
    switch (h1) {
      case 'top': cp1y -= dist; break;
      case 'right': cp1x += dist; break;
      case 'bottom': cp1y += dist; break;
      case 'left': cp1x -= dist; break;
    }

    let cp2x = x2, cp2y = y2;
    if (h2) {
      switch (h2) {
        case 'top': cp2y -= dist; break;
        case 'right': cp2x += dist; break;
        case 'bottom': cp2y += dist; break;
        case 'left': cp2x -= dist; break;
      }
    } else {
      // If no target handle (dragging), just curve towards the point
      // Try to infer approach direction or just use simple curve
      cp2x = x2;
      cp2y = y2;
    }

    return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  };

  const handleMouseDown = (e: React.MouseEvent, nodeId: string, handle: HandlePosition) => {
    e.stopPropagation();
    const coords = getHandleCoords(nodeId, handle);
    setDrawingConnection({
      fromNode: nodeId,
      fromHandle: handle,
      currentX: coords.x,
      currentY: coords.y,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (drawingConnection && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDrawingConnection(prev => prev ? {
        ...prev,
        currentX: e.clientX - rect.left,
        currentY: e.clientY - rect.top,
      } : null);
    }
  }, [drawingConnection]);

  const handleMouseUp = useCallback(() => {
    if (drawingConnection) {
      // Check if dropped on a handle
      // We need to find if the mouse is over a handle of another node
      // This is tricky with global mouse up. 
      // Instead, we'll handle the "drop" logic in the node's mouse up handler if possible,
      // or rely on the fact that we are tracking hoveredNode.
      
      // If we released over a node (and it's not the source node)
      // We can default to a specific handle or nearest handle.
      // For simplicity, let's say we need to drop ON a handle or just the node.
      // Let's use the hoveredNode state.
      
      // Note: This logic is simplified. In a real app we'd hit-test handles.
      // Here we will just cancel if not handled by a specific handle's mouseUp.
      setDrawingConnection(null);
    }
  }, [drawingConnection]);

  // Attach global listeners for drag
  useEffect(() => {
    if (drawingConnection) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [drawingConnection, handleMouseMove, handleMouseUp]);

  const onHandleMouseUp = (e: React.MouseEvent, nodeId: string, handle: HandlePosition) => {
    e.stopPropagation();
    if (drawingConnection && drawingConnection.fromNode !== nodeId) {
      // Create connection
      const newConn: Connection = {
        id: crypto.randomUUID(),
        from: drawingConnection.fromNode,
        to: nodeId,
        fromHandle: drawingConnection.fromHandle,
        toHandle: handle,
      };
      setConnections(prev => [...prev, newConn]);
      setDrawingConnection(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md">
                <Share2 size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">System Design Board</h1>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => { setNodes([]); setConnections([]); }}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium"
            >
              Clear
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
            >
              <Download size={18} />
              Export PNG
            </button>
          </div>
        </div>

        <div className="flex gap-6 flex-1 min-h-0">
          {/* Toolbar */}
          <div className="w-64 bg-white rounded-xl shadow-sm border border-slate-200 p-4 overflow-y-auto shrink-0">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Components</h2>
            <div className="grid grid-cols-2 gap-3">
              {NODE_TYPES.map((item) => (
                <button
                  key={item.type}
                  onClick={() => addNode(item.type)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 ${item.color.replace('text-', 'border-').replace('bg-', 'hover:bg-')}`}
                >
                  <item.icon size={24} className="mb-2" />
                  <span className="text-xs font-medium text-slate-700">{item.label}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-8">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Instructions</h2>
              <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                <li><strong>Add:</strong> Click a component to add.</li>
                <li><strong>Move:</strong> Drag nodes to arrange.</li>
                <li><strong>Connect:</strong> Hover a node, then drag from the blue dots to another node's dot.</li>
                <li><strong>Edit:</strong> Double-click text to rename.</li>
                <li><strong>Delete:</strong> Select and press X or Delete key.</li>
              </ul>
            </div>
          </div>

          {/* Canvas */}
          <div 
            ref={canvasRef}
            className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 relative overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] cursor-default select-none"
            onClick={() => { setSelectedNode(null); setSelectedConnection(null); }}
          >
            {/* Connections Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              {connections.map(conn => {
                const start = getHandleCoords(conn.from, conn.fromHandle);
                const end = getHandleCoords(conn.to, conn.toHandle);
                const isSelected = selectedConnection === conn.id;
                const d = getPath(start.x, start.y, end.x, end.y, conn.fromHandle, conn.toHandle);

                return (
                  <g key={conn.id} onClick={(e) => { e.stopPropagation(); setSelectedConnection(conn.id); }} className="pointer-events-auto cursor-pointer group">
                    {/* Invisible wide path for easier selection */}
                    <path d={d} stroke="transparent" strokeWidth="15" fill="none" />
                    {/* Visible path */}
                    <path 
                      d={d} 
                      stroke={isSelected ? "#6366f1" : "#94a3b8"} 
                      strokeWidth={isSelected ? "3" : "2"} 
                      fill="none"
                      className="transition-colors"
                    />
                    {isSelected && (
                      <circle cx={(start.x + end.x)/2} cy={(start.y + end.y)/2} r="8" fill="#ef4444" className="cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        deleteConnection(conn.id);
                      }} />
                    )}
                  </g>
                );
              })}
              
              {/* Drawing Line */}
              {drawingConnection && (
                <path 
                  d={getPath(
                    getHandleCoords(drawingConnection.fromNode, drawingConnection.fromHandle).x,
                    getHandleCoords(drawingConnection.fromNode, drawingConnection.fromHandle).y,
                    drawingConnection.currentX,
                    drawingConnection.currentY,
                    drawingConnection.fromHandle
                  )}
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  fill="none"
                />
              )}
            </svg>

            {/* Nodes Layer */}
            {nodes.map((node) => {
              const typeConfig = NODE_TYPES.find(t => t.type === node.type)!;
              const isSelected = selectedNode === node.id;
              const isHovered = hoveredNode === node.id;
              
              // Dimensions
              const w = node.width || (node.type === 'text' ? 150 : 120);
              const h = node.height || (node.type === 'text' ? 40 : 100);

              return (
                <motion.div
                  key={node.id}
                  drag={!drawingConnection} // Disable node drag while drawing connection
                  dragMomentum={false}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, x: node.x, y: node.y }}
                  onDragEnd={(_, info) => {
                    updateNodePosition(node.id, node.x + info.offset.x, node.y + info.offset.y);
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node.id);
                    setSelectedConnection(null);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    const newLabel = prompt('Enter new label:', node.label);
                    if (newLabel) updateNodeLabel(node.id, newLabel);
                  }}
                  style={{ width: w, height: h }}
                  className={`absolute rounded-xl border-2 shadow-sm flex flex-col items-center justify-center gap-2 bg-white transition-shadow group ${
                    isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 shadow-lg z-10' : 'border-slate-200 hover:border-indigo-300'
                  } ${node.type === 'text' ? 'border-none shadow-none bg-transparent !p-2 items-start' : ''}`}
                >
                  {node.type !== 'text' && (
                    <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                      <typeConfig.icon size={24} />
                    </div>
                  )}
                  <span className={`text-xs font-bold text-slate-700 w-full text-center truncate px-2 ${node.type === 'text' ? 'text-sm text-left' : ''}`}>
                    {node.label}
                  </span>
                  
                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNode(node.id);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600 transition-colors z-20"
                    >
                      <X size={12} />
                    </button>
                  )}

                  {/* Connection Handles - Only show on hover or drag */}
                  {(isHovered || drawingConnection) && node.type !== 'text' && (
                    <>
                      {/* Top */}
                      <div 
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rounded-full cursor-crosshair hover:scale-125 transition-transform z-20"
                        onMouseDown={(e) => handleMouseDown(e, node.id, 'top')}
                        onMouseUp={(e) => onHandleMouseUp(e, node.id, 'top')}
                      />
                      {/* Right */}
                      <div 
                        className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full cursor-crosshair hover:scale-125 transition-transform z-20"
                        onMouseDown={(e) => handleMouseDown(e, node.id, 'right')}
                        onMouseUp={(e) => onHandleMouseUp(e, node.id, 'right')}
                      />
                      {/* Bottom */}
                      <div 
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rounded-full cursor-crosshair hover:scale-125 transition-transform z-20"
                        onMouseDown={(e) => handleMouseDown(e, node.id, 'bottom')}
                        onMouseUp={(e) => onHandleMouseUp(e, node.id, 'bottom')}
                      />
                      {/* Left */}
                      <div 
                        className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full cursor-crosshair hover:scale-125 transition-transform z-20"
                        onMouseDown={(e) => handleMouseDown(e, node.id, 'left')}
                        onMouseUp={(e) => onHandleMouseUp(e, node.id, 'left')}
                      />
                    </>
                  )}
                </motion.div>
              );
            })}
            
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none">
                <div className="text-center">
                  <Share2 size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Canvas is empty</p>
                  <p className="text-sm">Add components from the sidebar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

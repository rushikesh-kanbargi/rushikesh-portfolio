import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Download, 
  Settings, 
  RefreshCw, 
  Check, 
  AlertCircle,
  FileImage
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageSettings {
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  scale: number;
}

export const ImageOptimizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<ImageSettings>({
    format: 'image/webp',
    quality: 0.8,
    scale: 1,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle File Drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      processFile(droppedFile);
    } else {
      setError('Please upload a valid image file (JPEG, PNG, WEBP).');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setOptimizedUrl(null);
  };

  // Optimization Logic
  useEffect(() => {
    if (!file || !previewUrl) return;

    const optimizeImage = async () => {
      setIsProcessing(true);
      try {
        const img = new Image();
        img.src = previewUrl;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate dimensions
        const width = img.width * settings.scale;
        const height = img.height * settings.scale;

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL(settings.format, settings.quality);
        setOptimizedUrl(dataUrl);

        // Calculate size approximation
        const head = 'data:' + settings.format + ';base64,';
        const size = Math.round((dataUrl.length - head.length) * 3 / 4);
        setOptimizedSize(size);

      } catch (err) {
        console.error(err);
        setError('Failed to process image.');
      } finally {
        setIsProcessing(false);
      }
    };

    const debounce = setTimeout(optimizeImage, 100);
    return () => clearTimeout(debounce);
  }, [file, previewUrl, settings]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFormatExt = (mime: string) => {
    switch (mime) {
      case 'image/jpeg': return 'jpg';
      case 'image/png': return 'png';
      case 'image/webp': return 'webp';
      default: return 'jpg';
    }
  };

  const handleDownload = () => {
    if (!optimizedUrl || !file) return;
    const link = document.createElement('a');
    link.href = optimizedUrl;
    link.download = `optimized_${file.name.split('.')[0]}.${getFormatExt(settings.format)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500 rounded-lg text-white shadow-md">
              <ImageIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Image Optimizer</h1>
              <p className="text-slate-500 text-sm">Compress and convert images locally.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Zone */}
            {!file ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-white hover:bg-slate-50 transition-colors cursor-pointer relative"
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Drop your image here</h3>
                <p className="text-slate-500 mb-6">Supports PNG, JPEG, WEBP up to 10MB</p>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Select File
                </button>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div className="flex items-center gap-3">
                    <FileImage className="text-indigo-600" size={20} />
                    <span className="font-medium text-slate-700 truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <button 
                    onClick={() => { setFile(null); setPreviewUrl(null); setOptimizedUrl(null); }}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
                
                <div className="relative aspect-video bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-slate-100 flex items-center justify-center p-8">
                  {/* Compare Slider could go here, for now just show optimized */}
                  {isProcessing ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <RefreshCw className="animate-spin" /> Processing...
                    </div>
                  ) : optimizedUrl ? (
                    <img src={optimizedUrl} alt="Optimized" className="max-h-full max-w-full object-contain shadow-lg rounded-lg" />
                  ) : (
                    <div className="text-slate-400">Preview will appear here</div>
                  )}
                </div>

                {/* Stats Bar */}
                <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Original</p>
                      <p className="text-lg font-bold text-slate-900">{formatSize(file.size)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Optimized</p>
                      <div className="flex items-end gap-2">
                        <p className="text-lg font-bold text-green-600">{formatSize(optimizedSize)}</p>
                        <span className="text-xs text-green-600 font-medium mb-1.5">
                          (-{Math.round((1 - optimizedSize / file.size) * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleDownload}
                    disabled={!optimizedUrl}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
                  >
                    <Download size={20} />
                    Download
                  </button>
                </div>
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
                <AlertCircle size={20} />
                {error}
              </div>
            )}
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-lg">
                <Settings size={20} className="text-slate-400" />
                Settings
              </div>

              <div className="space-y-6">
                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['image/webp', 'image/jpeg', 'image/png'].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setSettings(s => ({ ...s, format: fmt as any }))}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          settings.format === fmt
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {fmt.split('/')[1].toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">Quality</label>
                    <span className="text-sm font-mono text-indigo-600">{Math.round(settings.quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={settings.quality}
                    onChange={(e) => setSettings(s => ({ ...s, quality: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Scale */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">Scale</label>
                    <span className="text-sm font-mono text-indigo-600">{Math.round(settings.scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={settings.scale}
                    onChange={(e) => setSettings(s => ({ ...s, scale: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <Check size={18} />
                Pro Tip
              </h4>
              <p className="text-sm text-indigo-700 leading-relaxed">
                Use <strong>WEBP</strong> format for the best balance between quality and file size. It's supported by all modern browsers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

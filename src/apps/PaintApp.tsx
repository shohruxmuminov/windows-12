import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Paintbrush, Square, Circle, Download, Trash2, Undo } from 'lucide-react';

export default function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'rect' | 'circle'>('brush');
  
  // For undo functionality
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    saveToHistory();
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setHistory(prev => [...prev.slice(-19), canvas.toDataURL()]);
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `paint-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const undo = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop(); // remove current state
    const prevState = newHistory[newHistory.length - 1];
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = prevState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistory(newHistory);
    };
  };

  const colors = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', 
    '#10b981', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'
  ];

  return (
    <div className="flex flex-col h-full bg-slate-100 text-slate-800">
      {/* Toolbar */}
      <div className="p-2 bg-slate-200 border-b border-slate-300 flex items-center justify-between shadow-sm overflow-x-auto gap-4">
        <div className="flex items-center gap-1 bg-white/50 p-1 rounded-md border border-slate-300">
          <button 
            onClick={() => setTool('brush')}
            className={`p-2 rounded transition ${tool === 'brush' ? 'bg-blue-500 text-white' : 'hover:bg-slate-300'}`}
            title="Brush"
          >
            <Paintbrush size={18} />
          </button>
          <button 
            onClick={() => setTool('eraser')}
            className={`p-2 rounded transition ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'hover:bg-slate-300'}`}
            title="Eraser"
          >
            <Eraser size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
           <span className="text-xs font-semibold opacity-60">Color</span>
           <div className="flex items-center gap-1 p-1 bg-white/50 rounded-md border border-slate-300">
             {colors.map(c => (
               <button 
                 key={c}
                 className={`w-5 h-5 rounded-full border border-black/10 transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-blue-500 ring-offset-1 scale-110' : ''}`}
                 style={{ backgroundColor: c }}
                 onClick={() => setColor(c)}
               />
             ))}
             <input 
               type="color" 
               value={color} 
               onChange={(e) => setColor(e.target.value)}
               className="w-5 h-5 p-0 border-none bg-transparent cursor-pointer"
             />
           </div>
        </div>

        <div className="flex items-center gap-2">
           <span className="text-xs font-semibold opacity-60">Size</span>
           <input 
             type="range" 
             min="1" 
             max="50" 
             value={brushSize}
             onChange={(e) => setBrushSize(parseInt(e.target.value))}
             className="w-24 accent-blue-500"
           />
        </div>

        <div className="flex items-center gap-1 bg-white/50 p-1 rounded-md border border-slate-300 ml-auto">
          <button onClick={undo} className="p-2 hover:bg-slate-300 rounded transition" title="Undo">
            <Undo size={18} />
          </button>
          <button onClick={clearCanvas} className="p-2 hover:bg-red-100 text-red-600 rounded transition" title="Clear">
            <Trash2 size={18} />
          </button>
          <button onClick={downloadImage} className="p-2 hover:bg-green-100 text-green-600 rounded transition" title="Export">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-slate-400 p-8 overflow-auto flex justify-center items-start">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="bg-white shadow-2xl cursor-crosshair rounded-sm"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Footer Info */}
      <div className="px-4 py-1 bg-blue-600 text-white text-[10px] flex justify-between items-center shadow-inner">
         <span>800 x 600 px</span>
         <span className="opacity-80 font-medium italic">Windows 12 Paint Preview</span>
      </div>
    </div>
  );
}

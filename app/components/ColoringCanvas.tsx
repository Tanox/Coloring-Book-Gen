/* app/components/ColoringCanvas.tsx v0.5.16 */
import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ColoringCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const COLORS = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3',
  '#000000', '#FFFFFF', '#8B4513', '#FF69B4', '#00CED1', '#808080'
];

const ColoringCanvas: React.FC<ColoringCanvasProps> = ({ isOpen, onClose, imageUrl }) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(15);
  const [isDrawing, setIsDrawing] = useState(false);
  
  useEffect(() => {
    if (isOpen && canvasRef.current && imageUrl) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.fillStyle = "white";
            ctx.fillRect(0,0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
  }, [isOpen, imageUrl]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'multiply'; 
    ctx.strokeStyle = color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = "white";
        ctx.fillRect(0,0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
  };

  if (!isOpen) return null;

  return (
    <div id="coloring-canvas-container" className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-indigo-900/60 backdrop-blur-sm font-comic">
      <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-6xl h-[95vh] flex flex-col overflow-hidden border-8 border-white dark:border-slate-700">
        
        {/* Header */}
        <div id="canvas-header" className="p-6 border-b-4 border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
            <h3 className="text-3xl font-black text-indigo-900 dark:text-white flex items-center gap-4">
                🎨 {t('canvasTitle')}
            </h3>
            <button 
                onClick={onClose} 
                className="bg-rose-500 text-white font-black text-xl px-8 py-3 rounded-2xl hover:bg-rose-600 transition-all active:scale-95"
            >
                {t('canvasClose')}
            </button>
        </div>

        {/* Toolbar */}
        <div id="canvas-toolbar" className="p-6 bg-orange-50 dark:bg-slate-800 flex flex-wrap gap-8 items-center border-b-2 border-orange-100 dark:border-slate-700 z-10">
            {/* Palette */}
            <div id="canvas-toolbar-palette" className="flex gap-3 flex-wrap bg-white dark:bg-slate-700 p-4 rounded-3xl border-2 border-orange-100 dark:border-slate-600">
                {COLORS.map(c => (
                    <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-12 h-12 rounded-full border-4 transition-transform hover:scale-110 ${color === c ? 'border-slate-800 dark:border-white scale-125 z-10' : 'border-white dark:border-slate-500'}`}
                        style={{ backgroundColor: c }}
                        aria-label={`Select color ${c}`}
                    />
                ))}
            </div>
            
            <div className="hidden lg:block h-14 w-0.5 bg-orange-200 dark:bg-slate-600"></div>
            
            {/* Brush Size */}
            <div id="canvas-toolbar-brush" className="flex items-center gap-5 bg-white dark:bg-slate-700 px-6 py-4 rounded-3xl border-2 border-orange-100 dark:border-slate-600 flex-1 min-w-[300px]">
                <span className="text-xl font-black text-slate-700 dark:text-slate-300 whitespace-nowrap">{t('canvasBrushSize')}</span>
                <input 
                    type="range" 
                    min="2" 
                    max="60" 
                    value={brushSize} 
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div 
                    className="w-10 h-10 rounded-full bg-slate-800 dark:bg-white flex items-center justify-center shrink-0"
                    style={{ transform: `scale(${brushSize / 30 + 0.5})` }}
                ></div>
            </div>

            <button 
                onClick={clearCanvas}
                className="px-8 py-4 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-4 border-slate-200 dark:border-slate-600 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-600 text-lg font-black transition-all active:scale-95"
            >
                ♻️ {t('canvasClear')}
            </button>
        </div>

        {/* Canvas Container */}
        <div id="canvas-wrapper" ref={containerRef} className="flex-1 bg-slate-100 dark:bg-slate-950 p-8 overflow-hidden flex items-center justify-center relative touch-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
             <div className="bg-white p-3 rounded-2xl rotate-1">
                 <canvas
                    id="coloring-canvas"
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                    className="bg-white rounded max-w-full max-h-full object-contain cursor-crosshair"
                 />
             </div>
        </div>
      </div>
    </div>
  );
};

export default ColoringCanvas;
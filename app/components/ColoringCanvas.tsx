/* app/components/ColoringCanvas.tsx v2.1.1 */
import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ColoringCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const COLORS = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', // Rainbow
  '#000000', '#FFFFFF', '#8B4513', '#FF69B4', '#00CED1', '#808080' // Extras
];

const ColoringCanvas: React.FC<ColoringCanvasProps> = ({ isOpen, onClose, imageUrl }) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Load image onto canvas
  useEffect(() => {
    if (isOpen && canvasRef.current && imageUrl) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        img.onload = () => {
            // Fit to container
            const containerWidth = containerRef.current?.clientWidth || 300;
            const containerHeight = containerRef.current?.clientHeight || 400;
            
            // Set canvas resolution match image but scale display
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            // Draw white bg then image
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

    // Calculate position
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
    
    // Reload image
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-900/60 backdrop-blur-sm font-comic">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden border-4 border-white dark:border-slate-700 shadow-none">
        
        {/* Header */}
        <div className="p-4 border-b-2 border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
            <h3 className="text-2xl font-extrabold text-indigo-900 dark:text-white flex items-center gap-2">
                🎨 {t('canvasTitle')}
            </h3>
            <button 
                onClick={onClose} 
                className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 font-bold px-4 py-2 rounded-xl hover:bg-rose-200 transition-colors shadow-none"
            >
                {t('canvasClose')}
            </button>
        </div>

        {/* Toolbar - Art Desk Style */}
        <div className="p-4 bg-orange-50 dark:bg-slate-800 flex flex-wrap gap-6 items-center border-b border-orange-100 dark:border-slate-700 z-10">
            {/* Palette */}
            <div className="flex gap-2 flex-wrap bg-white dark:bg-slate-700 p-2 rounded-2xl border border-orange-100 dark:border-slate-600 shadow-none">
                {COLORS.map(c => (
                    <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-10 h-10 rounded-full border-4 transition-transform hover:scale-110 shadow-none ${color === c ? 'border-slate-800 dark:border-white scale-110 z-10' : 'border-white dark:border-slate-500'}`}
                        style={{ backgroundColor: c }}
                        aria-label={`Select color ${c}`}
                    />
                ))}
            </div>
            
            {/* Divider */}
            <div className="hidden sm:block h-10 w-0.5 bg-orange-200 dark:bg-slate-600"></div>
            
            {/* Brush Size */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-700 px-4 py-2 rounded-2xl border border-orange-100 dark:border-slate-600 shadow-none">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{t('canvasBrushSize')}</span>
                <input 
                    type="range" 
                    min="2" 
                    max="50" 
                    value={brushSize} 
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-32 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div 
                    className="w-6 h-6 rounded-full bg-slate-800 dark:bg-white"
                    style={{ width: brushSize / 2, height: brushSize / 2 }}
                ></div>
            </div>

            <button 
                onClick={clearCanvas}
                className="ml-auto px-6 py-3 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 text-sm font-bold transition-colors shadow-none"
            >
                ♻️ {t('canvasClear')}
            </button>
        </div>

        {/* Canvas Container */}
        <div ref={containerRef} className="flex-1 bg-slate-100 dark:bg-slate-950 p-6 overflow-hidden flex items-center justify-center relative touch-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
             <div className="bg-white p-2 rounded-lg rotate-1 shadow-none">
                 <canvas
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
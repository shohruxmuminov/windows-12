import { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Minus, Square, X, Copy } from 'lucide-react';
import { useWindowStore, AppWindow } from '@/store/windowStore';
import { AppDefinition } from '@/registry/apps';

interface WindowProps {
  windowState: AppWindow;
  appDef: AppDefinition;
}

export default function Window({ windowState, appDef }: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    updateWindowPosition,
    updateWindowSize,
    snapWindow,
    focusedWindowId
  } = useWindowStore();

  const [showSnapLayouts, setShowSnapLayouts] = useState(false);

  const isFocused = focusedWindowId === windowState.id;
  const isMaximized = windowState.isMaximized;

  const handlePointerDown = () => {
    focusWindow(windowState.id);
  };

  const startDrag = (event: React.PointerEvent) => {
    if (isMaximized) return;
    dragControls.start(event);
  };

  const winControls = (
    <div className="flex items-center">
      <button 
        className="p-3 hover:bg-white/10 transition-colors"
        onClick={(e) => { e.stopPropagation(); minimizeWindow(windowState.id); }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Minus size={14} />
      </button>
      {appDef.resizable && (
        <div 
          className="relative group"
          onMouseEnter={() => setShowSnapLayouts(true)}
          onMouseLeave={() => setShowSnapLayouts(false)}
        >
          <button 
            className="p-3 hover:bg-white/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              isMaximized ? restoreWindow(windowState.id) : maximizeWindow(windowState.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {isMaximized ? <Copy size={14} className="rotate-180" /> : <Square size={12} />}
          </button>

          {showSnapLayouts && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl p-3 grid grid-cols-2 gap-2 z-[100] animate-in fade-in zoom-in duration-150">
               {/* Snap Options */}
               <button 
                 onClick={() => { snapWindow(windowState.id, 'left'); setShowSnapLayouts(false); }}
                 className="h-12 border border-white/10 rounded hover:bg-blue-500/30 transition-colors flex items-center justify-center"
                 title="Snap Left"
               >
                 <div className="w-full h-full flex"><div className="w-1/2 h-full bg-blue-500/40 border-r border-white/20" /></div>
               </button>
               <button 
                 onClick={() => { snapWindow(windowState.id, 'right'); setShowSnapLayouts(false); }}
                 className="h-12 border border-white/10 rounded hover:bg-blue-500/30 transition-colors flex items-center justify-center"
                 title="Snap Right"
               >
                 <div className="w-full h-full flex"><div className="w-1/2 h-full ml-auto bg-blue-500/40 border-l border-white/20" /></div>
               </button>
               <button 
                 onClick={() => { snapWindow(windowState.id, 'top-left'); setShowSnapLayouts(false); }}
                 className="h-12 border border-white/10 rounded hover:bg-blue-500/30 transition-colors flex items-center justify-center overflow-hidden"
                 title="Top Left"
               >
                 <div className="w-1/2 h-1/2 bg-blue-500/40 border-r border-b border-white/10 self-start mr-auto" />
               </button>
               <button 
                 onClick={() => { snapWindow(windowState.id, 'bottom-right'); setShowSnapLayouts(false); }}
                 className="h-12 border border-white/10 rounded hover:bg-blue-500/30 transition-colors flex items-center justify-center overflow-hidden"
                 title="Bottom Right"
               >
                 <div className="w-1/2 h-1/2 bg-blue-500/40 border-l border-t border-white/10 self-end ml-auto" />
               </button>
            </div>
          )}
        </div>
      )}
      <button 
        className="p-3 hover:bg-red-500 hover:text-white transition-colors text-white"
        onClick={(e) => { e.stopPropagation(); closeWindow(windowState.id); }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <X size={14} />
      </button>
    </div>
  );

  if (windowState.isMinimized) {
    return null;
  }

  const AppBody = appDef.component;

  return (
    <motion.div
      ref={windowRef}
      className={`absolute flex flex-col pointer-events-auto rounded-xl overflow-hidden bg-slate-900 border ${isFocused ? 'border-blue-500/50 shadow-2xl shadow-black/50' : 'border-white/10 shadow-lg'} backdrop-blur-xl`}
      style={{ zIndex: windowState.zIndex }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        ...(isMaximized ? {
          top: 0, left: 0, width: '100vw', height: 'calc(100vh - 48px)',
          borderRadius: 0,
        } : {
          width: windowState.size.width,
          height: windowState.size.height,
          x: windowState.position.x,
          y: windowState.position.y,
        })
      }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      onPointerDown={handlePointerDown}
      drag={!isMaximized}
      dragControls={dragControls}
      dragMomentum={false}
      dragListener={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        updateWindowPosition(windowState.id, {
          x: windowState.position.x + info.offset.x,
          y: windowState.position.y + info.offset.y
        });
      }}
    >
      {/* Title Bar */}
      <div 
        className="h-10 flex items-center justify-between bg-slate-800/80 backdrop-blur select-none"
        onDoubleClick={() => appDef.resizable && (isMaximized ? restoreWindow(windowState.id) : maximizeWindow(windowState.id))}
      >
        <div 
          className="flex items-center flex-1 h-full px-3 gap-2 cursor-grab active:cursor-grabbing"
          onPointerDown={startDrag}
        >
          <appDef.icon className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-white/90 font-medium">{windowState.title}</span>
        </div>
        
        {winControls}
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-hidden relative bg-black/40">
        <AppBody windowId={windowState.id} />
        {/* Transparent overlay when dragging to prevent iframe/click capture */}
        {isDragging && <div className="absolute inset-0 z-50"></div>}
      </div>

      {/* Resize Handle (Simplified for demo) */}
      {!isMaximized && appDef.resizable && (
        <div 
          className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-50 hover:bg-white/20 transition"
          onPointerDown={(e) => {
            e.stopPropagation();
            // In a real app we'd attach a temporary mousemove listener here
          }}
        />
      )}
    </motion.div>
  );
}

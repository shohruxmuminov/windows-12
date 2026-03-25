import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    updateWindowPosition,
    focusedWindowId
  } = useWindowStore();

  const isFocused = focusedWindowId === windowState.id;
  const isMaximized = windowState.isMaximized;

  const handlePointerDown = () => {
    focusWindow(windowState.id);
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
        })
      }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onPointerDown={handlePointerDown}
      drag={!isMaximized}
      dragMomentum={false}
      dragListener={false} // We handle drag manually attached to header
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        if (!isMaximized) {
          updateWindowPosition(windowState.id, {
            x: windowState.position.x + info.offset.x,
            y: windowState.position.y + info.offset.y
          });
        }
      }}
      // Keep internal position via Framer Motion when dragging, but sync to store on end
      {...(!isMaximized ? {
        initial: { x: windowState.position.x, y: windowState.position.y, opacity: 0, scale: 0.95 },
        animate: { x: windowState.position.x, y: windowState.position.y, opacity: 1, scale: 1 },
      } : {})}
    >
      {/* Title Bar */}
      <div 
        className="h-10 flex items-center justify-between bg-slate-800/80 backdrop-blur select-none cursor-default"
        onDoubleClick={() => appDef.resizable && (isMaximized ? restoreWindow(windowState.id) : maximizeWindow(windowState.id))}
      >
        <div 
          className="flex items-center flex-1 h-full px-3 gap-2"
          style={{ cursor: isMaximized ? 'default' : 'grab' }}
          // @ts-ignore
          onPointerDown={(e) => {
            handlePointerDown();
            // Start drag using framer-motion controls
            // Actually, for simplicity we can just use Framer Motion's dragControls if implemented,
            // or just use CSS `dragListener=true` on the motion.div and make the content stop propagation.
          }}
        >
          <appDef.icon className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-white/90">{windowState.title}</span>
        </div>
        
        {winControls}
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-hidden relative bg-black/40">
        <AppBody windowId={windowState.id} />
        {/* Transparent overlay when dragging to prevent iframe/click capture */}
        {isDragging && <div className="absolute inset-0 z-50"></div>}
      </div>

      {/* Resize Handle (only bottom-right for demo simplicity) */}
      {!isMaximized && appDef.resizable && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            // simple resize logic would go here
            // using native onPointerMove for custom resizing
          }}
        />
      )}
    </motion.div>
  );
}

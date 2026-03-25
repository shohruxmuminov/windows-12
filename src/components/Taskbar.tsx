import { useState, useEffect } from 'react';
import { useWindowStore } from '@/store/windowStore';
import { APPS } from '@/registry/apps';
import { Search, Grid, Wifi, Volume2, Battery, ChevronUp } from 'lucide-react';
import StartMenu from './StartMenu';

export default function Taskbar() {
  const [startOpen, setStartOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  const { windows, focusedWindowId, minimizeWindow, restoreWindow, focusWindow } = useWindowStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const runningApps = windows.reduce((acc, win) => {
    if (!acc.includes(win.appId)) acc.push(win.appId);
    return acc;
  }, [] as string[]);

  const pinnedApps = Object.values(APPS).filter(a => a.pinned).map(a => a.id);
  const taskbarApps = Array.from(new Set([...pinnedApps, ...runningApps]));

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900/80 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between px-2 z-50">
        
        {/* Left side metrics (Widgets entry) */}
        <div className="flex items-center h-full sm:w-48">
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/10 transition cursor-pointer">
             <span className="text-xs opacity-80">24°C</span>
           </div>
        </div>

        {/* Center Icons */}
        <div className="flex items-center justify-center gap-1 h-full flex-1">
          {/* Start Button */}
          <button 
            className={`p-2 rounded-md transition-all ${startOpen ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
            onClick={() => setStartOpen(!startOpen)}
          >
            <Grid className="w-5 h-5 text-blue-400" />
          </button>
          
          {/* Search Button */}
          <button className="p-2 rounded-md hover:bg-white/10 transition-all group">
            <Search className="w-5 h-5 opacity-80 group-hover:opacity-100" />
          </button>

          <div className="w-px h-6 bg-white/20 mx-1" />

          {/* App Icons */}
          {taskbarApps.map(appId => {
             const appDef = APPS[appId];
             const isRunning = runningApps.includes(appId);
             
             // Find active window for this app
             const appWindows = windows.filter(w => w.appId === appId);
             const isActive = appWindows.some(w => w.id === focusedWindowId && !w.isMinimized);

             return (
               <button 
                 key={appId}
                 className={`relative p-2 rounded-md transition-all hover:bg-white/10 ${isActive ? 'bg-white/10' : ''}`}
                 onClick={() => {
                   if (isRunning) {
                      const win = appWindows[0]; // just grab first for simplicity
                      if (win.id === focusedWindowId && !win.isMinimized) {
                         minimizeWindow(win.id);
                      } else {
                         restoreWindow(win.id);
                         focusWindow(win.id);
                      }
                   } else {
                      useWindowStore.getState().openWindow(appDef.id, appDef.name, appDef.defaultSize);
                   }
                 }}
               >
                 <appDef.icon className={`w-5 h-5 ${isRunning ? 'opacity-100' : 'opacity-70'}`} />
                 {isRunning && (
                   <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-1 rounded-full bg-blue-400 transition-all ${isActive ? 'w-4' : 'w-1.5 opacity-50'}`} />
                 )}
               </button>
             );
          })}
        </div>

        {/* Right side tray */}
        <div className="flex items-center justify-end h-full sm:w-48 gap-1">
          <button className="p-2 rounded-md hover:bg-white/10 opacity-80">
            <ChevronUp className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 cursor-pointer">
            <Wifi className="w-4 h-4 opacity-80" />
            <Volume2 className="w-4 h-4 opacity-80" />
            <Battery className="w-4 h-4 opacity-80" />
          </div>
          <div className="flex flex-col items-end justify-center px-3 py-1 hover:bg-white/10 rounded-md cursor-pointer text-xs group">
             <span className="opacity-90 group-hover:opacity-100">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
             <span className="opacity-70 group-hover:opacity-100 scale-90">{time.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {startOpen && (
        <>
          <div className="absolute inset-0 z-40" onClick={() => setStartOpen(false)} />
          <StartMenu onClose={() => setStartOpen(false)} />
        </>
      )}
    </>
  );
}

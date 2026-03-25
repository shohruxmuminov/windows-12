import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Volume2, Battery, Bluetooth, Moon, Plane, Shield, Sun, Monitor, Settings } from 'lucide-react';
import { useSystemStore } from '@/store/systemStore';

export default function QuickSettings() {
  const { 
    isQuickSettingsOpen, 
    setQuickSettingsOpen,
    volume,
    setVolume,
    brightness,
    setBrightness,
    theme,
    setTheme
  } = useSystemStore();

  if (!isQuickSettingsOpen) return null;

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex pointer-events-none">
        <div className="absolute inset-0 pointer-events-auto" onClick={() => setQuickSettingsOpen(false)} />
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute bottom-16 right-4 w-[360px] bg-slate-800/90 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex flex-col pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Quick Action Grid */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { id: 'wifi', icon: Wifi, label: 'Internet', active: true },
              { id: 'bluetooth', icon: Bluetooth, label: 'Bluetooth', active: true },
              { id: 'theme', icon: theme === 'dark' ? Moon : Sun, label: theme === 'dark' ? 'Dark Mode' : 'Light Mode', active: true, onClick: toggleTheme },
              { id: 'airplane', icon: Plane, label: 'Airplane', active: false },
              { id: 'battery', icon: Shield, label: 'Battery Saver', active: false },
              { id: 'night', icon: Monitor, label: 'Night Light', active: false },
            ].map((action) => (
              <button 
                key={action.id}
                onClick={action.onClick}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-full h-12 rounded-lg flex items-center justify-center transition-all ${action.active ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                   <action.icon size={20} />
                </div>
                <span className="text-[10px] font-medium opacity-80 truncate w-full text-center">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Sliders */}
          <div className="space-y-6 mb-6">
            <div className="space-y-3">
               <div className="flex items-center justify-between text-xs opacity-80">
                  <div className="flex items-center gap-2">
                    <Sun size={14} />
                    <span>Brightness</span>
                  </div>
                  <span>{brightness}%</span>
               </div>
               <input 
                 type="range" 
                 min="0" 
                 max="100" 
                 value={brightness}
                 onChange={(e) => setBrightness(parseInt(e.target.value))}
                 className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-blue-500 cursor-pointer"
               />
            </div>

            <div className="space-y-3">
               <div className="flex items-center justify-between text-xs opacity-80">
                  <div className="flex items-center gap-2">
                    <Volume2 size={14} />
                    <span>Volume</span>
                  </div>
                  <span>{volume}%</span>
               </div>
               <input 
                 type="range" 
                 min="0" 
                 max="100" 
                 value={volume}
                 onChange={(e) => setVolume(parseInt(e.target.value))}
                 className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-blue-500 cursor-pointer"
               />
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs opacity-80">
                   <Battery size={14} className="text-emerald-500" />
                   <span>82%</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <span className="text-[10px] opacity-60">Remaining: 5h 22m</span>
             </div>
             <button className="p-2 hover:bg-white/10 rounded-full transition">
                <Settings size={16} />
             </button>
          </div>

          {/* Glassmorphism Shine */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

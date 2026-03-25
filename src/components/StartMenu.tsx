import { useWindowStore } from '@/store/windowStore';
import { APPS } from '@/registry/apps';
import { Power, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StartMenu({ onClose }: { onClose: () => void }) {
  const { openWindow } = useWindowStore();

  const handleAppClick = (appId: string) => {
    const app = APPS[appId];
    if (app) {
      openWindow(app.id, app.name, app.defaultSize);
    }
    onClose();
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[600px] h-[700px] bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden"
    >
      {/* Search Bar */}
      <div className="p-8 pb-4">
        <div className="bg-black/40 border border-white/10 rounded-full flex items-center px-4 py-2 hover:bg-black/60 transition-colors focus-within:border-blue-500/50 focus-within:bg-black/80">
          <input 
            type="text" 
            placeholder="Type here to search" 
            className="bg-transparent border-none outline-none flex-1 text-sm text-white placeholder-white/50"
            autoFocus
          />
        </div>
      </div>

      {/* Pinned Section */}
      <div className="px-8 py-4 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold pl-2">Pinned</h3>
          <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded shadow-sm transition">All apps &gt;</button>
        </div>
        
        <div className="grid grid-cols-6 gap-2">
          {Object.values(APPS).map(app => (
            <button 
              key={app.id} 
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-white/10 transition-colors group"
              onClick={() => handleAppClick(app.id)}
            >
              <app.icon className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs truncate w-full text-center opacity-80 group-hover:opacity-100">{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="h-16 bg-black/40 border-t border-white/5 flex items-center justify-between px-8">
        <div className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-lg cursor-pointer transition">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center uppercase font-bold shadow-inner">
            D
          </div>
          <span className="text-sm font-medium">Demo User</span>
        </div>

        <div className="flex gap-1">
          <button 
             className="p-2 hover:bg-white/10 rounded-full transition"
             onClick={() => { handleAppClick('settings'); }}
          >
            <Settings className="w-4 h-4 opacity-80" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition hover:text-red-400">
            <Power className="w-4 h-4 opacity-80" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

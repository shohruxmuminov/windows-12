import { useState } from 'react';
import { useWindowStore } from '@/store/windowStore';
import { useSystemStore } from '@/store/systemStore';
import { useFileSystemStore } from '@/store/fileSystemStore';
import { APPS } from '@/registry/apps';
import { Power, Settings, User, FileText, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StartMenu({ onClose }: { onClose: () => void }) {
  const { openWindow } = useWindowStore();
  const { user } = useSystemStore();
  const { files } = useFileSystemStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleAppClick = (appId: string) => {
    const app = APPS[appId];
    if (app) {
      openWindow(app.id, app.name, app.defaultSize);
    }
    onClose();
  };

  const filteredApps = Object.values(APPS).filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = files.filter(file => 
    file.type === 'file' && file.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);

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
          <Search size={16} className="text-white/40 mr-3" />
          <input 
            type="text" 
            placeholder="Type here to search apps and files" 
            className="bg-transparent border-none outline-none flex-1 text-sm text-white placeholder-white/30"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {searchQuery ? (
          <motion.div 
            key="search-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-8 py-4 flex-1 space-y-6 overflow-y-auto"
          >
            {filteredApps.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 mb-3 px-2">Apps</h3>
                <div className="flex flex-col gap-1">
                  {filteredApps.map(app => (
                    <button
                      key={app.id}
                      onClick={() => handleAppClick(app.id)}
                      className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <app.icon className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredFiles.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-40 mb-3 px-2">Recent Files</h3>
                <div className="flex flex-col gap-1">
                  {filteredFiles.map(file => (
                    <button
                      key={file.id}
                      onClick={() => { openWindow('notes', file.name, { width: 600, height: 400 }); onClose(); }}
                      className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div className="text-left">
                         <p className="text-sm">{file.name}</p>
                         <p className="text-[10px] opacity-40">{file.parentId === 'desktop' ? 'Desktop' : 'Documents'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredApps.length === 0 && filteredFiles.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-40 pt-10">
                <Search size={48} className="mb-4" />
                <p>No results found for "{searchQuery}"</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="pinned-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-8 py-4 flex-1"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold pl-2">Pinned</h3>
              <button className="text-[10px] font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition">All apps &gt;</button>
            </div>
            
            <div className="grid grid-cols-6 gap-2">
              {Object.values(APPS).slice(0, 18).map(app => (
                <button 
                  key={app.id} 
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-all group active:scale-95"
                  onClick={() => handleAppClick(app.id)}
                >
                  <app.icon className="w-8 h-8 text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] transition-all" />
                  <span className="text-[10px] truncate w-full text-center opacity-70 group-hover:opacity-100">{app.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="h-16 bg-black/40 border-t border-white/5 flex items-center justify-between px-8 shrink-0">
        <div 
          className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-lg cursor-pointer transition group"
          onClick={() => handleAppClick('settings')}
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shadow-lg group-hover:scale-105 transition-transform">
            {user?.avatar || 'DU'}
          </div>
          <span className="text-sm font-medium">{user?.name || 'Demo User'}</span>
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

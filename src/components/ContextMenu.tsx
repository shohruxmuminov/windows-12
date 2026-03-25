import React, { useRef, useEffect } from 'react';
import { 
  Plus, 
  RotateCw, 
  LayoutGrid, 
  SortAsc, 
  Monitor, 
  Paintbrush, 
  Terminal, 
  FolderPlus 
} from 'lucide-react';
import { useFileSystemStore } from '@/store/fileSystemStore';
import { useWindowStore } from '@/store/windowStore';
import { APPS } from '@/registry/apps';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export default function ContextMenu({ x, y, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { createFolder } = useFileSystemStore();
  const { openWindow } = useWindowStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNewFolder = () => {
    createFolder('New Folder', 'desktop');
    onClose();
  };

  const handleOpenApp = (appId: string) => {
    const app = APPS[appId];
    if (app) openWindow(app.id, app.name, app.defaultSize);
    onClose();
  };

  const menuItems = [
    { label: 'View', icon: LayoutGrid, sub: true },
    { label: 'Sort by', icon: SortAsc, sub: true },
    { label: 'Refresh', icon: RotateCw, onClick: () => window.location.reload() },
    { separator: true },
    { label: 'New Folder', icon: FolderPlus, onClick: handleNewFolder },
    { label: 'New Text Document', icon: Plus, onClick: () => handleOpenApp('notes') },
    { separator: true },
    { label: 'Display settings', icon: Monitor, onClick: () => handleOpenApp('settings') },
    { label: 'Personalize', icon: Paintbrush, onClick: () => handleOpenApp('settings') },
    { separator: true },
    { label: 'Open in Terminal', icon: Terminal, onClick: () => handleOpenApp('terminal') },
  ];

  // Adjust position if menu goes off screen
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 380);

  return (
    <div 
      ref={menuRef}
      className="fixed z-[100] w-56 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-1 animate-in fade-in zoom-in duration-100"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {menuItems.map((item, index) => (
        item.separator ? (
          <div key={index} className="h-px bg-white/10 my-1 mx-2" />
        ) : (
          <button
            key={index}
            className="w-full flex items-center justify-between px-3 py-1.5 text-sm hover:bg-white/10 transition-colors group"
            onClick={item.onClick}
          >
            <div className="flex items-center gap-3">
              <item.icon size={16} className="text-slate-400 group-hover:text-blue-400" />
              <span>{item.label}</span>
            </div>
            {item.sub && <span className="text-xs opacity-40">▶</span>}
          </button>
        )
      ))}
    </div>
  );
}

import React, { useState } from 'react';
import { useWindowStore } from '@/store/windowStore';
import { useFileSystemStore } from '@/store/fileSystemStore';
import { useSystemStore } from '@/store/systemStore';
import { APPS } from '@/registry/apps';
import DesktopIcon from './DesktopIcon';
import WindowManager from './WindowManager';
import Taskbar from './Taskbar';
import ContextMenu from './ContextMenu';
import Copilot from './Copilot';
import WidgetsPanel from './WidgetsPanel';
import QuickSettings from './QuickSettings';
import Window from './Window';

export default function Desktop() {
  const { wallpaper } = useSystemStore();
  const { getFilesByParentId } = useFileSystemStore();
  const { closeAll } = useWindowStore();
  
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

  const desktopFiles = getFilesByParentId('desktop');

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-black text-white"
      style={{
        backgroundImage: wallpaper.startsWith('linear-gradient') ? 'none' : `url(${wallpaper})`,
        background: wallpaper.startsWith('linear-gradient') ? wallpaper : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
    >
      {/* Desktop Grid */}
      <div className="absolute inset-0 p-2 z-0 flex flex-col flex-wrap content-start gap-2 max-h-[calc(100vh-48px)]">
        {desktopFiles.map(file => (
          <DesktopIcon key={file.id} file={file} />
        ))}
      </div>

      {/* Windows Layer */}
      <WindowManager />

      {/* Copilot Sidebar */}
      <Copilot />
      <WidgetsPanel />
      <QuickSettings />
      
      {/* Taskbar Layer */}
      <Taskbar />

      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu(null)} 
        />
      )}
    </div>
  );
}

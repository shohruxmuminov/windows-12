import { useState } from 'react';
import { useFileSystemStore, FileItem } from '@/store/fileSystemStore';
import { useWindowStore } from '@/store/windowStore';
import { APPS } from '@/registry/apps';
import { FileText, Folder } from 'lucide-react';

export default function DesktopIcon({ file }: { file: FileItem }) {
  const [isSelected, setIsSelected] = useState(false);
  const { openWindow } = useWindowStore();

  let Icon = FileText;
  let targetApp = 'notes';
  
  if (file.type === 'folder') {
    Icon = Folder;
    targetApp = 'explorer';
  } else if (file.mimeType === 'shortcut' && file.targetAppId) {
    const appDef = APPS[file.targetAppId];
    if (appDef) {
      Icon = appDef.icon;
      targetApp = file.targetAppId;
    }
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(false);
    
    // Open the app associated
    const appDef = APPS[targetApp];
    if (appDef) {
      openWindow(appDef.id, file.name || appDef.name, appDef.defaultSize);
    }
  };

  return (
    <div 
      className={`w-20 h-24 flex flex-col items-center justify-start p-1 bg-transparent rounded hover:bg-white/10 ${isSelected ? 'bg-white/20 border border-white/30' : 'border border-transparent'} transition-colors cursor-pointer`}
      onClick={(e) => {
        e.stopPropagation();
        setIsSelected(true);
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Icon className="w-10 h-10 text-white drop-shadow-md mb-1" strokeWidth={1.5} />
      <span className="text-xs text-center leading-tight drop-shadow-md line-clamp-2 select-none">
        {file.name}
      </span>
    </div>
  );
}

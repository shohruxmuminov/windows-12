import { useState } from 'react';
import { useFileSystemStore, FileItem } from '@/store/fileSystemStore';
import { useWindowStore } from '@/store/windowStore';
import { APPS } from '@/registry/apps';
import { Folder, FileText, ChevronLeft, ChevronRight, ChevronUp, RotateCw, Search, Home, Monitor, Music, Image as ImageIcon, Video, Trash2, LayoutGrid, List } from 'lucide-react';

export default function ExplorerApp({ windowId }: { windowId: string }) {
  const { files, createFolder, deleteFile, renameFile } = useFileSystemStore();
  const { openWindow } = useWindowStore();
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  
  const currentFolderId = currentPath[currentPath.length - 1];
  const currentFiles = files.filter(f => f.parentId === currentFolderId);

  const handleNewFolder = () => {
    const name = prompt('Enter folder name:', 'New Folder');
    if (name) {
      createFolder(name, currentFolderId);
    }
  };

  const handleDelete = () => {
    if (selectedFileId) {
      if (confirm('Are you sure you want to delete this item?')) {
        deleteFile(selectedFileId);
        setSelectedFileId(null);
      }
    }
  };

  const handleRename = () => {
    if (selectedFileId) {
      const file = files.find(f => f.id === selectedFileId);
      if (file) {
        const newName = prompt('Enter new name:', file.name);
        if (newName) renameFile(selectedFileId, newName);
      }
    }
  };

  const navigateTo = (id: string) => {
    setCurrentPath(prev => [...prev, id]);
    setSelectedFileId(null);
  };

  const goBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(prev => prev.slice(0, -1));
      setSelectedFileId(null);
    }
  };

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateTo(file.id);
    } else {
      if (file.mimeType === 'shortcut' && file.targetAppId) {
        const app = APPS[file.targetAppId];
        if (app) openWindow(app.id, app.name, app.defaultSize);
      } else if (file.mimeType === 'text/plain') {
        openWindow('notes', file.name, APPS['notes'].defaultSize);
      }
    }
  };

  const sidebarLinks = [
    { icon: Home, label: 'Home', id: 'root' },
    { icon: Monitor, label: 'Desktop', id: 'desktop' },
    { icon: FileText, label: 'Documents', id: 'documents' },
    { icon: ImageIcon, label: 'Pictures', id: 'pictures' },
    { icon: Music, label: 'Music', id: 'music' },
    { icon: Video, label: 'Videos', id: 'videos' },
    { icon: Trash2, label: 'Recycle Bin', id: 'trash' },
  ];

  const currentFolderName = files.find(f => f.id === currentFolderId)?.name || 'Root';

  return (
    <div className="flex flex-col h-full bg-slate-900/90 text-slate-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center gap-2 p-2 bg-slate-800/50 border-b border-white/5">
        <div className="flex items-center gap-1">
          <button 
            className="p-1.5 hover:bg-white/10 rounded disabled:opacity-30" 
            disabled={currentPath.length <= 1}
            onClick={goBack}
          >
            <ChevronLeft size={18} />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded opacity-30 cursor-not-allowed">
            <ChevronRight size={18} />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded" onClick={goBack}>
            <ChevronUp size={18} />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded">
            <RotateCw size={16} />
          </button>
        </div>
        
        <div className="flex-1 flex items-center bg-black/40 border border-white/10 rounded px-3 py-1.5 text-sm gap-2">
          <Folder size={16} className="text-blue-400" />
          <span className="opacity-80 flex-1 truncate">{currentPath.map(p => files.find(f => f.id === p)?.name || 'This PC').join(' > ')}</span>
        </div>
        
        <div className="w-64 flex items-center bg-black/40 border border-white/10 rounded px-3 py-1.5 text-sm gap-2">
          <Search size={16} className="opacity-50" />
          <input type="text" placeholder={`Search ${currentFolderName}`} className="bg-transparent border-none outline-none flex-1 placeholder:text-white/30" />
        </div>
      </div>
      
      {/* Command Bar */}
      <div className="flex items-center justify-between p-2 bg-slate-800/30 border-b border-white/5">
        <div className="flex gap-2">
          <button 
            onClick={handleNewFolder}
            className="px-3 py-1.5 text-sm hover:bg-white/10 rounded flex items-center gap-2 text-blue-400"
          >
             <Folder size={16} /> New Folder
          </button>
          <div className="w-px h-4 bg-white/10 self-center mx-1" />
          <button 
            disabled={!selectedFileId}
            onClick={handleRename}
            className="px-3 py-1.5 text-sm hover:bg-white/10 rounded disabled:opacity-30 transition-opacity"
          >
            Rename
          </button>
          <button 
            disabled={!selectedFileId}
            onClick={handleDelete}
            className="px-3 py-1.5 text-sm hover:bg-red-500/20 text-red-400 rounded disabled:opacity-30 transition-opacity"
          >
            Delete
          </button>
        </div>
        <div className="flex items-center border border-white/10 rounded overflow-hidden">
          <button 
            className={`p-1.5 ${viewMode === 'list' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            onClick={() => setViewMode('list')}
          >
            <List size={16} />
          </button>
          <button 
            className={`p-1.5 ${viewMode === 'grid' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Sidebar */}
         <div className="w-56 overflow-y-auto border-r border-white/5 p-2 hidden md:block">
           {sidebarLinks.map(link => (
             <button
               key={link.id}
               className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-white/10 transition-colors ${currentFolderId === link.id ? 'bg-white/10' : ''}`}
               onClick={() => setCurrentPath(['root', link.id])}
             >
               <link.icon size={18} className="text-blue-400" />
               <span>{link.label}</span>
             </button>
           ))}
         </div>
         
         {/* Main Content Area */}
         <div 
           className="flex-1 overflow-y-auto p-4 bg-slate-900/80"
           onClick={() => setSelectedFileId(null)}
         >
           {currentFiles.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center opacity-50">
                <Folder size={48} className="mb-4 opacity-50 text-blue-400" />
                <p>This folder is empty.</p>
             </div>
           ) : (
             <div className={`${viewMode === 'grid' ? 'flex flex-wrap gap-2 content-start' : 'flex flex-col gap-1'}`}>
               {currentFiles.map(file => (
                 <div
                   key={file.id}
                   onDoubleClick={() => handleFileDoubleClick(file)}
                   className={`
                     ${viewMode === 'grid' 
                        ? 'w-24 flex flex-col items-center gap-2 p-2 text-center rounded hover:bg-white/10 cursor-pointer' 
                        : 'w-full flex items-center gap-3 p-2 rounded hover:bg-white/10 cursor-pointer text-sm'}
                   `}
                 >
                    {file.type === 'folder' ? (
                      <Folder className={`${viewMode === 'grid' ? 'w-12 h-12' : 'w-5 h-5'} text-blue-400`} strokeWidth={1.5} fill="#60a5fa" fillOpacity={0.2} />
                    ) : (
                      <FileText className={`${viewMode === 'grid' ? 'w-10 h-10 mb-1' : 'w-5 h-5'} text-white opacity-80`} strokeWidth={1.5} />
                    )}
                    <span className={`${viewMode === 'grid' ? 'text-xs line-clamp-2' : 'flex-1'} break-words`}>{file.name}</span>
                    {viewMode === 'list' && (
                      <span className="text-xs opacity-50 w-32 text-right">
                         {new Date(file.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                 </div>
               ))}
             </div>
           )}
         </div>
      </div>
    </div>
  );
}

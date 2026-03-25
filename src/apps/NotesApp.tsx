import { useState, useEffect } from 'react';
import { useFileSystemStore } from '@/store/fileSystemStore';
import { FileText, Save, Plus, Trash2, Menu } from 'lucide-react';

export default function NotesApp({ windowId }: { windowId: string }) {
  const { files, createFile, updateFileContent, deleteFile } = useFileSystemStore();
  
  const notesFiles = files.filter(f => f.mimeType === 'text/plain');
  
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notesFiles[0]?.id || null);
  const [content, setContent] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  const activeNote = files.find(f => f.id === activeNoteId);

  useEffect(() => {
    if (activeNote) {
      setContent(activeNote.content || '');
    } else {
      setContent('');
    }
  }, [activeNoteId]);

  const handleSave = () => {
    if (activeNoteId) {
      updateFileContent(activeNoteId, content);
    } else {
      const id = createFile({
        name: `Note ${notesFiles.length + 1}.txt`,
        type: 'file',
        mimeType: 'text/plain',
        parentId: 'documents',
        content
      });
      setActiveNoteId(id);
    }
  };

  const createNew = () => {
    const id = createFile({
      name: `New Note ${Date.now().toString().slice(-4)}.txt`,
      type: 'file',
      mimeType: 'text/plain',
      parentId: 'documents',
      content: ''
    });
    setActiveNoteId(id);
  };

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-64 border-r border-slate-200 dark:border-white/10 flex flex-col bg-slate-100 dark:bg-slate-900/50">
          <div className="p-3 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
            <h3 className="font-semibold text-sm">Notes</h3>
            <button 
              onClick={createNew}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-md transition"
              title="New Note"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {notesFiles.length === 0 ? (
              <p className="text-xs text-center text-slate-500 mt-4">No notes found.</p>
            ) : (
              notesFiles.map(note => (
                <div 
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition ${
                    activeNoteId === note.id 
                      ? 'bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400' 
                      : 'hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  <FileText size={14} className="opacity-70 shrink-0" />
                  <span className="truncate flex-1">{note.name.replace('.txt', '')}</span>
                  {activeNoteId === note.id && (
                     <button 
                       onClick={(e) => { e.stopPropagation(); deleteFile(note.id); if(activeNoteId === note.id) setActiveNoteId(null); }}
                       className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded text-red-500"
                     >
                        <Trash2 size={12} />
                     </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 border-b border-slate-200 dark:border-white/10 flex items-center px-2 gap-1 bg-white dark:bg-slate-800/50">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-md transition"
          >
            <Menu size={18} />
          </button>
          <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-md transition text-sm"
            title="Save (Auto-saves on close too, but good practice)"
          >
            <Save size={16} /> Save
          </button>
          <div className="ml-auto text-xs opacity-50 px-3">
             {activeNote ? `Editing: ${activeNote.name}` : 'Unsaved document'}
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleSave} // auto-save
          className="flex-1 w-full bg-white dark:bg-slate-950 p-6 resize-none outline-none font-sans leading-relaxed text-sm md:text-base border-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
}

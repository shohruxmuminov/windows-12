import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FileType = 'file' | 'folder';
export type MimeType = 'text/plain' | 'image/png' | 'image/jpeg' | 'application/json' | 'shortcut';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  mimeType?: MimeType;
  parentId: string | null;
  content?: string;
  createdAt: number;
  updatedAt: number;
  targetAppId?: string; // For shortcuts
}

// Initial seed data for the OS
const defaultFiles: FileItem[] = [
  { id: 'desktop', name: 'Desktop', type: 'folder', parentId: 'root', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'documents', name: 'Documents', type: 'folder', parentId: 'root', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'downloads', name: 'Downloads', type: 'folder', parentId: 'root', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'pictures', name: 'Pictures', type: 'folder', parentId: 'root', createdAt: Date.now(), updatedAt: Date.now() },
  
  // Desktop shortcuts
  { id: 'welcome_txt', name: 'Welcome.txt', type: 'file', mimeType: 'text/plain', parentId: 'desktop', content: 'Welcome to Windows 12 Web Simulator!\n\nThis is a fully interactive React application.', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'browser_shortcut', name: 'Edge', type: 'file', mimeType: 'shortcut', parentId: 'desktop', targetAppId: 'browser', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'explorer_shortcut', name: 'File Explorer', type: 'file', mimeType: 'shortcut', parentId: 'desktop', targetAppId: 'explorer', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'terminal_shortcut', name: 'Terminal', type: 'file', mimeType: 'shortcut', parentId: 'desktop', targetAppId: 'terminal', createdAt: Date.now(), updatedAt: Date.now() }
];

interface FileSystemState {
  files: FileItem[];
  createFile: (file: Omit<FileItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  createFolder: (name: string, parentId: string) => string;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  updateFileContent: (id: string, content: string) => void;
  getFilesByParentId: (parentId: string) => FileItem[];
  moveFile: (id: string, newParentId: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

export const useFileSystemStore = create<FileSystemState>()(
  persist(
    (set, get) => ({
      files: defaultFiles,
      
      createFile: (file) => {
        const id = generateId();
        const now = Date.now();
        set((state) => ({
          files: [...state.files, { ...file, id, createdAt: now, updatedAt: now }]
        }));
        return id;
      },
      
      createFolder: (name, parentId) => {
        const id = generateId();
        const now = Date.now();
        set((state) => ({
          files: [...state.files, { id, name, type: 'folder', parentId, createdAt: now, updatedAt: now }]
        }));
        return id;
      },
      
      deleteFile: (id) => {
        // We should recursively delete children if it's a folder, but for simplicity we'll just delete the item and its direct children
        set((state) => ({
          files: state.files.filter(f => f.id !== id && f.parentId !== id)
        }));
      },
      
      renameFile: (id, newName) => {
        set((state) => ({
          files: state.files.map(f => f.id === id ? { ...f, name: newName, updatedAt: Date.now() } : f)
        }));
      },
      
      updateFileContent: (id, content) => {
        set((state) => ({
          files: state.files.map(f => f.id === id ? { ...f, content, updatedAt: Date.now() } : f)
        }));
      },
      
      getFilesByParentId: (parentId) => {
        return get().files.filter(f => f.parentId === parentId);
      },
      
      moveFile: (id, newParentId) => {
         set((state) => ({
          files: state.files.map(f => f.id === id ? { ...f, parentId: newParentId, updatedAt: Date.now() } : f)
        }));
      }
    }),
    {
      name: 'windows-12-fs'
    }
  )
);

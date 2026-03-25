import { create } from 'zustand';

export interface AppWindow {
  id: string; // Unique id for the window instance
  appId: string; // The id of the app in the registry
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface WindowState {
  windows: AppWindow[];
  focusedWindowId: string | null;
  openWindow: (appId: string, title: string, defaultSize: {width: number, height: number}) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  closeAll: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useWindowStore = create<WindowState>((set, get) => ({
  windows: [],
  focusedWindowId: null,

  openWindow: (appId, title, defaultSize) => {
    // Check if single-instance app is already open
    const existing = get().windows.find(w => w.appId === appId);
    if (existing) {
      get().focusWindow(existing.id);
      if (existing.isMinimized) {
        get().restoreWindow(existing.id);
      }
      return;
    }

    const id = generateId();
    const maxZ = Math.max(0, ...get().windows.map((w) => w.zIndex));
    
    // Slight offset for new windows
    const offset = get().windows.length * 30;

    const newWindow: AppWindow = {
      id,
      appId,
      title,
      isMinimized: false,
      isMaximized: false,
      zIndex: maxZ + 1,
      position: { x: 100 + offset, y: 100 + offset },
      size: defaultSize,
    };

    set((state) => ({
      windows: [...state.windows, newWindow],
      focusedWindowId: id,
    }));
  },

  closeWindow: (id) => {
    set((state) => {
      const remaining = state.windows.filter((w) => w.id !== id);
      const nextFocused = remaining.sort((a,b) => b.zIndex - a.zIndex)[0]?.id || null;
      return {
        windows: remaining,
        focusedWindowId: nextFocused,
      };
    });
  },

  focusWindow: (id) => {
    if (get().focusedWindowId === id) return;
    
    set((state) => {
      const maxZ = Math.max(0, ...state.windows.map((w) => w.zIndex));
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: maxZ + 1 } : w
        ),
        focusedWindowId: id,
      };
    });
  },

  minimizeWindow: (id) => {
    set((state) => {
      const windows = state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      );
      const nextFocused = windows.filter(w => !w.isMinimized).sort((a,b) => b.zIndex - a.zIndex)[0]?.id || null;
      
      return {
        windows,
        focusedWindowId: nextFocused,
      };
    });
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: true } : w
      ),
    }));
    get().focusWindow(id);
  },

  restoreWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: false, isMaximized: false } : w
      ),
    }));
    get().focusWindow(id);
  },

  updateWindowPosition: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position } : w
      ),
    }));
  },

  updateWindowSize: (id, size) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, size } : w
      ),
    }));
  },
  
  closeAll: () => set({ windows: [], focusedWindowId: null })
}));

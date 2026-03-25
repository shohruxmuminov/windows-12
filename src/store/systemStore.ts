import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SystemState {
  theme: 'light' | 'dark';
  wallpaper: string;
  volume: number;
  brightness: number;
  isMuted: boolean;
  isLocked: boolean;
  isBooted: boolean;
  user: {
    name: string;
    avatar: string;
    isGuest: boolean;
  } | null;
  isCopilotOpen: boolean;
  isWidgetsOpen: boolean;
  isQuickSettingsOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setWallpaper: (wallpaper: string) => void;
  setVolume: (volume: number) => void;
  setBrightness: (brightness: number) => void;
  setMuted: (isMuted: boolean) => void;
  setLocked: (isLocked: boolean) => void;
  setBooted: (isBooted: boolean) => void;
  setUser: (user: SystemState['user']) => void;
  setCopilotOpen: (isOpen: boolean) => void;
  setWidgetsOpen: (isOpen: boolean) => void;
  setQuickSettingsOpen: (isOpen: boolean) => void;
}

export const useSystemStore = create<SystemState>()(
  persist(
    (set) => ({
      theme: 'dark',
      wallpaper: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', // Default gradient
      volume: 80,
      brightness: 100,
      isMuted: false,
      isLocked: true,
      isBooted: false,
      user: null,
      setTheme: (theme) => set({ theme }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setVolume: (volume) => set({ volume }),
      setBrightness: (brightness) => set({ brightness }),
      setMuted: (isMuted) => set({ isMuted }),
      setLocked: (isLocked) => set({ isLocked }),
      setBooted: (isBooted) => set({ isBooted }),
      setUser: (user) => set({ user }),
      isCopilotOpen: false,
      setCopilotOpen: (isCopilotOpen) => set({ isCopilotOpen }),
      isWidgetsOpen: false,
      setWidgetsOpen: (isWidgetsOpen) => set({ isWidgetsOpen }),
      isQuickSettingsOpen: false,
      setQuickSettingsOpen: (isQuickSettingsOpen) => set({ isQuickSettingsOpen }),
    }),
    {
      name: 'windows-12-system',
    }
  )
);

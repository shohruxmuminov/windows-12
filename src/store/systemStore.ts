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
  setTheme: (theme: 'light' | 'dark') => void;
  setWallpaper: (wallpaper: string) => void;
  setVolume: (volume: number) => void;
  setBrightness: (brightness: number) => void;
  setMuted: (isMuted: boolean) => void;
  setLocked: (isLocked: boolean) => void;
  setBooted: (isBooted: boolean) => void;
  setUser: (user: SystemState['user']) => void;
}

export const useSystemStore = create<SystemState>()(
  persist(
    (set) => ({
      theme: 'dark',
      wallpaper: '/wallpapers/default.jpg', // We will use a nice default color/gradient if missing
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
    }),
    {
      name: 'windows-12-system',
    }
  )
);

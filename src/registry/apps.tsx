import { FC } from 'react';
import { 
  FolderOpen, 
  Globe, 
  Settings, 
  TerminalSquare, 
  FileText, 
  Calculator as CalculatorIcon, 
  Calendar, 
  ShoppingBag, 
  PlaySquare, 
  Image as ImageIcon, 
  CheckSquare 
} from 'lucide-react';

import ExplorerApp from '@/apps/ExplorerApp';
import BrowserApp from '@/apps/BrowserApp';
import SettingsApp from '@/apps/SettingsApp';
import TerminalApp from '@/apps/TerminalApp';
import NotesApp from '@/apps/NotesApp';
import CalculatorApp from '@/apps/CalculatorApp';
import CalendarApp from '@/apps/CalendarApp';
import StoreApp from '@/apps/StoreApp';
import MediaPlayerApp from '@/apps/MediaPlayerApp';
import GalleryApp from '@/apps/GalleryApp';
import TodoApp from '@/apps/TodoApp';

export interface AppDefinition {
  id: string;
  name: string;
  icon: FC<{ className?: string }>;
  component: FC<{ windowId: string }>;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  resizable: boolean;
  pinned: boolean; // Pinned to taskbar by default
}

export const APPS: Record<string, AppDefinition> = {
  explorer: {
    id: 'explorer',
    name: 'File Explorer',
    icon: FolderOpen,
    component: ExplorerApp,
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 400, height: 300 },
    resizable: true,
    pinned: true,
  },
  browser: {
    id: 'browser',
    name: 'EdgeBrowser',
    icon: Globe,
    component: BrowserApp,
    defaultSize: { width: 1024, height: 768 },
    minSize: { width: 500, height: 400 },
    resizable: true,
    pinned: true,
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    component: SettingsApp,
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 600, height: 400 },
    resizable: true,
    pinned: true,
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    icon: TerminalSquare,
    component: TerminalApp,
    defaultSize: { width: 700, height: 450 },
    minSize: { width: 400, height: 300 },
    resizable: true,
    pinned: false,
  },
  notes: {
    id: 'notes',
    name: 'Notes',
    icon: FileText,
    component: NotesApp,
    defaultSize: { width: 600, height: 500 },
    minSize: { width: 300, height: 300 },
    resizable: true,
    pinned: false,
  },
  calculator: {
    id: 'calculator',
    name: 'Calculator',
    icon: CalculatorIcon,
    component: CalculatorApp,
    defaultSize: { width: 320, height: 500 },
    minSize: { width: 320, height: 500 },
    resizable: false,
    pinned: false,
  },
  calendar: {
    id: 'calendar',
    name: 'Calendar',
    icon: Calendar,
    component: CalendarApp,
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 600, height: 500 },
    resizable: true,
    pinned: false,
  },
  store: {
    id: 'store',
    name: 'App Store',
    icon: ShoppingBag,
    component: StoreApp,
    defaultSize: { width: 900, height: 650 },
    minSize: { width: 600, height: 500 },
    resizable: true,
    pinned: true,
  },
  mediaplayer: {
    id: 'mediaplayer',
    name: 'Media Player',
    icon: PlaySquare,
    component: MediaPlayerApp,
    defaultSize: { width: 600, height: 400 },
    minSize: { width: 400, height: 300 },
    resizable: true,
    pinned: false,
  },
  gallery: {
    id: 'gallery',
    name: 'Gallery',
    icon: ImageIcon,
    component: GalleryApp,
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 400, height: 300 },
    resizable: true,
    pinned: false,
  },
  todo: {
    id: 'todo',
    name: 'To-do',
    icon: CheckSquare,
    component: TodoApp,
    defaultSize: { width: 400, height: 600 },
    minSize: { width: 350, height: 400 },
    resizable: true,
    pinned: false,
  }
};

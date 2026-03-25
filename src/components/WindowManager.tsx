import { useWindowStore } from '@/store/windowStore';
import { APPS } from '@/registry/apps';
import Window from './Window';
import { AnimatePresence } from 'framer-motion';

export default function WindowManager() {
  const windows = useWindowStore((state) => state.windows);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 w-full h-[calc(100vh-48px)]">
      <AnimatePresence>
        {windows.map((win) => {
          const appDef = APPS[win.appId];
          if (!appDef) return null;

          return (
            <Window key={win.id} windowState={win} appDef={appDef} />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

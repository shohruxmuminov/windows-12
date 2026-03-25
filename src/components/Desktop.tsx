import { useWindowStore } from '@/store/windowStore';
import { useFileSystemStore } from '@/store/fileSystemStore';
import { useSystemStore } from '@/store/systemStore';
import { APPS } from '@/registry/apps';
import DesktopIcon from './DesktopIcon';
import WindowManager from './WindowManager';
import Taskbar from './Taskbar';

export default function Desktop() {
  const { wallpaper } = useSystemStore();
  const { getFilesByParentId } = useFileSystemStore();
  const { closeAll } = useWindowStore();

  const desktopFiles = getFilesByParentId('desktop');

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-black text-white"
      style={{
        backgroundImage: wallpaper.startsWith('linear-gradient') ? 'none' : `url(${wallpaper})`,
        background: wallpaper.startsWith('linear-gradient') ? wallpaper : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={() => {
        // Close start menu or other popups here via a store action if needed
      }}
    >
      {/* Desktop Grid */}
      <div className="absolute inset-0 p-2 z-0 flex flex-col flex-wrap content-start gap-2 max-h-[calc(100vh-48px)]">
        {desktopFiles.map(file => (
          <DesktopIcon key={file.id} file={file} />
        ))}
      </div>

      {/* Windows Layer */}
      <WindowManager />

      {/* Taskbar Layer */}
      <Taskbar />
    </div>
  );
}

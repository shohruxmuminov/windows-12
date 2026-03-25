import { useState } from 'react';
import { useSystemStore } from '@/store/systemStore';
import { 
  Monitor, 
  Paintbrush, 
  Wifi, 
  Bluetooth, 
  Volume2, 
  ShieldCheck, 
  Clock, 
  Accessibility, 
  RefreshCcw,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function SettingsApp({ windowId }: { windowId: string }) {
  const { theme, setTheme, wallpaper, setWallpaper, volume, setVolume, brightness, setBrightness } = useSystemStore();
  const [activeTab, setActiveTab] = useState('system');

  const tabs = [
    { id: 'system', icon: Monitor, label: 'System' },
    { id: 'personalization', icon: Paintbrush, label: 'Personalization' },
    { id: 'network', icon: Wifi, label: 'Network & internet' },
    { id: 'bluetooth', icon: Bluetooth, label: 'Bluetooth & devices' },
    { id: 'privacy', icon: ShieldCheck, label: 'Privacy & security' },
    { id: 'time', icon: Clock, label: 'Time & language' },
    { id: 'accessibility', icon: Accessibility, label: 'Accessibility' },
    { id: 'update', icon: RefreshCcw, label: 'Windows Update' },
  ];

  const wallpapers = [
    '/wallpapers/default.jpg',
    '/wallpapers/dark.jpg',
    '/wallpapers/gradient.jpg',
    '/wallpapers/abstract.jpg'
  ];

  return (
    <div className="flex h-full bg-slate-900 text-slate-200">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 flex flex-col p-4 bg-slate-900/50 backdrop-blur">
        <div className="flex items-center gap-4 mb-6 px-1">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
             DU
          </div>
          <div>
            <h3 className="font-semibold text-sm">Demo User</h3>
            <p className="text-xs text-slate-400">Local Account</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 pr-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors ${
                activeTab === tab.id 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
        <h1 className="text-3xl font-light mb-8">{tabs.find(t => t.id === activeTab)?.label}</h1>

        {activeTab === 'system' && (
          <div className="space-y-6 max-w-2xl">
            {/* Display Settings */}
            <div className="bg-slate-800/50 border border-white/5 p-5 rounded-lg">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><Monitor size={20} /> Display</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Brightness</p>
                    <p className="text-xs text-slate-400">Adjust the brightness of the built-in display</p>
                  </div>
                  <input 
                    type="range" 
                    min="10" max="100" 
                    value={brightness} 
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-32 accent-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sound Settings */}
            <div className="bg-slate-800/50 border border-white/5 p-5 rounded-lg">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><Volume2 size={20} /> Sound</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Volume</p>
                    <p className="text-xs text-slate-400">Master volume level</p>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={volume} 
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-32 accent-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personalization' && (
          <div className="space-y-8 max-w-2xl">
             <div>
                <h3 className="text-lg font-medium mb-4">Select a theme</h3>
                <div className="flex gap-4">
                   <button 
                     className={`px-6 py-3 rounded-lg border ${theme === 'dark' ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:bg-white/10'}`}
                     onClick={() => setTheme('dark')}
                   >
                     Dark Mode
                   </button>
                   <button 
                     className={`px-6 py-3 rounded-lg border ${theme === 'light' ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 hover:bg-white/10'}`}
                     onClick={() => setTheme('light')}
                   >
                     Light Mode
                   </button>
                </div>
             </div>

             <div>
                <h3 className="text-lg font-medium mb-4">Choose a desktop background</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Using gradient placeholders since we don't have actual asset images locally */}
                  <div 
                    onClick={() => setWallpaper('linear-gradient(to right, #4facfe 0%, #00f2fe 100%)')}
                    className="h-32 rounded-lg cursor-pointer border-2 hover:border-white transition-all overflow-hidden"
                    style={{ background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' }}
                  />
                  <div 
                    onClick={() => setWallpaper('linear-gradient(to top, #30cfd0 0%, #330867 100%)')}
                    className="h-32 rounded-lg cursor-pointer border-2 hover:border-white transition-all overflow-hidden"
                    style={{ background: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)' }}
                  />
                   <div 
                    onClick={() => setWallpaper('linear-gradient(to top, #09203f 0%, #537895 100%)')}
                     className="h-32 rounded-lg cursor-pointer border-2 hover:border-white transition-all overflow-hidden"
                    style={{ background: 'linear-gradient(to top, #09203f 0%, #537895 100%)' }}
                  />
                  <div 
                    onClick={() => setWallpaper('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')}
                     className="h-32 rounded-lg cursor-pointer border-2 hover:border-white transition-all overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  />
                </div>
             </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {['network', 'bluetooth', 'privacy', 'time', 'accessibility'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center p-12 text-center opacity-60">
             <Lock size={48} className="mb-4" />
             <h2 className="text-xl mb-2">This feature is not available</h2>
             <p className="text-sm">In this simulated environment, only System and Personalization settings are interactive.</p>
          </div>
        )}

        {activeTab === 'update' && (
          <div className="space-y-6 max-w-2xl">
             <div className="flex items-start gap-4 p-6 bg-slate-800/50 border border-white/5 rounded-lg">
                <CheckCircle2 size={32} className="text-green-500 shrink-0" />
                <div>
                   <h2 className="text-xl font-medium mb-1">You're up to date</h2>
                   <p className="text-sm text-slate-400 mb-6">Last checked: Today</p>
                   <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded shadow transition">
                     Check for updates
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

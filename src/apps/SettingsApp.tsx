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
  const { 
    theme, setTheme, 
    wallpaper, setWallpaper, 
    volume, setVolume, 
    brightness, setBrightness,
    user, setUserName, setUserAvatar
  } = useSystemStore();
  const [activeTab, setActiveTab] = useState('system');

  const tabs = [
    { id: 'system', icon: Monitor, label: 'System' },
    { id: 'personalization', icon: Paintbrush, label: 'Personalization' },
    { id: 'network', icon: Wifi, label: 'Network & internet' },
    { id: 'bluetooth', icon: Bluetooth, label: 'Bluetooth & devices' },
    { id: 'accounts', icon: ShieldCheck, label: 'Accounts' },
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
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
             {user?.avatar || 'U'}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-semibold text-sm truncate">{user?.name || 'User'}</h3>
            <p className="text-xs text-slate-400">Local Account</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 pr-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded transition-all ${
                activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-md' 
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
          <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Display Settings */}
            <div className="bg-slate-800/50 border border-white/5 p-5 rounded-xl">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><Monitor size={20} className="text-blue-400" /> Display</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Brightness</p>
                    <p className="text-xs text-slate-400">Adjust the screen brightness</p>
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
            <div className="bg-slate-800/50 border border-white/5 p-5 rounded-xl">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><Volume2 size={20} className="text-blue-400" /> Sound</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Volume</p>
                    <p className="text-xs text-slate-400">Master output level</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Volume2 size={16} className="opacity-50" />
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
          </div>
        )}

        {activeTab === 'personalization' && (
          <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div>
                <h3 className="text-lg font-medium mb-4">Choose your mode</h3>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                     className={`flex flex-col items-center gap-4 p-6 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 hover:border-white/20 bg-white/5'}`}
                     onClick={() => setTheme('dark')}
                   >
                     <div className="w-12 h-12 bg-slate-800 rounded-lg border border-white/10" />
                     <span className="font-medium">Dark</span>
                   </button>
                   <button 
                     className={`flex flex-col items-center gap-4 p-6 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 hover:border-white/20 bg-white/5'}`}
                     onClick={() => setTheme('light')}
                   >
                     <div className="w-12 h-12 bg-white rounded-lg border border-black/10" />
                     <span className="font-medium">Light</span>
                   </button>
                </div>
             </div>

             <div>
                <h3 className="text-lg font-medium mb-4">Select a background</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                    'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
                    'linear-gradient(to top, #09203f 0%, #537895 100%)',
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'linear-gradient(to right, #ff0844 0%, #ffb199 100%)',
                    'linear-gradient(to top, #fcc5e4 0%, #fda34b 15%, #ff7882 35%, #c8699e 52%, #7046aa 71%, #0c1db8 87%, #020f75 100%)'
                  ].map((gp, i) => (
                    <div 
                      key={i}
                      onClick={() => setWallpaper(gp)}
                      className={`h-24 rounded-lg cursor-pointer border-2 transition-all overflow-hidden ${wallpaper === gp ? 'border-blue-500 scale-95 shadow-lg' : 'border-transparent hover:scale-105'}`}
                      style={{ background: gp }}
                    />
                  ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="bg-slate-800/50 border border-white/5 p-6 rounded-xl flex items-center gap-6">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl">
                   {user?.avatar}
                </div>
                <div className="flex-1">
                   <p className="text-xs uppercase tracking-wider opacity-50 mb-1 font-bold">Your info</p>
                   <input 
                     type="text"
                     value={user?.name}
                     onChange={(e) => setUserName(e.target.value)}
                     className="bg-transparent text-2xl font-bold outline-none border-b border-transparent hover:border-white/20 focus:border-blue-500 transition-colors w-full"
                   />
                   <p className="text-sm opacity-60">Administrator</p>
                </div>
             </div>

             <div className="bg-slate-800/50 border border-white/5 p-5 rounded-xl space-y-4">
                <h4 className="font-medium">Change Avatar</h4>
                <div className="flex gap-3">
                   {['DU', 'JD', 'AS', 'ME'].map(av => (
                     <button
                       key={av}
                       onClick={() => setUserAvatar(av)}
                       className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${user?.avatar === av ? 'bg-blue-600 scale-110 shadow-lg' : 'bg-white/10 hover:bg-white/20'}`}
                     >
                        {av}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'network' && (
           <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-slate-800/50 border border-white/5 p-6 rounded-xl flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                       <Wifi className="text-blue-400" size={24} />
                    </div>
                    <div>
                       <h3 className="font-medium">Wi-Fi</h3>
                       <p className="text-xs text-green-400">Connected, secured</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-xs opacity-60 italic">Standard LAN</span>
                    <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center px-1">
                       <div className="w-3 h-3 bg-white rounded-full ml-auto" />
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'time' && (
           <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-slate-800/50 border border-white/5 p-6 rounded-xl">
                 <h3 className="text-lg font-medium mb-6">Date & time</h3>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                       <p className="text-sm">Set time automatically</p>
                       <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center px-1 cursor-pointer">
                          <div className="w-3 h-3 bg-white rounded-full ml-auto" />
                       </div>
                    </div>
                    <div className="flex justify-between items-center">
                       <p className="text-sm">Time zone</p>
                       <select className="bg-slate-900 border border-white/10 rounded px-3 py-1 text-xs outline-none focus:ring-1 ring-blue-500">
                          <option>(UTC+05:00) Tashkent</option>
                          <option>(UTC+00:00) London</option>
                          <option>(UTC-05:00) New York</option>
                       </select>
                    </div>
                 </div>
              </div>
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

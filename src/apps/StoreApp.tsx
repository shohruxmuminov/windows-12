import { useState } from 'react';
import { Search, Download, Check, Star, Gamepad2, Briefcase, MonitorPlay, Zap } from 'lucide-react';

export default function StoreApp({ windowId }: { windowId: string }) {
  const [installed, setInstalled] = useState<string[]>(['netflix', 'spotify']);
  const [installing, setInstalling] = useState<string | null>(null);

  const apps = [
    { id: 'vscode', name: 'Visual Studio Code', dev: 'Microsoft', icon: CodeIcon, rating: 4.8, category: 'Developer Tools' },
    { id: 'spotify', name: 'Spotify Music', dev: 'Spotify AB', icon: MusicIcon, rating: 4.5, category: 'Music' },
    { id: 'netflix', name: 'Netflix', dev: 'Netflix Inc.', icon: VideoIcon, rating: 4.2, category: 'Entertainment' },
    { id: 'discord', name: 'Discord', dev: 'Discord Inc.', icon: MsgIcon, rating: 4.7, category: 'Social' },
    { id: 'whatsapp', name: 'WhatsApp', dev: 'Meta', icon: ChatIcon, rating: 4.4, category: 'Social' },
    { id: 'adobe', name: 'Adobe Creative Cloud', dev: 'Adobe', icon: AdobeIcon, rating: 4.1, category: 'Productivity' },
  ];

  const handleInstall = (id: string) => {
    if (installed.includes(id)) {
      setInstalled(installed.filter(i => i !== id));
      return;
    }
    
    setInstalling(id);
    setTimeout(() => {
      setInstalled([...installed, id]);
      setInstalling(null);
    }, 2000);
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] text-slate-200">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-[#191919] flex flex-col pt-8">
        <h2 className="px-6 text-xl font-semibold mb-6">Microsoft Store</h2>
        <div className="flex-1 space-y-1">
          <SidebarItem icon={HomeIcon} label="Home" active />
          <SidebarItem icon={Gamepad2} label="Gaming" />
          <SidebarItem icon={Briefcase} label="Productivity" />
          <SidebarItem icon={MonitorPlay} label="Entertainment" />
        </div>
        <div className="mt-auto border-t border-white/5 p-4 space-y-1">
          <SidebarItem icon={Download} label="Library" />
          <SidebarItem icon={Zap} label="Updates (2)" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-[#202020] overflow-hidden">
        {/* Search */}
        <div className="h-20 flex items-center justify-end px-8 border-b border-white/5 shrink-0">
          <div className="bg-[#292929] border border-white/10 rounded-full flex items-center px-4 py-2 w-72 focus-within:ring-2 ring-blue-500/50 transition">
             <Search size={16} className="text-slate-400 mr-2" />
             <input type="text" placeholder="Search apps, games, movies and more" className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
        </div>

        {/* Hero */}
        <div className="flex-1 overflow-y-auto w-full flex flex-col p-8">
           
           <div className="w-full h-64 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-2xl mb-12 flex items-center px-12 relative overflow-hidden shrink-0 shadow-2xl">
              <div className="relative z-10 max-w-sm">
                 <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded text-white uppercase tracking-wider mb-4 inline-block">Featured</span>
                 <h1 className="text-5xl font-bold mb-4">Minecraft</h1>
                 <p className="text-lg opacity-80 mb-6 line-clamp-2">Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.</p>
                 <button className="bg-white text-black font-semibold px-6 py-2 rounded shadow hover:bg-slate-200 transition">Get</button>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-50 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600')] bg-cover bg-center" style={{ mixBlendMode: 'overlay' }}></div>
           </div>

           <div className="flex justify-between items-end mb-6 shrink-0">
              <h2 className="text-2xl font-semibold">Essential Apps</h2>
              <button className="text-blue-400 hover:text-blue-300 transition text-sm">See all</button>
           </div>

           <div className="grid grid-cols-3 gap-6 shrink-0 pb-12">
             {apps.map(app => (
               <div key={app.id} className="bg-[#292929] border border-white/5 rounded-xl p-5 flex flex-col hover:bg-[#303030] transition cursor-pointer shadow-lg">
                  <div className="flex gap-4 items-start mb-4">
                     <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#3b3b3b] to-[#1e1e1e] flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden">
                       <app.icon className="w-8 h-8 opacity-80 z-10" />
                     </div>
                     <div className="flex-1">
                       <h3 className="font-semibold line-clamp-1">{app.name}</h3>
                       <p className="text-sm text-slate-400 line-clamp-1 mb-1">{app.dev}</p>
                       <div className="flex items-center gap-1 text-xs text-slate-300">
                          <span>{app.rating}</span>
                          <Star size={10} className="fill-blue-400 text-blue-400" />
                          <span className="opacity-50 mx-1">•</span>
                          <span className="opacity-70">{app.category}</span>
                       </div>
                     </div>
                  </div>

                  <div className="mt-auto flex justify-end pt-2">
                     <button 
                       className={`w-full py-1.5 rounded text-sm font-medium transition ${
                         installed.includes(app.id) 
                          ? 'bg-transparent border border-white/20 text-white hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30' 
                          : installing === app.id
                          ? 'bg-blue-600/50 cursor-wait'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                       }`}
                       onClick={(e) => { e.stopPropagation(); handleInstall(app.id); }}
                       disabled={installing === app.id}
                     >
                       {installing === app.id ? (
                          <span className="flex items-center justify-center gap-2">
                             <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             Installing...
                          </span>
                       ) : installed.includes(app.id) ? (
                          <span className="group-hover:hidden">Installed</span>
                       ) : (
                          'Get'
                       )}
                     </button>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 px-6 py-3 cursor-pointer relative transition-colors ${active ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
      {active && <div className="absolute left-0 top-1 bottom-1 w-1 bg-blue-500 rounded-r-md"></div>}
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </div>
  );
}

// Icons placeholders
function CodeIcon(props: any) { return <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M2 11h20v2H2z" /></svg>; }
function MusicIcon(props: any) { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>; }
function VideoIcon(props: any) { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>; }
function MsgIcon(props: any) { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>; }
function ChatIcon(props: any) { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>; }
function AdobeIcon(props: any) { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>; }
function HomeIcon(props: any) { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>; }

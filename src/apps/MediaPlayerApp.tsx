import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, ListMusic, MoreHorizontal } from 'lucide-react';

export default function MediaPlayerApp({ windowId }: { windowId: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return p + 0.5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex h-full bg-[#111111] text-white">
      {/* Sidebar - Playlist */}
      <div className="w-64 border-r border-white/5 bg-[#181818] flex flex-col pt-4">
        <h2 className="px-6 text-sm font-semibold mb-4 opacity-70 uppercase tracking-wider">Now Playing</h2>
        <div className="flex-1 overflow-y-auto space-y-1">
           <SongItem title="synthwave_loop_1.mp3" artist="Demo Artist" duration="3:45" active />
           <SongItem title="cyberpunk_combat.mp3" artist="Demo Artist" duration="2:30" />
           <SongItem title="lofi_chill_beats.mp3" artist="Lofi Girl" duration="5:15" />
           <SongItem title="windows_12_startup_concept.wav" artist="System" duration="0:30" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Visualizer placeholder / Artwork */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
           
           <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=600')] bg-cover bg-center blur-3xl z-0 transition-opacity"></div>
           
           <div className="w-64 h-64 rounded-xl bg-gradient-to-tr from-fuchsia-900 to-blue-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 flex items-center justify-center border border-white/10 overflow-hidden relative group">
              <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=400')] bg-cover bg-center transition-transform duration-[20s] ${isPlaying ? 'scale-125' : 'scale-100'}`} />
              <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]" />
           </div>

           <div className="z-10 mt-8 text-center">
              <h2 className="text-3xl font-bold mb-2">synthwave_loop_1.mp3</h2>
              <p className="text-lg opacity-60">Demo Artist</p>
           </div>
        </div>

        {/* Controls Bar */}
        <div className="h-28 bg-[#202020]/90 backdrop-blur-xl border-t border-white/5 flex flex-col px-8 py-3 shrink-0 z-20">
           
           {/* Progress */}
           <div className="flex items-center gap-4 text-xs font-mono opacity-60 mb-2">
              <span>{Math.floor((progress / 100) * 225 / 60)}:{(Math.floor((progress / 100) * 225) % 60).toString().padStart(2, '0')}</span>
              <div className="flex-1 h-1.5 bg-[#404040] rounded-full overflow-hidden cursor-pointer group">
                 <div 
                   className="h-full bg-blue-500 group-hover:bg-blue-400 relative" 
                   style={{ width: `${progress}%` }}
                 >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                 </div>
              </div>
              <span>3:45</span>
           </div>

           {/* Buttons */}
           <div className="flex items-center justify-between flex-1">
              <div className="flex items-center gap-4 opacity-70 w-48">
                 <button className="hover:opacity-100 hover:text-blue-400 transition"><Shuffle size={18} /></button>
                 <button className="hover:opacity-100 hover:text-blue-400 transition"><Repeat size={18} /></button>
              </div>

              <div className="flex items-center gap-6">
                 <button className="p-2 hover:bg-white/10 rounded-full transition opacity-70 hover:opacity-100"><SkipBack size={24} fill="currentColor" /></button>
                 <button 
                   className="p-4 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition"
                   onClick={() => setIsPlaying(!isPlaying)}
                 >
                   {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                 </button>
                 <button className="p-2 hover:bg-white/10 rounded-full transition opacity-70 hover:opacity-100"><SkipForward size={24} fill="currentColor" /></button>
              </div>

              <div className="flex items-center justify-end gap-3 opacity-70 w-48">
                 <button className="hover:opacity-100 transition"><ListMusic size={18} /></button>
                 <div className="flex items-center gap-2 group cursor-pointer w-24">
                   <Volume2 size={18} className="group-hover:text-blue-400 transition" />
                   <div className="flex-1 h-1 bg-[#404040] rounded-full overflow-hidden">
                     <div className="h-full bg-white group-hover:bg-blue-500 w-[60%]"></div>
                   </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

function SongItem({ title, artist, duration, active = false }: { title: string, artist: string, duration: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-6 py-2 cursor-pointer group hover:bg-[#252525] transition-colors ${active ? 'bg-[#252525] border-l-2 border-blue-500' : 'border-l-2 border-transparent'}`}>
       <div className={`w-8 h-8 rounded bg-[#111111] flex items-center justify-center text-xs shadow-inner ${active ? 'text-blue-500' : 'text-slate-500'}`}>
          {active ? <Play size={10} fill="currentColor" /> : <ListMusic size={12} />}
       </div>
       <div className="flex-1 overflow-hidden">
          <h4 className={`text-sm truncate ${active ? 'text-blue-400 font-medium' : 'text-slate-300 group-hover:text-white'}`}>{title}</h4>
          <p className="text-xs text-slate-500 truncate">{artist}</p>
       </div>
       <div className="text-xs text-slate-500">{duration}</div>
    </div>
  );
}

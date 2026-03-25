import { useState } from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Search, Image as ImageIcon, Video, Star, Clock, Folder, ZoomIn, ZoomOut, RotateCw, Download, Heart, Share2 } from 'lucide-react';

const mockImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=800', date: 'Today' },
  { id: 2, url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=800', date: 'Today' },
  { id: 3, url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=800', date: 'Yesterday' },
  { id: 4, url: 'https://images.unsplash.com/photo-1506744626753-eda8151a747b?q=80&w=800', date: 'Yesterday' },
  { id: 5, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800', date: 'Last Week' },
  { id: 6, url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=800', date: 'Last Week' },
];

export default function GalleryApp({ windowId }: { windowId: string }) {
  const { setWallpaper } = useSystemStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (selectedImage) {
    return (
      <div className="flex flex-col h-full bg-[#111111] text-white">
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-[#181818]">
          <button 
            className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded transition"
            onClick={() => { setSelectedImage(null); setZoom(1); setRotation(0); }}
          >
            &larr; Back
          </button>
          <div className="flex items-center gap-2 opacity-80">
            <button className="p-2 hover:bg-white/10 rounded transition" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}><ZoomOut size={18} /></button>
            <span className="text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button className="p-2 hover:bg-white/10 rounded transition" onClick={() => setZoom(z => Math.min(3, z + 0.25))}><ZoomIn size={18} /></button>
            <div className="w-px h-5 bg-white/20 mx-2" />
             <button className="p-2 hover:bg-white/10 rounded transition" onClick={() => setRotation(r => r + 90)}><RotateCw size={18} /></button>
             <button className="p-2 hover:bg-white/10 rounded transition"><Heart size={18} /></button>
             <button 
                className="p-2 hover:bg-white/10 rounded text-blue-400 transition ml-2" 
                title="Set as Wallpaper"
                onClick={() => setWallpaper(`url(${selectedImage})`)}
             >
                <MonitorPlay size={18} />
             </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden flex items-center justify-center p-8 bg-black/50">
           <img 
             src={selectedImage} 
             alt="Viewed" 
             className="max-w-full max-h-full object-contain transition-transform duration-200"
             style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
           />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#1e1e1e] text-slate-200">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-[#181818] flex flex-col pt-4">
        <div className="px-6 mb-4">
           <div className="bg-[#292929] border border-white/10 rounded-full flex items-center px-4 py-1.5 w-full focus-within:ring-2 ring-blue-500/50">
             <Search size={14} className="text-slate-400 mr-2" />
             <input type="text" placeholder="Search photos" className="bg-transparent border-none outline-none text-xs w-full" />
          </div>
        </div>
        <div className="flex-1 space-y-1">
           <SidebarItem icon={ImageIcon} label="All Photos" active />
           <SidebarItem icon={Star} label="Favorites" />
           <SidebarItem icon={Clock} label="Recent" />
           <SidebarItem icon={Folder} label="Folders" />
           <SidebarItem icon={Video} label="Videos" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#202020]">
        
        {['Today', 'Yesterday', 'Last Week'].map(group => {
           const groupImgs = mockImages.filter(img => img.date === group);
           if (groupImgs.length === 0) return null;

           return (
             <div key={group} className="mb-8">
               <h3 className="text-xl font-semibold mb-4 px-2">{group}</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {groupImgs.map(img => (
                   <div 
                     key={img.id} 
                     className="aspect-square bg-[#252525] rounded-xl border border-white/5 overflow-hidden group cursor-pointer hover:ring-2 ring-blue-500 transition-all relative"
                     onClick={() => setSelectedImage(img.url)}
                   >
                     <img 
                       src={img.url} 
                       alt="Gallery items" 
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                       loading="lazy"
                     />
                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur rounded p-1 hover:bg-black/80">
                        <Heart size={16} className="text-white" />
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           );
        })}

      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 px-6 py-2.5 cursor-pointer relative transition-colors text-sm ${active ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
      {active && <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-blue-500 rounded-r-md"></div>}
      <Icon size={16} className={active ? "text-blue-400" : ""} />
      <span>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
    </div>
  );
}

function MonitorPlay(props: any) { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }

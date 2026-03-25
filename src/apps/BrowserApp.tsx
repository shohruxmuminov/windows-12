import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Home, Search, Star, MoreVertical, Plus, X, Globe, Shield } from 'lucide-react';

export default function BrowserApp({ windowId }: { windowId: string }) {
  const [urlInput, setUrlInput] = useState('windows12.dev');
  const [currentUrl, setCurrentUrl] = useState('windows12.dev');
  const [tabs, setTabs] = useState([{ id: 1, title: 'Windows 12 Simulation', url: 'windows12.dev' }]);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isProxyEnabled, setIsProxyEnabled] = useState(false);

  const verifiedSites = [
    { id: 'bing', name: 'Bing', url: 'https://www.bing.com', icon: 'https://www.bing.com/favicon.ico' },
    { id: 'wikipedia', name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: 'https://www.wikipedia.org/favicon.ico' },
    { id: 'reddit', name: 'Reddit', url: 'https://www.reddit.com', icon: 'https://www.reddit.com/favicon.ico' },
    { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: 'https://duckduckgo.com/favicon.ico' },
  ];

  const getIframeUrl = () => {
    if (!currentUrl) return '';
    if (isProxyEnabled) {
      return `https://api.allorigins.win/raw?url=${encodeURIComponent(currentUrl)}`;
    }
    return currentUrl;
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    
    setLoading(true);
    setTimeout(() => {
      let finalUrl = urlInput;
      if (!urlInput.includes('.') && !urlInput.startsWith('http')) {
        finalUrl = `https://bing.com/search?q=${encodeURIComponent(urlInput)}`;
      } else if (!urlInput.startsWith('http')) {
        finalUrl = `https://${urlInput}`;
      }
      setCurrentUrl(finalUrl);
      setTabs(tabs.map(t => t.id === activeTab ? { ...t, url: finalUrl, title: finalUrl } : t));
      setLoading(false);
    }, 600);
  };

  const closeTab = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Keep at least one tab
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTab === id) {
      setActiveTab(newTabs[newTabs.length - 1].id);
      setCurrentUrl(newTabs[newTabs.length - 1].url);
      setUrlInput(newTabs[newTabs.length - 1].url);
    }
  };

  const addTab = () => {
    const newId = Date.now();
    setTabs([...tabs, { id: newId, title: 'New Tab', url: '' }]);
    setActiveTab(newId);
    setUrlInput('');
    setCurrentUrl('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Tab Bar */}
      <div className="flex items-end h-10 px-2 gap-1 bg-slate-200 dark:bg-black/60 pt-2">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentUrl(tab.url);
              setUrlInput(tab.url);
            }}
            className={`flex items-center gap-2 max-w-[200px] min-w-[120px] px-3 py-1.5 rounded-t-lg text-xs cursor-pointer border border-b-0 border-transparent transition-colors ${
              activeTab === tab.id 
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-white/10 z-10' 
                : 'hover:bg-slate-300/50 dark:hover:bg-white/5 opacity-70'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
            <span className="truncate flex-1">{tab.title || 'New Tab'}</span>
            <button 
              className="p-1 rounded-full hover:bg-slate-300 dark:hover:bg-white/20 shrink-0"
              onClick={(e) => closeTab(tab.id, e)}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button 
          onClick={addTab}
          className="p-1.5 rounded hover:bg-slate-300 dark:hover:bg-white/10 ml-1 mb-1 transition"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 h-12 px-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-white/10">
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition">
            <ChevronLeft size={18} />
          </button>
          <button className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition opacity-50">
            <ChevronRight size={18} />
          </button>
          <button className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 500); }}>
            <RotateCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-full px-4 py-1.5 focus-within:ring-2 ring-blue-500/50">
           <Globe size={14} className="opacity-50 mr-2" />
           <input 
             type="text" 
             value={urlInput}
             onChange={(e) => setUrlInput(e.target.value)}
             className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-slate-400"
             placeholder="Search or type URL"
           />
           <button type="submit" className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-blue-500">
             <Search size={14} />
           </button>
        </form>

        <div className="flex items-center gap-1">
          <button 
            title="Toggle Unrestricted Mode"
            onClick={() => setIsProxyEnabled(!isProxyEnabled)}
            className={`p-1.5 rounded-full transition ${isProxyEnabled ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-white/10'}`}
          >
            <Shield size={18} />
          </button>
          <button className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 bg-white dark:bg-[#1a1a1a] relative overflow-hidden flex flex-col">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {currentUrl ? (
          <div className="flex-1 flex flex-col">
            <div className="bg-blue-600 text-white text-[10px] py-1 px-4 flex justify-between items-center shrink-0">
               <span className="truncate mr-4">Viewing: {currentUrl}</span>
               <div className="flex gap-4 shrink-0">
                  <button 
                    onClick={() => window.open(currentUrl, '_blank')}
                    className="hover:underline font-bold"
                  >
                    Open in New Tab ↗
                  </button>
                  <button 
                    onClick={() => setIsProxyEnabled(!isProxyEnabled)}
                    className="hover:underline font-bold"
                  >
                    {isProxyEnabled ? 'Standard Mode' : 'Unrestricted Mode'}
                  </button>
               </div>
            </div>
            <iframe 
              src={getIframeUrl()} 
              className="flex-1 w-full border-none bg-white"
              title="Browser Viewport"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              onLoad={() => setLoading(false)}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-12 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800">
             <div className="max-w-4xl mx-auto">
               <div className="flex flex-col items-center text-center mb-12">
                 <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl mb-6">
                   <Globe size={40} />
                 </div>
                 <h2 className="text-4xl font-bold mb-4 tracking-tight">Microsoft Edge</h2>
                 <p className="text-lg opacity-60 max-w-lg">Discover the web with the next-generation desktop browser.</p>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {verifiedSites.map(site => (
                   <button
                     key={site.id}
                     onClick={() => {
                        setUrlInput(site.url);
                        setCurrentUrl(site.url);
                        setTabs(tabs.map(t => t.id === activeTab ? { ...t, url: site.url, title: site.name } : t));
                        setLoading(true);
                     }}
                     className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl flex flex-col items-center gap-4 hover:shadow-xl hover:scale-105 transition-all group"
                   >
                     <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center p-2 group-hover:bg-blue-600/10 transition-colors">
                        <img src={site.icon} alt={site.name} className="w-8 h-8 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        <Globe size={24} className="text-blue-500" />
                     </div>
                     <span className="font-semibold text-sm">{site.name}</span>
                   </button>
                 ))}
                 
                 <button
                   onClick={() => window.open('https://youtube.com', '_blank')}
                   className="bg-rose-600/10 border border-rose-500/20 p-6 rounded-2xl flex flex-col items-center gap-4 hover:shadow-xl hover:scale-105 transition-all text-rose-500"
                 >
                   <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center text-white">
                      <Search size={24} />
                   </div>
                   <span className="font-semibold text-sm">YouTube ↗</span>
                 </button>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

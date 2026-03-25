import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Home, Search, Star, MoreVertical, Plus, X } from 'lucide-react';

export default function BrowserApp({ windowId }: { windowId: string }) {
  const [urlInput, setUrlInput] = useState('windows12.dev');
  const [currentUrl, setCurrentUrl] = useState('windows12.dev');
  const [tabs, setTabs] = useState([{ id: 1, title: 'Windows 12 Simulation', url: 'windows12.dev' }]);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);

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
            <span className="truncate flex-1">{tab.title}</span>
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
          <button className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition">
            <Home size={18} />
          </button>
        </div>

        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-full px-4 py-1.5 focus-within:ring-2 ring-blue-500/50">
           <Search size={14} className="opacity-50 mr-2" />
           <input 
             type="text" 
             value={urlInput}
             onChange={(e) => setUrlInput(e.target.value)}
             className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-slate-400"
             placeholder="Search the web or type a URL"
           />
           <button type="button" className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400">
             <Star size={14} />
           </button>
        </form>

        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">D</div>
          </button>
          <button className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 bg-white dark:bg-slate-950 relative overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : currentUrl === 'windows12.dev' || currentUrl === '' ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
            <h1 className="text-5xl font-light mb-6">Windows 12 Demo Homepage</h1>
            <p className="max-w-md text-slate-600 dark:text-slate-400 mb-8">
              Welcome to the simulated Edge Browser. Since this is an iframe environment inside a React app, external websites may refuse to connect due to cross-origin policies (X-Frame-Options: SAMEORIGIN).
            </p>
            <div className="flex gap-4">
              <a href="https://wikipedia.org" target="_blank" rel="noreferrer" className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500 transition">Open Wikipedia in new tab</a>
              <button 
                onClick={() => { setUrlInput('wikipedia.org'); setTabs(tabs.map(t => t.id === activeTab ? {...t, url: 'wikipedia.org'} : t)); handleNavigate({preventDefault: () => {}} as any); }}
                className="px-6 py-2 bg-slate-300 dark:bg-white/10 rounded shadow hover:bg-slate-400 dark:hover:bg-white/20 transition"
              >
                Try an Iframe
              </button>
            </div>
          </div>
        ) : (
          <iframe 
            src={currentUrl.startsWith('http') ? currentUrl : `https://${currentUrl}`} 
            className="w-full h-full border-none"
            title="Browser Viewport"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  );
}

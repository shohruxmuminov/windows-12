import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, TrendingUp, Newspaper, X, Search, Settings } from 'lucide-react';
import { useSystemStore } from '@/store/systemStore';

export default function WidgetsPanel() {
  const { isWidgetsOpen, setWidgetsOpen } = useSystemStore();

  if (!isWidgetsOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex pointer-events-none">
        <div className="absolute inset-0 bg-black/5 pointer-events-auto" onClick={() => setWidgetsOpen(false)} />
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-[400px] h-[calc(100vh-48px)] bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-3xl border-r border-white/10 p-6 flex flex-col pointer-events-auto shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold opacity-90">Widgets</h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/10 rounded-full transition"><Settings size={20} /></button>
              <button 
                onClick={() => setWidgetsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition"
              ><X size={20} /></button>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} />
            <input 
              type="text" 
              placeholder="Search the web"
              className="w-full bg-white/50 dark:bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 outline-none focus:ring-2 ring-blue-500/50 transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {/* Weather Widget */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm opacity-80">Washington, D.C.</p>
                    <h3 className="text-4xl font-bold">24°C</h3>
                  </div>
                  <Cloud size={48} />
               </div>
               <p className="text-sm">Mostly Cloudy • H:26° L:19°</p>
            </div>

            {/* Stocks Widget */}
            <div className="bg-white/50 dark:bg-white/5 rounded-2xl p-5 border border-white/10">
               <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-emerald-500" />
                  <span className="font-semibold text-sm">Market Watch</span>
               </div>
               <div className="space-y-3">
                 {[
                   { symbol: 'MSFT', price: '425.22', change: '+1.2%' },
                   { symbol: 'AAPL', price: '189.12', change: '-0.4%' },
                   { symbol: 'GOOGL', price: '172.50', change: '+2.1%' },
                 ].map(stock => (
                   <div key={stock.symbol} className="flex justify-between items-center">
                     <span className="text-sm font-medium">{stock.symbol}</span>
                     <div className="text-right">
                       <p className="text-sm font-bold">${stock.price}</p>
                       <p className={`text-[10px] ${stock.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{stock.change}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* News Widget */}
            <div className="bg-white/50 dark:bg-white/5 rounded-2xl p-5 border border-white/10">
               <div className="flex items-center gap-2 mb-4">
                  <Newspaper size={18} className="text-blue-500" />
                  <span className="font-semibold text-sm">Top Stories</span>
               </div>
               <div className="space-y-4">
                 <div className="group cursor-pointer">
                    <p className="text-xs text-blue-500 mb-1">Tech • 2h ago</p>
                    <h4 className="text-sm font-bold group-hover:underline">Windows 12 Web OS Preview Released with Advanced Creativity Tools</h4>
                 </div>
                 <div className="w-full h-px bg-white/10" />
                 <div className="group cursor-pointer">
                    <p className="text-xs text-blue-500 mb-1">Space • 5h ago</p>
                    <h4 className="text-sm font-bold group-hover:underline">Artemis III: New details emerge about lunar landing sites</h4>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

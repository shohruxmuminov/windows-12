import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, MessageSquare, Zap, Lightbulb, Shield } from 'lucide-react';
import { useSystemStore } from '@/store/systemStore';

export default function Copilot() {
  const { isCopilotOpen, setCopilotOpen } = useSystemStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Windows 12 AI Copilot. How can I help you today?' }
  ]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulated AI Response
    setTimeout(() => {
      let response = "That's a great question! In Windows 12, everything is designed to be seamless. ";
      if (input.toLowerCase().includes('wallpaper')) {
        response = "You can change the wallpaper in Settings > Personalization. Alternatively, right-click the desktop and select 'Personalize'.";
      } else if (input.toLowerCase().includes('dark mode')) {
        response = "I've detected you're interested in themes. You can toggle Dark Mode in the Settings app.";
      } else if (input.toLowerCase().includes('who are you')) {
        response = "I am an AI assistant built to help you navigate this Windows 12 Web Simulator.";
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  };

  const suggestions = [
    { icon: Zap, label: 'Change wallpaper' },
    { icon: Lightbulb, label: 'How to use Terminal?' },
    { icon: Shield, label: 'System security' },
  ];

  return (
    <AnimatePresence>
      {isCopilotOpen && (
        <>
          {/* Overlay for clicking outside */}
          <div 
            className="fixed inset-0 z-[60] bg-transparent" 
            onClick={() => setCopilotOpen(false)} 
          />
          
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-2 right-2 bottom-14 w-[400px] bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl z-[70] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2 text-blue-400">
                <Sparkles size={20} />
                <span className="font-semibold">Copilot</span>
              </div>
              <button 
                onClick={() => setCopilotOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5 shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                 </div>
               ))}
               
               {messages.length === 1 && (
                 <div className="pt-4 grid grid-cols-1 gap-2">
                    <p className="text-xs text-slate-500 mb-2 ml-1">Suggestions</p>
                    {suggestions.map((s, idx) => (
                      <button 
                        key={idx}
                        onClick={() => { setInput(s.label); handleSend(); }}
                        className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs text-left transition-colors group"
                      >
                        <s.icon size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
                        <span>{s.label}</span>
                      </button>
                    ))}
                 </div>
               )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/20 border-t border-white/10">
              <form 
                onSubmit={handleSend}
                className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-blue-500/50 focus-within:bg-white/10 transition-all shadow-inner"
              >
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="bg-transparent border-none outline-none flex-1 text-sm text-white placeholder-white/30"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="ml-2 text-blue-400 hover:text-blue-300 disabled:opacity-30 transition-all p-1"
                >
                  <Send size={18} />
                </button>
              </form>
              <div className="mt-3 flex items-center justify-center gap-2 opacity-50">
                 <MessageSquare size={12} />
                 <span className="text-[10px]">Preview version - AI generated content</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

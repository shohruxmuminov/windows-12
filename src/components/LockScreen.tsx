import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '@/store/systemStore';
import { ArrowRight, Wifi, Battery } from 'lucide-react';

export default function LockScreen() {
  const { wallpaper, setLocked, setUser } = useSystemStore();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    // Default demo login
    setUser({ name: 'Demo User', avatar: '', isGuest: false });
    setLocked(false);
  };

  const handleInteract = () => {
    if (!showLogin) setShowLogin(true);
  };

  return (
    <div 
      className="absolute inset-0 z-50 overflow-hidden text-white"
      onClick={handleInteract}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleInteract();
        if (e.key === 'Escape') setShowLogin(false);
      }}
      tabIndex={0}
      autoFocus
    >
      {/* Background with blur transition */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${wallpaper})`,
          filter: showLogin ? 'blur(20px) brightness(0.7)' : 'blur(0px) brightness(1)'
        }}
      />

      <AnimatePresence>
        {!showLogin ? (
          <motion.div 
            key="lock-info"
            className="absolute inset-0 flex flex-col items-center justify-center mt-[-20vh]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-8xl font-light tracking-tight drop-shadow-lg">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h1>
            <h2 className="text-2xl mt-4 font-medium drop-shadow-md">
              {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            <p className="absolute bottom-16 opacity-70 animate-pulse text-sm">
              Click or press a key to unlock
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="login-form"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-32 h-32 rounded-full bg-blue-600 border-4 border-white/20 shadow-2xl flex items-center justify-center mb-6 overflow-hidden relative">
               <span className="text-4xl font-bold tracking-wider">DU</span>
               <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
            </div>
            
            <h2 className="text-3xl font-semibold mb-8 drop-shadow-md">Demo User</h2>
            
            <form onSubmit={handleLogin} className="flex flex-col items-center gap-4 relative">
              <div className="relative flex items-center">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PIN or Password"
                  className="bg-black/40 border border-white/20 rounded-full px-6 py-3 w-72 backdrop-blur-md outline-none focus:border-blue-400 focus:bg-black/60 transition-all text-center text-lg placeholder:text-white/50"
                  autoFocus
                />
                <button 
                  type="submit"
                  className="absolute right-2 p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <ArrowRight className="w-5 h-5 opacity-70" />
                </button>
              </div>
              <p className="text-xs text-white/50">Any password will work in this demo</p>
            </form>

            <button 
               className="mt-12 text-sm opacity-80 hover:opacity-100 hover:underline transition-all"
               onClick={() => {
                 setUser({ name: 'Guest', avatar: '', isGuest: true });
                 setLocked(false);
               }}
            >
              Log in as Guest
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent corner icons */}
      <div className="absolute bottom-6 right-8 flex gap-4 opacity-80">
        <Wifi className="w-5 h-5 drop-shadow-md" />
        <Battery className="w-5 h-5 drop-shadow-md" />
      </div>
    </div>
  );
}

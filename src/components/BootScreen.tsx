import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '@/store/systemStore';
import { Loader2 } from 'lucide-react';
import { soundManager } from '@/utils/SoundManager';

export default function BootScreen() {
  const [progress, setProgress] = useState(0);
  const setBooted = useSystemStore(state => state.setBooted);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          soundManager.play('startup');
          setTimeout(() => setBooted(true), 1500); // Wait a bit more for the sound
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [setBooted]);

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white z-[100]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center space-y-8"
      >
        {/* Windows-style icon placeholder */}
        <div className="grid grid-cols-2 gap-1 mb-8">
          <div className="w-12 h-12 bg-[#00A4EF] rounded-sm transform skew-y-6" />
          <div className="w-12 h-12 bg-[#00A4EF] rounded-sm transform -skew-y-6" />
          <div className="w-12 h-12 bg-[#00A4EF] rounded-sm transform -skew-y-6" />
          <div className="w-12 h-12 bg-[#00A4EF] rounded-sm transform skew-y-6" />
        </div>
        
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-white/50" />
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
            <div 
              className="h-full bg-white transition-all duration-200 ease-out"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

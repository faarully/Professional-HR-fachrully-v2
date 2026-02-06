import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Marquee = ({ skills }) => {
  const [marqueeItems, setMarqueeItems] = useState([]);
  
  if (!skills || skills.length === 0) return null;

  const colors = [
    'text-[#BC8F8F] dark:text-[#D2B48C]',
    'text-[#DEB887] dark:text-[#F4A460]',
    'text-[#98FB98] dark:text-[#AFEEEE]',
    'text-[#B0C4DE] dark:text-[#D8BFD8]',
  ];

  useEffect(() => {
    const duplicatedItems = [...skills, ...skills, ...skills, ...skills];
    setMarqueeItems(duplicatedItems);
  }, [skills]);

  return (
    <div className="relative py-6 md:py-8 my-8 lg:my-24 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800 overflow-hidden whitespace-nowrap z-0 transition-colors duration-500">
      
      {/* Gradient Overlay */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-slate-50 dark:from-slate-900 via-slate-50/80 dark:via-slate-900/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-slate-50 dark:from-slate-900 via-slate-50/80 dark:via-slate-900/80 to-transparent z-10 pointer-events-none" />

      {/* Container utama dengan dua animasi untuk seamless loop */}
      <div className="relative flex overflow-hidden">
        {/* First marquee (utama) */}
        <motion.div 
          animate={{ 
            x: ['0%', '-100%']
          }} 
          transition={{ 
            repeat: Infinity, 
            duration: 150, 
            ease: "linear",
            repeatType: "loop"
          }} 
          className="flex items-center flex-shrink-0 min-w-full"
        >
          {marqueeItems.map((s, idx) => {
            const colorClass = colors[idx % colors.length];
            return (
              <span 
                key={`first-${idx}`} 
                /* PENYESUAIAN: 
                   - text-sm pada mobile, text-4xl pada desktop 
                   - mx-6 pada mobile, mx-16 pada desktop
                */
                className={`text-sm md:text-4xl font-black uppercase tracking-[0.2em] mx-6 md:mx-16 italic cursor-default select-none transition-all duration-700 drop-shadow-sm hover:brightness-110 flex-shrink-0 ${colorClass}`}
              >
                {s[0]}
              </span>
            );
          })}
        </motion.div>

        {/* Second marquee (duplikat untuk seamless loop) */}
        <motion.div 
          animate={{ 
            x: ['0%', '-100%']
          }} 
          transition={{ 
            repeat: Infinity, 
            duration: 150, 
            ease: "linear",
            repeatType: "loop"
          }} 
          className="flex items-center flex-shrink-0 min-w-full"
        >
          {marqueeItems.map((s, idx) => {
            const colorClass = colors[idx % colors.length];
            return (
              <span 
                key={`second-${idx}`} 
                /* PENYESUAIAN: 
                   Sama dengan di atas agar ukuran seragam saat looping
                */
                className={`text-sm md:text-4xl font-black uppercase tracking-[0.2em] mx-6 md:mx-16 italic cursor-default select-none transition-all duration-700 drop-shadow-sm hover:brightness-110 flex-shrink-0 ${colorClass}`}
              >
                {s[0]}
              </span>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Marquee;
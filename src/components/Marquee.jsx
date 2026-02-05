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
    <div className="relative py-8 my-12 lg:my-24 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800 overflow-hidden whitespace-nowrap z-0 transition-colors duration-500">
      
      {/* Gradient Overlay */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 dark:from-slate-900 via-slate-50/80 dark:via-slate-900/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 dark:from-slate-900 via-slate-50/80 dark:via-slate-900/80 to-transparent z-10 pointer-events-none" />

      {/* Container utama dengan dua animasi untuk seamless loop */}
      <div className="relative flex overflow-hidden">
        {/* First marquee (utama) - DURASI DITAMBAH 5x (150 detik) */}
        <motion.div 
          animate={{ 
            x: ['0%', '-100%']
          }} 
          transition={{ 
            repeat: Infinity, 
            duration: 500, // DARI 30 DETIK MENJADI 150 DETIK (5x lebih lambat)
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
                className={`text-2xl md:text-4xl font-black uppercase tracking-[0.2em] mx-10 md:mx-16 italic cursor-default select-none transition-all duration-700 drop-shadow-sm hover:brightness-110 flex-shrink-0 ${colorClass}`}
              >
                {s[0]}
              </span>
            );
          })}
        </motion.div>

        {/* Second marquee (duplikat untuk seamless loop) - DURASI SAMA */}
        <motion.div 
          animate={{ 
            x: ['0%', '-100%']
          }} 
          transition={{ 
            repeat: Infinity, 
            duration: 150, // DURASI SAMA 150 DETIK
            ease: "linear",
            repeatType: "loop"
          }} 
          className="flex items-center flex-shrink-0 min-w-full"
          style={{ marginLeft: '0%' }}
        >
          {marqueeItems.map((s, idx) => {
            const colorClass = colors[idx % colors.length];
            return (
              <span 
                key={`second-${idx}`} 
                className={`text-2xl md:text-4xl font-black uppercase tracking-[0.2em] mx-10 md:mx-16 italic cursor-default select-none transition-all duration-700 drop-shadow-sm hover:brightness-110 flex-shrink-0 ${colorClass}`}
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
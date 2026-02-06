import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Marquee = ({ skills }) => {
  const [marqueeItems, setMarqueeItems] = useState([]);
  const [isDark, setIsDark] = useState(false);
  
  if (!skills || skills.length === 0) return null;

  // Warna untuk mode light (versi gelap dari yang ada)
  const lightModeColors = [
    'text-[#8B4513]', // Dark brown (dari #BC8F8F)
    'text-[#CD853F]', // Peru (dari #DEB887)
    'text-[#006400]', // Dark green (dari #98FB98)
    'text-[#4682B4]', // Steel blue (dari #B0C4DE)
  ];

  // Warna untuk mode dark (sudah ada, tetap sama)
  const darkModeColors = [
    'text-[#D2B48C]', // Tan
    'text-[#F4A460]', // Sandy brown
    'text-[#AFEEEE]', // Pale turquoise
    'text-[#D8BFD8]', // Thistle
  ];

  // Deteksi tema saat ini
  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    // Check initial
    checkDarkMode();

    // Observe for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const duplicatedItems = [...skills, ...skills, ...skills, ...skills];
    setMarqueeItems(duplicatedItems);
  }, [skills]);

  // Pilih warna berdasarkan tema
  const colors = isDark ? darkModeColors : lightModeColors;

  return (
    <div className="relative py-6 md:py-8 my-8 lg:my-24 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800 overflow-hidden whitespace-nowrap z-0 transition-colors duration-500">
      
      {/* Gradient Overlay - sesuaikan dengan tema */}
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
            duration: 500,
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
                className={`text-sm md:text-4xl font-black uppercase tracking-[0.2em] mx-6 md:mx-16 italic cursor-default select-none transition-all duration-700 drop-shadow-sm hover:brightness-110 flex-shrink-0 ${colorClass}`}
                style={{
                  transition: 'color 0.5s ease-in-out'
                }}
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
            duration: 500,
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
                className={`text-sm md:text-4xl font-black uppercase tracking-[0.2em] mx-6 md:mx-16 italic cursor-default select-none transition-all duration-700 drop-shadow-sm hover:brightness-110 flex-shrink-0 ${colorClass}`}
                style={{
                  transition: 'color 0.5s ease-in-out'
                }}
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
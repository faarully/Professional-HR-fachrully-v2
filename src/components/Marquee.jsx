import React from 'react';
import { motion } from 'framer-motion';

const Marquee = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  // Warna tetap tegas, tapi kita gunakan varian yang sedikit lebih terang untuk dark mode agar tidak tenggelam
  const colors = [
    'text-red-500 dark:text-red-400',
    'text-yellow-500 dark:text-yellow-400',
    'text-emerald-500 dark:text-emerald-400',
    'text-blue-500 dark:text-blue-400'
  ];

  return (
    /* UBAHAN: 
       - bg-slate-50 untuk light, bg-slate-900/50 untuk dark agar teks tetap kontras.
       - border-slate-100 dan dark:border-slate-800 untuk garis pembatas yang elegan.
    */
    <div className="relative py-8 my-12 lg:my-24 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800 overflow-hidden whitespace-nowrap z-0 transition-colors duration-500">
      
      {/* Gradient Overlay: Diperbarui agar menyesuaikan warna background masing-masing mode */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 dark:from-slate-900 via-slate-50/80 dark:via-slate-900/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 dark:from-slate-900 via-slate-50/80 dark:via-slate-900/80 to-transparent z-10 pointer-events-none" />

      <motion.div 
        animate={{ x: [0, -1500] }} 
        transition={{ 
          repeat: Infinity, 
          duration: 45, 
          ease: "linear" 
        }} 
        className="flex items-center"
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center">
            {skills.map((s, idx) => {
              const colorClass = colors[idx % colors.length];
              return (
                <span 
                  key={idx} 
                  /* UBAHAN:
                     - Drop shadow dipertahankan.
                     - Filter brightness saat hover agar interaktif.
                  */
                  className={`text-2xl md:text-4xl font-black uppercase tracking-[0.2em] mx-10 md:mx-16 italic cursor-default select-none transition-all duration-700 drop-shadow-sm hover:brightness-110 ${colorClass}`}
                >
                  {s[0]}
                </span>
              );
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
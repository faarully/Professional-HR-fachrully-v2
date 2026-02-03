import React from 'react';
import { motion } from 'framer-motion';

const Expertise = ({ skills }) => {
  if (!skills) return null;
  
  return (
    <section id="expertise" className="py-24 bg-transparent relative overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: false }} 
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-[2px] bg-emerald-600"></div>
             <span className="text-emerald-600 text-[10px] font-bold tracking-[0.3em] uppercase italic">Expertise</span>
          </div>
          
          {/* PERBAIKAN DI SINI: 
              - text-3xl di mobile agar tidak terpotong.
              - Leading-tight agar spasi antar baris rapat dan elegan. 
          */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
            Strategic <br className="block md:hidden" /> {/* Force break di mobile agar seimbang */}
            <span className="text-slate-400 dark:text-slate-500">Capabilities.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((row, idx) => {
            if (!row[0]) return null;
            const parts = row[1].split(':');
            const tags = parts[1] ? parts[1].split(',') : [];
            
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: idx * 0.1, duration: 0.8 }} 
                whileHover={{ y: -10 }} 
                className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-100 dark:border-slate-800 group hover:shadow-2xl hover:shadow-emerald-100 dark:hover:shadow-emerald-900/10 transition-all duration-500 overflow-hidden"
              >
                <div className="p-8 md:p-12"> {/* Padding disesuaikan untuk mobile */}
                  <div className="mb-8">
                    {/* Menggunakan text-2xl di mobile agar box judul tidak terlalu lebar */}
                    <h3 className="text-2xl md:text-4xl font-black text-white bg-emerald-600 px-5 py-2 md:px-6 md:py-3 rounded-2xl uppercase tracking-tighter italic inline-block transform -rotate-1 group-hover:rotate-0 transition-all duration-300">
                      {parts[0]}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {tags.map((tag, i) => (
                      <motion.span 
                        key={i}
                        whileHover={{ scale: 1.1, color: '#10b981' }} 
                        className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 dark:bg-slate-800 text-[9px] md:text-[11px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest rounded-lg border border-slate-100 dark:border-slate-700 group-hover:border-emerald-100 dark:group-hover:border-emerald-800 transition-colors"
                      >
                        {tag.trim()}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
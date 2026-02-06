import React from 'react';
import { motion } from 'framer-motion';

const Expertise = ({ skills }) => {
  if (!skills) return null;
  
  return (
    <section id="expertise" className="py-24 bg-transparent relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: false }} 
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-[2px] bg-emerald-600"></div>
             <span className="text-emerald-600 text-[10px] font-bold tracking-[0.3em] uppercase italic">Expertise</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Strategic <span className="text-slate-400 dark:text-slate-500">Capabilities.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((row, idx) => {
            if (!row[0]) return null;
            const parts = row[1].split(':');
            const tags = parts[1] ? parts[1].split(',') : [];
            const title = parts[0] || "";
            
            return (
              <div 
                key={idx}
                className="bg-[#FFFFF0] dark:bg-slate-900 rounded-3xl border border-emerald-600/10 dark:border-slate-800 group 
                           hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 
                           transition-all duration-300 ease-out overflow-hidden"
              >
                <div className="p-6 md:p-12">
                  <div className="mb-8 md:mb-10">
                    <h3 
                      style={{ 
                        fontSize: 'clamp(1.25rem, 3vw, 2.25rem)',
                        letterSpacing: 'clamp(-0.02em, -0.5vw, 0.01em)',
                        hyphens: 'none',
                        wordBreak: 'keep-all',
                        lineHeight: '1.15'
                      }}
                      className="
                        /* Typography */
                        font-black text-white uppercase italic
                        /* Box Styling */
                        bg-emerald-600 px-5 sm:px-6 md:px-7 py-3 sm:py-4 md:py-5 rounded-xl md:rounded-2xl 
                        /* Transform & Shadow */
                        transform -rotate-1 md:-rotate-2 group-hover:rotate-0 transition-transform duration-500 origin-left 
                        shadow-lg shadow-emerald-600/20 
                        /* Container Logic */
                        inline-block max-w-full
                      "
                    >
                      {title}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="px-3 md:px-4 py-2 bg-emerald-600/5 dark:bg-slate-800/80 text-[10px] md:text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 uppercase tracking-widest rounded-lg border border-emerald-600/10 dark:border-slate-700 group-hover:border-emerald-500/30 transition-colors duration-300 cursor-default whitespace-normal text-left"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
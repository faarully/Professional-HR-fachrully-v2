import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Building2 } from 'lucide-react';
import { processTextBody } from '../utils/textProcessor';

const Experience = ({ experiences }) => {
  if (!experiences) return null;

  // Animasi Path untuk Garis Hijau (Tetap statis lengkungannya, hanya draw-in)
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 0.6,
      transition: { duration: 1.2, ease: "circOut", delay: 0.4 }
    }
  };

  return (
    <section id="experience" className="py-24 bg-transparent transition-colors duration-500 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER AREA */}
        <div className="mb-32 text-center relative min-h-[200px] flex flex-col items-center justify-center">
          
          {/* Label Tetap */}
          <span className="text-emerald-600/70 text-[10px] font-bold tracking-[0.4em] uppercase mb-8 block">
            Career Journey
          </span>

          <div className="relative flex flex-wrap justify-center items-center md:gap-6">
            
            {/* GRUP LEFT: Professional (Masuk dari Kiri) */}
            <motion.div 
              initial={{ x: -120, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // smooth ease out
              className="relative pb-6"
            >
              <h2 className="text-4xl md:text-7xl font-bold text-slate-900 dark:text-slate-200 uppercase tracking-tightest leading-none">
                Professional
              </h2>
              <svg className="absolute -bottom-2 left-0 w-full h-8 overflow-visible pointer-events-none">
                <motion.path 
                  d="M 0 10 Q 150 30 300 10" 
                  variants={lineVariants}
                  initial="hidden"
                  whileInView="visible"
                  stroke="#10b981" 
                  strokeWidth="4" 
                  fill="none" 
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* GRUP RIGHT: Timeline (Masuk dari Kanan) */}
            <motion.div 
              initial={{ x: 120, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative pt-6"
            >
              <svg className="absolute -top-2 left-0 w-full h-8 overflow-visible pointer-events-none">
                <motion.path 
                  d="M 0 15 Q 150 -5 300 15" 
                  variants={lineVariants}
                  initial="hidden"
                  whileInView="visible"
                  stroke="#10b981" 
                  strokeWidth="4" 
                  fill="none" 
                  strokeLinecap="round"
                />
              </svg>
              <h2 className="text-4xl md:text-7xl font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tightest leading-none">
                Timeline.
              </h2>
            </motion.div>
          </div>
        </div>

        {/* CONTAINER EXPERIENCE (Logika Card tetap) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="space-y-12"
        >
          {experiences.map((row, idx) => {
            const logoUrl = row[1] && row[1].trim() !== "" ? row[1] : null;
            return (
              <motion.div 
                key={`experience-card-${idx}`} 
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.4 } }}
                className="group relative p-8 md:p-12 bg-white/40 dark:bg-white/[0.02] rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 hover:bg-white dark:hover:bg-white/[0.04] transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                  <div className="w-full lg:w-1/3">
                    <div className="text-emerald-600/60 font-bold text-[11px] mb-4 uppercase tracking-[0.2em]">{row[3]} — {row[4]}</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-300 uppercase tracking-tightest leading-tight group-hover:text-emerald-600 transition-colors duration-500 mb-8">{row[0]}</h3>
                    <div className="flex items-center gap-4 mt-8">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-110">
                        {logoUrl ? <img src={logoUrl} alt={row[2]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" /> : <Building2 size={20} className="text-slate-400 dark:text-slate-600" />}
                      </div>
                      <div className="text-slate-800 dark:text-slate-400 font-bold uppercase text-[12px] tracking-widest leading-tight">{row[2]}</div>
                    </div>
                  </div>

                  <div className="hidden lg:block relative self-stretch w-[1px] bg-slate-200 dark:bg-white/5">
                    {/* Lightsaber effect tetap dipertahankan karena keren pas di-scroll */}
                    <div className="absolute left-0 w-full h-full bg-transparent overflow-hidden">
                       {/* Logika saber line di sini bisa disesuaikan jika perlu */}
                    </div>
                  </div>

                  <div className="flex-1 lg:pl-6 space-y-10">
                    <div className="max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-500">{processTextBody(row[5])}</div>
                    {row[6] && row[6].trim() !== "" && (
                      <div className="mt-10 p-10 rounded-[2rem] relative overflow-hidden group/project border transition-all duration-700 bg-slate-200/30 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/10 dark:shadow-none">
                        <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] dark:opacity-[0.05] transition-transform duration-1000 group-hover/project:scale-125 group-hover/project:-rotate-12 text-slate-900 dark:text-emerald-400"><Zap size={140} fill="currentColor" /></div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-8">
                            <Zap size={14} className="text-emerald-500/50 fill-current" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-emerald-600/70 dark:text-emerald-500/50">Notable Project</span>
                          </div>
                          <div className="max-w-2xl">{processTextBody(row[6], true)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
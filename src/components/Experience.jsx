import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Building2 } from 'lucide-react';
import { processTextBody } from '../utils/textProcessor';

const Experience = ({ experiences }) => {
  if (!experiences) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.98 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1], 
      }
    },
  };

  return (
    <section id="experience" className="py-24 bg-white dark:bg-[#0f172a] transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-20 text-center"
        >
          <span className="text-emerald-600 text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block italic">Career Journey</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Professional <span className="text-slate-400 dark:text-slate-500">Timeline.</span>
          </h2>
        </motion.div>

        {/* CONTAINER */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="space-y-12"
        >
          {experiences.map((row, idx) => {
            const logoUrl = row[1] && row[1].trim() !== "" ? row[1] : null;
            const cardRef = useRef(null);
            
            const { scrollYProgress } = useScroll({
              target: cardRef,
              offset: ["start end", "end start"]
            });
            const saberPos = useTransform(scrollYProgress, [0, 1], ["-100%", "200%"]);

            return (
              <motion.div 
                ref={cardRef}
                key={`experience-card-${idx}`} 
                variants={cardVariants}
                // RESPONSIVE HOVER: Membesar 4% dengan transisi cepat
                whileHover={{ 
                  scale: 1.04,
                  y: -8,
                  zIndex: 50,
                  transition: { 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  }
                }}
                className="group relative p-8 md:p-12 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900/80 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                  
                  {/* LEFT SIDE */}
                  <div className="w-full lg:w-1/3">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "3rem" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-[2px] bg-emerald-600 mb-8" 
                    />
                    <div className="text-emerald-600 font-bold italic text-sm mb-3 uppercase tracking-widest">
                      {row[3]} — {row[4]}
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none group-hover:text-emerald-600 transition-colors duration-500">
                      {row[0]}
                    </h3>
                    
                    <div className="flex items-center gap-5 mt-8">
                      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-110">
                        {logoUrl ? (
                          <img src={logoUrl} alt={row[2]} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 size={24} className="text-slate-400 dark:text-slate-500" />
                        )}
                      </div>
                      <div className="text-slate-900 dark:text-white font-black uppercase text-[13px] tracking-tighter leading-tight">
                        {row[2]}
                      </div>
                    </div>
                  </div>

                  {/* CENTER DIVIDER */}
                  <div className="hidden lg:block relative self-stretch w-[1px] bg-slate-200 dark:bg-slate-800/50">
                    <motion.div 
                      style={{ top: saberPos }}
                      className="absolute left-0 w-full h-40 blur-[4px] bg-gradient-to-b from-transparent via-emerald-400 to-transparent dark:via-blue-500 z-0"
                    />
                    <motion.div 
                      style={{ top: saberPos }}
                      className="absolute left-0 w-full h-40 bg-gradient-to-b from-transparent via-emerald-300 to-transparent dark:via-blue-400 z-10"
                    />
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex-1 lg:pl-6 space-y-10">
                    <div className="max-w-3xl">
                      {processTextBody(row[5])}
                    </div>

                    {/* NOTABLE PROJECT BOX */}
                    {row[6] && row[6].trim() !== "" && (
                      <div className="mt-10 p-10 rounded-[2.5rem] relative overflow-hidden group/project border transition-all duration-700 
                          bg-gradient-to-br from-white via-slate-50 to-slate-100
                          dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#020617]
                          border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
                      >
                        <div className="absolute -top-6 -right-6 p-4 opacity-[0.05] dark:opacity-[0.1] transition-transform duration-1000 group-hover/project:scale-125 group-hover/project:-rotate-12 text-slate-900 dark:text-blue-400">
                          <Zap size={140} fill="currentColor" />
                        </div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-8">
                            <Zap size={18} className="text-emerald-500 fill-current" />
                            <span className="text-[12px] font-black uppercase tracking-[0.4em] italic text-emerald-600 dark:text-emerald-400">
                              Notable Project
                            </span>
                          </div>
                          <div className="max-w-2xl">
                            {processTextBody(row[6], true)}
                          </div>
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
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Building2 } from 'lucide-react'; // Tambah icon Building2
import { processTextBody } from '../utils/textProcessor';

const Experience = ({ experiences }) => {
  if (!experiences) return null;

  return (
    <section id="experience" className="py-24 bg-white dark:bg-[#0f172a] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="mb-16 text-center"
        >
          <span className="text-emerald-600 text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block italic">Career Journey</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Professional <span className="text-slate-400 dark:text-slate-500">Timeline.</span>
          </h2>
        </motion.div>

        {/* TIMELINE ITEMS */}
        <div className="space-y-12">
          {experiences.map((row, idx) => {
            const logoUrl = row[1] && row[1].trim() !== "" ? row[1] : null;

            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }} 
                transition={{ duration: 0.8, ease: "easeOut" }} 
                className="group relative p-8 md:p-12 bg-slate-50 dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-100 dark:hover:shadow-emerald-500/5 transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
                  
                  {/* LEFT SIDE: Posisi, Waktu, & Logo */}
                  <div className="w-full lg:w-1/3">
                    <motion.div 
                      initial={{ scaleX: 0 }} 
                      whileInView={{ scaleX: 1 }} 
                      viewport={{ once: true }} 
                      transition={{ duration: 1, delay: 0.2 }} 
                      className="h-1 w-12 bg-emerald-600 mb-6 origin-left" 
                    />
                    
                    <div className="text-emerald-600 font-bold italic text-sm mb-2">
                      {row[3]} — {row[4]}
                    </div>

                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight group-hover:text-emerald-600 transition-colors duration-300">
                      {row[0]}
                    </h3>

                    {/* LOGO & NAMA PERUSAHAAN (Indeks 1 & 2) */}
                    <div className="flex items-center gap-4 mt-6">
                      <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                        {logoUrl ? (
                          <img 
                            src={logoUrl} 
                            alt={row[2]} 
                            className="w-full h-full object-cover" // Menggunakan object-cover agar memenuhi box
                            onError={(e) => {
                              // Jika error, ganti ke icon gedung
                              e.target.onerror = null; 
                              e.target.parentNode.innerHTML = '<div class="text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg></div>';
                            }}
                          />
                        ) : (
                          <Building2 size={20} className="text-slate-400 dark:text-slate-500" />
                        )}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-widest leading-tight">
                        {row[2]}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE: Deskripsi & Project */}
                  <div className="flex-1 lg:border-l lg:border-slate-200 lg:dark:border-slate-700 lg:pl-12 space-y-8">
                    <div className="max-w-2xl text-slate-950 dark:!text-white [&_*]:dark:!text-white text-base font-medium leading-relaxed text-justify">
                      {processTextBody(row[5])}
                    </div>

                    {/* NOTABLE PROJECT BOX */}
                    {row[6] && row[6].trim() !== "" && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        whileInView={{ opacity: 1, x: 0 }} 
                        viewport={{ once: true }} 
                        className="mt-8 p-8 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950 rounded-2xl relative overflow-hidden group/project border border-white/10"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-white group-hover/project:scale-125 transition-transform duration-500">
                          <Zap size={64} fill="currentColor" />
                        </div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-6">
                            <Zap size={14} className="text-emerald-400 fill-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 italic">Notable Project</span>
                          </div>
                          <div className="max-w-2xl text-white !opacity-100 [&_*]:text-white font-medium">
                            {processTextBody(row[6], true)}
                          </div>
                        </div>
                      </motion.div>
                    )}
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

export default Experience;
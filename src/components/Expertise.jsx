import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Expertise = ({ skills }) => {
  const [jiggledIndices, setJiggledIndices] = useState(new Set());
  const containerRef = useRef(null);

  if (!skills) return null;

  // Deteksi scroll visibility untuk setiap kartu
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !jiggledIndices.has(entry.target.dataset.index)) {
            setJiggledIndices(prev => new Set([...prev, entry.target.dataset.index]));
          }
        });
      },
      { threshold: 0.3 }
    );

    const cards = containerRef.current?.querySelectorAll('[data-index]');
    if (cards) {
      cards.forEach(el => observer.observe(el));
    }

    return () => observer.disconnect();
  }, [jiggledIndices]);

  return (
    <section id="expertise" className="py-24 bg-transparent relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
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

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((row, idx) => {
            if (!row[0]) return null;
            const parts = row[1].split(':');
            const tags = parts[1] ? parts[1].split(',') : [];
            const title = parts[0] || "";

            // Jiggle animation variants (only for outer card)
            const jiggleVariants = {
              idle: { x: 0, y: 0 },
              jiggle: {
                x: [0, -2, 2, -1, 1, 0],
                y: [0, -1, 1, -0.5, 0.5, 0],
                transition: {
                  duration: 0.6,
                  repeat: 2,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: 0.1 * idx
                }
              }
            };

            return (
              <motion.div
                key={idx}
                data-index={idx}
                initial="idle"
                animate={jiggledIndices.has(idx.toString()) ? "jiggle" : "idle"}
                variants={jiggleVariants}
                className="bg-[#FFFFF0] dark:bg-slate-900 rounded-3xl border border-emerald-600/10 dark:border-slate-800 group 
                           hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 
                           transition-all duration-300 ease-out overflow-hidden"
              >
                {/* Konten dalam — TIDAK DIANIMASIKAN (stabil) */}
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
                        font-black text-white uppercase italic
                        bg-emerald-600 px-5 sm:px-6 md:px-7 py-3 sm:py-4 md:py-5 rounded-xl md:rounded-2xl 
                        transform -rotate-1 md:-rotate-2 group-hover:rotate-0 transition-transform duration-500 origin-left 
                        shadow-lg shadow-emerald-600/20 
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Expertise;

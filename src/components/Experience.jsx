import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Building2 } from 'lucide-react';
import { processTextBody } from '../utils/textProcessor';

// Sub-component untuk handle scroll individual di tiap card
const ExperienceCard = ({ row, idx, globalScrollProgress }) => {
  const lineRef = useRef(null);
  const cardRef = useRef(null);
  // Trigger animasi mobile cuma sekali pas card masuk viewport
  const isInViewMobile = useInView(cardRef, { once: true, amount: 0.2 });
  
  const [lightSaberHeight, setLightSaberHeight] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const logoUrl = row[1] && row[1].trim() !== "" ? row[1] : null;

  useEffect(() => {
    const updateLightSaber = () => {
      if (!lineRef.current) return;

      const lineRect = lineRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const scrollbarPosition = viewportHeight * globalScrollProgress;
      const lineTop = lineRect.top;
      const lineHeight = lineRect.height;
      
      const relativeProgress = (scrollbarPosition - lineTop) / lineHeight;

      if (relativeProgress <= 0) {
        setLightSaberHeight(0);
        setIsInView(false);
      } else if (relativeProgress >= 1) {
        setLightSaberHeight(100);
        setIsInView(false);
      } else {
        setLightSaberHeight(relativeProgress * 100);
        setIsInView(true);
      }
    };

    updateLightSaber();
    window.addEventListener('scroll', updateLightSaber);
    window.addEventListener('resize', updateLightSaber);
    return () => {
      window.removeEventListener('scroll', updateLightSaber);
      window.removeEventListener('resize', updateLightSaber);
    };
  }, [globalScrollProgress]);

  return (
    <motion.div 
      ref={cardRef}
      key={`experience-card-${idx}`} 
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.4 } }}
      className="group relative p-8 md:p-12 bg-white/40 dark:bg-white/[0.02] rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 hover:bg-white dark:hover:bg-white/[0.04] transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none"
    >
      {/* MOBILE BORDER LIGHTSABER ANIMATION (Sesuai gambar instruksi) */}
      <div className="absolute inset-0 lg:hidden pointer-events-none">
        <svg className="w-full h-full" fill="none">
          <rect 
            x="0" y="0" width="100%" height="100%" rx="2.5rem" 
            className="stroke-slate-200/50 dark:stroke-white/5" 
            strokeWidth="2"
          />
          <motion.rect
            x="0" y="0" width="100%" height="100%" rx="2.5rem"
            stroke="url(#saberGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInViewMobile ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            style={{ filter: 'drop-shadow(0 0 6px #10b981)' }}
          />
          <defs>
            <linearGradient id="saberGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
        <div className="w-full lg:w-1/3">
          <div className="text-emerald-700/70 dark:text-emerald-500/60 font-bold text-[11px] mb-4 uppercase tracking-[0.2em]">{row[3]} — {row[4]}</div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-300 uppercase tracking-tightest leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition-colors duration-500 mb-8">{row[0]}</h3>
          <div className="flex items-center gap-4 mt-8">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-110">
              {logoUrl ? <img src={logoUrl} alt={row[2]} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" /> : <Building2 size={20} className="text-slate-400 dark:text-slate-600" />}
            </div>
            <div className="text-slate-800 dark:text-slate-400 font-bold uppercase text-[12px] tracking-widest leading-tight">{row[2]}</div>
          </div>
        </div>

        {/* GARIS TENGAH (DESKTOP ONLY) */}
        <div ref={lineRef} className="hidden lg:block relative self-stretch w-[2px] bg-slate-200 dark:bg-white/5">
          <motion.div 
            style={{ height: `${lightSaberHeight}%` }}
            transition={{ duration: 0, ease: "linear" }}
            className="absolute left-0 w-full origin-top"
          >
            <div className="absolute inset-0 w-full bg-emerald-600 dark:bg-white z-10 shadow-[0_0_8px_rgba(5,150,105,0.4)] dark:shadow-[0_0_10px_#10b981]" />
            <div className="absolute inset-0 w-[4px] -left-[1px] bg-emerald-500 blur-[4px] opacity-0 dark:opacity-70 z-0" />
          </motion.div>
        </div>

        <div className="flex-1 lg:pl-6 space-y-10">
          <div className="max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-500">{processTextBody(row[5])}</div>
          {row[6] && row[6].trim() !== "" && (
            <div className="mt-10 p-10 rounded-[2rem] relative overflow-hidden group/project border transition-all duration-700 bg-slate-200/30 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/10 dark:shadow-none">
              <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] dark:opacity-[0.05] transition-transform duration-1000 group-hover/project:scale-125 group-hover/project:-rotate-12 text-slate-900 dark:text-emerald-400"><Zap size={140} fill="currentColor" /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <Zap size={14} className="text-emerald-600/50 dark:text-emerald-500/50 fill-current" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-emerald-700/70 dark:text-emerald-500/50">Notable Project</span>
                </div>
                <div className="max-w-2xl">{processTextBody(row[6], true)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Experience = ({ experiences }) => {
  const [globalScrollProgress, setGlobalScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setGlobalScrollProgress(scrollTop / (docHeight || 1));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!experiences) return null;

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 0.6, transition: { duration: 1.2, ease: "circOut", delay: 0.4 } }
  };

  return (
    <section id="experience" className="py-24 bg-transparent font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-32 text-center relative min-h-[200px] flex flex-col items-center justify-center">
          <span className="text-emerald-600/70 text-[10px] font-bold tracking-[0.4em] uppercase mb-8 block">Career Journey</span>
          <div className="relative flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6">
            <motion.div initial={{ x: -120, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="relative pb-6 w-fit">
              <h2 className="text-4xl md:text-7xl font-bold text-slate-900 dark:text-slate-200 uppercase tracking-tightest leading-none">Professional</h2>
              <svg className="hidden md:block absolute -bottom-2 left-0 w-full h-8 overflow-visible pointer-events-none">
                <motion.path d="M 0 10 Q 150 30 300 10" variants={lineVariants} initial="hidden" whileInView="visible" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
              <svg className="md:hidden absolute -bottom-2 left-0 w-full h-6 overflow-visible pointer-events-none" viewBox="0 0 100 20" preserveAspectRatio="none">
                <motion.path d="M 0 5 Q 50 15 100 5" variants={lineVariants} initial="hidden" whileInView="visible" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </motion.div>
            <motion.div initial={{ x: 120, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="relative pt-6 md:pt-0 md:pb-6 w-fit">
              <svg className="hidden md:block absolute -top-2 left-0 w-full h-8 overflow-visible pointer-events-none">
                <motion.path d="M 0 15 Q 150 -5 300 15" variants={lineVariants} initial="hidden" whileInView="visible" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
              <svg className="md:hidden absolute -top-2 left-0 w-full h-6 overflow-visible pointer-events-none" viewBox="0 0 100 20" preserveAspectRatio="none">
                <motion.path d="M 0 15 Q 50 5 100 15" variants={lineVariants} initial="hidden" whileInView="visible" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
              <h2 className="text-4xl md:text-7xl font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tightest leading-none">Timeline.</h2>
            </motion.div>
          </div>
        </div>

        <div className="space-y-12">
          {experiences.map((row, idx) => (
            <ExperienceCard key={idx} row={row} idx={idx} globalScrollProgress={globalScrollProgress} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
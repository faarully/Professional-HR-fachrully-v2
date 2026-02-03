import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Mail, Linkedin } from 'lucide-react';

const Hero = ({ data }) => {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start start", "end start"] 
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacityScroll = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  if (!data) return null;
  const firstName = data['Nama']?.split(' ')[0];
  const lastName = data['Nama']?.split(' ').slice(1).join(' ');

  return (
    <section 
      ref={ref} 
      id="about" 
      className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-slate-950 pt-28 lg:pt-24 pb-32 lg:pb-40 transition-colors duration-500 font-sans"
    >
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[60%] bg-slate-100/50 dark:bg-slate-900/20 blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* FOTO DENGAN OUTLINE TEBAL DI LUAR */}
        <motion.div 
          style={{ y: isMobile ? 0 : yImage }} 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} 
          className="lg:col-span-5 order-1 relative group"
        >
          <div className="absolute -top-6 -right-6 -bottom-6 -left-6 border-[16px] border-emerald-600/10 dark:border-emerald-500/5 rounded-[2.5rem] lg:rounded-none lg:rounded-r-[12rem] pointer-events-none z-0 hidden lg:block transition-all duration-500 group-hover:scale-105" />
          
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none overflow-hidden rounded-[2rem] lg:rounded-none lg:rounded-r-[10rem] shadow-2xl bg-white dark:bg-slate-900 z-10 border-[6px] border-white dark:border-slate-800">
            <div className="absolute inset-y-0 right-0 w-1/3 z-20 bg-gradient-to-l from-white/30 dark:from-slate-950/30 to-transparent hidden lg:block" />
            <img 
              src={data['URL Photo'] || 'https://via.placeholder.com/800x1000'} 
              alt={data['Nama']} 
              className="w-full h-full object-cover transition-all duration-700" 
            />
          </div>
        </motion.div>

        {/* TEKS */}
        <motion.div 
          style={{ y: isMobile ? 0 : yText, opacity: isMobile ? 1 : opacityScroll }} 
          initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 20 : 0 }} 
          animate={{ opacity: 1, x: 0, y: 0 }} 
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} 
          className="lg:col-span-7 order-2 flex flex-col items-center lg:items-start text-center lg:text-left lg:pl-20"
        >
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="flex items-center gap-3 mb-6 mt-4 lg:mt-0">
            <span className="h-[1.5px] w-8 bg-emerald-600 hidden lg:block"></span>
            <span className="text-emerald-600 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em]">Human Resources Specialist</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, filter: 'blur(10px)' }} 
            animate={{ opacity: 1, filter: 'blur(0px)' }} 
            transition={{ delay: 0.7, duration: 1 }} 
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-[-0.05em] text-slate-900 dark:text-white uppercase mb-8"
          >
            {firstName} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-900 dark:from-emerald-400 dark:to-blue-400">{lastName}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1, duration: 1.2 }} 
            className="w-full max-w-2xl text-base md:text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-normal text-center lg:text-justify tracking-tight opacity-90"
          >
            {data['Deskripsi']}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }} className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <MapPin size={14} className="text-emerald-600" /> {data['Lokasi']}
            </div>
            <a href={`mailto:${data['Email']}`} className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-emerald-600 hover:border-emerald-200 transition-all">
              <Mail size={14} className="text-emerald-600" /> {data['Email']}
            </a>
          </motion.div>

          <motion.a 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1.4, duration: 0.8 }} 
            whileHover={{ scale: 1.02, y: -2 }} 
            whileTap={{ scale: 0.98 }} 
            href={data['Linkedin']} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center gap-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-full font-bold uppercase text-[10px] tracking-[0.25em] hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white transition-all shadow-2xl z-20"
          >
            View Professional Profile <Linkedin size={18} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
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
      className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-slate-950 pt-28 lg:pt-24 pb-32 lg:pb-40 transition-colors duration-500"
    >
      
      {/* Background Decor: Disesuaikan agar lebih halus di mode gelap */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[60%] bg-slate-100/50 dark:bg-slate-900/20 blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* FOTO */}
        <motion.div 
          style={{ y: isMobile ? 0 : yImage }} 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} 
          className="lg:col-span-5 order-1 relative"
        >
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none overflow-hidden rounded-[2rem] lg:rounded-none lg:rounded-r-[10rem] shadow-2xl bg-slate-100 dark:bg-slate-900">
            {/* Overlay Gradient: disesuaikan untuk dark mode */}
            <div className="absolute inset-0 z-10 bg-gradient-to-l from-white dark:from-slate-950 via-transparent to-transparent hidden lg:block" />
            <img 
              src={data['URL Photo'] || 'https://via.placeholder.com/800x1000'} 
              alt={data['Nama']} 
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" 
            />
          </div>
        </motion.div>

        {/* TEKS */}
        <motion.div 
          style={{ y: isMobile ? 0 : yText, opacity: isMobile ? 1 : opacityScroll }} 
          initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 20 : 0 }} 
          animate={{ opacity: 1, x: 0, y: 0 }} 
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} 
          className="lg:col-span-7 order-2 flex flex-col items-center lg:items-start text-center lg:text-left lg:pl-16"
        >
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="flex items-center gap-3 mb-6 mt-4 lg:mt-0">
            <span className="h-[1.5px] w-8 bg-emerald-600 hidden lg:block"></span>
            <span className="text-emerald-600 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] italic">Human Resources Specialist</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ delay: 0.7, duration: 1 }} className="text-4xl md:text-7xl lg:text-[5.1rem] font-black leading-[1] lg:leading-[0.9] tracking-tighter text-slate-900 dark:text-white uppercase mb-6">
            {firstName} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-900 dark:from-emerald-400 dark:to-blue-400">{lastName}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.2 }} className="max-w-xl text-sm md:text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium text-center lg:text-justify">
            {data['Deskripsi']}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }} className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
            {/* Info Badges */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic">
              <MapPin size={12} className="text-emerald-600" /> {data['Lokasi']}
            </div>
            <a href={`mailto:${data['Email']}`} className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all italic">
              <Mail size={12} className="text-emerald-600" /> {data['Email']}
            </a>
          </motion.div>

          {/* CTA Button: Inverted color logic */}
          <motion.a 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1.4, duration: 0.8 }} 
            whileHover={{ scale: 1.02, y: -2 }} 
            whileTap={{ scale: 0.98 }} 
            href={data['Linkedin']} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center gap-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white transition-all shadow-xl z-20"
          >
            View Professional Profile <Linkedin size={16} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
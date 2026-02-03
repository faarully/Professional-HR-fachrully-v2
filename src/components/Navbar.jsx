import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Navbar = ({ whatsappNumber }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hasSnapped, setHasSnapped] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 10) {
        setScrolled(true);
        setHasSnapped(false);
      } else {
        if (scrolled) {
          setHasSnapped(true);
          setScrolled(false);
          setTimeout(() => setHasSnapped(false), 700);
        } else {
          setScrolled(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const waUrl = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : '#';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
      scrolled 
        ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 shadow-sm' 
        : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO: Menggunakan text-slate-900 untuk light, white untuk dark */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white cursor-pointer"
          onClick={(e) => handleNavClick(e, 'about')}
        >
          FACHRULLY<span className="text-emerald-600 not-italic">.</span>
        </motion.div>

        {/* MENU: Menggunakan slate-500 untuk light, white/70 untuk dark */}
        <div className="hidden md:flex space-x-12 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-white/70">
          {['About', 'Expertise', 'Experience', 'Education'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              onClick={(e) => handleNavClick(e, item.toLowerCase())} 
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-emerald-600 transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* BUTTON: Menggunakan bg-slate-900 untuk light, bg-white untuk dark */}
        <motion.a 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          href={waUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-slate-900 text-white dark:bg-white dark:text-black px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all rounded-full shadow-lg"
        >
          Contact Me
        </motion.a>
      </div>

      {/* SVG Animasi Garis Hijau (Original) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden h-[3.5px] pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 1200 4" preserveAspectRatio="none" className="block">
            <path d="M0 2 L 600 2" fill="none" stroke="#059669" strokeWidth="4" className={`transition-all duration-700 ease-in-out ${hasSnapped ? 'translate-x-[-100%] opacity-0 rotate-[-3deg]' : scrolled ? 'translate-x-0 opacity-100' : 'translate-x-[-100%] opacity-0'}`} style={{ transformOrigin: 'left center' }} />
            <path d="M600 2 L 1200 2" fill="none" stroke="#059669" strokeWidth="4" className={`transition-all duration-700 ease-in-out ${hasSnapped ? 'translate-x-[100%] opacity-0 rotate-[3deg]' : scrolled ? 'translate-x-0 opacity-100' : 'translate-x-[100%] opacity-0'}`} style={{ transformOrigin: 'right center' }} />
          </svg>
      </div>
    </nav>
  );
};

export default Navbar;
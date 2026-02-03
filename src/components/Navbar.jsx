import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ whatsappNumber }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hasSnapped, setHasSnapped] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Kunci Scroll Body saat menu mobile terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

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
    setIsOpen(false);
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

  const menuItems = ['About', 'Expertise', 'Experience', 'Education'];
  const waUrl = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : '#';

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ease-in-out ${
      isOpen 
        ? 'bg-white dark:bg-slate-950 h-screen' // Full screen saat buka agar tidak tembus
        : scrolled 
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 shadow-sm' 
          : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-[101]">
        
        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white cursor-pointer"
          onClick={(e) => handleNavClick(e, 'about')}
        >
          FACHRULLY<span className="text-emerald-600 not-italic">.</span>
        </motion.div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex space-x-12 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-white/70">
          {menuItems.map((item) => (
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

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          <motion.a 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            href={waUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hidden md:block bg-slate-900 text-white dark:bg-white dark:text-black px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all rounded-full shadow-lg"
          >
            Contact Me
          </motion.a>

          {/* HAMBURGER TOGGLE */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none relative z-[102]"
          >
            <span className={`block w-6 h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}`}></span>
            <span className={`block w-6 h-0.5 bg-slate-900 dark:bg-white mt-1 transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-slate-900 dark:bg-white mt-1 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : 'translate-y-1'}`}></span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white dark:bg-slate-950 z-[99] flex flex-col items-center justify-center space-y-10 md:hidden"
          >
            {menuItems.map((item, idx) => (
              <motion.a 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={(e) => handleNavClick(e, item.toLowerCase())} 
                className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white"
              >
                {item}<span className="text-emerald-600">.</span>
              </motion.a>
            ))}
            <motion.a 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 text-white px-12 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl"
            >
              Contact Me
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SVG Animasi Garis Hijau - Sembunyikan saat menu buka */}
      {!isOpen && (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden h-[3.5px] pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1200 4" preserveAspectRatio="none" className="block">
              <path d="M0 2 L 600 2" fill="none" stroke="#059669" strokeWidth="4" className={`transition-all duration-700 ease-in-out ${hasSnapped ? 'translate-x-[-100%] opacity-0 rotate-[-3deg]' : scrolled ? 'translate-x-0 opacity-100' : 'translate-x-[-100%] opacity-0'}`} style={{ transformOrigin: 'left center' }} />
              <path d="M600 2 L 1200 2" fill="none" stroke="#059669" strokeWidth="4" className={`transition-all duration-700 ease-in-out ${hasSnapped ? 'translate-x-[100%] opacity-0 rotate-[3deg]' : scrolled ? 'translate-x-0 opacity-100' : 'translate-x-[100%] opacity-0'}`} style={{ transformOrigin: 'right center' }} />
            </svg>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
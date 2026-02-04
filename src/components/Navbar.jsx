import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ whatsappNumber }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hasSnapped, setHasSnapped] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(false);
  
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
      setMobileSubOpen(false); 
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 20) {
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
    if (id && id.startsWith('#')) {
      if (!isHomePage) return;
      e.preventDefault();
      setIsOpen(false);
      setTimeout(() => {
        const element = document.getElementById(id.replace('#', ''));
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 10);
    } else {
      setIsOpen(false);
    }
  };

  const menuItems = [
    { name: 'About', link: '#about', homeOnly: true },
    { name: 'Expertise', link: '#expertise', homeOnly: true },
    { name: 'Experience', link: '#experience', homeOnly: true },
    { name: 'Education', link: '#education', homeOnly: true },
    { 
      name: 'My Projects', 
      link: null, 
      sub: [{ name: 'Kalkulator Pesangon', link: '/kalkulator-pesangon' }] 
    },
  ].filter(item => isHomePage || !item.homeOnly);

  const waUrl = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : '#';

  const path1Variants = {
    closed: { d: "M 2 8 L 22 8", strokeWidth: 1.5 },
    open: { d: "M 5 5 L 19 19", strokeWidth: 1.5 }
  };
  const path2Variants = {
    closed: { d: "M 8 16 L 22 16", strokeWidth: 1.5 },
    open: { d: "M 19 5 L 5 19", strokeWidth: 1.5 }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ease-in-out ${
        scrolled || isOpen
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md py-4 shadow-sm' 
          : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-[101]">
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white cursor-pointer"
            onClick={(e) => isHomePage ? handleNavClick(e, '#about') : null}
          >
            FACHRULLY<span className="text-emerald-600 not-italic">.</span>
          </Link>

          {/* DESKTOP MENU - Ditambahkan 'relative' */}
          <div className="hidden md:flex space-x-12 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-white/70 relative">
            {menuItems.map((item) => (
              <div 
                key={item.name} 
                className="relative group py-2"
                onMouseEnter={() => item.sub && setIsDropdownOpen(true)}
                onMouseLeave={() => item.sub && setIsDropdownOpen(false)}
              >
                {item.link ? (
                   <a href={item.link} onClick={(e) => handleNavClick(e, item.link)} className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative">
                     {item.name}
                     <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-emerald-600 transition-all group-hover:w-full" />
                   </a>
                ) : (
                  <button className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative">
                    {item.name}
                    {item.sub && <ChevronDown size={12} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />}
                  </button>
                )}

                {item.sub && (
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-4 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl p-2 z-[110]"
                      >
                        {item.sub.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.link}
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-3 text-[9px] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href={waUrl} target="_blank" rel="noopener noreferrer" className="hidden md:block bg-slate-900 text-white dark:bg-white dark:text-black px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all rounded-full shadow-lg">
              Contact Me
            </motion.a>

            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none relative z-[102]"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path
                    initial="closed"
                    variants={path1Variants}
                    animate={isOpen ? "open" : "closed"}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    stroke="currentColor"
                    strokeLinecap="round"
                    className="text-slate-900 dark:text-white"
                  />
                  <motion.path
                    initial="closed"
                    variants={path2Variants}
                    animate={isOpen ? "open" : "closed"}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    stroke="currentColor"
                    strokeLinecap="round"
                    className="text-slate-900 dark:text-white"
                  />
                </svg>
            </button>
          </div>
        </div>

        {!isOpen && (
          <div className="absolute bottom-0 left-0 w-full overflow-hidden h-[3.5px] pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 1200 4" preserveAspectRatio="none" className="block">
                <path d="M0 2 L 600 2" fill="none" stroke="#059669" strokeWidth="4" className={`transition-all duration-700 ease-in-out ${hasSnapped ? 'translate-x-[-100%] opacity-0 rotate-[-3deg]' : scrolled ? 'translate-x-0 opacity-100' : 'translate-x-[-100%] opacity-0'}`} style={{ transformOrigin: 'left center' }} />
                <path d="M600 2 L 1200 2" fill="none" stroke="#059669" strokeWidth="4" className={`transition-all duration-700 ease-in-out ${hasSnapped ? 'translate-x-[100%] opacity-0 rotate-[3deg]' : scrolled ? 'translate-x-0 opacity-100' : 'translate-x-[100%] opacity-0'}`} style={{ transformOrigin: 'right center' }} />
              </svg>
          </div>
        )}
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            /* Ditambahkan 'relative' di sini */
            className="fixed inset-0 bg-white dark:bg-slate-950 z-[98] flex flex-col p-8 pt-32 md:hidden overflow-y-auto relative"
          >
            {/* Ditambahkan 'relative' pada pembungkus layout */}
            <motion.div layout className="flex flex-col space-y-6 relative">
              {menuItems.map((item) => {
                const isMyProjects = item.name === 'My Projects';
                return (
                  <AnimatePresence key={item.name} mode="popLayout">
                    {(!mobileSubOpen || isMyProjects) && (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col"
                      >
                        {item.sub ? (
                          <div className="flex flex-col">
                            <motion.button 
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setMobileSubOpen(!mobileSubOpen)}
                              className="flex items-center justify-between w-full text-4xl font-black uppercase tracking-tighter transition-colors duration-300 text-left text-slate-900 dark:text-white hover:text-emerald-600 active:text-emerald-600"
                            >
                              {item.name}
                              <span className="text-emerald-600">
                                {mobileSubOpen ? <Minus size={32} /> : <Plus size={32} />}
                              </span>
                            </motion.button>
                            <AnimatePresence>
                              {mobileSubOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                  className="overflow-hidden mt-6 pl-4 border-l-2 border-emerald-600/30"
                                >
                                  {item.sub.map((subItem) => (
                                    <Link key={subItem.name} to={subItem.link} onClick={() => setIsOpen(false)} className="block text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-6 last:mb-2 hover:text-emerald-600 transition-colors duration-300">
                                      {subItem.name}<span className="text-emerald-600">.</span>
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <a href={item.link} onClick={(e) => handleNavClick(e, item.link)} className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white block hover:text-emerald-600 active:text-emerald-600 transition-colors duration-300">
                            {item.name}<span className="text-emerald-600">.</span>
                          </a>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </motion.div>

            <motion.div 
              layout
              className="mt-auto pt-10 relative"
              animate={{ opacity: mobileSubOpen ? 0 : 1, y: mobileSubOpen ? 20 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <a href={waUrl} className="block w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-center shadow-xl shadow-emerald-500/20 active:bg-emerald-700 transition-colors">
                Contact Me
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
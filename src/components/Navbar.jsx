import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ whatsappNumber }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hasSnapped, setHasSnapped] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const scrollYRef = useRef(0);
  const dropdownTimeoutRef = useRef(null);

  // Reset state saat route berubah
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsOpen(false);
    setMobileSubOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.cssText = `
        position: fixed;
        top: -${scrollYRef.current}px;
        left: 0;
        right: 0;
        overflow: hidden;
        width: 100%;
        height: 100vh;
      `;
    } else {
      document.body.style.cssText = '';
      if (scrollYRef.current !== 0) {
        window.scrollTo(0, scrollYRef.current);
        scrollYRef.current = 0;
      }
    }
    
    return () => {
      document.body.style.cssText = '';
    };
  }, [isOpen]);

  // Scroll handler dengan throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
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
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Handle navigasi dengan smooth scroll
  const handleNavClick = useCallback((e, id) => {
    if (id && id.startsWith('#')) {
      if (!isHomePage) return;
      e.preventDefault();
      
      setIsOpen(false);
      setMobileSubOpen(false);
      
      setTimeout(() => {
        const element = document.getElementById(id.replace('#', ''));
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      setIsOpen(false);
      setMobileSubOpen(false);
    }
  }, [isHomePage]);

  // Handle back button
  const handleBackClick = useCallback(() => {
    setIsOpen(false);
    setMobileSubOpen(false);
    
    setTimeout(() => {
      navigate(-1);
    }, 300);
  }, [navigate]);

  // Menu items configuration
  const menuItems = [
    { name: 'About', link: '#about', homeOnly: true },
    { name: 'Expertise', link: '#expertise', homeOnly: true },
    { name: 'Experience', link: '#experience', homeOnly: true },
    { name: 'Education', link: '#education', homeOnly: true },
    { 
      name: 'MyPROJECTS', 
      displayName: 'MyPROJECTS',
      link: null, 
      sub: [{ name: 'Kalkulator Pesangon', link: '/kalkulator-pesangon' }] 
    },
  ].filter(item => isHomePage || !item.homeOnly);

  const waUrl = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : '#';

  // Animation variants
  const path1Variants = {
    closed: { d: "M 2 8 L 22 8", strokeWidth: 1.5 },
    open: { d: "M 5 5 L 19 19", strokeWidth: 1.5 }
  };
  
  const path2Variants = {
    closed: { d: "M 8 16 L 22 16", strokeWidth: 1.5 },
    open: { d: "M 19 5 L 5 19", strokeWidth: 1.5 }
  };

  // Render nama menu item dengan formatting khusus
  const renderMenuItemName = (item) => {
    if (item.name === 'MyPROJECTS') {
      return (
        <>
          <span className="normal-case">My</span>
          <span className="uppercase">PROJECTS</span>
        </>
      );
    }
    return item.displayName || item.name;
  };

  // Toggle mobile menu
  const handleMobileMenuToggle = useCallback(() => {
    if (mobileSubOpen) {
      setMobileSubOpen(false);
      setTimeout(() => setIsOpen(prev => !prev), 150);
    } else {
      setIsOpen(prev => !prev);
    }
  }, [mobileSubOpen]);

  // Handle dropdown hover dengan delay
  const handleDropdownEnter = useCallback(() => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  }, []);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ease-in-out ${
          scrolled || isOpen
            ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md py-4 shadow-sm' 
            : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-[101]">
          {/* Logo dan Back Button */}
          <div className="flex items-center gap-4">
            {!isHomePage && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleBackClick}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
                aria-label="Go back"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </motion.button>
            )}
            
            <Link
              to="/"
              className={`text-2xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white ${
                !isHomePage ? 'ml-4 border-l border-slate-200 dark:border-slate-700 pl-4' : ''
              }`}
              onClick={(e) => isHomePage ? handleNavClick(e, '#about') : null}
              aria-label="Fachrully - Home"
            >
              FACHRULLY<span className="text-emerald-600 not-italic">.</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-12 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-white/70">
            {menuItems.map((item) => (
              <div 
                key={item.name} 
                className="relative group py-2"
                onMouseEnter={() => item.sub && handleDropdownEnter()}
                onMouseLeave={() => item.sub && handleDropdownLeave()}
              >
                {item.link ? (
                  <a 
                    href={item.link} 
                    onClick={(e) => handleNavClick(e, item.link)} 
                    className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative"
                  >
                    <span className={item.name === 'MyPROJECTS' ? '' : 'uppercase'}>
                      {renderMenuItemName(item)}
                    </span>
                    <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-emerald-600 transition-all group-hover:w-full" />
                  </a>
                ) : (
                  <button 
                    className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <span className={item.name === 'MyPROJECTS' ? '' : 'uppercase'}>
                      {renderMenuItemName(item)}
                    </span>
                    {item.sub && (
                      <ChevronDown 
                        size={12} 
                        className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      />
                    )}
                  </button>
                )}

                {/* Dropdown Menu */}
                {item.sub && (
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-4 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl p-2 z-[110]"
                        onMouseEnter={handleDropdownEnter}
                        onMouseLeave={handleDropdownLeave}
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

          {/* CTA dan Hamburger */}
          <div className="flex items-center gap-4">
            <motion.a 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              href={waUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden md:block bg-slate-900 text-white dark:bg-white dark:text-black px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all rounded-full shadow-lg"
              aria-label="Contact via WhatsApp"
            >
              Contact Me
            </motion.a>

            {/* Hamburger Button */}
            <motion.button 
              onClick={handleMobileMenuToggle}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none relative z-[150]"
              whileTap={{ scale: 0.9 }}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path
                  variants={path1Variants}
                  animate={isOpen ? "open" : "closed"}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  stroke="currentColor"
                  strokeLinecap="round"
                  className="text-slate-900 dark:text-white"
                />
                <motion.path
                  variants={path2Variants}
                  animate={isOpen ? "open" : "closed"}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  stroke="currentColor"
                  strokeLinecap="round"
                  className="text-slate-900 dark:text-white"
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Animated Border */}
        {!isOpen && (
          <div className="absolute bottom-0 left-0 w-full overflow-hidden h-[3.5px] pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1200 4" preserveAspectRatio="none" className="block">
              <path 
                d="M0 2 L 600 2" 
                fill="none" 
                stroke="#059669" 
                strokeWidth="4" 
                className={`transition-all duration-700 ease-in-out ${
                  hasSnapped 
                    ? 'translate-x-[-100%] opacity-0 rotate-[-3deg]' 
                    : scrolled 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-[-100%] opacity-0'
                }`} 
                style={{ transformOrigin: 'left center' }} 
              />
              <path 
                d="M600 2 L 1200 2" 
                fill="none" 
                stroke="#059669" 
                strokeWidth="4" 
                className={`transition-all duration-700 ease-in-out ${
                  hasSnapped 
                    ? 'translate-x-[100%] opacity-0 rotate-[3deg]' 
                    : scrolled 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-[100%] opacity-0'
                }`} 
                style={{ transformOrigin: 'right center' }} 
              />
            </svg>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 200,
              mass: 0.5
            }}
            className="fixed inset-0 bg-white dark:bg-slate-950 z-[99] flex flex-col p-8 pt-32 md:hidden overflow-y-auto"
          >
            {/* Back Button di Mobile Menu */}
            {!isHomePage && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => {
                  setIsOpen(false);
                  setMobileSubOpen(false);
                  setTimeout(() => navigate(-1), 300);
                }}
                className="absolute top-8 left-8 flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group z-[100]"
                aria-label="Go back"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back</span>
              </motion.button>
            )}

            {/* Menu Items */}
            <motion.div 
              layout 
              className="flex flex-col space-y-6 relative"
              initial={false}
            >
              {menuItems.map((item, index) => (
                <motion.div 
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.sub ? (
                    <div className="flex flex-col">
                      <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMobileSubOpen(!mobileSubOpen)}
                        className="flex items-center justify-between w-full text-4xl font-black tracking-tighter transition-colors duration-300 text-left text-slate-900 dark:text-white hover:text-emerald-600 active:text-emerald-600"
                        layout="position"
                        aria-expanded={mobileSubOpen}
                      >
                        {item.name === 'MyPROJECTS' ? (
                          <span>
                            <span className="normal-case">My</span>
                            <span className="uppercase">PROJECTS</span>
                          </span>
                        ) : (
                          <span className="uppercase">{item.displayName || item.name}</span>
                        )}
                        <motion.span 
                          animate={{ rotate: mobileSubOpen ? 45 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-emerald-600"
                        >
                          {mobileSubOpen ? <Minus size={32} /> : <Plus size={32} />}
                        </motion.span>
                      </motion.button>
                      
                      <AnimatePresence>
                        {mobileSubOpen && (
                          <motion.div
                            key="submenu"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ 
                              duration: 0.3, 
                              ease: [0.22, 1, 0.36, 1] 
                            }}
                            className="overflow-hidden"
                          >
                            <div className="mt-6 pl-4 border-l-2 border-emerald-600/30">
                              {item.sub.map((subItem) => (
                                <Link 
                                  key={subItem.name} 
                                  to={subItem.link} 
                                  onClick={() => {
                                    setIsOpen(false);
                                    setMobileSubOpen(false);
                                  }} 
                                  className="block text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-6 last:mb-2 hover:text-emerald-600 transition-colors duration-300"
                                >
                                  {subItem.name}<span className="text-emerald-600">.</span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <a 
                      href={item.link} 
                      onClick={(e) => handleNavClick(e, item.link)} 
                      className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white block hover:text-emerald-600 active:text-emerald-600 transition-colors duration-300"
                    >
                      {item.name}<span className="text-emerald-600">.</span>
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Button */}
            <motion.div 
              layout="position"
              className="mt-auto pt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: mobileSubOpen ? 0.7 : 1, 
                scale: mobileSubOpen ? 0.98 : 1,
                y: 0
              }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              <a 
                href={waUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-center shadow-xl shadow-emerald-500/20 active:bg-emerald-700 transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  setMobileSubOpen(false);
                }}
                aria-label="Contact via WhatsApp"
              >
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
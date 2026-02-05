import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';
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
  const menuRef = useRef(null);
  const mobileSubmenuRef = useRef(null);

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
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = scrollYRef.current;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY !== 0) {
        window.scrollTo(0, scrollY);
        scrollYRef.current = 0;
      }
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Skip if clicking on hamburger button
      const hamburgerButton = document.querySelector('button[aria-label*="menu"]');
      if (hamburgerButton && hamburgerButton.contains(event.target)) {
        return;
      }

      // Skip if clicking inside mobile menu
      const mobileMenu = document.querySelector('[data-mobile-menu]');
      if (mobileMenu && mobileMenu.contains(event.target)) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (isOpen) {
          setIsOpen(false);
          setMobileSubOpen(false);
        }
      }
    };

    if (isOpen) {
      // Delay untuk menghindari immediate close
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
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
  const handleNavClick = useCallback((e, id, isRoute = false) => {
    // Jika ini adalah route (bukan hash anchor)
    if (isRoute) {
      setIsOpen(false);
      setMobileSubOpen(false);
      return;
    }

    if (id && id.startsWith('#')) {
      if (!isHomePage) {
        // Jika bukan di homepage, redirect ke home dulu
        e.preventDefault();
        setIsOpen(false);
        setMobileSubOpen(false);
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(id.replace('#', ''));
          if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 300);
        return;
      }
      
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
      }, 300);
    } else {
      setIsOpen(false);
      setMobileSubOpen(false);
    }
  }, [isHomePage, navigate]);

  // Menu items configuration - UPDATED: Tambah "About Me" untuk non-homepage
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
    { name: 'About Me', link: '/', isRoute: true, showOnNonHome: true }, // Menu baru - di sebelah kanan MyPROJECTS
  ].filter(item => {
    // Tampilkan About Me hanya ketika bukan di homepage
    if (item.name === 'About Me') {
      return !isHomePage;
    }
    // Filter menu lain seperti biasa
    return isHomePage || !item.homeOnly;
  });

  const waUrl = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : '#';

  // Animation variants untuk hamburger
  const topLineVariants = {
    closed: { 
      rotate: 0, 
      y: 0,
    },
    open: { 
      rotate: 45, 
      y: 4.5,
    }
  };
  
  const middleLineVariants = {
    closed: { 
      opacity: 1,
    },
    open: { 
      opacity: 0,
    }
  };
  
  const bottomLineVariants = {
    closed: { 
      rotate: 0, 
      y: 0,
    },
    open: { 
      rotate: -45, 
      y: -4.5,
    }
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
    setIsOpen(prev => {
      const newState = !prev;
      // Reset submenu ketika menu ditutup
      if (!newState) {
        setMobileSubOpen(false);
      }
      return newState;
    });
  }, []);

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

  // Toggle mobile submenu
  const handleMobileSubToggle = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileSubOpen(prev => !prev);
  }, []);

  // Handle click on MyPROJECTS link in mobile
  const handleMobileProjectClick = useCallback((e) => {
    e.stopPropagation();
    setIsOpen(false);
    setMobileSubOpen(false);
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
        ref={menuRef}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-[101]">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-2xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white cursor-pointer"
              onClick={(e) => {
                if (isHomePage) {
                  handleNavClick(e, '#about');
                }
              }}
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
                  item.isRoute ? (
                    // Untuk route menggunakan Link component
                    <Link
                      to={item.link}
                      onClick={() => handleNavClick(null, item.link, true)}
                      className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative cursor-pointer"
                    >
                      <span className="uppercase">
                        {renderMenuItemName(item)}
                      </span>
                      <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-emerald-600 transition-all group-hover:w-full" />
                    </Link>
                  ) : (
                    // Untuk hash anchor menggunakan <a>
                    <a 
                      href={item.link} 
                      onClick={(e) => handleNavClick(e, item.link)} 
                      className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative cursor-pointer"
                    >
                      <span className={item.name === 'MyPROJECTS' ? '' : 'uppercase'}>
                        {renderMenuItemName(item)}
                      </span>
                      <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-emerald-600 transition-all group-hover:w-full" />
                    </a>
                  )
                ) : (
                  <button 
                    className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative cursor-pointer"
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
                            className="block px-4 py-3 text-[9px] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
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
              className="hidden md:block bg-slate-900 text-white dark:bg-white dark:text-black px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all rounded-full shadow-lg cursor-pointer"
              aria-label="Contact via WhatsApp"
            >
              Contact Me
            </motion.a>

            {/* Hamburger Button */}
            <motion.button 
              onClick={handleMobileMenuToggle}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none relative z-[150] cursor-pointer touch-manipulation"
              whileTap={{ scale: 0.9 }}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="relative pointer-events-none"
              >
                {/* Top line */}
                <motion.line
                  x1="2"
                  y1="7"
                  x2="22"
                  y2="7"
                  variants={topLineVariants}
                  initial="closed"
                  animate={isOpen ? "open" : "closed"}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                    duration: 0.3 
                  }}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="text-slate-900 dark:text-white"
                />
                
                {/* Middle line */}
                <motion.line
                  x1="2"
                  y1="12"
                  x2="22"
                  y2="12"
                  variants={middleLineVariants}
                  initial="closed"
                  animate={isOpen ? "open" : "closed"}
                  transition={{ 
                    duration: 0.2,
                    ease: "easeInOut"
                  }}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="text-slate-900 dark:text-white"
                />
                
                {/* Bottom line */}
                <motion.line
                  x1="2"
                  y1="17"
                  x2="22"
                  y2="17"
                  variants={bottomLineVariants}
                  initial="closed"
                  animate={isOpen ? "open" : "closed"}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                    duration: 0.3 
                  }}
                  stroke="currentColor"
                  strokeWidth="1.5"
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
            data-mobile-menu
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ 
              opacity: 0, 
              x: "100%",
              transition: {
                type: "tween",
                ease: "easeInOut",
                duration: 0.3
              }
            }}
            transition={{ 
              type: "tween", 
              ease: "easeOut",
              duration: 0.4
            }}
            className="fixed inset-0 bg-white dark:bg-slate-950 z-[99] flex flex-col p-8 pt-24 md:hidden overflow-y-auto"
            style={{ touchAction: 'pan-y' }}
          >
            {/* Menu Items */}
            <motion.div 
              className="flex flex-col space-y-6 relative"
            >
              {menuItems.map((item, index) => (
                <motion.div 
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.05 + 0.1,
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                  exit={{ 
                    opacity: 0,
                    x: 20,
                    transition: {
                      delay: (menuItems.length - index - 1) * 0.02
                    }
                  }}
                >
                  {item.sub ? (
                    <div className="flex flex-col">
                      <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={handleMobileSubToggle}
                        className="flex items-center justify-between w-full text-4xl font-black tracking-tighter transition-colors duration-300 text-left text-slate-900 dark:text-white hover:text-emerald-600 active:text-emerald-600 cursor-pointer touch-manipulation"
                        aria-expanded={mobileSubOpen}
                        type="button"
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
                          transition={{ 
                            type: "spring", 
                            stiffness: 300,
                            damping: 15,
                            duration: 0.2 
                          }}
                          className="text-emerald-600 flex-shrink-0"
                        >
                          {mobileSubOpen ? <Minus size={32} /> : <Plus size={32} />}
                        </motion.span>
                      </motion.button>
                      
                      {/* Submenu */}
                      <AnimatePresence mode="wait">
                        {mobileSubOpen && (
                          <motion.div
                            key="submenu"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ 
                              height: "auto", 
                              opacity: 1,
                              transition: {
                                height: {
                                  duration: 0.4,
                                  ease: [0.22, 1, 0.36, 1]
                                },
                                opacity: {
                                  duration: 0.3,
                                  delay: 0.1,
                                  ease: "easeOut"
                                }
                              }
                            }}
                            exit={{ 
                              height: 0, 
                              opacity: 0,
                              transition: {
                                height: {
                                  duration: 0.3,
                                  ease: [0.22, 1, 0.36, 1]
                                },
                                opacity: {
                                  duration: 0.2
                                }
                              }
                            }}
                            className="overflow-hidden"
                          >
                            <div className="mt-6 pl-4 border-l-2 border-emerald-600/30 space-y-4">
                              {item.sub.map((subItem, subIndex) => (
                                <motion.div
                                  key={subItem.name}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ 
                                    delay: subIndex * 0.05 + 0.15,
                                    duration: 0.3
                                  }}
                                  exit={{ 
                                    opacity: 0,
                                    x: -10,
                                    transition: {
                                      duration: 0.2
                                    }
                                  }}
                                >
                                  <Link 
                                    to={subItem.link} 
                                    onClick={handleMobileProjectClick}
                                    className="block text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white hover:text-emerald-600 transition-colors duration-300 cursor-pointer touch-manipulation"
                                  >
                                    {subItem.name}<span className="text-emerald-600">.</span>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    // Untuk menu item biasa (About, Expertise, dll) dan About Me
                    item.isRoute ? (
                      <Link
                        to={item.link}
                        onClick={() => handleNavClick(null, item.link, true)}
                        className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white block hover:text-emerald-600 active:text-emerald-600 transition-colors duration-300 cursor-pointer touch-manipulation"
                      >
                        {item.name}<span className="text-emerald-600">.</span>
                      </Link>
                    ) : (
                      <a 
                        href={item.link} 
                        onClick={(e) => handleNavClick(e, item.link)} 
                        className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white block hover:text-emerald-600 active:text-emerald-600 transition-colors duration-300 cursor-pointer touch-manipulation"
                      >
                        {item.name}<span className="text-emerald-600">.</span>
                      </a>
                    )
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Button */}
            <motion.div 
              className="mt-auto pt-10"
              initial={{ opacity: 0, x: 50 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                transition: {
                  delay: menuItems.length * 0.05 + 0.2,
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
              exit={{ 
                opacity: 0,
                x: 50,
                transition: {
                  duration: 0.2
                }
              }}
            >
              <a 
                href={waUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-center shadow-xl shadow-emerald-500/20 active:bg-emerald-700 transition-colors cursor-pointer touch-manipulation"
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
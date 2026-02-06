// MobileNav.jsx
// Mobile Navigation Component

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ANIMATION_DURATION } from './navbarConfig.jsx';
import MenuIcon from './MenuIcon.jsx';
import NavbarDarkModeSwitcher from './NavbarDarkModeSwitcher';

const MobileNav = ({ 
  isOpen,
  mobileSubOpen,
  menuItems,
  handleNavClick,
  handleMobileSubToggle,
  handleMobileProjectClick,
  whatsappNumber
}) => {
  const waUrl = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : '#';

  return (
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
              duration: ANIMATION_DURATION.MOBILE_MENU_EXIT
            }
          }}
          transition={{ 
            type: "tween", 
            ease: "easeOut",
            duration: ANIMATION_DURATION.MOBILE_MENU
          }}
          className="fixed inset-0 bg-[#FFFFF0] dark:bg-slate-950 z-[99] flex flex-col p-8 pt-24 lg:hidden overflow-y-auto"
          style={{ touchAction: 'pan-y' }}
        >
          {/* Menu Items */}
          <motion.div className="flex flex-col space-y-6 relative">
            {menuItems.map((item, index) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * ANIMATION_DURATION.ITEM_STAGGER + 0.1,
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
                    
                    {/* Submenu - Modern Design with Icons */}
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
                                duration: ANIMATION_DURATION.SUBMENU_HEIGHT,
                                ease: [0.22, 1, 0.36, 1]
                              },
                              opacity: {
                                duration: ANIMATION_DURATION.SUBMENU_OPACITY,
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
                          <div className="mt-6 space-y-3">
                            {item.sub.map((subItem, subIndex) => (
                              <motion.div
                                key={subItem.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ 
                                  delay: subIndex * ANIMATION_DURATION.ITEM_STAGGER + 0.15,
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
                                  className="group flex items-start gap-4 p-4 bg-white/80 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/30 active:scale-[0.98] transition-all duration-300 cursor-pointer touch-manipulation"
                                >
                                  {/* Icon */}
                                  <div className="group-hover:scale-110 transition-transform duration-200">
                                    <MenuIcon 
                                      icon={subItem.icon} 
                                      className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" 
                                    />
                                  </div>
                                  
                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                      {subItem.name}<span className="text-emerald-600">.</span>
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                      {subItem.description}
                                    </div>
                                  </div>
                                  
                                  {/* Arrow */}
                                  <svg 
                                    className="w-5 h-5 text-slate-400 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  item.isRoute ? (
                    <Link
                      to={item.link}
                      onClick={() => handleNavClick(null, item.link, true)}
                      className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white block hover:text-emerald-600 active:text-emerald-600 transition-colors duration-300 cursor-pointer touch-manipulation"
                    >
                      {item.name}<span className="text-emerald-600">.</span>
                    </Link>
                  ) : (
                    <button 
                      onClick={(e) => handleNavClick(e, item.link, false)}
                      className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white block hover:text-emerald-600 active:text-emerald-600 transition-colors duration-300 cursor-pointer touch-manipulation text-left w-full"
                    >
                      {item.name}<span className="text-emerald-600">.</span>
                    </button>
                  )
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Button dan Dark Mode Switcher */}
          <motion.div 
            className="mt-auto pt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: {
                delay: menuItems.length * ANIMATION_DURATION.ITEM_STAGGER + 0.2,
                duration: 0.3,
                ease: "easeOut"
              }
            }}
            exit={{ 
              opacity: 0,
              y: 20,
              transition: {
                duration: 0.2
              }
            }}
          >
            <div className="flex items-center justify-between gap-4">
              {/* Contact Button */}
              <a 
                href={waUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-center shadow-xl shadow-emerald-500/20 active:bg-emerald-700 transition-colors cursor-pointer touch-manipulation flex items-center justify-center min-h-[4rem]"
                onClick={() => {
                  // Menu akan otomatis close karena useEffect di useNavbarLogic
                }}
                aria-label="Contact via WhatsApp"
              >
                Contact Me
              </a>
              
              {/* Dark Mode Button - Versi Mobile */}
              <div className="flex-shrink-0">
                <NavbarDarkModeSwitcher variant="mobile" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
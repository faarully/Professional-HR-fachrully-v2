// MobileNav.jsx
// Mobile Navigation Component

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ANIMATION_DURATION } from './navbarConfig';

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
          className="fixed inset-0 bg-white dark:bg-slate-950 z-[99] flex flex-col p-8 pt-24 md:hidden overflow-y-auto"
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
                          <div className="mt-6 pl-4 border-l-2 border-emerald-600/30 space-y-4">
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
                delay: menuItems.length * ANIMATION_DURATION.ITEM_STAGGER + 0.2,
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
                // Menu akan otomatis close karena useEffect di useNavbarLogic
              }}
              aria-label="Contact via WhatsApp"
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
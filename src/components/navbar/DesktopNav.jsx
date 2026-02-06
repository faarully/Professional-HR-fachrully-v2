// DesktopNav.jsx
// Desktop Navigation Component

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { renderMenuItemName, hamburgerVariants } from './navbarConfig.jsx';
import MenuIcon from './MenuIcon.jsx';

const DesktopNav = ({ 
  menuItems, 
  isDropdownOpen,
  handleNavClick,
  handleDropdownEnter,
  handleDropdownLeave,
  setIsDropdownOpen,
  whatsappNumber,
  isOpen,
  handleMobileMenuToggle
}) => {
  const waUrl = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : '#';

  return (
    <>
      {/* Desktop Menu - Changed from md:flex to lg:flex */}
      <div className="hidden lg:flex space-x-8 xl:space-x-12 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-white/70">
        {menuItems.map((item) => (
          <div 
            key={item.name} 
            className="relative group py-2"
            onMouseEnter={() => item.sub && handleDropdownEnter()}
            onMouseLeave={() => item.sub && handleDropdownLeave()}
          >
            {item.link ? (
              item.isRoute ? (
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

            {/* Dropdown Menu - Modern & Minimalist Design */}
            {item.sub && (
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ 
                      duration: 0.2,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="absolute left-0 mt-3 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-slate-900/30 overflow-hidden z-[110]"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative p-2">
                      {item.sub.map((subItem, index) => (
                        <motion.div
                          key={subItem.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={subItem.link}
                            onClick={() => setIsDropdownOpen(false)}
                            className="group flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50/80 dark:hover:bg-emerald-950/30 transition-all duration-200 cursor-pointer"
                          >
                            {/* Icon */}
                            <div className="mt-0.5 group-hover:scale-110 transition-transform duration-200">
                              <MenuIcon 
                                icon={subItem.icon} 
                                className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" 
                              />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {subItem.name}
                              </div>
                              <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                {subItem.description}
                              </div>
                            </div>
                            
                            {/* Arrow indicator */}
                            <svg 
                              className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" 
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
            )}
          </div>
        ))}
      </div>

      {/* CTA dan Hamburger */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Contact Me Button - Hidden on tablet, shown on desktop only */}
        <motion.a 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          href={waUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hidden lg:block bg-slate-900 text-white dark:bg-white dark:text-black px-6 lg:px-8 py-2 lg:py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all rounded-full shadow-lg cursor-pointer"
          aria-label="Contact via WhatsApp"
        >
          Contact Me
        </motion.a>

        {/* Hamburger Button - Show on tablet and mobile */}
        <motion.button 
          onClick={handleMobileMenuToggle}
          className="flex lg:hidden flex-col justify-center items-center w-10 h-10 focus:outline-none relative z-[150] cursor-pointer touch-manipulation"
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
            <motion.line
              x1="2" y1="7" x2="22" y2="7"
              variants={hamburgerVariants.topLine}
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
            
            <motion.line
              x1="2" y1="12" x2="22" y2="12"
              variants={hamburgerVariants.middleLine}
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
            
            <motion.line
              x1="2" y1="17" x2="22" y2="17"
              variants={hamburgerVariants.bottomLine}
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
    </>
  );
};

export default DesktopNav;
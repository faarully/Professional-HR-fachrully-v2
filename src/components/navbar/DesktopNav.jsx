// DesktopNav.jsx
// Desktop Navigation Component

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { renderMenuItemName, hamburgerVariants } from './navbarConfig';

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
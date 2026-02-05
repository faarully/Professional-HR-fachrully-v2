// index.jsx
// Main Navbar Component (Orchestrator)

import React from 'react';
import { Link } from 'react-router-dom';
import { useNavbarLogic } from './useNavbarLogic';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

const Navbar = ({ whatsappNumber }) => {
  // Gunakan custom hook untuk semua logic & state
  const {
    scrolled,
    hasSnapped,
    isOpen,
    isDropdownOpen,
    mobileSubOpen,
    isHomePage,
    menuItems,
    menuRef,
    handleNavClick,
    handleMobileMenuToggle,
    handleDropdownEnter,
    handleDropdownLeave,
    handleMobileSubToggle,
    handleMobileProjectClick,
    setIsDropdownOpen,
  } = useNavbarLogic();

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ease-in-out ${
          scrolled || isOpen
            ? 'bg-[#FFFFF0]/90 dark:bg-slate-950/90 backdrop-blur-md py-4 shadow-sm' // PERUBAHAN: bg-white/90 → bg-[#FFFFF0]/90
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

          {/* Desktop Navigation & Hamburger */}
          <DesktopNav
            menuItems={menuItems}
            isDropdownOpen={isDropdownOpen}
            handleNavClick={handleNavClick}
            handleDropdownEnter={handleDropdownEnter}
            handleDropdownLeave={handleDropdownLeave}
            setIsDropdownOpen={setIsDropdownOpen}
            whatsappNumber={whatsappNumber}
            isOpen={isOpen}
            handleMobileMenuToggle={handleMobileMenuToggle}
          />
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

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isOpen}
        mobileSubOpen={mobileSubOpen}
        menuItems={menuItems}
        handleNavClick={handleNavClick}
        handleMobileSubToggle={handleMobileSubToggle}
        handleMobileProjectClick={handleMobileProjectClick}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
};

export default Navbar;
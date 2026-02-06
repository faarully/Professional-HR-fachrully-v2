// useNavbarLogic.js
// Custom Hook untuk semua logic & state management Navbar

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMenuItems, TIMING } from './navbarConfig.jsx';

export const useNavbarLogic = () => {
  // States
  const [scrolled, setScrolled] = useState(false);
  const [hasSnapped, setHasSnapped] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(false);
  
  // Refs
  const scrollYRef = useRef(0);
  const dropdownTimeoutRef = useRef(null);
  const menuRef = useRef(null);
  const mobileSubmenuRef = useRef(null);
  
  // Router hooks
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  
  // Get menu items based on current page
  const menuItems = getMenuItems(isHomePage);

  // ============================================
  // EFFECT: Reset state saat route berubah
  // ============================================
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsOpen(false);
    setMobileSubOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // ============================================
  // EFFECT: Handle body scroll lock untuk mobile menu
  // ============================================
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

  // ============================================
  // EFFECT: Close menu when clicking outside
  // ============================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      const hamburgerButton = document.querySelector('button[aria-label*="menu"]');
      if (hamburgerButton && hamburgerButton.contains(event.target)) {
        return;
      }

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
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
      }, TIMING.CLICK_OUTSIDE_DELAY);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // ============================================
  // EFFECT: Scroll handler dengan throttling
  // ============================================
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
              setTimeout(() => setHasSnapped(false), TIMING.SNAP_DURATION);
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

  // ============================================
  // EFFECT: Cleanup dropdown timeout
  // ============================================
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // ============================================
  // HANDLERS
  // ============================================

  // Helper function untuk smooth scroll
  const scrollToElement = useCallback((elementId, offset = 80) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Handle navigasi dengan smooth scroll - PERBAIKAN UTAMA
  const handleNavClick = useCallback((e, id, isRoute = false) => {
    // Prevent default untuk semua anchor links
    if (e && id && id.startsWith('#')) {
      e.preventDefault();
    }

    // Tutup semua menu SETELAH navigasi dimulai
    const closeMenus = () => {
      setIsOpen(false);
      setMobileSubOpen(false);
    };

    if (isRoute) {
      closeMenus();
      return;
    }

    if (id && id.startsWith('#')) {
      const elementId = id.replace('#', '');
      
      if (!isHomePage) {
        // Tutup menu dulu sebelum navigasi
        closeMenus();
        
        // Jika bukan di homepage, navigasi dulu ke homepage
        navigate('/', { 
          state: { scrollTo: elementId },
          replace: false 
        });
        
        // Scroll setelah halaman selesai render
        setTimeout(() => {
          scrollToElement(elementId);
        }, 300); // Delay lebih lama untuk pastikan halaman sudah render
      } else {
        // Jika sudah di homepage, tutup menu dulu
        closeMenus();
        
        // Langsung scroll dengan delay kecil untuk animasi close
        setTimeout(() => {
          scrollToElement(elementId);
        }, 100);
      }
    } else {
      // Untuk link lain, tutup menu
      closeMenus();
    }
  }, [isHomePage, navigate, scrollToElement]);

  // Handle scroll ke section setelah navigasi (jika ada state)
  useEffect(() => {
    if (location.state?.scrollTo && isHomePage) {
      setTimeout(() => {
        scrollToElement(location.state.scrollTo);
        // Hapus state setelah digunakan
        navigate(location.pathname, { replace: true, state: {} });
      }, 100);
    }
  }, [location.state, isHomePage, navigate, scrollToElement]);

  // Toggle mobile menu
  const handleMobileMenuToggle = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev;
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
    }, TIMING.DROPDOWN_DELAY);
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

  // Return semua state dan handlers
  return {
    // States
    scrolled,
    hasSnapped,
    isOpen,
    isDropdownOpen,
    mobileSubOpen,
    isHomePage,
    menuItems,
    
    // Refs
    menuRef,
    mobileSubmenuRef,
    
    // Handlers
    handleNavClick,
    handleMobileMenuToggle,
    handleDropdownEnter,
    handleDropdownLeave,
    handleMobileSubToggle,
    handleMobileProjectClick,
    setIsDropdownOpen,
  };
};

// navbarConfig.js
// Configuration & Constants untuk Navbar

// Animation variants untuk hamburger icon
export const hamburgerVariants = {
  topLine: {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 4.5 }
  },
  middleLine: {
    closed: { opacity: 1 },
    open: { opacity: 0 }
  },
  bottomLine: {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -45, y: -4.5 }
  }
};

// Menu items configuration function
export const getMenuItems = (isHomePage) => {
  const allItems = [
    { name: 'About', link: '#about', homeOnly: true },
    { name: 'Expertise', link: '#expertise', homeOnly: true },
    { name: 'Experience', link: '#experience', homeOnly: true },
    { name: 'Education', link: '#education', homeOnly: true },
    { 
      name: 'MyPROJECTS', 
      displayName: 'MyPROJECTS',
      link: null, 
      sub: [
        { 
          name: 'Kalkulator Pesangon', 
          link: '/kalkulator-pesangon', 
          icon: 'calculator', 
          description: 'Hitung pesangon karyawan' 
        },
        { 
          name: 'Psikotest Online', 
          link: '/psikotest-online', 
          icon: 'brain', 
          description: 'Tes psikologi online' 
        }
      ] 
    },
    { 
      name: 'About Me', 
      link: '/', 
      isRoute: true, 
      showOnNonHome: true 
    },
  ];

  return allItems.filter(item => {
    // Tampilkan About Me hanya ketika bukan di homepage
    if (item.name === 'About Me') {
      return !isHomePage;
    }
    // Filter menu lain seperti biasa
    return isHomePage || !item.homeOnly;
  });
};

// Render nama menu item dengan formatting khusus
export const renderMenuItemName = (item) => {
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

// Timing constants
export const TIMING = {
  DROPDOWN_DELAY: 150,
  CLICK_OUTSIDE_DELAY: 100,
  SCROLL_TO_DELAY: 0,
  SNAP_DURATION: 700,
};

// Animation durations
export const ANIMATION_DURATION = {
  MOBILE_MENU: 0.4,
  MOBILE_MENU_EXIT: 0.3,
  ITEM_STAGGER: 0.05,
  SUBMENU_HEIGHT: 0.4,
  SUBMENU_OPACITY: 0.3,
};

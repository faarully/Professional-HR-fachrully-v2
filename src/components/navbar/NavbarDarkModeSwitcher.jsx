import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

// Versi Desktop (Switch)
const DesktopDarkModeSwitcher = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : true;
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle Dark Mode"
      className="relative flex items-center group focus:outline-none"
    >
      {/* Track */}
      <div className={`
        w-12 h-6 rounded-full transition-all duration-300 ease-in-out border
        ${isDark 
          ? 'bg-slate-800/50 border-slate-700 group-hover:border-cyan-500/50' 
          : 'bg-slate-200 border-slate-300 group-hover:border-blue-400'}
      `}></div>
      
      {/* Thumb */}
      <div 
        className={`
          absolute top-1 left-1 w-4 h-4 rounded-full shadow-sm transform transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          flex items-center justify-center
          ${isDark ? 'translate-x-6 bg-cyan-400' : 'translate-x-0 bg-white'}
        `}
      >
        {isDark ? (
          <Moon size={10} className="text-slate-900" fill="currentColor" />
        ) : (
          <Sun size={10} className="text-amber-500" fill="currentColor" />
        )}
      </div>
    </button>
  );
};

// Versi Mobile (Button)
const MobileDarkModeButton = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : true;
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle Dark Mode"
      className="relative flex items-center justify-center group focus:outline-none touch-manipulation"
    >
      {/* Background container */}
      <div className={`
        w-16 h-16 rounded-2xl flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${isDark 
          ? 'bg-slate-800/80 border border-slate-700/50 group-hover:bg-cyan-900/30 group-active:bg-cyan-900/40' 
          : 'bg-slate-100 border border-slate-300/50 group-hover:bg-amber-100/70 group-active:bg-amber-200'}
      `}>
        
        {/* Icon Container */}
        <div 
          className={`
            relative w-10 h-10 rounded-full flex items-center justify-center
            transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${isDark 
              ? 'bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/30' 
              : 'bg-gradient-to-br from-amber-300 to-amber-500 shadow-lg shadow-amber-400/30'}
          `}
        >
          {/* Icon */}
          <div className="flex items-center justify-center">
            {isDark ? (
              <Moon 
                size={20} 
                className="text-slate-900" 
                fill="currentColor" 
                strokeWidth={1.5}
              />
            ) : (
              <Sun 
                size={20} 
                className="text-white" 
                fill="currentColor" 
                strokeWidth={1.5}
              />
            )}
          </div>
          
          {/* Subtle glow effect */}
          <div 
            className={`
              absolute inset-0 rounded-full blur-sm opacity-60
              transition-all duration-500
              ${isDark ? 'bg-cyan-400/40' : 'bg-amber-400/40'}
            `}
          />
        </div>
        
        {/* Outer ring on hover */}
        <div 
          className={`
            absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100
            transition-all duration-300
            ${isDark ? 'border-cyan-500/30' : 'border-amber-400/30'}
          `}
        />
      </div>
      
      {/* Label text (optional) */}
      <div 
        className={`
          absolute -bottom-6 left-1/2 transform -translate-x-1/2 
          text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          ${isDark ? 'text-slate-400' : 'text-slate-600'}
        `}
      >
        {isDark ? '' : ''}
      </div>
    </button>
  );
};

// Komponen utama yang mengekspor keduanya
const NavbarDarkModeSwitcher = ({ variant = 'desktop' }) => {
  if (variant === 'mobile') {
    return <MobileDarkModeButton />;
  }
  return <DesktopDarkModeSwitcher />;
};

// Ekspor komponen individual juga jika diperlukan
export { DesktopDarkModeSwitcher, MobileDarkModeButton };
export default NavbarDarkModeSwitcher;
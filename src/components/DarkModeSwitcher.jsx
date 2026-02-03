import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DarkModeSwitcher = () => {
  // SETIAP KALI DIBUKA: Selalu mulai dengan TRUE (Dark)
  // Kita abaikan pengecekan localStorage di sini supaya selalu reset ke gelap saat refresh
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
      // Menyesuaikan warna scrollbar browser agar tetap gelap
      root.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle Dark Mode"
      /* Warna tombol dibalik secara logis:
         - Saat Dark Mode (isDark=true): Background White, Icon Moon (Slate)
         - Saat Light Mode (isDark=false): Background Slate, Icon Sun (White)
      */
      className="fixed bottom-6 right-6 z-[9999] p-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl border border-slate-800 dark:border-slate-200 flex items-center justify-center transition-all duration-300"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          // Key dibalik supaya icon yang muncul sesuai dengan aksi selanjutnya atau status saat ini
          key={isDark ? 'sun' : 'moon'}
          initial={{ y: 10, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -10, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default DarkModeSwitcher;
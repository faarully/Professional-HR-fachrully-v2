import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => (
  <motion.div
    key="loader"
    exit={{ opacity: 0, transition: { duration: 0.8 } }}
    // UPDATE: Tambahin bg-slate-950 buat Dark Mode
    className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col items-center justify-center transition-colors duration-500"
  >
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3], scale: [0.98, 1, 0.98] }}
      transition={{ repeat: Infinity, duration: 2 }}
      // UPDATE: Tambahin text-white buat Dark Mode
      className="text-slate-900 dark:text-white font-black text-5xl tracking-tighter uppercase italic"
    >
      FACHRULLY<span className="text-emerald-600 not-italic">.</span>
    </motion.div>

    {/* Progress Bar Container */}
    <div className="w-64 h-[2px] bg-slate-100 dark:bg-white/10 mt-10 overflow-hidden relative rounded-full">
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        // UPDATE: Tambahin shadow glow biar sinkron sama kartu pengalaman
        className="w-full h-full bg-emerald-600 absolute shadow-[0_0_8px_#10b981]"
      />
    </div>
  </motion.div>
);

export default Loader;
import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => (
  <motion.div
    key="loader"
    exit={{ opacity: 0, transition: { duration: 0.8 } }}
    className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
  >
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3], scale: [0.98, 1, 0.98] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="text-slate-900 font-black text-5xl tracking-tighter uppercase italic"
    >
      FACHRULLY<span className="text-emerald-600 not-italic">.</span>
    </motion.div>
    <div className="w-64 h-[2px] bg-slate-100 mt-10 overflow-hidden relative rounded-full">
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="w-full h-full bg-emerald-600 absolute"
      />
    </div>
  </motion.div>
);

export default Loader;
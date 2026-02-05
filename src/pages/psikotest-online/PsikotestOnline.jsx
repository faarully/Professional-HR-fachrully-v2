import React from 'react';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';

const PsikotestOnline = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center px-6 transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center"
      >
        {/* Icon */}
        <motion.div 
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl mb-8 text-emerald-600 shadow-xl border border-slate-200 dark:border-slate-800"
        >
          <Construction size={40} />
        </motion.div>

        {/* Text Content */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white mb-4">
          UNDER<span className="text-emerald-600 not-italic">.</span><br />
          CONSTRUCTION
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed">
          Halaman ini sedang dalam tahap pengembangan intensif untuk memastikan akurasi data Anda.
        </p>

        {/* Back Button */}
        <motion.div className="mt-12" whileHover={{ x: -5 }}>
          <a 
            href="/"
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white group"
          >
            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white transition-all">
              <ArrowLeft size={14} />
            </div>
            Back to Home
          </a>
        </motion.div>
      </motion.div>

      {/* Footer Minor */}
      <div className="absolute bottom-10 text-[9px] font-bold uppercase tracking-widest text-slate-400">
        FACHRULLY. 2026
      </div>
    </div>
  );
};

export default PsikotestOnline;
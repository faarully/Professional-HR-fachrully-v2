import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const Education = ({ education }) => {
  if (!education) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="education" className="py-24 bg-slate-900 text-white rounded-t-[3rem] md:rounded-t-[5rem]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: false, amount: 0.3 }}
          className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-20 text-center italic"
        >
          Credentials & <span className="text-emerald-500">Education.</span>
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // 'once: true' mencegah re-trigger animasi saat scroll naik-turun yang bikin capek GPU
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {education.map((row, idx) => {
            const extraVal = row[4] ? row[4].trim() : '';
            const isLink = extraVal.toLowerCase().startsWith('http');
            
            return (
              /* Wrapper motion hanya untuk entrance */
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="block" // Pastikan wrapper tidak punya styling transform
              >
                {/* Div Internal untuk Hover (Murni CSS) */}
                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center group 
                                transition-all duration-300 ease-out cursor-default
                                hover:bg-white/[0.08] hover:border-emerald-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10">
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{row[0]}</h4>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{row[1]} • {row[2]}</p>
                  </div>
                  
                  {isLink && (
                    <div className="flex items-center ml-4">
                      {/* Tombol link tetap pake motion kecil karena dia independen, tidak bentrok dengan layout utama */}
                      <motion.a 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }}
                        href={extraVal} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300"
                      >
                        <ArrowUpRight size={24} className="text-white" />
                      </motion.a>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
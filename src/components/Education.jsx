import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const Education = ({ education }) => {
  if (!education) return null;

  // Varians untuk Container agar anak-anaknya (cards) muncul berurutan (stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Jeda antar kartu agar lebih mengalir
      },
    },
  };

  // Varians untuk tiap kartu (Card)
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 // Jarak geser diperkecil dari 40 ke 20 agar tidak sporadis
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" // Menggunakan kurva standar yang tenang
      }
    }
  };

  return (
    <section id="education" className="py-24 bg-slate-900 text-white rounded-t-[3rem] md:rounded-t-[5rem]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: false, amount: 0.3 }} // Muncul lagi saat scroll, tapi butuh 30% elemen terlihat
          className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-20 text-center italic"
        >
          Credentials & <span className="text-emerald-500">Education.</span>
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }} // Sensitivitas scroll ditingkatkan
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {education.map((row, idx) => {
            const extraVal = row[4] ? row[4].trim() : '';
            const isLink = extraVal.toLowerCase().startsWith('http');
            
            return (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                whileHover={{ 
                  y: -8, 
                  backgroundColor: "rgba(255,255,255,0.08)",
                  transition: { duration: 0.3 } 
                }} 
                className="p-8 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center group hover:border-emerald-500/50 transition-all duration-500"
              >
                <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{row[0]}</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{row[1]} • {row[2]}</p>
                </div>
                
                {isLink && (
                  <motion.a 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    href={extraVal} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center ml-4 group-hover:bg-emerald-500 transition-colors"
                  >
                    <ArrowUpRight size={24} className="text-white" />
                  </motion.a>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
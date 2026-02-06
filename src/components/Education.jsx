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
    <section id="education" className="py-24 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-t-[3rem] md:rounded-t-[5rem]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: false, amount: 0.3 }}
          className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-20 text-center italic"
        >
          Credentials & <span className="text-emerald-600 dark:text-emerald-500">Education.</span>
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {education.map((row, idx) => {
            const extraVal = row[4] ? row[4].trim() : '';
            const isLink = extraVal.toLowerCase().startsWith('http');
            
            return (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="block"
              >
                {/* Div Internal untuk Hover - Sesuaikan dengan tema */}
                <div className="
                  p-8 
                  bg-[#FFFFF0]/50 dark:bg-white/5 
                  border-2 border-slate-300/70 dark:border-white/10 
                  rounded-3xl 
                  flex justify-between items-center 
                  group 
                  transition-all duration-300 ease-out 
                  cursor-default
                  hover:bg-white dark:hover:bg-white/[0.08] 
                  hover:border-slate-400 dark:hover:border-emerald-500/50 
                  hover:-translate-y-2 
                  hover:shadow-2xl 
                  hover:shadow-slate-400/10 dark:hover:shadow-emerald-500/10
                ">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">
                      {row[0]}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      {row[1]} • {row[2]}
                    </p>
                  </div>
                  
                  {isLink && (
                    <div className="flex items-center ml-4">
                      <motion.a 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }}
                        href={extraVal} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="
                          w-14 h-14 
                          bg-slate-200/50 dark:bg-white/10 
                          rounded-2xl 
                          flex items-center justify-center 
                          group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 
                          transition-colors duration-300
                        "
                      >
                        <ArrowUpRight size={24} className="text-slate-700 dark:text-white" />
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
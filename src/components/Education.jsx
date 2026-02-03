import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const Education = ({ education }) => {
  if (!education) return null;
  return (
    <section id="education" className="py-24 bg-slate-900 text-white rounded-t-[3rem] md:rounded-t-[5rem]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-20 text-center italic">
          Credentials & <span className="text-emerald-500">Education.</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {education.map((row, idx) => {
            const extraVal = row[4] ? row[4].trim() : '';
            const isLink = extraVal.toLowerCase().startsWith('http');
            return (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -10, backgroundColor: "rgba(255,255,255,0.08)" }} className="p-8 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center group hover:border-emerald-500/50 transition-all duration-500">
                <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{row[0]}</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{row[1]} • {row[2]}</p>
                </div>
                {isLink && (
                  <motion.a whileHover={{ scale: 1.1, backgroundColor: '#10b981' }} href={extraVal} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center ml-4 group-hover:bg-emerald-500 transition-colors">
                    <ArrowUpRight size={24} className="text-white" />
                  </motion.a>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Education;
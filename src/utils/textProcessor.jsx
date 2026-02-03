import React from 'react';
import { motion } from 'framer-motion';

export const processTextBody = (text, isDark = false) => {
  if (!text) return null;
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  return lines.map((line, i) => {
    const isBullet = line.startsWith('•') || line.startsWith('-');
    if (isBullet) {
      return (
        <motion.li
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ delay: i * 0.1 }}
          key={i}
          className={`flex gap-2 text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
        >
          <span className="text-emerald-600 font-bold">•</span>
          {line.replace(/^[•-]\s*/, '')}
        </motion.li>
      );
    }
    return (
      <p key={i} className={`text-sm mb-4 leading-relaxed tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        {line}
      </p>
    );
  });
};
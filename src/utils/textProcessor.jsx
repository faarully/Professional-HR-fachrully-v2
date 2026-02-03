import React from 'react';

export const processTextBody = (text, isProjectBox = false) => {
  if (!text) return null;

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // LOGIC WARNA:
  // - Default: text-slate-900 (Hitam) di Light Mode, dark:text-white (Putih) di Dark Mode.
  // - Kalau di Project Box: Kita kasih font-bold supaya lebih menonjol.
  const textClass = `antialiased transition-colors duration-300 ${
    isProjectBox 
      ? "text-slate-900 dark:text-white font-bold text-[16px]" 
      : "text-slate-900 dark:text-white font-medium text-[15px]"
  }`;

  return lines.map((line, i) => {
    const isBullet = line.startsWith('•') || line.startsWith('-');

    if (isBullet) {
      return (
        <div key={`bullet-${i}`} className={`flex gap-3 mb-3 ${textClass}`}>
          <span className="text-emerald-600 font-bold flex-shrink-0">•</span>
          <span className="leading-relaxed">
            {line.replace(/^[•-]\s*/, '')}
          </span>
        </div>
      );
    }

    return (
      <p key={`para-${i}`} className={`mb-5 leading-relaxed tracking-wide ${textClass}`}>
        {line}
      </p>
    );
  });
};
import React from 'react';

export const processTextBody = (text, isProjectBox = false) => {
  if (!text) return null;

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Kita pakai class minimal. 
  // Biarkan font-family, color, dan weight diatur oleh parent atau global CSS.
  const textClass = `transition-all duration-300 ${
    isProjectBox ? "project-body-text" : "standard-body-text"
  }`;

  return lines.map((line, i) => {
    const isBullet = line.startsWith('•') || line.startsWith('-');

    if (isBullet) {
      return (
        <div key={`bullet-${i}`} className={`flex gap-3 mb-2 ${textClass}`}>
          <span className="flex-shrink-0">•</span>
          <span>
            {line.replace(/^[•-]\s*/, '')}
          </span>
        </div>
      );
    }

    return (
      <p key={`para-${i}`} className={`mb-4 ${textClass}`}>
        {line}
      </p>
    );
  });
};
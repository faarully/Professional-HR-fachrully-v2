import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const ModernDropdown = ({ value, options, onChange, label, icon, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      
      // TIDAK mengubah style body sama sekali
      // Scrollbar akan tetap ada karena sudah diatur di html
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      {label && (
        <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2 flex items-center gap-2">
          {icon}
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-left font-semibold text-sm focus:border-emerald-600 dark:focus:border-emerald-500 outline-none text-slate-900 dark:text-white transition-all flex items-center justify-between ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300 dark:hover:border-slate-700'
          } ${isOpen ? 'border-emerald-500 dark:border-emerald-500' : ''}`}
        >
          <span className="truncate">{selectedOption?.label || 'Pilih...'}</span>
          <ChevronDown 
            className={`text-slate-400 flex-shrink-0 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            size={20} 
          />
        </button>
        
        {isOpen && (
          <div 
            className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 py-2 max-h-60 overflow-y-auto"
            style={{
              // Pastikan dropdown muncul di atas konten lain
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-6 py-3 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 ${
                  value === option.value 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-semibold' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {value === option.value && (
                  <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 flex-shrink-0"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernDropdown;
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ModernDropdown = ({ value, options, onChange, label, icon, disabled = false, searchable = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Filter options berdasarkan search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Focus search input ketika dropdown terbuka
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
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
        {/* BUTTON DROPDOWN - INI YANG DIBERI BORDER HIJAU */}
        <button
          ref={buttonRef}
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-slate-50 dark:bg-slate-950 border-2 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold text-sm outline-none text-slate-900 dark:text-white transition-all duration-300 ease-in-out flex items-center justify-between ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300 dark:hover:border-slate-700'
          } ${
            isOpen 
              ? 'border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/10' 
              : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="truncate pr-2">{selectedOption?.label || 'Pilih...'}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown 
              className="text-slate-400 flex-shrink-0" 
              size={20} 
            />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="dropdown-content"
              initial={{ 
                opacity: 0, 
                y: -8,
                scale: 0.98
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                y: -8,
                scale: 0.98
              }}
              transition={{ 
                duration: 0.2,
                ease: "easeOut"
              }}
              className="absolute z-[60] w-full mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 max-h-60 overflow-hidden flex flex-col"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0
              }}
            >
              {/* SEARCH INPUT - TANPA BORDER HIJAU */}
              {searchable && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white dark:bg-slate-900 px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex-shrink-0"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari alasan PHK..."
                      className="w-full pl-10 pr-8 py-2 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 focus:border-slate-300 dark:focus:border-slate-600 text-slate-900 dark:text-white transition-all duration-200"
                    />
                    {searchTerm && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-1">
                    {filteredOptions.length} dari {options.length} opsi ditemukan
                  </div>
                </motion.div>
              )}

              {/* Options List */}
              <div className="overflow-y-auto flex-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleSelect(option.value)}
                      className={`w-full text-left px-4 sm:px-6 py-3 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 text-sm ${
                        value === option.value 
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-semibold' 
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                      whileHover={{ 
                        backgroundColor: value === option.value ? '' : 'rgba(148, 163, 184, 0.1)' 
                      }}
                    >
                      <span className="truncate pr-2">{option.label}</span>
                      {value === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 flex-shrink-0"
                        />
                      )}
                    </motion.button>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-4 sm:px-6 py-3 text-sm text-slate-500 dark:text-slate-400 text-center"
                  >
                    Tidak ditemukan
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernDropdown;
import React, { useState, useEffect, useRef } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addYears,
  subYears,
  isToday,
  getDay,
  isValid
} from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, X, ChevronLeft, ChevronRight, PenTool } from 'lucide-react';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const ModernDatePicker = ({
  value,
  onChange,
  label,
  minDate,
  maxDate,
  placeholder = 'DD/MM/YYYY atau DDMMYYYY',
  showFormatInfo = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewMode, setViewMode] = useState('days');
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());

  const [textInput, setTextInput] = useState('');
  const [rawInput, setRawInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasUserTyped, setHasUserTyped] = useState(false);
  
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isCalendarButtonActive, setIsCalendarButtonActive] = useState(false);

  const [error, setError] = useState('');
  const [border, setBorder] = useState('border-slate-200 dark:border-slate-800');

  const ref = useRef(null);
  const inputRef = useRef(null);

  /* =======================
      INIT VALUE
  ======================= */
  useEffect(() => {
    if (!isInputFocused && !isCalendarButtonActive && !isOpen) {
      if (value) {
        const d = new Date(value);
        if (isValid(d)) {
          setTextInput(format(d, 'dd MMMM yyyy', { locale: id }));
          setBorder('border-slate-200 dark:border-slate-800');
        }
      } else {
        setTextInput('');
        setBorder('border-slate-200 dark:border-slate-800');
      }
    }
  }, [value, isInputFocused, isCalendarButtonActive, isOpen]);

  /* =======================
      PARSER FINAL (BLUR)
  ======================= */
  const parseFinalDate = (input) => {
    const clean = input.trim();
    if (!clean) return 'EMPTY';

    const numbers = clean.replace(/\D/g, '');

    let day, month, year;

    if (numbers.length === 8) {
      day = parseInt(numbers.slice(0, 2));
      month = parseInt(numbers.slice(2, 4));
      year = parseInt(numbers.slice(4, 8));
    } else {
      return null;
    }

    const date = new Date(year, month - 1, day);
    if (!isValid(date)) return null;
    if (date.getDate() !== day || date.getMonth() !== month - 1) return null;

    if (minDate && date < new Date(minDate)) return 'MIN';
    if (maxDate && date > new Date(maxDate)) return 'MAX';

    return date;
  };

  /* =======================
      CLEAR FUNCTION
  ======================= */
  const handleClear = (e) => {
    if (e) e.stopPropagation();
    onChange('');
    setTextInput('');
    setRawInput('');
    setError('');
    setBorder('border-slate-200 dark:border-slate-800');
    setHasUserTyped(false);
    setIsEditing(false);
    setIsInputFocused(false);
    setIsCalendarButtonActive(false);
    handleClose();
  };

  /* =======================
      INPUT HANDLERS
  ======================= */
  const handleChange = (e) => {
    const val = e.target.value;
    
    const filtered = val.replace(/[^0-9/]/g, '');
    const numbersOnly = filtered.replace(/\D/g, '');
    
    if (numbersOnly.length > 8) return;
    
    setTextInput(filtered);
    setRawInput(filtered);
    setHasUserTyped(true);
    
    setIsCalendarButtonActive(false);
    setError('');
    setBorder('border-emerald-600');

    if (!filtered.trim()) {
      handleClear();
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
    setIsInputFocused(true);
    setIsCalendarButtonActive(false);
    
    if (rawInput) {
      setTextInput(rawInput);
    } else if (value) {
      const d = new Date(value);
      if (isValid(d)) {
        const f = format(d, 'dd/MM/yyyy');
        setTextInput(f);
        setRawInput(f);
      }
    }
    setBorder('border-emerald-600');
  };

  const handleBlur = () => {
    setIsEditing(false);
    setIsInputFocused(false);
    
    setTimeout(() => {
      // Hanya process blur jika kalender TIDAK terbuka
      if (!isOpen) {
        processBlur();
      }
    }, 150);
  };

  const processBlur = () => {
    if (!textInput.trim()) {
      handleClear();
      return;
    }

    const parsed = parseFinalDate(textInput);

    if (parsed === 'EMPTY') {
      handleClear();
      return;
    }

    if (parsed === null) {
      handleClear();
      setError('Format tidak valid, field dikosongkan');
      setTimeout(() => setError(''), 2000);
      return;
    }

    if (parsed === 'MIN') {
      setError(`Tanggal minimal ${format(new Date(minDate), 'dd/MM/yyyy')}`);
      setBorder('border-red-500');
      return;
    }

    if (parsed === 'MAX') {
      setError(`Tanggal maksimal ${format(new Date(maxDate), 'dd/MM/yyyy')}`);
      setBorder('border-red-500');
      return;
    }

    onChange(format(parsed, 'yyyy-MM-dd'));
    setCurrentMonth(parsed);
    setTextInput(format(parsed, 'dd MMMM yyyy', { locale: id }));
    setBorder('border-slate-200 dark:border-slate-800');
    setError('');
    setHasUserTyped(false);
  };

  /* =======================
      CALENDAR LOGIC
  ======================= */
  const handleDayClick = (day) => {
    const disabled =
      (minDate && day < new Date(minDate)) ||
      (maxDate && day > new Date(maxDate));

    if (disabled) return;

    onChange(format(day, 'yyyy-MM-dd'));
    setCurrentMonth(day);
    setTextInput(format(day, 'dd MMMM yyyy', { locale: id }));
    setRawInput(format(day, 'dd/MM/yyyy'));
    setBorder('border-slate-200 dark:border-slate-800');
    setError('');
    setHasUserTyped(false);
    setIsInputFocused(false);
    setIsCalendarButtonActive(false);
    handleClose();
  };

  const handleMonthClick = (monthIndex) => {
    const newDate = new Date(currentMonth.getFullYear(), monthIndex, 1);
    setCurrentMonth(newDate);
    setViewMode('days');
  };

  const handleYearClick = (year) => {
    const newDate = new Date(year, currentMonth.getMonth(), 1);
    setCurrentMonth(newDate);
    setViewMode('months');
  };

  const handlePrevious = () => {
    if (viewMode === 'days') {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else if (viewMode === 'months') {
      setCurrentMonth(subYears(currentMonth, 1));
    } else if (viewMode === 'years') {
      setCurrentMonth(subYears(currentMonth, 12));
    }
  };

  const handleNext = () => {
    if (viewMode === 'days') {
      setCurrentMonth(addMonths(currentMonth, 1));
    } else if (viewMode === 'months') {
      setCurrentMonth(addYears(currentMonth, 1));
    } else if (viewMode === 'years') {
      setCurrentMonth(addYears(currentMonth, 12));
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    if (viewMode !== 'days') {
      setViewMode('days');
    }
  };

  const isSunday = (day) => getDay(day) === 0;

  const generateDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    const days = [];
    let d = start;
    while (d <= end) {
      days.push(d);
      d = addDays(d, 1);
    }
    return days;
  };

  const renderCalendar = () => {
    const days = generateDays();
    const rows = [];
    let cells = [];

    days.forEach((day, i) => {
      const isSelected = value && isSameDay(day, new Date(value));
      const isCurrentMonth = isSameMonth(day, currentMonth);
      const isTodayDate = isToday(day);
      const isDisabled = (minDate && day < new Date(minDate)) || (maxDate && day > new Date(maxDate));
      const isSundayDay = isSunday(day);

      let sundayColor = '';
      let sundayHoverTextColor = '';
      if (isSundayDay) {
        if (isSelected) {
          sundayColor = 'text-white';
          sundayHoverTextColor = 'text-white';
        } else if (isDisabled) {
          sundayColor = 'text-slate-600 dark:text-slate-500 opacity-50';
          sundayHoverTextColor = 'text-slate-600 dark:text-slate-500 opacity-50';
        } else if (isTodayDate && !isSelected) {
          sundayColor = 'text-white';
          sundayHoverTextColor = 'text-white';
        } else if (!isCurrentMonth) {
          sundayColor = 'text-slate-400 dark:text-slate-600 opacity-70';
          sundayHoverTextColor = 'text-slate-400 dark:text-slate-600 opacity-70';
        } else {
          sundayColor = 'text-red-500 dark:text-red-400';
          sundayHoverTextColor = 'hover:text-slate-900 dark:hover:text-white';
        }
      }

      cells.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          disabled={isDisabled}
          className={`
            h-11 w-11 min-h-[44px] min-w-[44px] rounded-xl font-semibold text-base flex items-center justify-center
            transition-all duration-200 relative touch-manipulation
            ${isSelected 
              ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg'
              : isTodayDate && !isSelected
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white font-bold shadow-md'
              : isCurrentMonth
              ? `${isSundayDay ? sundayColor : 'text-slate-800 dark:text-slate-200'} ${
                  !isDisabled ? `hover:bg-emerald-50 dark:hover:bg-emerald-950/30 ${
                    isSundayDay ? sundayHoverTextColor : 'hover:text-emerald-600 dark:hover:text-emerald-400'
                  } hover:font-bold` : ''
                }`
              : `${isSundayDay ? sundayColor : 'text-slate-400 dark:text-slate-600 opacity-70'} ${
                  !isDisabled ? `hover:bg-emerald-50 dark:hover:bg-emerald-950/30 ${
                    isSundayDay ? sundayHoverTextColor : 'hover:text-emerald-600 dark:hover:text-emerald-400'
                  } hover:opacity-100` : ''
                }`
            }
            ${isDisabled 
              ? `opacity-30 cursor-not-allowed hover:bg-transparent hover:scale-100 hover:shadow-none ${
                  isSundayDay ? sundayColor : 'text-slate-400'
                }`
              : 'cursor-pointer active:scale-95'
            }
          `}
        >
          {format(day, 'd')}
        </button>
      );

      if ((i + 1) % 7 === 0) {
        rows.push(
          <div key={i} className="grid grid-cols-7 gap-1">
            {cells}
          </div>
        );
        cells = [];
      }
    });

    return rows;
  };

  const renderYearGrid = () => {
    const currentYear = currentMonth.getFullYear();
    const startYear = Math.floor(currentYear / 12) * 12;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
      <div className="grid grid-cols-3 gap-2 p-2 pb-4">
        {years.map(year => (
          <button
            key={year}
            onClick={() => handleYearClick(year)}
            className={`
              px-4 py-3 min-h-[48px] rounded-xl font-semibold text-sm transition-all duration-200 touch-manipulation
              ${year === currentYear
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:font-bold'
              }
              active:scale-95
            `}
          >
            {year}
          </button>
        ))}
      </div>
    );
  };

  /* =======================
      RENDER MONTH GRID - IMPROVED VERSION
      Konsisten font size untuk semua bulan dengan responsive design
  ======================= */
  const renderMonthGrid = () => {
    const currentMonthIndex = currentMonth.getMonth();

    return (
      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 pb-4">
        {MONTHS.map((month, index) => (
          <button
            key={month}
            onClick={() => handleMonthClick(index)}
            className={`
              relative overflow-hidden
              px-1.5 sm:px-2 py-3 sm:py-4 
              min-h-[52px] sm:min-h-[56px]
              rounded-xl sm:rounded-2xl
              font-semibold 
              transition-all duration-200 touch-manipulation
              flex items-center justify-center
              group
              ${index === currentMonthIndex
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 scale-[1.02]'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400'
              }
              active:scale-95
            `}
            title={month}
          >
            <div className="relative w-full flex items-center justify-center">
              <span className="text-xs sm:text-sm font-medium text-center leading-tight px-1 break-words">
                {month}
              </span>
              
              {index === currentMonthIndex && (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-xl sm:rounded-2xl" />
              )}
            </div>
          </button>
        ))}
      </div>
    );
  };

  /* =======================
      OPEN/CLOSE LOGIC
  ======================= */
  const handleOpen = () => {
    setIsOpen(true);
    setIsCalendarButtonActive(true);
    // JANGAN blur input, biarkan tetap focused
    setIsInputFocused(true);
    // inputRef.current?.focus(); // Opsional: fokus lagi
    
    if (value) {
      setCurrentMonth(new Date(value));
    }
    setViewMode('days');
    // Set border menjadi hijau saat kalender dibuka
    setBorder('border-emerald-600');
    setTimeout(() => setIsAnimating(true), 10);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      setIsCalendarButtonActive(false);
      // Kembalikan border ke warna normal setelah kalender ditutup
      if (!isInputFocused && !error) {
        setBorder('border-slate-200 dark:border-slate-800');
      }
    }, 200);
  };

  const handleCalendarIconClick = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  /* =======================
      CLICK OUTSIDE
  ======================= */
  useEffect(() => {
    const click = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        handleClose();
        // Hanya reset border jika tidak ada error
        if (!error) {
          setBorder('border-slate-200 dark:border-slate-800');
        }
        setIsCalendarButtonActive(false);
        setIsInputFocused(false);
      }
    };
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, [error]);

  /* =======================
      LOGIC UNTUK MENENTUKAN BORDER COLOR - IMPROVED
  ======================= */
  const getBorderColor = () => {
    // Priority: 1. Error, 2. Active state (input focused OR calendar open), 3. Default
    if (border.includes('red-500')) {
      return 'border-red-500 dark:border-red-500';
    }
    if (border.includes('emerald-600') || isOpen || isInputFocused) {
      return 'border-emerald-600 dark:border-emerald-600';
    }
    return 'border-slate-200 dark:border-slate-800';
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2 block">
          {label}
        </label>
      )}
      
      <div className="relative" ref={ref}>
        {/* CONTAINER WRAPPER DENGAN BORDER */}
        <div className={`relative border-2 ${getBorderColor()} rounded-2xl transition-all duration-200 ${isOpen ? 'ring-2 ring-emerald-500/20' : ''}`}>
          {/* ICON KALENDER */}
          <div 
            onClick={handleCalendarIconClick}
            className={`absolute left-0 top-0 h-full flex items-center justify-center px-4 border-r-2 ${getBorderColor()} cursor-pointer transition-all duration-200 rounded-l-2xl bg-gradient-to-r from-slate-100/80 to-slate-50/40 dark:from-slate-800/80 dark:to-slate-950/40 hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-800 touch-manipulation`}
          >
            <div className="relative">
              {isCalendarButtonActive || isOpen ? (
                <PenTool 
                  size={18} 
                  className="text-emerald-500 relative z-10 transition-all duration-200" 
                />
              ) : (
                <Calendar 
                  size={18} 
                  className={`text-emerald-500 transition-all duration-200 ${
                    isOpen ? 'rotate-12 scale-110' : ''
                  }`} 
                />
              )}
            </div>
          </div>
          
          {/* INPUT FIELD */}
          <input
            ref={inputRef}
            value={textInput}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl pl-16 pr-11 py-3 sm:py-4 font-semibold text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all duration-200"
          />
          
          {/* BUTTON CLEAR */}
          {(textInput || hasUserTyped || isCalendarButtonActive) && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 z-10 touch-manipulation"
            >
              <X size={16} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
            </button>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 ml-2 animate-fadeIn">
            {error}
          </p>
        )}
        
        {showFormatInfo && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 ml-2">
            Contoh: <b>DDMMYYYY</b> atau <b>DD/MM/YYYY</b>
          </p>
        )}

        {/* CALENDAR POPUP */}
        {isOpen && (
          <div 
            className={`absolute z-[60] mt-2 w-full max-w-[360px] left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-600 dark:border-emerald-600 shadow-2xl shadow-slate-300/60 dark:shadow-black/40 overflow-hidden transition-all duration-200 ${
              isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
          >
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  className="p-2 min-h-[44px] min-w-[44px] hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 active:scale-95 hover:text-emerald-600 dark:hover:text-emerald-400 touch-manipulation flex items-center justify-center"
                >
                  <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300" />
                </button>

                <div className="flex items-center gap-2">
                  {viewMode === 'days' && (
                    <>
                      <button
                        onClick={() => setViewMode('months')}
                        className="px-3 py-1.5 min-h-[40px] font-bold text-sm text-slate-800 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-all duration-200 active:scale-95 touch-manipulation"
                      >
                        {format(currentMonth, 'MMMM', { locale: id })}
                      </button>
                      <button
                        onClick={() => setViewMode('years')}
                        className="px-3 py-1.5 min-h-[40px] font-bold text-sm text-slate-800 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-all duration-200 active:scale-95 touch-manipulation"
                      >
                        {format(currentMonth, 'yyyy')}
                      </button>
                    </>
                  )}
                  {viewMode === 'months' && (
                    <button
                      onClick={() => setViewMode('years')}
                      className="px-3 py-1.5 min-h-[40px] font-bold text-sm text-slate-800 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-all duration-200 active:scale-95 touch-manipulation"
                    >
                      {currentMonth.getFullYear()}
                    </button>
                  )}
                  {viewMode === 'years' && (
                    <div className="px-3 py-1.5 font-bold text-sm text-slate-800 dark:text-white">
                      {(() => {
                        const currentYear = currentMonth.getFullYear();
                        const startYear = Math.floor(currentYear / 12) * 12;
                        return `${startYear} - ${startYear + 11}`;
                      })()}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="p-2 min-h-[44px] min-w-[44px] hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 active:scale-95 hover:text-emerald-600 dark:hover:text-emerald-400 touch-manipulation flex items-center justify-center"
                >
                  <ChevronRight size={20} className="text-slate-600 dark:text-slate-300" />
                </button>
              </div>
            </div>

            {/* Calendar Body */}
            <div className="p-4">
              {viewMode === 'years' && renderYearGrid()}
              {viewMode === 'months' && renderMonthGrid()}
              {viewMode === 'days' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {DAYS.map(day => (
                      <div 
                        key={day} 
                        className={`h-10 flex items-center justify-center text-xs font-bold uppercase ${
                          day === 'Min' 
                            ? 'text-pink-500 dark:text-pink-400' 
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-1">
                    {renderCalendar()}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50">
              <button
                onClick={handleToday}
                className="px-4 py-2 min-h-[44px] text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:font-bold rounded-lg transition-all duration-200 active:scale-95 touch-manipulation"
              >
                Hari Ini
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 min-h-[44px] text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-95 touch-manipulation"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernDatePicker;
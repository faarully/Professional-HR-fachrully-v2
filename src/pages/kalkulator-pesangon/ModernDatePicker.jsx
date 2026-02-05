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
  const [hasUserTyped, setHasUserTyped] = useState(false); // NEW: track jika user sudah mengetik

  const [error, setError] = useState('');
  const [border, setBorder] = useState('border-slate-200 dark:border-slate-700');

  const ref = useRef(null);

  /* =======================
     INIT VALUE
  ======================= */
  useEffect(() => {
    if (!isEditing && !hasUserTyped) {
      if (value) {
        const d = new Date(value);
        if (isValid(d)) {
          setTextInput(format(d, 'dd MMMM yyyy', { locale: id }));
          setBorder('border-emerald-500');
        }
      } else {
        setTextInput('');
        setBorder('border-slate-200 dark:border-slate-700');
      }
    }
  }, [value, isEditing, hasUserTyped]);

  /* =======================
     PARSER FINAL (BLUR)
  ======================= */
  const parseFinalDate = (input) => {
    const clean = input.trim();
    if (!clean) return 'EMPTY'; // CHANGED: return 'EMPTY' untuk input kosong

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
    setBorder('border-slate-200 dark:border-slate-700');
    setHasUserTyped(false);
    setIsEditing(false);
  };

  /* =======================
     INPUT HANDLERS
  ======================= */
const handleChange = (e) => {
  const val = e.target.value;
  
  // Filter: hanya izinkan angka dan slash
  const filtered = val.replace(/[^0-9/]/g, '');
  
  // Ekstrak hanya angka untuk cek panjang
  const numbersOnly = filtered.replace(/\D/g, '');
  
  // Batasi maksimal 8 digit angka (DDMMYYYY)
  if (numbersOnly.length > 8) {
    return; // Langsung return, tidak update state
  }
  
  setTextInput(filtered);
  setRawInput(filtered);
  setHasUserTyped(true);

  // soft state, no hard error
  setError('');
  setBorder('border-emerald-400');

  // Jika user menghapus semua karakter, auto clear
  if (!filtered.trim()) {
    handleClear();
  }
};

  const handleFocus = () => {
    setIsEditing(true);
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
    setBorder('border-emerald-500');
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (!textInput.trim()) {
      handleClear(); // NEW: Auto clear jika kosong
      return;
    }

    const parsed = parseFinalDate(textInput);

    if (parsed === 'EMPTY') {
      handleClear(); // NEW: Auto clear
      return;
    }

    if (parsed === null) {
      // NEW: Format tidak valid → auto clear
      handleClear();
      setError('Format tidak valid, field dikosongkan');
      setTimeout(() => setError(''), 2000); // Hanya tampilkan error sementara
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
    setBorder('border-emerald-500');
    setError('');
    setHasUserTyped(false); // Reset setelah valid
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
    setBorder('border-emerald-500');
    setError('');
    setHasUserTyped(false); // Reset karena pilih dari calendar
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
            h-9 sm:h-11 w-9 sm:w-11 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center
            transition-all duration-200 relative
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
          <div key={i} className="grid grid-cols-7 gap-0.5 sm:gap-1">
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
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2">
        {years.map(year => (
          <button
            key={year}
            onClick={() => handleYearClick(year)}
            className={`
              px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200
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

  const renderMonthGrid = () => {
    const currentMonthIndex = currentMonth.getMonth();

    return (
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2">
        {MONTHS.map((month, index) => (
          <button
            key={month}
            onClick={() => handleMonthClick(index)}
            className={`
              px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200
              ${index === currentMonthIndex
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:font-bold'
              }
              active:scale-95
            `}
          >
            {month}
          </button>
        ))}
      </div>
    );
  };

  /* =======================
     CALENDAR CONTROLS
  ======================= */
  const handleOpen = () => {
    setIsOpen(true);
    setIsAnimating(true);
    setViewMode('days');
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 200);
    // Format ulang text input saat menutup
    if (value) {
      const date = new Date(value);
      if (isValid(date)) {
        setTextInput(format(date, 'dd MMMM yyyy', { locale: id }));
      }
    }
  };

  const handleCalendarIconClick = (e) => {
    e.stopPropagation();
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
      }
    };
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 block tracking-tight">
          {label}
        </label>
      )}
      
      <div className="relative" ref={ref}>
        <div className="relative">
          <input
            value={textInput}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`w-full bg-white dark:bg-slate-900 border-2 ${border} rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 font-medium text-sm text-slate-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 outline-none transition-all duration-200 pr-12 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-100/50 dark:hover:shadow-emerald-900/20`}
          />
          <div className="absolute right-0 top-0 h-full flex items-center gap-1.5 sm:gap-2 pr-3">
            {/* NEW: Always show Clear button when user is typing or has value */}
            {(textInput || hasUserTyped) && (
              <div
                onClick={handleClear}
                className="p-1 sm:p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <X size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
              </div>
            )}
            <div 
              onClick={handleCalendarIconClick}
              className={`p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${isOpen ? 'bg-emerald-50 dark:bg-emerald-950/30' : ''}`}
            >
              {isEditing ? (
                <PenTool size={18} className="text-emerald-500" />
              ) : (
                <Calendar size={18} className={`text-emerald-500 transition-all duration-200 ${isOpen ? 'rotate-12 scale-110' : ''}`} />
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 ml-1 animate-fadeIn">
            {error}
          </p>
        )}
        
        {showFormatInfo && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 ml-1">
            Contoh: <b>DDMMYYYY</b> atau <b>DD/MM/YYYY</b>
          </p>
        )}

        {isOpen && (
          <div 
            className={`absolute z-[60] mt-2 w-full min-w-[320px] sm:min-w-[360px] bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-300/60 dark:shadow-black/40 overflow-hidden transition-all duration-200 ${
              isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
          >
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-800/50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  className="p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 active:scale-95 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <ChevronLeft size={18} className="text-slate-600 dark:text-slate-300" />
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {viewMode === 'days' && (
                    <>
                      <button
                        onClick={() => setViewMode('months')}
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 font-bold text-xs sm:text-sm text-slate-800 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-all duration-200 active:scale-95"
                      >
                        {format(currentMonth, 'MMMM', { locale: id })}
                      </button>
                      <button
                        onClick={() => setViewMode('years')}
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 font-bold text-xs sm:text-sm text-slate-800 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-all duration-200 active:scale-95"
                      >
                        {format(currentMonth, 'yyyy')}
                      </button>
                    </>
                  )}
                  {viewMode === 'months' && (
                    <button
                      onClick={() => setViewMode('years')}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 font-bold text-xs sm:text-sm text-slate-800 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-all duration-200 active:scale-95"
                    >
                      {currentMonth.getFullYear()}
                    </button>
                  )}
                  {viewMode === 'years' && (
                    <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 font-bold text-xs sm:text-sm text-slate-800 dark:text-white">
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
                  className="p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 active:scale-95 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <ChevronRight size={18} className="text-slate-600 dark:text-slate-300" />
                </button>
              </div>
            </div>

            {/* Calendar Body */}
            <div className="p-3 sm:p-4">
              {viewMode === 'years' && renderYearGrid()}
              {viewMode === 'months' && renderMonthGrid()}
              {viewMode === 'days' && (
                <div className="space-y-1.5 sm:space-y-2">
                  {/* Days header */}
                  <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                    {DAYS.map(day => (
                      <div 
                        key={day} 
                        className={`h-8 sm:h-10 flex items-center justify-center text-[10px] sm:text-xs font-bold uppercase ${
                          day === 'Min' 
                            ? 'text-pink-500 dark:text-pink-400' 
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar grid */}
                  <div className="space-y-0.5 sm:space-y-1">
                    {renderCalendar()}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50">
              <button
                onClick={handleToday}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:font-bold rounded-lg transition-all duration-200 active:scale-95"
              >
                Hari Ini
              </button>
              <button
                onClick={handleClose}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-95"
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
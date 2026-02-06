import React, { useState, useEffect, useRef } from 'react';
import { Calculator, RefreshCw, FileText, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { daftarAlasan } from './constants';
import ModernDropdown from './ModernDropdown';
import ModernDatePicker from './ModernDatePicker';
import { motion } from 'framer-motion';

// Fungsi helper untuk format dan parse angka
const formatNumber = (num) => {
  if (num === '' || num === null || num === undefined) return '';
  const numStr = num.toString();
  if (numStr === '0') return '0';
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const parseNumber = (str) => {
  return str.replace(/\./g, '');
};

const FormInput = ({
  tipeKaryawan,
  setTipeKaryawan,
  alasanPhkId,
  setAlasanPhkId,
  upahPokok,
  setUpahPokok,
  tunjanganTetap,
  setTunjanganTetap,
  tanggalMulai,
  setTanggalMulai,
  tanggalBerakhir,
  setTanggalBerakhir,
  masaKerjaTahun,
  masaKerjaBulan,
  masaKerjaHari,
  sisaCuti,
  setSisaCuti,
  hitungKompensasi,
  reset,
  formatRupiah,
  setHasil,
  sistemHariKerja = 'senin-jumat',
  setSistemHariKerja
}) => {
  // State untuk error messages
  const [upahPokokError, setUpahPokokError] = useState('');
  const [tunjanganTetapError, setTunjanganTetapError] = useState('');
  const [sisaCutiError, setSisaCutiError] = useState('');
  
  // State untuk temporary error yang akan hilang otomatis
  const [tempUpahError, setTempUpahError] = useState('');
  const [tempTunjanganError, setTempTunjanganError] = useState('');
  const [tempCutiError, setTempCutiError] = useState('');
  
  // State untuk animasi loading saat hitung
  const [isCalculating, setIsCalculating] = useState(false);

  // Refs untuk timeout
  const upahErrorTimeoutRef = useRef(null);
  const tunjanganErrorTimeoutRef = useRef(null);
  const cutiErrorTimeoutRef = useRef(null);

  // Refs untuk input fields
  const upahInputRef = useRef(null);
  const tunjanganInputRef = useRef(null);
  const cutiInputRef = useRef(null);

  // Opsi sistem hari kerja
  const opsiHariKerja = [
    { value: 'senin-jumat', label: 'Senin - Jumat' },
    { value: 'senin-sabtu', label: 'Senin - Sabtu' },
    { value: 'roster', label: 'Roster' }
  ];

  // Format daftar alasan untuk dropdown
  const opsiAlasanPhk = daftarAlasan.map(a => ({
    value: a.id,
    label: `${a.label}`
  }));

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (upahErrorTimeoutRef.current) clearTimeout(upahErrorTimeoutRef.current);
      if (tunjanganErrorTimeoutRef.current) clearTimeout(tunjanganErrorTimeoutRef.current);
      if (cutiErrorTimeoutRef.current) clearTimeout(cutiErrorTimeoutRef.current);
    };
  }, []);

  // Fungsi untuk menampilkan error sementara
  const showTemporaryError = (setTempError, errorMessage) => {
    // Clear timeout yang lama
    if (setTempError === setTempUpahError && upahErrorTimeoutRef.current) {
      clearTimeout(upahErrorTimeoutRef.current);
    } else if (setTempError === setTempTunjanganError && tunjanganErrorTimeoutRef.current) {
      clearTimeout(tunjanganErrorTimeoutRef.current);
    } else if (setTempError === setTempCutiError && cutiErrorTimeoutRef.current) {
      clearTimeout(cutiErrorTimeoutRef.current);
    }

    // Set error
    setTempError(errorMessage);
    
    // Set timeout untuk menghapus error setelah 3 detik
    const timeout = setTimeout(() => {
      setTempError('');
    }, 3000);

    // Simpan timeout ref
    if (setTempError === setTempUpahError) {
      upahErrorTimeoutRef.current = timeout;
    } else if (setTempError === setTempTunjanganError) {
      tunjanganErrorTimeoutRef.current = timeout;
    } else if (setTempError === setTempCutiError) {
      cutiErrorTimeoutRef.current = timeout;
    }
  };

  // Validasi form - button disabled jika field wajib kosong atau ada error
  const isFormValid = () => {
    const hasValidUpah = upahPokok && !upahPokokError && parseFloat(upahPokok) > 0;
    const hasValidTanggal = tanggalMulai && tanggalBerakhir;
    const hasNoErrors = !upahPokokError && !tunjanganTetapError && !sisaCutiError;
    
    return hasValidUpah && hasValidTanggal && hasNoErrors;
  };

  // Hitung total upah bulanan
  const totalUpahBulanan = (parseFloat(upahPokok) || 0) + (parseFloat(tunjanganTetap) || 0);

  // Handler untuk upah pokok dengan keyboard numeric di mobile
  const handleUpahPokokChange = (e) => {
    const inputValue = e.target.value;
    
    // Validasi: hanya boleh angka dan titik sebagai separator
    const cleanedValue = inputValue.replace(/\./g, '');
    
    if (cleanedValue !== '' && !/^\d*$/.test(cleanedValue)) {
      // Tampilkan error sementara
      showTemporaryError(setTempUpahError, 'Hanya boleh memasukkan angka');
      return;
    }
    
    // Clear temporary error jika ada
    if (tempUpahError) {
      setTempUpahError('');
      if (upahErrorTimeoutRef.current) {
        clearTimeout(upahErrorTimeoutRef.current);
        upahErrorTimeoutRef.current = null;
      }
    }
    
    // Format angka dengan separator ribuan
    let formattedValue = '';
    if (cleanedValue !== '') {
      // Format dengan titik pemisah ribuan
      formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    
    // Set value
    setUpahPokok(cleanedValue);
    
    // Clear error jika ada
    if (upahPokokError) {
      setUpahPokokError('');
    }
    
    // Update input value untuk tampilan
    e.target.value = formattedValue;
  };

  // Handler untuk tunjangan tetap dengan keyboard numeric di mobile
  const handleTunjanganTetapChange = (e) => {
    const inputValue = e.target.value;
    
    // Validasi: hanya boleh angka dan titik sebagai separator
    const cleanedValue = inputValue.replace(/\./g, '');
    
    if (cleanedValue !== '' && !/^\d*$/.test(cleanedValue)) {
      // Tampilkan error sementara
      showTemporaryError(setTempTunjanganError, 'Hanya boleh memasukkan angka');
      return;
    }
    
    // Clear temporary error jika ada
    if (tempTunjanganError) {
      setTempTunjanganError('');
      if (tunjanganErrorTimeoutRef.current) {
        clearTimeout(tunjanganErrorTimeoutRef.current);
        tunjanganErrorTimeoutRef.current = null;
      }
    }
    
    // Format angka dengan separator ribuan
    let formattedValue = '';
    if (cleanedValue !== '') {
      // Format dengan titik pemisah ribuan
      formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    
    // Set value
    setTunjanganTetap(cleanedValue);
    
    // Clear error jika ada
    if (tunjanganTetapError) {
      setTunjanganTetapError('');
    }
    
    // Update input value untuk tampilan
    e.target.value = formattedValue;
  };

  // Handler untuk blur pada upah pokok
  const handleUpahPokokBlur = (e) => {
    const inputValue = e.target.value;
    
    if (inputValue === '' || inputValue === '0') {
      setUpahPokokError('Upah pokok harus diisi');
      setUpahPokok('');
    } else if (parseFloat(inputValue.replace(/\./g, '')) <= 0) {
      setUpahPokokError('Upah pokok harus lebih dari 0');
    } else {
      setUpahPokokError('');
    }
    
    // Clear temporary error
    if (tempUpahError) {
      setTempUpahError('');
      if (upahErrorTimeoutRef.current) {
        clearTimeout(upahErrorTimeoutRef.current);
        upahErrorTimeoutRef.current = null;
      }
    }
  };

  // Handler untuk blur pada tunjangan tetap
  const handleTunjanganTetapBlur = (e) => {
    const inputValue = e.target.value;
    
    if (inputValue !== '' && parseFloat(inputValue.replace(/\./g, '')) < 0) {
      setTunjanganTetapError('Tunjangan tetap tidak boleh negatif');
    } else {
      setTunjanganTetapError('');
    }
    
    // Clear temporary error
    if (tempTunjanganError) {
      setTempTunjanganError('');
      if (tunjanganErrorTimeoutRef.current) {
        clearTimeout(tunjanganErrorTimeoutRef.current);
        tunjanganErrorTimeoutRef.current = null;
      }
    }
  };

  // Handler untuk sisa cuti dengan keyboard numeric di mobile
  const handleSisaCutiChange = (e) => {
    const inputValue = e.target.value;
    
    // Validasi: hanya boleh angka
    if (inputValue !== '' && !/^\d*$/.test(inputValue)) {
      // Tampilkan error sementara
      showTemporaryError(setTempCutiError, 'Hanya boleh memasukkan angka');
      return;
    }
    
    // Clear temporary error jika ada
    if (tempCutiError) {
      setTempCutiError('');
      if (cutiErrorTimeoutRef.current) {
        clearTimeout(cutiErrorTimeoutRef.current);
        cutiErrorTimeoutRef.current = null;
      }
    }
    
    // Set value
    setSisaCuti(inputValue);
    
    // Clear error jika ada
    if (sisaCutiError) {
      setSisaCutiError('');
    }
  };

  // Fungsi untuk handle focus pada input numeric di mobile
  const handleNumericInputFocus = (inputRef) => {
    // Di mobile, set inputmode ke numeric untuk membuka keyboard angka
    if (inputRef.current && window.innerWidth < 768) {
      inputRef.current.setAttribute('inputmode', 'numeric');
    }
  };

  // Reset all errors
  const handleReset = () => {
    setUpahPokokError('');
    setTunjanganTetapError('');
    setSisaCutiError('');
    setTempUpahError('');
    setTempTunjanganError('');
    setTempCutiError('');
    
    // Clear all timeouts
    if (upahErrorTimeoutRef.current) {
      clearTimeout(upahErrorTimeoutRef.current);
      upahErrorTimeoutRef.current = null;
    }
    if (tunjanganErrorTimeoutRef.current) {
      clearTimeout(tunjanganErrorTimeoutRef.current);
      tunjanganErrorTimeoutRef.current = null;
    }
    if (cutiErrorTimeoutRef.current) {
      clearTimeout(cutiErrorTimeoutRef.current);
      cutiErrorTimeoutRef.current = null;
    }
    
    reset();
  };

  // Handler untuk hitung dengan animasi loading
  const handleHitung = () => {
    setIsCalculating(true);
    
    // Delay untuk animasi loading
    setTimeout(() => {
      hitungKompensasi();
      setIsCalculating(false);
      
      // Smooth scroll ke hasil perhitungan setelah delay kecil
      setTimeout(() => {
        // Scroll ke hasil di mobile
        if (window.innerWidth < 1024) { // lg breakpoint
          const hasilElement = document.querySelector('.hasil-perhitungan-container');
          if (hasilElement) {
            hasilElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        }
      }, 100);
    }, 800); // 800ms delay untuk efek smooth
  };

  return (
    <div className="lg:col-span-7 space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4 sm:space-y-6">
        
        {/* Toggle PKWTT/PKWT */}
        <div className="flex p-1 sm:p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl gap-1 sm:gap-0 relative">
          {['PKWTT', 'PKWT'].map(t => (
            <motion.button 
              key={t} 
              onClick={() => {setTipeKaryawan(t); setHasil(null);}}
              whileHover={{ scale: tipeKaryawan !== t ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex-1 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black tracking-wider sm:tracking-widest uppercase transition-all duration-300 overflow-hidden ${
                tipeKaryawan === t 
                  ? 'text-white shadow-lg shadow-emerald-600/30 z-10' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {/* Animated background untuk button aktif */}
              {tipeKaryawan === t && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">
                {t === 'PKWTT' ? 'PERMANENT' : 'CONTRACT'}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Alasan PHK (hanya untuk PKWTT) - MENGGUNAKAN DROPDOWN MODERN DENGAN SEARCH */}
        {tipeKaryawan === 'PKWTT' && (
          <ModernDropdown
            value={alasanPhkId}
            options={opsiAlasanPhk}
            onChange={setAlasanPhkId}
            label="Alasan PHK (PP 35/2021)"
            icon={<FileText size={14} />}
            searchable={true}
          />
        )}

        {/* Sistem Hari Kerja (hanya untuk PKWTT) - MENGGUNAKAN DROPDOWN MODERN */}
        {tipeKaryawan === 'PKWTT' && (
          <ModernDropdown
            value={sistemHariKerja}
            options={opsiHariKerja}
            onChange={setSistemHariKerja}
            label="Sistem Hari Kerja"
            icon={<Clock size={14} />}
          />
        )}

        {/* Input Upah */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2 block">
              Upah Pokok <span className="text-red-500">*</span>
            </label>
            <input 
              ref={upahInputRef}
              type="text" 
              value={formatNumber(upahPokok)} 
              onChange={handleUpahPokokChange}
              onBlur={handleUpahPokokBlur}
              onFocus={() => handleNumericInputFocus(upahInputRef)}
              inputMode="numeric"
              pattern="[0-9]*"
              className={`w-full bg-slate-50 dark:bg-slate-950 border-2 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm focus:border-emerald-600 dark:focus:border-emerald-600 outline-none text-slate-900 dark:text-white transition-all hover:border-slate-300 dark:hover:border-slate-700 ${
                (upahPokokError || tempUpahError) 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
              placeholder="0" 
            />
            {(upahPokokError || tempUpahError) && (
              <p className="text-xs text-red-500 dark:text-red-400 ml-2 animate-fadeIn">
                {tempUpahError || upahPokokError}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2 block">
              Tunjangan Tetap
            </label>
            <input 
              ref={tunjanganInputRef}
              type="text" 
              value={formatNumber(tunjanganTetap)} 
              onChange={handleTunjanganTetapChange}
              onBlur={handleTunjanganTetapBlur}
              onFocus={() => handleNumericInputFocus(tunjanganInputRef)}
              inputMode="numeric"
              pattern="[0-9]*"
              className={`w-full bg-slate-50 dark:bg-slate-950 border-2 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm focus:border-emerald-600 dark:focus:border-emerald-600 outline-none text-slate-900 dark:text-white transition-all hover:border-slate-300 dark:hover:border-slate-700 ${
                (tunjanganTetapError || tempTunjanganError) 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
              placeholder="0" 
            />
            {(tunjanganTetapError || tempTunjanganError) && (
              <p className="text-xs text-red-500 dark:text-red-400 ml-2 animate-fadeIn">
                {tempTunjanganError || tunjanganTetapError}
              </p>
            )}
          </div>
        </div>

        {/* Total Upah Display - HANYA TAMPIL JIKA LEBIH DARI 0 */}
        {totalUpahBulanan > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-emerald-200 dark:border-emerald-800">
            <p className="text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
              Total Upah Bulanan (Pokok + Tunjangan Tetap)
            </p>
            <p className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-300 break-words">
              {formatRupiah(totalUpahBulanan)}
            </p>
          </div>
        )}

        {/* Masa Kerja - MENGGUNAKAN DATE PICKER MODERN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ModernDatePicker
            value={tanggalMulai}
            onChange={setTanggalMulai}
            label="Tanggal Mulai Kerja"
            maxDate={tanggalBerakhir}
            placeholder="Pilih tanggal mulai"
            showFormatInfo={true}
            required
          />
          <ModernDatePicker
            value={tanggalBerakhir}
            onChange={setTanggalBerakhir}
            label="Tanggal Berakhir/PHK"
            minDate={tanggalMulai}
            placeholder="Pilih tanggal berakhir"
            showFormatInfo={false}
            required
          />
        </div>
        
        {/* Display calculated masa kerja - HANYA TAMPIL JIKA KEDUA TANGGAL TERISI */}
        {tanggalMulai && tanggalBerakhir && (masaKerjaTahun > 0 || masaKerjaBulan > 0 || masaKerjaHari > 0) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-[10px] sm:text-xs font-bold text-blue-700 dark:text-blue-400 mb-1">
              Total Masa Kerja
            </p>
            <p className="text-lg sm:text-xl font-black text-blue-900 dark:text-blue-300">
              {masaKerjaTahun} Tahun {masaKerjaBulan} Bulan {masaKerjaHari} Hari
            </p>
          </div>
        )}

        {/* Sisa Cuti (hanya untuk PKWTT) */}
        {tipeKaryawan === 'PKWTT' && (
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2 block">
              Sisa Cuti Tahunan (Hari)
            </label>
            <input 
              ref={cutiInputRef}
              type="text" 
              placeholder="0" 
              value={sisaCuti}
              onChange={handleSisaCutiChange}
              onFocus={() => handleNumericInputFocus(cutiInputRef)}
              onBlur={(e) => {
                if (e.target.value === '') {
                  setSisaCuti('0');
                }
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              className={`w-full bg-slate-50 dark:bg-slate-950 border-2 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm text-slate-900 dark:text-white focus:border-emerald-600 dark:focus:border-emerald-600 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-700 ${
                (sisaCutiError || tempCutiError) 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            />
            {(sisaCutiError || tempCutiError) && (
              <p className="text-xs text-red-500 dark:text-red-400 ml-2 animate-fadeIn">
                {tempCutiError || sisaCutiError}
              </p>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 ml-2 mt-1">
              Cuti tahunan yang belum diambil dan belum gugur
            </p>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex gap-2 sm:gap-3">
          <motion.button 
            onClick={handleHitung}
            disabled={!isFormValid() || isCalculating}
            whileHover={isFormValid() && !isCalculating ? { scale: 1.02 } : {}}
            whileTap={isFormValid() && !isCalculating ? { scale: 0.98 } : {}}
            className={`relative flex-1 font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm overflow-hidden ${
              isFormValid() && !isCalculating
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-700 hover:to-teal-600 shadow-emerald-600/30 cursor-pointer'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            {/* Shimmer effect saat calculating */}
            {isCalculating && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: 'linear'
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{ transform: 'skewX(-20deg)' }}
              />
            )}
            
            {/* Icon dengan animasi */}
            {isCalculating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={18} className="flex-shrink-0" />
              </motion.div>
            ) : (
              <Calculator size={18} className="flex-shrink-0" />
            )}
            
            <span className="hidden xs:inline relative z-10">
              {isCalculating ? 'Menghitung...' : 'Hitung Pesangon'}
            </span>
            <span className="xs:hidden relative z-10">
              {isCalculating ? 'Menghitung...' : 'Hitung'}
            </span>
          </motion.button>
          
          <motion.button 
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 sm:px-6 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black uppercase tracking-wider sm:tracking-widest py-4 sm:py-5 rounded-xl sm:rounded-2xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <RefreshCw size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FormInput;
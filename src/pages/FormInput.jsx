import React, { useState, useEffect, useRef } from 'react';
import { Calculator, RefreshCw, FileText, AlertCircle, Clock } from 'lucide-react';
import { daftarAlasan } from './constants';
import ModernDropdown from './ModernDropdown';
import ModernDatePicker from './ModernDatePicker';

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

  // Refs untuk timeout
  const upahErrorTimeoutRef = useRef(null);
  const tunjanganErrorTimeoutRef = useRef(null);
  const cutiErrorTimeoutRef = useRef(null);

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

  // Handler untuk upah pokok
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

  // Handler untuk tunjangan tetap
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

  // Handler untuk sisa cuti
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

  return (
    <div className="lg:col-span-7 space-y-6">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
        
        {/* Toggle PKWTT/PKWT */}
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          {['PKWTT', 'PKWT'].map(t => (
            <button 
              key={t} 
              onClick={() => {setTipeKaryawan(t); setHasil(null);}} 
              className={`flex-1 py-3.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${
                tipeKaryawan === t 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {t === 'PKWTT' ? 'PERMANENT' : 'CONTRACT'}
            </button>
          ))}
        </div>

        {/* Alasan PHK (hanya untuk PKWTT) - MENGGUNAKAN DROPDOWN MODERN */}
        {tipeKaryawan === 'PKWTT' && (
          <ModernDropdown
            value={alasanPhkId}
            options={opsiAlasanPhk}
            onChange={setAlasanPhkId}
            label="Alasan PHK (PP 35/2021)"
            icon={<FileText size={14} />}
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
              type="text" 
              value={formatNumber(upahPokok)} 
              onChange={handleUpahPokokChange}
              onBlur={handleUpahPokokBlur}
              className={`w-full bg-slate-50 dark:bg-slate-950 border-2 rounded-2xl px-6 py-4 font-semibold focus:border-emerald-600 dark:focus:border-emerald-500 outline-none text-slate-900 dark:text-white transition-all hover:border-slate-300 dark:hover:border-slate-700 ${
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
              type="text" 
              value={formatNumber(tunjanganTetap)} 
              onChange={handleTunjanganTetapChange}
              onBlur={handleTunjanganTetapBlur}
              className={`w-full bg-slate-50 dark:bg-slate-950 border-2 rounded-2xl px-6 py-4 font-semibold focus:border-emerald-600 dark:focus:border-emerald-500 outline-none text-slate-900 dark:text-white transition-all hover:border-slate-300 dark:hover:border-slate-700 ${
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
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
              Total Upah Bulanan (Pokok + Tunjangan Tetap)
            </p>
            <p className="text-2xl font-black text-emerald-900 dark:text-emerald-300">
              {formatRupiah(totalUpahBulanan)}
            </p>
          </div>
        )}

        {/* Masa Kerja - MENGGUNAKAN DATE PICKER MODERN */}
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2 flex items-center gap-2">
            <Clock size={14} />
            Periode Kerja <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ModernDatePicker
              value={tanggalMulai}
              onChange={setTanggalMulai}
              label="Tanggal Mulai Kerja"
              maxDate={tanggalBerakhir}
              placeholder="Pilih tanggal mulai"
              required
            />
            <ModernDatePicker
              value={tanggalBerakhir}
              onChange={setTanggalBerakhir}
              label="Tanggal Berakhir/PHK"
              minDate={tanggalMulai}
              placeholder="Pilih tanggal berakhir"
              required
            />
          </div>
          
          {/* Display calculated masa kerja - HANYA TAMPIL JIKA KEDUA TANGGAL TERISI */}
          {tanggalMulai && tanggalBerakhir && (masaKerjaTahun > 0 || masaKerjaBulan > 0 || masaKerjaHari > 0) && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1">
                Total Masa Kerja
              </p>
              <p className="text-xl font-black text-blue-900 dark:text-blue-300">
                {masaKerjaTahun} Tahun {masaKerjaBulan} Bulan {masaKerjaHari} Hari
              </p>
            </div>
          )}
        </div>

        {/* Sisa Cuti (hanya untuk PKWTT) */}
        {tipeKaryawan === 'PKWTT' && (
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2 block">
              Sisa Cuti Tahunan (Hari)
            </label>
            <input 
              type="text" 
              placeholder="0" 
              value={sisaCuti}
              onChange={handleSisaCutiChange}
              onBlur={(e) => {
                if (e.target.value === '') {
                  setSisaCuti('0');
                }
              }}
              className={`w-full bg-slate-50 dark:bg-slate-950 border-2 rounded-2xl px-6 py-4 font-semibold text-slate-900 dark:text-white focus:border-emerald-600 dark:focus:border-emerald-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-700 ${
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
        <div className="flex gap-3">
          <button 
            onClick={hitungKompensasi}
            disabled={!isFormValid()}
            className={`flex-1 font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 text-sm ${
              isFormValid()
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-700 hover:to-teal-600 shadow-emerald-600/30 cursor-pointer'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            <Calculator size={20} /> Hitung Pesangon
          </button>
          <button 
            onClick={handleReset} 
            className="px-6 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Info Box - DIHAPUS SESUAI PERMINTAAN */}
      {/* <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
        <div className="flex gap-3">
          <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
          <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
            <p className="font-bold mb-2">Catatan Penting:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-300">
              <li>Perhitungan berdasarkan PP 35/2021 & Perppu Cipta Kerja</li>
              <li>Upah yang digunakan = Upah Pokok + Tunjangan Tetap</li>
              <li>Hasil aktual dapat berbeda sesuai PKB/PP Perusahaan</li>
              <li>Konsultasikan dengan ahli hukum ketenagakerjaan untuk kasus spesifik</li>
            </ul>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default FormInput;
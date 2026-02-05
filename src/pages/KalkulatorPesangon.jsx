import React, { useState, useEffect } from 'react';
import FormInput from './FormInput';
import HasilPerhitungan from './HasilPerhitungan';
import { pasalDatabase, daftarAlasan } from './constants';
import { AlertCircle, X } from 'lucide-react';

// Pindahkan animasi ke CSS global atau gunakan inline style
const modalAnimationStyle = {
  animation: 'fadeIn 0.15s ease-out'
};

// Tambahkan style dengan useEffect
const addGlobalStyles = () => {
  if (typeof document !== 'undefined') {
    const styleId = 'kalkulator-pesangon-styles';
    
    // Cek apakah style sudah ada
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
        
        /* Prevent horizontal scroll on mobile */
        body {
          overflow-x: hidden;
        }
      `;
      document.head.appendChild(style);
    }
  }
};

const KalkulatorPesangon = () => {
  const [tipeKaryawan, setTipeKaryawan] = useState('PKWTT');
  const [alasanPhkId, setAlasanPhkId] = useState('1');
  const [upahPokok, setUpahPokok] = useState('');
  const [tunjanganTetap, setTunjanganTetap] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalBerakhir, setTanggalBerakhir] = useState('');
  const [masaKerjaTahun, setMasaKerjaTahun] = useState(0);
  const [masaKerjaBulan, setMasaKerjaBulan] = useState(0);
  const [masaKerjaHari, setMasaKerjaHari] = useState(0);
  const [sisaCuti, setSisaCuti] = useState('');
  const [hasil, setHasil] = useState(null);
  const [sistemHariKerja, setSistemHariKerja] = useState('senin-jumat');
  
  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Tambahkan global styles saat komponen mount
  useEffect(() => {
    addGlobalStyles();
  }, []);

  // Fungsi untuk menampilkan modal
  const showAlertModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Fungsi untuk menghitung total hari kerja dalam sebulan
  const getTotalHariKerjaPerBulan = (sistemHariKerja) => {
    switch(sistemHariKerja) {
      case 'senin-jumat': return 21;
      case 'senin-sabtu': return 25;
      case 'roster': return 30;
      default: return 25;
    }
  };

  // Format label sistem hari kerja untuk ditampilkan
  const formatSistemHariKerja = (value) => {
    switch(value) {
      case 'senin-jumat': return 'Senin - Jumat';
      case 'senin-sabtu': return 'Senin - Sabtu';
      case 'roster': return 'Roster';
      default: return 'Senin - Jumat';
    }
  };

  // Auto calculate masa kerja ketika tanggal berubah
  useEffect(() => {
    if (tanggalMulai && tanggalBerakhir) {
      const mulai = new Date(tanggalMulai);
      const berakhir = new Date(tanggalBerakhir);
      
      if (berakhir >= mulai) {
        let tahun = berakhir.getFullYear() - mulai.getFullYear();
        let bulan = berakhir.getMonth() - mulai.getMonth();
        let hari = berakhir.getDate() - mulai.getDate();

        if (hari < 0) {
          bulan--;
          const lastMonth = new Date(berakhir.getFullYear(), berakhir.getMonth(), 0);
          hari += lastMonth.getDate();
        }

        if (bulan < 0) {
          tahun--;
          bulan += 12;
        }

        setMasaKerjaTahun(tahun);
        setMasaKerjaBulan(bulan);
        setMasaKerjaHari(hari);
      }
    }
  }, [tanggalMulai, tanggalBerakhir]);

  const hitungKompensasi = () => {
    const pokok = parseFloat(upahPokok) || 0;
    const tunjangan = parseFloat(tunjanganTetap) || 0;
    const upahBulanan = pokok + tunjangan;
    const thn = masaKerjaTahun;
    const bln = masaKerjaBulan;
    const totalMasaKerjaBulan = (thn * 12) + bln;

    // Validasi - menggunakan modal
    if (upahBulanan === 0) {
      showAlertModal('Mohon masukkan upah bulanan terlebih dahulu');
      return;
    }

    if (thn === 0 && bln === 0) {
      showAlertModal('Minimal masa kerja 1 bulan.');
      return;
    }

    if (tipeKaryawan === 'PKWT') {
      let kompensasi = 0;
      
      if (totalMasaKerjaBulan >= 12) {
        kompensasi = (totalMasaKerjaBulan / 12) * upahBulanan;
      } else if (totalMasaKerjaBulan >= 1) {
        kompensasi = (totalMasaKerjaBulan / 12) * upahBulanan;
      }

      const detail = [{
        label: 'Uang Kompensasi PKWT',
        value: kompensasi,
        keterangan: `Masa kerja: ${thn} tahun ${bln} bulan (${totalMasaKerjaBulan} bulan) × Rp ${formatNumber(upahBulanan)} ÷ 12 = Rp ${formatNumber(kompensasi)}`
      }];

      setHasil({ 
        total: kompensasi, 
        detail,
        masaKerja: `${thn} tahun ${bln} bulan ${masaKerjaHari} hari`,
        upahBulanan: upahBulanan,
        catatan: 'Kompensasi PKWT dihitung proporsional berdasarkan masa kerja (Pasal 16 PP 35/2021)',
        penjelasanKomponen: [],
        sistemHariKerja: formatSistemHariKerja(sistemHariKerja)
      });
    } else {
      const skenario = daftarAlasan.find(a => a.id === alasanPhkId);
      
      let upBase = 1;
      if (thn >= 8) upBase = 9;
      else if (thn >= 7) upBase = 8;
      else if (thn >= 6) upBase = 7;
      else if (thn >= 5) upBase = 6;
      else if (thn >= 4) upBase = 5;
      else if (thn >= 3) upBase = 4;
      else if (thn >= 2) upBase = 3;
      else if (thn >= 1) upBase = 2;
      else upBase = 1;

      let upmkBase = 0;
      if (thn >= 24) upmkBase = 10;
      else if (thn >= 21) upmkBase = 8;
      else if (thn >= 18) upmkBase = 7;
      else if (thn >= 15) upmkBase = 6;
      else if (thn >= 12) upmkBase = 5;
      else if (thn >= 9) upmkBase = 4;
      else if (thn >= 6) upmkBase = 3;
      else if (thn >= 3) upmkBase = 2;

      const cutiValue = parseInt(sisaCuti) || 0;
      const totalHariKerjaPerBulan = getTotalHariKerjaPerBulan(sistemHariKerja);
      const uphCuti = (cutiValue / totalHariKerjaPerBulan) * upahBulanan;
      
      const finalUp = upBase * upahBulanan * skenario.up;
      const finalUpmk = upmkBase * upahBulanan * skenario.upmk;
      const finalUph = skenario.uph ? uphCuti : 0;
      
      const totalResult = finalUp + finalUpmk + finalUph;

      const detail = [];
      const penjelasanKomponen = [];
      
      if (skenario.up > 0) {
        if (finalUp > 0) {
          detail.push({ 
            label: `Uang Pesangon (${skenario.up}x)`, 
            value: finalUp,
            keterangan: `${upBase} bulan upah × Rp ${formatNumber(upahBulanan)} × ${skenario.up} = Rp ${formatNumber(finalUp)}`
          });
        } else {
          penjelasanKomponen.push(`Uang Pesangon tidak dihitung karena masa kerja kurang dari 1 tahun (base: ${upBase} bulan).`);
        }
      } else {
        penjelasanKomponen.push(`Uang Pesangon = Rp 0 karena sesuai ${skenario.pasal}, tidak ada hak atas uang pesangon untuk kasus ini.`);
      }
      
      if (skenario.upmk > 0) {
        if (finalUpmk > 0) {
          detail.push({ 
            label: 'Uang Penghargaan Masa Kerja', 
            value: finalUpmk,
            keterangan: `${upmkBase} bulan upah × Rp ${formatNumber(upahBulanan)} ${skenario.upmk !== 1 ? `× ${skenario.upmk}` : ''} = Rp ${formatNumber(finalUpmk)}`
          });
        } else {
          penjelasanKomponen.push(`UPMK = Rp 0 karena masa kerja kurang dari 3 tahun. UPMK hanya diberikan untuk pekerja dengan masa kerja minimal 3 tahun (Pasal 40 ayat 3).`);
        }
      } else {
        penjelasanKomponen.push(`UPMK = Rp 0 karena sesuai ${skenario.pasal}, tidak ada hak atas UPMK untuk kasus ini.`);
      }
      
      if (finalUph > 0) {
        const hariKerjaLabel = formatSistemHariKerja(sistemHariKerja);
        detail.push({ 
          label: 'Uang Penggantian Hak (Cuti)', 
          value: finalUph,
          keterangan: `${cutiValue} hari cuti ÷ ${totalHariKerjaPerBulan} hari kerja (${hariKerjaLabel}) × Rp ${formatNumber(upahBulanan)} = Rp ${formatNumber(finalUph)}`
        });
      } else if (skenario.uph && cutiValue === 0) {
        penjelasanKomponen.push(`UPH (Cuti) = Rp 0 karena tidak ada sisa cuti yang belum diambil.`);
      }
      
      if (skenario.pisah) {
        detail.push({ 
          label: 'Uang Pisah', 
          value: null,
          keterangan: 'Berhak Atas Uang Pisah',
          isTextOnly: true
        });
      }

      const pasalInfo = pasalDatabase[skenario.pasal.replace('Pasal ', '')];
      const hariKerjaLabel = formatSistemHariKerja(sistemHariKerja);
      const totalHariKerja = getTotalHariKerjaPerBulan(sistemHariKerja);

      let catatanPoin = [];
      
      if (skenario.pisah) {
        catatanPoin = [
          `UPH (Cuti) = Hanya estimasi, mekanisme perhitungan aktual biasanya diatur dalam Perjanjian Kerja, Peraturan Perusahaan atau Perjanjian Kerja Bersama.`,
          `Uang Pisah = Besaranya tidak diatur undang-undang, melainkan ditentukan sepenuhnya melalui Perjanjian Kerja, Peraturan Perusahaan atau Perjanjian Kerja Bersama. `,
        ];
      } else {
        catatanPoin = [
          `UPH (Cuti) = Hanya estimasi, mekanisme perhitungan aktual biasanya diatur dalam Perjanjian Kerja, Peraturan Perusahaan atau Perjanjian Kerja Bersama.`,
        ];
      }

      const semuaPenjelasan = [...catatanPoin, ...penjelasanKomponen];

      setHasil({ 
        total: totalResult, 
        detail,
        skenario: skenario.label,
        pasal: skenario.pasal,
        pasalInfo: pasalInfo,
        masaKerja: `${thn} tahun ${bln} bulan ${masaKerjaHari} hari`,
        upahBulanan: upahBulanan,
        sistemHariKerja: hariKerjaLabel,
        totalHariKerjaPerBulan: totalHariKerja,
        penjelasanKomponen: semuaPenjelasan,
        adaUangPisah: skenario.pisah
      });
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const reset = () => {
    setUpahPokok('');
    setTunjanganTetap('');
    setTanggalMulai('');
    setTanggalBerakhir('');
    setMasaKerjaTahun(0);
    setMasaKerjaBulan(0);
    setMasaKerjaHari(0);
    setSisaCuti('0');
    setHasil(null);
    setSistemHariKerja('senin-jumat');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center pt-16 sm:pt-24 lg:pt-32 pb-8 sm:pb-12 px-3 sm:px-4 lg:px-6 font-sans">
        <div className="max-w-7xl w-full">
          {/* Header */}
          <header className="mb-8 sm:mb-12 text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 sm:w-12 h-[2px] sm:h-[3px] bg-gradient-to-r from-emerald-600 to-teal-500"></div>
              <span className="text-emerald-600 text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase">
                HR Digitazion By Fachrully
              </span>
              <div className="w-8 sm:w-12 h-[2px] sm:h-[3px] bg-gradient-to-l from-emerald-600 to-teal-500"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2 sm:mb-3 leading-tight">
              Severance <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Calculator</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto px-4">
              Kalkulator Pesangon berdasarkan PP 35/2021 & Undang - Undang Cipta Kerja
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            {/* Form Input */}
            <FormInput
              tipeKaryawan={tipeKaryawan}
              setTipeKaryawan={setTipeKaryawan}
              alasanPhkId={alasanPhkId}
              setAlasanPhkId={setAlasanPhkId}
              upahPokok={upahPokok}
              setUpahPokok={setUpahPokok}
              tunjanganTetap={tunjanganTetap}
              setTunjanganTetap={setTunjanganTetap}
              tanggalMulai={tanggalMulai}
              setTanggalMulai={setTanggalMulai}
              tanggalBerakhir={tanggalBerakhir}
              setTanggalBerakhir={setTanggalBerakhir}
              masaKerjaTahun={masaKerjaTahun}
              masaKerjaBulan={masaKerjaBulan}
              masaKerjaHari={masaKerjaHari}
              sisaCuti={sisaCuti}
              setSisaCuti={setSisaCuti}
              hitungKompensasi={hitungKompensasi}
              reset={reset}
              formatRupiah={formatRupiah}
              setHasil={setHasil}
              sistemHariKerja={sistemHariKerja}
              setSistemHariKerja={setSistemHariKerja}
            />

            {/* Hasil Perhitungan */}
            <HasilPerhitungan
              hasil={hasil}
              tipeKaryawan={tipeKaryawan}
              formatRupiah={formatRupiah}
            />
          </div>

          {/* Footer */}
          <footer className="mt-12 sm:mt-16 text-center text-xs text-slate-500 dark:text-slate-600 space-y-2 px-4">
            <p className="font-bold">© 2026 Severance Calculator</p>
            <p className="text-[10px] max-w-2xl mx-auto leading-relaxed">
              Disclaimer: Kalkulator ini hanya sebagai alat bantu perhitungan estimasi. 
              Untuk keperluan resmi, konsultasikan dengan praktisi HR kepercayaan anda.
            </p>
          </footer>
        </div>
      </div>

      {/* Modal Alert Minimalis */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal Content Minimalis */}
          <div className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-300 dark:border-slate-700 shadow-2xl shadow-black/30 dark:shadow-black/60 overflow-hidden animate-fadeIn"
               style={modalAnimationStyle}>
            <div className="px-5 sm:px-6 py-5 sm:py-6 text-center">
              <div className="mb-4">
                <div className="inline-flex p-2.5 sm:p-3 bg-amber-100 dark:bg-amber-900/40 rounded-full">
                  <AlertCircle className="text-amber-600 dark:text-amber-400" size={24} />
                </div>
              </div>
              
              <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base font-medium leading-relaxed mb-5 sm:mb-6 px-2">
                {modalMessage}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-emerald-700 hover:to-teal-600 transition-all active:scale-[0.98] text-sm"
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KalkulatorPesangon;
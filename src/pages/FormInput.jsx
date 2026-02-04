import React from 'react';
import { FileText, ChevronDown, Calendar, AlertCircle } from 'lucide-react';
import { daftarAlasan } from './constants';

const FormInput = ({ 
  tipeKaryawan, setTipeKaryawan, 
  alasanPhkId, setAlasanPhkId, 
  upahPokok, setUpahPokok, 
  tunjanganTetap, setTunjanganTetap,
  tanggalMulai, setTanggalMulai,
  tanggalBerakhir, setTanggalBerakhir,
  masaKerja, sisaCuti, setSisaCuti,
  onHitung, onReset, formatRupiah
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Toggle PKWTT/PKWT */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        {['PKWTT', 'PKWT'].map(t => (
          <button 
            key={t} 
            onClick={() => setTipeKaryawan(t)}
            className={`flex-1 py-3.5 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
              tipeKaryawan === t 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg' 
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {t === 'PKWTT' ? 'Karyawan Tetap' : 'Karyawan Kontrak'}
          </button>
        ))}
      </div>

      {/* Alasan PHK - Hanya muncul jika PKWTT */}
      {tipeKaryawan === 'PKWTT' && (
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
            <FileText size={14} /> Alasan Pemutusan Hubungan Kerja
          </label>
          <div className="relative group">
            <select 
              value={alasanPhkId} 
              onChange={(e) => setAlasanPhkId(e.target.value)} 
              className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 appearance-none font-bold text-sm outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              {daftarAlasan.map(a => (
                <option key={a.id} value={a.id}>{a.label} ({a.pasal})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-500 pointer-events-none transition-colors" size={20} />
          </div>
        </div>
      )}

      {/* Input Tanggal Kerja */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
            <Calendar size={14} /> Tanggal Mulai Kerja
          </label>
          <input 
            type="date" 
            value={tanggalMulai} 
            onChange={(e) => setTanggalMulai(e.target.value)} 
            className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
            <Calendar size={14} /> Tanggal Efektif PHK
          </label>
          <input 
            type="date" 
            value={tanggalBerakhir} 
            onChange={(e) => setTanggalBerakhir(e.target.value)} 
            className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Display Masa Kerja Real-time */}
      {masaKerja.tahun > 0 || masaKerja.bulan > 0 || masaKerja.hari > 0 ? (
        <div className="mx-2 flex gap-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 italic">
          <span>{masaKerja.tahun} Tahun</span>
          <span>{masaKerja.bulan} Bulan</span>
          <span>{masaKerja.hari} Hari</span>
        </div>
      ) : null}

      {/* Input Gaji */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 block">Upah Pokok (Bulanan)</label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Rp</span>
            <input 
              type="number" 
              value={upahPokok} 
              onChange={(e) => setUpahPokok(e.target.value)} 
              className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 font-bold outline-none focus:border-emerald-500" 
              placeholder="0" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 block">Tunjangan Tetap</label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Rp</span>
            <input 
              type="number" 
              value={tunjanganTetap} 
              onChange={(e) => setTunjanganTetap(e.target.value)} 
              className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 font-bold outline-none focus:border-emerald-500" 
              placeholder="0" 
            />
          </div>
        </div>
      </div>

      {/* Sisa Cuti - Penting untuk UPH */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 block text-emerald-600">Sisa Cuti Tahunan (Hari)</label>
        <input 
          type="number" 
          value={sisaCuti} 
          onChange={(e) => setSisaCuti(e.target.value)} 
          className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-emerald-100 dark:border-emerald-900/30 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500" 
          placeholder="0" 
        />
      </div>

      {/* Total Upah Display */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-800/50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400 mb-1">Total Upah Dasar</p>
            <p className="text-3xl font-black text-emerald-900 dark:text-emerald-200 tracking-tighter italic">
              {formatRupiah((parseFloat(upahPokok) || 0) + (parseFloat(tunjanganTetap) || 0))}
            </p>
          </div>
          <AlertCircle className="text-emerald-300 dark:text-emerald-700" size={32} />
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button 
          onClick={onHitung} 
          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all text-xs"
        >
          Hitung Sekarang
        </button>
        <button 
          onClick={onReset} 
          className="px-8 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FormInput;
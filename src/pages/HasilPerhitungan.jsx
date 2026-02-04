import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// CATATAN: Saya hapus import lucide-react sementara untuk memastikan error hilang.
// Kita gunakan Emoji atau SVG manual sebagai pengganti.

const HasilPerhitungan = ({ hasil, tipeKaryawan, formatRupiah }) => {
  return (
    <div className="sticky top-6">
      <AnimatePresence mode="wait">
        {hasil ? (
          <motion.div
            key="hasil"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl shadow-emerald-500/40 border border-white/20"
          >
            {/* Header Hasil */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 opacity-80">
                {/* Ikon Check Manual */}
                <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Kalkulasi Selesai</span>
              </div>
              <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                {tipeKaryawan}
              </div>
            </div>

            {/* Total Nominal */}
            <div className="mb-10">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mb-4 italic">Estimasi Hak Diterima:</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none break-words">
                {formatRupiah(hasil.total)}
              </h2>
            </div>

            {/* Detail Masa Kerja */}
            <div className="mb-8 p-4 bg-black/10 rounded-2xl border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Total Masa Kerja</p>
              <p className="text-sm font-bold italic">{hasil.masaKerja}</p>
            </div>

            {/* Rincian Komponen */}
            <div className="space-y-5 border-t border-white/20 pt-8 mb-8">
              {hasil.detail.map((item, i) => (
                <div key={i} className="flex justify-between items-start group">
                  <div className="max-w-[180px]">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-relaxed group-hover:opacity-100 transition-opacity">
                      {item.label}
                    </p>
                    <p className="text-[9px] opacity-50 italic">{item.keterangan}</p>
                  </div>
                  <span className="font-black text-lg whitespace-nowrap">{formatRupiah(item.value)}</span>
                </div>
              ))}
            </div>

            {/* Informasi Hukum (Pasal) */}
            {hasil.pasalInfo && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 bg-white/10 backdrop-blur-md rounded-[2rem] p-6 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-3 text-emerald-100">
                  <span className="text-lg">⚖️</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">{hasil.pasalInfo.judul}</p>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90 text-justify font-medium italic">
                  "{hasil.pasalInfo.isi}"
                </p>
              </motion.div>
            )}

            {/* Footer Hasil */}
            <div className="mt-8 flex items-start gap-3 opacity-60">
              <span className="text-sm">ℹ️</span>
              <p className="text-[9px] font-bold leading-relaxed uppercase tracking-wider">
                {hasil.catatan}. Nilai di atas adalah estimasi bruto sebelum pajak (PPh 21).
              </p>
            </div>
          </motion.div>
        ) : (
          /* Tampilan Default (Kosong) */
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full min-h-[500px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse"></div>
              {/* SVG Manual untuk Loading Spinner */}
              <svg 
                className="text-slate-300 dark:text-slate-700 animate-spin-slow relative z-10 w-16 h-16" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600 mb-4">
              Menunggu Input Data
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 max-w-[240px] leading-relaxed font-medium">
              Isi formulir di samping untuk menganalisa hak pesangon sesuai regulasi terbaru.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HasilPerhitungan;
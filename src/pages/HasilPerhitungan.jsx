import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, BookOpen } from 'lucide-react';

const HasilPerhitungan = ({ hasil, tipeKaryawan, formatRupiah }) => {
  return (
    <div className="lg:col-span-5">
      <div className="sticky top-6">
        <AnimatePresence mode="wait">
          {hasil ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-8 sm:p-10 text-white shadow-2xl shadow-emerald-600/40"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-black uppercase tracking-[0.4em] opacity-80">
                  Total Hak Pekerja
                </p>
                <div className="px-4 py-1.5 bg-white/20 rounded-full text-xs font-bold">
                  {tipeKaryawan}
                </div>
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-2 leading-none">
                {formatRupiah(hasil.total)}
              </h2>
              
              {hasil.masaKerja && (
                <p className="text-sm opacity-80 mb-8">
                  Masa kerja: {hasil.masaKerja}
                </p>
              )}

              {hasil.skenario && (
                <div className="bg-white/10 rounded-2xl p-4 mb-6 backdrop-blur-sm">
                  <p className="text-xs font-bold opacity-70 mb-1">Skenario PHK:</p>
                  <p className="text-sm font-bold">{hasil.skenario}</p>
                  <p className="text-xs opacity-70 mt-1">{hasil.pasal}</p>
                </div>
              )}

              <div className="space-y-4 border-t border-white/20 pt-8 mb-6">
                {hasil.detail.map((item, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-black uppercase tracking-widest opacity-80">
                        {item.label}
                      </span>
                      {item.isTextOnly ? (
                        <span className="text-sm font-medium italic opacity-90">
                          Berhak Atas Uang Pisah
                        </span>
                      ) : (
                        <span className="font-black text-lg">
                          {formatRupiah(item.value)}
                        </span>
                      )}
                    </div>
                    {/* Tampilkan keterangan hanya untuk item yang BUKAN text only */}
                    {!item.isTextOnly && item.keterangan && (
                      <p className="text-xs opacity-60 leading-relaxed mt-1">
                        {item.keterangan}
                      </p>
                    )}
                    {/* Tambahkan catatan khusus untuk uang pisah */}
                    {item.catatanPisah && (
                      <div className="mt-2 p-3 bg-white/10 rounded-xl">
                        <p className="text-xs opacity-90 leading-relaxed italic">
                          {item.catatanPisah}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Gabungan Catatan dan Penjelasan Komponen */}
              {(hasil.catatan || (hasil.penjelasanKomponen && hasil.penjelasanKomponen.length > 0)) && (
                <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                  <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-3">
                    Catatan dan Penjelasan
                  </p>
                  
                  {/* Gabungkan semua penjelasan dalam list */}
                  <div className="space-y-1">
                    {/* Tampilkan catatan utama jika ada */}
                    {hasil.catatan && (
                      <p className="text-xs opacity-70 leading-relaxed">
                        • {hasil.catatan}
                      </p>
                    )}
                    
                    {/* Tampilkan penjelasan komponen */}
                    {hasil.penjelasanKomponen && hasil.penjelasanKomponen.map((penjelasan, i) => (
                      <p key={i} className="text-xs opacity-70 leading-relaxed">
                        • {penjelasan}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Analisa Hukum */}
              {hasil.pasalInfo && (
                <div className="mt-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen size={18} className="opacity-80" />
                      <p className="text-xs font-black uppercase tracking-widest opacity-80">
                        Referensi Hukum ({hasil.pasalInfo.judul.split(' - ')[0]})
                      </p>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90 text-justify mb-3 italic">
                      "{hasil.pasalInfo.isi}"
                    </p>
                    <p className="text-[10px] uppercase tracking-wider opacity-60 mt-4">
                      PP No. 35 Tahun 2021 tentang Perjanjian Kerja Waktu Tertentu, Alih Daya, Waktu Kerja dan Waktu Istirahat, dan Pemutusan Hubungan Kerja
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full min-h-[400px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center p-12 text-center"
            >
              <RefreshCw size={48} className="mb-6 text-slate-300 dark:text-slate-700 animate-pulse" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-2">
                Menunggu Input Data
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 max-w-xs">
                Silakan isi data pekerja untuk menghitung estimasi pesangon
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HasilPerhitungan;
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, BookOpen } from 'lucide-react';

const HasilPerhitungan = ({ hasil, tipeKaryawan, formatRupiah }) => {
  return (
    <div className="lg:col-span-5">
      <div className="lg:sticky lg:top-6">
        <AnimatePresence mode="wait">
          {hasil ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl shadow-emerald-600/40"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] opacity-80">
                  Total Hak Pekerja
                </p>
                <div className="px-3 sm:px-4 py-1 sm:py-1.5 bg-white/20 rounded-full text-[10px] sm:text-xs font-bold">
                  {tipeKaryawan}
                </div>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-2 leading-none break-words">
                {formatRupiah(hasil.total)}
              </h2>
              
              {hasil.masaKerja && (
                <p className="text-xs sm:text-sm opacity-80 mb-6 sm:mb-8">
                  Masa kerja: {hasil.masaKerja}
                </p>
              )}

              {hasil.skenario && (
                <div className="bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 backdrop-blur-sm">
                  <p className="text-[10px] sm:text-xs font-bold opacity-70 mb-1">Skenario PHK:</p>
                  <p className="text-xs sm:text-sm font-bold break-words">{hasil.skenario}</p>
                  <p className="text-[10px] sm:text-xs opacity-70 mt-1">{hasil.pasal}</p>
                </div>
              )}

              <div className="space-y-3 sm:space-y-4 border-t border-white/20 pt-6 sm:pt-8 mb-4 sm:mb-6">
                {hasil.detail.map((item, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-start mb-1 gap-3">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest opacity-80 flex-shrink-0">
                        {item.label}
                      </span>
                      {item.isTextOnly ? (
                        <span className="text-xs sm:text-sm font-medium italic opacity-90 text-right">
                          Berhak Atas Uang Pisah
                        </span>
                      ) : (
                        <span className="font-black text-base sm:text-lg text-right break-words">
                          {formatRupiah(item.value)}
                        </span>
                      )}
                    </div>
                    {/* Tampilkan keterangan hanya untuk item yang BUKAN text only */}
                    {!item.isTextOnly && item.keterangan && (
                      <p className="text-[10px] sm:text-xs opacity-60 leading-relaxed mt-1 break-words">
                        {item.keterangan}
                      </p>
                    )}
                    {/* Tambahkan catatan khusus untuk uang pisah */}
                    {item.catatanPisah && (
                      <div className="mt-2 p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl">
                        <p className="text-[10px] sm:text-xs opacity-90 leading-relaxed italic break-words">
                          {item.catatanPisah}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Gabungan Catatan dan Penjelasan Komponen */}
              {(hasil.catatan || (hasil.penjelasanKomponen && hasil.penjelasanKomponen.length > 0)) && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10 space-y-2">
                  <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest opacity-70 mb-2 sm:mb-3">
                    Catatan dan Penjelasan
                  </p>
                  
                  {/* Gabungkan semua penjelasan dalam list */}
                  <div className="space-y-1">
                    {/* Tampilkan catatan utama jika ada */}
                    {hasil.catatan && (
                      <p className="text-[10px] sm:text-xs opacity-70 leading-relaxed break-words">
                        • {hasil.catatan}
                      </p>
                    )}
                    
                    {/* Tampilkan penjelasan komponen */}
                    {hasil.penjelasanKomponen && hasil.penjelasanKomponen.map((penjelasan, i) => (
                      <p key={i} className="text-[10px] sm:text-xs opacity-70 leading-relaxed break-words">
                        • {penjelasan}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Analisa Hukum */}
              {hasil.pasalInfo && (
                <div className="mt-6 sm:mt-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <BookOpen size={16} className="opacity-80 flex-shrink-0" />
                      <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest opacity-80 break-words">
                        Referensi Hukum ({hasil.pasalInfo.judul.split(' - ')[0]})
                      </p>
                    </div>
                    <p className="text-[10px] sm:text-xs leading-relaxed opacity-90 text-justify mb-2 sm:mb-3 italic break-words">
                      "{hasil.pasalInfo.isi}"
                    </p>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wide sm:tracking-wider opacity-60 mt-3 sm:mt-4 break-words">
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
              className="h-full min-h-[300px] sm:min-h-[400px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-8 sm:p-12 text-center"
            >
              <RefreshCw size={40} className="mb-4 sm:mb-6 text-slate-300 dark:text-slate-700 animate-pulse" />
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest text-slate-400 dark:text-slate-600 mb-2">
                Menunggu Input Data
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 max-w-xs px-4">
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
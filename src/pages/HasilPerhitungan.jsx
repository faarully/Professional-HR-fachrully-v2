import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, BookOpen, TrendingUp, CheckCircle, ChevronRight } from 'lucide-react';

const HasilPerhitungan = ({ hasil, tipeKaryawan, formatRupiah, hasReset }) => {
  // Variants untuk animasi yang lebih tenang
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const amountVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const detailItemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Progress bar variants dengan animasi yang tenang
  const progressBarVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        delay: 0.1
      }
    }
  };

  // Variants untuk rotating icon
  const rotateVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "linear"
      }
    }
  };

  // Variants untuk dots animation
  const dotVariants = (i) => ({
    initial: { scale: 1, opacity: 0.5 },
    animate: {
      scale: [1, 1.3, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        delay: i * 0.2,
        ease: "easeInOut"
      }
    }
  });

  return (
    <div className="lg:col-span-5">
      <div className="lg:sticky lg:top-6">
        <AnimatePresence mode="wait">
          {hasil ? (
            <motion.div 
              key={`hasil-${hasReset}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                ease: "easeOut"
              }}
              className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl shadow-emerald-600/40"
            >
              <motion.div
                key={`container-${hasReset}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative z-10"
              >
                {/* Header */}
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.8,
                        ease: "easeInOut",
                        delay: 0.1
                      }}
                    >
                      <TrendingUp size={14} className="opacity-80" />
                    </motion.div>
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] opacity-80">
                      Estimasi Hak Pekerja
                    </p>
                  </div>
                  <motion.div 
                    variants={itemVariants}
                    className="px-3 sm:px-4 py-1 sm:py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] sm:text-xs font-bold border border-white/30"
                  >
                    {tipeKaryawan}
                  </motion.div>
                </motion.div>
                
                {/* Progress bar indicator - dipertahankan */}
                <div className="h-1 bg-white/20 rounded-full mb-4 overflow-hidden">
                  <motion.div 
                    key={`progress-${hasReset}`}
                    variants={progressBarVariants}
                    initial="hidden"
                    animate="visible"
                    className="h-full bg-gradient-to-r from-white to-emerald-100 rounded-full"
                  />
                </div>

                {/* Jumlah total */}
                <motion.h2 
                  key={`amount-${hasReset}`}
                  variants={amountVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-2 leading-none break-words"
                >
                  {formatRupiah(hasil.total)}
                </motion.h2>
                
                {/* Masa kerja */}
                {hasil.masaKerja && (
                  <motion.p 
                    key={`masakerja-${hasReset}`}
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-xs sm:text-sm opacity-80 mb-6 sm:mb-8 flex items-center gap-2"
                  >
                    <CheckCircle size={12} />
                    <span>Masa kerja: {hasil.masaKerja}</span>
                  </motion.p>
                )}

                {/* Skenario PHK */}
                {hasil.skenario && (
                  <motion.div 
                    key={`skenario-${hasReset}`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-white/20"
                  >
                    <p className="text-[10px] sm:text-xs font-bold opacity-70 mb-1 flex items-center gap-1">
                      <ChevronRight size={10} />
                      Skenario PHK:
                    </p>
                    <p className="text-xs sm:text-sm font-bold break-words">{hasil.skenario}</p>
                    <p className="text-[10px] sm:text-xs opacity-70 mt-1">{hasil.pasal}</p>
                  </motion.div>
                )}

                {/* Detail perhitungan */}
                <motion.div 
                  key={`detail-${hasReset}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3 sm:space-y-4 border-t border-white/20 pt-6 sm:pt-8 mb-4 sm:mb-6"
                >
                  {hasil.detail.map((item, i) => (
                    <motion.div 
                      key={`detail-item-${i}-${hasReset}`}
                      variants={detailItemVariants}
                      custom={i}
                      className="group rounded-lg sm:rounded-xl p-3 hover:bg-white/5 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-start mb-1 gap-3">
                        <div className="flex items-center gap-2">
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05 + 0.2 }}
                            className="w-1.5 h-1.5 rounded-full bg-white/60"
                          />
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest opacity-80 flex-shrink-0">
                            {item.label}
                          </span>
                        </div>
                        {item.isTextOnly ? (
                          <span className="text-xs sm:text-sm font-medium italic opacity-90 text-right">
                            Berhak Atas Uang Pisah
                          </span>
                        ) : (
                          <motion.span 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 + 0.3 }}
                            className="font-black text-base sm:text-lg text-right break-words"
                          >
                            {formatRupiah(item.value)}
                          </motion.span>
                        )}
                      </div>
                      
                      {/* Keterangan */}
                      {!item.isTextOnly && item.keterangan && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 + 0.4 }}
                          className="text-[10px] sm:text-xs opacity-60 leading-relaxed mt-1 break-words"
                        >
                          {item.keterangan}
                        </motion.p>
                      )}
                      
                      {/* Catatan khusus */}
                      {item.catatanPisah && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 + 0.5 }}
                          className="mt-2 p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm"
                        >
                          <p className="text-[10px] sm:text-xs opacity-90 leading-relaxed italic break-words">
                            {item.catatanPisah}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Catatan dan Penjelasan */}
                {(hasil.catatan || (hasil.penjelasanKomponen && hasil.penjelasanKomponen.length > 0)) && (
                  <motion.div 
                    key={`catatan-${hasReset}`}
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <BookOpen size={14} className="opacity-70" />
                      <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest opacity-70">
                        Catatan dan Penjelasan
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      {hasil.catatan && (
                        <motion.p 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-[10px] sm:text-xs opacity-70 leading-relaxed break-words flex items-start gap-1"
                        >
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 flex-shrink-0" />
                          {hasil.catatan}
                        </motion.p>
                      )}
                      
                      {hasil.penjelasanKomponen && hasil.penjelasanKomponen.map((penjelasan, i) => (
                        <motion.p 
                          key={`penjelasan-${i}-${hasReset}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="text-[10px] sm:text-xs opacity-70 leading-relaxed break-words flex items-start gap-1"
                        >
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 flex-shrink-0" />
                          {penjelasan}
                        </motion.p>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Analisa Hukum */}
                {hasil.pasalInfo && (
                  <motion.div 
                    key={`hukum-${hasReset}`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-6 sm:mt-8"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className="p-1.5 bg-white/20 rounded-lg">
                          <BookOpen size={16} className="opacity-80 flex-shrink-0" />
                        </div>
                        <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest opacity-80 break-words">
                          Referensi Hukum ({hasil.pasalInfo.judul.split(' - ')[0]})
                        </p>
                      </div>
                      
                      <p className="text-[10px] sm:text-xs leading-relaxed opacity-90 text-justify mb-2 sm:mb-3 italic break-words relative pl-3 border-l-2 border-white/30">
                        "{hasil.pasalInfo.isi}"
                      </p>
                      
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-wide sm:tracking-wider opacity-60 mt-3 sm:mt-4 break-words">
                        PP No. 35 Tahun 2021 tentang Perjanjian Kerja Waktu Tertentu, Alih Daya, Waktu Kerja dan Waktu Istirahat, dan Pemutusan Hubungan Kerja
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key={`empty-state-${hasReset}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full min-h-[300px] sm:min-h-[400px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-8 sm:p-12 text-center relative overflow-hidden"
            >
              {/* Animated rotating icon */}
              <motion.div
                variants={rotateVariants}
                initial="initial"
                animate="animate"
                className="mb-4 sm:mb-6"
              >
                <RefreshCw size={40} className="text-slate-300 dark:text-slate-700" />
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest text-slate-400 dark:text-slate-600 mb-2 relative z-10"
              >
                Menunggu Input Data
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 max-w-xs px-4 relative z-10"
              >
                Silakan isi data pekerja untuk menghitung estimasi pesangon
              </motion.p>
              
              {/* Animated dots */}
              <motion.div 
                className="absolute bottom-6 flex gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    variants={dotVariants(i)}
                    initial="initial"
                    animate="animate"
                    className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HasilPerhitungan;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';
// Config & Components
import { APPS_SCRIPT_URL } from './constants/config';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Expertise from './components/Expertise';
import Experience from './components/Experience';
import Education from './components/Education';
import Loader from './components/Loader';
import DarkModeSwitcher from './components/DarkModeSwitcher'; // Import switcher baru

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(APPS_SCRIPT_URL);
        const json = await response.json();
        setData(json);
      } catch (e) {
        console.error("Failed to fetch:", e);
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };
    fetchData();
  }, []);

  const whatsappNumber = data?.Hero?.['WA Phone'] || "";

  return (
    /* UPDATE: 
       - Tambahkan 'dark:bg-slate-950' untuk background gelap.
       - Tambahkan 'dark:text-slate-100' untuk warna teks utama di dark mode.
       - Tambahkan 'transition-colors duration-500' agar perpindahan halus.
    */
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900 selection:text-emerald-900 dark:selection:text-emerald-100 text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden">
      
      <AnimatePresence mode="wait">
        {loading && <Loader />}
      </AnimatePresence>
      
      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Navbar whatsappNumber={whatsappNumber} />
          
          <main>
            {/* Hero Section */}
            <Hero data={data?.Hero} />
            
            {/* Skill Marquee */}
            <div className="relative z-20 -mt-10 lg:mt-0 mb-10">
              <Marquee skills={data?.Skills} />
            </div>
           
            {/* Content Sections */}
            <Expertise skills={data?.['Professional Expertise'] || data?.['Skill Set']} />
            <Experience experiences={data?.Experience} />
            <Education education={data?.Education} />

            {/* Contact Section */}
            {/* UPDATE: Tambahkan bg-white dark:bg-slate-950 */}
            <section id="contact" className="py-40 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
              <div className="max-w-5xl mx-auto px-6 text-center">
                <motion.div 
                  initial={{ opacity: 0, y: 40 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: false }} 
                  transition={{ duration: 1 }}
                >
                  <h2 className="text-6xl md:text-9xl font-black mb-12 tracking-tight leading-none uppercase text-slate-900 dark:text-white">
                    LET'S WORK <br />
                    <span className="text-emerald-600 italic">TOGETHER.</span>
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-16 text-xl max-w-2xl mx-auto font-medium">
                    Ready to elevate your HR strategy or transform your organizational culture? Let's connect and build something impactful.
                  </p>
                  <motion.a 
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.2)" }} 
                    whileTap={{ scale: 0.95 }} 
                    href={`mailto:${data?.Hero?.Email}`} 
                    className="inline-flex items-center gap-6 px-16 py-6 bg-blue-900 dark:bg-emerald-600 text-white font-bold text-2xl rounded-full hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-2xl shadow-blue-100 dark:shadow-none group"
                  >
                    Get In Touch
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <Mail size={28} />
                    </motion.div>
                  </motion.a>
                </motion.div>
              </div>
            </section>
          </main>

          {/* Footer Section */}
          {/* UPDATE: Tambahkan dark:bg-slate-900/50 dark:border-slate-800 */}
          <footer className="bg-slate-50 dark:bg-slate-900/50 py-20 border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 text-center">
              <div 
                className="text-2xl font-black italic text-slate-900 dark:text-white cursor-pointer" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                FACHRULLY<span className="text-emerald-600 not-italic">.</span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] italic">
                © 2026 Designed & Developed by Muhammad Fachrully | HR Generalist
              </p>
              <div className="hidden md:block w-32"></div>
            </div>
          </footer>

          {/* PASANG SWITCHER DI SINI */}
          <DarkModeSwitcher />
        </motion.div>
      )}
    </div>
  );
}
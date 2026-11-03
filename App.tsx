/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { QuickActionCards } from './components/QuickActionCards';
import { HomeTriColumn } from './components/HomeTriColumn';
import { PersistentPlayer } from './components/PersistentPlayer';
import { RecitersDirectory } from './components/RecitersDirectory';
import { DigitalMushaf } from './components/DigitalMushaf';
import { QuranLiveExperience } from './components/QuranLiveExperience';
import { MemorizationModule } from './components/MemorizationModule';
import { TajweedAcademy } from './components/TajweedAcademy';
import { DailyContent } from './components/DailyContent';
import { KhatmaTracker } from './components/KhatmaTracker';
import { QuranAIAssistant } from './components/QuranAIAssistant';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { ALL_SURAHS } from './utils/quranData';
import { Play, Sparkles, BookOpen, Volume2, WifiOff } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    theme,
    selectedReciter,
    setSelectedSurah,
    playTrack,
    language,
  } = useApp();

  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker if supported
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getThemeClass = () => {
    if (theme === 'mushaf') return 'bg-[#04281f] text-[#fbf5e6]';
    if (theme === 'dark') return 'bg-[#021310] text-slate-100';
    return 'bg-[#031d17] text-slate-100';
  };

  return (
    <div className={`min-h-screen flex flex-col font-cairo ${getThemeClass()} selection:bg-amber-400 selection:text-emerald-950 pb-20`}>
      {/* Offline Status Toast */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs px-4 py-2 text-center font-bold flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
          <WifiOff className="w-4 h-4" />
          <span>وضع عدم الاتصال — يمكنك متابعة قراءة المصحف والأذكار المحفوظة في الذاكرة المؤقتة.</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <div className="space-y-6">
            <HeroBanner />
            <QuickActionCards />
            <HomeTriColumn />

            {/* Popular Surahs Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-6">
              <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-bold text-amber-300 font-quran">
                    {language === 'ar' ? 'السور الأكثر استماعاً وقراءة' : 'Popular Surahs'}
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentPage('mushaf')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                >
                  {language === 'ar' ? 'عرض المصحف كاملاً (114 سورة) ←' : 'View All 114 Surahs →'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
                {[
                  { num: 1, name: 'الفاتحة', english: 'Al-Fatihah', verses: 7 },
                  { num: 2, name: 'البقرة', english: 'Al-Baqarah', verses: 286 },
                  { num: 18, name: 'الكهف', english: 'Al-Kahf', verses: 110 },
                  { num: 36, name: 'يس', english: 'Ya-Sin', verses: 83 },
                  { num: 55, name: 'الرحمن', english: 'Ar-Rahman', verses: 78 },
                  { num: 56, name: 'الواقعة', english: 'Al-Waqi’ah', verses: 96 },
                  { num: 67, name: 'الملك', english: 'Al-Mulk', verses: 30 },
                  { num: 94, name: 'الشرح', english: 'Ash-Sharh', verses: 8 },
                  { num: 112, name: 'الإخلاص', english: 'Al-Ikhlas', verses: 4 },
                  { num: 113, name: 'الفلق', english: 'Al-Falaq', verses: 5 },
                  { num: 114, name: 'الناس', english: 'An-Nas', verses: 6 },
                  { num: 12, name: 'يوسف', english: 'Yusuf', verses: 111 },
                ].map((s) => {
                  const surahObj = ALL_SURAHS.find((item) => item.number === s.num);
                  return (
                    <div
                      key={s.num}
                      className="group p-3.5 rounded-2xl bg-[#03241d] hover:bg-[#043328] border border-amber-500/25 hover:border-amber-400 transition-all duration-300 shadow-md flex flex-col justify-between cursor-pointer"
                      onClick={() => {
                        if (surahObj) {
                          setSelectedSurah(surahObj);
                          playTrack(selectedReciter, surahObj);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-md bg-emerald-950 text-amber-300 text-[11px] font-mono font-bold flex items-center justify-center border border-emerald-800">
                          {s.num}
                        </span>
                        <Play className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <div className="mt-3 text-right">
                        <span className="text-sm font-bold text-amber-200 font-quran block group-hover:text-amber-300">
                          سورة {s.name}
                        </span>
                        <span className="text-[11px] text-emerald-400/80 block mt-0.5">
                          {s.english} • {s.verses} آية
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'reciters' && <RecitersDirectory />}
        {(currentPage === 'mushaf' || currentPage === 'tafsir') && <DigitalMushaf />}
        {currentPage === 'live' && <QuranLiveExperience />}
        {currentPage === 'memorize' && <MemorizationModule />}
        {currentPage === 'tajweed' && <TajweedAcademy />}
        {currentPage === 'adhkar' && <DailyContent />}
        {currentPage === 'khatma' && <KhatmaTracker />}
        {currentPage === 'ai' && <QuranAIAssistant />}
        {currentPage === 'admin' && <AdminDashboard />}
      </main>

      {/* Persistent Bottom Audio Player across all routes */}
      <PersistentPlayer />

      {/* Auth Modal */}
      <AuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RECITERS, ALL_SURAHS, SAMPLE_VERSES } from '../utils/quranData';
import { getPrayerTimesForCity, SUPPORTED_CITIES } from '../utils/prayerTimes';
import {
  Sparkles,
  BookOpen,
  Play,
  Volume2,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sunrise,
  Sunset,
} from 'lucide-react';

export const HomeTriColumn: React.FC = () => {
  const {
    setCurrentPage,
    setSelectedReciter,
    setSelectedSurah,
    playTrack,
    language,
  } = useApp();

  const [selectedCityId, setSelectedCityId] = useState('rabat');
  const [reciterIndex, setReciterIndex] = useState(0);

  const prayerData = getPrayerTimesForCity(selectedCityId);
  const featuredReciters = RECITERS.filter((r) => r.featured);
  const sharhSurah = ALL_SURAHS.find((s) => s.number === 94) || ALL_SURAHS[93];

  const handleNextReciter = () => {
    setReciterIndex((prev) => (prev + 1) % featuredReciters.length);
  };

  const handlePrevReciter = () => {
    setReciterIndex((prev) => (prev - 1 + featuredReciters.length) % featuredReciters.length);
  };

  const visibleReciters = [
    featuredReciters[reciterIndex],
    featuredReciters[(reciterIndex + 1) % featuredReciters.length],
    featuredReciters[(reciterIndex + 2) % featuredReciters.length],
    featuredReciters[(reciterIndex + 3) % featuredReciters.length],
  ].filter(Boolean);

  const handlePlayReciter = (reciter: typeof RECITERS[0]) => {
    setSelectedReciter(reciter);
    setSelectedSurah(ALL_SURAHS[0]);
    playTrack(reciter, ALL_SURAHS[0]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Verse of the Day (Card 1) */}
        <div className="lg:col-span-4 rounded-3xl overflow-hidden bg-gradient-to-b from-[#0b3b2d] via-[#05281e] to-[#021812] border-2 border-amber-500/30 shadow-xl flex flex-col justify-between p-6 relative group">
          {/* Background Mosque Silhouette Artwork */}
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <img src="/assets/reciters/verse_bg.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#021812] via-[#021812]/70 to-transparent pointer-events-none" />

          {/* Card Header */}
          <div className="relative z-10 flex items-center justify-between pb-4 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-base font-bold text-amber-300 font-quran text-lg">
                {language === 'ar' ? 'آية اليوم' : 'Verse of the Day'}
              </h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-200 border border-emerald-700/50">
              سورة الشرح
            </span>
          </div>

          {/* Verse Content */}
          <div className="relative z-10 my-6 text-center space-y-4">
            <div className="p-4 rounded-2xl bg-[#032018]/60 border border-amber-400/20 shadow-inner">
              <p className="text-2xl sm:text-3xl font-bold font-quran text-amber-200 leading-loose">
                ﴿ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾
              </p>
              <p className="mt-3 text-sm text-emerald-100/90 font-medium italic">
                "Indeed, with hardship comes ease."
              </p>
              <p className="mt-1 text-xs text-amber-400/80 font-bold">
                (الشرح : 6)
              </p>
            </div>
          </div>

          {/* Card Actions */}
          <div className="relative z-10 pt-2 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setSelectedSurah(sharhSurah);
                playTrack(featuredReciters[1] || featuredReciters[0], sharhSurah);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>{language === 'ar' ? 'استماع للآية' : 'Listen'}</span>
            </button>
            <button
              onClick={() => {
                setSelectedSurah(sharhSurah);
                setCurrentPage('mushaf');
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition hover:scale-102 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'قراءة المزيد' : 'Read More'}</span>
            </button>
          </div>
        </div>

        {/* Center Column: Featured Reciters Carousel (Card 2) */}
        <div className="lg:col-span-5 rounded-3xl overflow-hidden bg-gradient-to-b from-[#063529] via-[#04261d] to-[#021812] border-2 border-amber-500/30 shadow-xl p-6 flex flex-col justify-between relative">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-lg">★</span>
              <h2 className="text-base font-bold text-amber-300">
                {language === 'ar' ? 'القراء المميزون' : 'Featured Reciters'}
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('reciters')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
            >
              <span>{language === 'ar' ? 'عرض الكل ←' : 'View All →'}</span>
            </button>
          </div>

          {/* Carousel Viewport */}
          <div className="my-5 relative">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {visibleReciters.map((reciter) => (
                <div
                  key={reciter.id}
                  onClick={() => handlePlayReciter(reciter)}
                  className="group flex flex-col items-center bg-[#021d17]/80 hover:bg-[#032a21] border border-amber-500/25 hover:border-amber-400 p-2.5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 text-center shadow-md relative overflow-hidden"
                >
                  {/* Photo frame */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-b from-amber-400 to-emerald-800 shadow-md overflow-hidden mb-2">
                    <img
                      src={reciter.photoUrl}
                      alt={reciter.nameAr}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Play className="w-6 h-6 text-amber-400 fill-current drop-shadow" />
                    </div>
                  </div>

                  {/* Reciter name badge */}
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-100 group-hover:text-amber-300 line-clamp-1">
                    {language === 'ar' ? reciter.nameAr.replace('الشيخ ', '') : reciter.nameEn.replace('Sheikh ', '')}
                  </span>
                  <span className="text-[10px] text-emerald-400/80 mt-0.5">
                    {reciter.flag} {reciter.style}
                  </span>
                </div>
              ))}
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={handlePrevReciter}
                className="w-8 h-8 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-amber-500/30 flex items-center justify-center text-amber-300 transition"
                aria-label="Previous reciter"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {featuredReciters.slice(0, 5).map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === reciterIndex % 5 ? 'w-5 bg-amber-400' : 'w-1.5 bg-emerald-700/60'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNextReciter}
                className="w-8 h-8 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-amber-500/30 flex items-center justify-center text-amber-300 transition"
                aria-label="Next reciter"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-emerald-300/70 border-t border-emerald-800/40">
            {language === 'ar'
              ? 'تلاوات كاملة بجودة صوتية نقية لجميع سور القرآن الكريم'
              : 'Complete high fidelity recordings of all 114 Surahs'}
          </div>
        </div>

        {/* Right Column: Prayer Times (Card 3) */}
        <div className="lg:col-span-3 rounded-3xl overflow-hidden bg-gradient-to-b from-[#053227] via-[#04241b] to-[#021711] border-2 border-amber-500/30 shadow-xl p-6 flex flex-col justify-between relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <img src="/assets/reciters/prayer_bg.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#021711] via-[#021711]/75 to-transparent pointer-events-none" />
          {/* Header & City Selector */}
          <div className="pb-3 border-b border-amber-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-bold text-amber-300">
                  {language === 'ar' ? 'أوقات الصلاة' : 'Prayer Times'}
                </h2>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/40">
                {prayerData.timeRemaining}
              </span>
            </div>

            {/* City dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                className="bg-[#021d17] border border-amber-500/30 rounded-lg px-2 py-1 text-xs text-amber-200 font-semibold focus:outline-none w-full"
              >
                {SUPPORTED_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameAr}، {c.countryAr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Highlighted Next Prayer Banner */}
          <div className="my-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-800/90 to-emerald-950/90 border border-emerald-500/40 text-center shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between px-2">
              <div className="text-right">
                <span className="text-xs text-emerald-200 font-medium block">
                  {language === 'ar' ? 'الصلاة القادمة:' : 'Next Prayer:'}
                </span>
                <span className="text-lg font-extrabold text-amber-300 font-quran">
                  {prayerData.nextPrayer}
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-wider">
                {prayerData.nextPrayer === 'الفجر'
                  ? prayerData.fajr
                  : prayerData.nextPrayer === 'الشروق'
                  ? prayerData.sunrise
                  : prayerData.nextPrayer === 'الظهر'
                  ? prayerData.dhuhr
                  : prayerData.nextPrayer === 'العصر'
                  ? prayerData.asr
                  : prayerData.nextPrayer === 'المغرب'
                  ? prayerData.maghrib
                  : prayerData.isha}
              </div>
            </div>
          </div>

          {/* Prayer Times List */}
          <div className="space-y-1.5 text-xs">
            {[
              { name: 'الفجر', time: prayerData.fajr, icon: Sunrise },
              { name: 'الشروق', time: prayerData.sunrise, icon: Sun },
              { name: 'الظهر', time: prayerData.dhuhr, icon: Sun },
              { name: 'العصر', time: prayerData.asr, icon: Sun },
              { name: 'المغرب', time: prayerData.maghrib, icon: Sunset },
              { name: 'العشاء', time: prayerData.isha, icon: Moon },
            ].map((p) => {
              const Icon = p.icon;
              const isNext = p.name === prayerData.nextPrayer;
              return (
                <div
                  key={p.name}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-xl transition ${
                    isNext
                      ? 'bg-amber-500/20 border border-amber-400/50 text-amber-200 font-bold'
                      : 'bg-emerald-950/40 text-emerald-200/90 hover:bg-emerald-900/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${isNext ? 'text-amber-400' : 'text-emerald-400/70'}`} />
                    <span>{p.name}</span>
                  </div>
                  <span className="font-mono font-semibold">{p.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

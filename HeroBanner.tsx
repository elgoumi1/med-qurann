import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RECITERS, ALL_SURAHS } from '../utils/quranData';
import { Search, Play, Sparkles, BookOpen, Volume2 } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const {
    setCurrentPage,
    playTrack,
    setSelectedReciter,
    language,
    globalSearchQuery,
    setGlobalSearchQuery,
  } = useApp();

  const [inputVal, setInputVal] = useState(globalSearchQuery || '');

  const qahtani = RECITERS.find((r) => r.id === 'khalid_qahtani') || RECITERS[0];
  const dosari = RECITERS.find((r) => r.id === 'yasser_dosari') || RECITERS[1];
  const fatihah = ALL_SURAHS[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setGlobalSearchQuery(inputVal.trim());
    // Navigate to Quran library or reciters search
    const foundReciter = RECITERS.find(
      (r) =>
        r.nameAr.includes(inputVal.trim()) ||
        r.nameEn.toLowerCase().includes(inputVal.trim().toLowerCase())
    );
    if (foundReciter) {
      setSelectedReciter(foundReciter);
      setCurrentPage('reciters');
    } else {
      setCurrentPage('mushaf');
    }
  };

  const handleReciterBadgeClick = (reciter: typeof dosari) => {
    setSelectedReciter(reciter);
    playTrack(reciter, fatihah);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 bg-gradient-to-b from-[#063b2f] via-[#042d23] to-[#021f19] border border-amber-500/30 shadow-2xl">
      {/* Decorative Islamic Geometric Patterns Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Quran on Rehal background on left in RTL / right in LTR */}
      <div className="absolute -left-10 bottom-0 top-0 w-80 opacity-25 lg:opacity-35 pointer-events-none overflow-hidden hidden sm:block">
        <img
          src="/assets/reciters/quran_rehal.png"
          alt="Holy Quran on Rehal"
          className="w-full h-full object-contain object-left-bottom"
        />
      </div>

      {/* Main Content Layout */}
      <div className="relative px-6 py-10 md:py-14 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Text & Search Section */}
        <div className="w-full lg:w-7/12 text-center lg:text-right space-y-5 px-2 sm:px-4 z-10">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>
              {language === 'ar'
                ? 'المنصة القرآنية الرقمية المتكاملة • إصدار المحترفين'
                : 'Complete Digital Quranic Platform • Enterprise Edition'}
            </span>
          </div>

          {/* Golden Calligraphy Heading */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-quran text-amber-300 drop-shadow-[0_4px_16px_rgba(212,175,55,0.4)] leading-tight tracking-wide">
              الْقُرْآنُ الْكَرِيمُ
            </h1>
            <p className="text-xl sm:text-2xl font-bold font-quran text-emerald-100/95 drop-shadow-sm">
              نورٌ يُضيء قلوبنا .. وهدى لحياتنا
            </p>
          </div>

          <p className="text-sm sm:text-base text-emerald-200/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            {language === 'ar'
              ? 'منصة قرآنية شاملة للاستماع إلى تلاوات كبار القراء بروايات متواترة، وقراءة المصحف الشريف، وتدبر التفسير الموثق، وحفظ الآيات، وأكاديمية التجويد مع الذكاء الاصطناعي.'
              : 'A comprehensive Quranic platform to listen to authentic recitations, read the Holy Quran, explore verified Tafsir, memorize verses, and master Tajweed.'}
          </p>

          {/* Hero Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto lg:mx-0 relative flex items-center bg-[#021813]/90 rounded-2xl border-2 border-amber-500/40 p-1.5 shadow-xl shadow-black/40 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all"
          >
            <div className="pl-3 pr-2 text-amber-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'ابحث عن قارئ، سورة أو آية ...'
                  : 'Search for reciter, surah or verse...'
              }
              className="w-full bg-transparent text-emerald-50 placeholder-emerald-400/50 text-sm font-medium focus:outline-none px-2"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-emerald-950 font-extrabold text-sm shadow-md transition hover:scale-102 cursor-pointer"
            >
              {language === 'ar' ? 'بحث' : 'Search'}
            </button>
          </form>

          {/* Popular Search Chips */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-emerald-300/80">
            <span className="font-semibold text-amber-400/80">
              {language === 'ar' ? 'الأكثر بحثاً:' : 'Popular:'}
            </span>
            {['سورة الكهف', 'سورة الملك', 'سورة البقرة', 'ياسر الدوسري', 'مشاري العفاسي'].map(
              (chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setInputVal(chip);
                    setGlobalSearchQuery(chip);
                    setCurrentPage('reciters');
                  }}
                  className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/50 hover:border-amber-400/60 text-emerald-200 hover:text-amber-300 transition"
                >
                  {chip}
                </button>
              )
            )}
          </div>
        </div>

        {/* Right / Reciters Visual Badges (Exact match to reference photo!) */}
        <div className="w-full lg:w-2/5 flex flex-col sm:flex-row items-center justify-center gap-5">
          {/* Sheikh Yasser Al-Dosari Card Badge */}
          <div
            onClick={() => handleReciterBadgeClick(dosari)}
            className="group relative bg-[#021f19]/80 border-2 border-amber-500/40 hover:border-amber-400 rounded-2xl p-4 shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 w-64 text-center overflow-hidden"
          >
            <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-emerald-900/90 text-[10px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>تلاوة خاشعة</span>
            </div>
            
            {/* Reciter Portrait Frame */}
            <div className="relative mx-auto w-32 h-32 rounded-full p-1 bg-gradient-to-b from-amber-400 via-amber-600 to-emerald-900 shadow-xl overflow-hidden mb-3">
              <img
                src={dosari.photoUrl}
                alt={dosari.nameAr}
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition" />
            </div>

            {/* Reciter Info */}
            <div className="space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/90 text-amber-300 font-bold text-xs border border-amber-400/40 shadow-sm">
                {dosari.nameAr}
              </span>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                إمام الحرم المكي الشريف
              </p>
            </div>

            {/* Play Button Overlay */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 font-extrabold text-xs shadow-md group-hover:scale-105 transition">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>استمع الآن</span>
            </div>
          </div>

          {/* Sheikh Khalid Al-Qahtani Card Badge */}
          <div
            onClick={() => handleReciterBadgeClick(qahtani)}
            className="group relative bg-[#021f19]/80 border-2 border-amber-500/40 hover:border-amber-400 rounded-2xl p-4 shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 w-64 text-center overflow-hidden"
          >
            <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-emerald-900/90 text-[10px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-amber-400" />
              <span>صوت مؤثر</span>
            </div>

            {/* Reciter Portrait Frame */}
            <div className="relative mx-auto w-32 h-32 rounded-full p-1 bg-gradient-to-b from-amber-400 via-amber-600 to-emerald-900 shadow-xl overflow-hidden mb-3">
              <img
                src={qahtani.photoUrl}
                alt={qahtani.nameAr}
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition" />
            </div>

            {/* Reciter Info */}
            <div className="space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/90 text-amber-300 font-bold text-xs border border-amber-400/40 shadow-sm">
                {qahtani.nameAr}
              </span>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                تلاوات ترق لها القلوب
              </p>
            </div>

            {/* Play Button Overlay */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 font-extrabold text-xs shadow-md group-hover:scale-105 transition">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>استمع الآن</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

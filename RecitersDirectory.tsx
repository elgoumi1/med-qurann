import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Reciter, Surah } from '../types';
import { ALL_SURAHS, getAudioUrl } from '../utils/quranData';
import {
  Search,
  Filter,
  Play,
  Pause,
  Heart,
  Share2,
  Download,
  Info,
  Check,
  Music,
  Globe,
  Award,
} from 'lucide-react';

export const RecitersDirectory: React.FC = () => {
  const {
    recitersList,
    selectedReciter,
    setSelectedReciter,
    selectedSurah,
    setSelectedSurah,
    playTrack,
    isPlaying,
    favoriteReciters,
    toggleFavoriteReciter,
    language,
    globalSearchQuery,
    setGlobalSearchQuery,
  } = useApp();

  const [search, setSearch] = useState(globalSearchQuery || '');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [activeModalReciter, setActiveModalReciter] = useState<Reciter | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredReciters = recitersList.filter((r) => {
    const matchesSearch =
      r.nameAr.toLowerCase().includes(search.toLowerCase()) ||
      r.nameEn.toLowerCase().includes(search.toLowerCase());

    const matchesCountry =
      selectedCountry === 'all' ||
      (selectedCountry === 'SA' && r.countryCode === 'SA') ||
      (selectedCountry === 'EG' && r.countryCode === 'EG') ||
      (selectedCountry === 'KW' && r.countryCode === 'KW') ||
      (selectedCountry === 'other' && !['SA', 'EG', 'KW'].includes(r.countryCode));

    const matchesStyle = selectedStyle === 'all' || r.style === selectedStyle;

    return matchesSearch && matchesCountry && matchesStyle;
  });

  const handleShare = (reciter: Reciter) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/#reciter=${reciter.id} - استمع لتلاوات ${reciter.nameAr}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-quran">
          {language === 'ar' ? 'مكتبة كبار قراء القرآن الكريم' : 'Quran Reciters Directory'}
        </h1>
        <p className="text-sm sm:text-base text-emerald-200/80 max-w-2xl mx-auto">
          {language === 'ar'
            ? 'استمع إلى تلاوات خاشعة ونقية بأصوات أشهر أئمة وقراء الحرمين الشريفين والعالم الإسلامي بروايات معتمدة.'
            : 'Listen to heartfelt recitations by renowned Imams and Qaris from Mecca, Medina, and worldwide.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#03241d]/90 border border-amber-500/30 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث باسم القارئ...' : 'Search reciter name...'}
            className="w-full bg-[#021813] border border-emerald-700/60 rounded-xl pr-9 pl-4 py-2 text-xs sm:text-sm text-emerald-100 placeholder-emerald-500/50 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-[#021813] p-1 rounded-xl border border-emerald-800/60 text-xs">
            <button
              onClick={() => setSelectedCountry('all')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                selectedCountry === 'all'
                  ? 'bg-amber-400 text-emerald-950'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setSelectedCountry('SA')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                selectedCountry === 'SA'
                  ? 'bg-amber-400 text-emerald-950'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              🇸🇦 السعودية
            </button>
            <button
              onClick={() => setSelectedCountry('EG')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                selectedCountry === 'EG'
                  ? 'bg-amber-400 text-emerald-950'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              🇪🇬 مصر
            </button>
            <button
              onClick={() => setSelectedCountry('KW')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                selectedCountry === 'KW'
                  ? 'bg-amber-400 text-emerald-950'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              🇰🇼 الكويت
            </button>
          </div>

          {/* Style Filter */}
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="bg-[#021813] border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-amber-200 font-semibold focus:outline-none"
          >
            <option value="all">كل الأساليب</option>
            <option value="Murattal">مرتل</option>
            <option value="Mujawwad">مجود</option>
          </select>
        </div>
      </div>

      {/* Reciters Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredReciters.map((reciter) => {
          const isFav = favoriteReciters.includes(reciter.id);
          const isSelected = selectedReciter.id === reciter.id;

          return (
            <div
              key={reciter.id}
              className={`group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#043126]/90 to-[#021d17]/95 border-2 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between p-5 ${
                isSelected
                  ? 'border-amber-400 shadow-amber-500/20 ring-1 ring-amber-400/50'
                  : 'border-amber-500/25 hover:border-amber-400/70'
              }`}
            >
              {/* Top Icons: Favorite & Share */}
              <div className="flex items-center justify-between z-10">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/90 text-amber-300 border border-amber-500/30">
                  {reciter.style}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleShare(reciter)}
                    className="p-1.5 text-emerald-300 hover:text-amber-300 transition"
                    title="مشاركة رابط القارئ"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleFavoriteReciter(reciter.id)}
                    className="p-1.5 transition"
                    title={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'text-red-400 fill-current' : 'text-emerald-300 hover:text-red-400'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Portrait Photo */}
              <div
                onClick={() => {
                  setSelectedReciter(reciter);
                  playTrack(reciter, selectedSurah);
                }}
                className="relative mx-auto w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-600 to-emerald-900 shadow-xl cursor-pointer group-hover:scale-105 transition my-3 overflow-hidden"
              >
                <img
                  src={reciter.photoUrl}
                  alt={reciter.nameAr}
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Play className="w-8 h-8 text-amber-300 fill-current drop-shadow-lg" />
                </div>
              </div>

              {/* Reciter Details */}
              <div className="text-center space-y-1 mb-4">
                <h3 className="text-base font-bold text-amber-200 font-quran">
                  {reciter.nameAr}
                </h3>
                <p className="text-xs text-emerald-300/80 font-medium line-clamp-1">
                  {reciter.flag} {reciter.country}
                </p>
                <span className="inline-block text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  رواية {reciter.riwayah}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-800/40">
                <button
                  onClick={() => {
                    setSelectedReciter(reciter);
                    playTrack(reciter, ALL_SURAHS[0]);
                  }}
                  className="py-2 px-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>تلاوة</span>
                </button>
                <button
                  onClick={() => setActiveModalReciter(reciter)}
                  className="py-2 px-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>السور ({reciter.totalSurahs})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reciter Profile & Full 114 Surahs Modal */}
      {activeModalReciter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#03231c] border-2 border-amber-500/40 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#04382c] to-[#02211a] border-b border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={activeModalReciter.photoUrl}
                  alt={activeModalReciter.nameAr}
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <h2 className="text-xl font-bold text-amber-300 font-quran">
                    {activeModalReciter.nameAr}
                  </h2>
                  <p className="text-xs text-emerald-200">
                    {activeModalReciter.country} • رواية {activeModalReciter.riwayah}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalReciter(null)}
                className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-200 flex items-center justify-center hover:bg-emerald-800"
              >
                ✕
              </button>
            </div>

            {/* Modal Bio */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="p-4 rounded-xl bg-[#021711] border border-emerald-800 text-xs sm:text-sm text-emerald-200 leading-relaxed">
                {language === 'ar' ? activeModalReciter.bioAr : activeModalReciter.bioEn}
              </div>

              {/* 114 Surahs List */}
              <h3 className="text-base font-bold text-amber-300 pt-2 border-t border-emerald-800/40">
                فهرس سور القرآن الكريم (114 سورة)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {ALL_SURAHS.map((surah) => {
                  const isCurrent =
                    selectedReciter.id === activeModalReciter.id &&
                    selectedSurah.number === surah.number &&
                    isPlaying;
                  const surahAudioUrl = getAudioUrl(activeModalReciter, surah.number);

                  return (
                    <div
                      key={surah.number}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                        isCurrent
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-[#021812] border-emerald-800/60 hover:bg-emerald-950/60 text-emerald-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-emerald-900/80 text-[10px] font-bold text-amber-300 flex items-center justify-center">
                          {surah.number}
                        </span>
                        <div className="flex flex-col text-right">
                          <span className="text-xs font-bold font-quran">{surah.nameAr}</span>
                          <span className="text-[10px] text-emerald-400/80">
                            {surah.versesCount} آية
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedReciter(activeModalReciter);
                            setSelectedSurah(surah);
                            playTrack(activeModalReciter, surah);
                          }}
                          className="p-1.5 rounded-lg bg-emerald-900/80 hover:bg-amber-400 hover:text-emerald-950 text-amber-300 transition"
                          title="تشغيل السورة"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <a
                          href={surahAudioUrl}
                          download={`Surah_${surah.number}_${activeModalReciter.id}.mp3`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-800 text-emerald-300 transition"
                          title="تحميل الملف الصوتي"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copied toast */}
      {copiedLink && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-900 text-amber-300 text-xs font-bold rounded-xl border border-amber-400 shadow-2xl animate-fade-in">
          تم نسخ رابط القارئ إلى الحافظة بنجاح!
        </div>
      )}
    </div>
  );
};

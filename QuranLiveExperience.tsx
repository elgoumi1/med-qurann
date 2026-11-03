import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_SURAHS, SAMPLE_VERSES } from '../utils/quranData';
import { Verse } from '../types';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Users,
  BookOpen,
  Sparkles,
  Repeat,
  Heart,
  RotateCcw,
} from 'lucide-react';

export const QuranLiveExperience: React.FC = () => {
  const {
    selectedReciter,
    setSelectedReciter,
    selectedSurah,
    setSelectedSurah,
    recitersList,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
    playTrack,
    language,
  } = useApp();

  const verses: Verse[] = SAMPLE_VERSES[selectedSurah.number] || SAMPLE_VERSES[1];
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);

  // Sync active verse with audio playback timeline
  useEffect(() => {
    if (!duration || duration <= 0) return;
    const progress = currentTime / duration;
    const computedIndex = Math.floor(progress * verses.length);
    if (computedIndex >= 0 && computedIndex < verses.length) {
      setCurrentVerseIndex(computedIndex);
    }
  }, [currentTime, duration, verses.length]);

  const activeVerse = verses[currentVerseIndex] || verses[0];

  const handleNextVerse = () => {
    setCurrentVerseIndex((prev) => (prev + 1) % verses.length);
  };

  const handlePrevVerse = () => {
    setCurrentVerseIndex((prev) => (prev - 1 + verses.length) % verses.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Live Badge & Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span>التلاوة الحية والتفاعلية • QURAN LIVE EXPERIENCE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-quran">
          تلاوة سورة {selectedSurah.nameAr}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200">
          بصوت {selectedReciter.nameAr} • {selectedReciter.country}
        </p>
      </div>

      {/* Reciter & Recitation Stage Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#053d30] via-[#03291f] to-[#011a13] border-2 border-amber-500/40 shadow-2xl p-6 sm:p-10 text-center space-y-6">
        {/* Reciter Photo Frame */}
        <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-600 to-emerald-900 shadow-2xl overflow-hidden group">
          <img
            src={selectedReciter.photoUrl}
            alt={selectedReciter.nameAr}
            className="w-full h-full object-cover rounded-full group-hover:scale-105 transition duration-500"
          />
          {isPlaying && (
            <div className="absolute inset-0 border-4 border-amber-400/80 rounded-full animate-pulse" />
          )}
        </div>

        {/* Reciter Selector Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
          {recitersList.slice(0, 6).map((reciter) => (
            <button
              key={reciter.id}
              onClick={() => {
                setSelectedReciter(reciter);
                playTrack(reciter, selectedSurah);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                selectedReciter.id === reciter.id
                  ? 'bg-amber-400 text-emerald-950 shadow-md'
                  : 'bg-emerald-950/80 text-emerald-200 border border-emerald-700/50 hover:bg-emerald-900'
              }`}
            >
              <span>{reciter.nameAr.replace('الشيخ ', '')}</span>
            </button>
          ))}
        </div>

        {/* Active Verse Display Screen */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#021812]/90 border-2 border-amber-500/40 shadow-inner space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-xs text-amber-300 font-bold border-b border-amber-500/20 pb-2">
            <span>الآية {activeVerse.verseNumber} من {verses.length}</span>
            <span>سورة {selectedSurah.nameAr}</span>
          </div>

          <p className="text-3xl sm:text-4xl font-extrabold font-quran text-amber-200 leading-loose drop-shadow">
            {activeVerse.arabicText}
          </p>

          <p className="text-sm text-emerald-100/90 font-medium italic pt-2">
            "{activeVerse.translationEn}"
          </p>

          {/* Verse Nav Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-amber-500/20">
            <button
              onClick={handlePrevVerse}
              className="px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 text-xs font-bold flex items-center gap-1 transition"
            >
              <SkipForward className="w-4 h-4" />
              <span>الآية السابقة</span>
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 flex items-center justify-center shadow-lg hover:scale-105 transition"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <button
              onClick={handleNextVerse}
              className="px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 text-xs font-bold flex items-center gap-1 transition"
            >
              <span>الآية التالية</span>
              <SkipBack className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Complete Verse Synchronized Timeline */}
        <div className="space-y-3 max-w-3xl mx-auto text-right">
          <h3 className="text-sm font-bold text-amber-300">
            متابعة الآيات تزامناً مع التلاوة:
          </h3>
          <div className="space-y-2">
            {verses.map((v, idx) => (
              <div
                key={v.verseNumber}
                onClick={() => setCurrentVerseIndex(idx)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  idx === currentVerseIndex
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/50'
                    : 'bg-[#021812]/60 border-emerald-800/60 text-emerald-100 hover:bg-emerald-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                    idx === currentVerseIndex ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-900 text-emerald-300'
                  }`}>
                    {v.verseNumber}
                  </span>
                  <span className="text-base font-quran font-bold">{v.arabicText}</span>
                </div>
                {idx === currentVerseIndex && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                    جاري التلاوة
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

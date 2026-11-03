import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_SURAHS, SAMPLE_VERSES } from '../utils/quranData';
import { Verse } from '../types';
import {
  Award,
  Repeat,
  Eye,
  EyeOff,
  CheckCircle,
  Circle,
  Play,
  RotateCcw,
  Sparkles,
  Calendar,
  BookMarked,
  Check,
} from 'lucide-react';

export const MemorizationModule: React.FC = () => {
  const {
    selectedSurah,
    setSelectedSurah,
    selectedReciter,
    playTrack,
    memorizedVerses,
    toggleVerseMemorized,
    language,
  } = useApp();

  const [repCount, setRepCount] = useState<number>(5);
  const [currentRep, setCurrentRep] = useState<number>(1);
  const [pauseDuration, setPauseDuration] = useState<number>(3); // seconds between repetitions
  const [hideText, setHideText] = useState(false);
  const [revealedVerses, setRevealedVerses] = useState<Record<number, boolean>>({});
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);

  const verses: Verse[] = SAMPLE_VERSES[selectedSurah.number] || SAMPLE_VERSES[1];
  const activeVerse = verses[activeVerseIndex] || verses[0];

  const totalMemorizedCount = Object.values(memorizedVerses).filter(Boolean).length;

  const toggleRevealVerse = (verseNum: number) => {
    setRevealedVerses((prev) => ({
      ...prev,
      [verseNum]: !prev[verseNum],
    }));
  };

  const handleNextRepetition = () => {
    if (currentRep < repCount) {
      setCurrentRep((prev) => prev + 1);
    } else {
      setCurrentRep(1);
      // Advance to next verse if available
      if (activeVerseIndex < verses.length - 1) {
        setActiveVerseIndex((prev) => prev + 1);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
          <Award className="w-4 h-4 text-amber-400" />
          <span>نظام التحفيظ والمراجعة التراكمية • QURAN MEMORIZATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-quran">
          خطة وتطبيق حفظ سورة {selectedSurah.nameAr}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto">
          كرر الآيات بصوت القارئ المفضل، اختبر حفظك بنمط إخفاء الكلمات، وتابع إنجازك اليومي نحو حفظ كتاب الله.
        </p>
      </div>

      {/* Progress & Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#03291f] border border-amber-500/30 text-center space-y-1">
          <span className="text-xs text-emerald-300 font-bold block">إجمالي الآيات المحفوظة</span>
          <span className="text-3xl font-extrabold text-amber-300 font-mono">{totalMemorizedCount}</span>
          <span className="text-[11px] text-emerald-400/80 block">آية مباركة</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#03291f] border border-amber-500/30 text-center space-y-1">
          <span className="text-xs text-emerald-300 font-bold block">سورة الحفظ الحالية</span>
          <span className="text-2xl font-extrabold text-amber-300 font-quran">{selectedSurah.nameAr}</span>
          <span className="text-[11px] text-emerald-400/80 block">{selectedSurah.versesCount} آيات</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#03291f] border border-amber-500/30 text-center space-y-1">
          <span className="text-xs text-emerald-300 font-bold block">نسبة إنجاز السورة</span>
          <span className="text-3xl font-extrabold text-amber-300 font-mono">
            {Math.round(
              (verses.filter((v) => memorizedVerses[`${selectedSurah.number}-${v.verseNumber}`]).length /
                verses.length) *
                100
            )}%
          </span>
          <span className="text-[11px] text-emerald-400/80 block">متقنة ومثبتة</span>
        </div>
      </div>

      {/* Memorization Stage */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#05372b] to-[#021f18] border-2 border-amber-500/40 shadow-2xl space-y-6">
        {/* Controls Bar: Surah selector, Repetition count & Hide Text */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
          {/* Surah dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-300 font-bold">السورة:</span>
            <select
              value={selectedSurah.number}
              onChange={(e) => {
                const s = ALL_SURAHS.find((item) => item.number === parseInt(e.target.value, 10));
                if (s) {
                  setSelectedSurah(s);
                  setActiveVerseIndex(0);
                  setCurrentRep(1);
                }
              }}
              className="bg-[#021813] border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-300 focus:outline-none"
            >
              {ALL_SURAHS.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.nameAr} ({s.versesCount} آية)
                </option>
              ))}
            </select>
          </div>

          {/* Repetition Presets */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-300 font-bold">عدد التكرار:</span>
            {[3, 5, 10, 20].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setRepCount(num);
                  setCurrentRep(1);
                }}
                className={`w-8 h-8 rounded-xl font-bold transition ${
                  repCount === num
                    ? 'bg-amber-400 text-emerald-950 shadow-md'
                    : 'bg-emerald-950 text-emerald-200 border border-emerald-700/50 hover:bg-emerald-900'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Hide / Reveal Text Mode Toggle */}
          <button
            onClick={() => setHideText(!hideText)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              hideText
                ? 'bg-amber-400 text-emerald-950 shadow-lg'
                : 'bg-emerald-950 text-emerald-200 border border-emerald-700 hover:bg-emerald-900'
            }`}
          >
            {hideText ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{hideText ? 'وضع إظهار النص' : 'وضع إخفاء النص للتسميع'}</span>
          </button>
        </div>

        {/* Current Active Verse Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#021711] border-2 border-amber-500/30 text-center space-y-6 shadow-inner relative">
          <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
            <span>الآية {activeVerse.verseNumber} من {verses.length}</span>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300">
                التكرار: {currentRep} / {repCount}
              </span>
            </div>
          </div>

          {/* Text Display or Hidden Card */}
          <div className="py-6">
            {hideText && !revealedVerses[activeVerse.verseNumber] ? (
              <div className="space-y-4">
                <div className="h-20 flex items-center justify-center">
                  <span className="text-xl text-emerald-400/60 font-medium italic">
                    (النص مخفي للتسميع غيباً - اقرأ الآية من ذاكرتك ثم اضغط لكشف النص)
                  </span>
                </div>
                <button
                  onClick={() => toggleRevealVerse(activeVerse.verseNumber)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-emerald-950 font-bold text-xs shadow-md hover:bg-amber-400 transition"
                >
                  كشف نص الآية والتأكد
                </button>
              </div>
            ) : (
              <p className="text-3xl sm:text-4xl font-extrabold font-quran text-amber-200 leading-loose">
                {activeVerse.arabicText}
              </p>
            )}
          </div>

          {/* Repetition and Mastered Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-amber-500/20">
            <button
              onClick={() => playTrack(selectedReciter, selectedSurah)}
              className="px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 text-xs font-bold flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-current text-amber-400" />
              <span>استمع بصوت {selectedReciter.nameAr}</span>
            </button>

            <button
              onClick={handleNextRepetition}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 font-extrabold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition cursor-pointer"
            >
              <Repeat className="w-4 h-4" />
              <span>أتممت التكرار ({currentRep}/{repCount})</span>
            </button>

            <button
              onClick={() => toggleVerseMemorized(selectedSurah.number, activeVerse.verseNumber)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition border ${
                memorizedVerses[`${selectedSurah.number}-${activeVerse.verseNumber}`]
                  ? 'bg-emerald-700 text-white border-emerald-500'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {memorizedVerses[`${selectedSurah.number}-${activeVerse.verseNumber}`]
                  ? 'تم الحفظ بنجاح ✓'
                  : 'تحديد كـ "محفوظة"'}
              </span>
            </button>
          </div>
        </div>

        {/* Verses Checklist Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-amber-300">
            قائمة آيات السورة ومتابعة الحفظ:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {verses.map((v, idx) => {
              const isMemorized = memorizedVerses[`${selectedSurah.number}-${v.verseNumber}`];
              const isActive = idx === activeVerseIndex;

              return (
                <div
                  key={v.verseNumber}
                  onClick={() => {
                    setActiveVerseIndex(idx);
                    setCurrentRep(1);
                  }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    isActive
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/50'
                      : 'bg-[#021812] border-emerald-800/60 text-emerald-100 hover:bg-emerald-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVerseMemorized(selectedSurah.number, v.verseNumber);
                      }}
                      className="text-amber-400"
                    >
                      {isMemorized ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-emerald-600" />
                      )}
                    </button>
                    <span className="text-sm font-quran font-bold line-clamp-1">
                      {v.arabicText}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400/80 shrink-0">
                    آية {v.verseNumber}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

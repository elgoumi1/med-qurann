import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_SURAHS, SAMPLE_VERSES } from '../utils/quranData';
import { Verse, WordInfo } from '../types';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Copy,
  Share2,
  Play,
  Sliders,
  Sparkles,
  Info,
  Check,
  Maximize2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const DigitalMushaf: React.FC = () => {
  const {
    selectedSurah,
    setSelectedSurah,
    selectedReciter,
    playTrack,
    bookmarkedVerses,
    toggleBookmarkVerse,
    theme,
    setTheme,
    language,
  } = useApp();

  const [fontSize, setFontSize] = useState(26);
  const [showTranslations, setShowTranslations] = useState(true);
  const [activeTafsirVerse, setActiveTafsirVerse] = useState<Verse | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordInfo | null>(null);
  const [copiedVerseIndex, setCopiedVerseIndex] = useState<number | null>(null);

  // Get verses for current Surah or fallback template
  const currentVerses: Verse[] = SAMPLE_VERSES[selectedSurah.number] || [
    {
      surahNumber: selectedSurah.number,
      verseNumber: 1,
      arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      translationFr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
      tafsirIbnKathir: 'البسملة آية مباركة يستحب الابتداء بها في كل أمر ذي بال.',
      tafsirSaadi: 'الابتداء بأسماء الله الحسنى استعانة وتبركاً.',
    },
    {
      surahNumber: selectedSurah.number,
      verseNumber: 2,
      arabicText: `سُورَةُ ${selectedSurah.nameAr} - ${selectedSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}، وَعَدَدُ آيَاتِهَا ${selectedSurah.versesCount} آيَةً.`,
      translationEn: `Surah ${selectedSurah.nameEn} (${selectedSurah.englishMeaning}) - ${selectedSurah.revelationType}, containing ${selectedSurah.versesCount} verses.`,
      translationFr: `Sourate ${selectedSurah.nameFr} - ${selectedSurah.versesCount} versets.`,
      tafsirIbnKathir: `هذه السورة المباركة نزلت في ${selectedSurah.revelationType === 'Meccan' ? 'مكة المكرمة' : 'المدينة المنورة'}.`,
    },
  ];

  const handleCopyVerse = (verse: Verse) => {
    const textToCopy = `${verse.arabicText}\n[سورة ${selectedSurah.nameAr}: ${verse.verseNumber}]\n${verse.translationEn}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVerseIndex(verse.verseNumber);
    setTimeout(() => setCopiedVerseIndex(null), 2000);
  };

  const getContainerStyles = () => {
    if (theme === 'mushaf') {
      return 'bg-[#fcf8ec] text-[#1c1917] border-[#e7dbb9]';
    }
    if (theme === 'dark') {
      return 'bg-[#0f172a] text-slate-100 border-slate-700';
    }
    return 'bg-[#03231c] text-emerald-50 border-amber-500/30';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header & Reading Controls */}
      <div className="bg-[#03241d]/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Surah Selector */}
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs text-emerald-300 font-semibold">
              {language === 'ar' ? 'اختر السورة:' : 'Select Surah:'}
            </span>
            <select
              value={selectedSurah.number}
              onChange={(e) => {
                const surahNum = parseInt(e.target.value, 10);
                const s = ALL_SURAHS.find((item) => item.number === surahNum);
                if (s) setSelectedSurah(s);
              }}
              className="bg-[#021813] border border-amber-500/40 rounded-xl px-3 py-1.5 text-sm font-bold text-amber-300 focus:outline-none"
            >
              {ALL_SURAHS.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.nameAr} - {s.nameEn} ({s.versesCount} آية)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Font Size & Reading Theme Options */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Font Size Slider */}
          <div className="flex items-center gap-2 bg-[#021813] px-3 py-1.5 rounded-xl border border-emerald-800">
            <span className="text-emerald-300">حجم الخط:</span>
            <input
              type="range"
              min={20}
              max={44}
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              className="w-24 h-1.5 accent-amber-400 cursor-pointer"
            />
            <span className="font-mono text-amber-300 font-bold">{fontSize}px</span>
          </div>

          {/* Translations Toggle */}
          <button
            onClick={() => setShowTranslations(!showTranslations)}
            className={`px-3 py-1.5 rounded-xl border font-bold transition ${
              showTranslations
                ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                : 'bg-[#021813] text-emerald-300 border-emerald-800'
            }`}
          >
            {showTranslations ? 'إخفاء الترجمة' : 'إظهار الترجمة'}
          </button>

          {/* Theme Mode Pills */}
          <div className="flex items-center gap-1 bg-[#021813] p-1 rounded-xl border border-emerald-800">
            <button
              onClick={() => setTheme('emerald')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                theme === 'emerald' ? 'bg-emerald-700 text-white' : 'text-emerald-300'
              }`}
            >
              زمردي
            </button>
            <button
              onClick={() => setTheme('mushaf')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                theme === 'mushaf' ? 'bg-[#e5d4aa] text-[#1c1917]' : 'text-emerald-300'
              }`}
            >
              مصحف كريم
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                theme === 'dark' ? 'bg-slate-700 text-white' : 'text-emerald-300'
              }`}
            >
              داكن
            </button>
          </div>
        </div>
      </div>

      {/* Surah Header Card */}
      <div className="text-center p-8 rounded-3xl bg-gradient-to-b from-[#053d30] to-[#02211a] border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="space-y-3">
          <div className="inline-block px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/40">
            {selectedSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {selectedSurah.versesCount} آيات • الجزء {selectedSurah.juzStart}
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-quran text-amber-300 drop-shadow">
            سُورَةُ {selectedSurah.nameAr}
          </h2>
          <p className="text-sm text-emerald-200">
            {selectedSurah.nameEn} - {selectedSurah.englishMeaning}
          </p>

          <button
            onClick={() => playTrack(selectedReciter, selectedSurah)}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 font-extrabold text-xs shadow-lg hover:scale-105 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>استمع للسورة بصوت {selectedReciter.nameAr}</span>
          </button>
        </div>
      </div>

      {/* Reading Verses Container */}
      <div className={`rounded-3xl border-2 p-6 sm:p-10 shadow-2xl transition-all ${getContainerStyles()}`}>
        {/* Bismillah Header (except Surah 9 At-Tawbah) */}
        {selectedSurah.number !== 9 && (
          <div className="text-center pb-8 border-b border-amber-500/20 mb-8">
            <p className="text-2xl sm:text-3xl font-quran font-bold text-amber-400 drop-shadow-sm">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        )}

        {/* Verses Stack */}
        <div className="space-y-6">
          {currentVerses.map((verse) => {
            const isBookmarked = bookmarkedVerses.some(
              (b) => b.surah === selectedSurah.number && b.verse === verse.verseNumber
            );

            return (
              <div
                key={verse.verseNumber}
                className="p-4 sm:p-6 rounded-2xl bg-black/10 hover:bg-black/20 border border-amber-500/15 hover:border-amber-400/40 transition duration-200 space-y-4"
              >
                {/* Verse Arabic Text */}
                <div className="flex items-start justify-between gap-4">
                  {/* Action Icons */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-1">
                    <button
                      onClick={() => toggleBookmarkVerse(selectedSurah.number, verse.verseNumber)}
                      className="p-1.5 rounded-lg hover:bg-amber-400/20 transition text-amber-400"
                      title={isBookmarked ? 'إزالة الإشارة المرجعية' : 'حفظ كإشارة مرجعية'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400 fill-current" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-emerald-400/60 hover:text-amber-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopyVerse(verse)}
                      className="p-1.5 rounded-lg hover:bg-amber-400/20 transition text-emerald-400/60 hover:text-amber-400"
                      title="نسخ الآية"
                    >
                      {copiedVerseIndex === verse.verseNumber ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTafsirVerse(verse)}
                      className="p-1.5 rounded-lg hover:bg-amber-400/20 transition text-emerald-400/60 hover:text-amber-400"
                      title="عرض التفسير"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Arabic Text with Verse End Medallion */}
                  <div className="flex-1 text-right leading-loose font-quran" style={{ fontSize: `${fontSize}px` }}>
                    <span>{verse.arabicText}</span>
                    <span className="inline-flex items-center justify-center mx-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-400/40">
                      ﴿{verse.verseNumber}﴾
                    </span>
                  </div>
                </div>

                {/* Word-by-Word Interactivity (if available) */}
                {verse.words && (
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-amber-500/10">
                    <span className="text-[10px] text-amber-400/80 font-bold ml-2">كلمة بكلمة:</span>
                    {verse.words.map((word, wIdx) => (
                      <button
                        key={wIdx}
                        onClick={() => setSelectedWord(word)}
                        className="px-2 py-1 rounded-lg bg-emerald-950/50 hover:bg-amber-500/20 border border-emerald-700/40 hover:border-amber-400 text-xs font-quran text-amber-200 transition"
                      >
                        {word.arabic}
                      </button>
                    ))}
                  </div>
                )}

                {/* Translations */}
                {showTranslations && (
                  <div className="pt-2 text-xs sm:text-sm text-emerald-200/80 space-y-1 font-sans border-t border-amber-500/10 text-left" dir="ltr">
                    <p className="font-medium text-slate-200">{verse.translationEn}</p>
                    <p className="text-emerald-300/70 italic">{verse.translationFr}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tafsir Modal Drawer */}
      {activeTafsirVerse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#03241d] border-2 border-amber-500/40 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 bg-[#043328] border-b border-amber-500/30 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-amber-300 font-quran">
                  تفسير الآية {activeTafsirVerse.verseNumber} من سورة {selectedSurah.nameAr}
                </h3>
                <p className="text-xs text-emerald-200 mt-1">
                  {activeTafsirVerse.arabicText}
                </p>
              </div>
              <button
                onClick={() => setActiveTafsirVerse(null)}
                className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-200 flex items-center justify-center hover:bg-emerald-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Tafsir Ibn Kathir */}
              <div className="p-4 rounded-2xl bg-[#021812] border border-amber-500/20 space-y-2">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تفسير الإمام ابن كثير رحمه الله</span>
                </h4>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-sans">
                  {activeTafsirVerse.tafsirIbnKathir || 'التفسير المعتمد متوفر في قاعدة البيانات القرآنية الكاملة.'}
                </p>
              </div>

              {/* Tafsir Al-Saadi */}
              <div className="p-4 rounded-2xl bg-[#021812] border border-emerald-700/40 space-y-2">
                <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تفسير الشيخ السعدي (تيسير الكريم الرحمن)</span>
                </h4>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-sans">
                  {activeTafsirVerse.tafsirSaadi || 'تفسير ميسر يبين مقاصد الآية ومعانيها العظيمة.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Word-by-Word Modal */}
      {selectedWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#03231c] border-2 border-amber-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <span className="text-4xl font-extrabold font-quran text-amber-300 block">
              {selectedWord.arabic}
            </span>
            <div className="space-y-1 text-sm">
              <p className="font-mono text-emerald-300 font-bold">{selectedWord.transliteration}</p>
              <p className="text-white font-medium">English: {selectedWord.english}</p>
              <p className="text-emerald-200/80">Français: {selectedWord.french}</p>
            </div>
            <button
              onClick={() => setSelectedWord(null)}
              className="w-full py-2 rounded-xl bg-amber-400 text-emerald-950 font-bold text-xs"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

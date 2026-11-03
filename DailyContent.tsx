import React, { useState } from 'react';
import { DAILY_ADHKAR, VERIFIED_HADITHS } from '../utils/quranData';
import { AdhkarItem, HadithItem } from '../types';
import {
  Heart,
  Sun,
  Moon,
  Bed,
  Sparkles,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  Share2,
  Calendar,
} from 'lucide-react';

export const DailyContent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'morning' | 'evening' | 'sleep' | 'prayer'>('morning');
  const [adhkarCounts, setAdhkarCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'adhkar' | 'hadith'>('adhkar');

  const filteredAdhkar = DAILY_ADHKAR.filter((a) => a.category === selectedCategory);

  const handleIncrement = (item: AdhkarItem) => {
    const current = adhkarCounts[item.id] || 0;
    if (current < item.count) {
      setAdhkarCounts((prev) => ({
        ...prev,
        [item.id]: current + 1,
      }));
    }
  };

  const handleResetCounter = (id: string) => {
    setAdhkarCounts((prev) => ({
      ...prev,
      [id]: 0,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
          <Heart className="w-4 h-4 text-amber-400" />
          <span>الأذكار اليومية والأحاديث النبوية • DAILY ISLAMIC CONTENT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-quran">
          حصن المسلم والرياض الصالحين
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto">
          أذكار الصباح والمساء والنوم وأدعية الصلوات بأعدادها وفضائلها المأثورة عن رسول الله ﷺ مع عداد تسبيح تفاعلي.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex items-center gap-2 bg-[#021813] p-1.5 rounded-2xl border border-amber-500/30 mt-2">
          <button
            onClick={() => setActiveTab('adhkar')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'adhkar'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>الأذكار اليومية والمسنونة</span>
          </button>
          <button
            onClick={() => setActiveTab('hadith')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'hadith'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>مكتبة الأحاديث الصحيحة</span>
          </button>
        </div>
      </div>

      {activeTab === 'adhkar' ? (
        <div className="space-y-6">
          {/* Adhkar Category Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { id: 'morning', label: 'أذكار الصباح', icon: Sun },
              { id: 'evening', label: 'أذكار المساء', icon: Moon },
              { id: 'sleep', label: 'أذكار النوم', icon: Bed },
              { id: 'prayer', label: 'أذكار بعد الصلاة', icon: Sparkles },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 shadow-lg scale-105'
                      : 'bg-[#03291f] text-emerald-200 border border-emerald-800/80 hover:bg-emerald-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Adhkar Cards Grid */}
          <div className="space-y-4">
            {filteredAdhkar.map((item) => {
              const currentCount = adhkarCounts[item.id] || 0;
              const isCompleted = currentCount >= item.count;

              return (
                <div
                  key={item.id}
                  className={`p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 shadow-xl space-y-4 ${
                    isCompleted
                      ? 'bg-emerald-950/60 border-emerald-600/60 opacity-90'
                      : 'bg-gradient-to-b from-[#05372b] to-[#021f18] border-amber-500/30'
                  }`}
                >
                  {/* Top: Virtue & Source */}
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-amber-500/20">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{item.virtueAr}</span>
                    </span>
                    <span className="text-[11px] text-emerald-400/80 font-mono bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                      {item.reference}
                    </span>
                  </div>

                  {/* Arabic Text */}
                  <p className="text-2xl sm:text-3xl font-quran font-bold text-amber-100 text-right leading-loose">
                    {item.textAr}
                  </p>

                  {/* English & French Translation */}
                  <div className="pt-2 text-xs text-emerald-200/80 space-y-1 font-sans border-t border-amber-500/10 text-left" dir="ltr">
                    <p className="text-slate-200">{item.translationEn}</p>
                    <p className="text-emerald-300/70 italic">{item.translationFr}</p>
                  </div>

                  {/* Interactive Counter Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-amber-500/20">
                    <button
                      onClick={() => handleResetCounter(item.id)}
                      className="p-2 text-emerald-400 hover:text-amber-300 transition"
                      title="إعادة ضبط العداد"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Big Interactive Tasbeeh Button */}
                    <button
                      onClick={() => handleIncrement(item)}
                      disabled={isCompleted}
                      className={`px-8 py-3 rounded-2xl text-sm font-extrabold flex items-center gap-3 transition shadow-lg cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-700 text-white cursor-default'
                          : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-emerald-950 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                          <span>أتممت الذكر المبارك ({item.count})</span>
                        </>
                      ) : (
                        <>
                          <span>تسبيح</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-amber-300 font-mono text-xs">
                            {currentCount} / {item.count}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Hadith Library Tab */
        <div className="space-y-4">
          {VERIFIED_HADITHS.map((hadith) => (
            <div
              key={hadith.id}
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#05372b] to-[#021f18] border-2 border-amber-500/30 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between text-xs pb-3 border-b border-amber-500/20">
                <span className="text-amber-300 font-bold bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
                  {hadith.topicAr}
                </span>
                <span className="text-[11px] text-emerald-300 font-bold bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                  {hadith.grade}
                </span>
              </div>

              {/* Matn / Arabic Text */}
              <p className="text-2xl sm:text-3xl font-quran font-bold text-amber-100 text-right leading-loose">
                « {hadith.arabicText} »
              </p>

              {/* Translation */}
              <p className="text-sm text-emerald-200/90 font-medium italic text-left" dir="ltr">
                "{hadith.translationEn}"
              </p>

              {/* Takhrij / Reference */}
              <div className="flex items-center justify-between pt-3 border-t border-amber-500/15 text-xs text-emerald-300/80">
                <span>الراوي: {hadith.narratorAr}</span>
                <span className="font-mono text-amber-400">{hadith.source}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

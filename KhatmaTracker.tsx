import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateKhatmaProgress } from '../utils/audioEngine';
import {
  CheckCircle2,
  Calendar,
  Award,
  Sparkles,
  BookOpen,
  RotateCcw,
  Clock,
  Check,
} from 'lucide-react';

export const KhatmaTracker: React.FC = () => {
  const { khatmaPlan, updateKhatmaJuz, language } = useApp();

  const [selectedPlanDays, setSelectedPlanDays] = useState<number>(khatmaPlan.durationDays || 30);
  const [completedJuzMap, setCompletedJuzMap] = useState<Record<number, boolean>>(() => {
    const map: Record<number, boolean> = {};
    for (let i = 1; i <= (khatmaPlan.currentJuz || 12); i++) {
      map[i] = true;
    }
    return map;
  });

  const completedCount = Object.values(completedJuzMap).filter(Boolean).length;
  const { percentage, remainingJuz } = calculateKhatmaProgress(completedCount, 30);
  const dailyTargetJuz = (30 / selectedPlanDays).toFixed(1);

  const toggleJuz = (juzNum: number) => {
    const newStatus = !completedJuzMap[juzNum];
    const updated = { ...completedJuzMap, [juzNum]: newStatus };
    setCompletedJuzMap(updated);
    const newCount = Object.values(updated).filter(Boolean).length;
    updateKhatmaJuz(newCount);
  };

  const handleResetKhatma = () => {
    if (confirm(language === 'ar' ? 'هل تريد بدء ختمة جديدة وتصفير الإنجاز؟' : 'Start a new Khatma?')) {
      setCompletedJuzMap({});
      updateKhatmaJuz(0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>متابعة ختمة القرآن الكريم • QURAN KHATMA TRACKER</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-quran">
          خطة وإنجاز ختم القرآن الكريم
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto">
          اختر مدة الختمة (7 أو 15 أو 30 يوماً)، تابع الأجزاء المقروءة، واحرص على وردك القرآني اليومي بانتظام.
        </p>

        {/* Plan Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { days: 7, label: 'ختمة أسبوعية (7 أيام)' },
            { days: 15, label: 'ختمة النصف شهر (15 يوماً)' },
            { days: 30, label: 'ختمة الشهر المبارك (30 يوماً)' },
          ].map((plan) => (
            <button
              key={plan.days}
              onClick={() => setSelectedPlanDays(plan.days)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedPlanDays === plan.days
                  ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                  : 'bg-[#03291f] text-emerald-200 border border-emerald-800 hover:bg-emerald-900'
              }`}
            >
              {plan.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#05372b] to-[#021f18] border-2 border-amber-500/40 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-[#021711] border border-amber-500/20 space-y-1">
            <span className="text-xs text-emerald-300 font-bold block">نسبة الإنجاز</span>
            <span className="text-3xl font-extrabold text-amber-300 font-mono">{percentage}%</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#021711] border border-amber-500/20 space-y-1">
            <span className="text-xs text-emerald-300 font-bold block">الأجزاء المكتملة</span>
            <span className="text-3xl font-extrabold text-emerald-300 font-mono">{completedCount} / 30</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#021711] border border-amber-500/20 space-y-1">
            <span className="text-xs text-emerald-300 font-bold block">الأجزاء المتبقية</span>
            <span className="text-3xl font-extrabold text-amber-200 font-mono">{remainingJuz}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#021711] border border-amber-500/20 space-y-1">
            <span className="text-xs text-emerald-300 font-bold block">الورد اليومي المطلوب</span>
            <span className="text-2xl font-extrabold text-emerald-300 font-mono">
              {dailyTargetJuz} <span className="text-xs">جزء/يوم</span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3 rounded-full bg-emerald-950 overflow-hidden border border-amber-500/30">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-300 transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-emerald-300/80">
            <span>البداية: سورة الفاتحة</span>
            <span>الهدف: ختم القرآن كاملاً ({percentage}%)</span>
            <span>النهاية: سورة الناس</span>
          </div>
        </div>

        {/* 30 Juz Completion Checklist Grid */}
        <div className="space-y-3 pt-4 border-t border-amber-500/20">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-300">
              اضغط على الجزء لتحديده كمقروء ومكتمل:
            </h3>
            <button
              onClick={handleResetKhatma}
              className="flex items-center gap-1 text-xs text-red-300 hover:text-red-200 font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بدء ختمة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
              const done = Boolean(completedJuzMap[juz]);
              return (
                <button
                  key={juz}
                  onClick={() => toggleJuz(juz)}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition duration-200 cursor-pointer ${
                    done
                      ? 'bg-gradient-to-b from-emerald-700 to-emerald-900 border-amber-400 text-amber-300 shadow-md font-bold'
                      : 'bg-[#021812] border-emerald-800 text-emerald-200 hover:bg-emerald-950'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-emerald-600 inline-block" />
                    )}
                    <span className="text-xs font-mono font-bold">الجزء {juz}</span>
                  </div>
                  <span className="text-[10px] text-emerald-300/80">
                    {done ? 'تمت القراءة ✓' : 'لم يقرأ بعد'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

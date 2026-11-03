import React, { useState } from 'react';
import { TAJWEED_RULES } from '../utils/quranData';
import { TajweedRule } from '../types';
import {
  Layers,
  Sparkles,
  BookOpen,
  Award,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';

export const TajweedAcademy: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState<TajweedRule>(TAJWEED_RULES[0]);
  const [activeTab, setActiveTab] = useState<'rules' | 'quiz'>('rules');

  // Interactive Quiz State
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const quizQuestions = [
    {
      id: 1,
      question: 'ما هو حكم النون الساكنة في قوله تعالى: (مِنْ خَوْفٍ)؟',
      options: ['إظهار حلقي', 'إقلاب', 'إدغام بغنة', 'إخفاء حقيقي'],
      correctIndex: 0,
      explanation: 'إظهار حلقي لأن الخاء من حروف الحلق الستة (ء، هـ، ع، ح، غ، خ).',
    },
    {
      id: 2,
      question: 'ما هو الحكم التجويدي في قوله تعالى: (مِن بَعْدِ)؟',
      options: ['إدغام بغير غنة', 'إقلاب', 'إخفاء حقيقي', 'إظهار حلقي'],
      correctIndex: 1,
      explanation: 'إقلاب لأن النون الساكنة جاء بعدها حرف الباء فتقلب ميماً مخفاة بغنة.',
    },
    {
      id: 3,
      question: 'ما هي حروف القلقلة المجموعة في جملة مشهورة؟',
      options: ['يرملون', 'قطب جد', 'أخي هاك علماً', 'خص ضغط قظ'],
      correctIndex: 1,
      explanation: 'حروف القلقلة خمسة مجموعة في: (قُطْبُ جَدٍ).',
    },
    {
      id: 4,
      question: 'كم عدد حركات المد المتصل الواجب عند حفص عن عاصم؟',
      options: ['حركتان', '4 أو 5 حركات', '6 حركات وجوباً', 'حركة واحدة'],
      correctIndex: 1,
      explanation: 'يمد المد المتصل 4 أو 5 حركات وجوباً لاجتماع حرف المد والهمزة في كلمة واحدة.',
    },
  ];

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
    setSubmitted(true);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setQuizScore(null);
    setSubmitted(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Academy Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>أكاديمية التجويد وأحكام التلاوة • TAJWEED ACADEMY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-quran">
          تعلّم أحكام تجويد القرآن الكريم
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl mx-auto">
          دليل تعليمي معتمد وشامل لأحكام النون والميم الساكنة، المدود، القلقلة ومخارج الحروف مع أمثلة قرآنية واختبارات تفاعلية.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex items-center gap-2 bg-[#021813] p-1.5 rounded-2xl border border-amber-500/30 mt-2">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'rules'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            دروس وقواعد التجويد
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>الاختبار التفاعلي</span>
          </button>
        </div>
      </div>

      {activeTab === 'rules' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Rules Navigation List */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-sm font-bold text-amber-300 px-2 pb-1">
              اختر قاعدة التجويد:
            </h3>
            {TAJWEED_RULES.map((rule) => {
              const isSelected = selectedRule.id === rule.id;
              return (
                <button
                  key={rule.id}
                  onClick={() => setSelectedRule(rule)}
                  className={`w-full text-right p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#064234] to-[#032a21] border-amber-400 text-amber-200 shadow-lg ring-1 ring-amber-400/50'
                      : 'bg-[#021d17]/80 border-emerald-800/60 text-emerald-100 hover:bg-emerald-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-sm"
                      style={{ backgroundColor: rule.color }}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold font-quran">{rule.titleAr}</span>
                      <span className="text-[11px] text-emerald-400/80">{rule.titleEn}</span>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-900/60 text-amber-300 font-mono">
                    {rule.letters.length} حروف
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Rule Explanation & Quran Examples */}
          <div className="lg:col-span-8 rounded-3xl bg-gradient-to-b from-[#05372b] to-[#021f18] border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Rule Header */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full shadow"
                  style={{ backgroundColor: selectedRule.color }}
                />
                <div>
                  <h2 className="text-2xl font-extrabold text-amber-300 font-quran">
                    {selectedRule.titleAr}
                  </h2>
                  <p className="text-xs text-emerald-300/80">{selectedRule.titleEn}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/40">
                أحكام النون والتجويد
              </span>
            </div>

            {/* Rule Definition */}
            <div className="p-5 rounded-2xl bg-[#021812] border border-amber-500/20 space-y-2">
              <h4 className="text-xs font-bold text-amber-400">التعريف والشرح المعتمد:</h4>
              <p className="text-sm text-emerald-50 leading-relaxed font-sans">
                {selectedRule.descriptionAr}
              </p>
              <p className="text-xs text-emerald-300/70 italic pt-1">
                {selectedRule.descriptionEn}
              </p>
            </div>

            {/* Rule Letters */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-300">حروف القاعدة:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRule.letters.map((letter, i) => (
                  <span
                    key={i}
                    className="w-10 h-10 rounded-xl bg-emerald-950 border-2 border-amber-500/40 text-amber-300 font-quran text-xl font-bold flex items-center justify-center shadow-md"
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>

            {/* Quranic Verse Examples */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-amber-300">أمثلة تطبيقية من القرآن الكريم:</h4>
              <div className="space-y-3">
                {selectedRule.examples.map((ex, exIdx) => (
                  <div
                    key={exIdx}
                    className="p-4 rounded-2xl bg-[#021812] border border-emerald-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                      <span className="font-mono">{ex.surahName} ({ex.verseRef})</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-900 text-amber-300 font-mono text-[11px]">
                        موضع الحكم: {ex.rulePart}
                      </span>
                    </div>
                    <p className="text-2xl font-quran font-bold text-emerald-100 text-right leading-loose">
                      {ex.verseText}
                    </p>
                    <p className="text-xs text-emerald-300/80 font-sans border-t border-emerald-900/60 pt-2">
                      💡 {ex.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tajweed Quiz Tab */
        <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-b from-[#05372b] to-[#021f18] border-2 border-amber-500/40 p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-amber-300 font-quran">
              اختبار التجويد التفاعلي
            </h2>
            <p className="text-xs text-emerald-200">
              أجب عن الأسئلة التالية لاختبار معرفتك بأحكام التلاوة والتجويد.
            </p>
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-[#021812] border border-amber-500/20 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-emerald-50 font-sans">
                    {q.question}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[q.id] === optIdx;
                    const isCorrect = optIdx === q.correctIndex;

                    let btnStyle = 'bg-emerald-950/60 border-emerald-800 text-emerald-200 hover:bg-emerald-900';
                    if (submitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-700 border-emerald-400 text-white font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-red-900 border-red-500 text-white';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-amber-500/30 border-amber-400 text-amber-200 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 rounded-xl border text-xs sm:text-sm text-right transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
                        {submitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-red-300 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-200 mt-2">
                    <span className="font-bold text-amber-300">الشرح والتوجيه: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quiz Action Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-amber-500/20">
            {!submitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length < quizQuestions.length}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 font-extrabold text-sm shadow-xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                تصحيح الإجابات وعرض النتيجة
              </button>
            ) : (
              <div className="text-center space-y-3">
                <div className="text-xl font-bold text-amber-300">
                  نتيجتك في الاختبار: {quizScore} من {quizQuestions.length}
                </div>
                <button
                  onClick={handleResetQuiz}
                  className="px-6 py-2.5 rounded-xl bg-emerald-900 text-emerald-100 hover:bg-emerald-800 border border-emerald-600 text-xs font-bold flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة الاختبار</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

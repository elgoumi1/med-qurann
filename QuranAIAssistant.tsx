import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Send,
  Search,
  Award,
  BookOpen,
  Mic,
  MicOff,
  Loader2,
  HelpCircle,
  Compass,
  CheckCircle2,
  Volume2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const QuranAIAssistant: React.FC = () => {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<'chat' | 'search' | 'memorizePlan'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        language === 'ar'
          ? 'السلام عليكم ورحمة الله وبركاته. أهلاً بك في المساعد القرآني الذكي. أنا هنا لمساعدتك في تدبر آيات القرآن الكريم، شرح مفرداته، استعراض أسباب النزول المعتمدة، والإجابة عن استفساراتك بتوثيق قرآني رصين. كيف يمكنني خدمتك اليوم؟'
          : 'As-salamu alaykum. Welcome to the Quran AI Assistant. I am here to assist with Quranic verse reflections, vocabulary explanations, revelation context, and scholarly references. How may I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Semantic Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Memorization Plan State
  const [planSurah, setPlanSurah] = useState('سورة الملك');
  const [planDays, setPlanDays] = useState(7);
  const [planMinutes, setPlanMinutes] = useState(25);
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Sample prompt chips
  const suggestedPrompts = [
    'ما هي مقاصد وأسباب نزول سورة الشرح؟',
    'ما الفرق بين اسمي الله (الرَّحْمَٰنِ) و (الرَّحِيمِ)؟',
    'استخرج الآيات التي تحث على الصبر والفرج في القرآن.',
    'كيف أطبق الإخفاء الحقيقي في أحكام النون الساكنة؟',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoadingChat) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoadingChat(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language }),
      });
      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || data.error || 'عذراً، حدث خطأ أثناء المعالجة.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'تعذر الاتصال بالخادم حالياً. يرجى التأكد من الاتصال بالإنترنت ومفتاح GEMINI_API_KEY.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleSemanticSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, language }),
      });
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateMemorizePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingPlan(true);
    try {
      const res = await fetch('/api/gemini/memorize-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetSurah: planSurah,
          days: planDays,
          dailyMinutes: planMinutes,
          language,
        }),
      });
      const data = await res.json();
      setGeneratedPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>المساعد القرآني والبحث الذكي • QURAN AI ASSISTANT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-quran">
          المساعد القرآني بالذكاء الاصطناعي
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto">
          استكشف معاني الآيات، ابحث بالمعنى والموضوع، وأنشئ خطط حفظ وتثبيت مخصصة ومبنية على المراجع الموثقة.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex items-center gap-2 bg-[#021813] p-1.5 rounded-2xl border border-amber-500/30 mt-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'chat'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            المحادثة القرآنية والتدبر
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'search'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            البحث الدلالي بالموضوع
          </button>
          <button
            onClick={() => setActiveTab('memorizePlan')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'memorizePlan'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            مولد خطط الحفظ المخصصة
          </button>
        </div>
      </div>

      {/* Tab 1: Chat Assistant */}
      {activeTab === 'chat' && (
        <div className="rounded-3xl bg-gradient-to-b from-[#05372b] to-[#021f18] border-2 border-amber-500/40 shadow-2xl p-6 sm:p-8 flex flex-col h-[650px]">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-amber-400 text-emerald-950'
                        : 'bg-emerald-900 border border-amber-400/40 text-amber-300'
                    }`}
                  >
                    {isUser ? 'أنت' : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-amber-500/20 text-amber-100 border border-amber-400/30'
                        : 'bg-[#021812] text-emerald-50 border border-emerald-800 shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-line font-sans">{m.text}</div>
                    <span className="text-[10px] text-emerald-400/60 block text-left mt-2">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            {isLoadingChat && (
              <div className="flex items-center gap-2 text-xs text-amber-300 p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري استحضار الآيات والتفسير المعتمد...</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Prompts */}
          <div className="py-3 flex flex-wrap gap-2 border-t border-amber-500/20 mt-4">
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-3 py-1 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-[11px] text-emerald-200 hover:text-amber-300 transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 pt-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="اكتب سؤالك حول الآيات، المفردات، أو التفسير..."
              className="flex-1 bg-[#021812] border border-amber-500/40 rounded-xl px-4 py-3 text-xs sm:text-sm text-emerald-100 placeholder-emerald-500/50 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={isLoadingChat || !inputMessage.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4 rotate-180" />
              <span>إرسال</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Semantic Search */}
      {activeTab === 'search' && (
        <div className="rounded-3xl bg-gradient-to-b from-[#05372b] to-[#021f18] border-2 border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSemanticSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بمفهوم أو موضوع (مثال: الصبر عند الابتلاء، بر الوالدين، التيسير بعد الشدة)..."
              className="flex-1 bg-[#021812] border border-amber-500/40 rounded-xl px-4 py-3 text-xs sm:text-sm text-emerald-100 placeholder-emerald-500/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>بحث دلالي</span>
            </button>
          </form>

          {searchResults && (
            <div className="space-y-4 pt-4 border-t border-amber-500/20">
              <div className="p-4 rounded-2xl bg-[#021812] border border-emerald-800 text-sm text-emerald-200">
                <span className="font-bold text-amber-300">خلاصة البحث: </span>
                {searchResults.summary}
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-amber-300">الآيات القرآنية ذات الصلة:</h3>
                {searchResults.relevantVerses?.map((v: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#021812] border border-amber-500/20 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                      <span>سورة {v.surahName} (الآية {v.verseNumber})</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-900 text-amber-300 text-[11px]">
                        {v.theme}
                      </span>
                    </div>
                    <p className="text-2xl font-quran font-bold text-amber-200 text-right leading-loose">
                      {v.arabicText}
                    </p>
                    <p className="text-xs text-emerald-200/80 font-sans">{v.translation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Personalized Memorization Planner */}
      {activeTab === 'memorizePlan' && (
        <div className="rounded-3xl bg-gradient-to-b from-[#05372b] to-[#021f18] border-2 border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
          <form onSubmit={handleGenerateMemorizePlan} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-emerald-300 font-bold">السورة المستهدفة:</label>
              <input
                type="text"
                value={planSurah}
                onChange={(e) => setPlanSurah(e.target.value)}
                className="w-full bg-[#021812] border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-200 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-emerald-300 font-bold">المدة الزمنية (أيام):</label>
              <input
                type="number"
                min={3}
                max={60}
                value={planDays}
                onChange={(e) => setPlanDays(parseInt(e.target.value, 10))}
                className="w-full bg-[#021812] border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-200 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-emerald-300 font-bold">الوقت اليومي (دقائق):</label>
              <input
                type="number"
                min={10}
                max={120}
                value={planMinutes}
                onChange={(e) => setPlanMinutes(parseInt(e.target.value, 10))}
                className="w-full bg-[#021812] border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-200 font-bold"
              />
            </div>
            <div className="sm:col-span-3 pt-2">
              <button
                type="submit"
                disabled={isGeneratingPlan}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 font-extrabold text-xs sm:text-sm shadow-md hover:scale-102 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGeneratingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                <span>توليد جدول الحفظ والمراجعة المخصص</span>
              </button>
            </div>
          </form>

          {generatedPlan && (
            <div className="space-y-4 pt-4 border-t border-amber-500/20">
              <div className="p-4 rounded-2xl bg-[#021812] border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-amber-300">{generatedPlan.title}</h3>
                  <p className="text-xs text-emerald-200 mt-0.5">{generatedPlan.dailyTarget}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-900 text-amber-400 text-xs font-bold border border-emerald-700">
                  خطة معتمدة
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {generatedPlan.schedule?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#021812] border border-emerald-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                      <span>اليوم {item.day}</span>
                      <span className="bg-emerald-950 px-2 py-0.5 rounded text-[11px] text-emerald-300">
                        الآيات: {item.verses}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-100 font-medium">🎯 {item.task}</p>
                    <p className="text-xs text-emerald-400/80">🔄 {item.revision}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useApp, PageId } from '../context/AppContext';
import {
  Compass,
  Users,
  BookOpen,
  Award,
  Sparkles,
  Headphones,
  Moon,
  Volume2,
} from 'lucide-react';

interface QuickCard {
  id: PageId;
  titleAr: string;
  titleEn: string;
  titleFr: string;
  subtitleAr: string;
  subtitleEn: string;
  subtitleFr: string;
  icon: any;
  color: string;
}

export const QuickActionCards: React.FC = () => {
  const { setCurrentPage, language, togglePlayPause, isPlaying } = useApp();

  const cards: QuickCard[] = [
    {
      id: 'adhkar',
      titleAr: 'أذكار يومية ومواقيت الصلاة',
      titleEn: 'Daily Adhkar & Prayer Times',
      titleFr: 'Adhkar & Horaires de Prière',
      subtitleAr: 'حصن المسلم ومواقيت دقيقة',
      subtitleEn: 'Fortress of the Muslim & accurate prayer times',
      subtitleFr: 'La citadelle du musulman',
      icon: Moon,
      color: 'from-emerald-800/80 to-emerald-950/90',
    },
    {
      id: 'reciters',
      titleAr: 'مكتبة القراء المشهورين',
      titleEn: 'Famous Reciters Library',
      titleFr: 'Bibliothèque des Récitateurs',
      subtitleAr: 'تلاوات نقية لـ 14 قارئاً معتمداً',
      subtitleEn: 'High fidelity audio of accredited Qaris',
      subtitleFr: 'Récitations pures des grands maîtres',
      icon: Users,
      color: 'from-emerald-800/80 to-emerald-950/90',
    },
    {
      id: 'mushaf',
      titleAr: 'المصحف الإلكتروني مع التفسير',
      titleEn: 'Digital Quran with Tafsir',
      titleFr: 'Coran Numérique avec Tafsir',
      subtitleAr: 'قراءة مريحة مع تفسير ابن كثير والسعدي',
      subtitleEn: 'Comfortable reading with authentic Tafsir',
      subtitleFr: 'Lecture apaisante avec exégèse',
      icon: BookOpen,
      color: 'from-emerald-800/80 to-emerald-950/90',
    },
    {
      id: 'memorize',
      titleAr: 'نظام الحفظ والمراجعة',
      titleEn: 'Memorization System',
      titleFr: 'Système de Mémorisation',
      subtitleAr: 'تكرار الآيات وإخفاء النص للتمكين',
      subtitleEn: 'Verse repetitions & test mode for mastery',
      subtitleFr: 'Répétition de versets et révision active',
      icon: Award,
      color: 'from-emerald-800/80 to-emerald-950/90',
    },
    {
      id: 'ai',
      titleAr: 'مساعد قرآني ذكي بالذكاء الاصطناعي',
      titleEn: 'AI Quran Assistant',
      titleFr: 'Assistant Coranique IA',
      subtitleAr: 'إجابة الأسئلة والبحث الدلالي الموضوعي',
      subtitleEn: 'Semantic search & scholarly thematic answers',
      subtitleFr: 'Recherche thématique et explications',
      icon: Sparkles,
      color: 'from-emerald-800/80 to-emerald-950/90',
    },
    {
      id: 'live',
      titleAr: 'مشغل متقدم بجودة عالية',
      titleEn: 'Advanced High Quality Player',
      titleFr: 'Lecteur Audio Avancé HD',
      subtitleAr: 'تلاوة تفاعلية وتزامن الآيات',
      subtitleEn: 'Interactive recitation with synced verses',
      subtitleFr: 'Récitation interactive haute fidélité',
      icon: Headphones,
      color: 'from-emerald-800/80 to-emerald-950/90',
    },
  ];

  const getTitle = (c: QuickCard) => {
    if (language === 'fr') return c.titleFr;
    if (language === 'en') return c.titleEn;
    return c.titleAr;
  };

  const getSubtitle = (c: QuickCard) => {
    if (language === 'fr') return c.subtitleFr;
    if (language === 'en') return c.subtitleEn;
    return c.subtitleAr;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => setCurrentPage(card.id)}
              className="group relative flex flex-col items-center text-center p-4 rounded-2xl bg-gradient-to-b from-[#043328]/90 to-[#02211a]/95 hover:from-[#064738] hover:to-[#032a21] border border-amber-500/25 hover:border-amber-400 shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              {/* Gold Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

              {/* Icon Container with Gold Glow */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-emerald-900/60 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:text-amber-200 group-hover:scale-110 group-hover:bg-amber-400/30 transition duration-300 mb-3 shadow-inner">
                <Icon className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3 className="text-xs sm:text-sm font-bold text-emerald-50 group-hover:text-amber-200 line-clamp-2 leading-tight">
                {getTitle(card)}
              </h3>

              {/* Subtitle */}
              <p className="mt-1.5 text-[11px] text-emerald-300/70 line-clamp-1">
                {getSubtitle(card)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

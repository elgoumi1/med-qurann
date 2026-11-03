export type Language = 'ar' | 'en' | 'fr';

export type RevelationType = 'Meccan' | 'Medinan';

export interface Surah {
  number: number;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  englishMeaning: string;
  frenchMeaning: string;
  revelationType: RevelationType;
  versesCount: number;
  juzStart: number;
  pageStart: number;
}

export interface Reciter {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  country: string;
  countryCode: string;
  flag: string;
  photoUrl: string;
  riwayah: string;
  style: 'Murattal' | 'Mujawwad';
  serverUrl: string;
  bioAr: string;
  bioEn: string;
  bioFr: string;
  featured: boolean;
  totalSurahs: number;
  listensCount: number;
  likesCount: number;
}

export interface WordInfo {
  arabic: string;
  transliteration: string;
  english: string;
  french: string;
  root?: string;
  grammar?: string;
}

export interface Verse {
  surahNumber: number;
  verseNumber: number;
  arabicText: string;
  translationEn: string;
  translationFr: string;
  tafsirIbnKathir?: string;
  tafsirSaadi?: string;
  tafsirMuyassar?: string;
  words?: WordInfo[];
}

export interface TajweedRule {
  id: string;
  titleAr: string;
  titleEn: string;
  titleFr: string;
  category: 'noon' | 'meem' | 'madd' | 'qalqalah' | 'ghunnah' | 'waqf';
  color: string;
  descriptionAr: string;
  descriptionEn: string;
  letters: string[];
  examples: {
    verseText: string;
    surahName: string;
    verseRef: string;
    rulePart: string;
    explanation: string;
  }[];
}

export interface AdhkarItem {
  id: string;
  category: 'morning' | 'evening' | 'sleep' | 'prayer';
  textAr: string;
  translationEn: string;
  translationFr: string;
  count: number;
  virtueAr: string;
  virtueEn: string;
  reference: string;
}

export interface HadithItem {
  id: string;
  arabicText: string;
  translationEn: string;
  narratorAr: string;
  narratorEn: string;
  source: string;
  grade: string;
  topicAr: string;
  topicEn: string;
}

export interface KhatmaPlan {
  id: string;
  title: string;
  durationDays: number;
  currentJuz: number;
  currentHizb: number;
  startDate: string;
  targetDate: string;
  notes?: string;
}

export interface PrayerTimes {
  city: string;
  country: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayer: string;
  timeRemaining: string;
}

export type RepeatMode = 'none' | 'one' | 'all';

export interface AudioTrack {
  reciter: Reciter;
  surah: Surah;
  audioUrl: string;
}

export type ThemeMode = 'emerald' | 'dark' | 'mushaf' | 'light';

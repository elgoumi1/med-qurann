import React, { createContext, useContext, useState, useEffect } from 'react';
import { Reciter, Surah, RepeatMode, Language, ThemeMode, KhatmaPlan } from '../types';
import { RECITERS, ALL_SURAHS, getAudioUrl } from '../utils/quranData';

export type PageId =
  | 'home'
  | 'reciters'
  | 'mushaf'
  | 'live'
  | 'memorize'
  | 'tajweed'
  | 'tafsir'
  | 'wordbyword'
  | 'ai'
  | 'adhkar'
  | 'khatma'
  | 'favorites'
  | 'admin'
  | 'about'
  | 'contact';

interface AppContextType {
  // Navigation & Localization
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // Selected Reciter & Surah
  selectedReciter: Reciter;
  setSelectedReciter: (r: Reciter) => void;
  selectedSurah: Surah;
  setSelectedSurah: (s: Surah) => void;

  // Audio Player State
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (dur: number) => void;
  volume: number;
  setVolume: (vol: number) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  repeatMode: RepeatMode;
  setRepeatMode: (mode: RepeatMode) => void;
  shuffle: boolean;
  setShuffle: (shuffle: boolean) => void;
  playTrack: (reciter: Reciter, surah: Surah) => void;
  togglePlayPause: () => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  audioUrl: string;

  // Favorites & Bookmarks
  favoriteReciters: string[];
  toggleFavoriteReciter: (id: string) => void;
  favoriteSurahs: number[];
  toggleFavoriteSurah: (num: number) => void;
  bookmarkedVerses: { surah: number; verse: number; timestamp: string }[];
  toggleBookmarkVerse: (surah: number, verse: number) => void;

  // Memorized Verses
  memorizedVerses: Record<string, boolean>; // 'surah-verse'
  toggleVerseMemorized: (surah: number, verse: number) => void;

  // Khatma
  khatmaPlan: KhatmaPlan;
  updateKhatmaJuz: (juz: number) => void;

  // Auth & Admin Modal
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  currentUser: { name: string; email: string; role: 'user' | 'admin' } | null;
  setCurrentUser: (user: { name: string; email: string; role: 'user' | 'admin' } | null) => void;

  // Reciter Directory (allow Admin to add new reciters)
  recitersList: Reciter[];
  addReciter: (reciter: Reciter) => void;
  removeReciter: (id: string) => void;

  // Search Query
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<ThemeMode>('emerald');

  // Reciters State with Initial Data
  const [recitersList, setRecitersList] = useState<Reciter[]>(() => {
    const saved = localStorage.getItem('quran_reciters_list');
    return saved ? JSON.parse(saved) : RECITERS;
  });

  const [selectedReciter, setSelectedReciter] = useState<Reciter>(() => recitersList[1] || RECITERS[1]); // Sheikh Yasser Al-Dosari default
  const [selectedSurah, setSelectedSurah] = useState<Surah>(() => ALL_SURAHS[0]); // Al-Fatihah default

  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
  const [shuffle, setShuffle] = useState(false);

  // Favorites & Bookmarks
  const [favoriteReciters, setFavoriteReciters] = useState<string[]>(() => {
    const saved = localStorage.getItem('quran_fav_reciters');
    return saved ? JSON.parse(saved) : ['yasser_dosari', 'khalid_qahtani', 'mishary_alafasy'];
  });

  const [favoriteSurahs, setFavoriteSurahs] = useState<number[]>(() => {
    const saved = localStorage.getItem('quran_fav_surahs');
    return saved ? JSON.parse(saved) : [1, 18, 36, 55, 67];
  });

  const [bookmarkedVerses, setBookmarkedVerses] = useState<{ surah: number; verse: number; timestamp: string }[]>(() => {
    const saved = localStorage.getItem('quran_bookmarks');
    return saved ? JSON.parse(saved) : [{ surah: 1, verse: 1, timestamp: new Date().toISOString() }];
  });

  const [memorizedVerses, setMemorizedVerses] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('quran_memorized');
    return saved ? JSON.parse(saved) : { '1-1': true, '1-2': true, '1-3': true, '1-4': true, '1-5': true, '1-6': true, '1-7': true };
  });

  // Khatma plan
  const [khatmaPlan, setKhatmaPlan] = useState<KhatmaPlan>(() => {
    const saved = localStorage.getItem('quran_khatma_plan');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'khatma_ramadan',
          title: 'ختمة شهر القرآن الكريم',
          durationDays: 30,
          currentJuz: 12,
          currentHizb: 24,
          startDate: '2026-11-01',
          targetDate: '2026-11-30',
        };
  });

  // User Auth State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: 'user' | 'admin' } | null>(() => {
    const saved = localStorage.getItem('quran_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Persist settings
  useEffect(() => {
    localStorage.setItem('quran_reciters_list', JSON.stringify(recitersList));
  }, [recitersList]);

  useEffect(() => {
    localStorage.setItem('quran_fav_reciters', JSON.stringify(favoriteReciters));
  }, [favoriteReciters]);

  useEffect(() => {
    localStorage.setItem('quran_fav_surahs', JSON.stringify(favoriteSurahs));
  }, [favoriteSurahs]);

  useEffect(() => {
    localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarkedVerses));
  }, [bookmarkedVerses]);

  useEffect(() => {
    localStorage.setItem('quran_memorized', JSON.stringify(memorizedVerses));
  }, [memorizedVerses]);

  useEffect(() => {
    localStorage.setItem('quran_khatma_plan', JSON.stringify(khatmaPlan));
  }, [khatmaPlan]);

  // Update HTML direction when language changes
  useEffect(() => {
    const isRTL = language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const audioUrl = getAudioUrl(selectedReciter, selectedSurah.number);

  const playTrack = (reciter: Reciter, surah: Surah) => {
    setSelectedReciter(reciter);
    setSelectedSurah(surah);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const playNextTrack = () => {
    if (repeatMode === 'one') {
      setCurrentTime(0);
      setIsPlaying(true);
      return;
    }

    let nextSurahNum = selectedSurah.number + 1;
    if (shuffle) {
      nextSurahNum = Math.floor(Math.random() * ALL_SURAHS.length) + 1;
    } else if (nextSurahNum > ALL_SURAHS.length) {
      nextSurahNum = repeatMode === 'all' ? 1 : selectedSurah.number;
    }

    const nextSurah = ALL_SURAHS.find((s) => s.number === nextSurahNum);
    if (nextSurah) {
      setSelectedSurah(nextSurah);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const playPreviousTrack = () => {
    let prevSurahNum = selectedSurah.number - 1;
    if (prevSurahNum < 1) {
      prevSurahNum = ALL_SURAHS.length;
    }
    const prevSurah = ALL_SURAHS.find((s) => s.number === prevSurahNum);
    if (prevSurah) {
      setSelectedSurah(prevSurah);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const toggleFavoriteReciter = (id: string) => {
    setFavoriteReciters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFavoriteSurah = (num: number) => {
    setFavoriteSurahs((prev) =>
      prev.includes(num) ? prev.filter((item) => item !== num) : [...prev, num]
    );
  };

  const toggleBookmarkVerse = (surah: number, verse: number) => {
    setBookmarkedVerses((prev) => {
      const exists = prev.some((b) => b.surah === surah && b.verse === verse);
      if (exists) {
        return prev.filter((b) => !(b.surah === surah && b.verse === verse));
      }
      return [...prev, { surah, verse, timestamp: new Date().toISOString() }];
    });
  };

  const toggleVerseMemorized = (surah: number, verse: number) => {
    const key = `${surah}-${verse}`;
    setMemorizedVerses((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updateKhatmaJuz = (juz: number) => {
    setKhatmaPlan((prev) => ({
      ...prev,
      currentJuz: Math.max(1, Math.min(30, juz)),
      currentHizb: Math.max(1, Math.min(60, juz * 2)),
    }));
  };

  const addReciter = (reciter: Reciter) => {
    setRecitersList((prev) => [reciter, ...prev]);
  };

  const removeReciter = (id: string) => {
    setRecitersList((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        language,
        setLanguage,
        theme,
        setTheme,
        selectedReciter,
        setSelectedReciter,
        selectedSurah,
        setSelectedSurah,
        isPlaying,
        setIsPlaying,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        volume,
        setVolume,
        playbackSpeed,
        setPlaybackSpeed,
        repeatMode,
        setRepeatMode,
        shuffle,
        setShuffle,
        playTrack,
        togglePlayPause,
        playNextTrack,
        playPreviousTrack,
        audioUrl,
        favoriteReciters,
        toggleFavoriteReciter,
        favoriteSurahs,
        toggleFavoriteSurah,
        bookmarkedVerses,
        toggleBookmarkVerse,
        memorizedVerses,
        toggleVerseMemorized,
        khatmaPlan,
        updateKhatmaJuz,
        isAuthOpen,
        setIsAuthOpen,
        currentUser,
        setCurrentUser,
        recitersList,
        addReciter,
        removeReciter,
        globalSearchQuery,
        setGlobalSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

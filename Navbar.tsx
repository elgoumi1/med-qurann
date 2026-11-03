import React, { useState } from 'react';
import { useApp, PageId } from '../context/AppContext';
import { Language, ThemeMode } from '../types';
import {
  BookOpen,
  Headphones,
  Users,
  Compass,
  Award,
  Sparkles,
  Heart,
  Moon,
  Sun,
  Book,
  Globe,
  User,
  Menu,
  X,
  Download,
  Shield,
  Layers,
  MessageSquareQuote,
  CheckCircle2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    language,
    setLanguage,
    theme,
    setTheme,
    currentUser,
    setIsAuthOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [installedPWA, setInstalledPWA] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalledPWA(true);
      }
      setInstallPrompt(null);
    } else {
      alert(
        language === 'ar'
          ? 'لتثبيت التطبيق على جهازك: اضغط على قائمة المتصفح ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".'
          : 'To install the app: Click your browser menu and select "Install app" or "Add to Home screen".'
      );
    }
  };

  const navLinks: { id: PageId; labelAr: string; labelEn: string; labelFr: string; icon: any }[] = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', labelFr: 'Accueil', icon: Compass },
    { id: 'reciters', labelAr: 'القراء', labelEn: 'Reciters', labelFr: 'Récitateurs', icon: Users },
    { id: 'mushaf', labelAr: 'المصحف', labelEn: 'Quran', labelFr: 'Coran', icon: BookOpen },
    { id: 'tafsir', labelAr: 'التفسير', labelEn: 'Tafsir', labelFr: 'Tafsir', icon: Book },
    { id: 'memorize', labelAr: 'التحفيظ', labelEn: 'Memorize', labelFr: 'Mémorisation', icon: Award },
    { id: 'tajweed', labelAr: 'التجويد', labelEn: 'Tajweed', labelFr: 'Tadjwid', icon: Layers },
    { id: 'adhkar', labelAr: 'الأذكار', labelEn: 'Adhkar', labelFr: 'Adhkar', icon: Heart },
    { id: 'khatma', labelAr: 'الختمة', labelEn: 'Khatma', labelFr: 'Khatma', icon: CheckCircle2 },
    { id: 'ai', labelAr: 'المساعد الذكي', labelEn: 'AI Assistant', labelFr: 'IA Coranique', icon: Sparkles },
    { id: 'admin', labelAr: 'الإدارة', labelEn: 'Admin', labelFr: 'Admin', icon: Shield },
  ];

  const getLabel = (link: typeof navLinks[0]) => {
    if (language === 'fr') return link.labelFr;
    if (language === 'en') return link.labelEn;
    return link.labelAr;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#03231c]/95 backdrop-blur-md border-b border-amber-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition shrink-0">
              <div className="w-full h-full bg-[#03231c] rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="flex flex-col shrink-0 whitespace-nowrap">
              <span className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300 bg-clip-text text-transparent">
                Quran Reciters PRO
              </span>
              <span className="text-[10px] sm:text-xs text-emerald-300/80 font-medium tracking-wide">
                Listen • Read • Learn • Memorize
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = currentPage === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentPage(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'text-amber-300 bg-emerald-900/60 shadow-inner border-b-2 border-amber-400'
                      : 'text-emerald-100/90 hover:text-amber-200 hover:bg-emerald-800/30'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-emerald-300/70'}`} />
                  <span>{getLabel(link)}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Language, PWA Install, Theme & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* PWA Install Button */}
            {!installedPWA && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition"
                title={language === 'ar' ? 'تثبيت التطبيق' : 'Install PWA'}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تثبيت التطبيق' : 'Install App'}</span>
              </button>
            )}

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-100 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/40 rounded-lg transition"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'ar' ? 'العربية' : language === 'fr' ? 'Français' : 'English'}
                </span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[#021f19] border border-amber-500/30 rounded-lg shadow-xl py-1 z-50">
                  <button
                    onClick={() => {
                      setLanguage('ar');
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 text-xs font-medium hover:bg-emerald-800/40 flex items-center justify-between ${
                      language === 'ar' ? 'text-amber-400 font-bold' : 'text-emerald-100'
                    }`}
                  >
                    <span>العربية</span>
                    <span>🇸🇦</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-emerald-800/40 flex items-center justify-between ${
                      language === 'en' ? 'text-amber-400 font-bold' : 'text-emerald-100'
                    }`}
                  >
                    <span>English</span>
                    <span>🇬🇧</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('fr');
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-emerald-800/40 flex items-center justify-between ${
                      language === 'fr' ? 'text-amber-400 font-bold' : 'text-emerald-100'
                    }`}
                  >
                    <span>Français</span>
                    <span>🇫🇷</span>
                  </button>
                </div>
              )}
            </div>

            {/* Theme Switcher */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2 text-emerald-200 hover:text-amber-300 bg-emerald-950/60 border border-emerald-700/40 rounded-lg transition"
                title="Theme"
              >
                {theme === 'mushaf' ? (
                  <Book className="w-4 h-4 text-amber-400" />
                ) : theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-indigo-300" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-300" />
                )}
              </button>
              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#021f19] border border-amber-500/30 rounded-lg shadow-xl py-1 z-50 text-xs">
                  <button
                    onClick={() => {
                      setTheme('emerald');
                      setThemeMenuOpen(false);
                    }}
                    className="w-full text-right px-3 py-1.5 text-emerald-100 hover:bg-emerald-800/40 flex items-center gap-2"
                  >
                    <span className="w-3 h-3 rounded-full bg-emerald-600 border border-amber-400"></span>
                    <span>الوضع الزمردي</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme('mushaf');
                      setThemeMenuOpen(false);
                    }}
                    className="w-full text-right px-3 py-1.5 text-emerald-100 hover:bg-emerald-800/40 flex items-center gap-2"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#fbf5e6] border border-amber-500"></span>
                    <span>وضع المصحف (كريم)</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme('dark');
                      setThemeMenuOpen(false);
                    }}
                    className="w-full text-right px-3 py-1.5 text-emerald-100 hover:bg-emerald-800/40 flex items-center gap-2"
                  >
                    <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-600"></span>
                    <span>الوضع الليلي الداكن</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Auth Buttons */}
            {currentUser ? (
              <div
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-900/60 border border-amber-500/40 rounded-xl cursor-pointer hover:bg-emerald-800/70 transition"
              >
                <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center font-bold text-emerald-950 text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-amber-200">{currentUser.name}</span>
                  <span className="text-[10px] text-emerald-300">{currentUser.role === 'admin' ? 'مدير النظام' : 'عضو'}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-bold text-emerald-100 hover:text-amber-200 bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-600/40 rounded-lg transition"
                >
                  {language === 'ar' ? 'دخول' : 'Login'}
                </button>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-4 py-1.5 text-xs font-extrabold text-emerald-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-600 rounded-lg shadow-md shadow-amber-500/20 transition hover:scale-105"
                >
                  {language === 'ar' ? 'تسجيل' : 'Register'}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="p-2 text-amber-300 hover:text-amber-100"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-emerald-200 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#021f19] border-b border-amber-500/30 px-4 pt-2 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-emerald-800/40">
            {navLinks.map((link) => {
              const active = currentPage === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentPage(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold ${
                    active
                      ? 'text-amber-300 bg-emerald-900/80 border border-amber-500/40'
                      : 'text-emerald-100 bg-emerald-950/40'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{getLabel(link)}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile footer items */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : language === 'en' ? 'fr' : 'ar')}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-900/60 border border-emerald-700/50 rounded-lg text-emerald-100"
              >
                🌐 {language === 'ar' ? 'العربية' : language === 'en' ? 'English' : 'Français'}
              </button>
              <button
                onClick={handleInstallClick}
                className="px-3 py-1.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تثبيت PWA</span>
              </button>
            </div>
            <button
              onClick={() => {
                setIsAuthOpen(true);
                setMobileMenuOpen(false);
              }}
              className="px-4 py-1.5 text-xs font-bold text-emerald-950 bg-amber-400 rounded-lg"
            >
              {currentUser ? currentUser.name : 'دخول / حساب'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

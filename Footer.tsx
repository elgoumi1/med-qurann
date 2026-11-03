import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Heart, Shield, Globe, Download, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, language } = useApp();

  return (
    <footer className="w-full bg-[#021813] border-t border-amber-500/20 pt-12 pb-24 text-emerald-300 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-700 p-0.5 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-950 fill-current" />
              </div>
              <span className="text-base font-bold text-amber-300 font-quran">
                Quran Reciters PRO
              </span>
            </div>
            <p className="text-xs text-emerald-400/80 leading-relaxed">
              منصة قرآنية رقمية شاملة للاستماع لتلاوات كبار القراء، قراءة المصحف الشريف، تدبر التفسير، نظام الحفظ والمراجعة، وأكاديمية التجويد.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-[11px] text-amber-300 font-bold">
              <span>وقف لوجه الله تعالى • 100% Free</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-amber-300">أقسام المنصة</h4>
            <ul className="space-y-1.5 text-xs text-emerald-200">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-amber-300 transition">
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('reciters')} className="hover:text-amber-300 transition">
                  مكتبة القراء (14 قارئاً معتمداً)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('mushaf')} className="hover:text-amber-300 transition">
                  المصحف الرقمي وتفسير الآيات
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('live')} className="hover:text-amber-300 transition">
                  التلاوة الحية والتفاعلية
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('memorize')} className="hover:text-amber-300 transition">
                  نظام التحفيظ والتكرار
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Educational and Daily */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-amber-300">التعليم والأذكار</h4>
            <ul className="space-y-1.5 text-xs text-emerald-200">
              <li>
                <button onClick={() => setCurrentPage('tajweed')} className="hover:text-amber-300 transition">
                  أكاديمية التجويد والاختبارات
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('adhkar')} className="hover:text-amber-300 transition">
                  الأذكار اليومية ومواقيت الصلاة
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('khatma')} className="hover:text-amber-300 transition">
                  متابعة ختمة القرآن الكريم
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('ai')} className="hover:text-amber-300 transition">
                  المساعد القرآني الذكي (AI)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('admin')} className="hover:text-amber-300 transition">
                  لوحة الإدارة الشاملة
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Authenticity & Accreditation */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-amber-300">المصادر والاعتماد</h4>
            <p className="text-xs text-emerald-400/80 leading-relaxed">
              جميع نصوص القرآن الكريم برسم المصحف العثماني مأخوذة من مجمع الملك فهد لطباعة المصحف الشريف. والتسجيلات الصوتية مستضافة على خوادم EveryAyah و mp3quran الموثقة.
            </p>
            <div className="pt-2 text-[11px] text-emerald-500">
              لا تجمع المنصة أي بيانات سرية أو بطاقات مصرفية.
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-emerald-400/70">
          <p>© {new Date().getFullYear()} Quran Reciters PRO. جميع الحقوق محفوظة لكل مسلم ومسلمة.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-amber-300 cursor-pointer">سياسة الخصوصية</span>
            <span>•</span>
            <span className="hover:text-amber-300 cursor-pointer">شروط الاستخدام</span>
            <span>•</span>
            <span className="hover:text-amber-300 cursor-pointer">اتصل بنا</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

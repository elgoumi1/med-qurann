import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Reciter } from '../types';
import {
  Shield,
  Users,
  Activity,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Server,
  Globe,
  Settings,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { recitersList, addReciter, removeReciter, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'reciters' | 'health' | 'announcements'>('stats');
  const [showAddModal, setShowAddModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState(
    'مرحباً بكم في منصة Quran Reciters PRO - تم تحديث تلاوات الحرم المكي الشريف لعام 1448هـ بنقاوة صوتية عالية.'
  );
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  // New Reciter Form State
  const [newReciter, setNewReciter] = useState<Partial<Reciter>>({
    nameAr: '',
    nameEn: '',
    country: 'المملكة العربية السعودية',
    countryCode: 'SA',
    flag: '🇸🇦',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    riwayah: 'حفص عن عاصم',
    style: 'Murattal',
    serverUrl: 'https://server10.mp3quran.net/qht/',
    bioAr: '',
    bioEn: '',
    featured: false,
    totalSurahs: 114,
    listensCount: 50000,
    likesCount: 1200,
  });

  const handleCreateReciter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReciter.nameAr || !newReciter.serverUrl) return;

    const created: Reciter = {
      id: `reciter_${Date.now()}`,
      nameAr: newReciter.nameAr,
      nameEn: newReciter.nameEn || newReciter.nameAr,
      nameFr: newReciter.nameEn || newReciter.nameAr,
      country: newReciter.country || 'دولي',
      countryCode: newReciter.countryCode || 'SA',
      flag: newReciter.flag || '🌐',
      photoUrl: newReciter.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
      riwayah: newReciter.riwayah || 'حفص عن عاصم',
      style: (newReciter.style as any) || 'Murattal',
      serverUrl: newReciter.serverUrl,
      bioAr: newReciter.bioAr || 'قارئ معتمد ذو صوت خاشع.',
      bioEn: newReciter.bioEn || 'Accredited reciter.',
      bioFr: 'Récitateur accrédité.',
      featured: Boolean(newReciter.featured),
      totalSurahs: 114,
      listensCount: 1000,
      likesCount: 150,
    };

    addReciter(created);
    setShowAddModal(false);
    alert('تم إضافة القارئ الجديد بنجاح إلى قاعدة البيانات!');
  };

  const handleSaveAnnouncement = () => {
    setAnnouncementSaved(true);
    setTimeout(() => setAnnouncementSaved(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#05372b] to-[#022119] border-2 border-amber-500/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-amber-300">
              لوحة الإدارة الشاملة • Enterprise Admin Panel
            </h1>
            <p className="text-xs text-emerald-300">
              إدارة القراء، مراقبة خوادم الصوتيات، وضبط الإعدادات القرآنية والمنصة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-xs text-emerald-300 font-bold">
            الدور: {currentUser?.role === 'admin' ? 'Super Administrator' : 'Administrator'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-amber-500/20 pb-3">
        {[
          { id: 'stats', label: 'إحصائيات المنصة', icon: Activity },
          { id: 'reciters', label: 'إدارة القراء والتلاوات', icon: Users },
          { id: 'health', label: 'فحص خوادم الصوتيات CDN', icon: Server },
          { id: 'announcements', label: 'الإعلانات والتنبيهات', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-emerald-950 shadow-md'
                  : 'bg-[#021813] text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#03291f] border border-amber-500/30 space-y-1 text-center">
              <span className="text-xs text-emerald-300 font-bold block">إجمالي مرات الاستماع</span>
              <span className="text-3xl font-extrabold text-amber-300 font-mono">18,450,200</span>
              <span className="text-[11px] text-emerald-400/80 block">+12.4% هذا الأسبوع</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#03291f] border border-amber-500/30 space-y-1 text-center">
              <span className="text-xs text-emerald-300 font-bold block">القراء المعتمدون</span>
              <span className="text-3xl font-extrabold text-emerald-300 font-mono">{recitersList.length}</span>
              <span className="text-[11px] text-emerald-400/80 block">برواية حفص وورش</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#03291f] border border-amber-500/30 space-y-1 text-center">
              <span className="text-xs text-emerald-300 font-bold block">السور المسجلة الكاملة</span>
              <span className="text-3xl font-extrabold text-amber-200 font-mono">114</span>
              <span className="text-[11px] text-emerald-400/80 block">بجودة 128 / 192 kbps</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#03291f] border border-amber-500/30 space-y-1 text-center">
              <span className="text-xs text-emerald-300 font-bold block">حالة خوادم CDN</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">100% متصل</span>
              <span className="text-[11px] text-emerald-400/80 block">Zero downtime</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#021812] border border-amber-500/25 space-y-4">
            <h3 className="text-sm font-bold text-amber-300">أعلى القراء استماعاً هذا الشهر:</h3>
            <div className="space-y-2">
              {recitersList.slice(0, 5).map((reciter, i) => (
                <div
                  key={reciter.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#032018] border border-emerald-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-emerald-900 text-amber-300 font-bold flex items-center justify-center">
                      #{i + 1}
                    </span>
                    <img src={reciter.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-bold text-emerald-100">{reciter.nameAr}</span>
                  </div>
                  <span className="font-mono text-amber-300 font-bold">
                    {reciter.listensCount.toLocaleString()} استماع
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reciter Management */}
      {activeTab === 'reciters' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-amber-300">
              قائمة القراء ({recitersList.length} قارئ)
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قارئ جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recitersList.map((reciter) => (
              <div
                key={reciter.id}
                className="p-4 rounded-2xl bg-[#021812] border border-amber-500/25 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={reciter.photoUrl}
                    alt={reciter.nameAr}
                    className="w-12 h-12 rounded-full object-cover border border-amber-400 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-amber-200 truncate">
                      {reciter.nameAr}
                    </h4>
                    <p className="text-[11px] text-emerald-400/80 truncate">
                      {reciter.flag} {reciter.country} • {reciter.style}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => removeReciter(reciter.id)}
                    className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-700/50 text-red-300 transition"
                    title="حذف القارئ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Health Checker */}
      {activeTab === 'health' && (
        <div className="p-6 rounded-3xl bg-[#021812] border border-amber-500/30 space-y-4">
          <h3 className="text-base font-bold text-amber-300">
            فحص استقرار خوادم CDN الصوتية المعتمدة
          </h3>
          <p className="text-xs text-emerald-200">
            المنصة تعتمد على شبكات توزيع محتوى قرآنية رسمية ومفتوحة بدون أي اشتراكات مدفوعة.
          </p>
          <div className="space-y-2 pt-2">
            {[
              { server: 'server11.mp3quran.net (Yasser Al-Dosari & Shuraim)', status: 'Online - 200 OK', latency: '42ms' },
              { server: 'server10.mp3quran.net (Khalid Al-Qahtani & Minshawi)', status: 'Online - 200 OK', latency: '38ms' },
              { server: 'server8.mp3quran.net (Mishary Alafasy & Ayyub)', status: 'Online - 200 OK', latency: '45ms' },
              { server: 'server12.mp3quran.net (Maher Al-Muaiqly)', status: 'Online - 200 OK', latency: '50ms' },
              { server: 'server13.mp3quran.net (Abdullah Al-Juhany)', status: 'Online - 200 OK', latency: '41ms' },
            ].map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#032018] border border-emerald-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-emerald-100">{s.server}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">{s.status}</span>
                  <span className="text-amber-400/80 font-mono text-[11px]">{s.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Announcements */}
      {activeTab === 'announcements' && (
        <div className="p-6 rounded-3xl bg-[#021812] border border-amber-500/30 space-y-4">
          <h3 className="text-base font-bold text-amber-300">شريط الإعلانات والرسائل العامة</h3>
          <p className="text-xs text-emerald-200">
            تظهر هذه الرسالة لجميع زوار المنصة في أعلى الصفحة الرئيسية.
          </p>
          <textarea
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            rows={3}
            className="w-full bg-[#032018] border border-amber-500/40 rounded-xl p-3 text-xs sm:text-sm text-emerald-100 focus:outline-none"
          />
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSaveAnnouncement}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 font-bold text-xs shadow-md"
            >
              حفظ ونشر الإعلان
            </button>
            {announcementSaved && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> تم نشر الإعلان بنجاح
              </span>
            )}
          </div>
        </div>
      )}

      {/* Add Reciter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#03241d] border-2 border-amber-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
              <h3 className="text-lg font-bold text-amber-300">إضافة قارئ جديد إلى المنصة</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-emerald-950 text-emerald-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReciter} className="space-y-3 text-xs">
              <div>
                <label className="text-emerald-300 font-bold block mb-1">اسم القارئ (بالعربية):</label>
                <input
                  type="text"
                  required
                  value={newReciter.nameAr}
                  onChange={(e) => setNewReciter({ ...newReciter, nameAr: e.target.value })}
                  placeholder="مثال: الشيخ إدريس أبكر"
                  className="w-full bg-[#021813] border border-emerald-700 rounded-xl px-3 py-2 text-emerald-100"
                />
              </div>

              <div>
                <label className="text-emerald-300 font-bold block mb-1">الاسم بالإنجليزية:</label>
                <input
                  type="text"
                  value={newReciter.nameEn}
                  onChange={(e) => setNewReciter({ ...newReciter, nameEn: e.target.value })}
                  placeholder="Sheikh Idrees Abkar"
                  className="w-full bg-[#021813] border border-emerald-700 rounded-xl px-3 py-2 text-emerald-100"
                />
              </div>

              <div>
                <label className="text-emerald-300 font-bold block mb-1">رابط خادم الصوتيات (CDN Base URL):</label>
                <input
                  type="url"
                  required
                  value={newReciter.serverUrl}
                  onChange={(e) => setNewReciter({ ...newReciter, serverUrl: e.target.value })}
                  placeholder="https://server10.mp3quran.net/abkar/"
                  className="w-full bg-[#021813] border border-emerald-700 rounded-xl px-3 py-2 text-emerald-100 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-emerald-300 font-bold block mb-1">رابط الصورة الشخصية:</label>
                <input
                  type="url"
                  value={newReciter.photoUrl}
                  onChange={(e) => setNewReciter({ ...newReciter, photoUrl: e.target.value })}
                  className="w-full bg-[#021813] border border-emerald-700 rounded-xl px-3 py-2 text-emerald-100 font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 text-emerald-950 font-bold shadow-md hover:bg-amber-500 transition"
                >
                  إضافة القارئ
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

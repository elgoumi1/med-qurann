import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, User, Lock, Mail, CheckCircle2, Heart } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, currentUser, setCurrentUser, language } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userRole = isAdminLogin ? 'admin' : 'user';
    const userName = name.trim() || (email.split('@')[0] || (isAdminLogin ? 'مدير المنصة' : 'مستخدم قرآني'));
    const userObj = {
      name: userName,
      email: email.trim() || 'user@quranreciterspro.org',
      role: userRole as any,
    };
    setCurrentUser(userObj);
    localStorage.setItem('quran_user', JSON.stringify(userObj));
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('quran_user');
    setIsAuthOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#03231c] border-2 border-amber-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-5 left-5 w-8 h-8 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-200 flex items-center justify-center hover:bg-emerald-800"
        >
          ✕
        </button>

        {currentUser ? (
          /* Profile & Logout View */
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-emerald-950 font-black text-2xl mx-auto flex items-center justify-center shadow-lg">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-300 font-quran">{currentUser.name}</h3>
              <p className="text-xs text-emerald-300">{currentUser.email}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-950 text-amber-400 text-xs font-bold border border-emerald-700">
                {currentUser.role === 'admin' ? '🛡️ مدير النظام المعتمد' : 'قارئ ومتدبر'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#021812] border border-amber-500/20 text-xs text-emerald-200 text-right space-y-1">
              <p>✓ المزامنة السحابية للآيات المحفوظة مفعلة</p>
              <p>✓ حفظ المفضلة وقوائم التشغيل الشخصية</p>
              <p>✓ متابعة ختمات القرآن الكريم</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-bold transition"
            >
              تسجيل الخروج
            </button>
          </div>
        ) : (
          /* Login / Register Form */
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-amber-300 font-quran">
                {mode === 'login' ? 'تسجيل الدخول إلى حسابك' : 'إنشاء حساب جديد'}
              </h3>
              <p className="text-xs text-emerald-200/80">
                المنصة مجانية 100% ولا تتطلب أي اشتراك أو بطاقة بنكية.
              </p>
            </div>

            {/* Mode Tabs */}
            <div className="flex bg-[#021812] p-1 rounded-xl border border-emerald-800">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  mode === 'login' ? 'bg-amber-400 text-emerald-950' : 'text-emerald-300'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  mode === 'register' ? 'bg-amber-400 text-emerald-950' : 'text-emerald-300'
                }`}
              >
                حساب جديد
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {mode === 'register' && (
                <div>
                  <label className="text-emerald-300 font-bold block mb-1">الاسم الكامل:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: محمد أحمد"
                    className="w-full bg-[#021813] border border-emerald-700 rounded-xl px-3 py-2 text-emerald-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="text-emerald-300 font-bold block mb-1">البريد الإلكتروني:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#021813] border border-emerald-700 rounded-xl px-3 py-2 text-emerald-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-emerald-300 font-bold block mb-1">كلمة المرور:</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#021813] border border-emerald-700 rounded-xl px-3 py-2 text-emerald-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Super Admin Checkbox Toggle */}
              <div className="flex items-center gap-2 pt-1 text-emerald-300 cursor-pointer">
                <input
                  type="checkbox"
                  id="adminCheckbox"
                  checked={isAdminLogin}
                  onChange={(e) => setIsAdminLogin(e.target.checked)}
                  className="rounded accent-amber-400"
                />
                <label htmlFor="adminCheckbox" className="cursor-pointer text-[11px]">
                  الدخول كمدير منصة (Admin Access)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 font-extrabold text-xs shadow-md hover:scale-102 transition mt-2 cursor-pointer"
              >
                {mode === 'login' ? 'دخول' : 'إنشاء الحساب مجاناً'}
              </button>

              <button
                type="button"
                onClick={() => setIsAuthOpen(false)}
                className="w-full py-2 text-[11px] text-emerald-400 hover:text-amber-300 transition"
              >
                المتابعة كزائر (بدون تسجيل)
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { 
  Loader2, 
  ArrowRight, 
  Mail, 
  Lock, 
  AlertCircle, 
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff
} from 'lucide-react';

const LOGO_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMjAgMTAwIj4KICA8dGV4dCB4PSI1IiB5PSI3NSIgZmlsbD0iIzE0QjhBNiIgZm9udC1mYW1pbHk9IlBsdXMgSmFrYXJ0YSBTYW5zLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iODAwIiBmb250LXNpemU9IjcwIj5aaWU8L3RleHQ+CiAgPHJlY3QgeD0iMTE1IiB5PSIxNSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSI3NSIgZmlsbD0iIzE0QjhBNiIgLz4KICA8dGV4dCB4PSIxMjUiIHk4Ijc1IiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IlBsdXMgSmFrYXJ0YSBTYW5zLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iODAwIiBmb250LXNpemU9IjcwIj5BZHMuPC90ZXh0Pgo8L3N2Zz4=";

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    
    // 1. ADMIN OVERRIDE (Hardcoded for Developer Access)
    if (cleanEmail === 'admin@zieads.com' && password === 'asikasikjos14') {
      try {
        localStorage.setItem('zieads_admin_bypass', 'true');
        // Ensure standard Supabase session is gone to avoid interference
        await supabase.auth.signOut();
        // Redirect to root and reload to trigger bypass logic in App.tsx
        window.location.hash = '#/';
        window.location.reload();
        return;
      } catch (err) {
        setError('Device block: Storage is disabled or private.');
        setLoading(false);
        return;
      }
    }

    // 2. STANDARD AUTH
    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ 
          email: cleanEmail, 
          password 
        });
        if (signInError) throw signInError;
        window.location.hash = '#/';
        window.location.reload();
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ 
          email: cleanEmail, 
          password 
        });
        if (signUpError) throw signUpError;
        alert('Security verification sent to your email.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'System Access Denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 flex flex-col items-center justify-center p-6 font-sans transition-colors">
      <button 
        onClick={onBack}
        className="fixed top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm uppercase tracking-widest transition-all group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center text-center space-y-4">
          <img src={LOGO_URL} alt="ZieAds Logo" className="h-14 w-auto object-contain" />
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
              {isLogin ? 'Network Access' : 'Create Node'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {isLogin ? 'Sign in to access your command center' : 'Begin your journey with ZieAds'}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex gap-3 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={20} className="shrink-0" />
                <p className="font-bold">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Identity Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full h-14 pl-14 pr-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-950 focus:border-primary outline-none font-bold text-slate-900 dark:text-white transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Access Key</label>
                  {isLogin && <button type="button" className="text-[11px] font-black text-primary hover:underline">Reset</button>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full h-14 pl-14 pr-12 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-950 focus:border-primary outline-none font-bold text-slate-900 dark:text-white transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 tosca-bg text-white font-black text-lg rounded-2xl shadow-xl shadow-teal-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><span className="uppercase tracking-widest">{isLogin ? 'Enter Dashboard' : 'Deploy Account'}</span><ArrowRight size={20} /></>}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {isLogin ? "No account yet?" : "Have an account?"}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-bold hover:underline transition-all">
              {isLogin ? "Join ZieAds" : "Sign in now"}
            </button>
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500" /> AES-256 SECURE</div>
          <div className="w-1 h-1 rounded-full bg-slate-200"></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500" /> SSL ENCRYPTED</div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

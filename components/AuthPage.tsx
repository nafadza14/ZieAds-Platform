
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { 
  Loader2, 
  ArrowRight, 
  Mail, 
  Lock, 
  AlertCircle, 
  CheckCircle2,
  Github,
  Chrome,
  ChevronLeft,
  Eye,
  EyeOff
} from 'lucide-react';

const LOGO_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgNTAiPgogIDxyZWN0IHg9IjYwIiB5PSI1IiB3aWR0aD0iOTUiIGhlaWdodD0iNDAiIGZpbGw9IiMxNEI4QTYiLz4KICA8dGV4dCB4PSIwIiB5PSIzOCIgZmlsbD0iIzE0QjhBNiIgc3R5bGU9ImZvbnQ6Ym9sZCAzOHB4ICdQbHVzIEpha2FydGEgU2FucycsIHNhbnMtc2VyaWYiPlppZTwvdGV4dD4KICA8dGV4dCB4PSI2NSIgeT0iMzgiIGZpbGw9IiNmZmZmZmYiIHN0eWxlPSJmb250OmJvbGQgMzhweCAnUGx1cyBKYWthcnRhIFNhbnMnLCBzYW5zLXNlcmlmIj5BZHMuPC90ZXh0Pgo8L3N2Zz4=";

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
    
    // 1. Super Admin Hardcoded Bypass - Updated Email
    if (cleanEmail === 'admin@zieads.com' && password === 'asikasikjos14') {
      try {
        localStorage.setItem('zieads_admin_bypass', 'true');
        // Ensure state persists before navigation
        setTimeout(() => {
          window.location.href = '#/'; 
          window.location.reload();
        }, 100);
        return;
      } catch (err) {
        setError('Storage error. Please allow local storage.');
        setLoading(false);
        return;
      }
    }

    // 2. Standard Auth Flow
    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ 
          email: cleanEmail, 
          password 
        });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ 
          email: cleanEmail, 
          password 
        });
        if (signUpError) throw signUpError;
        alert('Check your inbox for a verification email!');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
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
              {isLogin ? 'Welcome back' : 'Join ZieAds'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {isLogin ? 'Enter your details to manage your ads' : 'Start your free trial today'}
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
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Email address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type="email"
                    placeholder="Enter Your Email Address"
                    className="w-full h-14 pl-14 pr-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-950 focus:border-primary outline-none font-bold text-slate-900 dark:text-white transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                  {isLogin && <button type="button" className="text-[11px] font-black text-primary hover:underline transition-all">Forgot?</button>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter Your Password"
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
              {loading ? <Loader2 className="animate-spin" /> : <><span className="uppercase tracking-widest">{isLogin ? 'Sign in' : 'Create account'}</span><ArrowRight size={20} /></>}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-bold hover:underline transition-all">
              {isLogin ? "Join for free" : "Log in now"}
            </button>
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500" /> SSL SECURE</div>
          <div className="w-1 h-1 rounded-full bg-slate-200"></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500" /> GDPR READY</div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

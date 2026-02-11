
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { 
  Target, 
  Loader2, 
  ArrowRight, 
  Mail, 
  Lock, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2,
  Github,
  Chrome
} from 'lucide-react';

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Verification email sent! Please check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Brand Side (Visible on desktop) */}
      <div className="hidden lg:flex lg:w-1/2 tosca-gradient relative p-16 flex-col justify-between overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-white/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] left-[-15%] w-[700px] h-[700px] bg-teal-300/10 blur-[150px] rounded-full"></div>
        
        <div className="relative z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-primary">
              <Target size={24} fill="currentColor" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white font-display">ZieAds</span>
          </button>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-6xl font-black text-white leading-tight font-display tracking-tighter mb-8">
            The simplest way to scale your advertising.
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-teal-200 shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">AI-Powered Creation</p>
                <p className="text-teal-50/70 text-sm">Launch high-converting ads in under 5 minutes.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-teal-200 shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">Fraud Protection</p>
                <p className="text-teal-50/70 text-sm">Save up to 20% on wasted spend automatically.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-white/50 text-[11px] font-black uppercase tracking-[0.3em] font-display">
          <span>SOC2 Ready</span>
          <div className="w-1 h-1 rounded-full bg-white/20"></div>
          <span>GDPR Compliant</span>
        </div>
      </div>

      {/* Auth Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-8 left-8">
          <button onClick={onBack} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl tosca-bg flex items-center justify-center text-white">
              <Target size={20} fill="currentColor" />
            </div>
            <span className="text-2xl font-black text-slate-900 font-display">ZieAds</span>
          </button>
        </div>

        <div className="w-full max-w-[420px] space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-4xl font-black text-[#0F172A] font-display tracking-tight leading-tight">
              {isLogin ? 'Welcome back' : 'Get started for free'}
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              {isLogin 
                ? 'Glad to see you again! Please enter your details.' 
                : 'Join over 10,000+ businesses growing with AI.'}
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.1)] border border-slate-100">
            {/* Social Logins - standard for pro SaaS */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <button className="flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors group">
                <Chrome size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest font-display">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors group">
                <Github size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest font-display">Github</span>
              </button>
            </div>

            <div className="relative mb-10 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Or with email</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-600 text-sm animate-in slide-in-from-top-2">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="font-bold leading-snug">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 font-display">
                    Email address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                      type="email"
                      placeholder="name@company.com"
                      className="w-full h-14 pl-14 pr-6 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-medium text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] font-display">
                      Password
                    </label>
                    {isLogin && (
                      <button type="button" className="text-[10px] font-black text-primary hover:underline uppercase tracking-wider font-display">
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="w-full h-14 pl-14 pr-6 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none text-slate-900 font-bold placeholder:text-slate-300 text-base"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 tosca-bg text-white font-black text-lg rounded-2xl shadow-xl shadow-teal-500/20 hover:shadow-teal-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 font-display mt-8"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    {isLogin ? 'Sign in' : 'Create account'}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Alternative Auth Mode */}
          <div className="text-center">
            <p className="text-slate-500 font-medium">
              {isLogin ? "New to ZieAds?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="ml-2 tosca-text font-black hover:underline font-display tracking-tight text-base"
              >
                {isLogin ? 'Start free 14-day trial' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

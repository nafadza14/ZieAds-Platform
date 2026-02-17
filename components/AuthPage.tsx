
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { 
  Loader2, 
  ArrowRight, 
  Mail, 
  Lock, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Layout,
  Zap,
  Sparkles,
  Layers,
  Globe,
  CheckCircle2
} from 'lucide-react';

const LOGO_MARK = (
  <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#7C5CFF"/>
    <path d="M12 12H28L12 28H28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
    
    // 1. ADMIN OVERRIDE
    if (cleanEmail === 'admin@zieads.com' && password === 'asikasikjos14') {
      try {
        localStorage.setItem('zieads_admin_bypass', 'true');
        // Force state update by triggering hash change
        window.location.hash = '#/';
        // Small timeout to ensure storage is committed before state check in App.tsx
        setTimeout(() => window.location.reload(), 100);
        return;
      } catch (err) {
        setError('Local storage access denied.');
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
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ 
          email: cleanEmail, 
          password 
        });
        if (signUpError) throw signUpError;
        alert('Verification link dispatched. Check your inbox.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans selection:bg-accent/10">
      
      {/* Left Column: Form Section */}
      <div className="w-full md:w-[45%] flex flex-col p-8 md:p-16 lg:p-24 relative bg-white">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all mb-12 self-start"
        >
          {LOGO_MARK}
          <span className="font-display font-bold text-lg text-slate-900">ZieAds</span>
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">Welcome</h1>
            <p className="text-slate-500 font-medium">Log in to ZieAds Command</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 text-xs animate-in shake duration-300">
                <AlertCircle size={16} className="shrink-0" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5 relative group">
                <label className="text-[11px] font-bold text-accent font-sans uppercase tracking-wider ml-1">Email address *</label>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full h-14 px-4 rounded-xl border border-slate-200 bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none font-medium text-slate-900 transition-all placeholder:text-slate-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>

              <div className="space-y-1.5 relative group">
                <label className="text-[11px] font-bold text-slate-500 font-sans uppercase tracking-wider ml-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full h-14 px-4 rounded-xl border border-slate-200 bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none font-medium text-slate-900 transition-all placeholder:text-slate-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button className="text-accent text-[13px] font-bold hover:underline transition-all">Forgot password?</button>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#4A268A] text-white font-bold rounded-xl shadow-xl hover:bg-[#3D1F72] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Continue'}
            </button>
          </form>

          <div className="pt-4 text-center">
             <p className="text-slate-400 text-xs font-medium">
               By continuing, you agree to ZieAds's <a href="#" className="text-accent hover:underline">Terms of Service</a> and <a href="#" className="text-accent hover:underline">Privacy Policy</a>.
             </p>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Section */}
      <div className="hidden md:flex md:w-[55%] bg-[#F3E8FF] relative overflow-hidden flex-col justify-center p-16 lg:p-24">
        {/* Mock UI Elements Decoration */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           <div className="absolute top-20 right-10 w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 animate-float">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <Zap className="text-accent" size={16} />
                    <span className="text-xs font-bold text-slate-900">Automation</span>
                 </div>
                 <div className="w-8 h-4 bg-accent/20 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-accent rounded-full"></div></div>
              </div>
              <div className="space-y-3">
                 <div className="h-2 bg-slate-100 rounded w-full"></div>
                 <div className="h-2 bg-slate-100 rounded w-2/3"></div>
              </div>
           </div>

           <div className="absolute bottom-20 left-10 w-[300px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 animate-float-delayed">
              <div className="flex items-center gap-2 mb-4">
                 <Layers className="text-teal-500" size={16} />
                 <span className="text-xs font-bold text-slate-900">Cross-channel</span>
              </div>
              <div className="flex gap-2">
                 {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-50 border border-slate-100"></div>)}
              </div>
           </div>

           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] opacity-10">
              <Globe size={500} className="text-accent" />
           </div>
        </div>

        <div className="relative z-10 space-y-12">
           <h2 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] font-display">
             Transforming the <br/>
             <span className="text-accent">advertising experience</span>
           </h2>

           <div className="space-y-10 max-w-xl">
              <FeatureItem 
                icon={<Layout className="text-accent" />} 
                title="Scale seamlessly across platforms" 
                desc="Launch and manage campaigns on Facebook, Instagram, TikTok, and more—all from a single, unified dashboard." 
              />
              <FeatureItem 
                icon={<Sparkles className="text-accent" />} 
                title="Elevate creative performance" 
                desc="Build data-driven, on-brand ads in minutes with dynamic templates, real-time previews, and automated creative updates." 
              />
              <FeatureItem 
                icon={<CheckCircle2 className="text-accent" />} 
                title="Collaborate effortlessly" 
                desc="Streamline team workflows with flexible permissions, built-in approvals, and shared asset libraries—no more juggling tools." 
              />
           </div>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; animation-delay: 1s; }
      `}</style>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex gap-6 items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="w-12 h-12 shrink-0 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-accent/5">
      {icon}
    </div>
    <div className="space-y-1">
      <h3 className="text-lg font-bold text-slate-900 font-display">{title}</h3>
      <p className="text-slate-600 font-medium text-[15px] leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default AuthPage;

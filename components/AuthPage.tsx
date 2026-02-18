
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { 
  Loader2, 
  Mail, 
  AlertCircle, 
  ChevronLeft,
  Eye,
  EyeOff,
  Sparkles,
  Users,
  Layers,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Aliasing motion components to bypass broken TypeScript definitions in this environment
const MotionDiv = (motion as any).div;

// Custom SVG Icons for Socials
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

interface AuthPageProps {
  onBack: () => void;
}

type AuthView = 'login' | 'signup';

const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const [view, setView] = useState<AuthView>('login');
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
    
    // Admin Override
    if (cleanEmail === 'admin@zieads.com' && password === 'asikasikjos14') {
      localStorage.setItem('zieads_admin_bypass', 'true');
      window.location.hash = '#/';
      setTimeout(() => window.location.reload(), 100);
      return;
    }

    try {
      let result;
      if (view === 'login') {
        result = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      } else {
        result = await supabase.auth.signUp({ email: cleanEmail, password });
      }

      if (result.error) throw result.error;
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col md:flex-row font-sans selection:bg-[#8B5CF6]/30 overflow-hidden">
      
      {/* LEFT SIDE - FORM */}
      <MotionDiv 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 md:flex-[0.45] bg-[#0F172A] p-8 md:p-12 flex flex-col relative z-10"
      >
        <div 
          className="flex items-center gap-2 mb-12 cursor-pointer group w-fit"
          onClick={onBack}
        >
          <div className="w-8 h-8 rounded-lg bg-[#8B5CF6] flex items-center justify-center text-white font-bold shadow-lg shadow-[#8B5CF6]/20">
            Z
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-display">ZieAds</span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-[400px] w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-[#F8FAFC] tracking-tight mb-2">
              {view === 'login' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-[#94A3B8] text-base">
              {view === 'login' ? 'Log in to your ZieAds account' : 'Start optimizing your ad campaigns today'}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <MotionDiv 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 text-red-500 text-sm">
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#F8FAFC] ml-1">Email address</label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-[#1E293B] border border-[#334155] rounded-lg text-white text-base outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all placeholder:text-[#64748B]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-[#F8FAFC]">Password</label>
                {view === 'login' && (
                  <button type="button" className="text-sm text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 bg-[#1E293B] border border-[#334155] rounded-lg text-white text-base outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all placeholder:text-[#64748B]"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#F8FAFC] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#8B5CF6] text-white font-medium rounded-lg shadow-lg hover:bg-[#7C3AED] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-base mt-6"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Continue'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#334155]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#0F172A] px-4 text-[#64748B] font-medium">or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full h-12 bg-[#1E293B] border border-[#334155] rounded-lg text-white text-sm font-medium hover:bg-[#2D3748] transition-all flex items-center justify-center gap-3">
              <GoogleIcon /> Continue with Google
            </button>
            <button className="w-full h-12 bg-[#1E293B] border border-[#334155] rounded-lg text-white text-sm font-medium hover:bg-[#2D3748] transition-all flex items-center justify-center gap-3">
              <FacebookIcon /> Continue with Facebook
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-[#94A3B8]">
              {view === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                className="text-[#8B5CF6] font-semibold hover:underline"
              >
                {view === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-auto pt-8 text-[13px] text-[#64748B] text-center md:text-left">
          By continuing, you agree to ZieAds' <br className="md:hidden" />
          <a href="#" className="underline hover:text-[#94A3B8] transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-[#94A3B8] transition-colors">Privacy Policy</a>
        </div>
      </MotionDiv>

      {/* RIGHT SIDE - VISUAL PREVIEW */}
      <MotionDiv 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="hidden md:flex flex-1 md:flex-[0.55] bg-gradient-to-br from-[#1E1B4B] to-[#312E81] p-12 relative flex-col justify-center overflow-hidden"
      >
        {/* Floating Mockup Cards */}
        <div className="relative h-[320px] mb-16">
          {/* Analytics Card (Back) */}
          <MotionDiv 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-0 -translate-x-1/2 w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl -rotate-[5deg] z-0"
          >
            <div className="h-2 w-16 bg-white/20 rounded mb-4"></div>
            <div className="h-32 w-full bg-gradient-to-t from-[#8B5CF6]/40 to-transparent rounded-lg relative overflow-hidden">
               <svg className="absolute bottom-0 w-full" height="60" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0,80 Q25,20 50,60 T100,40 V100 H0 Z" fill="rgba(139, 92, 246, 0.4)" />
               </svg>
            </div>
            <div className="flex gap-2 mt-4">
              <div className="h-1.5 w-1/3 bg-white/20 rounded"></div>
              <div className="h-1.5 w-1/4 bg-white/10 rounded"></div>
            </div>
          </MotionDiv>

          {/* Campaign Card (Left Front) */}
          <MotionDiv 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute left-[10%] bottom-8 w-64 bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl rotate-[3deg] z-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-[#8B5CF6]/30 flex items-center justify-center"><Layers size={14} className="text-white" /></div>
              <div className="h-2.5 w-24 bg-white/30 rounded"></div>
            </div>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-1.5 w-20 bg-white/10 rounded"></div>
                  <div className="w-8 h-1.5 bg-green-400/50 rounded"></div>
                </div>
              ))}
            </div>
          </MotionDiv>

          {/* Creative Card (Right Front) */}
          <MotionDiv 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-[10%] bottom-12 w-64 bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl -rotate-[2deg] z-20"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-[#8B5CF6]" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">AI Studio</span>
            </div>
            <div className="aspect-video w-full bg-[#8B5CF6]/10 rounded-lg flex items-center justify-center mb-3">
               <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover opacity-50 mix-blend-overlay" alt="" />
            </div>
            <div className="h-2 w-full bg-white/20 rounded"></div>
          </MotionDiv>
        </div>

        {/* Headlines */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4 tracking-tight">
            Transform your advertising <br />
            <span className="bg-gradient-to-r from-white to-[#8B5CF6] bg-clip-text text-transparent">
              with powerful AI
            </span>
          </h2>
          <p className="text-lg text-white/70 font-medium">
            The intelligent command center for modern marketers.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-8 mb-16">
          <FeatureItem 
            icon={<Layers size={20} />} 
            title="Scale seamlessly across platforms" 
            desc="Launch and manage campaigns on Facebook, Instagram, Google, and TikTok—all from a single, unified dashboard." 
          />
          <FeatureItem 
            icon={<Sparkles size={20} />} 
            title="AI-powered creative generation" 
            desc="Generate high-converting ad creatives in minutes with AI. Predict performance before you spend a dime." 
          />
          <FeatureItem 
            icon={<Users size={20} />} 
            title="Automate and optimize 24/7" 
            desc="Set intelligent rules to pause underperformers, scale winners, and receive actionable insights—while you sleep." 
          />
        </div>

        {/* Testimonial */}
        <div className="pt-8 border-t border-white/10 mt-auto">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#8B5CF6" className="text-[#8B5CF6]" />)}
          </div>
          <p className="text-[#F8FAFC] text-base italic leading-relaxed mb-6">
            "ZieAds cut our creative production time by 80% and improved our ROAS by 45% in the first month."
          </p>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/10 flex items-center justify-center text-white font-bold">SC</div>
            <div>
              <p className="text-white text-sm font-bold">Sarah Chen</p>
              <p className="text-white/50 text-xs font-medium">Marketing Director, TechFlow</p>
            </div>
          </div>
        </div>

        {/* Background blobs */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#8B5CF6]/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#312E81]/40 blur-[120px] rounded-full pointer-events-none"></div>
      </MotionDiv>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex gap-5 group">
    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#8B5CF6] transition-all group-hover:bg-[#8B5CF6] group-hover:text-white shrink-0">
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className="text-base font-semibold text-white leading-tight">{title}</h4>
      <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default AuthPage;

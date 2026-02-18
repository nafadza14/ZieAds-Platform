import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, ArrowRight, ChevronRight, LayoutDashboard, 
  Rocket, Sparkles, ShieldCheck, 
  Activity, 
  BarChart3, Layers, 
  DollarSign, TrendingUp, Award,
  Share2, Settings, Moon
} from 'lucide-react';

// Animation variants for reveal effect
const reveal: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

// Brand logo SVG component
const LOGO_MARK = (
  <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#7C5CFF"/>
    <path d="M12 12H28L12 28H28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Utility component for consistent section labeling
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[10px] font-black text-slate-500 font-mono uppercase tracking-[0.3em] mb-6 inline-block border-b border-white/10 pb-1">
    {children}
  </div>
);

// Navigation bar with login actions
const Navbar = ({ onLogin }: { onLogin: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#0B0D10]/70 backdrop-blur-xl">
    <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          {LOGO_MARK}
          <span className="text-lg font-bold tracking-tight text-white font-display">ZieAds</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Product", "Resources", "Customers", "Pricing"].map(item => (
            <a key={item} href="#" className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors">{item}</a>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button onClick={onLogin} className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors">Log in</button>
        <button onClick={onLogin} className="bg-white text-black px-4 py-1.5 rounded-lg text-[13px] font-bold hover:bg-slate-200 transition-all">Sign up</button>
      </div>
    </div>
  </nav>
);

// Illustrative dashboard mockup for landing page
const DashboardIllustration = () => (
  <div className="relative w-full max-w-[1200px] mt-16 mx-auto rounded-2xl bg-[#0B0D10] border border-white/10 shadow-[0_0_100px_rgba(124,92,255,0.12)] overflow-hidden">
    {/* Mockup Top Bar */}
    <div className="h-10 border-b border-white/5 bg-[#0B0D10] flex items-center justify-between px-4">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
        <div className="w-2 h-2 rounded-full bg-orange-500/20"></div>
        <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
      </div>
      <div className="text-[10px] text-slate-600 font-mono">zieads.app/dashboard</div>
      <div className="w-12"></div>
    </div>

    <div className="flex h-[600px] overflow-hidden">
      {/* Sidebar recreation from app logic */}
      <div className="w-56 border-r border-white/5 bg-[#0B0D10] flex flex-col p-5">
        <div className="flex items-center gap-2 mb-8">
          {LOGO_MARK}
          <span className="text-sm font-bold text-white tracking-tight">ZieAds</span>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between px-2 py-2 bg-white/5 rounded-lg border border-white/5 mb-6">
            <div className="flex items-center gap-2 overflow-hidden">
               <div className="w-5 h-5 rounded bg-[#7C5CFF]/20 flex items-center justify-center text-[#7C5CFF] text-[9px] font-bold">M</div>
               <span className="text-[11px] font-bold text-slate-300 truncate">My Workspace</span>
            </div>
            <ChevronRight size={12} className="text-slate-600 rotate-90" />
          </div>

          <div className="space-y-1">
            {[
              { icon: LayoutDashboard, label: 'Dashboard', active: true, badge: 'AI-First' },
              { icon: Rocket, label: 'Campaigns', active: false },
              { icon: Sparkles, label: 'Creatives', active: false },
              { icon: Zap, label: 'Automation', active: false },
              { icon: BarChart3, label: 'Insights', active: false },
              { icon: Share2, label: 'Integrations', active: false },
              { icon: Settings, label: 'Team & Settings', active: false },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${item.active ? 'bg-white/10 text-white' : 'text-slate-500'}`}>
                <div className="flex items-center gap-2.5">
                  <item.icon size={14} className={item.active ? 'text-[#7C5CFF]' : ''} />
                  <span>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content display simulation */}
      <div className="flex-1 bg-[#0B0D10] p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[9px] text-slate-600 font-mono font-bold uppercase tracking-widest">
               <Layers size={10} className="text-[#7C5CFF]" /> ZIEADS OS &gt; MY WORKSPACE
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Command Overview</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-600"><Moon size={16} /></div>
            <div className="bg-[#7C5CFF] px-4 py-2 rounded-lg text-white text-[11px] font-bold flex items-center gap-2 shadow-lg shadow-[#7C5CFF]/20">
               <Activity size={14} /> Live Feed
            </div>
          </div>
        </div>

        {/* Unified performance metrics visualization */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-5 bg-[#111318] rounded-2xl border border-white/5 relative overflow-hidden">
             <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500"><DollarSign size={16}/></div>
                <div className="text-[9px] font-bold text-teal-400 flex items-center gap-0.5"><TrendingUp size={10} /> +14.2%</div>
             </div>
             <p className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest mb-1 relative z-10">Unified Spend</p>
             <p className="text-xl font-bold text-white relative z-10">$12,450.8</p>
          </div>
          <div className="p-5 bg-[#111318] rounded-2xl border border-white/5 relative overflow-hidden">
             <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500"><Award size={16}/></div>
                <div className="text-xl font-bold text-white">85/100</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main LandingPage component that handles introduction and user entry
const LandingPage = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="min-h-screen bg-[#0B0D10] text-slate-400 font-sans selection:bg-[#7C5CFF]/30">
      <Navbar onLogin={onLogin} />
      
      <main>
        {/* Hero Section with motion reveal */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-[1200px] mx-auto text-center space-y-8">
            <motion.div initial="hidden" animate="visible" variants={reveal}>
              <SectionLabel>Introducing ZieAds AI</SectionLabel>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                Your Intelligent <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#C084FC]">Ad Command Center</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                Automate your marketing across Meta, Google, and TikTok. 
                Synthesize brand DNA, generate creatives, and optimize performance—all in one place.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={onLogin}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  Start Scaling Now <ArrowRight size={18} />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                  Watch Demo
                </button>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1 }}>
              <DashboardIllustration />
            </motion.div>
          </div>
        </section>

        {/* Feature grid highlighting key value propositions */}
        <section className="py-20 border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#7C5CFF]/10 rounded-xl flex items-center justify-center text-[#7C5CFF]">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Brand DNA Scan</h3>
              <p>Instantly analyze your website to extract core narratives, audience psychology, and visual identity.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#7C5CFF]/10 rounded-xl flex items-center justify-center text-[#7C5CFF]">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Hybrid Ad Studio</h3>
              <p>Generate high-converting ad posters combining AI aesthetics with precise layout control.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#7C5CFF]/10 rounded-xl flex items-center justify-center text-[#7C5CFF]">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Fraud Protection</h3>
              <p>Advanced real-time monitoring to block invalid traffic and save your ad budget.</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            {LOGO_MARK}
            <span className="text-lg font-bold tracking-tight text-white">ZieAds</span>
          </div>
          <p className="text-sm text-slate-500">© 2025 ZieAds AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
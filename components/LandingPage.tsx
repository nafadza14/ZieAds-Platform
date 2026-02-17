
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, ArrowRight, ChevronRight, LayoutDashboard, 
  Rocket, Sparkles, ShieldCheck, 
  Target, Activity, MoreHorizontal,
  BarChart3, MousePointer2, Layers, Globe, Shield, Cpu, 
  DollarSign, TrendingUp, Award, Clock, ShieldAlert,
  Share2, Settings, Moon, Terminal, BarChart, Database,
  ArrowUpRight, CheckCircle2, Quote
} from 'lucide-react';

const reveal: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const LOGO_MARK = (
  <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#7C5CFF"/>
    <path d="M12 12H28L12 28H28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[10px] font-black text-slate-500 font-mono uppercase tracking-[0.3em] mb-6 inline-block border-b border-white/10 pb-1">
    {children}
  </div>
);

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
      {/* Sidebar recreation from screenshot */}
      <div className="w-56 border-r border-white/5 bg-[#0B0D10] flex flex-col p-5">
        <div className="flex items-center gap-2 mb-8">
          {LOGO_MARK}
          <span className="text-sm font-bold text-white tracking-tight">ZieAds</span>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between px-2 py-2 bg-white/5 rounded-lg border border-white/5 mb-6">
            <div className="flex items-center gap-2 overflow-hidden">
               <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center text-accent text-[9px] font-bold">M</div>
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
                  <item.icon size={14} className={item.active ? 'text-accent' : ''} />
                  <span>{item.label}</span>
                </div>
                {item.badge && <span className="text-[8px] px-1 bg-accent/20 text-accent rounded-sm font-bold">{item.badge}</span>}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-white/5">
           <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-3">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[9px]">N</div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white">nafadza</span>
                <span className="text-[8px] text-slate-600">nafadza@gmail.com</span>
              </div>
           </div>
           <div className="flex items-center gap-2 px-2 text-[10px] text-slate-500">
             <ArrowRight className="rotate-180" size={12} />
             <span>Log out</span>
           </div>
        </div>
      </div>

      {/* Content Area recreation */}
      <div className="flex-1 bg-[#0B0D10] p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[9px] text-slate-600 font-mono font-bold uppercase tracking-widest">
               <Layers size={10} className="text-accent" /> ZIEADS OS > MY WORKSPACE
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Command Overview</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-600"><Moon size={16} /></div>
            <div className="bg-accent px-4 py-2 rounded-lg text-white text-[11px] font-bold flex items-center gap-2 shadow-lg shadow-accent/20">
               <Activity size={14} /> Live Feed
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-[#111318] rounded-2xl border border-white/5 relative overflow-hidden">
             <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500"><DollarSign size={16}/></div>
                <div className="text-[9px] font-bold text-teal-400 flex items-center gap-0.5"><TrendingUp size={10} /> +14.2%</div>
             </div>
             <p className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest mb-1 relative z-10">Unified Spend</p>
             <p className="text-xl font-bold text-white relative z-10">$12,450.8</p>
             <DollarSign size={80} className="absolute -bottom-6 -right-6 text-white/[0.02]" />
          </div>
          <div className="p-5 bg-[#111318] rounded-2xl border border-white/5 relative overflow-hidden">
             <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500"><Award size={16}/></div>
                <div className="text-[9px] font-bold text-teal-400 flex items-center gap-0.5"><TrendingUp size={10} /> +22.5%</div>
             </div>
             <p className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest mb-1 relative z-10">Unified Revenue</p>
             <p className="text-xl font-bold text-white relative z-10">$42,890.3</p>
             <Award size={80} className="absolute -bottom-6 -right-6 text-white/[0.02]" />
          </div>
          <div className="p-5 bg-[#111318] rounded-2xl border border-white/5 relative overflow-hidden">
             <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500"><TrendingUp size={16}/></div>
                <div className="text-[9px] font-bold text-teal-400 flex items-center gap-0.5"><TrendingUp size={10} /> +0.4x</div>
             </div>
             <p className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest mb-1 relative z-10">Cross-Platform ROAS</p>
             <p className="text-xl font-bold text-white relative z-10">3.44x</p>
             <TrendingUp size={80} className="absolute -bottom-6 -right-6 text-white/[0.02]" />
          </div>
          <div className="p-5 bg-[#111318] rounded-2xl border border-white/5 relative overflow-hidden">
             <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500"><Target size={16}/></div>
                <div className="text-[9px] font-bold text-teal-400 flex items-center gap-0.5"><TrendingUp size={10} className="rotate-180" /> -12%</div>
             </div>
             <p className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest mb-1 relative z-10">Avg. CPA</p>
             <p className="text-xl font-bold text-white relative z-10">$2.15</p>
             <Target size={80} className="absolute -bottom-6 -right-6 text-white/[0.02]" />
          </div>
        </div>

        {/* Lower Grid recreation */}
        <div className="grid grid-cols-3 gap-6">
           <div className="col-span-2 bg-[#111318] rounded-3xl border border-white/5 p-6 h-64 relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                   <Layers className="text-accent" size={16} />
                   <span className="text-[11px] font-bold text-white font-display">Network Volume Velocity</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-600 uppercase font-bold"><div className="w-1.5 h-1.5 rounded-full bg-accent"></div> Revenue</div>
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-600 uppercase font-bold"><div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div> Spend</div>
                </div>
              </div>
              <div className="flex h-32 items-end justify-between px-2">
                 {[40, 60, 45, 90, 70, 80, 65, 85, 55, 75, 50, 60].map((h, i) => (
                   <div key={i} className="w-4 bg-accent/20 rounded-t-sm" style={{ height: `${h}%` }}></div>
                 ))}
              </div>
           </div>
           <div className="space-y-6">
              <div className="bg-[#111318] rounded-3xl border border-white/5 p-6 space-y-8">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent"><Sparkles size={16}/></div>
                    <span className="text-[11px] font-bold text-white font-display">AI Alerts Panel</span>
                 </div>
                 <div className="flex flex-col items-center justify-center py-4 text-slate-700 space-y-2 opacity-50">
                    <Clock size={20} />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em]">Awaiting signals...</span>
                 </div>
              </div>
              <div className="bg-[#111318] rounded-3xl border border-white/5 p-6 space-y-4">
                 <div className="flex items-center gap-2">
                    <ShieldAlert className="text-accent" size={16} />
                    <span className="text-[11px] font-bold text-white font-display">Fraud Shield Protocol</span>
                 </div>
                 <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] text-slate-400 font-medium">Scanning Intensity</span>
                       <span className="text-[9px] font-bold text-accent font-mono">High</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full w-4/5 bg-accent"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#0B0D10] text-white selection:bg-accent/30 overflow-x-hidden">
      <Navbar onLogin={onLogin} />
      <div className="mesh-glow opacity-20" />

      {/* Hero Section */}
      <main className="pt-40 px-6 pb-20 overflow-hidden">
        <div className="max-w-[1200px] mx-auto text-left">
          <div className="grid lg:grid-cols-1 gap-20 items-start max-w-4xl">
             <div className="space-y-10">
                <motion.h1 
                  initial="hidden" animate="visible" variants={reveal}
                  className="text-white text-5xl md:text-[88px] font-bold tracking-tight leading-[0.95] font-display"
                >
                  Run Smarter Ads. <br/>Not More Ads.
                </motion.h1>

                <motion.p 
                  initial="hidden" animate="visible" variants={reveal}
                  className="text-lg md:text-xl text-white max-w-[650px] font-medium leading-relaxed"
                >
                  ZieAds uses AI to monitor, optimize, and protect your budget. so you can <strong>focus on growth</strong>.
                </motion.p>

                <motion.div 
                  initial="hidden" animate="visible" variants={reveal}
                  className="flex items-center gap-4"
                >
                  <button onClick={onLogin} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-white/5 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 uppercase tracking-wider">
                    Get Started <ArrowRight size={20} />
                  </button>
                </motion.div>
             </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-full"
          >
            <DashboardIllustration />
          </motion.div>
        </div>
      </main>

      {/* Section 2: The Social Proof */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <SectionLabel>THE NEW STANDARD</SectionLabel>
            <h2 className="text-4xl font-bold font-display text-white mb-4">Powering the next generation of high-growth brands.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">From stealth startups to global enterprises, Zieads is the engine behind their scale.</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-12 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             {[Layers, Cpu, Globe, Zap, Shield, Target, Activity, Share2, Terminal].map((Icon, i) => (
               <div key={i} className="flex justify-center transition-opacity hover:opacity-100">
                 <Icon size={32} className="text-white" />
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Section 3: The Bento Grid */}
      <section className="py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-20">
             <SectionLabel>PLATFORM PILLARS</SectionLabel>
             <h2 className="text-5xl font-bold font-display tracking-tight">Built for speed. <br/>Engineered for scale.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-[#111318] border border-white/5 p-12 rounded-[40px] group transition-all relative overflow-hidden flex flex-col justify-end min-h-[400px]">
              <div className="absolute top-12 left-12 w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                <Rocket size={32} />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4 font-display">Autonomous Scaling</h3>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md">Let our algorithms handle the heavy lifting. Automatically shift budget to winning creatives in real-time without touching a dial.</p>
              </div>
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/5 blur-[100px] -mr-32 -mt-32"></div>
            </div>

            <div className="md:col-span-4 bg-[#111318] border border-white/5 p-10 rounded-[40px] group transition-all flex flex-col justify-between">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-accent transition-colors">
                <Database size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 font-display">Precision Attribution</h3>
                <p className="text-slate-500 leading-relaxed text-sm">Stop guessing. Track every touchpoint across the messy middle and understand the true ROI of your ad spend.</p>
              </div>
            </div>

            <div className="md:col-span-4 bg-[#111318] border border-white/5 p-10 rounded-[40px] group transition-all flex flex-col justify-between">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-accent transition-colors">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 font-display">Global Control</h3>
                <p className="text-slate-500 leading-relaxed text-sm">Manage Meta, Google, and TikTok from a single, keyboard-centric interface designed for professional operators.</p>
              </div>
            </div>

            <div className="md:col-span-8 bg-[#111318] border border-white/5 p-10 rounded-[40px] group transition-all flex flex-col md:flex-row items-center gap-10">
               <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold font-display">Instant Insights</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">Real-time alerts for budget anomalies and performance drops. Never let a failing campaign drain your treasury again.</p>
                  <button className="flex items-center gap-2 text-xs font-black text-accent uppercase tracking-widest mt-4">View All Features <ChevronRight size={14} /></button>
               </div>
               <div className="w-48 h-48 bg-white/5 rounded-3xl border border-white/5 p-6 flex flex-col justify-between shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                  <div className="flex justify-between items-center"><div className="w-8 h-2 bg-accent/50 rounded-full"></div><div className="w-2 h-2 bg-green-500 rounded-full"></div></div>
                  <div className="space-y-2"><div className="h-1.5 w-full bg-white/10 rounded"></div><div className="h-1.5 w-2/3 bg-white/10 rounded"></div></div>
                  <div className="text-2xl font-black text-accent">98.2%</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Detailed Feature (Workflow) */}
      <section className="py-32 bg-[#08090C]">
        <div className="max-w-[1200px] mx-auto px-6">
           <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-10 order-2 lg:order-1">
                 <div>
                    <SectionLabel>WORKFLOW</SectionLabel>
                    <h2 className="text-5xl font-bold font-display tracking-tight leading-none mb-8">Eliminate the friction <br/>in your ad ops.</h2>
                    <p className="text-lg text-slate-400 leading-relaxed font-medium">Traditional ad managers are cluttered and slow. Zieads is built for the modern marketer who values time as much as performance. Sync your data once, and manage your entire funnel without leaving the dashboard.</p>
                 </div>

                 <div className="space-y-6">
                    {[
                      { icon: <Share2 size={18} />, title: "Unified reporting across all channels", desc: "No more tab-switching. See your blended metrics in one place." },
                      { icon: <ShieldAlert size={18} />, title: "Smart alerts for budget anomalies", desc: "AI monitors your spending patterns 24/7." },
                      { icon: <Zap size={18} />, title: "One-click creative testing", desc: "A/B test variations with zero technical setup." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-5 group">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-accent transition-colors shrink-0">
                            {item.icon}
                         </div>
                         <div className="space-y-1">
                            <h4 className="font-bold text-white tracking-tight">{item.title}</h4>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="order-1 lg:order-2 relative">
                 <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full opacity-30"></div>
                 <div className="relative bg-[#111318] rounded-[40px] border border-white/10 p-4 shadow-2xl animate-float">
                    <div className="bg-[#0B0D10] rounded-[32px] overflow-hidden">
                       <div className="p-6 border-b border-white/5 flex items-center justify-between">
                          <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-red-500/20"></div><div className="w-2 h-2 rounded-full bg-orange-500/20"></div><div className="w-2 h-2 rounded-full bg-green-500/20"></div></div>
                          <span className="text-[10px] text-slate-600 font-mono">deployment_terminal.v2</span>
                       </div>
                       <div className="p-8 space-y-6">
                          <div className="flex justify-between items-center"><span className="text-xs font-bold">Scaling Multiplier</span><span className="text-accent font-mono text-xs">2.5x</span></div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full w-4/5 bg-accent"></div></div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-white/5 rounded-2xl space-y-2"><div className="h-1 w-8 bg-slate-700 rounded"></div><div className="text-xl font-bold text-white">$12k</div></div>
                             <div className="p-4 bg-white/5 rounded-2xl space-y-2"><div className="h-1 w-8 bg-slate-700 rounded"></div><div className="text-xl font-bold text-teal-400">+42%</div></div>
                          </div>
                          <div className="p-4 bg-accent/10 border border-accent/20 rounded-2xl flex items-center gap-3">
                             <Sparkles size={16} className="text-accent" />
                             <span className="text-[11px] font-bold text-accent">New creative winner detected in Instagram Feed.</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Section 5: The "Vibe" / Performance Focus */}
      <section className="py-48 relative overflow-hidden text-center">
         <div className="absolute inset-0 bg-accent/5 pointer-events-none blur-[120px]"></div>
         <div className="max-w-[900px] mx-auto px-6 relative z-10 space-y-12">
            <h2 className="text-6xl md:text-[100px] font-bold font-display tracking-tight leading-[0.9] text-white">Move at the speed <br/>of thought.</h2>
            <div className="max-w-2xl mx-auto space-y-8">
              <p className="text-xl text-slate-400 font-medium leading-relaxed">Ad management shouldn't be a chore. It should be an advantage. Zieads strips away the noise, letting you focus on the only metric that matters: <strong>Growth</strong>.</p>
              <div className="flex flex-wrap justify-center gap-4">
                 {['Fast Execution', 'AI Intelligence', 'Secure Infrastructure', 'Precision Tracking'].map(tag => (
                   <span key={tag} className="px-5 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-bold text-slate-400">{tag}</span>
                 ))}
              </div>
            </div>
         </div>
      </section>

      {/* Section 6: The Testimonial */}
      <section className="py-32 bg-white text-black">
        <div className="max-w-[1200px] mx-auto px-6">
           <div className="grid lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-8">
                 <Quote size={64} className="text-accent/20 mb-10" fill="currentColor" />
                 <h3 className="text-4xl md:text-6xl font-bold font-sans tracking-tight leading-tight text-black mb-12">
                   "Zieads isn't just a tool; it's a competitive edge. We’ve reduced our manual workload by 60% while increasing our ROAS by nearly double."
                 </h3>
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Sarah Chen" />
                    </div>
                    <div>
                       <p className="text-xl font-bold">Sarah Chen</p>
                       <p className="text-slate-500 font-medium">Director of Marketing, Mansion Media International</p>
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-4 lg:pt-20">
                 <div className="p-10 bg-slate-50 rounded-[40px] space-y-8">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Case Results</p>
                       <div className="text-4xl font-black text-black">2.4x <span className="text-accent">ROAS</span></div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Saved</p>
                       <div className="text-4xl font-black text-black">24h<span className="text-accent">/wk</span></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Section 7: Final CTA */}
      <section className="py-48 bg-white text-black relative">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-[88px] font-bold font-display tracking-tight leading-[0.9] text-black">Start scaling <br/>smarter.</h2>
            <p className="text-xl text-slate-600 font-bold max-w-lg mx-auto">Join the ranks of sophisticated advertisers. Build your first campaign in minutes.</p>
            
            <div className="flex flex-col items-center gap-8">
              <button onClick={onLogin} className="bg-black text-white px-12 py-5 rounded-3xl font-black text-xl shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95 uppercase tracking-widest">
                Get Started for Free <ArrowRight size={24} />
              </button>
              <div className="flex items-center gap-3 text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 <CheckCircle2 size={16} className="text-teal-500" /> No credit card required. Cancel anytime.
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-white border-t border-slate-100 text-black">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              {LOGO_MARK}
              <span className="text-lg font-bold tracking-tight text-black font-display">ZieAds</span>
            </div>
            <div className="flex gap-12">
              <span className="text-[11px] font-bold text-slate-400 hover:text-black transition-colors cursor-pointer uppercase tracking-widest">Privacy</span>
              <span className="text-[11px] font-bold text-slate-400 hover:text-black transition-colors cursor-pointer uppercase tracking-widest">Terms</span>
              <span className="text-[11px] font-bold text-slate-400 hover:text-black transition-colors cursor-pointer uppercase tracking-widest">Twitter</span>
            </div>
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-300">© 2025 ZIEADS OS. PLATFORM_STABLE.V1</p>
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

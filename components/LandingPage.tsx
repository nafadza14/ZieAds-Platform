
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, PlayCircle, DollarSign, Clock, Hourglass,
  Zap, ChevronRight, Layout, MousePointer2, Smartphone, Sparkles,
  CheckCircle2, ShieldCheck, BarChart3, Globe, Target, Eye, 
  Plus, Play, Quote, Check, Star, Mail, ChevronDown, Lock,
  Layers, Search, AlertTriangle, Lightbulb, Coffee, X, TrendingUp
} from 'lucide-react';

// --- Motion Components ---
const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionH2 = motion.h2;
const MotionP = motion.p;

// --- Global Animation Easings ---
const smooth: any = [0.16, 1, 0.3, 1];

// --- Helper Components ---

const CountUp = ({ value, prefix = "", suffix = "", delay = 0 }: { value: number, prefix?: string, suffix?: string, delay?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const frameRate = 1000 / 60;
      const totalFrames = duration / frameRate;
      const increment = end / totalFrames;
      
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(interval);
          } else {
            setCount(Math.floor(start));
          }
        }, frameRate);
        return () => clearInterval(interval);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);

  return <span ref={ref} className="tabular-nums font-bold tracking-tight">{prefix}{count.toLocaleString()}{suffix}</span>;
};

const Navbar = ({ onLogin }: { onLogin: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Pain Points", href: "#pain" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "ROAS Boost", href: "#results" },
    { label: "Pricing", href: "#pricing" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] h-[72px] transition-all duration-500 ${
      scrolled ? 'glass-navbar py-2' : 'bg-transparent border-b border-white/0 py-4'
    }`}>
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-button-gradient flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">Z</div>
            <span className="text-xl font-bold tracking-tight text-white font-display">ZieAds</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <a 
                key={item.label} 
                href={item.href} 
                className="text-[14px] font-medium text-secondary hover:text-white transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onLogin} className="text-[14px] font-medium text-secondary hover:text-white transition-colors">Log in</button>
          <button onClick={onLogin} className="bg-button-gradient text-white px-5 py-2.5 rounded-lg text-[14px] font-semibold primary-shadow hover:primary-shadow-hover hover:-translate-y-0.5 transition-all active:translate-y-0 active:scale-95">
            Fix My ROAS
          </button>
        </div>
      </div>
    </nav>
  );
};

const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
      <Navbar onLogin={onLogin} />

      {/* --- SECTION 1: HERO (Pain-First) --- */}
      <section className="relative pt-[200px] pb-[160px] flex flex-col items-center bg-hero-gradient">
        <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10 flex flex-col items-center">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: smooth }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-[13px] font-semibold tracking-wide text-red-400 mb-8"
          >
            <AlertTriangle size={14} /> STOP BURNING BUDGET
          </MotionDiv>

          <div className="max-w-[1000px] mx-auto mb-10">
            <MotionH1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9, ease: smooth }}
              className="text-[44px] md:text-[76px] font-bold text-white tracking-[-0.05em] leading-[1.05] mb-2"
            >
              You Burned $2,400 This Month.
            </MotionH1>
            <MotionH1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: smooth }}
              className="text-[44px] md:text-[76px] font-bold tracking-[-0.05em] leading-[1.05] text-transparent bg-clip-text bg-text-gradient"
            >
              And You Don't Even Know Which Ads.
            </MotionH1>
          </div>

          <MotionP 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8, ease: smooth }}
            className="max-w-[620px] mx-auto text-lg md:text-[22px] text-secondary leading-relaxed mb-12"
          >
            You're checking 4 dashboards at 2AM because you're afraid to miss something. Your competitors are sleeping while AI optimizes everything automatically.
          </MotionP>

          <MotionDiv 
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.7, ease: smooth }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-32"
          >
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto px-12 py-5 bg-button-gradient text-white rounded-2xl text-[18px] font-bold primary-shadow hover:primary-shadow-hover hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              Fix My Ad Chaos <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-12 py-5 bg-transparent border border-border text-white rounded-2xl text-[18px] font-bold hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-2">
              <PlayCircle size={20} className="text-secondary" /> See How It Works (2 min)
            </button>
          </MotionDiv>
        </div>
      </section>

      {/* --- SECTION 2: PATTERN INTERRUPT --- */}
      <section className="py-24 bg-red-500/5 border-y border-red-500/10">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight">Wait—Before You Scroll Past This...</h3>
            <p className="text-secondary text-lg md:text-xl max-w-[800px] mx-auto leading-relaxed">
              If you're thinking "I'll check this out later," ask yourself: <span className="text-white font-bold underline decoration-red-500/50">How much money will you burn between now and "later"?</span>
            </p>
            <div className="pt-4 flex items-center justify-center gap-8">
               <div className="text-center">
                 <div className="text-3xl font-bold text-white">$80</div>
                 <div className="text-[11px] font-black uppercase tracking-widest text-secondary">Wasted Every Day</div>
               </div>
               <div className="h-10 w-px bg-white/10"></div>
               <div className="text-center">
                 <div className="text-3xl font-bold text-white">5 min</div>
                 <div className="text-[11px] font-black uppercase tracking-widest text-secondary">To Fix It Forever</div>
               </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* --- SECTION 3: PAIN AMPLIFICATION --- */}
      <section id="pain" className="py-[140px] px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-24 space-y-4">
            <h2 className="text-[38px] md:text-[56px] font-bold text-white tracking-tight leading-[1.1]">Let's Be Honest. <br/>This Is Your Life Right Now.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PainCard 
              icon={<Hourglass size={28} />}
              title="Creative Bottleneck"
              headline="You're Still Waiting for That 'Urgent' Creative"
              desc="It's Thursday. You needed that creative Monday. Your designer said 'I'll get to it.' Meanwhile, your competitor just launched 8 variants and found a winner. By the time yours is ready, the trend is dead."
              kicker="The kicker? You're paying $4,000/month for this wait."
            />
            <PainCard 
              icon={<Layers size={28} />}
              title="Platform Madness"
              headline="Spending More Time Switching Tabs Than Optimizing"
              desc="Meta. Google. TikTok. 4 passwords. 4 interfaces. 4 different ways to lose money. You spend 12 hours per week just CHECKING dashboards. Not strategizing. Just CHECKING. Fuck, where did I put that data?"
              kicker="12 hours lost per week. Every single week."
            />
            <PainCard 
              icon={<Search size={28} />}
              title="Optimization Paralysis"
              headline="Checking Dashboards at 2AM Because You're Afraid"
              desc="50 metrics. 20 campaigns. Which one's actually driving sales? You're not optimizing. You're guessing. And guessing with money is called gambling. You KNOW you should pause that ad. But what if?"
              kicker="Spoiler: It's not going to turn around tomorrow."
            />
          </div>
        </div>
      </section>

      {/* --- SECTION 4: THE BRIDGE (The Morning Coffee) --- */}
      <section className="py-[160px] px-6 bg-elevated/40 border-y border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest rounded-lg">THE BRIDGE</div>
            <h2 className="text-[40px] md:text-[56px] font-bold text-white tracking-tight leading-[1.1]">
              What If You Could Launch 20 Creatives <span className="text-secondary italic">Before Your Morning Coffee Gets Cold?</span>
            </h2>
            <div className="space-y-6">
              <p className="text-xl text-secondary leading-relaxed">Imagine this: You describe your product in plain English. <span className="text-white font-semibold">"We sell organic skincare for oily skin."</span></p>
              <ul className="space-y-4">
                {["20 creative variants in 2 minutes", "Optimized for Meta, Google, and TikTok", "A/B tested automatically", "Winners scaled, losers killed 24/7"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-lg text-white font-medium">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary"><Check size={14} /></div>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-secondary text-lg">No designer. No 3-day wait. No guesswork. This isn't the future. This is <span className="text-white font-bold">ZieAds</span>. Right now.</p>
            </div>
            <button onClick={onLogin} className="px-10 py-5 tosca-bg text-white rounded-2xl font-bold text-lg primary-shadow hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
               Start My 14-Day Free Trial <ChevronRight size={20} />
            </button>
          </div>
          <div className="relative">
             <div className="aspect-square bg-gradient-to-br from-elevated to-background border border-border rounded-[48px] p-8 shadow-2xl flex flex-col justify-center items-center gap-8 relative z-10">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary">
                      <Coffee size={32} />
                   </div>
                   <div className="h-0.5 w-12 bg-white/10 rounded-full" />
                   <div className="w-20 h-20 rounded-3xl bg-button-gradient flex items-center justify-center text-white shadow-2xl shadow-primary/30 animate-pulse">
                      <Zap size={40} fill="currentColor" />
                   </div>
                   <div className="h-0.5 w-12 bg-white/10 rounded-full" />
                   <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-400">
                      <TrendingUp size={32} />
                   </div>
                </div>
                <div className="text-center space-y-2">
                   <div className="text-[48px] font-bold text-white tabular-nums tracking-tighter">01:58</div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Seconds to Launch</p>
                </div>
             </div>
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full" />
          </div>
        </div>
      </section>

      {/* --- SECTION 5: HOW IT WORKS (Friction Removal) --- */}
      <section id="how-it-works" className="py-[140px] px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[800px] mx-auto mb-24 space-y-6">
            <h2 className="text-[40px] md:text-[56px] font-bold text-white tracking-tight leading-[1.1]">From Signup to Live Campaign in 10 Minutes.</h2>
            <p className="text-xl text-secondary">No Designer. No Drama. No Bullshit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard 
              num="01"
              title="Connect Your Accounts (2 min)"
              desc="Link Meta, Google, and TikTok. One-click OAuth. No password sharing. No tech headaches. If you can log into Facebook, you can do this."
            />
            <StepCard 
              num="02"
              title="Tell Our AI What You Sell (3 min)"
              desc="'We sell sustainable yoga mats.' That's it. Our AI analyzes millions of high-performing ads to generate 20 variants. Better visuals than your agency, in 1/100th of the time."
            />
            <StepCard 
              num="03"
              title="Launch & Let AI Optimize (5 min)"
              desc="Go live across all platforms with ONE click. Watch AI monitor performance 24/7. It pauses losers and scales winners while you sleep. Wake up to results."
            />
          </div>
        </div>
      </section>

      {/* --- SECTION 6: OBJECTION HANDLING --- */}
      <section className="py-[140px] px-6 bg-elevated/20 border-y border-border/50">
        <div className="max-w-[1000px] mx-auto space-y-[120px]">
          <ObjectionRow 
            q="But My Creative Team..."
            ans="Headline: Your Creative Team Is Slowing You Down"
            body="We love designers. But 3 days for one creative? In 2025? Your designer should be doing HIGH-LEVEL strategy, not resizing banners. ZieAds handles the grunt work. Everyone wins. Especially your ROAS."
          />
          <ObjectionRow 
            q="But I Don't Trust AI..."
            ans="Headline: You Already Trust AI. You Just Don't Know It."
            body="Google Maps picks your route. Netflix picks your shows. Spotify picks your music. You trust AI with your TIME every day. Why not trust it with your ad budget where it can actually MAKE you money? Plus, you're always in control. Approve everything. Let AI do the heavy lifting."
          />
          <ObjectionRow 
            q="But My Account is Too Complex..."
            ans="Headline: If You Can Handle 4 Dashboards, You Can Handle One That Actually Makes Sense."
            body="You've been managing Meta, Google, AND TikTok separately. That's the definition of complex. ZieAds brings them into ONE interface. One view. One optimization engine. One report. Less complexity. More clarity. Better results."
          />
        </div>
      </section>

      {/* --- SECTION 7: SOCIAL PROOF --- */}
      <section id="results" className="py-[140px] px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-[40px] md:text-[56px] font-bold text-white tracking-tight mb-24">Marketers Who Switched to ZieAds</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="We used to spend $6K/month on a creative agency. Now we spend $49 on ZieAds and get BETTER results. ROAS improved 45% in 30 days."
              name="Sarah Chen"
              role="Marketing Director, DTC Skincare"
              stat="45% Higher ROAS"
            />
            <TestimonialCard 
              quote="I was spending 15 hours a week checking dashboards. Now I check ZieAds for 10 minutes. The AI caught fraudulent clicks draining $400/day."
              name="Marcus Johnson"
              role="Performance Lead, SaaS"
              stat="15 Hours Saved/Week"
            />
            <TestimonialCard 
              quote="My competitor launched 50 creatives last month. I launched 12. With ZieAds, I launched 200 this month. I'm now the one they're trying to catch."
              name="David Park"
              role="E-commerce Founder"
              stat="10x More Creative Testing"
            />
          </div>
        </div>
      </section>

      {/* --- SECTION 8: PRICING --- */}
      <section id="pricing" className="py-[140px] px-6 bg-elevated/40">
        <div className="max-w-[1200px] mx-auto text-center">
           <h2 className="text-[40px] md:text-[56px] font-bold text-white tracking-tight mb-20">No Risk. Pure Upside.</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
             <PricingCard title="Starter" price="0" subtitle="Testing the waters" features={["50 AI creatives/mo", "1 Account Sync", "Standard Insights"]} cta="Start Free" onClick={onLogin} />
             <PricingCard popular title="Growth" price="49" subtitle="Scaling brands" features={["Unlimited AI creatives", "5 Account Syncs", "24/7 AI Optimization", "Fraud Protection"]} cta="Fix My Ads Today" onClick={onLogin} />
             <PricingCard title="Scale" price="149" subtitle="High-volume agencies" features={["Unlimited Syncs", "API Access", "White-label Reports", "Priority GPU Core"]} cta="Scale Now" onClick={onLogin} />
           </div>
        </div>
      </section>

      {/* --- SECTION 9: FINAL CTA (The Choice) --- */}
      <section className="py-[180px] px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          <h2 className="text-[44px] md:text-[76px] font-bold text-white tracking-tighter leading-none mb-20">You Have Two <br/><span className="text-transparent bg-clip-text bg-text-gradient underline">Choices</span> Right Now.</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-stretch text-left">
            <div className="p-10 rounded-[40px] border border-border bg-background flex flex-col gap-8 opacity-60">
              <h3 className="text-2xl font-bold text-white">Option 1: Status Quo</h3>
              <ul className="space-y-4 text-secondary">
                <li className="flex gap-3"><X size={18} className="text-red-500 shrink-0" /> Keep waiting 3 days per creative</li>
                <li className="flex gap-3"><X size={18} className="text-red-500 shrink-0" /> Keep checking 4 dashboards at 2AM</li>
                <li className="flex gap-3"><X size={18} className="text-red-500 shrink-0" /> Keep watching competitors scale</li>
                <li className="flex gap-3"><X size={18} className="text-red-500 shrink-0" /> Keep wondering "what if"</li>
              </ul>
              <p className="mt-auto text-sm italic">It's safe. But it's costing you $2,400/mo.</p>
            </div>

            <div className="p-10 rounded-[40px] border border-primary bg-elevated shadow-2xl shadow-primary/20 flex flex-col gap-8 relative">
              <div className="absolute -top-4 right-10 bg-primary text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full">RECOMMENDED</div>
              <h3 className="text-2xl font-bold text-white">Option 2: Total Control</h3>
              <ul className="space-y-4 text-white font-medium">
                <li className="flex gap-3"><Check size={18} className="text-teal-400 shrink-0" /> Launch 20 creatives in 2 minutes</li>
                <li className="flex gap-3"><Check size={18} className="text-teal-400 shrink-0" /> Manage all platforms in one view</li>
                <li className="flex gap-3"><Check size={18} className="text-teal-400 shrink-0" /> AI optimizes while you sleep</li>
                <li className="flex gap-3"><Check size={18} className="text-teal-400 shrink-0" /> Finally feel in control of budget</li>
              </ul>
              <button onClick={onLogin} className="w-full py-5 bg-button-gradient rounded-2xl text-lg font-bold shadow-xl hover:scale-[1.02] transition-all">
                Fix My Ad Chaos Now →
              </button>
              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center opacity-70">
                 <span className="text-[10px] font-bold flex items-center gap-1"><Check size={12} /> 14 DAYS FREE</span>
                 <span className="text-[10px] font-bold flex items-center gap-1"><Check size={12} /> NO CREDIT CARD</span>
                 <span className="text-[10px] font-bold flex items-center gap-1"><Check size={12} /> CANCEL ANYTIME</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-24 px-6 border-t border-border/50 bg-background">
        <div className="max-w-[1200px] mx-auto text-center space-y-12">
           <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">Z</div>
              <span className="text-xl font-bold tracking-tight text-white font-display">ZieAds</span>
           </div>
           <nav className="flex flex-wrap justify-center gap-10 text-[13px] font-bold text-secondary uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Integrations</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
           </nav>
           <p className="text-[13px] text-tertiary">© 2025 ZieAds. Built by performance marketers, for performance marketers.</p>
        </div>
      </footer>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const PainCard = ({ icon, title, headline, desc, kicker }: any) => (
  <div className="p-10 bg-elevated/40 border border-border rounded-[40px] flex flex-col gap-8 group hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 h-full">
    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
      {icon}
    </div>
    <div className="space-y-4 flex-1">
      <div className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary">{title}</div>
      <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">{headline}</h3>
      <p className="text-secondary leading-relaxed">{desc}</p>
    </div>
    <p className="text-sm font-bold text-red-400 italic">{kicker}</p>
  </div>
);

const StepCard = ({ num, title, desc }: any) => (
  <div className="space-y-8 p-10 bg-white/2 rounded-[40px] border border-white/5 h-full">
    <div className="text-[64px] font-bold text-white/5 leading-none tabular-nums font-display">{num}</div>
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
      <p className="text-secondary leading-relaxed text-[17px]">{desc}</p>
    </div>
  </div>
);

const ObjectionRow = ({ q, ans, body }: any) => (
  <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start group">
    <div className="text-[13px] font-black uppercase tracking-[0.2em] text-secondary py-2 border-l-2 border-white/10 pl-6 group-hover:border-primary transition-colors">
       "{q}"
    </div>
    <div className="space-y-6">
       <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">{ans}</h3>
       <p className="text-lg text-secondary leading-relaxed">{body}</p>
    </div>
  </div>
);

const TestimonialCard = ({ quote, name, role, stat }: any) => (
  <div className="p-12 bg-elevated/60 border border-border rounded-[48px] text-left space-y-10 flex flex-col h-full hover:border-teal-500/30 transition-all group">
    <div className="text-4xl font-bold text-teal-400 tracking-tighter group-hover:scale-110 origin-left transition-transform">→ {stat}</div>
    <p className="text-[18px] text-white font-medium leading-relaxed italic flex-1">"{quote}"</p>
    <div className="pt-8 border-t border-white/10 flex items-center gap-4">
       <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">{name[0]}</div>
       <div>
          <p className="font-bold text-white">{name}</p>
          <p className="text-xs font-bold text-secondary uppercase tracking-widest">{role}</p>
       </div>
    </div>
  </div>
);

const PricingCard = ({ title, price, subtitle, features, cta, popular, onClick }: any) => (
  <div className={`p-12 rounded-[48px] border flex flex-col gap-10 relative h-full transition-all duration-500 ${
    popular 
    ? 'bg-elevated border-primary shadow-2xl shadow-primary/10 scale-[1.05] z-10' 
    : 'bg-background border-border hover:border-zinc-700'
  }`}>
    {popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase px-6 py-2 rounded-full">BEST PERFORMANCE</div>}
    <div className="space-y-2">
       <h3 className="text-2xl font-bold text-white">{title}</h3>
       <p className="text-xs font-bold text-secondary uppercase tracking-widest">{subtitle}</p>
    </div>
    <div className="flex items-baseline gap-1">
       <span className="text-2xl font-bold text-secondary">$</span>
       <span className="text-[72px] font-bold text-white leading-none tracking-tighter">{price}</span>
       {price !== "0" && <span className="text-lg font-bold text-secondary">/mo</span>}
    </div>
    <ul className="space-y-4 flex-1">
       {features.map((f: string) => (
         <li key={f} className="flex items-center gap-3 text-sm font-medium text-secondary">
           <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {f}
         </li>
       ))}
    </ul>
    <button onClick={onClick} className={`w-full py-5 rounded-2xl font-bold transition-all ${popular ? 'bg-button-gradient text-white shadow-xl hover:scale-[1.02]' : 'bg-white/5 text-white hover:bg-white/10'}`}>
       {cta}
    </button>
  </div>
);

export default LandingPage;

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, PlayCircle, DollarSign, Clock, Hourglass,
  Zap, ChevronRight, Layout, MousePointer2, Smartphone, Sparkles
} from 'lucide-react';

// Aliasing motion components to bypass broken TypeScript definitions in this environment
const MotionDiv = (motion as any).div;
const MotionH1 = (motion as any).h1;
const MotionH2 = (motion as any).h2;
const MotionP = (motion as any).p;

// --- Global Animation Easings ---
// Explicitly type easings as tuples to satisfy framer-motion Easing types
const smooth: [number, number, number, number] = [0.16, 1, 0.3, 1];
const bounce: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

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

  return <span ref={ref} className="tabular-nums">{prefix}{count.toLocaleString()}{suffix}</span>;
};

const Navbar = ({ onLogin }: { onLogin: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-[64px] transition-all duration-300 ${
      scrolled ? 'bg-[#0A0A0F]/95 border-b border-white/10' : 'bg-[#0A0A0F]/80 border-b border-white/5'
    } backdrop-blur-md`}>
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">Z</div>
            <span className="text-xl font-bold tracking-tight text-white font-display">ZieAds</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Product", "Use Cases", "Compare", "Pricing"].map(item => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                className="text-[14px] font-medium text-[#A1A1AA] hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onLogin} className="text-[14px] font-medium text-[#A1A1AA] hover:text-white transition-colors">Log in</button>
          <button onClick={onLogin} className="bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] text-white px-5 py-2.5 rounded-lg text-[14px] font-semibold hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 transition-all active:scale-95">Start Free Trial</button>
        </div>
      </div>
    </nav>
  );
};

const LogoMarquee = () => {
  const logos = ["Vercel", "Linear", "Notion", "Figma", "Stripe", "Supabase"];
  return (
    <div className="py-20 border-y border-white/5 bg-[#0A0A0F] overflow-hidden">
      <p className="text-center text-[14px] font-medium text-[#71717A] tracking-wider mb-10 uppercase">Trusted by high-growth brands</p>
      <div className="flex gap-12 whitespace-nowrap overflow-hidden relative">
        <MotionDiv 
          className="flex gap-12 items-center min-w-full shrink-0"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
            <span 
              key={i} 
              className="text-2xl font-black text-white/30 hover:text-white/80 grayscale hover:grayscale-0 transition-all cursor-default px-4"
            >
              {logo}
            </span>
          ))}
        </MotionDiv>
      </div>
    </div>
  );
};

const PainCard = ({ title, desc, question, colors, icon: Icon }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <MotionDiv
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: smooth }}
      whileHover={{ y: -8, borderColor: 'rgba(139,92,246,0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}
      className="w-full md:w-[360px] p-8 bg-[#14141B] border border-white/5 rounded-2xl flex flex-col gap-8 transition-colors duration-300 relative group"
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon size={24} />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-[20px] font-bold text-white tracking-tight">{title}</h3>
        <p className="text-[15px] text-[#A1A1AA] leading-relaxed font-normal">{desc}</p>
      </div>

      <p className="mt-auto text-[14px] font-medium italic text-[#8B5CF6]">{question}</p>
    </MotionDiv>
  );
};

const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#FAFAFA] font-sans selection:bg-[#8B5CF6]/30 overflow-x-hidden">
      <Navbar onLogin={onLogin} />

      {/* --- Section: Hero --- */}
      <section className="relative pt-[160px] pb-[120px] min-h-[90vh] flex flex-col items-center">
        {/* Animated Background Orbs */}
        <MotionDiv 
          animate={{ x: [-20, 20, -20], y: [-15, 15, -15] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#8B5CF6] opacity-[0.12] blur-[150px] rounded-full pointer-events-none" 
        />
        <MotionDiv 
          animate={{ x: [10, -10, 10], y: [20, -20, 20] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-[#A78BFA] opacity-[0.08] blur-[120px] rounded-full pointer-events-none" 
        />
        <MotionDiv 
          animate={{ x: [-15, 15, -15], y: [-30, 30, -30] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-[#7C3AED] opacity-[0.05] blur-[100px] rounded-full pointer-events-none" 
        />

        <div className="max-w-[1280px] mx-auto px-6 text-center relative z-10 flex flex-col items-center">
          {/* Badge */}
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: smooth }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-full text-[11px] font-black tracking-[0.15em] text-[#8B5CF6] mb-8 uppercase"
          >
            INTRODUCING ZIEADS AI
          </MotionDiv>

          {/* Headline */}
          <div className="max-w-[950px] mx-auto mb-8">
            <MotionH1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: smooth }}
              className="text-[42px] md:text-[68px] font-bold text-white tracking-[-0.03em] leading-[1.05] mb-2"
            >
              Your Competitors Test 20 Creatives Per Week.
            </MotionH1>
            <MotionH1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: smooth }}
              className="text-[42px] md:text-[68px] font-bold tracking-[-0.03em] leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C4B5FD]"
            >
              You're Stuck With 3.
            </MotionH1>
          </div>

          {/* Subheadline */}
          <MotionP 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6, ease: smooth }}
            className="max-w-[600px] mx-auto text-lg md:text-[20px] text-[#A1A1AA] leading-[1.6] mb-12 tracking-[-0.01em] font-normal"
          >
            While you juggle 4 ad platforms and burn budget on guesswork, they're using AI to launch, optimize, and scale—automatically.
          </MotionP>

          {/* CTAs */}
          <MotionDiv 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5, ease: smooth }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
          >
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] text-white rounded-xl text-[15px] font-bold shadow-lg shadow-[#8B5CF6]/30 hover:shadow-[#8B5CF6]/40 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              Fix My Ad Performance <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 text-white rounded-xl text-[15px] font-bold hover:bg-white/5 hover:border-white/20 active:scale-95 transition-all flex items-center justify-center gap-2">
              <PlayCircle size={18} className="opacity-70" /> See How It Works
            </button>
          </MotionDiv>

          {/* Pain Counters */}
          <div className="flex flex-wrap justify-center gap-6 max-w-[850px] mx-auto relative">
            <MotionDiv 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6, ease: smooth }}
              className="w-[260px] p-8 bg-[#14141B] border border-white/5 rounded-2xl text-left shadow-2xl relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-[40px] rounded-full pointer-events-none" />
              <DollarSign size={20} className="text-[#EF4444] mb-4" />
              <div className="text-[36px] font-bold text-white mb-2 tracking-tight">
                <CountUp value={2400} prefix="$" delay={1.2} />
              </div>
              <p className="text-[13px] text-[#71717A] leading-relaxed font-normal">Wasted on underperforming ads this month</p>
            </MotionDiv>

            <MotionDiv 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6, ease: smooth }}
              className="w-[260px] p-8 bg-[#14141B] border border-white/5 rounded-2xl text-left shadow-2xl relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-[40px] rounded-full pointer-events-none" />
              <Clock size={20} className="text-[#F97316] mb-4" />
              <div className="text-[36px] font-bold text-white mb-2 tracking-tight">
                <CountUp value={12} suffix="h" delay={1.3} />
              </div>
              <p className="text-[13px] text-[#71717A] leading-relaxed font-normal">Hours spent checking dashboards weekly</p>
            </MotionDiv>

            <MotionDiv 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6, ease: smooth }}
              className="w-[260px] p-8 bg-[#14141B] border border-white/5 rounded-2xl text-left shadow-2xl relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 blur-[40px] rounded-full pointer-events-none" />
              <Hourglass size={20} className="text-[#EAB308] mb-4" />
              <div className="text-[36px] font-bold text-white mb-2 tracking-tight">
                <CountUp value={3} suffix="d" delay={1.4} />
              </div>
              <p className="text-[13px] text-[#71717A] leading-relaxed font-normal">Days to create one ad creative</p>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* --- Section: Logo Marquee --- */}
      <LogoMarquee />

      {/* --- Section: Pain Cards --- */}
      <section id="product" className="py-[140px] px-6 flex flex-col items-center bg-[#0A0A0F] relative">
        <div className="max-w-[1200px] mx-auto text-center mb-24 flex flex-col items-center">
          <MotionDiv 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[14px] font-bold tracking-[0.2em] text-[#8B5CF6] mb-4 uppercase"
          >
            SOUND FAMILIAR?
          </MotionDiv>
          <MotionH2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: smooth }}
            className="text-[36px] md:text-[48px] font-bold text-white tracking-[-0.02em] leading-[1.1] max-w-[700px] mx-auto mb-6"
          >
            Which one keeps you up at night?
          </MotionH2>
          <p className="text-[#A1A1AA] text-lg max-w-[500px]">We've solved the structural issues that make multi-platform advertising a nightmare.</p>
        </div>

        <div className="max-w-[1200px] mx-auto flex flex-wrap gap-8 justify-center items-stretch">
          <PainCard 
            icon={Layout}
            colors={["#8B5CF6", "#A78BFA"]}
            title="The Creative Bottleneck"
            desc="Your designer takes 3 days per creative. You need 20+ variants to test what works. By the time they're ready, the opportunity is gone."
            question="Still waiting for that 'urgent' creative from Tuesday?"
          />
          <PainCard 
            icon={Smartphone}
            colors={["#F97316", "#FB923C"]}
            title="Platform Madness"
            desc="Meta Ads Manager. Google Ads. TikTok Business. 4 tabs. 4 interfaces. 4 places to lose money. You spend more time switching tabs than optimizing."
            question="Forgot which platform that winning campaign was on?"
          />
          <PainCard 
            icon={MousePointer2}
            colors={["#EF4444", "#F87171"]}
            title="Optimization Paralysis"
            desc="50 metrics. 20 campaigns. 4 platforms. Which one's actually driving sales? You check dashboards at 2am because you're afraid to miss something."
            question="Lying awake wondering if Campaign A is still performing?"
          />
        </div>

        {/* Asymmetric Decoration */}
        <div className="absolute bottom-[-100px] right-[-5%] w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* --- Section: Comparison Table / Investment --- */}
      <section className="py-[120px] px-6 bg-[#0E0E14] border-y border-white/5">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400">
              <Zap size={24} />
            </div>
            <h2 className="text-[40px] font-bold text-white tracking-tight leading-[1.1]">The end of manual <br/>ad management.</h2>
            <p className="text-lg text-[#A1A1AA] leading-relaxed font-normal">
              ZieAds uses deep learning to synthesize your brand DNA, generating hundreds of high-performing creatives and optimizing budget across channels in real-time.
            </p>
            <ul className="space-y-5 pt-4">
              {[
                "Unified Multichannel Control",
                "Predictive Creative Scoring",
                "Automated Fraud Protection",
                "Real-time ROI Rebalancing"
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-white font-semibold group">
                  <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 transition-colors group-hover:bg-teal-500 group-hover:text-white">
                    <ChevronRight size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative">
            {/* Imperfection: Asymmetric Card Layout */}
            <div className="aspect-[4/3] rounded-[32px] bg-[#14141B] border border-white/10 overflow-hidden shadow-2xl relative group rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-white/10 rounded-full" />
                  <div className="h-4 w-12 bg-teal-500/20 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-28 bg-white/5 rounded-2xl border border-white/5" />
                  <div className="h-28 bg-white/5 rounded-2xl border border-white/5" />
                </div>
                <div className="h-36 bg-[#8B5CF6]/5 rounded-2xl border border-[#8B5CF6]/20 flex flex-col items-center justify-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                      <Sparkles size={20} />
                   </div>
                   <span className="text-[11px] font-black uppercase text-[#8B5CF6] tracking-widest">AI Scaling Logic Active</span>
                </div>
              </div>
            </div>
            
            {/* Overlapping Info Card */}
            <MotionDiv 
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="absolute -bottom-8 -left-8 w-56 p-6 bg-[#1A1A23] border border-white/20 rounded-2xl shadow-2xl z-20 backdrop-blur-xl"
            >
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Scaling Meta</span>
               </div>
               <div className="text-2xl font-bold text-white tracking-tighter">+42.8% ROAS</div>
               <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Confidence</span>
                  <span className="text-[10px] text-teal-400 font-bold">98.2%</span>
               </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* --- Section: Footer (Minimal) --- */}
      <footer className="py-20 px-6 border-t border-white/5 bg-[#0A0A0F]">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between gap-20">
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm">Z</div>
              <span className="text-xl font-bold tracking-tight text-white font-display">ZieAds</span>
            </div>
            <p className="text-sm leading-relaxed text-[#71717A] font-normal">
              The intelligent ad command center for high-growth brands. Built for speed, scaled with AI.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer" />
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer" />
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div className="space-y-5">
              <div className="text-[12px] font-black uppercase text-white tracking-widest">Product</div>
              <ul className="space-y-3 text-sm text-[#71717A]">
                <li className="hover:text-white transition-colors cursor-pointer">Features</li>
                <li className="hover:text-white transition-colors cursor-pointer">Integrations</li>
                <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
              </ul>
            </div>
            <div className="space-y-5">
              <div className="text-[12px] font-black uppercase text-white tracking-widest">Company</div>
              <ul className="space-y-3 text-sm text-[#71717A]">
                <li className="hover:text-white transition-colors cursor-pointer">About</li>
                <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
              </ul>
            </div>
            <div className="space-y-5">
              <div className="text-[12px] font-black uppercase text-white tracking-widest">Legal</div>
              <ul className="space-y-3 text-sm text-[#71717A]">
                <li className="hover:text-white transition-colors cursor-pointer">Privacy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-medium text-[#52525B]">
          <span>© 2025 ZieAds AI Platform. All rights reserved.</span>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Twitter / X</span>
            <span className="hover:text-white cursor-pointer transition-colors">LinkedIn</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

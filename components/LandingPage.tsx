import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  ArrowRight, PlayCircle, DollarSign, Clock, Hourglass,
  Zap, ChevronRight, Layout, MousePointer2, Smartphone, Sparkles,
  CheckCircle2, ShieldCheck, BarChart3, Globe, Target, Eye, 
  Plus, Play, Quote, Check, Star, Mail, ChevronDown, Lock,
  Layers, Search, AlertTriangle, Lightbulb
} from 'lucide-react';

// --- Motion Components ---
const MotionDiv = (motion as any).div;
const MotionH1 = (motion as any).h1;
const MotionH2 = (motion as any).h2;
const MotionP = (motion as any).p;
const MotionSpan = (motion as any).span;

// --- Global Animation Easings ---
const smooth: [number, number, number, number] = [0.16, 1, 0.3, 1];

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

  const navItems = [
    { label: "Product", href: "#product" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] h-[72px] transition-all duration-300 ${
      scrolled ? 'bg-[#0A0A0F]/90 border-b border-white/10' : 'bg-transparent border-b border-white/0'
    } backdrop-blur-md`}>
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">Z</div>
            <span className="text-xl font-bold tracking-tight text-white font-display">ZieAds</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <a 
                key={item.label} 
                href={item.href} 
                className="text-[14px] font-medium text-[#A1A1AA] hover:text-white transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#8B5CF6] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onLogin} className="text-[14px] font-medium text-[#A1A1AA] hover:text-white transition-colors">Log in</button>
          <button onClick={onLogin} className="bg-[#8B5CF6] text-white px-5 py-2.5 rounded-lg text-[14px] font-semibold hover:bg-[#7C3AED] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 transition-all active:scale-95">Start Free Trial</button>
        </div>
      </div>
    </nav>
  );
};

const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#FAFAFA] font-sans selection:bg-[#8B5CF6]/30 overflow-x-hidden">
      <Navbar onLogin={onLogin} />

      {/* --- Section: Hero --- */}
      <section className="relative pt-[160px] pb-[100px] min-h-[90vh] flex flex-col items-center">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#8B5CF6] opacity-[0.08] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-[#A78BFA] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />

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
          <div className="max-w-[1000px] mx-auto mb-8">
            <MotionH1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: smooth }}
              className="text-[48px] md:text-[76px] font-bold text-white tracking-[-0.04em] leading-[1.02] mb-2"
            >
              Your Competitors Test 20 Creatives Per Week.
            </MotionH1>
            <MotionH1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: smooth }}
              className="text-[48px] md:text-[76px] font-bold tracking-[-0.04em] leading-[1.02] text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C4B5FD]"
            >
              You're Stuck With 3.
            </MotionH1>
          </div>

          {/* Subheadline */}
          <MotionP 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6, ease: smooth }}
            className="max-w-[650px] mx-auto text-lg md:text-[22px] text-[#A1A1AA] leading-[1.6] mb-12 tracking-tight font-normal"
          >
            While you juggle 4 ad platforms and burn budget on guesswork, 
            they're using AI to launch, optimize, and scale—automatically.
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
              className="w-full sm:w-auto px-10 py-4.5 bg-[#8B5CF6] text-white rounded-xl text-[16px] font-bold shadow-xl shadow-[#8B5CF6]/30 hover:bg-[#7C3AED] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              Fix My Ad Performance <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-4.5 bg-transparent border border-white/10 text-white rounded-xl text-[16px] font-bold hover:bg-white/5 hover:border-white/20 active:scale-95 transition-all flex items-center justify-center gap-2">
              <PlayCircle size={18} className="opacity-70" /> See How It Works
            </button>
          </MotionDiv>

          {/* Counter Section */}
          <div className="flex flex-wrap justify-center gap-6 max-w-[900px] mx-auto">
            <CounterCard 
              icon={<DollarSign size={20} className="text-[#EF4444]" />}
              value={2400}
              prefix="$"
              label="Wasted on underperforming ads this month"
              delay={1.0}
            />
            <CounterCard 
              icon={<Clock size={20} className="text-[#F97316]" />}
              value={12}
              suffix="h"
              label="Hours spent checking dashboards weekly"
              delay={1.1}
            />
            <CounterCard 
              icon={<Hourglass size={20} className="text-[#EAB308]" />}
              value={3}
              suffix="d"
              label="Days to create one ad creative"
              delay={1.2}
            />
          </div>
        </div>
      </section>

      {/* --- Section: Logo Cloud --- */}
      <section className="py-20 border-y border-white/5 bg-[#0A0A0F] overflow-hidden">
        <p className="text-center text-[12px] font-black text-[#52525B] tracking-[0.2em] mb-12 uppercase">Trusted by high-growth brands</p>
        <div className="flex gap-16 whitespace-nowrap overflow-hidden relative opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
          <MotionDiv 
            className="flex gap-16 items-center min-w-full shrink-0"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {["Vercel", "Linear", "Notion", "Figma", "Stripe", "Supabase", "Vercel", "Linear", "Notion", "Figma", "Stripe", "Supabase"].map((logo, i) => (
              <span key={i} className="text-2xl font-black text-white hover:text-[#8B5CF6] transition-colors cursor-default px-8 uppercase tracking-tighter">
                {logo}
              </span>
            ))}
          </MotionDiv>
        </div>
      </section>

      {/* --- Section: Emotional Hook --- */}
      <section className="py-[140px] px-6 bg-[#0A0A0F]">
        <div className="max-w-[1200px] mx-auto text-center space-y-8">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-[42px] md:text-[64px] font-bold text-white tracking-tight leading-tight">Feel in control again.</h2>
            <h2 className="text-[36px] md:text-[54px] font-bold text-[#8B5CF6] tracking-tight leading-tight opacity-80">Take back your evenings from dashboard-checking.</h2>
          </MotionDiv>
          
          <MotionP 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-[#A1A1AA] max-w-[600px] mx-auto"
          >
            A central hub for managing your Meta, Google, and TikTok ads.
          </MotionP>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
            {["Less creative bottlenecks.", "Better performing ads.", "Fewer 2AM anxiety attacks.", "Quicker campaign launches."].map((text, i) => (
              <MotionDiv 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="p-5 rounded-2xl bg-white/5 border border-white/5 text-[15px] font-bold text-white"
              >
                {text}
              </MotionDiv>
            ))}
          </div>

          <p className="mt-16 text-lg text-[#52525B] font-medium">A reality where your ads actually work—and you get your life back.</p>
        </div>
      </section>

      {/* --- Section: The Bridge --- */}
      <section className="py-[120px] px-6 bg-[#0E0E14] border-y border-white/5">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-[42px] font-bold text-white tracking-tight leading-[1.1]">Less tab-switching. <br/><span className="text-[#8B5CF6]">More scaling.</span></h2>
            <p className="text-xl text-[#A1A1AA] leading-relaxed">
              ZieAds brings AI into every step of advertising—from creative 
              generation to cross-platform optimization—so you can launch, 
              learn, and profit with confidence.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-[#8B5CF6]/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="aspect-square rounded-[40px] bg-gradient-to-br from-[#1E1B4B] to-[#0A0A0F] border border-white/10 shadow-2xl relative overflow-hidden p-1">
               <div className="w-full h-full rounded-[38px] bg-[#0A0A0F] flex items-center justify-center border border-white/5">
                  <div className="flex flex-col items-center gap-6">
                     <div className="w-20 h-20 rounded-3xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] shadow-2xl shadow-purple-500/20">
                        <Sparkles size={40} />
                     </div>
                     <div className="text-center space-y-2">
                        <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[#8B5CF6]">AI Logic Engine</p>
                        <p className="text-2xl font-bold text-white">Scaling Active</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section: Vision --- */}
      <section className="py-[120px] px-6 text-center">
        <div className="max-w-[800px] mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">This is the future of advertising.</h2>
          <p className="text-2xl text-[#8B5CF6] font-medium opacity-80 italic">AI doesn't just assist. It transforms.</p>
        </div>
      </section>

      {/* --- Section: Pain Points --- */}
      <section id="product" className="py-[140px] px-6 flex flex-col items-center bg-[#0A0A0F]">
        <div className="max-w-[1200px] mx-auto text-center mb-24">
          <div className="text-[12px] font-black tracking-[0.2em] text-[#8B5CF6] mb-4 uppercase">SOUND FAMILIAR?</div>
          <h2 className="text-[36px] md:text-[54px] font-bold text-white tracking-tight leading-[1.1] mb-6">Which one keeps you up at night?</h2>
          <p className="text-[#A1A1AA] text-lg max-w-[600px] mx-auto">We've solved the structural issues that make multi-platform advertising a nightmare.</p>
        </div>

        <div className="max-w-[1200px] mx-auto flex flex-wrap gap-8 justify-center">
          <PainCard 
            icon={<Layout size={24} />}
            colors={["#8B5CF6", "#A78BFA"]}
            title="The Creative Bottleneck"
            desc="Your designer takes 3 days per creative. You need 20+ variants to test what works. By the time they're ready, the opportunity is gone."
            question="Still waiting for that 'urgent' creative from Tuesday?"
          />
          <PainCard 
            icon={<Smartphone size={24} />}
            colors={["#F97316", "#FB923C"]}
            title="Platform Madness"
            desc="Meta Ads Manager. Google Ads. TikTok Business. 4 tabs. 4 interfaces. 4 places to lose money. You spend more time switching tabs than optimizing."
            question="Forgot which platform that winning campaign was on?"
          />
          <PainCard 
            icon={<MousePointer2 size={24} />}
            colors={["#EF4444", "#F87171"]}
            title="Optimization Paralysis"
            desc="50 metrics. 20 campaigns. 4 platforms. Which one's actually driving sales? You check dashboards at 2am because you're afraid to miss something."
            question="When did managing ads become a second job?"
          />
        </div>
      </section>

      {/* --- Section: Value Propositions --- */}
      <section className="py-[140px] px-6 bg-[#0E0E14]">
        <div className="max-w-[1200px] mx-auto space-y-[160px]">
          <ValueProp 
            label="EFFORT"
            title="Creative That Generates Itself"
            subtitle="Describe your product. Get 20 variants in 2 minutes."
            body="No more waiting for designers. No more creative blocks. Our AI generates high-converting ad creatives in your brand style—automatically."
            image={<CreativeGrid />}
          />
          <ValueProp 
            reverse
            label="PERFORMANCE"
            title="Ads That Optimize 24/7"
            subtitle="AI monitors, pauses losers, scales winners—automatically."
            body="Set your rules once. ZieAds watches your campaigns around the clock, making adjustments in real-time while you sleep."
            image={<OptimizationMonitor />}
          />
          <ValueProp 
            label="SPEED"
            title="From Idea to Live in 5 Minutes"
            subtitle="Generate, preview, and launch—no designer needed."
            body="Got a new product? Launch your first campaign before your coffee gets cold. Our AI handles creative, copy, and targeting."
            image={<SpeedLauncher />}
          />
          <ValueProp 
            reverse
            label="EXCLUSIVITY"
            title="Your AI Advantage"
            subtitle="The edge your competitors haven't discovered yet."
            body="While they're stuck in spreadsheets, you'll be scaling campaigns with AI precision. First-mover advantage is real—and it's yours."
            image={<AdvantageVisual />}
          />
        </div>
      </section>

      {/* --- Section: How It Works --- */}
      <section className="py-[140px] px-6 bg-[#0A0A0F]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">How It Works</h2>
            <p className="text-xl text-[#A1A1AA]">From signup to your first AI-generated campaign in 10 minutes.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <StepCard 
              num="01"
              title="Connect Your Accounts"
              desc="Link Meta, Google, and TikTok in one click. Secure OAuth. No password sharing."
              icon={<Globe size={24} className="text-[#8B5CF6]" />}
            />
            <StepCard 
              num="02"
              title="Describe Your Product"
              desc="Tell our AI what you're selling. It generates 20 creative variants tailored to your brand."
              icon={<Sparkles size={24} className="text-[#8B5CF6]" />}
            />
            <StepCard 
              num="03"
              title="Launch & Let AI Optimize"
              desc="Go live across all platforms. AI monitors performance and optimizes 24/7."
              icon={<Zap size={24} className="text-[#8B5CF6]" />}
            />
          </div>
        </div>
      </section>

      {/* --- Section: Features --- */}
      <section id="features" className="py-[140px] px-6 bg-[#0E0E14] border-y border-white/5">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-8">
          <FeatureCard 
            title="AI Creative Studio"
            desc="Generate 20+ ad variants from a simple product description. Images, copy, and targeting—all handled by AI."
            points={["Upload product photos or let AI generate visuals", "Auto-generate headlines and ad copy", "Create variants for different audiences", "Export to all major ad platforms"]}
            icon={<Sparkles size={24} />}
          />
          <FeatureCard 
            title="Unified Dashboard"
            desc="One interface for Meta, Google, and TikTok. No more tab-switching. No more data fragmentation."
            points={["See all campaigns in one view", "Compare performance across platforms", "Unified reporting and analytics", "Single-click optimization"]}
            icon={<Layout size={24} />}
          />
          <FeatureCard 
            title="Auto-Optimization"
            desc="Set your rules. AI executes. Pause underperformers, scale winners, adjust bids—all automatically."
            points={["24/7 performance monitoring", "Automatic budget reallocation", "A/B test management", "Smart bidding optimization"]}
            icon={<Zap size={24} />}
          />
          <FeatureCard 
            title="Click Fraud Protection"
            desc="Stop wasting budget on fake clicks. Our AI detects and blocks fraudulent traffic in real-time."
            points={["Real-time fraud detection", "IP and device fingerprinting", "Automatic blacklist updates", "Detailed fraud reports"]}
            icon={<ShieldCheck size={24} />}
          />
        </div>
      </section>

      {/* --- Section: Social Proof --- */}
      <section className="py-[140px] px-6 bg-[#0A0A0F]">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-16 tracking-tight">This could be you.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
            <div className="space-y-2">
              <div className="text-[64px] font-bold text-[#8B5CF6] tracking-tighter">45%</div>
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#52525B]">Higher ROAS</p>
            </div>
            <div className="space-y-2">
              <div className="text-[64px] font-bold text-[#8B5CF6] tracking-tighter">3x</div>
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#52525B]">More Creatives Tested</p>
            </div>
            <div className="space-y-2">
              <div className="text-[64px] font-bold text-[#8B5CF6] tracking-tighter">12</div>
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#52525B]">Hours Saved Per Week</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="We used to take 3 days to create one creative. Now we generate 20 in 2 minutes and test them all. Our ROAS improved 45% in 30 days."
              name="Sarah Chen"
              role="Marketing Director, DTC Brand"
            />
            <TestimonialCard 
              quote="I was spending 15 hours a week checking dashboards. Now ZieAds optimizes automatically, and I actually have time for strategy."
              name="Marcus Johnson"
              role="Performance Marketing Lead, SaaS"
            />
            <TestimonialCard 
              quote="The AI generated better ad copy than our agency. We cut creative costs by 70% and performance went up."
              name="Emily Rodriguez"
              role="Founder, E-commerce Startup"
            />
          </div>
        </div>
      </section>

      {/* --- Section: Pricing --- */}
      <section id="pricing" className="py-[140px] px-6 bg-[#0E0E14] border-y border-white/5">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="max-w-[800px] mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Simple pricing. No surprises.</h2>
            <p className="text-xl text-[#A1A1AA]">Start free. Scale when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            <PricingCard 
              title="Starter"
              subtitle="Perfect for trying ZieAds"
              price="0"
              features={["50 AI-generated creatives/month", "1 ad account per platform", "Basic analytics", "Email support"]}
              cta="Start Free"
              onClick={onLogin}
            />
            <PricingCard 
              popular
              title="Pro"
              subtitle="For serious marketers"
              price="49"
              features={["Unlimited AI creatives", "5 ad accounts per platform", "Advanced analytics", "Auto-optimization", "Click fraud protection", "Priority support"]}
              cta="Start Free Trial"
              onClick={onLogin}
            />
            <PricingCard 
              title="Agency"
              subtitle="For teams and agencies"
              price="149"
              features={["Everything in Pro", "Unlimited ad accounts", "White-label reports", "Team collaboration", "API access", "Dedicated account manager"]}
              cta="Contact Sales"
              onClick={onLogin}
            />
          </div>
        </div>
      </section>

      {/* --- Section: FAQ --- */}
      <section id="faq" className="py-[140px] px-6 bg-[#0A0A0F]">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center tracking-tight">Questions? We've got answers.</h2>
          <div className="space-y-4">
            <FAQItem 
              q="Do I need to replace my existing ad accounts?"
              a="No. ZieAds connects to your existing Meta, Google, and TikTok ad accounts. We don't replace them—we enhance them with AI optimization and creative generation."
            />
            <FAQItem 
              q="How does the AI creative generation work?"
              a="Simply describe your product or service. Our AI analyzes millions of high-performing ads and generates variants tailored to your brand. You can edit, approve, or regenerate until you're happy."
            />
            <FAQItem 
              q="Is my data secure?"
              a="Absolutely. We use OAuth for secure account connections, never store your passwords, and encrypt all data. We're SOC 2 Type II certified and GDPR compliant."
            />
            <FAQItem 
              q="Can I cancel anytime?"
              a="Yes. No contracts, no hidden fees. Cancel with one click. Your free plan continues with limited features."
            />
            <FAQItem 
              q="How quickly can I see results?"
              a="Most users launch their first AI-optimized campaign within 30 minutes. Performance improvements typically show within 3-7 days of AI optimization."
            />
          </div>
        </div>
      </section>

      {/* --- Section: Transformation --- */}
      <section className="py-[120px] px-6 bg-[#8B5CF6] text-white text-center">
        <div className="max-w-[800px] mx-auto space-y-6">
          <h2 className="text-[36px] md:text-[54px] font-bold tracking-tight leading-tight">Transform how you advertise—and get your life back.</h2>
          <p className="text-2xl font-bold opacity-80 italic">For real this time.</p>
        </div>
      </section>

      {/* --- Section: Final CTA --- */}
      <section className="py-[140px] px-6 bg-[#0A0A0F] text-center">
        <div className="max-w-[800px] mx-auto space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Ready to feel in control again?</h2>
            <p className="text-xl text-[#A1A1AA]">Join 1,000+ marketers who fixed their ad chaos. <br/>Your first 14 days are free.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto px-10 py-5 bg-[#8B5CF6] text-white rounded-2xl text-[18px] font-bold shadow-2xl shadow-[#8B5CF6]/40 hover:bg-[#7C3AED] hover:-translate-y-1 transition-all group"
            >
              Start Free Trial <ArrowRight size={20} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl text-[18px] font-bold hover:bg-white/10 transition-all">
              Book a Demo
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-[12px] font-bold text-[#52525B] uppercase tracking-widest">
            <div className="flex items-center gap-2"><Check size={16} className="text-[#10B981]" /> No credit card required</div>
            <div className="flex items-center gap-2"><Check size={16} className="text-[#10B981]" /> Cancel anytime</div>
            <div className="flex items-center gap-2"><Check size={16} className="text-[#10B981]" /> Setup in 5 minutes</div>
          </div>
        </div>
      </section>

      {/* --- Section: Footer --- */}
      <footer className="py-20 px-6 border-t border-white/5 bg-[#0A0A0F]">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-4 gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm">Z</div>
              <span className="text-xl font-bold tracking-tight text-white font-display">ZieAds</span>
            </div>
            <p className="text-sm leading-relaxed text-[#71717A] font-medium">
              The intelligent ad command center for high-growth brands. Built for speed, scaled with AI.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="text-[12px] font-black uppercase text-white tracking-widest">Product</div>
            <ul className="space-y-4 text-sm text-[#71717A] font-medium">
              <li className="hover:text-white transition-colors cursor-pointer">Features</li>
              <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
              <li className="hover:text-white transition-colors cursor-pointer">Integrations</li>
              <li className="hover:text-white transition-colors cursor-pointer">Changelog</li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="text-[12px] font-black uppercase text-white tracking-widest">Company</div>
            <ul className="space-y-4 text-sm text-[#71717A] font-medium">
              <li className="hover:text-white transition-colors cursor-pointer">About</li>
              <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
              <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
              <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="text-[12px] font-black uppercase text-white tracking-widest">Legal</div>
            <ul className="space-y-4 text-sm text-[#71717A] font-medium">
              <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-white transition-colors cursor-pointer">Cookie Policy</li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto mt-20 pt-8 border-t border-white/5 text-[12px] font-bold text-[#52525B] text-center">
          © 2025 ZieAds. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const CounterCard = ({ icon, value, prefix = "", suffix = "", label, delay }: any) => (
  <MotionDiv 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6, ease: smooth }}
    className="w-full md:w-[280px] p-8 bg-[#14141B] border border-white/5 rounded-[32px] text-left shadow-2xl relative group overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full group-hover:bg-[#8B5CF6]/5 transition-colors" />
    <div className="mb-6">{icon}</div>
    <div className="text-[42px] font-bold text-white mb-2 tracking-tight">
      <CountUp value={value} prefix={prefix} suffix={suffix} delay={delay + 0.2} />
    </div>
    <p className="text-[14px] text-[#71717A] leading-relaxed font-medium">{label}</p>
  </MotionDiv>
);

const PainCard = ({ icon, colors, title, desc, question }: any) => (
  <MotionDiv
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, ease: smooth }}
    whileHover={{ y: -10, borderColor: 'rgba(139,92,246,0.3)' }}
    className="w-full md:w-[370px] p-10 bg-[#14141B] border border-white/5 rounded-[40px] flex flex-col gap-10 transition-all duration-500 relative group"
  >
    <div 
      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
    >
      {icon}
    </div>
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
      <p className="text-[16px] text-[#A1A1AA] leading-relaxed font-normal">{desc}</p>
    </div>
    <p className="mt-auto text-[15px] font-bold italic text-[#8B5CF6]">{question}</p>
  </MotionDiv>
);

const ValueProp = ({ label, title, subtitle, body, image, reverse }: any) => (
  <div className={`flex flex-col lg:flex-row items-center gap-20 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
    <div className="flex-1 space-y-8">
      <div className="text-[12px] font-black tracking-[0.3em] text-[#8B5CF6] uppercase">{label}</div>
      <div className="space-y-4">
        <h3 className="text-[42px] font-bold text-white tracking-tight leading-[1.1]">{title}</h3>
        <p className="text-[20px] font-bold text-[#8B5CF6] opacity-80">{subtitle}</p>
      </div>
      <p className="text-lg text-[#A1A1AA] leading-relaxed">{body}</p>
    </div>
    <div className="flex-1 w-full relative">
       <div className="absolute inset-0 bg-[#8B5CF6]/10 blur-[100px] rounded-full" />
       <div className="relative aspect-[4/3] bg-[#0A0A0F] border border-white/5 rounded-[48px] overflow-hidden shadow-2xl p-4">
          <div className="w-full h-full rounded-[32px] bg-[#14141B] border border-white/5 overflow-hidden">
             {image}
          </div>
       </div>
    </div>
  </div>
);

const FeatureCard = ({ title, desc, points, icon }: any) => (
  <div className="p-10 bg-[#14141B] border border-white/5 rounded-[48px] space-y-8 hover:border-[#8B5CF6]/30 transition-all duration-500 group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
    </div>
    <p className="text-lg text-[#A1A1AA] leading-relaxed">{desc}</p>
    <ul className="space-y-3 pt-6 border-t border-white/5">
      {points.map((p: string) => (
        <li key={p} className="flex items-center gap-3 text-sm font-bold text-[#F8FAFC]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> {p}
        </li>
      ))}
    </ul>
  </div>
);

const TestimonialCard = ({ quote, name, role }: any) => (
  <div className="p-10 bg-[#14141B] border border-white/5 rounded-[40px] text-left space-y-10 relative h-full flex flex-col">
    <Quote className="text-[#8B5CF6] opacity-20" size={48} />
    <p className="text-xl text-white font-medium leading-relaxed italic flex-1">"{quote}"</p>
    <div className="pt-8 border-t border-white/5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/20 border border-white/10 flex items-center justify-center font-bold text-[#8B5CF6]">
        {name[0]}
      </div>
      <div>
        <p className="font-bold text-white">{name}</p>
        <p className="text-xs font-bold text-[#52525B] uppercase tracking-widest">{role}</p>
      </div>
    </div>
  </div>
);

const PricingCard = ({ title, subtitle, price, features, cta, popular, onClick }: any) => (
  <div className={`p-10 rounded-[48px] border flex flex-col relative h-full transition-all duration-500 ${
    popular 
    ? 'bg-[#1E1B4B] border-[#8B5CF6] shadow-2xl shadow-purple-500/10 scale-[1.05] z-10' 
    : 'bg-[#14141B] border-white/5 hover:border-white/10'
  }`}>
    {popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#8B5CF6] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
        Most Popular
      </div>
    )}
    <div className="space-y-2 mb-8">
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="text-sm font-bold text-[#52525B] uppercase tracking-widest">{subtitle}</p>
    </div>
    <div className="flex items-baseline gap-1 mb-10">
      <span className="text-2xl font-bold text-[#52525B]">$</span>
      <span className="text-[64px] font-bold text-white leading-none">{price}</span>
      {price !== "0" && <span className="text-lg font-bold text-[#52525B]">/mo</span>}
    </div>
    <ul className="space-y-5 mb-12 flex-1">
      {features.map((f: string) => (
        <li key={f} className="flex items-center gap-3 text-sm font-bold text-[#A1A1AA]">
          <Check size={16} className="text-[#10B981]" /> {f}
        </li>
      ))}
    </ul>
    <button 
      onClick={onClick}
      className={`w-full py-5 rounded-2xl font-bold transition-all ${
        popular 
        ? 'bg-[#8B5CF6] text-white shadow-xl shadow-purple-500/20 hover:bg-[#7C3AED]' 
        : 'bg-white/5 text-white hover:bg-white/10'
      }`}
    >
      {cta}
    </button>
  </div>
);

const FAQItem = ({ q, a }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#14141B] border border-white/5 rounded-2xl overflow-hidden">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full p-6 flex items-center justify-between text-left group"
      >
        <span className="text-[17px] font-bold text-white pr-8 group-hover:text-[#8B5CF6] transition-colors">{q}</span>
        <ChevronDown size={20} className={`text-[#52525B] transition-transform duration-500 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <MotionDiv 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6 overflow-hidden"
          >
            <p className="text-[15px] text-[#A1A1AA] leading-relaxed">{a}</p>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

const StepCard = ({ num, title, desc, icon }: any) => (
  <div className="space-y-8 p-6 group">
    <div className="flex items-center gap-6">
      <div className="text-[48px] font-bold text-white/5 group-hover:text-[#8B5CF6]/20 transition-colors font-mono">{num}</div>
      <div className="w-px h-12 bg-white/5" />
      <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/5 flex items-center justify-center text-[#8B5CF6]">
        {icon}
      </div>
    </div>
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-[#A1A1AA] leading-relaxed">{desc}</p>
    </div>
  </div>
);

// --- Visual Asset Placeholders ---

const CreativeGrid = () => (
  <div className="w-full h-full grid grid-cols-2 gap-4 p-8">
     {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white/5 rounded-2xl border border-white/5 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
     ))}
  </div>
);

const OptimizationMonitor = () => (
  <div className="w-full h-full flex flex-col p-8 gap-4">
     <div className="h-2 w-32 bg-[#8B5CF6]/20 rounded-full" />
     <div className="flex-1 flex items-end gap-2">
        {[40, 60, 30, 80, 50, 90, 45].map((h, i) => (
           <div key={i} className="flex-1 bg-[#10B981]/20 rounded-lg transition-all duration-1000" style={{ height: `${h}%` }} />
        ))}
     </div>
  </div>
);

const SpeedLauncher = () => (
  <div className="w-full h-full flex items-center justify-center p-8">
     <div className="w-24 h-24 rounded-full border-4 border-[#8B5CF6]/30 flex items-center justify-center relative">
        <div className="absolute inset-0 border-4 border-[#8B5CF6] rounded-full border-t-transparent animate-spin" />
        <Zap className="text-[#8B5CF6]" size={32} />
     </div>
  </div>
);

const AdvantageVisual = () => (
  <div className="w-full h-full flex items-center justify-center p-8">
     <div className="relative w-48 h-48">
        <div className="absolute inset-0 bg-[#8B5CF6] rounded-full animate-ping opacity-20" />
        <div className="absolute inset-0 bg-[#8B5CF6] rounded-full scale-50" />
        <Lock className="absolute inset-0 m-auto text-white" size={32} />
     </div>
  </div>
);

export default LandingPage;
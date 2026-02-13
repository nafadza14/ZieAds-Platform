
import React, { useRef, useState, useEffect } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useInView,
  AnimatePresence,
  Variants
} from 'framer-motion';
import { 
  ArrowRight, Target, Zap, Globe, 
  PlayCircle, BarChart3, Layout, 
  CheckCircle2, X, Shield, Rocket, 
  TrendingUp, Sparkles, Smartphone,
  Users, Layers, Quote, ChevronRight,
  MousePointer2, Search, ZapOff,
  Star, Code2, Heart, ChevronLeft,
  Facebook,
  Chrome,
  Plus,
  Minus,
  MessageCircle,
  Instagram
} from 'lucide-react';

const LOGO_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgNTAiPgogIDxyZWN0IHg9IjYwIiB5PSI1IiB3aWR0aD0iOTUiIGhlaWdodD0iNDAiIGZpbGw9IiMxNEI4QTYiLz4KICA8dGV4dCB4PSIwIiB5PSIzOCIgZmlsbD0iIzE0QjhBNiIgc3R5bGU9ImZvbnQ6Ym9sZCAzOHB4ICdQbHVzIEpha2FydGEgU2FucycsIHNhbnMtc2VyaWYiPlppZTwvdGV4dD4KICA8dGV4dCB4PSI2NSIgeT0iMzgiIGZpbGw9IiNmZmZmZmYiIHN0eWxlPSJmb250OmJvbGQgMzhweCAnUGx1cyBKYWthcnRhIFNhbnMnLCBzYW5zLXNlcmlmIj5BZHMuPC90ZXh0Pgo8L3N2Zz4=";

/* --- Shared Animation Variants --- */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const floating: Variants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

/* --- Component Helpers --- */

const Nav = ({ onLogin }: { onLogin: () => void }) => (
  <nav className="absolute top-0 left-0 right-0 z-[100] px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
    <div className="flex items-center">
      <img src={LOGO_URL} alt="ZieAds Logo" className="h-10 md:h-12 w-auto object-contain hover:scale-105 transition-transform cursor-pointer" />
    </div>
    <div className="hidden md:flex items-center gap-8 font-sans font-medium text-[0.875rem] tracking-[0.01em] text-slate-600">
      {["Features", "Integrations", "Pricing", "FAQ"].map((item) => (
        <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-primary transition-colors uppercase tracking-widest">{item}</a>
      ))}
    </div>
    <div className="flex items-center gap-4">
      <button onClick={onLogin} className="text-[0.938rem] font-sans font-semibold text-primary hover:text-primary-dark transition-colors px-4">Login</button>
      <button onClick={onLogin} className="tosca-bg text-white px-6 py-2.5 rounded-full text-[0.938rem] font-sans font-semibold shadow-xl shadow-teal-500/10 hover:scale-105 active:scale-95 transition-all">Start Free Trial</button>
    </div>
  </nav>
);

/* --- Sub-Components for Hero Animation --- */

const FloatingBrandLogo = ({ src, delay = 0, initialX = 0, initialY = 0 }: { src: string, delay?: number, initialX?: number, initialY?: number }) => {
  return (
    <motion.div
      initial={{ x: initialX, y: initialY, opacity: 0, scale: 0.8 }}
      animate={{ 
        // Large-scale drifting across the screen
        x: [
          initialX, 
          initialX + (Math.random() * 300 - 150), 
          initialX + (Math.random() * 400 - 200), 
          initialX + (Math.random() * 200 - 100), 
          initialX
        ],
        y: [
          initialY, 
          initialY + (Math.random() * 300 - 150), 
          initialY - (Math.random() * 400 - 200), 
          initialY + (Math.random() * 200 - 100), 
          initialY
        ],
        opacity: [0, 0.4, 0.5, 0.4, 0],
        rotate: [0, Math.random() * 40 - 20, Math.random() * -40 + 20, Math.random() * 20, 0],
        scale: [0.8, 1.2, 0.9, 1.1, 0.8]
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
      className="absolute z-0 pointer-events-none hidden lg:block opacity-20 grayscale"
    >
      <img 
        src={src} 
        alt="Platform" 
        className="h-24 md:h-32 w-auto object-contain brightness-90 drop-shadow-[0_10px_30px_rgba(0,0,0,0.1)]" 
      />
    </motion.div>
  );
};

const GlowingCTAButton = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <motion.div 
      variants={fadeUp}
      className="relative group p-[6px] rounded-[26px] overflow-hidden shadow-2xl"
    >
      {/* Moving border trail - Primary color for contrast on white */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-400%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(20,184,166,0.1)_10%,rgba(20,184,166,0.9)_20%,#14B8A6_21%,transparent_22%)] opacity-100"
      />
      
      {/* Extra glow layer */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-400%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(20,184,166,0.4)_15%,#14B8A6_20%,transparent_25%)] opacity-100 blur-2xl"
      />

      <button 
        onClick={onLogin} 
        className="relative px-12 py-6 rounded-[20px] tosca-bg text-white font-sans font-semibold text-[0.938rem] hover:scale-[1.01] active:scale-95 transition-all flex items-center gap-3 z-10"
      >
        Start Free Trial — 14 Days <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

/* --- Sections --- */

const Hero = ({ onLogin }: { onLogin: () => void }) => {
  const logos = {
    meta: "https://logoeps.com/wp-content/uploads/2021/10/meta-logoeps.com_.png",
    bing: "https://e7.pngegg.com/pngimages/38/73/png-clipart-logo-bing-ads-advertising-marketing-marketing-blue-text.png",
    tiktok: "https://www.loomdigital.co.uk/wp-content/uploads/2024/07/tiktok-ads-logo-300x157.png",
    google: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Ads_logo.svg/1280px-Google_Ads_logo.svg.png",
    linkedin: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/3840px-LinkedIn_icon.svg.png"
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 overflow-hidden text-center px-6">
      <Nav onLogin={onLogin} />
      
      {/* Platform Branding Animation */}
      <FloatingBrandLogo src={logos.meta} delay={0} initialX={-600} initialY={-250} />
      <FloatingBrandLogo src={logos.google} delay={2} initialX={550} initialY={-300} />
      <FloatingBrandLogo src={logos.tiktok} delay={4} initialX={-700} initialY={150} />
      <FloatingBrandLogo src={logos.bing} delay={6} initialX={650} initialY={250} />
      <FloatingBrandLogo src={logos.linkedin} delay={1} initialX={400} initialY={400} />
      <FloatingBrandLogo src={logos.meta} delay={8} initialX={-500} initialY={350} />
      <FloatingBrandLogo src={logos.google} delay={3.5} initialX={-350} initialY={-400} />
      <FloatingBrandLogo src={logos.tiktok} delay={5} initialX={200} initialY={-450} />

      <motion.div variants={floating} animate="animate" className="absolute top-[20%] right-[10%] w-64 h-64 bg-teal-500/5 blur-[100px] rounded-full z-0" />
      <motion.div variants={floating} animate="animate" className="absolute bottom-[20%] left-[5%] w-80 h-80 bg-teal-300/10 blur-[120px] rounded-full z-0" />
      
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-7xl relative z-10 space-y-10">
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 backdrop-blur-md border border-teal-100 font-sans font-medium text-[0.75rem] text-primary uppercase tracking-[0.05em] mb-4">
          <Sparkles size={14} className="text-primary" /> AI-First Multi-Platform Advertising
        </motion.div>
        
        <motion.h1 
          variants={fadeUp} 
          className="font-display font-extrabold text-[clamp(4rem,9vw,6.5rem)] tracking-[-0.04em] leading-[1.05] tosca-text"
          style={{ textShadow: '0 4px 15px rgba(20,184,166,0.1)' }}
        >
          Create Ads That<br/>Convert, Effortlessly.
        </motion.h1>
        
        <motion.p 
          variants={fadeUp} 
          className="font-sans font-normal text-[1.125rem] md:text-[1.375rem] leading-[1.7] text-slate-500 max-w-3xl mx-auto"
        >
          Build winning campaigns in minutes across Meta, Google, TikTok, and more—even if you've never run ads before. The future of automated growth is here.
        </motion.p>
        
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <GlowingCTAButton onLogin={onLogin} />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Section 2: Visual Showcase (Seen our work)
const VisualShowcase = () => {
  const works = [
    { brand: "HERMÈS", location: "PARIS", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600" },
    { brand: "HayBud", location: "Hemp Gel", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600" },
    { brand: "BLUME", location: "SOOTHE & HYDRATE", image: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&q=80&w=600" },
    { brand: "backed beauty", location: "", image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=600" },
    { brand: "CHANEL", location: "COSMETICS", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600" }
  ];

  const carouselItems = [...works, ...works, ...works];

  return (
    <section className="py-24 md:py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center lg:text-left">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-bold text-[3rem] tracking-[-0.03em] text-[#111827] leading-tight mb-8"
        >
          Create your simple ads.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-sans font-normal text-[1.125rem] leading-[1.8] text-[#64748B] max-w-4xl mb-12"
        >
          High-performance advertising doesn't need to be complex. ZieAds simplifies the entire creative and distribution process by leveraging advanced neural networks that understand your specific business objectives. By removing the technical barriers of ad management, we empower every brand to produce agency-quality content that speaks directly to their audience. Our platform doesn't just generate images and text; it synthesizes a coherent marketing strategy tailored to the unique algorithms of Meta, Google, and TikTok. Launch impactful campaigns that actually drive revenue, all while reducing your manual overhead by up to 90%. Simple, smart, and built for conversion.
        </motion.p>
      </div>

      <div className="relative">
        <motion.div 
          className="flex gap-6 px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {carouselItems.map((item, i) => (
            <div key={i} className="min-w-[260px] md:min-w-[320px] aspect-[3/4] rounded-[32px] overflow-hidden relative shadow-lg shrink-0">
              <img src={item.image} alt={item.brand} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center bg-gradient-to-t from-black/30 via-transparent to-transparent">
                <h3 className="font-display font-bold text-xl text-white tracking-[0.2em] uppercase drop-shadow-md">{item.brand}</h3>
                <p className="font-sans font-medium text-[0.75rem] tracking-[0.4em] text-white/80 uppercase mt-1">{item.location}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Section 3: Workflow
const WorkflowSteps = () => {
  const steps = [
    { title: "Choose Platform", desc: "Select from Meta, Google, TikTok and more." },
    { title: "Set Goal", desc: "AI optimizes for your specific business objective." },
    { title: "Find Audience", desc: "Smart targeting based on your industry data." },
    { title: "Generate Ads", desc: "AI creates 5 high-converting variations." },
    { title: "One-Click Publish", desc: "Go live globally in under 5 minutes." }
  ];
  return (
    <section id="features" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <p className="font-sans font-medium text-[0.75rem] tracking-[0.05em] uppercase text-primary">The Process</p>
            <h2 className="font-display font-bold text-[2.5rem] md:text-[3rem] tracking-[-0.03em] text-[#111827] leading-none">Professional ads in 5 minutes.</h2>
            <div className="space-y-8">
              {steps.map((s, i) => (
                <motion.div key={i} whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -20 }} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-2xl tosca-bg flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-teal-500/20">{i + 1}</div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-[#111827]">{s.title}</h3>
                    <p className="font-sans font-normal text-[#94A3B8] leading-[1.7]">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative p-8 bg-slate-50 rounded-[48px] shadow-2xl border border-slate-100 flex items-center justify-center">
             <div className="space-y-6 w-full max-sm:max-w-sm">
                <div className="w-full h-48 bg-slate-200 rounded-3xl animate-pulse" />
                <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                <div className="h-4 bg-slate-200 rounded-full w-1/2" />
                <div className="pt-4 flex gap-4">
                   <div className="h-12 flex-1 rounded-2xl tosca-bg opacity-20" />
                   <div className="h-12 flex-1 rounded-2xl bg-slate-900 opacity-10" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Section 4: All-in-One Tool Overview
const ToolOverview = () => (
  <section className="py-24 md:py-32 bg-slate-50 text-center">
    <div className="max-w-5xl mx-auto px-6 space-y-12">
      <h2 className="font-display font-bold text-[2rem] md:text-[3rem] tracking-[-0.03em] text-[#111827]">Every content type.<br/><span className="tosca-text">One Engine.</span></h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Search Ads", icon: Search },
          { label: "Video Creative", icon: PlayCircle },
          { label: "Carousel Ads", icon: Layers },
          { label: "Display Banners", icon: Layout }
        ].map((item) => (
          <div key={item.label} className="p-8 md:p-10 rounded-[40px] bg-white border border-slate-100 hover:scale-105 transition-all duration-500 group">
            <item.icon className="mx-auto mb-6 text-slate-400 group-hover:text-primary transition-colors" size={40} />
            <h4 className="font-sans font-semibold text-[#111827] text-sm md:text-lg">{item.label}</h4>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Section 5: Brand DNA / Value propositions
const BrandDNA = () => (
  <section className="py-24 md:py-32 bg-[#0F172A] text-white overflow-hidden relative">
    <div className="absolute top-0 right-0 w-96 h-96 tosca-bg/10 blur-[150px] rounded-full" />
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
      <div className="space-y-8">
        <p className="font-sans font-medium text-[0.75rem] tracking-[0.05em] uppercase text-teal-400">Values & Vision</p>
        <h2 className="font-display font-bold text-[2rem] md:text-[3rem] tracking-[-0.03em] leading-none">AI that understands your brand voice.</h2>
        <p className="font-sans font-normal text-[1.125rem] leading-[1.7] text-[#94A3B8] max-w-lg">Our engine analyzes your website DNA to ensure every generated ad feels natively like you—only more professional.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {["Brand Consistency", "Zero Guesswork", "Infinite Iterations", "Agency Quality"].map(v => (
             <div key={v} className="flex items-center gap-3 font-sans font-semibold text-[0.938rem]"><CheckCircle2 size={18} className="text-teal-400" /> {v}</div>
           ))}
        </div>
      </div>
      <div className="p-12 bg-white/5 border border-white/10 rounded-[64px] backdrop-blur-xl">
         <Sparkles size={64} className="text-teal-400 mb-8" />
         <p className="font-display font-bold text-2xl italic leading-tight">"We stripped away the complexity and replaced it with powerful AI that understands your goals."</p>
      </div>
    </div>
  </section>
);

// Section 6: Target audience / Use-case blocks
const AudienceBlocks = () => (
  <section className="py-24 md:py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="font-display font-bold text-[2.5rem] md:text-[3.5rem] tracking-[-0.03em] text-[#111827] mb-16 text-center">Built for every stage.</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: "E-commerce", icon: ShoppingBagIcon, desc: "Scale sales with automated product creative and dynamic retargeting." },
          { title: "Local Business", icon: MapPinIcon, desc: "Attract foot traffic and local leads with geo-targeted optimization." },
          { title: "Marketing Agencies", icon: BriefcaseIcon, desc: "Manage 10x more clients with bulk creation and white-label reporting." }
        ].map((item, i) => (
          <div key={i} className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 flex flex-col gap-6 hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 rounded-2xl tosca-bg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
               <item.icon size={32} />
            </div>
            <h3 className="font-display font-bold text-2xl text-[#111827] tracking-tight">{item.title}</h3>
            <p className="font-sans font-normal text-[1.125rem] leading-[1.7] text-[#94A3B8]">{item.desc}</p>
            <ArrowRight className="mt-4 text-primary group-hover:translate-x-2 transition-transform" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Simple Icons for blocks
const ShoppingBagIcon = (props: any) => <Globe {...props} />;
const MapPinIcon = (props: any) => <Target {...props} />;
const BriefcaseIcon = (props: any) => <Users {...props} />;

// Section 7: AI Content Intelligence statistics
const AIStats = () => (
  <section className="py-24 md:py-32 bg-slate-50">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
      {[
        { val: "5.8x", label: "Avg ROAS Increase", desc: "For e-commerce partners" },
        { val: "40%", label: "Conversion Lift", desc: "Across search campaigns" },
        { val: "10h+", label: "Saved Weekly", desc: "Per marketing manager" }
      ].map((s, i) => (
        <motion.div key={i} whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.9 }} className="space-y-4">
          <p className="font-display font-extrabold text-7xl tosca-text tracking-tighter tabular-nums">{s.val}</p>
          <div className="space-y-1">
            <p className="font-display font-bold text-lg text-[#111827]">{s.label}</p>
            <p className="font-sans font-normal text-[#94A3B8] leading-[1.7] text-sm tracking-tight">{s.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

// Section 8: Platform / integration showcase
const Integrations = () => (
  <section id="integrations" className="py-24 md:py-32 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 text-center mb-16 space-y-4">
      <p className="font-sans font-medium text-[0.75rem] tracking-[0.05em] uppercase text-[#64748B]">Native Connectivity</p>
      <h2 className="font-display font-bold text-[2rem] md:text-[3rem] tracking-[-0.03em] text-[#111827]">Connect in one click.</h2>
    </div>
    <div className="flex justify-center gap-12 md:gap-24 items-center grayscale opacity-40 px-10">
       {[
         { name: "Meta", icon: Facebook },
         { name: "Google", icon: Chrome },
         { name: "Instagram", icon: Instagram },
         { name: "TikTok", icon: Smartphone },
         { name: "X", icon: MessageCircle }
       ].map(p => (
         <div key={p.name} className="flex flex-col items-center gap-2">
            <p.icon size={48} strokeWidth={1} />
            <span className="font-sans font-medium text-[0.75rem] uppercase tracking-[0.05em] text-[#64748B]">{p.name}</span>
         </div>
       ))}
    </div>
  </section>
);

// Section 9: Team & brand story section
const BrandStory = () => (
  <section className="py-24 md:py-32 bg-slate-50">
    <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
      <Heart className="mx-auto text-red-400 animate-pulse" size={48} />
      <h2 className="font-display font-bold text-[2rem] md:text-[3rem] tracking-[-0.03em] text-[#111827]">Born to democratize growth.</h2>
      <p className="font-sans font-normal text-[1.125rem] leading-[1.7] text-[#94A3B8]">ZieAds was founded by a collective of growth hackers and full-stack engineers who saw a problem: professional advertising was a luxury. We believed that every founder, regardless of budget, deserves agency-quality results driven by AI intelligence.</p>
    </div>
  </section>
);

// Section 10: Testimonials / Reviews section
const Testimonials = () => (
  <section className="py-24 md:py-32 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
      <h2 className="font-display font-bold text-[2rem] md:text-[3rem] tracking-[-0.03em] text-[#111827]">The new standard.</h2>
    </div>
    <div className="flex whitespace-nowrap overflow-hidden">
       <motion.div 
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex gap-8 px-6"
       >
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="min-w-[340px] md:min-w-[400px] p-10 bg-slate-50 rounded-[40px] border border-slate-100 flex flex-col gap-6 whitespace-normal">
               <Quote className="text-primary opacity-20" size={32} />
               <p className="font-sans font-normal text-[1.125rem] leading-[1.7] text-[#1F2937] italic">"ZieAds completely replaced our agency spend. We now launch 10x more ads with a fraction of the budget and zero manual work."</p>
               <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-slate-200" />
                  <div>
                    <p className="font-sans font-semibold text-[#111827]">Founder @ TechStart</p>
                    <p className="font-sans font-medium text-[0.75rem] uppercase tracking-[0.05em] text-[#64748B]">Growth Agency</p>
                  </div>
               </div>
            </div>
          ))}
       </motion.div>
    </div>
  </section>
);

// Section 11: FAQ
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const questions = [
    { q: "How does the AI create my ads?", a: "ZieAds scans your website to understand your product, brand voice, and colors. It then uses advanced language and vision models to synthesize copy and visual layouts optimized for high conversion." },
    { q: "Can I use it for multiple platforms?", a: "Yes! You can manage Meta (FB/IG), Google Search, TikTok, and Bing Ads all from one unified dashboard." },
    { q: "Is there a free trial?", a: "We offer a 14-day full-access trial. No credit card is required to explore our AI creation engine." },
    { q: "Do I own the creative assets?", a: "Absolutely. Any ad copy or creative variation generated by ZieAds is 100% yours to keep and use across any channel." }
  ];

  return (
    <section id="faq" className="py-24 md:py-32 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display font-bold text-[2rem] md:text-[3rem] tracking-[-0.03em] text-[#111827] text-center mb-16">Common questions.</h2>
        <div className="space-y-4">
          {questions.map((item, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm transition-all hover:shadow-md">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between"
              >
                <span className="font-sans font-semibold text-[#111827] text-[1rem] md:text-[1.125rem]">{item.q}</span>
                {openIndex === i ? <Minus size={20} className="text-primary" /> : <Plus size={20} className="text-slate-300" />}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 font-sans font-normal text-[1.125rem] leading-[1.7] text-[#94A3B8]">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Section 12: Footer
const MegaFooter = () => (
  <footer className="py-24 bg-[#0F172A] text-white border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-5 gap-16">
      <div className="lg:col-span-1 space-y-8">
        <div className="flex items-center">
          <img src={LOGO_URL} alt="ZieAds Logo" className="h-10 w-auto object-contain" />
        </div>
        <p className="font-sans font-normal text-sm leading-[1.7] text-[#94A3B8]">The world's simplest AI advertising engine. Scale your growth without the agency fee.</p>
      </div>
      <div>
        <h4 className="font-sans font-medium text-[0.75rem] uppercase tracking-[0.05em] text-[#64748B] mb-8">Product</h4>
        <ul className="space-y-4 font-sans font-medium text-[0.875rem] text-[#CBD5E1]">
          <li><a href="#" className="hover:text-primary transition-colors">AI Creator</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Fraud Protection</a></li>
          <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-sans font-medium text-[0.75rem] uppercase tracking-[0.05em] text-[#64748B] mb-8">Resources</h4>
        <ul className="space-y-4 font-sans font-medium text-[0.875rem] text-[#CBD5E1]">
          <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-sans font-medium text-[0.75rem] uppercase tracking-[0.05em] text-[#64748B] mb-8">Company</h4>
        <ul className="space-y-4 font-sans font-medium text-[0.875rem] text-[#CBD5E1]">
          <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-sans font-medium text-[0.75rem] uppercase tracking-[0.05em] text-[#64748B] mb-8">Legal</h4>
        <ul className="space-y-4 font-sans font-medium text-[0.875rem] text-[#CBD5E1]">
          <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 text-center font-sans font-medium text-[0.75rem] uppercase tracking-[0.05em] text-[#64748B]">
      © 2025 ZieAds Global. Built for growth.
    </div>
  </footer>
);

/* --- Main Export --- */

const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="relative selection:bg-teal-100 selection:text-teal-900">
      {/* Animated Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 tosca-bg z-[200] origin-left"
        style={{ scaleX: smoothProgress }}
      />

      <Hero onLogin={onLogin} />
      <VisualShowcase />
      <WorkflowSteps />
      <ToolOverview />
      <BrandDNA />
      <AudienceBlocks />
      <AIStats />
      <Integrations />
      <BrandStory />
      <Testimonials />
      <FAQ />
      <MegaFooter />
    </div>
  );
};

export default LandingPage;

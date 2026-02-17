
import React, { useState, useEffect } from 'react';
import { 
  motion, 
  Variants,
  AnimatePresence
} from 'framer-motion';
import { 
  ArrowRight, Target, Zap, Globe, 
  PlayCircle, BarChart3, 
  CheckCircle2, Shield, Rocket, 
  TrendingUp, Sparkles, Smartphone,
  Users, Layers, Facebook, 
  Fingerprint, Palette, MousePointer2,
  AlertCircle, DollarSign, ChevronRight,
  Video, Eye, RefreshCw, Check,
  MoreHorizontal, Plus, Minus,
  Play
} from 'lucide-react';

const LOGO_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMjAgMTAwIj4KICA8dGV4dCB4PSI1IiB5PSI3NSIgZmlsbD0iIzE0QjhBNiIgZm9udC1mYW1pbHk9IlBsdXMgSmFrYXJ0YSBTYW5zLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iODAwIiBmb250LXNpemU9IjcwIj5aaWU8L3RleHQ+CiAgPHJlY3QgeD0iMTE1IiB5PSIxNSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSI3NSIgZmlsbD0iIzE0QjhBNiIgLz4KICA8dGV4dCB4PSIxMjUiIHk4Ijc1IiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IlBsdXMgSmFrYXJ0YSBTYW5zLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iODAwIiBmb250LXNpemU9IjcwIj5BZHMuPC90ZXh0Pgo8L3N2Zz4=";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] } 
  }
};

/* --- Global Components --- */

const Container = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`max-w-7xl mx-auto px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

const Header = ({ onLogin }: { onLogin: () => void }) => (
  <nav className="absolute top-0 left-0 right-0 z-[100] transition-all">
    <Container className="py-8 flex items-center justify-between">
      <div className="flex items-center">
        <a href="/" className="flex items-center group transition-transform hover:scale-105 active:scale-95">
          <img src={LOGO_URL} alt="ZieAds Logo" className="h-10 md:h-12 w-auto object-contain" />
        </a>
      </div>
      
      <div className="flex items-center gap-10 ml-auto">
        <div className="hidden lg:flex items-center gap-8 font-sans font-bold text-[11px] uppercase tracking-widest text-slate-500">
          <a href="/" className="text-primary">Home</a>
          {["Features", "Process", "Pricing", "FAQ"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-primary transition-colors">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onLogin} className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:text-primary transition-colors">Login</button>
          <button onClick={onLogin} className="tosca-bg text-white px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all">Start Free Trial</button>
        </div>
      </div>
    </Container>
  </nav>
);

/* --- Creative Showcase Component (Hero Content) --- */

const AdCreativeShowcase = () => {
  const [index, setIndex] = useState(0);
  
  const cards = [
    {
      id: 'poster1',
      image: "https://i.pinimg.com/1200x/e3/0b/18/e30b1879ae895910700b80c6d1b3e9a8.jpg"
    },
    {
      id: 'poster2',
      image: "https://i.pinimg.com/736x/51/dc/19/51dc193a3371daf20584a2f688366e76.jpg"
    },
    {
      id: 'poster3',
      image: "https://i.pinimg.com/736x/25/e1/6a/25e16aa2ca1e7d4bdc2ef1e707c45571.jpg"
    },
    {
      id: 'poster4',
      image: "https://i.pinimg.com/1200x/42/48/04/42480418e29d8e60bfae22fa49cf6aef.jpg"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % cards.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [cards.length]);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      <div className="absolute inset-0 bg-primary/10 blur-[140px] rounded-full scale-110 animate-pulse"></div>
      <div className="relative w-full h-full flex items-center justify-center">
        {cards.map((card, i) => {
          const position = (i - index + cards.length) % cards.length;
          const zIndex = cards.length - position;
          const opacity = position === 0 ? 1 : position === 1 ? 0.7 : position === 2 ? 0.3 : 0;
          const scale = 1 - position * 0.12;
          const xOffset = position * 45;
          const yOffset = -position * 30;
          const rotate = position * 6;

          return (
            <motion.div
              key={card.id}
              initial={false}
              animate={{
                zIndex,
                opacity,
                scale,
                x: xOffset,
                y: yOffset,
                rotate,
                pointerEvents: position === 0 ? 'auto' : 'none',
                filter: position === 0 ? 'blur(0px)' : 'blur(2px)'
              }}
              transition={{
                duration: 1.2,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="absolute w-[260px] md:w-[300px] aspect-[3/4] rounded-[40px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.25)] overflow-hidden transition-all group/card"
            >
              <img src={card.image} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover/card:scale-110" alt="" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* --- Main Sections --- */

const Hero = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <section className="relative pt-32 pb-8 overflow-hidden bg-white dark:bg-slate-950 transition-colors">
      <Header onLogin={onLogin} />
      <Container>
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-8 text-left">
            <motion.h1 
              initial="hidden" animate="visible" variants={fadeUp}
              className="font-display font-extrabold text-[clamp(2rem,4.5vw,5.5rem)] leading-[1.05] tracking-tight text-slate-900 dark:text-white"
            >
              Run Smarter Ads. <br/><span className="tosca-text">Not More Ads.</span>
            </motion.h1>
            <motion.p 
              initial="hidden" animate="visible" variants={fadeUp}
              className="font-sans text-xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-medium"
            >
              ZieAds uses AI to monitor, optimize, and protect your budget. So you can focus on growth.
            </motion.p>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={onLogin} className="px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-[24px] shadow-2xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 text-lg">
                Generate My First Creative <ArrowRight size={22} />
              </button>
            </motion.div>
          </div>
          <div className="lg:col-span-6 relative">
             <AdCreativeShowcase />
          </div>
        </div>
      </Container>
    </section>
  );
};

const PortfolioSection = () => {
  const videoCards = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
      brand: "HERMES",
      sub: "High Conversion UGC",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
      brand: "SKIN PRO",
      sub: "Viral Skincare Ad",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=800",
      brand: "NEO FOOD",
      sub: "Fast-Food Hook",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800",
      brand: "VUE TECH",
      sub: "SaaS Demo Video",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800",
      brand: "CHRONO",
      sub: "Luxury Watch Reel",
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800",
      brand: "FIT FLOW",
      sub: "Viral Workout Ad",
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
      brand: "BEAN CO.",
      sub: "Morning Coffee Hook",
    }
  ];

  // For infinite scroll, we duplicate the list
  const duplicatedCards = [...videoCards, ...videoCards];

  return (
    <section className="pb-24 pt-0 bg-white dark:bg-slate-950 transition-colors overflow-hidden">
      <div className="w-full relative">
        <motion.div 
          className="flex gap-6 px-4"
          animate={{
            x: ["0%", "-50%"]
          }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity
          }}
        >
          {duplicatedCards.map((card, idx) => (
            <div key={`${card.id}-${idx}`} className="w-[240px] md:w-[280px] flex-shrink-0">
              <PortfolioCard 
                image={card.image}
                brand={card.brand}
                sub={card.sub}
                delay={0}
              />
            </div>
          ))}
        </motion.div>
      </div>

      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="pt-12 text-center"
        >
          <button className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 font-black rounded-3xl hover:border-primary transition-all shadow-xl shadow-slate-200/50 dark:shadow-black/50">
            Explore Video Library
          </button>
        </motion.div>
      </Container>
    </section>
  );
};

const PortfolioCard = ({ image, brand, sub, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="aspect-[9/16] rounded-[32px] overflow-hidden relative group cursor-pointer shadow-lg hover:shadow-2xl transition-all border border-slate-100 dark:border-slate-800"
  >
     <img src={image} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-125" alt={brand} />
     <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
     
     {/* Video Ad Overlays */}
     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white opacity-100 group-hover:scale-110 transition-transform">
           <Play fill="white" size={20} className="ml-1" />
        </div>
     </div>

     <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <div className="px-2.5 py-0.5 bg-teal-500 text-white text-[7px] font-black rounded-full uppercase tracking-widest shadow-lg">Video Ad</div>
        <div className="text-white/40"><MoreHorizontal size={14} /></div>
     </div>

     <div className="absolute bottom-5 left-5 right-5 space-y-1.5 pointer-events-none text-left">
        <h4 className="text-white font-display font-black text-lg leading-tight uppercase tracking-tighter drop-shadow-md">
           {brand}
        </h4>
        <p className="text-white/80 text-[9px] font-bold uppercase tracking-widest leading-tight">{sub}</p>
        <div className="h-0.5 w-full bg-white/20 rounded-full overflow-hidden mt-3">
           <div className="h-full bg-teal-500 w-1/3 group-hover:w-full transition-all duration-[3000ms]"></div>
        </div>
     </div>
  </motion.div>
);

const ProblemSection = () => (
  <section className="py-28 lg:py-36 bg-slate-50 dark:bg-slate-900 transition-colors">
    <Container className="text-center">
      <div className="max-w-2xl mx-auto space-y-4 mb-20">
        <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white">Why common advertising fails.</h2>
        <p className="text-slate-500 font-medium">Most brands waste 40% of their budget on bad creative and manual errors.</p>
      </div>
      <div className="grid md:grid-cols-4 gap-10">
        {[
          { icon: Target, title: "High CAC", desc: "Acquisition costs spiraling out of control." },
          { icon: Zap, title: "Ad Fatigue", desc: "Creative becomes stagnant and invisible." },
          { icon: Shield, title: "Click Fraud", desc: "Bots draining your daily ad budget." },
          { icon: Users, title: "Bad Targeting", desc: "Ads showing to the wrong demographic." }
        ].map((item, i) => (
          <div key={i} className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4 text-left transition-all hover:-translate-y-1">
             <item.icon className="text-primary" size={32} />
             <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">{item.title}</h4>
             <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

const StepProcess = () => (
  <section id="process" className="py-28 lg:py-36 bg-white dark:bg-slate-950 overflow-hidden transition-colors">
    <Container>
      <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white text-center mb-20">The 5-Step Synthesis</h2>
      <div className="relative flex flex-col lg:flex-row justify-between gap-8 lg:gap-0">
        <div className="absolute top-12 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 hidden lg:block z-0"></div>
        {[
          { title: "Select Platform", desc: "Choose Meta, Google or TikTok.", icon: Globe },
          { title: "Define Goal", desc: "Sales, Leads or Awareness.", icon: Target },
          { title: "Map Audience", desc: "AI finds high-intent buyers.", icon: Users },
          { title: "Synthesize Creative", desc: "Auto-generate 5 ad variants.", icon: Sparkles },
          { title: "Launch Node", desc: "Live globally in one click.", icon: Rocket }
        ].map((step, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left px-4 lg:w-1/5">
             <div className="w-24 h-24 rounded-full tosca-bg border-8 border-white dark:border-slate-950 flex items-center justify-center text-white shadow-xl mb-6 hover:scale-110 transition-transform">
                <step.icon size={32} />
             </div>
             <div className="space-y-2">
                <h4 className="font-display font-bold text-slate-900 dark:text-white tracking-tight">{step.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[180px] mx-auto lg:mx-0">{step.desc}</p>
             </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

const FeatureGrid = () => (
  <section id="features" className="py-28 lg:py-36 bg-slate-50 dark:bg-slate-900 transition-colors">
    <Container>
      <div className="text-center max-w-2xl mx-auto mb-20">
        <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white">Built for every stage of growth.</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-10">
        {[
          { title: "E-commerce Scale", desc: "Automate product creative and retargeting logic.", icon: Layers },
          { title: "Local Optimization", desc: "Hyper-targeted geo-fencing for foot traffic.", icon: Target },
          { title: "Agency Workflows", desc: "Manage 10x more clients with bulk node control.", icon: Users },
          { title: "Fraud Shield", desc: "Real-time behavioral protection for ad spend.", icon: Shield },
          { title: "Brand DNA", desc: "Engine learns your voice from your website.", icon: Fingerprint },
          { title: "Visual Logic", desc: "Advanced layout synthesis for all formats.", icon: Palette }
        ].map((f, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-slate-100 dark:border-slate-700 space-y-4 hover:shadow-xl transition-all">
             <div className="w-14 h-14 tosca-bg/10 rounded-2xl flex items-center justify-center text-primary">
                <f.icon size={28} />
             </div>
             <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">{f.title}</h4>
             <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does the AI DNA engine actually ensure brand consistency?",
      a: "Our engine doesn't just mimic keywords; it crawls your existing assets to understand your color theory, typography weighting, and narrative tone. It then applies these as strict constraints to every poster and video generated, ensuring they look like they came from your own design studio."
    },
    {
      q: "Which advertising platforms does ZieAds support natively?",
      a: "We offer full API integration with Meta (Facebook/Instagram), Google Ads (Search/Display/YouTube), and TikTok. We also support manual exports for platforms like LinkedIn, Pinterest, and X."
    },
    {
      q: "Do I need any previous design or marketing experience?",
      a: "None at all. ZieAds is built to take a simple goal—like 'Sell more coffee beans'—and handle the entire creative synthesis and technical placement. You just review and approve."
    },
    {
      q: "How fast can I go from a website scan to a live campaign?",
      a: "The initial DNA scan takes about 60 seconds. Generating creative variants takes another 30 seconds. With a connected ad account, you can be live globally in under 3 minutes."
    },
    {
      q: "How does the built-in Click Fraud Protection work?",
      a: "Our tracker monitors device fingerprints and behavioral patterns in real-time. If bot activity or repetitive clicking is detected, those IPs are automatically synced to your platform exclusion lists every 15 minutes."
    },
    {
      q: "Can I use ZieAds if I manage multiple clients as an agency?",
      a: "Yes! Our platform is designed with 'Nodes' (Businesses). You can manage dozens of client identities from a single dashboard, each with their own unique DNA and isolated ad accounts."
    },
    {
      q: "Is there a long-term commitment or contract?",
      a: "No. ZieAds operates on a flexible monthly or annual basis. You can start with our 14-day free trial (no credit card required) to test the engine before committing to a plan."
    }
  ];

  return (
    <section id="faq" className="py-28 lg:py-36 bg-slate-50 dark:bg-slate-900 transition-colors">
      <Container>
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
             <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white">Frequently Asked Questions</h2>
             <p className="text-slate-500 font-medium">Everything you need to know about the ZieAds engine.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between group"
                >
                  <span className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                    {openIndex === i ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-slate-500 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-50 dark:border-slate-700 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

const DashboardPreviewSection = () => (
  <section className="py-28 lg:py-36 bg-slate-900 dark:bg-black transition-colors relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full"></div>
    <Container className="text-center relative z-10">
      <div className="max-w-2xl mx-auto space-y-6 mb-20">
        <h2 className="font-display font-bold text-4xl text-white">Platform Command Center</h2>
        <p className="text-slate-400 font-medium">Full visibility into your growth signals with AI insights delivered daily.</p>
      </div>
      <div className="max-w-5xl mx-auto rounded-[40px] border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
         <DashboardUIPreview isDark />
      </div>
    </Container>
  </section>
);

const DashboardUIPreview = ({ isDark = false }: { isDark?: boolean }) => {
  return (
    <div className={`w-full h-full p-8 font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>
       <div className="space-y-8 text-left">
          <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-slate-800/50 border-white/5' : 'bg-slate-50/50 border-slate-100'} flex flex-col md:flex-row items-center gap-8`}>
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 tosca-bg rounded-2xl flex items-center justify-center text-white shadow-lg">
                   <Fingerprint size={28} />
                </div>
                <div>
                   <h3 className="font-bold text-lg">Stored DNA: Brand Pro</h3>
                   <p className="text-[12px] opacity-50 font-bold uppercase tracking-widest">Marketing Blueprint Active</p>
                </div>
             </div>
             <div className="md:ml-auto flex gap-4 w-full md:w-auto">
                <div className="px-6 py-3 tosca-bg text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm">
                   Create Poster Ad <ArrowRight size={16} />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             <MetricSmall title="Total spend" value="$0" trend="+12.5%" isDark={isDark} icon={<DollarSign size={16} />} />
             <MetricSmall title="Total clicks" value="0" trend="+8.2%" isDark={isDark} icon={<MousePointer2 size={16} />} />
             <MetricSmall title="Conversions" value="0" trend="+15.1%" isDark={isDark} icon={<Users size={16} />} />
             <MetricSmall title="Avg. roas" value="0x" trend="+2.4%" isDark={isDark} icon={<TrendingUp size={16} />} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
             <div className={`lg:col-span-2 p-6 rounded-[28px] border h-64 ${isDark ? 'bg-slate-800/50 border-white/5' : 'bg-white border-slate-100'} flex flex-col gap-4`}>
                <h4 className="font-bold text-sm">Growth trends</h4>
                <div className="flex-1 flex items-center justify-center opacity-30">
                   <BarChart3 size={48} />
                </div>
             </div>
             <div className={`p-6 rounded-[28px] border h-64 ${isDark ? 'bg-slate-800/50 border-white/5' : 'bg-white border-slate-100'} flex flex-col gap-4`}>
                <h4 className="font-bold text-sm">AI Insights</h4>
                <div className="flex-1 flex flex-col items-center justify-center opacity-40 text-center gap-2">
                   <AlertCircle size={32} />
                   <p className="text-[10px] font-bold uppercase tracking-widest">No signals yet.</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const MetricSmall = ({ title, value, trend, isDark, icon }: any) => (
  <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-white/5' : 'bg-white border-slate-100'} text-left space-y-2`}>
     <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5 text-teal-400' : 'bg-slate-50 text-slate-500'}`}>
           {icon}
        </div>
        <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">{trend}</span>
     </div>
     <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-bold font-display tracking-tight">{value}</p>
     </div>
  </div>
);

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  return (
    <section id="pricing" className="py-28 lg:py-36 bg-white dark:bg-slate-950 transition-colors">
      <Container className="text-center">
        <div className="max-w-2xl mx-auto space-y-6 mb-16">
          <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white">Fair, performance-based pricing.</h2>
          <div className="flex items-center justify-center gap-4">
             <span className={`text-sm font-bold ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Monthly</span>
             <button onClick={() => setIsAnnual(!isAnnual)} className="w-12 h-6 bg-slate-100 dark:bg-slate-800 rounded-full relative p-1 transition-colors">
                <div className={`w-4 h-4 tosca-bg rounded-full transition-all ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}></div>
             </button>
             <span className={`text-sm font-bold ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Annual (Save 20%)</span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
           <PricingCard title="Starter" price={isAnnual ? 24 : 29} desc="For new founders scaling their first node." />
           <PricingCard title="Growth" price={isAnnual ? 48 : 59} desc="Our most popular plan for established brands." featured />
           <PricingCard title="Scale" price={isAnnual ? 80 : 99} desc="Agency-grade tools for unlimited reach." />
        </div>
      </Container>
    </section>
  );
};

const PricingCard = ({ title, price, desc, featured }: any) => (
  <div className={`p-10 rounded-[40px] border transition-all flex flex-col text-left ${featured ? 'bg-slate-900 dark:bg-slate-900 border-primary shadow-2xl scale-105' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
     <h4 className={`font-display font-bold text-xl mb-2 ${featured ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{title}</h4>
     <p className={`text-sm mb-8 ${featured ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
     <div className="flex items-baseline gap-1 mb-10">
        <span className={`text-5xl font-black ${featured ? 'text-white' : 'text-slate-900 dark:text-white'}`}>${price}</span>
        <span className="text-slate-500 font-bold">/mo</span>
     </div>
     <ul className="space-y-4 mb-12 flex-1">
        {["10 Campaigns", "AI DNA Scan", "Fraud Protection", "Multiplatform Sync"].map(feat => (
          <li key={feat} className={`flex items-center gap-3 text-sm font-bold ${featured ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
            <CheckCircle2 className="text-primary" size={18} /> {feat}
          </li>
        ))}
     </ul>
     <button className={`w-full py-5 rounded-2xl font-bold transition-all shadow-xl ${featured ? 'tosca-bg text-white shadow-teal-500/30' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 hover:bg-slate-50'}`}>
        Choose {title}
     </button>
  </div>
);

const FinalCTA = ({ onLogin }: { onLogin: () => void }) => (
  <section className="py-28 lg:py-36 bg-white dark:bg-slate-950 transition-colors">
    <Container>
      <div className="bg-slate-900 rounded-[64px] p-12 lg:p-24 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 blur-[100px]"></div>
        <div className="max-w-2xl mx-auto space-y-10 relative z-10">
          <h2 className="font-display font-bold text-4xl lg:text-6xl tracking-tight leading-tight">Ready to launch your first AI node?</h2>
          <button onClick={onLogin} className="px-12 py-6 tosca-bg text-white font-bold rounded-2xl shadow-2xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all text-lg">
            Start Free Trial Now
          </button>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">No credit card required • 14 day full access</p>
        </div>
      </div>
    </Container>
  </section>
);

const MegaFooter = () => (
  <footer className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 transition-colors">
    <Container>
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-16">
        <div className="lg:col-span-2 space-y-8">
           <img src={LOGO_URL} alt="ZieAds Logo" className="h-10 w-auto" />
           <p className="text-slate-500 max-w-sm font-medium">The autonomous multichannel advertising platform for modern growth teams. Scale smarter, faster, and natively.</p>
        </div>
        <div>
           <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-8">Product</h4>
           <ul className="space-y-4 font-bold text-[13px] text-slate-700 dark:text-slate-300">
              <li><a href="#" className="hover:text-primary">Features</a></li>
              <li><a href="#" className="hover:text-primary">Pricing</a></li>
           </ul>
        </div>
      </div>
      <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] font-bold text-slate-400 uppercase tracking-widest">
         <p>© 2025 ZieAds Global Operations.</p>
         <div className="flex gap-8">
            <a href="#" className="hover:text-slate-600">Privacy</a>
            <a href="#" className="hover:text-slate-600">Terms</a>
         </div>
      </div>
    </Container>
  </footer>
);

const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="selection:bg-teal-100 dark:selection:bg-teal-900/30 selection:text-primary">
      <Hero onLogin={onLogin} />
      <PortfolioSection />
      <ProblemSection />
      <StepProcess />
      <FeatureGrid />
      <DashboardPreviewSection />
      <Pricing />
      <FAQSection />
      <FinalCTA onLogin={onLogin} />
      <MegaFooter />
    </div>
  );
};

export default LandingPage;

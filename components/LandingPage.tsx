
import React from 'react';
import { 
  ArrowRight, Target, Zap, TrendingUp, ShieldCheck, Globe, 
  XCircle, PlayCircle, BarChart3, Layers,
  Rocket, Layout, ShieldAlert, Quote,
  Users, Activity, Plus
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const brandLogos = [
    { name: "Meta Ads", url: "https://www.vectorlogo.zone/logos/meta/meta-icon.svg" },
    { name: "Google Ads", url: "https://www.vectorlogo.zone/logos/google_ads/google_ads-icon.svg" },
    { name: "Bing Ads", url: "https://www.vectorlogo.zone/logos/bing/bing-icon.svg" },
    { name: "TikTok Ads", url: "https://www.vectorlogo.zone/logos/tiktok/tiktok-icon.svg" },
    { name: "LinkedIn Ads", url: "https://www.vectorlogo.zone/logos/linkedin/linkedin-icon.svg" },
  ];

  const scrollLogos = [...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden text-slate-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl tosca-bg flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
            <Target size={22} fill="currentColor" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">ZieAds</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 px-4"
          >
            Login
          </button>
          <button 
            onClick={onLogin}
            className="px-6 py-2.5 rounded-full tosca-bg text-white text-sm font-bold hover:bg-primary-dark transition-all shadow-lg shadow-teal-500/20"
          >
            Start free Trial 14 Days
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-40 tosca-gradient text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8 animate-in slide-in-from-left-8 duration-700 relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
              Create Ads That <br/><span className="text-teal-100">Convert Effortlessly</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-teal-50 max-w-xl leading-relaxed font-medium">
              Build winning campaigns in minutes across Meta Ads, Google Ads, Bing Ads, and more even if you have never run ads before. Our AI does the hard work so you can focus on growing your business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={onLogin}
                className="px-8 py-5 rounded-2xl bg-white text-primary font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                Start free Trial 14 Days <ArrowRight size={20} />
              </button>
              <button className="px-8 py-5 rounded-2xl border-2 border-white/40 bg-white/5 backdrop-blur-sm text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <PlayCircle size={22} /> See How It Works
              </button>
            </div>
            
            <p className="text-teal-100 text-sm font-semibold pt-4">
              Join 10,000 plus businesses already using ZieAds to grow their revenue
            </p>
          </div>

          {/* Hero Visual */}
          <div className="relative animate-in zoom-in-95 duration-1000">
            <div className="animate-float relative">
              <div className="glass-card rounded-3xl p-0 shadow-2xl relative z-20 overflow-hidden border border-white/20">
                 <div className="flex h-[450px] w-full bg-white text-slate-900">
                    <div className="w-16 border-r border-slate-100 flex flex-col items-center py-6 gap-6 bg-slate-50/50">
                       <div className="w-8 h-8 rounded-lg tosca-bg flex items-center justify-center text-white"><Target size={16} /></div>
                       <div className="flex flex-col gap-4 text-slate-300">
                          <Layout size={20} className="text-primary" />
                          <Activity size={20} />
                          <Globe size={20} />
                          <Target size={20} />
                          <Layers size={20} />
                       </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                       <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 bg-white">
                          <span className="text-sm font-bold text-slate-700">ZieAds Command Center</span>
                          <div className="flex items-center gap-3">
                             <div className="w-7 h-7 rounded-full bg-slate-100"></div>
                             <div className="px-3 py-1 bg-teal-50 text-primary text-[10px] font-bold rounded-full">Live Scale</div>
                          </div>
                       </div>
                       <div className="p-6 space-y-6 overflow-hidden">
                          <div className="grid grid-cols-3 gap-3">
                             <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Total Roas</p>
                                <p className="text-lg font-black text-primary">5.82x</p>
                                <div className="mt-1 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full tosca-bg w-3/4"></div>
                                </div>
                             </div>
                             <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Conversions</p>
                                <p className="text-lg font-black text-slate-800">1,204</p>
                                <div className="mt-1 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full tosca-bg w-1/2"></div>
                                </div>
                             </div>
                             <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Active Ads</p>
                                <p className="text-lg font-black text-slate-800">12</p>
                                <div className="mt-1 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full tosca-bg w-full"></div>
                                </div>
                             </div>
                          </div>
                          
                          <div className="h-32 w-full bg-slate-50/50 rounded-xl border border-slate-100 p-4 relative overflow-hidden">
                             <div className="flex justify-between items-start">
                                <p className="text-[10px] font-bold text-slate-400">Performance Trend</p>
                                <div className="flex gap-1">
                                   <div className="w-1.5 h-1.5 rounded-full tosca-bg"></div>
                                   <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                </div>
                             </div>
                             <svg className="absolute bottom-0 left-0 w-full h-20 opacity-30" preserveAspectRatio="none" viewBox="0 0 400 100">
                                <path d="M0 80 Q 50 20 100 60 T 200 40 T 300 80 T 400 30 V 100 H 0 Z" fill="url(#tosca-grad)" stroke="#14B8A6" strokeWidth="2" />
                                <defs>
                                   <linearGradient id="tosca-grad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#14B8A6" />
                                      <stop offset="100%" stopColor="transparent" />
                                   </linearGradient>
                                </defs>
                             </svg>
                          </div>

                          <div className="space-y-2">
                             <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-primary font-black italic text-[8px]">Meta</div>
                                   <div className="text-[10px]"><p className="font-bold">Ecom Spring Launch</p><p className="text-slate-400">Scale $500/day</p></div>
                                </div>
                                <div className="text-right text-[10px] font-bold text-green-500">12% Roas</div>
                             </div>
                             <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-primary font-black italic text-[8px]">TikTok</div>
                                   <div className="text-[10px]"><p className="font-bold">Viral Hook Testing</p><p className="text-slate-400">Scale $120/day</p></div>
                                </div>
                                <div className="text-right text-[10px] font-bold text-slate-400">Learning</div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="absolute -top-10 -right-10 w-24 h-24 glass-card rounded-3xl p-4 shadow-xl flex items-center justify-center animate-bounce duration-[3000ms] delay-700">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png" className="w-12 opacity-80" />
              </div>
              <div className="absolute bottom-10 -left-12 w-20 h-20 glass-card rounded-3xl p-4 shadow-xl flex items-center justify-center animate-bounce duration-[4000ms]">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg" className="w-10 opacity-80" />
              </div>
              <div className="absolute -bottom-4 right-10 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-100 animate-float delay-150 relative z-30">
                 <div className="w-6 h-6 rounded-lg tosca-bg text-white flex items-center justify-center"><Plus size={14} /></div>
                 <span className="text-[10px] font-bold text-slate-700">Create New Campaign</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Carousel */}
      <section className="py-16 bg-primary border-y border-teal-400 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap flex items-center">
          {scrollLogos.map((logo, idx) => (
            <div key={idx} className="inline-flex items-center mx-20 group transition-all">
              <img 
                src={logo.url} 
                alt={logo.name} 
                className="h-14 md:h-20 w-auto opacity-70 brightness-0 invert filter group-hover:opacity-100 group-hover:filter-none transition-all cursor-default scale-110 md:scale-125"
                title={logo.name}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Running Ads Should Not Be This Hard</h2>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Let us be honest creating ads is painful. Traditional platforms were built for agencies not business owners.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-slate-50 p-10 rounded-[32px] border border-slate-100 space-y-8">
              <h3 className="text-2xl font-bold text-slate-500 flex items-center gap-3">
                <XCircle size={24} className="text-red-400" /> The Old Painful Way
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 text-slate-600 font-medium">
                  <span className="text-red-500">x</span> Hours wasted navigating confusing platforms
                </li>
                <li className="flex items-start gap-4 text-slate-600 font-medium">
                  <span className="text-red-500">x</span> Expensive agencies eating your budget
                </li>
                <li className="flex items-start gap-4 text-slate-600 font-medium">
                  <span className="text-red-500">x</span> Trial and error burning through cash
                </li>
                <li className="flex items-start gap-4 text-slate-600 font-medium">
                  <span className="text-red-500">x</span> No idea what is actually working
                </li>
              </ul>
            </div>

            <div className="space-y-8">
              <div className="inline-flex px-4 py-1 rounded-full bg-teal-100 text-primary text-sm font-bold">The ZieAds Solution</div>
              <h3 className="text-3xl font-bold text-slate-900 leading-tight">What if you could create professional high converting ads in just 5 minutes?</h3>
              <p className="text-slate-600 leading-relaxed">We stripped away the complexity and replaced it with powerful AI that understands your goals. No more guesswork. Just results.</p>
              <button onClick={onLogin} className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                Try the better way <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Solution Flow */}
      <section id="how-it-works" className="py-24 md:py-32 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">One Tool to Rule Them All</h2>
            <p className="text-xl text-slate-500">Create winning ads in minutes across top platforms even if it is your first time.</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            <StepCard 
              number="1" 
              icon={<Globe className="tosca-text" />} 
              title="Choose Your Platform" 
              copy="Select where you want to advertise. Meta Ads, Google Ads, TikTok Ads, LinkedIn Ads we support all major platforms."
              microCopy="Multi platform publishing in one click"
            />
            <StepCard 
              number="2" 
              icon={<Target className="tosca-text" />} 
              title="Set Your Goal" 
              copy="Awareness? Traffic? Sales? Choose what matters most to your business right now."
              microCopy="AI optimizes for your specific objective"
            />
            <StepCard 
              number="3" 
              icon={<Users className="tosca-text" />} 
              title="AI Finds Your Audience" 
              copy="Our AI analyzes your business and automatically generates targeting that converts. No guessing."
              microCopy="Smart targeting based on your industry"
            />
            <StepCard 
              number="4" 
              icon={<Zap className="tosca-text" />} 
              title="AI Generates Your Ads" 
              copy="Headlines, primary text, images our AI creates everything. Just pick your favorites."
              microCopy="5 variations generated in seconds"
            />
            <StepCard 
              number="5" 
              icon={<Rocket className="tosca-text" />} 
              title="One Click Publish" 
              copy="Review, click publish, and your ads go live across all selected platforms. It is that simple."
              microCopy="Live in under 5 minutes"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Everything You Need to Succeed</h2>
            <p className="text-xl text-slate-500">Powerful features to create, manage, and optimize your ads all in one place.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="text-primary" />}
              title="Create Effortlessly"
              copy="Build professional ads in just 5 simple steps. Our AI handles the copywriting, design suggestions, and targeting so you do not have to be a marketing expert."
              benefit="Go from idea to live ad in under 5 minutes"
            />
            <FeatureCard 
              icon={<BarChart3 className="text-primary" />}
              title="Manage Everything"
              copy="One dashboard for all your campaigns. No more switching between Meta Ads Manager, Google Ads, and TikTok."
              benefit="Save 5 plus hours per week on campaign management"
            />
            <FeatureCard 
              icon={<Globe className="text-primary" />}
              title="Scale Across Channels"
              copy="Publish to Meta Ads, Google Ads, TikTok Ads, LinkedIn Ads, Bing Ads, and more all from one platform."
              benefit="Maximize reach without extra work"
            />
            <FeatureCard 
              icon={<ShieldAlert className="text-primary" />}
              title="Click Fraud Protection"
              copy="AI monitors campaigns 24/7 and blocks bots and competitor clicks automatically. Always on protection included free."
              benefit="Save up to 20% on wasted ad spend"
              highlight="Included Free"
            />
            <FeatureCard 
              icon={<TrendingUp className="text-primary" />}
              title="AI Powered Optimization"
              copy="Automatic A/B testing, budget reallocation, and performance optimization based on real time data."
              benefit="Improve Roas by an average of 40%"
            />
            <FeatureCard 
              icon={<Rocket className="text-primary" />}
              title="Scale Automatically"
              copy="AI increases budget for winning ads and reduces spend on underperformers automatically."
              benefit="Scale winners without manual monitoring"
            />
          </div>
        </div>
      </section>

      {/* Instant Ads Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full tosca-gradient opacity-10"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black leading-tight">One Click <br/><span className="tosca-text">Instant Ads</span></h2>
              <p className="text-xl text-slate-400">Generate all creatives, copy, audiences, and publish ads with a single click.</p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center shrink-0">
                    <Globe className="text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl">AI Website Scanner</h4>
                    <p className="text-slate-400">Paste your website url. AI scans brand voice, products, and value proposition.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center shrink-0">
                    <Zap className="text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl">Instant AI Generated Campaigns</h4>
                    <p className="text-slate-400">5 headlines, 5 texts, 5 creatives, and optimized targeting generated instantly.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center shrink-0">
                    <Rocket className="text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl">One Click to Publish</h4>
                    <p className="text-slate-400">Select favorites and publish across platforms immediately.</p>
                  </div>
                </div>
              </div>
              
              <button className="px-10 py-4 rounded-xl tosca-bg text-white font-bold hover:scale-105 transition-all">
                See How It Works
              </button>
            </div>
            
            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl relative">
                <div className="absolute -top-6 -left-6 bg-teal-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">Scanning Website</div>
                <div className="space-y-4">
                   <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                   <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                   <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="h-32 bg-slate-700 rounded-xl"></div>
                      <div className="h-32 bg-slate-700 rounded-xl"></div>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fraud Protection */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex px-4 py-1 rounded-full bg-red-100 text-red-600 text-sm font-bold flex items-center gap-2">
                <ShieldAlert size={16} /> Click Fraud Protection
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900">Stop Wasting Budget on Bots</h2>
              <p className="text-xl text-slate-600">AI monitors campaigns 24/7 and blocks fraudulent clicks from competitors and bots automatically. This feature alone saves our users an average of 20% on spend.</p>
              <div className="pt-4">
                 <button onClick={onLogin} className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">Secure Your Budget</button>
              </div>
            </div>
            
            <div className="lg:w-1/2 grid grid-cols-2 gap-6 w-full">
              <StatCard label="Scanned Clicks" value="14,534" />
              <StatCard label="Fraud Clicks Blocked" value="1,451" color="text-red-500" />
              <StatCard label="Blocked IPs" value="491" />
              <StatCard label="Money Saved" value="$748" color="text-green-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold">Loved by Marketers Worldwide</h2>
            <p className="text-xl text-slate-500 mt-4">Join thousands growing their revenue with ZieAds.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard text="Replaced our agency! Roas improved by 40% in just two months." name="Sarah J." role="E commerce Founder" />
            <TestimonialCard text="All ads in one place. Saves hours weekly on platform switching." name="Mark D." role="Digital Marketer" />
            <TestimonialCard text="Launch ads in minutes not days. The AI copywriting is surprisingly good." name="Elena R." role="SaaS Founder" />
            <TestimonialCard text="Simple effective all in one solution for our small marketing team." name="Kevin T." role="Head of Growth" />
            <TestimonialCard text="Game changing AI optimization. It does what agencies charge 5k for." name="Jason L." role="Business Owner" />
            <TestimonialCard text="Perfect for small businesses who want professional results without the high cost." name="Anna M." role="Shop Owner" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <h2 className="text-4xl font-extrabold mb-4">Simple Pricing Powerful Results</h2>
          <p className="text-xl text-slate-500 mb-16">Flexible plans that scale with your business.</p>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <SimplePriceCard name="Free" price="$0" desc="Try it out" />
            <SimplePriceCard name="Starter" price="$29" desc="Basic growing" active />
            <SimplePriceCard name="Growth" price="$59" desc="Power user" />
            <SimplePriceCard name="Scale" price="$99" desc="Advanced scale" />
            <SimplePriceCard name="Agency" price="$249" desc="Multi account" />
            <SimplePriceCard name="Custom" price="Let us Talk" desc="Enterprise" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-6 max-w-4xl space-y-10">
          <h2 className="text-5xl font-black">Ready to Supercharge Your Advertising?</h2>
          <p className="text-2xl text-slate-400">Start your free trial today. No credit card required. Cancel anytime.</p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={onLogin} className="px-12 py-5 rounded-2xl tosca-bg text-white font-black text-xl hover:scale-105 transition-all shadow-xl shadow-teal-500/20">
              Start free Trial 14 Days
            </button>
            <button className="px-12 py-5 rounded-2xl border-2 border-slate-700 text-white font-bold text-xl hover:bg-slate-800 transition-all">
              Book a Demo
            </button>
          </div>
          
          <div className="flex justify-center gap-8 text-slate-500 font-bold uppercase tracking-widest text-xs">
            <span>No credit card required</span>
            <span>Cancel anytime</span>
            <span>14 day free trial</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg tosca-bg flex items-center justify-center text-white">
                <Target size={18} fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">ZieAds</span>
            </div>
            <p className="text-slate-500 max-w-sm">ZieAds is the world is most simple AI advertising platform for SMBs. Launch high converting ads in minutes not hours.</p>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900">Product</h4>
            <ul className="space-y-3 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-primary">Website Scanner</a></li>
              <li><a href="#" className="hover:text-primary">Campaign Builder</a></li>
              <li><a href="#" className="hover:text-primary">Click Fraud Protection</a></li>
              <li><a href="#" className="hover:text-primary">Optimization AI</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900">Resources</h4>
            <ul className="space-y-3 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-primary">Documentation</a></li>
              <li><a href="#" className="hover:text-primary">Blog</a></li>
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 max-w-7xl mt-20 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs font-medium">
          2025 ZieAds. All rights reserved. Meta Ads, Google Ads, Bing Ads, and TikTok Ads are trademarks of their respective owners.
        </div>
      </footer>
    </div>
  );
};

const StepCard = ({ number, icon, title, copy, microCopy }: { number: string, icon: React.ReactNode, title: string, copy: string, microCopy: string }) => (
  <div className="p-8 rounded-[32px] bg-white border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all group flex flex-col items-center text-center">
    <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 text-xs font-bold flex items-center justify-center mb-6 group-hover:tosca-bg group-hover:text-white transition-colors">
      Step {number}
    </div>
    <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 32 })}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed mb-4">{copy}</p>
    <p className="text-[10px] font-black uppercase tracking-widest text-primary bg-teal-50 px-2 py-1 rounded">{microCopy}</p>
  </div>
);

const FeatureCard = ({ icon, title, copy, benefit, highlight }: { icon: React.ReactNode, title: string, copy: string, benefit: string, highlight?: string }) => (
  <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all h-full flex flex-col">
    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-primary">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
    </div>
    {highlight && <span className="text-[10px] font-black text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full w-fit mb-3">{highlight}</span>}
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed mb-6">{copy}</p>
    <div className="mt-auto pt-6 border-t border-slate-200">
       <p className="text-xs font-bold text-primary flex items-center gap-2">
         <Zap size={14} className="fill-current" /> {benefit}
       </p>
    </div>
  </div>
);

const StatCard = ({ label, value, color }: { label: string, value: string, color?: string }) => (
  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
    <p className={`text-3xl font-black mb-1 ${color || 'text-slate-900'}`}>{value}</p>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

const TestimonialCard = ({ text, name, role }: { text: string, name: string, role: string }) => (
  <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm relative">
    <Quote className="absolute top-6 right-8 text-teal-100" size={40} />
    <p className="text-slate-700 italic font-medium mb-6 relative z-10 leading-relaxed">"{text}"</p>
    <div className="flex items-center gap-3">
       <div className="w-10 h-10 rounded-full bg-slate-200"></div>
       <div>
         <p className="font-bold text-slate-900 text-sm">{name}</p>
         <p className="text-xs text-slate-500">{role}</p>
       </div>
    </div>
  </div>
);

const SimplePriceCard = ({ name, price, desc, active }: { name: string, price: string, desc: string, active?: boolean }) => (
  <div className={`p-6 rounded-2xl border transition-all ${active ? 'border-primary bg-teal-50 ring-2 ring-primary/20 scale-105' : 'border-slate-100 bg-white hover:border-teal-200'}`}>
    <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">{name}</p>
    <p className="text-2xl font-black text-slate-900 mb-1">{price}</p>
    <p className="text-[10px] text-slate-500 font-medium">{desc}</p>
  </div>
);

export default LandingPage;

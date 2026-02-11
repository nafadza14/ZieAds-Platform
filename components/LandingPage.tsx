
import React from 'react';
import { 
  ArrowRight, Target, Zap, Globe, 
  PlayCircle, BarChart3, Layout, 
  Plus, CheckCircle2,
  X, Shield, Rocket, TrendingUp
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

  return (
    <div className="min-h-screen flex flex-col text-slate-900 bg-white selection:bg-teal-100 selection:text-teal-900 font-sans">
      {/* 1. NAVBAR */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg tosca-bg flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
            <Target size={18} fill="currentColor" />
          </div>
          <span className="text-lg font-bold tracking-tight font-display">ZieAds</span>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-[13px] font-semibold text-slate-500 tracking-tight">
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={onLogin} className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors font-sans">Login</button>
          <button onClick={onLogin} className="px-5 py-2.5 rounded-full tosca-bg text-white text-sm font-bold hover:scale-105 transition-all shadow-xl shadow-teal-500/20 active:scale-95 font-sans">
            Start free Trial 14 Days
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative w-full pt-12 pb-20 md:pt-20 md:pb-28 tosca-gradient text-white overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-teal-300/10 blur-[120px] rounded-full"></div>
        
        <div className="container-prop px-6 grid lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-5 space-y-6 animate-in slide-in-from-left-4 duration-700">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tighter font-display">
              Create Ads That<br/>Convert, Effortlessly
            </h1>
            
            <p className="text-base md:text-lg text-teal-50/90 leading-relaxed font-medium max-w-lg font-sans">
              Build winning campaigns in minutes across Meta, Google, TikTok, and more even if you've never run ads before. Our AI does the hard work, so you can focus on growing your business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={onLogin}
                className="px-6 py-3.5 rounded-2xl bg-white text-primary font-bold text-base hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group font-sans"
              >
                Start free Trial 14 Days <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#how-it-works" className="px-6 py-3.5 rounded-2xl border-2 border-white/40 text-white font-bold text-base hover:bg-white/10 transition-all flex items-center justify-center gap-3 font-sans">
                <PlayCircle size={20} /> See How It Works
              </a>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
               <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-slate-200 overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                   </div>
                 ))}
               </div>
               <p className="text-teal-100/70 text-[11px] font-semibold tracking-tight font-sans">
                 Join 10,000+ businesses scaling with ZieAds
               </p>
            </div>
          </div>

          <div className="lg:col-span-7 relative flex justify-center lg:justify-end animate-in fade-in zoom-in-95 duration-1000">
            {/* Dashboard Mockup */}
            <div className="relative z-20 animate-float w-full max-w-[580px]">
               {/* Floating Platform Icons integrated into animation */}
               <div className="absolute -top-4 -right-4 w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center z-30 animate-float delay-100">
                  <img src="https://www.vectorlogo.zone/logos/facebook/facebook-official.svg" className="w-7 h-7" alt="Meta" />
               </div>
               <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center z-30 animate-float delay-500">
                  <img src="https://www.vectorlogo.zone/logos/google_ads/google_ads-icon.svg" className="w-9 h-9" alt="Google Ads" />
               </div>
               <div className="absolute top-1/2 -left-10 w-12 h-12 bg-white rounded-xl shadow-2xl flex items-center justify-center z-30 animate-float delay-300">
                  <img src="https://www.vectorlogo.zone/logos/tiktok/tiktok-icon.svg" className="w-7 h-7" alt="TikTok" />
               </div>

               <div className="bg-white rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.25)] border border-white/20 overflow-hidden flex h-[480px]">
                  <div className="w-12 border-r border-slate-50 flex flex-col items-center py-6 gap-6 bg-slate-50/30">
                     <div className="w-7 h-7 rounded-lg tosca-bg flex items-center justify-center text-white"><Target size={14} /></div>
                     <div className="flex flex-col gap-5 text-slate-300">
                        <Layout size={16} className="text-primary" />
                        <BarChart3 size={16} />
                        <Globe size={16} />
                        <Shield size={16} />
                     </div>
                  </div>
                  <div className="flex-1 flex flex-col bg-white font-sans">
                     <div className="h-14 border-b border-slate-50 flex items-center justify-between px-6">
                        <span className="text-[12px] font-bold text-slate-800 tracking-tight">ZieAds Command Center</span>
                        <div className="px-2.5 py-1 bg-teal-50 text-primary text-[10px] font-bold rounded-full">Live Scale</div>
                     </div>
                     <div className="p-6 space-y-6">
                        <div className="grid grid-cols-3 gap-3">
                           <MockStat label="Total Roas" value="5.82x" progress={75} />
                           <MockStat label="Conversions" value="1,204" progress={55} />
                           <MockStat label="Active Ads" value="12" progress={100} />
                        </div>
                        
                        <div className="space-y-2">
                           <p className="text-[10px] font-semibold text-slate-400">Performance Trend</p>
                           <div className="h-24 w-full bg-teal-50/20 rounded-[20px] border border-teal-100/30 p-3 relative overflow-hidden">
                              <svg className="absolute bottom-0 left-0 w-full h-16" preserveAspectRatio="none" viewBox="0 0 400 100">
                                 <path d="M0 80 Q 50 20 100 60 T 200 30 T 300 70 T 400 20 V 100 H 0 Z" fill="#14B8A6" fillOpacity="0.1" />
                                 <path d="M0 80 Q 50 20 100 60 T 200 30 T 300 70 T 400 20" fill="none" stroke="#14B8A6" strokeWidth="3" />
                              </svg>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <AdRowMock name="Ecom Spring Launch" platform="Meta" roas="12%" color="primary" />
                           <AdRowMock name="Viral Hook Testing" platform="TikTok" roas="Learning" color="slate" />
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-2xl border border-slate-100 flex items-center gap-3 z-30 group cursor-pointer hover:scale-105 transition-all">
                  <div className="w-6 h-6 rounded-lg tosca-bg text-white flex items-center justify-center shadow-lg"><Plus size={14} /></div>
                  <span className="text-[12px] font-bold text-slate-900 font-sans">Create New Campaign</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LOGO BAR */}
      <section className="py-10 bg-white border-b border-slate-50">
        <div className="container-prop px-6 flex flex-wrap items-center justify-center gap-10 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
          {brandLogos.map(logo => (
            <img key={logo.name} src={logo.url} alt={logo.name} className="h-6 md:h-8 w-auto" />
          ))}
        </div>
      </section>

      {/* 4. PROBLEM SECTION */}
      <section className="py-20 md:py-28 bg-white overflow-hidden font-sans">
        <div className="container-prop px-6">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tighter font-display leading-[1.1]">Running Ads Should Not Be This Hard</h2>
              <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
                 Let's be honest: creating ads is painful. Traditional platforms were built for agencies, not business owners.
              </p>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-slate-50 rounded-[40px] p-10 md:p-14 border border-slate-100 flex flex-col gap-8 shadow-sm">
                 <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full border-2 border-red-200 flex items-center justify-center text-red-500">
                       <X size={18} strokeWidth={3} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 font-display">The Old Painful Way</h3>
                 </div>
                 <div className="space-y-5 pl-1">
                    <ProblemBullet text="Hours wasted navigating confusing platforms" />
                    <ProblemBullet text="Expensive agencies eating your budget" />
                    <ProblemBullet text="Trial and error burning through cash" />
                    <ProblemBullet text="No idea what's actually working" />
                 </div>
              </div>

              <div className="space-y-6 lg:pl-10">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-primary text-[11px] font-bold rounded-full border border-teal-100 font-sans">
                    The ZieAds Solution
                 </div>
                 <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-[1.1] tracking-tighter font-display">
                    Professional ads in just 5 minutes.
                 </h3>
                 <p className="text-base text-slate-500 font-medium leading-relaxed font-sans">
                    We stripped away the complexity and replaced it with powerful AI that understands your goals. No more guesswork. Just results.
                 </p>
                 <button className="flex items-center gap-3 text-primary font-bold text-lg group transition-all font-sans active:scale-95">
                    Try the better way <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* 5. FEATURES */}
      <section id="features" className="py-20 md:py-28 bg-slate-50 font-sans">
        <div className="container-prop px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 font-display leading-[1.1] tracking-tighter">Everything to Succeed</h2>
            <p className="text-base text-slate-500 font-medium leading-relaxed max-w-xl mx-auto font-sans">Powerful features to create, manage, and optimize your ads all in one place.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap size={22} />}
              title="Create Effortlessly"
              copy="Build professional ad copy in seconds without writing a word. Our AI handles the design and targeting."
              benefit="Go live in less than 5 minutes."
            />
            <FeatureCard 
              icon={<Layout size={22} />}
              title="Manage Everything"
              copy="One dashboard for all your campaigns. No more switching between complex ad managers."
              benefit="Save 10+ hours per week."
            />
            <FeatureCard 
              icon={<Globe size={22} />}
              title="Scale Across Channels"
              copy="Reach your audience wherever they are. Publish to Meta, Google, TikTok, and more in one click."
              benefit="Maximize your reach."
            />
            <FeatureCard 
              icon={<Shield size={22} />}
              title="Fraud Protection"
              copy="AI monitors campaigns 24/7, detecting and blocking fraudulent clicks from bots and competitors."
              benefit="Save up to 20% spend."
              highlight="100% Free"
            />
            <FeatureCard 
              icon={<TrendingUp size={22} />}
              title="AI Optimization"
              copy="Don't guess what works. Our AI automatically A/B tests and reallocates budget to winners."
              benefit="40% higher ROAS."
            />
            <FeatureCard 
              icon={<Rocket size={22} />}
              title="Scale Automatically"
              copy="Automatically increase budget for winners and pause losers. Like having a team of buyers working 24/7."
              benefit="Growth on autopilot."
            />
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-20 md:py-28 bg-white border-y border-slate-50 font-sans">
        <div className="container-prop px-6">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tighter font-display leading-[1.1]">Loved by Marketers</h2>
              <p className="text-base text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">Join thousands growing their revenue with ZieAds.</p>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TestimonialCard 
                name="Sarah Mitchell" role="E-commerce Founder"
                quote="Replaced our agency! ZieAds automation completely replaced our $2,000/month agency. Our ROAS improved by 40% in the first month."
                img="https://i.pravatar.cc/150?img=32"
              />
              <TestimonialCard 
                name="James Chen" role="Digital Marketer"
                quote="All your ads in one place! ZieAds is a lot more intuitive than logging into Facebook or Google separately. Saves me hours every week."
                img="https://i.pravatar.cc/150?img=11"
              />
              <TestimonialCard 
                name="Emma Wilson" role="SaaS Founder"
                quote="Finally found ZieAds! We launch a ton of ads per month for agile testing. What used to take days now takes minutes."
                img="https://i.pravatar.cc/150?img=44"
              />
           </div>
        </div>
      </section>

      {/* 7. PRICING */}
      <section id="pricing" className="py-20 md:py-28 bg-slate-50 font-sans">
        <div className="container-prop px-6">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 font-display tracking-tighter leading-none">Simple Pricing</h2>
              <p className="text-base text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">Transparent costs that scale with your growth.</p>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              <PriceCard name="Free" price="$0" features={["1 campaign", "1 platform", "AI Website Scan"]} />
              <PriceCard name="Starter" price="$29" features={["5 campaigns", "3 platforms", "AI Copy Generation"]} />
              <PriceCard name="Growth" price="$59" featured features={["Unlimited campaigns", "All 8 platforms", "Fraud Protection", "Priority Support"]} />
              <PriceCard name="Scale" price="$99" features={["Everything in Growth", "Dedicated Manager", "API Access"]} />
           </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-28 md:py-36 tosca-gradient text-white text-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-slate-950/10 backdrop-blur-[1px]"></div>
        <div className="container-prop px-6 relative z-10 space-y-10">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tighter font-display">Ready to Scale?</h2>
          <p className="text-base md:text-xl text-teal-50 font-medium max-w-xl mx-auto leading-relaxed opacity-90 font-sans">
            Start your free trial today. Create and manage ads in minutes so you can focus on what really matters: growing your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
            <button onClick={onLogin} className="px-10 py-4 rounded-2xl bg-white text-primary font-bold text-lg hover:scale-105 transition-all shadow-3xl active:scale-95 font-sans">
              Start Free Trial 14 Days
            </button>
            <button className="px-10 py-4 rounded-2xl border-2 border-white/40 bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all active:scale-95 font-sans">
              Book a Demo
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-[11px] font-semibold text-teal-100/60 pt-6">
            <span>No Credit Card Required</span>
            <span>•</span>
            <span>Cancel Anytime</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 bg-slate-900 text-white font-sans">
        <div className="container-prop px-6 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg tosca-bg flex items-center justify-center text-white shadow-xl">
                <Target size={18} fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white font-display">ZieAds</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">Create ads that convert, effortlessly. The world's most simple AI advertising platform.</p>
          </div>
          <div>
            <h4 className="font-bold text-white text-[12px] mb-6 opacity-30 font-display">Product</h4>
            <ul className="space-y-3 text-slate-400 text-xs font-semibold">
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-[12px] mb-6 opacity-30 font-display">Company</h4>
            <ul className="space-y-3 text-slate-400 text-xs font-semibold">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-[12px] mb-6 opacity-30 font-display">Support</h4>
            <ul className="space-y-3 text-slate-400 text-xs font-semibold">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="container-prop px-6 mt-16 pt-8 border-t border-white/5 text-center text-slate-600 text-[11px] font-semibold tracking-wide font-sans">
          © 2025 ZieAds Global. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

/* --- Refined Components --- */

const ProblemBullet = ({ text }: { text: string }) => (
  <div className="flex items-center gap-4 group font-sans">
    <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0 group-hover:scale-110 transition-transform">
       <X size={14} strokeWidth={3} />
    </div>
    <p className="text-base font-semibold text-slate-600 tracking-tight">{text}</p>
  </div>
);

const TestimonialCard = ({ quote, name, role, img }: any) => (
  <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.03)] flex flex-col hover:shadow-xl transition-all duration-500 group font-sans">
    <p className="text-slate-600 text-sm leading-relaxed mb-8 font-medium italic">"{quote}"</p>
    <div className="mt-auto flex items-center gap-4">
       <img src={img} className="w-10 h-10 rounded-full object-cover border border-slate-100" alt={name} />
       <div>
          <p className="text-sm font-bold text-slate-900 font-display tracking-tight leading-none mb-1">{name}</p>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wide">{role}</p>
       </div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, copy, benefit, highlight }: any) => (
  <div className="p-8 rounded-[32px] bg-white border border-slate-100 hover:border-teal-100 hover:shadow-lg transition-all flex flex-col group h-full duration-500 font-sans">
    <div className="w-10 h-10 rounded-xl bg-slate-50 shadow-sm flex items-center justify-center mb-6 text-primary group-hover:tosca-bg group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    {highlight && <span className="text-[10px] font-bold text-teal-600 bg-teal-100 px-3 py-1 rounded-full w-fit mb-4 font-sans">{highlight}</span>}
    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tighter font-display leading-tight">{title}</h3>
    <p className="text-slate-500 text-[13px] leading-relaxed mb-6 font-medium">{copy}</p>
    <div className="mt-auto pt-4 border-t border-slate-50">
       <p className="text-[11px] font-bold text-primary flex items-center gap-2 font-sans">
         <Zap size={12} fill="currentColor" /> {benefit}
       </p>
    </div>
  </div>
);

const PriceCard = ({ name, price, features, featured }: any) => (
  <div className={`p-8 rounded-[32px] border-2 transition-all flex flex-col h-full duration-500 font-sans ${featured ? 'bg-slate-900 text-white border-primary shadow-2xl scale-105 relative z-10' : 'bg-white border-slate-100 text-slate-900 hover:border-teal-100'}`}>
    {featured && <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full font-sans">Most Popular</div>}
    <p className={`text-[11px] font-bold mb-5 font-sans ${featured ? 'text-teal-400' : 'text-slate-400'}`}>{name}</p>
    <div className="flex items-baseline gap-2 mb-8">
       <span className="text-4xl font-extrabold tracking-tighter font-display leading-none">{price}</span>
       <span className="text-base font-bold opacity-30">/mo</span>
    </div>
    <ul className="space-y-3 mb-10 flex-1">
       {features.map((f: string) => (
         <li key={f} className="flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 size={16} className="text-teal-400 shrink-0" /> {f}
         </li>
       ))}
    </ul>
    <button className={`w-full py-3.5 rounded-2xl font-bold text-base transition-all active:scale-95 font-sans ${featured ? 'tosca-bg text-white hover:shadow-2xl' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
       Get Started
    </button>
  </div>
);

const MockStat = ({ label, value, progress }: any) => (
   <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-700 group font-sans">
      <p className="text-[9px] font-semibold text-slate-400 mb-1">{label}</p>
      <p className="text-lg font-extrabold tracking-tighter text-slate-900 font-display leading-none">{value}</p>
      <div className="mt-3 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
         <div className="h-full tosca-bg transition-all duration-[2s] ease-out group-hover:opacity-80" style={{ width: `${progress}%` }}></div>
      </div>
   </div>
);

const AdRowMock = ({ name, platform, roas, color }: any) => (
   <div className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-all group font-sans">
      <div className="flex items-center gap-2.5">
         <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
            <span className="text-[10px] font-bold italic">{platform[0]}</span>
         </div>
         <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-slate-800 leading-none tracking-tight font-display">{name}</p>
            <p className="text-[9px] text-slate-400 font-semibold">{platform}</p>
         </div>
      </div>
      <div className={`text-[10px] font-bold ${color === 'primary' ? 'text-primary' : 'text-slate-400'} bg-slate-50 px-2 py-1 rounded-full group-hover:bg-white transition-all shadow-sm`}>
         {roas}
      </div>
   </div>
);

export default LandingPage;

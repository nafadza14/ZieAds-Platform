
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingBag, Building2, Rocket, 
  BarChart3, Target, Sparkles, Zap, ShieldCheck 
} from 'lucide-react';

const LOGO_URL = "https://i.pinimg.com/736x/e6/3d/aa/e63daaceb34de0af110a18ef9ff2d3c1.jpg";

const UseCasesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft size={20} className="text-slate-400 hover:text-primary transition-colors" />
          <img src={LOGO_URL} alt="ZieAds Logo" className="h-8 md:h-10 w-auto object-contain" />
        </Link>
        <Link to="/" className="px-6 py-2.5 rounded-full tosca-bg text-white text-sm font-bold hover:bg-primary-dark transition-all shadow-lg shadow-teal-500/20">
          Get Started
        </Link>
      </nav>

      <main className="pt-20 pb-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-24 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-teal-100">
              <Sparkles size={12} /> Industry Solutions
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
              One Engine. <br/><span className="tosca-text">Infinite Use Cases.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Whether you are scaling an eCommerce empire, running a local shop, or managing a marketing agency, ZieAds adapts to your goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <UseCaseCard 
              icon={<ShoppingBag size={32} />}
              title="eCommerce Scaling"
              subtitle="The ROAS machine for online stores."
              description="Instantly scan your Shopify or WooCommerce store. AI extracts your top-selling products, builds multi-channel retargeting funnels, and optimizes budget for the highest conversion rate."
              metrics={["5.8x Avg ROAS", "60% Lower CPC", "Instant Funnels"]}
            />
            <UseCaseCard 
              icon={<Building2 size={32} />}
              title="Local Businesses"
              subtitle="Dominate your neighborhood."
              description="Attract foot traffic and local leads. ZieAds handles the complex geo-targeting and local search optimization so you can focus on serving your customers."
              metrics={["High-Intent Leads", "Geo-Targeting", "Local Awareness"]}
            />
            <UseCaseCard 
              icon={<Rocket size={32} />}
              title="SaaS & Startups"
              subtitle="Scale your growth, minus the agency."
              description="Get your product in front of the right decision-makers. AI crafts technical yet persuasive ad copy and manages your B2B targeting across LinkedIn and Google."
              metrics={["Lower CAC", "Verified B2B Leads", "Automated Testing"]}
            />
          </div>

          <section className="mt-32 bg-slate-900 rounded-[64px] p-12 md:p-24 text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
             <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                   <h2 className="text-4xl md:text-6xl font-black leading-tight">Agencies: Manage <br/>10x More Clients</h2>
                   <p className="text-xl text-slate-400 leading-relaxed">
                     ZieAds white-label engine allows agencies to automate the heavy lifting of campaign creation and 24/7 optimization. Move from managing buttons to managing strategy.
                   </p>
                   <ul className="space-y-4">
                      <li className="flex items-center gap-3 font-bold text-teal-400">
                         <ShieldCheck size={20} /> Unified Client Dashboard
                      </li>
                      <li className="flex items-center gap-3 font-bold text-teal-400">
                         <Zap size={20} /> Bulk Campaign Creation
                      </li>
                      <li className="flex items-center gap-3 font-bold text-teal-400">
                         <BarChart3 size={20} /> Automated Client Reporting
                      </li>
                   </ul>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                   <div className="space-y-6">
                      <div className="h-4 bg-white/20 rounded-full w-3/4"></div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="h-24 bg-white/10 rounded-2xl"></div>
                         <div className="h-24 bg-white/10 rounded-2xl"></div>
                      </div>
                      <div className="h-32 bg-teal-500/10 rounded-2xl border border-teal-500/20 flex flex-col items-center justify-center gap-2">
                         <Sparkles className="text-teal-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">AI Scaling Logic: Active</span>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const UseCaseCard = ({ icon, title, subtitle, description, metrics }: any) => (
  <div className="p-10 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all flex flex-col h-full group">
    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-primary mb-8 group-hover:tosca-bg group-hover:text-white transition-all shadow-sm">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>
    <p className="text-sm font-bold text-primary mb-6">{subtitle}</p>
    <p className="text-slate-500 leading-relaxed mb-10 flex-1">{description}</p>
    <div className="pt-8 border-t border-slate-50 grid grid-cols-1 gap-3">
       {metrics.map((m: string) => (
         <div key={m} className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
            {m}
         </div>
       ))}
    </div>
  </div>
);

export default UseCasesPage;


import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Video, Folder, ChevronDown, 
  Zap, CheckCircle2,
  Lock, Search, BarChart3, Users
} from 'lucide-react';

const LOGO_MARK = (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#7C5CFF"/>
    <path d="M12 12H28L12 28H28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Fixed Framer Motion variant type mismatch by explicitly typing the ease array as a 4-number tuple
const reveal = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
  }
};

const SectionHeader = ({ tag, title, body, centered = true }: { tag?: string, title: string, body?: string, centered?: boolean }) => (
  <motion.div 
    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={reveal}
    className={`max-w-3xl mb-16 ${centered ? 'mx-auto text-center' : ''}`}
  >
    {tag && <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7C5CFF] mb-4 block">{tag}</span>}
    <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6 leading-[1.1]">{title}</h2>
    {body && <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-normal">{body}</p>}
  </motion.div>
);

const Navbar = ({ onLogin }: { onLogin: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-[#1F2329] bg-[#0B0D10]/80 backdrop-blur-xl">
    <div className="max-w-[1120px] mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
           {LOGO_MARK}
           <span className="text-xl font-bold tracking-tight text-white">ZieAds</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {["Product", "Method", "Pricing"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors">{item}</a>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onLogin} className="text-[13px] font-medium text-slate-400 hover:text-white px-4">Login</button>
        <button onClick={onLogin} className="bg-white text-black px-4 py-1.5 rounded-lg text-[13px] font-semibold hover:bg-slate-200 transition-all">Start Free</button>
      </div>
    </div>
  </nav>
);

const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="selection:bg-[#7C5CFF] selection:text-white bg-[#0B0D10] text-[#FFFFFF] font-sans">
      <Navbar onLogin={onLogin} />

      <section className="relative h-screen min-h-[900px] flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="https://v0.pstatic.net/7f/7f69/42480418e29d8e60bfae22fa49cf6aef.mp4" type="video/mp4" />
           </video>
           <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D10] via-transparent to-[#0B0D10]"></div>
        </div>

        <div className="relative z-30 text-center max-w-[960px]">
          <motion.div initial="hidden" animate="visible" variants={reveal} className="inline-flex items-center gap-2 px-3 py-1 bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 rounded-full mb-8">
            <Sparkles size={12} className="text-[#7C5CFF]" />
            <span className="text-[11px] font-bold text-[#7C5CFF] uppercase tracking-[0.2em]">Autonomous Growth Protocol</span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={reveal} className="text-[42px] md:text-[68px] font-semibold tracking-tight leading-[1.08] mb-8">
            Run Smarter Ads. <br/>Not More Ads.
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={reveal} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            ZieAds utilizes persistent intelligence to monitor, optimize, and protect your ad budget — automatically.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={reveal} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onLogin} className="px-10 py-4 bg-[#7C5CFF] text-white font-semibold rounded-xl text-base shadow-2xl shadow-[#7C5CFF]/30 hover:bg-[#6A4CEB] transition-all">Deploy Account</button>
            <button className="px-10 py-4 bg-white/5 text-white border border-[#1F2329] font-semibold rounded-xl text-base hover:bg-white/10 transition-all">Watch Demo</button>
          </motion.div>
        </div>
      </section>

      <section id="method" className="py-[120px] bg-[#111318] border-y border-[#1F2329]">
        <div className="max-w-[1120px] mx-auto px-6 text-center">
          <SectionHeader title="The Autonomous Loop" body="ZieAds operates 24/7 as an intelligence layer above your campaign manager." />
          <div className="grid md:grid-cols-3 gap-12 text-left">
            {[
              { title: "Connect", desc: "Enterprise-grade encryption for your ad accounts.", icon: Lock },
              { title: "Analyze", desc: "Persistent monitoring of CPA, ROAS, and Fatigue signals.", icon: Search },
              { title: "Optimize", desc: "Auto-pilot adjustments for budget and creative distribution.", icon: Zap }
            ].map((col, i) => (
              <div key={i} className="p-8 bg-[#0B0D10] rounded-2xl border border-[#1F2329]">
                <col.icon size={24} className="text-[#7C5CFF] mb-6" />
                <h4 className="text-xl font-semibold text-white mb-4">{col.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{col.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-[#1F2329] bg-[#0B0D10]">
         <div className="max-w-[1120px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3 opacity-40">
               {LOGO_MARK}
               <span className="text-lg font-bold tracking-tight text-white">ZieAds</span>
            </div>
            <p className="text-[13px] font-medium text-slate-600 tracking-widest uppercase">ZieAds Operating System © 2025</p>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;

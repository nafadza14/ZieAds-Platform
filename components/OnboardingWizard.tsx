
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, ArrowRight, CheckCircle2, Info, Globe, 
  Layout, Smartphone, Monitor, Check, Loader2,
  Plus, Play, UserPlus, Plug, X, ChevronRight,
  Database, UserCheck, Bell, ShieldAlert
} from 'lucide-react';
import { completeWorkspaceOnboarding } from '../services/dbService';

interface OnboardingWizardProps {
  workspaceId: string;
  onComplete: () => void;
}

type OnboardingStep = 1 | 2 | 3 | 'completed';

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ workspaceId, onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [loading, setLoading] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    workspace_name: '',
    company_website: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    currency: 'USD',
    ad_types: [] as string[],
    monthly_spend: '',
    notifications: {
      budget_alert: true,
      performance_drop: true,
      weekly_report: false
    }
  });

  const handleNext = () => {
    if (step === 1 && !formData.workspace_name) return;
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) handleFinish();
  };

  const handleSkip = () => {
    if (step === 2) {
      // Save empty connections and move to step 3
      setStep(3);
    } else if (step === 3) {
      // Save empty preferences and complete
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await completeWorkspaceOnboarding(workspaceId, {
        ...formData,
        platforms: Array.from(connectedPlatforms)
      });
      setStep('completed');
    } catch (err) {
      alert("System node error: Unable to persist configuration.");
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (p: string) => {
    const next = new Set(connectedPlatforms);
    if (next.has(p)) next.delete(p);
    else next.add(p);
    setConnectedPlatforms(next);
  };

  const toggleAdType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      ad_types: prev.ad_types.includes(type) 
        ? prev.ad_types.filter(t => t !== type)
        : [...prev.ad_types, type]
    }));
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#0F1115]/90 backdrop-blur-xl p-4 md:p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[800px] bg-[#111418] border border-[#2A2E37] rounded-[32px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] relative"
      >
        {/* PROGRESS & CLOSE */}
        {step !== 'completed' && (
          <div className="p-6 border-b border-[#2A2E37] flex items-center justify-between">
             <div className="flex gap-2">
                {[1, 2, 3].map(s => (
                  <div 
                    key={s} 
                    className={`h-1 rounded-full transition-all duration-500 ${
                      step === s ? 'w-10 bg-[#5E6AD2]' : s < step ? 'w-4 bg-[#22C55E]' : 'w-4 bg-[#2A2E37]'
                    }`}
                  />
                ))}
             </div>
             {step >= 2 && (
               <button 
                onClick={handleFinish}
                className="p-2 text-[#5C6169] hover:text-[#F7F8F8] transition-colors"
                title="Skip and go to dashboard"
               >
                 <X size={20} />
               </button>
             )}
          </div>
        )}

        <div className="p-8 md:p-12 overflow-y-auto max-h-[85vh] custom-scrollbar selection:bg-[#5E6AD2]/30">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-10"
              >
                <div className="space-y-3">
                  <h2 className="text-3xl font-semibold text-[#F7F8F8] tracking-tight">Let's set up your workspace</h2>
                  <p className="text-[#8A8F98] text-[15px]">This helps us organize your campaigns and regional settings.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-[#8A8F98] uppercase tracking-wider ml-1">Workspace Name *</label>
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="e.g. Acme Marketing"
                      value={formData.workspace_name}
                      onChange={e => setFormData({...formData, workspace_name: e.target.value})}
                      className="w-full h-14 px-5 bg-[#111418] border border-[#2A2E37] rounded-xl text-[#F7F8F8] outline-none focus:border-[#5E6AD2] focus:ring-4 focus:ring-[#5E6AD2]/10 transition-all placeholder:text-[#5C6169]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-[#8A8F98] uppercase tracking-wider ml-1">Company Website</label>
                    <input 
                      type="url" 
                      placeholder="https://yourcompany.com"
                      value={formData.company_website}
                      onChange={e => setFormData({...formData, company_website: e.target.value})}
                      className="w-full h-14 px-5 bg-[#111418] border border-[#2A2E37] rounded-xl text-[#F7F8F8] outline-none focus:border-[#5E6AD2] transition-all placeholder:text-[#5C6169]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-[#8A8F98] uppercase tracking-wider ml-1">Timezone</label>
                    <div className="relative">
                      <select 
                        value={formData.timezone}
                        onChange={e => setFormData({...formData, timezone: e.target.value})}
                        className="w-full h-14 px-5 bg-[#111418] border border-[#2A2E37] rounded-xl text-[#F7F8F8] outline-none appearance-none focus:border-[#5E6AD2]"
                      >
                        <option value="UTC">UTC (Universal Time)</option>
                        <option value="America/New_York">EST (Eastern Standard)</option>
                        <option value="America/Los_Angeles">PST (Pacific Standard)</option>
                        <option value="Asia/Jakarta">WIB (Western Indonesia)</option>
                        <option value="Europe/London">GMT (London)</option>
                      </select>
                      <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5C6169] rotate-90" size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-[#8A8F98] uppercase tracking-wider ml-1">Currency</label>
                    <div className="relative">
                      <select 
                        value={formData.currency}
                        onChange={e => setFormData({...formData, currency: e.target.value})}
                        className="w-full h-14 px-5 bg-[#111418] border border-[#2A2E37] rounded-xl text-[#F7F8F8] outline-none appearance-none focus:border-[#5E6AD2]"
                      >
                        {["USD", "EUR", "GBP", "IDR", "SGD", "AUD"].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5C6169] rotate-90" size={16} />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleNext}
                    disabled={!formData.workspace_name}
                    className="w-full h-14 bg-[#5E6AD2] text-white font-medium rounded-xl shadow-lg hover:bg-[#6E7BEE] active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-10"
              >
                <div className="space-y-3 text-center">
                  <h2 className="text-3xl font-semibold text-[#F7F8F8] tracking-tight">Connect your ad accounts</h2>
                  <p className="text-[#8A8F98] text-[15px]">ZieAds works across your multi-channel ecosystem.</p>
                </div>

                <div className="p-4 bg-[#1A1D23] border border-[#2A2E37] rounded-2xl flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-[#111418] border border-[#2A2E37] flex items-center justify-center text-[#5E6AD2]">
                      <Info size={20} />
                   </div>
                   <p className="text-sm text-[#8A8F98]">You can connect these anytime later from the Integrations page.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <PlatformOnboardingCard 
                    name="Meta Ads" 
                    desc="Facebook & Instagram" 
                    platform="meta" 
                    isConnected={connectedPlatforms.has('meta')}
                    onConnect={() => togglePlatform('meta')}
                  />
                  <PlatformOnboardingCard 
                    name="Google Ads" 
                    desc="Search & YouTube" 
                    platform="google" 
                    isConnected={connectedPlatforms.has('google')}
                    onConnect={() => togglePlatform('google')}
                  />
                  <PlatformOnboardingCard 
                    name="TikTok Ads" 
                    desc="Global video ads" 
                    platform="tiktok" 
                    isConnected={connectedPlatforms.has('tiktok')}
                    onConnect={() => togglePlatform('tiktok')}
                  />
                </div>

                <div className="pt-4 flex flex-col items-center gap-6">
                  <button 
                    onClick={handleNext}
                    className="w-full h-14 bg-[#5E6AD2] text-white font-medium rounded-xl shadow-lg hover:bg-[#6E7BEE] transition-all"
                  >
                    Continue →
                  </button>
                  <button 
                    onClick={handleSkip}
                    className="text-[14px] font-medium text-[#8A8F98] hover:text-[#F7F8F8] underline underline-offset-4 decoration-[#2A2E37] transition-colors"
                  >
                    Skip for now
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-10"
              >
                <div className="space-y-3 text-center">
                  <h2 className="text-3xl font-semibold text-[#F7F8F8] tracking-tight">Almost there!</h2>
                  <p className="text-[#8A8F98] text-[15px]">Personalize your AI optimization engine.</p>
                </div>

                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[14px] font-semibold text-[#F7F8F8] ml-1">What type of ads do you run?</label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        "E-commerce", "Lead Generation", "App Install", 
                        "Brand Awareness", "B2B Marketing", "Local Business"
                      ].map(type => (
                        <button
                          key={type}
                          onClick={() => toggleAdType(type)}
                          className={`px-4 py-2 rounded-lg border text-[13px] font-medium transition-all ${
                            formData.ad_types.includes(type)
                            ? 'bg-[#5E6AD2] border-[#5E6AD2] text-white'
                            : 'bg-[#1A1D23] border-[#2A2E37] text-[#8A8F98] hover:border-[#5E6AD2]/50 hover:text-[#F7F8F8]'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[14px] font-semibold text-[#F7F8F8] ml-1">Monthly ad spend</label>
                    <div className="relative">
                      <select 
                        value={formData.monthly_spend}
                        onChange={e => setFormData({...formData, monthly_spend: e.target.value})}
                        className="w-full h-14 px-5 bg-[#1A1D23] border border-[#2A2E37] rounded-xl text-[#F7F8F8] outline-none appearance-none focus:border-[#5E6AD2]"
                      >
                        <option value="">Select range...</option>
                        <option value="1k">Under $1,000</option>
                        <option value="5k">$1,000 - $5,000</option>
                        <option value="20k">$5,000 - $20,000</option>
                        <option value="50k">$20,000 - $50,000</option>
                        <option value="max">$50,000+</option>
                      </select>
                      <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5C6169] rotate-90" size={16} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[14px] font-semibold text-[#F7F8F8] ml-1">Get notified when</label>
                    <div className="space-y-3">
                      <OnboardingToggle 
                        label="Budget threshold reached" 
                        active={formData.notifications.budget_alert} 
                        onChange={v => setFormData({...formData, notifications: {...formData.notifications, budget_alert: v}})} 
                      />
                      <OnboardingToggle 
                        label="Performance drops detected" 
                        active={formData.notifications.performance_drop} 
                        onChange={v => setFormData({...formData, notifications: {...formData.notifications, performance_drop: v}})} 
                      />
                      <OnboardingToggle 
                        label="Weekly summary email" 
                        active={formData.notifications.weekly_report} 
                        onChange={v => setFormData({...formData, notifications: {...formData.notifications, weekly_report: v}})} 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex flex-col items-center gap-6">
                  <button 
                    onClick={handleFinish}
                    disabled={loading}
                    className="w-full h-14 bg-[#5E6AD2] text-white font-medium rounded-xl shadow-lg hover:bg-[#6E7BEE] transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Go to Dashboard <ArrowRight size={18}/></>}
                  </button>
                  <button 
                    onClick={handleSkip}
                    className="text-[14px] font-medium text-[#8A8F98] hover:text-[#F7F8F8] underline underline-offset-4 decoration-[#2A2E37] transition-colors"
                  >
                    Skip to Dashboard
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'completed' && (
              <motion.div 
                key="completed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-12"
              >
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-3xl flex items-center justify-center text-[#22C55E]">
                     <CheckCircle2 size={40} />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl font-semibold text-[#F7F8F8] tracking-tight">You're all set! 🎉</h2>
                  <p className="text-[#8A8F98] text-[16px] leading-relaxed">
                    ZieAds is ready. {connectedPlatforms.size === 0 
                      ? "Connect your ad accounts in Integrations to start managing campaigns." 
                      : "You're ready to create your first campaign!"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <QuickActionItem 
                    title={connectedPlatforms.size > 0 ? "Create your first campaign" : "Go to Integrations"} 
                    desc={connectedPlatforms.size > 0 ? "Launch in under 2 minutes" : "Connect your ad accounts"}
                    icon={connectedPlatforms.size > 0 ? <Plus size={20}/> : <Plug size={20}/>} 
                    primary 
                    onClick={() => { onComplete(); window.location.hash = connectedPlatforms.size > 0 ? '#/builder' : '#/integrations'; }}
                  />
                  <QuickActionItem 
                    title="Start Scanning" 
                    desc="Analyze your website DNA" 
                    icon={<Globe size={20}/>} 
                    onClick={() => { onComplete(); window.location.hash = '#/scanner'; }}
                  />
                  <QuickActionItem 
                    title="Watch 2-min demo" 
                    desc="Quick platform overview" 
                    icon={<Play size={20}/>} 
                    onClick={() => onComplete()}
                  />
                  <QuickActionItem 
                    title="Invite team member" 
                    desc="Collaborate with colleagues" 
                    icon={<UserPlus size={20}/>} 
                    onClick={() => { onComplete(); window.location.hash = '#/settings'; }}
                  />
                </div>

                <div className="pt-6 border-t border-[#2A2E37]">
                   <p className="text-[11px] font-medium text-[#5C6169] uppercase tracking-[0.2em]">Redirecting to command center in 5 seconds...</p>
                   <AutoRedirectTimer onTimeout={onComplete} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const PlatformOnboardingCard = ({ name, desc, platform, isConnected, onConnect }: any) => {
  const getIcon = () => {
    switch(platform) {
      case 'meta': return <span className="text-[#3B82F6] font-black text-xl">M</span>;
      case 'google': return <span className="text-[#EF4444] font-black text-xl">G</span>;
      case 'tiktok': return <span className="text-white font-black text-xl">T</span>;
      default: return null;
    }
  };

  return (
    <div 
      onClick={onConnect}
      className={`p-6 rounded-2xl border transition-all cursor-pointer group flex flex-col items-center text-center h-full relative ${
        isConnected ? 'bg-[#5E6AD2]/10 border-[#5E6AD2]' : 'bg-[#1A1D23] border-[#2A2E37] hover:border-[#5E6AD2]/50'
      }`}
    >
      {isConnected && (
        <div className="absolute top-3 right-3 text-[#22C55E]">
          <CheckCircle2 size={16} fill="currentColor" fillOpacity={0.2} />
        </div>
      )}
      <div className={`w-12 h-12 rounded-xl bg-[#111418] border border-[#2A2E37] flex items-center justify-center mb-4 transition-all ${isConnected ? 'ring-2 ring-[#5E6AD2]/20' : 'group-hover:border-[#5E6AD2]/30'}`}>
        {getIcon()}
      </div>
      <h3 className="text-[14px] font-semibold text-[#F7F8F8] mb-1">{name}</h3>
      <p className="text-[12px] text-[#8A8F98] leading-tight mb-6 flex-1">{desc}</p>
      
      <div className={`w-full py-2 rounded-lg text-[12px] font-semibold transition-all ${
        isConnected ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20' : 'bg-[#111418] border border-[#2A2E37] text-[#8A8F98] group-hover:text-[#F7F8F8]'
      }`}>
        {isConnected ? 'Connected' : 'Connect'}
      </div>
    </div>
  );
};

const OnboardingToggle = ({ label, active, onChange }: any) => (
  <div className="flex items-center justify-between p-4 bg-[#1A1D23] border border-[#2A2E37] rounded-xl group hover:border-[#5E6AD2]/30 transition-all">
    <span className="text-[14px] font-medium text-[#F7F8F8]">{label}</span>
    <div 
      onClick={() => onChange(!active)}
      className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${active ? 'bg-[#5E6AD2]' : 'bg-[#2A2E37]'}`}
    >
       <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
    </div>
  </div>
);

const QuickActionItem = ({ title, desc, icon, primary, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-5 rounded-2xl border text-left transition-all flex items-center gap-4 group ${
      primary 
      ? 'bg-[#5E6AD2]/5 border-[#5E6AD2]/20 hover:bg-[#5E6AD2]/10 hover:border-[#5E6AD2]/40 shadow-sm' 
      : 'bg-[#1A1D23] border-[#2A2E37] hover:bg-[#20242a] hover:border-[#5E6AD2]/20'
    }`}
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${primary ? 'bg-[#5E6AD2] text-white shadow-lg shadow-[#5E6AD2]/20' : 'bg-[#111418] border border-[#2A2E37] text-[#8A8F98] group-hover:text-[#F7F8F8]'}`}>
      {icon}
    </div>
    <div className="space-y-0.5 overflow-hidden">
      <h4 className={`text-[14px] font-semibold truncate ${primary ? 'text-[#F7F8F8]' : 'text-[#8A8F98] group-hover:text-[#F7F8F8]'}`}>{title}</h4>
      <p className="text-[12px] text-[#5C6169] group-hover:text-[#8A8F98] transition-colors truncate">{desc}</p>
    </div>
  </button>
);

const AutoRedirectTimer = ({ onTimeout }: { onTimeout: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onTimeout, 5000);
    return () => clearTimeout(timer);
  }, [onTimeout]);
  return null;
};

export default OnboardingWizard;

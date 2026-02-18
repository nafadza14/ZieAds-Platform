
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, ArrowRight, CheckCircle2, Globe, 
  Plus, Play, UserPlus, X, ChevronRight,
  Loader2, Smartphone, Monitor, Layout,
  CheckCircle, Bell
} from 'lucide-react';
import { completeWorkspaceOnboarding } from '../services/dbService';

// Aliasing motion components to bypass broken TypeScript definitions in this environment
const MotionDiv = (motion as any).div;

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
      console.error("Onboarding commit failed", err);
      // Fallback: Proceed anyway to avoid trapping the user
      setStep('completed');
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

  const toggleNotification = (id: keyof typeof formData.notifications) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [id]: !prev.notifications[id]
      }
    }));
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#0A0A0F]/80 backdrop-blur-2xl p-4 md:p-6 font-sans">
      <MotionDiv 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[800px] bg-[#11141B] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col"
      >
        {/* Progress Indicators (Step Dots Top) */}
        {step !== 'completed' && (
          <div className="pt-8 px-10 flex items-center justify-between">
            <div className="flex gap-3">
              {[1, 2, 3].map(s => (
                <div 
                  key={s} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    step === s ? 'w-10 bg-[#8B5CF6]' : (typeof step === 'number' && s < step) ? 'w-4 bg-[#10B981]' : 'w-4 bg-white/10'
                  }`}
                />
              ))}
            </div>
            {step >= 2 && (
              <button 
                onClick={() => onComplete()}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        <div className="p-8 md:p-14 overflow-y-auto max-h-[80vh] custom-scrollbar selection:bg-[#8B5CF6]/30">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <MotionDiv 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">Let's set up your workspace</h2>
                  <p className="text-zinc-400">This helps us organize your campaigns</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Workspace Name</label>
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="e.g., Acme Marketing"
                      value={formData.workspace_name}
                      onChange={e => setFormData({...formData, workspace_name: e.target.value})}
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Company Website (optional)</label>
                    <input 
                      type="url" 
                      placeholder="https://yourcompany.com"
                      value={formData.company_website}
                      onChange={e => setFormData({...formData, company_website: e.target.value})}
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Timezone</label>
                    <div className="relative">
                      <select 
                        value={formData.timezone}
                        onChange={e => setFormData({...formData, timezone: e.target.value})}
                        className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none appearance-none focus:border-[#8B5CF6]"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">EST (New York)</option>
                        <option value="Europe/London">GMT (London)</option>
                        <option value="Asia/Singapore">SGT (Singapore)</option>
                        <option value="Australia/Sydney">AEST (Sydney)</option>
                        <option value="Asia/Jakarta">WIB (Jakarta)</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 rotate-90" size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Currency</label>
                    <div className="relative">
                      <select 
                        value={formData.currency}
                        onChange={e => setFormData({...formData, currency: e.target.value})}
                        className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none appearance-none focus:border-[#8B5CF6]"
                      >
                        {["USD", "EUR", "GBP", "IDR", "SGD", "AUD"].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 rotate-90" size={16} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Step 1 of 3</span>
                  <button 
                    onClick={handleNext}
                    disabled={!formData.workspace_name}
                    className="h-12 px-8 bg-[#8B5CF6] text-white font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Continue →
                  </button>
                </div>
              </MotionDiv>
            )}

            {step === 2 && (
              <MotionDiv 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white tracking-tight">Connect your ad accounts</h2>
                  <p className="text-zinc-400">ZieAds works with Meta, Google, and TikTok</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <ConnectCard 
                    platform="meta"
                    name="Meta Ads"
                    description="Facebook & Instagram"
                    connected={connectedPlatforms.has('meta')}
                    onToggle={() => togglePlatform('meta')}
                  />
                  <ConnectCard 
                    platform="google"
                    name="Google Ads"
                    description="Search & Display"
                    connected={connectedPlatforms.has('google')}
                    onToggle={() => togglePlatform('google')}
                  />
                  <ConnectCard 
                    platform="tiktok"
                    name="TikTok Ads"
                    description="Video campaigns"
                    connected={connectedPlatforms.has('tiktok')}
                    onToggle={() => togglePlatform('tiktok')}
                  />
                </div>

                <div className="text-center">
                   <button onClick={handleNext} className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">You can connect these later</button>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Step 2 of 3</span>
                  <button 
                    onClick={handleNext}
                    className="h-12 px-8 bg-[#8B5CF6] text-white font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Continue →
                  </button>
                </div>
              </MotionDiv>
            )}

            {step === 3 && (
              <MotionDiv 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white tracking-tight">Almost there!</h2>
                  <p className="text-zinc-400">Set your advertising preferences</p>
                </div>

                <div className="space-y-6">
                  {/* Ad Types */}
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-white">What type of ads do you run?</p>
                    <div className="flex flex-wrap gap-2">
                      {["E-commerce", "Lead Generation", "App Install", "Brand Awareness", "B2B Marketing", "Local Business"].map(type => (
                        <button
                          key={type}
                          onClick={() => toggleAdType(type)}
                          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                            formData.ad_types.includes(type)
                            ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:border-zinc-500'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Spend */}
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-white">Monthly ad spend</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {["Under $1,000", "$1,000 - $5,000", "$5,000 - $20,000", "$20,000 - $50,000", "$50,000+"].map(range => (
                        <button
                          key={range}
                          onClick={() => setFormData({...formData, monthly_spend: range})}
                          className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all text-center ${
                            formData.monthly_spend === range
                            ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-[#8B5CF6]'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:border-zinc-500'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      <Bell size={16} className="text-[#8B5CF6]" /> Get notified when
                    </p>
                    <div className="space-y-3">
                      <ToggleRow 
                        label="Budget threshold reached" 
                        active={formData.notifications.budget_alert} 
                        onToggle={() => toggleNotification('budget_alert')} 
                      />
                      <ToggleRow 
                        label="Performance drops" 
                        active={formData.notifications.performance_drop} 
                        onToggle={() => toggleNotification('performance_drop')} 
                      />
                      <ToggleRow 
                        label="Weekly summary email" 
                        active={formData.notifications.weekly_report} 
                        onToggle={() => toggleNotification('weekly_report')} 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Step 3 of 3</span>
                  <button 
                    onClick={handleFinish}
                    disabled={loading}
                    className="h-12 px-8 bg-[#8B5CF6] text-white font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Go to Dashboard →'}
                  </button>
                </div>
              </MotionDiv>
            )}

            {step === 'completed' && (
              <MotionDiv 
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10 py-6"
              >
                <div className="w-20 h-20 bg-[#10B981]/20 text-[#10B981] rounded-full flex items-center justify-center mx-auto border border-[#10B981]/20">
                  <CheckCircle size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold text-white tracking-tight">You're all set! 🎉</h2>
                  <p className="text-zinc-400">Here's what you can do next:</p>
                </div>

                <div className="grid gap-3 max-w-sm mx-auto">
                  <QuickActionButton 
                    icon={<Plus size={18} />} 
                    label="Create your first campaign" 
                    primary 
                    onClick={() => onComplete()} 
                  />
                  <QuickActionButton 
                    icon={<Play size={18} />} 
                    label="Watch 2-min demo" 
                    onClick={() => onComplete()} 
                  />
                  <QuickActionButton 
                    icon={<UserPlus size={18} />} 
                    label="Invite team member" 
                    onClick={() => onComplete()} 
                  />
                </div>

                <div className="pt-4">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] animate-pulse">Redirecting to dashboard...</p>
                </div>

                {/* Auto redirect simulation */}
                <RedirectTimer onComplete={onComplete} />
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </MotionDiv>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const ConnectCard = ({ platform, name, description, connected, onToggle }: any) => (
  <div 
    onClick={onToggle}
    className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-4 text-center group ${
      connected ? 'bg-[#10B981]/5 border-[#10B981]/30' : 'bg-white/5 border-white/10 hover:border-zinc-500'
    }`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
      connected ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20' : 'bg-white/5 text-zinc-500 group-hover:text-white'
    }`}>
      {platform === 'meta' && <Layout size={24} />}
      {platform === 'google' && <Monitor size={24} />}
      {platform === 'tiktok' && <Smartphone size={24} />}
    </div>
    <div className="space-y-1">
      <p className="text-sm font-bold text-white">{name}</p>
      <p className="text-[10px] text-zinc-500">{description}</p>
    </div>
    <div className={`mt-2 py-1.5 w-full rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
      connected ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-white/5 text-white'
    }`}>
      {connected ? 'Connected' : 'Connect'}
    </div>
  </div>
);

const ToggleRow = ({ label, active, onToggle }: { label: string, active: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm text-zinc-400 font-medium">{label}</span>
    <div 
      onClick={onToggle}
      className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${active ? 'bg-[#8B5CF6]' : 'bg-white/10'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
    </div>
  </div>
);

const QuickActionButton = ({ icon, label, primary, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
      primary 
      ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20' 
      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
    }`}
  >
    <span className={primary ? 'text-white' : 'text-[#8B5CF6]'}>{icon}</span>
    {label}
  </button>
);

const RedirectTimer = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return null;
};

export default OnboardingWizard;

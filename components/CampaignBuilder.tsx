
import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Zap, Target, Send, Loader2, Globe, Sparkles
} from 'lucide-react';
import { Platform, CampaignObjective, BrandProfile, AdCreative, Campaign, CampaignType } from '../types';
import { generateCampaignStrategy, generateCreatives } from '../services/geminiService';
import { orchestrateCampaignPublish } from '../services/dbService';
import { useNavigate } from 'react-router-dom';

interface CampaignBuilderProps {
  brandProfile: BrandProfile | null;
  onComplete: (campaign: Campaign) => void;
}

const CampaignBuilder: React.FC<CampaignBuilderProps> = ({ brandProfile, onComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Wizard State
  const [type, setType] = useState<CampaignType>(CampaignType.InstantAI);
  const [platforms, setPlatforms] = useState<Platform[]>([Platform.Meta]);
  const [objective, setObjective] = useState<CampaignObjective>(CampaignObjective.Sales);
  const [goal, setGoal] = useState('');
  const [strategy, setStrategy] = useState<{ platforms: Platform[], suggestedBudget: number, adAngles: string[], targetAudience: string } | null>(null);
  const [creatives, setCreatives] = useState<AdCreative[]>([]);
  const [selectedCreativeIndex, setSelectedCreativeIndex] = useState(0);
  const [budget, setBudget] = useState(50);
  const [duration, setDuration] = useState(30);

  const handleTypeSelect = (selectedType: CampaignType) => {
    setType(selectedType);
    setStep(2);
  };

  const handleNext = async () => {
    if (step === 2) {
      setLoading(true);
      try {
        if (!brandProfile) throw new Error("Brand profile missing");
        const strat = await generateCampaignStrategy(brandProfile, goal || "Growth and conversions", type);
        setStrategy(strat);
        setPlatforms(strat.platforms);
        setBudget(strat.suggestedBudget);
        
        const generated = await generateCreatives(brandProfile, strat.platforms, objective, strat.adAngles[0]);
        const platformCreatives = generated.map((c, i) => ({
          ...c,
          platform: strat.platforms[i % strat.platforms.length]
        }));
        setCreatives(platformCreatives);
        setStep(3);
      } catch (e: any) {
        alert("Strategy generation failed: " + e.message);
      } finally {
        setLoading(false);
      }
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handlePublish = async () => {
    if (creatives.length === 0) return;
    setLoading(true);
    
    try {
      const campaignToPublish = {
        name: `${platforms[0]} ${objective} Campaign - ${new Date().toLocaleDateString()}`,
        type,
        platforms,
        objective,
        audience: strategy?.targetAudience || brandProfile?.audiences[0] || 'Broad',
        budget,
        duration,
      };

      const publishedCampaign = await orchestrateCampaignPublish(campaignToPublish, creatives);
      onComplete(publishedCampaign as any);
      navigate('/');
    } catch (e: any) {
      alert("Deployment failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!brandProfile) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6 font-sans">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
            <Globe size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 font-display">Scan your website first</h2>
        <p className="text-slate-500 font-medium">To enable AI-driven campaigns, our system needs to analyze your brand voice and products.</p>
        <button onClick={() => navigate('/scanner')} className="px-8 py-4 tosca-bg text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 font-display">Go to website scanner</button>
      </div>
    );
  }

  const steps = [
    { id: 1, name: 'Type' },
    { id: 2, name: 'Project' },
    { id: 3, name: 'Ads' },
    { id: 4, name: 'Launch' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500 font-sans">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= s.id ? 'tosca-bg text-white' : 'bg-slate-200 text-slate-400'}`}>
                {s.id}
              </div>
              <span className={`text-[11px] font-bold tracking-tight ${step >= s.id ? 'text-primary' : 'text-slate-400'}`}>{s.name}</span>
            </div>
            {idx < steps.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${step > s.id ? 'tosca-bg' : 'bg-slate-100'}`}></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
        <div className="flex-1 p-8 md:p-12">
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 font-display">Select Campaign Type</h2>
                <p className="text-slate-500 font-medium">Choose how much control you want over the optimization process.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <TypeCard active={type === CampaignType.InstantAI} onClick={() => handleTypeSelect(CampaignType.InstantAI)} title="Instant AI Campaign" desc="Full automation. AI builds everything from your URL." icon={<Sparkles />} />
                <TypeCard active={type === CampaignType.SmartMulti} onClick={() => handleTypeSelect(CampaignType.SmartMulti)} title="Smart Multi-platform" desc="You pick channels, AI optimizes daily for max ROAS." icon={<Target />} />
                <TypeCard active={type === CampaignType.Manual} onClick={() => handleTypeSelect(CampaignType.Manual)} title="Manual Single-platform" desc="Full control mode for specific targeting needs." icon={<Target />} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-extrabold text-slate-900 font-display">Describe your project</h2>
              <div className="grid md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <div>
                        <label className="text-[11px] font-bold text-slate-400 tracking-wide mb-2 block uppercase">What is your primary goal?</label>
                        <textarea className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-4 focus:ring-teal-500/10 transition-all font-medium" rows={4} placeholder="e.g. I want to sell my new eco-friendly coffee pods..." value={goal} onChange={(e) => setGoal(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-[11px] font-bold text-slate-400 tracking-wide mb-2 block uppercase">Select main objective</label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.values(CampaignObjective).map(o => (
                                <button key={o} onClick={() => setObjective(o)} className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${objective === o ? 'border-primary bg-teal-50 text-primary' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}>{o}</button>
                            ))}
                        </div>
                    </div>
                 </div>
                 <div className="bg-slate-50 rounded-3xl p-8 space-y-6">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 font-display"><Sparkles size={18} className="text-primary" /> AI Context Filter</h4>
                    <p className="text-sm text-slate-500 italic">"Your {brandProfile.tone} brand voice will be used to craft these campaigns."</p>
                 </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-extrabold text-slate-900 font-display">Select AI-generated ads</h2>
                   <div className="flex gap-2">
                       {creatives.map((_, i) => (
                           <button key={i} onClick={() => setSelectedCreativeIndex(i)} className={`w-8 h-8 rounded-lg font-bold text-xs ${selectedCreativeIndex === i ? 'tosca-bg text-white' : 'bg-slate-100 text-slate-400'}`}>{i + 1}</button>
                       ))}
                   </div>
               </div>
               <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                           <div className="flex justify-between mb-4">
                              <span className="text-[10px] font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded uppercase">{creatives[selectedCreativeIndex]?.platform} ad variation</span>
                              <span className="text-primary font-bold">{(creatives[selectedCreativeIndex]?.predictedCTR! * 100).toFixed(1)}% Ctr</span>
                           </div>
                           <p className="text-lg font-bold text-slate-900 mb-2 font-display">{creatives[selectedCreativeIndex]?.headline}</p>
                           <p className="text-sm text-slate-600 leading-relaxed font-medium">{creatives[selectedCreativeIndex]?.primaryText}</p>
                      </div>
                  </div>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-extrabold text-slate-900 font-display">Launch your campaign</h2>
              <div className="p-8 bg-teal-50 rounded-3xl border border-teal-100 text-center">
                  <Send className="mx-auto text-primary mb-4" size={48} />
                  <h3 className="text-xl font-bold text-slate-800 font-display">Ready to publish</h3>
                  <p className="text-slate-600 font-medium">Your campaign will be deployed to {platforms.join(', ')} with a daily budget of ${budget}.</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-12 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button onClick={handleBack} disabled={step === 1 || loading} className="text-slate-500 font-bold disabled:opacity-0 flex items-center gap-2"><ArrowLeft size={18} /> Back</button>
          <div className="flex items-center gap-4">
            {step === 1 ? null : (step < 4 ? (
              <button onClick={handleNext} disabled={loading || (step === 2 && !goal)} className="px-8 py-4 tosca-bg text-white font-bold rounded-2xl flex items-center gap-2 font-display">
                {loading ? <><Loader2 className="animate-spin" /> Thinking...</> : <>Next step <ArrowRight size={18} /></>}
              </button>
            ) : (
              <button onClick={handlePublish} disabled={loading} className="px-12 py-5 tosca-bg text-white font-extrabold text-xl rounded-2xl flex items-center gap-3 font-display">
                {loading ? <Loader2 className="animate-spin" /> : <Send size={24} />} Launch now
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TypeCard = ({ active, onClick, title, desc, icon }: any) => (
  <button onClick={onClick} className={`p-8 rounded-[32px] border-2 text-left transition-all ${active ? 'border-primary bg-teal-50' : 'border-slate-100 bg-white hover:border-teal-100'}`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${active ? 'tosca-bg text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>{icon}</div>
    <h3 className="text-lg font-bold mb-2 font-display">{title}</h3>
    <p className="text-[13px] text-slate-500 font-medium">{desc}</p>
  </button>
);

export default CampaignBuilder;

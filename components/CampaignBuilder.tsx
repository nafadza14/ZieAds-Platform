
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, Zap, Target, Image as ImageIcon, Wallet, 
  Smartphone, Monitor, Send, Loader2, Globe, Sparkles, Check
} from 'lucide-react';
import { Platform, CampaignObjective, BrandProfile, AdCreative, Campaign, CampaignType, CampaignStatus } from '../types';
import { generateCampaignStrategy, generateCreatives } from '../services/geminiService';
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

  // Logic: Handle transition from Selection to Project Description
  const handleTypeSelect = (selectedType: CampaignType) => {
    setType(selectedType);
    setStep(2);
  };

  const handleNext = async () => {
    if (step === 2) {
      setLoading(true);
      try {
        if (!brandProfile) throw new Error("Brand profile missing");
        
        // AI Logic: Analyze goal and brand to find strategy
        const strat = await generateCampaignStrategy(brandProfile, goal || "Growth and conversions", type);
        setStrategy(strat);
        setPlatforms(strat.platforms);
        setBudget(strat.suggestedBudget);
        
        // AI Logic: Generate actual ad copy based on the first angle
        const generated = await generateCreatives(brandProfile, strat.platforms, objective, strat.adAngles[0]);
        setCreatives(generated);
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
    
    // Logic: Construct the final campaign object
    const newCampaign: Campaign = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${platforms[0]} ${objective} Campaign - ${new Date().toLocaleDateString()}`,
      type,
      platforms,
      objective,
      audience: strategy?.targetAudience || brandProfile?.audiences[0] || 'Broad',
      creatives: [creatives[selectedCreativeIndex]],
      budget,
      duration,
      status: 'active',
      createdAt: new Date().toISOString(),
      metrics: { spend: 0, impressions: 0, clicks: 0, conversions: 0, roas: 0 }
    };

    try {
      await onComplete(newCampaign);
      // Logic: Success redirection
      navigate('/');
    } catch (e) {
      alert("Deployment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Guard: Must have a profile
  if (!brandProfile) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
            <Globe size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Scan your website first</h2>
        <p className="text-slate-500">To enable AI-driven campaigns, our system needs to analyze your brand voice and products.</p>
        <button onClick={() => navigate('/scanner')} className="px-8 py-4 tosca-bg text-white rounded-xl font-bold shadow-lg shadow-teal-500/20">Go to Website Scanner</button>
      </div>
    );
  }

  const steps = [
    { id: 1, name: 'Type', label: 'Campaign Type' },
    { id: 2, name: 'Project', label: 'Describe Project' },
    { id: 3, name: 'Ads', label: 'Select Ads' },
    { id: 4, name: 'Launch', label: 'Launch' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
      {/* Step Indicator */}
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= s.id ? 'tosca-bg text-white' : 'bg-slate-200 text-slate-400'}`}>
                {s.id}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-primary' : 'text-slate-400'}`}>{s.name}</span>
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
                <h2 className="text-3xl font-black text-slate-900 mb-2">Select Campaign Type</h2>
                <p className="text-slate-500">Choose how much control you want over the optimization process.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <TypeCard 
                   active={type === CampaignType.InstantAI} 
                   onClick={() => handleTypeSelect(CampaignType.InstantAI)}
                   title="Instant AI Campaign"
                   desc="Full automation. AI builds everything from your URL."
                   icon={<Sparkles />}
                />
                <TypeCard 
                   active={type === CampaignType.SmartMulti} 
                   onClick={() => handleTypeSelect(CampaignType.SmartMulti)}
                   title="Smart Multi-Platform"
                   desc="You pick channels, AI optimizes daily for max ROAS."
                   icon={<Target />}
                />
                <TypeCard 
                   active={type === CampaignType.Manual} 
                   onClick={() => handleTypeSelect(CampaignType.Manual)}
                   title="Manual Single-Platform"
                   desc="Full control mode for specific targeting needs."
                   icon={<Smartphone />}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-black text-slate-900">Describe your project</h2>
              <div className="grid md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">What is your primary goal?</label>
                        <textarea 
                            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
                            rows={4}
                            placeholder="e.g. I want to sell my new eco-friendly coffee pods to young professionals in London..."
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Select Main Objective</label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.values(CampaignObjective).map(o => (
                                <button 
                                    key={o} 
                                    onClick={() => setObjective(o)}
                                    className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${objective === o ? 'border-primary bg-teal-50 text-primary' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {o}
                                </button>
                            ))}
                        </div>
                    </div>
                 </div>
                 <div className="bg-slate-50 rounded-3xl p-8 space-y-6">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2"><Sparkles size={18} className="text-primary" /> AI Context Filter</h4>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-primary font-bold">{brandProfile.name[0]}</div>
                            <div>
                                <p className="text-sm font-bold">{brandProfile.name}</p>
                                <p className="text-xs text-slate-400">{brandProfile.url}</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed italic">"Your {brandProfile.tone} brand voice and {brandProfile.products[0]} focus will be used to craft these campaigns."</p>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-black text-slate-900">Select AI-generated ads</h2>
                   <div className="flex gap-2">
                       {creatives.map((_, i) => (
                           <button 
                                key={i} 
                                onClick={() => setSelectedCreativeIndex(i)}
                                className={`w-8 h-8 rounded-lg font-bold text-xs ${selectedCreativeIndex === i ? 'tosca-bg text-white' : 'bg-slate-100 text-slate-400'}`}
                           >
                               {i + 1}
                           </button>
                       ))}
                   </div>
               </div>

               <div className="grid md:grid-cols-2 gap-12">
                  {creatives[selectedCreativeIndex] ? (
                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                             <div className="flex justify-between mb-4">
                                <span className="text-[10px] font-black text-teal-600 bg-teal-100 px-2 py-0.5 rounded uppercase">AD VARIATION {selectedCreativeIndex + 1}</span>
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">PREDICTED CTR: <span className="text-primary font-black">{(creatives[selectedCreativeIndex].predictedCTR! * 100).toFixed(1)}%</span></span>
                             </div>
                             <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Headline</label>
                                    <p className="text-lg font-bold text-slate-900">{creatives[selectedCreativeIndex].headline}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Primary Text</label>
                                    <p className="text-sm text-slate-600 leading-relaxed">{creatives[selectedCreativeIndex].primaryText}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-200">
                                    <span className="text-xs font-bold text-primary">CTA: {creatives[selectedCreativeIndex].cta}</span>
                                </div>
                             </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors">Regenerate</button>
                            <button className="flex-1 py-3 tosca-bg rounded-xl font-bold text-sm text-white hover:bg-primary-dark transition-colors">Edit Manually</button>
                        </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl">
                        <p className="text-slate-400 italic">No variations generated.</p>
                    </div>
                  )}

                  <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">Mobile Preview</label>
                      <div className="w-[280px] mx-auto bg-white border-[8px] border-slate-900 rounded-[40px] overflow-hidden shadow-2xl aspect-[9/16] relative">
                         <div className="absolute top-0 left-0 w-full h-full p-4 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent">
                            <div className="text-white space-y-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-white/20"></div>
                                    <p className="text-xs font-bold">{brandProfile.name}</p>
                                </div>
                                <p className="text-[10px] leading-relaxed line-clamp-3">{creatives[selectedCreativeIndex]?.primaryText}</p>
                                <div className="flex items-center justify-between gap-4 pt-2">
                                    <p className="text-xs font-black truncate">{creatives[selectedCreativeIndex]?.headline}</p>
                                    <button className="px-3 py-1 bg-white text-black text-[10px] font-black rounded">{creatives[selectedCreativeIndex]?.cta}</button>
                                </div>
                            </div>
                         </div>
                         <img src={`https://picsum.photos/seed/${platforms[0] || 'ad'}/280/500`} alt="Ad" className="w-full h-full object-cover -z-10" />
                      </div>
                  </div>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-black text-slate-900">Launch your campaign</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="p-8 bg-teal-50 rounded-3xl border border-teal-100 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                            <Zap size={32} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Deployment Logic Verification</h4>
                            <p className="text-sm text-slate-600">AI has verified your audience targeting for <span className="font-black">{platforms.join(' & ')}</span>. Expecting <span className="font-black">~{(budget * duration * 0.05).toFixed(0)} conversions</span>.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="font-bold text-slate-800 text-sm uppercase">Daily Budget</label>
                                <span className="font-black text-primary">${budget}</span>
                            </div>
                            <input 
                                type="range" min="10" max="1000" step="10"
                                className="w-full h-2 tosca-bg rounded-lg appearance-none cursor-pointer"
                                value={budget} onChange={(e) => setBudget(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="font-bold text-slate-800 text-sm uppercase">Duration</label>
                                <span className="font-black text-primary">{duration} Days</span>
                            </div>
                            <input 
                                type="range" min="7" max="365" step="1"
                                className="w-full h-2 tosca-bg rounded-lg appearance-none cursor-pointer"
                                value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Execution Plan</h4>
                    <div className="space-y-4">
                        <SummaryItem label="Flow" value={type} />
                        <SummaryItem label="Goal" value={objective} />
                        <SummaryItem label="Channels" value={platforms.join(', ')} />
                        <SummaryItem label="Targeting" value={strategy?.targetAudience?.substring(0, 30) + '...' || 'AI Smart Targeting'} />
                        <div className="pt-4 border-t border-slate-200">
                            <div className="flex justify-between">
                                <span className="text-sm font-bold text-slate-900">Project Total</span>
                                <span className="text-xl font-black text-primary">${budget * duration}</span>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-12 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button 
            onClick={handleBack}
            disabled={step === 1 || loading}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors disabled:opacity-0"
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          <div className="flex items-center gap-4">
            {step === 1 ? null : (
              step < 4 ? (
                <button 
                  onClick={handleNext}
                  disabled={loading || (step === 2 && !goal)}
                  className="px-8 py-4 tosca-bg text-white font-bold rounded-2xl hover:bg-primary-dark shadow-xl shadow-teal-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <><Loader2 className="animate-spin" /> Analyzing Strategy...</> : <>Next Step <ArrowRight size={18} /></>}
                </button>
              ) : (
                <button 
                  onClick={handlePublish}
                  disabled={loading}
                  className="px-12 py-5 tosca-bg text-white font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-teal-500/40 flex items-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Send size={24} />} Launch Campaign
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TypeCard = ({ active, onClick, title, desc, icon }: any) => (
  <button 
    onClick={onClick}
    className={`p-8 rounded-[32px] border-2 text-left transition-all ${active ? 'border-primary bg-teal-50 ring-4 ring-primary/5' : 'border-slate-100 bg-white hover:border-teal-100'}`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${active ? 'tosca-bg text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
        {React.cloneElement(icon, { size: 24 })}
    </div>
    <h3 className={`text-lg font-bold mb-2 ${active ? 'text-primary' : 'text-slate-800'}`}>{title}</h3>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    <div className={`mt-6 w-full h-1 rounded-full ${active ? 'tosca-bg' : 'bg-slate-100'}`}></div>
  </button>
);

const SummaryItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between text-xs">
        <span className="text-slate-400 font-bold uppercase">{label}</span>
        <span className="text-slate-700 font-bold text-right ml-4 truncate">{value}</span>
    </div>
);

export default CampaignBuilder;

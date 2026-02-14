
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, Zap, Target, Send, Loader2, Globe, Sparkles, Plus, Calendar, MapPin, X, MessageCircle, MoreHorizontal, ThumbsUp, Heart, Share2, Video,
  CheckCircle2, ChevronRight
} from 'lucide-react';
import { Platform, CampaignObjective, BrandProfile, AdCreative, Campaign, CampaignType } from '../types';
import { generateAdCreativeComplex, generateImageForAd } from '../services/geminiService';
import { orchestrateCampaignPublish } from '../services/dbService';
import { useNavigate } from 'react-router-dom';

interface CampaignBuilderProps {
  brandProfile: BrandProfile | null;
  onComplete: (campaign: Campaign) => void;
}

const CampaignBuilder: React.FC<CampaignBuilderProps> = ({ brandProfile, onComplete }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); 
  
  const [projectName, setProjectName] = useState(brandProfile?.name || 'New Project');
  const [goal, setGoal] = useState('');
  const [objective, setObjective] = useState<CampaignObjective>(CampaignObjective.Sales);
  const [platform, setPlatform] = useState<Platform>(Platform.Meta);
  const [budget, setBudget] = useState(50);
  const [region, setRegion] = useState('Indonesia');
  const [startDate, setStartDate] = useState('2026-02-14 09:15');
  const [endDate, setEndDate] = useState('2026-02-21 09:15');
  
  const [plans, setPlans] = useState<(AdCreative & { selected: boolean })[]>([]);
  const [audienceDesc, setAudienceDesc] = useState('');
  const [audienceTags, setAudienceTags] = useState(['Marketing', 'Food & Drink', 'Lifestyle']);

  useEffect(() => {
    if (brandProfile) {
      setProjectName(`${brandProfile.name} Launch`);
      setAudienceDesc(brandProfile.dna?.audience || brandProfile.summary || '');
    }
  }, [brandProfile]);

  const handleInitialGenerate = async () => {
    if (!goal || !brandProfile || !brandProfile.dna) {
      alert("Missing Brand DNA. Please complete the scanner first.");
      return;
    }
    setLoading(true);
    try {
      const generatedTexts = await generateAdCreativeComplex(brandProfile, platform, objective, goal);
      
      const plansWithImages = await Promise.all(generatedTexts.map(async (p) => {
        const imageUrl = await generateImageForAd(p.imagePrompt || p.headline);
        return { ...p, imageUrl, selected: true };
      }));
      
      setPlans(plansWithImages);
      setStep(2);
    } catch (e: any) {
      console.error("Ad Generation Error:", e);
      alert("Synthesis failed. Check your API key or DNA sequence.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    const selectedPlans = plans.filter(p => p.selected);
    if (selectedPlans.length === 0 || !brandProfile) return;
    
    setLoading(true);
    try {
      // business_id is extracted from the profile object
      const businessId = (brandProfile as any).business_id;
      if (!businessId) throw new Error("Could not identify business node.");

      const campaignToPublish = {
        business_id: businessId,
        name: projectName,
        type: CampaignType.SmartMulti,
        platforms: [platform],
        objective,
        audience: audienceDesc,
        budget,
        duration: 7,
        startDate,
        endDate,
        region
      };
      
      const published = await orchestrateCampaignPublish(campaignToPublish, selectedPlans);
      onComplete(published as any);
      navigate('/projects');
    } catch (e: any) {
      alert("Deployment failed: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const updatePlanText = (index: number, field: keyof AdCreative, value: string) => {
    const newPlans = [...plans];
    (newPlans[index] as any)[field] = value;
    setPlans(newPlans);
  };

  const togglePlanSelection = (index: number) => {
    const newPlans = [...plans];
    newPlans[index].selected = !newPlans[index].selected;
    setPlans(newPlans);
  };

  if (!brandProfile || !brandProfile.dna) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8 font-sans">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto text-slate-300 dark:text-slate-600 transition-colors">
            <Globe size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white font-display">Scan your brand first</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">ZieAds AI requires a Brand DNA sequence to synthesize high-converting content.</p>
        </div>
        <button onClick={() => navigate('/scanner')} className="px-10 py-5 tosca-bg text-white rounded-[24px] font-bold shadow-2xl shadow-teal-500/30 hover:scale-105 transition-all font-display text-lg">Initialize Website Scanner</button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-10 animate-in fade-in duration-700">
         <div className="text-center space-y-4">
            <div className="w-20 h-20 tosca-bg rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-teal-500/20">
               <Sparkles size={40} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">Launch Intelligence Engine</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">Input your current campaign goal. ZieAds will analyze your DNA and the platform algorithms to create winner ads.</p>
         </div>

         <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-10 transition-colors">
            <div className="space-y-4">
               <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Goal / Offer</label>
               <textarea 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Describe your offer: e.g. Buy 1 Get 1 Free for all burgers at MacDonald Indonesia this weekend."
                  className="w-full h-36 p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[32px] font-bold text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none text-xl placeholder:text-slate-300 dark:placeholder:text-slate-700"
               />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Target Platform</label>
                  <div className="flex gap-3">
                     {[Platform.Meta, Platform.Google].map(p => (
                        <button 
                          key={p}
                          onClick={() => setPlatform(p)}
                          className={`flex-1 py-4 rounded-2xl font-bold border transition-all ${platform === p ? 'tosca-bg text-white border-primary shadow-xl shadow-teal-500/20' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:border-primary/50'}`}
                        >
                           {p}
                        </button>
                     ))}
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Objective Protocol</label>
                  <select 
                     value={objective}
                     onChange={(e) => setObjective(e.target.value as CampaignObjective)}
                     className="w-full py-4 px-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-bold text-slate-900 dark:text-white outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                     {Object.values(CampaignObjective).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
               </div>
            </div>

            <button 
               onClick={handleInitialGenerate}
               disabled={!goal || loading}
               className="w-full py-6 tosca-bg text-white font-black text-2xl rounded-[32px] shadow-2xl shadow-teal-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
               {loading ? <Loader2 className="animate-spin" size={28} /> : <><Zap size={28} fill="currentColor" /> Synthesize Ad Plans</>}
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 animate-in fade-in duration-500 font-sans pb-20">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="w-full lg:w-[400px] bg-white dark:bg-slate-900 rounded-[48px] p-10 border border-slate-100 dark:border-slate-800 shadow-xl space-y-12 transition-colors sticky top-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display mb-8">Delivery Configuration</h2>
            <div className="space-y-6">
               <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 transition-colors">
                 <span>Daily Budget</span>
                 <span className="text-primary bg-teal-50 dark:bg-teal-500/10 px-3 py-1 rounded-lg">${budget}</span>
               </div>
               <div className="relative h-2 bg-teal-100 dark:bg-teal-900/30 rounded-full">
                  <div className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${((budget - 3) / 147) * 100}%` }}></div>
                  <input 
                    type="range" min="3" max="150" value={budget} onChange={(e) => setBudget(Number(e.target.value))}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-[4px] border-primary rounded-full shadow-lg pointer-events-none transition-all duration-300" style={{ left: `calc(${((budget - 3) / 147) * 100}% - 12px)` }}></div>
               </div>
               <div className="flex justify-between text-[11px] font-black text-slate-300 uppercase tracking-widest transition-colors">
                  <span>$3</span>
                  <span>$150</span>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[14px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">Contact Method</label>
              <button className="text-primary text-[12px] font-bold hover:underline">Add New</button>
            </div>
            <div className="w-full h-36 rounded-[32px] border-2 border-dashed border-teal-200 dark:border-teal-800 flex flex-col items-center justify-center gap-4 bg-teal-50/20 dark:bg-teal-500/5 group hover:border-primary hover:bg-teal-50/40 transition-all cursor-pointer">
               <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary transition-colors group-hover:scale-110">
                  <MessageCircle size={22} />
               </div>
               <span className="text-[14px] font-bold text-primary">Connect Contact Node</span>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-slate-50 dark:border-slate-800">
            <div className="space-y-2">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Identifier</label>
               <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white outline-none focus:border-primary transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Phase</label>
                  <div className="relative">
                    <input type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-[11px] font-bold dark:text-white" />
                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">End Phase</label>
                  <div className="relative">
                    <input type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-[11px] font-bold dark:text-white" />
                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Geo-Region</label>
               <div className="relative">
                 <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 font-bold dark:text-white transition-all outline-none focus:border-primary" />
                 <MapPin size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />
               </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-10 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="space-y-1">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">Delivery Plan</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Select and refine the creative assets synthesized by the AI cluster.</p>
             </div>
             <button className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-primary dark:text-teal-400 font-bold text-[14px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
               <Video size={20} className="fill-current opacity-20" /> AI Generate Video
             </button>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
             {plans.map((p, i) => (
                <AdPreviewCard key={i} plan={p} index={i} brandName={brandProfile.name} onToggle={() => togglePlanSelection(i)} onUpdate={(field, value) => updatePlanText(i, field, value)} />
             ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-12 rounded-[56px] border border-slate-100 dark:border-slate-800 space-y-10 transition-colors shadow-inner">
             <div className="grid md:grid-cols-2 gap-16">
                <div className="space-y-4">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Audience Psychology Description</h4>
                   <textarea value={audienceDesc} onChange={(e) => setAudienceDesc(e.target.value)} className="w-full h-32 bg-transparent text-slate-700 dark:text-slate-300 font-medium leading-relaxed outline-none resize-none border-none p-0 focus:ring-0 text-base" />
                </div>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Behavioral Tags</h4>
                      <span className="text-primary font-black text-[13px] tabular-nums">{audienceTags.length} Active Nodes</span>
                   </div>
                   <div className="flex flex-wrap gap-3">
                      {audienceTags.map(tag => (
                         <div key={tag} className="px-6 py-3 bg-white dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm text-[13px] font-bold text-slate-600 dark:text-slate-200 flex items-center gap-3 transition-colors">
                           {tag} <X size={14} className="cursor-pointer text-slate-300 hover:text-red-500 transition-colors" />
                         </div>
                      ))}
                      <button className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-500/10 text-primary dark:text-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/5 hover:scale-110 transition-all">
                         <Plus size={24} />
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <button 
            onClick={handlePublish}
            disabled={loading || plans.filter(p => p.selected).length === 0}
            className="w-full h-24 tosca-bg text-white font-black text-3xl rounded-[40px] shadow-[0_32px_64px_-12px_rgba(20,184,166,0.3)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-6 disabled:opacity-50 disabled:grayscale"
          >
            {loading ? <Loader2 className="animate-spin" size={32} /> : `Publish ${plans.filter(p => p.selected).length} Selected Ads`}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdPreviewCard = ({ plan, index, brandName, onToggle, onUpdate }: { plan: any, index: number, brandName: string, onToggle: () => void, onUpdate: (field: keyof AdCreative, val: string) => void }) => {
  const isMeta = plan.platform === Platform.Meta;

  return (
    <div className={`group/card relative bg-white dark:bg-slate-900 rounded-[40px] border-2 transition-all overflow-hidden ${plan.selected ? 'border-primary ring-8 ring-primary/5 shadow-2xl' : 'border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/30'}`}>
       <div className="p-6 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full tosca-bg text-white flex items-center justify-center font-black text-xs shadow-lg shadow-teal-500/20">{index + 1}</span>
            <span className="text-[15px] font-black text-slate-900 dark:text-white font-display">Plan Node</span>
          </div>
          <button 
            onClick={onToggle} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${plan.selected ? 'tosca-bg text-white shadow-lg shadow-teal-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 hover:text-slate-600'}`}
          >
             <CheckCircle2 size={14} /> {plan.selected ? 'Selected' : 'Use Plan'}
          </button>
       </div>
       <div className="p-6">
         {isMeta ? (
           <div className="space-y-4 font-sans">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full tosca-bg flex items-center justify-center text-white font-black text-sm shadow-md ring-4 ring-slate-50 dark:ring-slate-800">
                       {brandName.charAt(0)}
                    </div>
                    <div>
                       <p className="text-[14px] font-bold text-[#050505] dark:text-white leading-tight">{brandName}</p>
                       <p className="text-[12px] text-[#65676b] dark:text-slate-500 flex items-center gap-1">Sponsored <Globe size={11} /></p>
                    </div>
                 </div>
                 <div className="flex gap-1">
                   <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"><MoreHorizontal size={18} /></button>
                   <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"><X size={18} /></button>
                 </div>
              </div>
              <div className="relative">
                <textarea value={plan.primaryText} onChange={(e) => onUpdate('primaryText', e.target.value)} className="w-full bg-transparent text-[14px] text-[#050505] dark:text-slate-200 leading-[1.6] outline-none border-none p-0 resize-none hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-text p-1 min-h-[60px]" rows={3} />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative group shadow-inner">
                 <img src={plan.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Ad Visual" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 flex justify-between items-center rounded-3xl border border-slate-100 dark:border-slate-800 transition-colors">
                 <div className="space-y-1 flex-1 pr-4">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest truncate">Secure Node: ZieAds.ai</p>
                    <textarea value={plan.headline} onChange={(e) => onUpdate('headline', e.target.value)} className="w-full bg-transparent text-[16px] font-black text-[#050505] dark:text-white outline-none border-none p-0 resize-none leading-tight hover:underline cursor-text" rows={1} />
                 </div>
                 <input value={plan.cta} onChange={(e) => onUpdate('cta', e.target.value)} className="px-5 py-2.5 tosca-bg text-white dark:bg-slate-700 border border-primary/20 rounded-xl text-[13px] font-black uppercase tracking-widest w-28 text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-teal-500/10" />
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-slate-400 dark:text-slate-600 text-[12px] font-bold px-2 uppercase tracking-tighter">
                 <div className="flex gap-4">
                    <div className="flex items-center gap-1.5"><ThumbsUp size={14} className="fill-current text-blue-500" /><Heart size={14} className="fill-current text-red-500" /> <span className="ml-1">84</span></div>
                    <span>12 comments</span>
                 </div>
                 <span>6 shares</span>
              </div>
           </div>
         ) : (
           <div className="p-4 space-y-6 font-sans">
              <div className="space-y-1.5">
                 <div className="flex items-center gap-1.5 text-[12px] text-[#202124] dark:text-slate-400 overflow-hidden">
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"><Globe size={12} /></div>
                    <span className="font-medium">https://zieads.com</span>
                    <ChevronRight size={10} className="text-slate-300" />
                    <span className="truncate opacity-60">{brandName.toLowerCase().replace(/\s/g, '-')}</span>
                 </div>
                 <textarea value={plan.headline} onChange={(e) => onUpdate('headline', e.target.value)} className="w-full bg-transparent text-[22px] text-[#1a0dab] dark:text-blue-400 font-medium hover:underline cursor-text outline-none border-none p-0 resize-none leading-tight" rows={2} />
              </div>
              <textarea value={plan.primaryText} onChange={(e) => onUpdate('primaryText', e.target.value)} className="w-full bg-transparent text-[14px] text-[#4d5156] dark:text-slate-300 leading-[1.6] outline-none border-none p-0 resize-none hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-text p-1 min-h-[100px]" rows={5} />
              <div className="pt-4 grid grid-cols-2 gap-3">
                 <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[12px] font-bold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:border-primary transition-all">Sitelink Protocol A</div>
                 <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[12px] font-bold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:border-primary transition-all">Sitelink Protocol B</div>
              </div>
           </div>
         )}
       </div>
    </div>
  );
};

export default CampaignBuilder;


import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, Zap, Target, Send, Loader2, Globe, Sparkles, Plus, Calendar, MapPin, X, MessageCircle, MoreHorizontal, ThumbsUp, Heart, Share2, Video,
  CheckCircle2, ChevronRight, Eye, RefreshCw, Sliders, Maximize2, Check, Box, Layout, Smartphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Corrected import from CampaignType to Campaign
import { Platform, CampaignObjective, BrandProfile, AdCreative, Campaign, CampaignStatus, CreativeType, CreativeStatus } from '../types';
import { generateHybridAdCreative, generateImageForAd, HybridAdCreative, CanvasLayer } from '../services/geminiService';
// orchestrateCampaignPublish is now exported from dbService
import { orchestrateCampaignPublish } from '../services/dbService';

interface CampaignBuilderProps {
  brandProfile: BrandProfile | null;
  onComplete: (campaign: Campaign) => void;
  workspaceId: string;
}

const CampaignBuilder: React.FC<CampaignBuilderProps> = ({ brandProfile, onComplete, workspaceId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Ad Content Inputs, 2: Hybrid Workspace
  
  // Delivery Configuration
  const [projectName, setProjectName] = useState(brandProfile?.name || 'New Campaign');
  const [region, setRegion] = useState('Indonesia');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  
  // Ad Content Inputs
  const [productName, setProductName] = useState('');
  const [coreBenefit, setCoreBenefit] = useState('');
  const [platform, setPlatform] = useState<string>('Meta/Instagram Feed');
  const [objective, setObjective] = useState<CampaignObjective>(CampaignObjective.Sales);
  
  // Plans / Workspace State
  const [plans, setPlans] = useState<(HybridAdCreative & { imageUrl: string, selected: boolean, approved?: boolean, regenerating?: boolean })[]>([]);
  const [audienceDesc, setAudienceDesc] = useState('');

  useEffect(() => {
    if (brandProfile) {
      setProjectName(brandProfile.name || 'New Campaign');
      setAudienceDesc(brandProfile.dna?.audience || brandProfile.summary || 'Describe your target audience here...');
    }
  }, [brandProfile]);

  const handleStartGeneration = async () => {
    if (!productName || !coreBenefit) {
      alert("Please provide product details to proceed.");
      return;
    }

    setLoading(true);
    try {
      const activeProfile: BrandProfile = brandProfile || {
        workspace_id: workspaceId,
        name: projectName,
        summary: coreBenefit,
        description: coreBenefit,
        tone: 'Professional/Modern',
        primaryColor: '#14B8A6',
        secondaryColor: '#1E293B',
        colors: ['#14B8A6', '#1E293B'],
        products: [productName],
        audiences: [],
        dna: { 
          narrative: coreBenefit, 
          audience: 'Modern consumers', 
          visuals: 'Sas Venture Minimalist aesthetic' 
        }
      };

      const hybridPlans = await generateHybridAdCreative(activeProfile, platform, productName, coreBenefit);
      
      const plansWithImages = await Promise.all(hybridPlans.map(async (p, idx) => {
        const imageUrl = await generateImageForAd(p.ai_layer.nano_banana_prompt, activeProfile.name);
        return { ...p, imageUrl, selected: true, approved: false };
      }));
      
      setPlans(plansWithImages);
      setStep(2);
    } catch (e: any) {
      console.error("Ad Generation Error:", e);
      alert("Synthesis failed. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateImage = async (index: number) => {
    const plan = plans[index];
    const newPlans = [...plans];
    newPlans[index].regenerating = true;
    newPlans[index].approved = false;
    setPlans(newPlans);

    try {
      const newImageUrl = await generateImageForAd(plan.ai_layer.nano_banana_prompt, brandProfile?.name || projectName);
      const finalPlans = [...plans];
      finalPlans[index].imageUrl = newImageUrl;
      finalPlans[index].regenerating = false;
      setPlans(finalPlans);
    } catch (err) {
      alert("Regeneration failed.");
      const finalPlans = [...plans];
      finalPlans[index].regenerating = false;
      setPlans(finalPlans);
    }
  };

  const handleApprove = (index: number) => {
    const newPlans = [...plans];
    newPlans[index].approved = !newPlans[index].approved;
    setPlans(newPlans);
  };

  const handlePublish = async () => {
    const approvedPlans = plans.filter(p => p.approved);
    if (approvedPlans.length === 0) {
      alert("Please approve at least one poster before publishing.");
      return;
    }
    
    setLoading(true);
    try {
      const campaignToPublish = {
        workspace_id: workspaceId,
        name: projectName,
        platform: Platform.Meta,
        objective: objective,
        budget_daily: 50,
        start_date: startDate,
        end_date: endDate || undefined,
        settings: { region: region }
      };
      
      // Fixed: Mapped creatives properly to satisfy AdCreative interface
      const flattenedCreatives = approvedPlans.map(p => {
        const headlineLayer = p.canvas_layers.find(l => l.id === 'headline');
        const subHeadlineLayer = p.canvas_layers.find(l => l.id === 'sub_headline');
        const ctaLayer = p.canvas_layers.find(l => l.id === 'cta_button');
        
        const creative: AdCreative = {
          id: Math.random().toString(36).substr(2, 9),
          workspace_id: workspaceId,
          name: `${projectName} Variant`,
          platform: Platform.Meta,
          type: CreativeType.Image,
          headline: headlineLayer?.content || '',
          description: subHeadlineLayer?.content || '',
          cta_text: ctaLayer?.content || 'Learn More',
          asset_urls: [p.imageUrl],
          predicted_ctr: p.predictedCTR / 100,
          predicted_score: Math.floor(p.predictedCTR * 10),
          ai_generated: true,
          status: 'active' as CreativeStatus,
          metadata: {
            style: 'Modern/Minimalist'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return creative;
      });

      const published = await orchestrateCampaignPublish(campaignToPublish, flattenedCreatives);
      onComplete(published as Campaign);
      navigate('/campaigns');
    } catch (e: any) {
      alert("Deployment failed: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const updateLayerContent = (planIndex: number, layerId: string, content: string) => {
    const newPlans = [...plans];
    const plan = newPlans[planIndex];
    const layer = plan.canvas_layers.find(l => l.id === layerId);
    if (layer) {
      layer.content = content;
    }
    setPlans(newPlans);
  };

  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto py-12 md:py-24 space-y-10 animate-in fade-in duration-700">
         <div className="text-center space-y-4">
            <div className="w-16 h-16 tosca-bg rounded-[24px] flex items-center justify-center text-white mx-auto shadow-2xl shadow-teal-500/20 mb-2 rotate-3 hover:rotate-0 transition-transform">
               <Sparkles size={32} fill="currentColor" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-none">Transform DNA to Ads <br/><span className="text-primary">in under 2 minutes.</span></h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-base max-w-sm mx-auto">Sas Venture style poster engine. No designer required.</p>
         </div>

         <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 tosca-bg/5 blur-[50px] rounded-full"></div>
            
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 block">Product Name</label>
                  <div className="relative group">
                    <Box size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. NeoWatch S4"
                      className="w-full h-14 pl-12 pr-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 block">Core Benefit</label>
                  <div className="relative group">
                    <Target size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      value={coreBenefit}
                      onChange={(e) => setCoreBenefit(e.target.value)}
                      placeholder="e.g. Elegant Tech minimalist"
                      className="w-full h-14 pl-12 pr-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                    />
                  </div>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 block">Objective</label>
               <div className="grid grid-cols-2 gap-3">
                  {[CampaignObjective.Sales, CampaignObjective.Awareness, CampaignObjective.Leads, CampaignObjective.Traffic].map(obj => (
                    <button 
                      key={obj}
                      onClick={() => setObjective(obj)}
                      className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all flex items-center justify-center gap-2 ${objective === obj ? 'tosca-bg text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:bg-slate-50'}`}
                    >
                      {obj}
                    </button>
                  ))}
               </div>
            </div>

            <button 
               onClick={handleStartGeneration}
               disabled={!productName || !coreBenefit || loading}
               className="w-full h-20 tosca-bg text-white font-black text-xl rounded-[28px] shadow-2xl shadow-teal-500/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
               {loading ? <Loader2 className="animate-spin" size={28} /> : <><Zap size={24} fill="white" /> Generate Ad Poster →</>}
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-6 animate-in fade-in duration-500 font-sans pb-20">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Configuration */}
        <div className="w-full lg:w-[320px] bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-xl space-y-8 sticky top-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg tosca-bg flex items-center justify-center text-white">
               <Sliders size={18} />
             </div>
             <h2 className="text-lg font-black text-slate-900 dark:text-white font-display tracking-tight uppercase">Control Hub</h2>
          </div>
          <div className="h-0.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full"></div>

          <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 block">Project Identity</label>
               <input 
                type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white outline-none focus:border-primary transition-all text-sm"
               />
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 block">Geo Region</label>
                  <div className="relative">
                    <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 font-bold dark:text-white outline-none focus:border-primary transition-all text-sm" />
                    <MapPin size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 block">Start Date</label>
                  <div className="relative">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-bold dark:text-white outline-none focus:border-primary" />
                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Main Canvas Workspace */}
        <div className="flex-1 space-y-8 w-full">
          <div className="flex items-center justify-between">
             <div className="space-y-1">
               <h2 className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-none">Hybrid Editor</h2>
               <p className="text-sm font-medium text-slate-400">Sas Venture aesthetic active.</p>
             </div>
             <div className="flex items-center gap-2">
               <button 
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-50"
               >
                 Back
               </button>
             </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
             {plans.map((p, i) => (
                <AdPreviewCard 
                   key={i} 
                   plan={p} 
                   index={i} 
                   brandName={brandProfile?.name || projectName} 
                   onApprove={() => handleApprove(i)}
                   onRegenerate={() => handleRegenerateImage(i)}
                   onUpdateLayer={(layerId, content) => updateLayerContent(i, layerId, content)}
                />
             ))}
          </div>

          <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-950/20">
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-4 max-w-lg">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full border border-teal-500/20 text-[10px] font-black uppercase tracking-widest">Deployment Terminal</div>
                   <h3 className="text-3xl font-black font-display tracking-tight leading-none">Ready to scale?</h3>
                   <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      Approved hybrid posters are now primed for global orchestration.
                   </p>
                </div>
                <button 
                  onClick={handlePublish}
                  disabled={loading || plans.filter(p => p.approved).length === 0}
                  className="w-full md:w-auto px-12 h-20 tosca-bg text-white font-black text-xl rounded-[32px] shadow-2xl shadow-teal-500/30 hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:grayscale"
                >
                  {loading ? <Loader2 className="animate-spin" size={28} /> : <>Commit & Deploy <ArrowRight size={24} /></>}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AdPreviewCardProps {
  plan: any;
  index: number;
  brandName: string;
  onApprove: () => void;
  onRegenerate: () => void;
  onUpdateLayer: (id: string, content: string) => void;
}

const AdPreviewCard: React.FC<AdPreviewCardProps> = ({ plan, index, brandName, onApprove, onRegenerate, onUpdateLayer }) => {
  return (
    <div className={`relative bg-white dark:bg-slate-900 rounded-[40px] border-4 transition-all duration-700 overflow-hidden ${plan.approved ? 'border-[#7C3AED] shadow-2xl ring-[16px] ring-purple-500/5 scale-[1.03]' : 'border-slate-50 dark:border-slate-800 shadow-xl'}`}>
       <div className="p-6 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
             <div className={`w-2.5 h-2.5 rounded-full ${plan.approved ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
             <span className="text-[13px] font-black text-slate-500 dark:text-white uppercase tracking-widest">Candidate {index + 1}</span>
          </div>
          <button 
            onClick={onApprove} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-tight transition-all ${plan.approved ? 'bg-purple-600 text-white shadow-xl' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 hover:bg-slate-300'}`}
          >
             {plan.approved ? <Check size={14} /> : null} {plan.approved ? 'Approved' : 'Approve'}
          </button>
       </div>

       <div className="p-6 space-y-6">
          <div className="space-y-4">
             <div className="aspect-[4/5] rounded-[32px] overflow-hidden bg-slate-100 dark:bg-slate-950 shadow-inner relative group/image">
                {plan.regenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-xl z-[60]">
                    <Loader2 className="animate-spin text-teal-400 mb-2" size={32} />
                    <span className="text-[10px] text-white font-black uppercase tracking-widest animate-pulse">Re-Rendering...</span>
                  </div>
                ) : null}
                <img src={plan.imageUrl} className="w-full h-full object-cover transition-all duration-1000 group-hover/image:scale-105" alt="AI Aesthetic Layer" />
                <div className="absolute inset-0 pointer-events-none select-none z-[50]">
                   {plan.canvas_layers.map((layer: CanvasLayer) => (
                      <div 
                         key={layer.id}
                         className="absolute pointer-events-auto"
                         style={{ 
                            left: `${layer.position.x_percent}%`, 
                            top: `${layer.position.y_percent}%`,
                            transform: 'translate(-50%, -50%)',
                            textAlign: (layer.style.align as any) || 'center',
                            width: '85%'
                         }}
                      >
                         {layer.type === 'text' ? (
                            <textarea 
                               value={layer.content}
                               onChange={(e) => onUpdateLayer(layer.id, e.target.value)}
                               className="w-full bg-transparent border-none outline-none resize-none p-2 focus:ring-4 focus:ring-primary/20 rounded-xl text-shadow-lg transition-all"
                               style={{
                                  fontSize: layer.id === 'headline' ? '28px' : '15px',
                                  fontWeight: layer.id === 'headline' ? 900 : 500,
                                  color: layer.style.color || '#FFFFFF',
                                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                                  lineHeight: 1.1,
                                  textShadow: '0 4px 12px rgba(0,0,0,0.5)'
                               }}
                               rows={2}
                            />
                         ) : (
                            <button 
                               className="px-8 py-3 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-2xl pointer-events-none transition-transform hover:scale-110"
                               style={{
                                  backgroundColor: layer.style.bg_color || '#14B8A6',
                                  color: layer.style.text_color || '#FFFFFF',
                                  borderRadius: layer.style.border_radius || '16px'
                               }}
                            >
                               {layer.content}
                            </button>
                         )}
                      </div>
                   ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-6 opacity-0 group-hover/image:opacity-100 transition-all duration-500 z-[70] pointer-events-none">
                   <button 
                    onClick={(e) => { e.stopPropagation(); onRegenerate(); }}
                    className="w-16 h-16 bg-white/10 hover:bg-white/20 backdrop-blur-3xl rounded-full flex items-center justify-center text-white border border-white/20 transition-all hover:scale-110 pointer-events-auto shadow-2xl"
                   >
                      <RefreshCw size={28} className={plan.regenerating ? 'animate-spin' : ''} />
                   </button>
                   <button 
                    className="w-16 h-16 bg-white/10 hover:bg-white/20 backdrop-blur-3xl rounded-full flex items-center justify-center text-white border border-white/20 transition-all hover:scale-110 pointer-events-auto shadow-2xl"
                   >
                      <Maximize2 size={28} />
                   </button>
                </div>
             </div>
             <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex flex-col">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Efficiency score</p>
                   <p className="text-xl font-black text-teal-500">{plan.predictedCTR}% CTR</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default CampaignBuilder;

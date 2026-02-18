
import React, { useState, useRef } from 'react';
import { 
  Globe, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Database,
  Cpu,
  Fingerprint,
  Zap,
  Layout,
  Palette,
  Activity,
  ChevronRight,
  Monitor,
  Image as ImageIcon,
  FileText,
  Plus,
  X,
  Sparkles,
  History,
  RotateCcw
} from 'lucide-react';
// @ts-ignore - Ignore missing member errors due to potential type resolution issues
import { useNavigate } from 'react-router-dom';
import { scanWebsite } from '../services/geminiService';
import { updateWorkspaceBrandProfile } from '../services/dbService';
import { BrandProfile, Workspace } from '../types';

interface WebsiteScannerProps {
  onScanComplete: (profile: BrandProfile) => void;
  currentProfile: BrandProfile | null;
  activeWorkspace: Workspace | null;
}

const WebsiteScanner: React.FC<WebsiteScannerProps> = ({ onScanComplete, currentProfile, activeWorkspace }) => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeStep, setActiveStep] = useState(0); 
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [guidelineFile, setGuidelineFile] = useState<File | null>(null);
  
  const [analysisStream, setAnalysisStream] = useState<{
    assets: boolean;
    narrative: boolean;
    audience: boolean;
    visuals: boolean;
  }>({ assets: false, narrative: false, audience: false, visuals: false });
  
  const [scannedProfile, setScannedProfile] = useState<BrandProfile | null>(currentProfile);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const guidelineInputRef = useRef<HTMLInputElement>(null);

  const hasExistingDNA = currentProfile && currentProfile.dna;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGuidelineUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setGuidelineFile(file);
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setActiveStep(1);
    
    try {
      const profile = await scanWebsite(url, logoPreview || undefined);
      // Map to proper profile type
      const finalProfile: BrandProfile = {
        ...profile,
        workspace_id: activeWorkspace?.id || 'temp',
      };
      
      await new Promise(r => setTimeout(r, 800));
      setAnalysisStream(prev => ({ ...prev, assets: true }));
      await new Promise(r => setTimeout(r, 1000));
      setAnalysisStream(prev => ({ ...prev, narrative: true }));
      await new Promise(r => setTimeout(r, 1000));
      setAnalysisStream(prev => ({ ...prev, audience: true }));
      await new Promise(r => setTimeout(r, 1000));
      setAnalysisStream(prev => ({ ...prev, visuals: true }));
      await new Promise(r => setTimeout(r, 500));

      setScannedProfile(finalProfile);
      setActiveStep(2);
    } catch (err) {
      console.error("Scan Error:", err);
      alert('AI Node encountered an error processing this DNA sequence.');
      setActiveStep(0);
      setAnalysisStream({ assets: false, narrative: false, audience: false, visuals: false });
    } finally {
      setIsScanning(false);
    }
  };

  const handleCommitDNA = async () => {
    if (!scannedProfile || !activeWorkspace) return;
    
    setIsSaving(true);
    try {
      await updateWorkspaceBrandProfile(activeWorkspace.id, scannedProfile);
      onScanComplete(scannedProfile);
      return true;
    } catch (err) {
      console.error("Save failed:", err);
      alert("System was unable to persist Brand DNA.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartAd = async () => {
    if (activeStep === 2 && scannedProfile) {
      const success = await handleCommitDNA();
      if (!success) return;
    }
    navigate('/builder');
  };

  return (
    <div className="min-h-full space-y-12 animate-in fade-in duration-700 font-sans pb-20">
      <header className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 dark:bg-teal-500/10 text-primary dark:text-teal-400 text-[10px] font-bold tracking-tight rounded-full border border-teal-100 dark:border-teal-500/20 transition-all">
          <Zap size={12} fill="currentColor" /> Autonomous Brand Intelligence
        </div>
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white tracking-[-0.03em] font-display transition-colors">
          Analyze your <span className="text-primary">Brand DNA</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed transition-colors">
          Deploy ZieAds neural crawlers to synthesize your brand story, audience psychology, and visual identity in seconds.
        </p>
      </header>

      <div className="max-w-6xl mx-auto space-y-12">
        {hasExistingDNA && activeStep === 0 && (
          <div className="bg-gradient-to-r from-teal-500/5 to-primary/5 dark:from-slate-900 dark:to-slate-900 rounded-[40px] border border-teal-100 dark:border-teal-500/20 p-10 space-y-8 animate-in slide-in-from-top-4 duration-500">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl tosca-bg flex items-center justify-center text-white shadow-lg">
                      <Fingerprint size={24} />
                   </div>
                   <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Your strong DNA is {currentProfile.name}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Contextual engine is currently active with these parameters.</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                    onClick={() => navigate('/builder')}
                    className="px-6 py-3 tosca-bg text-white font-bold rounded-2xl shadow-xl shadow-teal-500/10 hover:scale-105 transition-all flex items-center gap-2"
                   >
                     Create ad with this DNA <ArrowRight size={18} />
                   </button>
                </div>
             </div>

             <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-3">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-teal-500 uppercase tracking-tight">
                      <Zap size={14} /> Narrative
                   </div>
                   <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
                      {currentProfile.dna?.narrative}
                   </p>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-3">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-teal-500 uppercase tracking-tight">
                      <Fingerprint size={14} /> Audience
                   </div>
                   <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
                      {currentProfile.dna?.audience}
                   </p>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-3">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-teal-500 uppercase tracking-tight">
                      <Palette size={14} /> Visuals
                   </div>
                   <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
                      {currentProfile.dna?.visuals}
                   </p>
                </div>
             </div>
             
             <div className="flex items-center gap-3 pt-4 justify-center">
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Wanna change or try another option?</p>
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
             </div>
          </div>
        )}

        {activeStep === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-[48px] p-12 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 transition-all">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-tight ml-2 block">1. Visual source (Logo)</label>
                <div 
                  onClick={() => logoInputRef.current?.click()}
                  className={`relative aspect-[16/5] rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group ${
                    logoPreview 
                    ? 'border-primary bg-teal-50/30 dark:bg-teal-500/5' 
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:border-primary hover:bg-teal-50/30'
                  }`}
                >
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  {logoPreview ? (
                    <div className="relative w-full h-full flex items-center justify-center p-6">
                      <img src={logoPreview} alt="Logo Preview" className="max-h-full max-w-full object-contain drop-shadow-md" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setLogoPreview(null); setLogoFile(null); }}
                        className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                        <ImageIcon size={24} />
                      </div>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-tight">Upload brand mark</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-tight ml-2 block">2. Digital presence (URL)</label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 focus-within:border-primary dark:focus-within:border-teal-500/50 focus-within:ring-8 focus-within:ring-primary/5 transition-all">
                  <div className="pl-5 text-slate-400">
                    <Globe size={20} />
                  </div>
                  <input 
                    type="url" 
                    placeholder="https://your-brand-domain.com" 
                    className="flex-1 bg-transparent py-4 text-slate-900 dark:text-white font-bold outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 placeholder:font-medium text-lg"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                  <div className="px-4 hidden lg:flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-tight">
                    <Database size={14} /> Neural Index
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between ml-2">
                  <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-tight">3. Strategic DNA (Guidelines - Optional)</label>
                  <span className="text-[10px] font-bold text-slate-300 tracking-tight">PDF, PPT, DOCX</span>
                </div>
                <div 
                  onClick={() => guidelineInputRef.current?.click()}
                  className={`p-6 rounded-3xl border-2 border-dashed transition-all cursor-pointer group flex items-center gap-4 ${
                    guidelineFile 
                    ? 'border-primary bg-teal-50/30 dark:bg-teal-500/5' 
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:border-primary'
                  }`}
                >
                  <input type="file" ref={guidelineInputRef} className="hidden" accept=".pdf,.ppt,.pptx,.doc,.docx" onChange={handleGuidelineUpload} />
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    guidelineFile ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 text-slate-300 group-hover:text-primary'
                  }`}>
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">
                      {guidelineFile ? guidelineFile.name : 'Upload brand guidelines'}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 tracking-tight">
                      {guidelineFile ? `${(guidelineFile.size / 1024 / 1024).toFixed(2)} MB` : 'Inject deeper brand context'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleScan}
                  disabled={!url || isScanning}
                  className="w-full h-16 tosca-bg text-white px-10 py-4 rounded-[24px] font-bold shadow-2xl shadow-teal-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 font-display tracking-tight text-lg disabled:opacity-50"
                >
                  <Zap size={24} fill="white" /> Scan brand now <ArrowRight size={24} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="bg-[#111827] rounded-full p-2 border border-white/5 shadow-2xl overflow-hidden relative group">
               <div className="flex items-center justify-between px-8 py-3 relative z-10">
                  <div className="flex items-center gap-4">
                     <span className="w-3 h-3 rounded-full bg-teal-500 animate-pulse"></span>
                     <span className="text-[11px] font-bold text-teal-400 tracking-tight font-mono tabular-nums">Scanning DNA sequence: {url.slice(0, 30)}...</span>
                  </div>
                  <Activity className="text-slate-600 animate-pulse" size={16} />
               </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <AnalysisBox title="asset_ingestion" label="Step 1: Visual analysis" active={true} completed={analysisStream.assets} text="Parsing patterns..." />
              <AnalysisBox title="marketing_narrative" label="Step 2: DNA synthesis" active={analysisStream.assets} completed={analysisStream.narrative} text="Synthesizing archetypes..." />
              <AnalysisBox title="audience_psychology" label="Step 3: Behavioral mapping" active={analysisStream.narrative} completed={analysisStream.audience} text="Mapping emotional resonance..." />
              <AnalysisBox title="visual_dna" label="Step 4: Aesthetic logic" active={analysisStream.audience} completed={analysisStream.visuals} text="Decoding color theory..." />
            </div>
          </div>
        )}

        {activeStep === 2 && scannedProfile && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
             <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm transition-colors sticky top-8 h-fit">
                   <div className="flex flex-col items-center text-center space-y-6">
                      <div className="w-24 h-24 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-4 shadow-inner relative transition-colors overflow-hidden">
                         {scannedProfile.logoUrl ? (
                           <img src={scannedProfile.logoUrl} className="max-w-full max-h-full object-contain" alt="Brand Logo" />
                         ) : (
                           <Layout size={40} className="text-primary" />
                         )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{scannedProfile.name}</h2>
                        <p className="text-[10px] font-bold text-slate-400 tracking-tight mt-1">AI-Certified DNA</p>
                      </div>

                      <div className="w-full space-y-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                         <button 
                          onClick={handleCommitDNA}
                          disabled={isSaving}
                          className={`w-full h-14 font-bold rounded-2xl transition-all text-xs flex items-center justify-center gap-2 ${
                            isSaving ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm'
                          }`}
                         >
                           {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Database size={16} />}
                           {isSaving ? 'Syncing DNA...' : 'Save DNA to Vault'}
                         </button>
                         <button 
                          onClick={handleStartAd}
                          className="w-full h-14 tosca-bg text-white font-bold rounded-2xl shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
                         >
                           Launch Campaign with this DNA <ArrowRight size={16} />
                         </button>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                   <DNASection icon={<Zap className="text-teal-400" size={18} />} label="core_narrative" title="Component 1: Value proposition" content={scannedProfile.dna?.narrative || scannedProfile.summary} />
                   <DNASection icon={<Fingerprint className="text-teal-400" size={18} />} label="audience_psychology" title="Component 2: Behavioral signals" content={scannedProfile.dna?.audience || "Mapping emotional resonance..."} />
                   <DNASection icon={<Palette className="text-teal-400" size={18} />} label="visual_identity" title="Component 3: Aesthetic logic" content={scannedProfile.dna?.visuals || "Synthesizing color theory rules..."} />
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AnalysisBox = ({ title, label, active, completed, text }: { title: string, label: string, active: boolean, completed: boolean, text: string }) => (
  <div className={`p-8 rounded-[32px] border transition-all duration-500 ${
    completed 
    ? 'bg-white dark:bg-slate-900 border-teal-500/30 shadow-xl shadow-teal-500/5' 
    : active 
      ? 'bg-white dark:bg-slate-900 border-primary ring-8 ring-primary/5' 
      : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800 opacity-40'
  }`}>
    <div className="flex items-center justify-between mb-4">
       <div className="flex items-center gap-3">
          {completed ? (
            <div className="p-2 bg-teal-500 text-white rounded-xl"><CheckCircle2 size={16} /></div>
          ) : active ? (
            <Loader2 size={24} className="text-primary animate-spin" />
          ) : (
            <Monitor size={24} className="text-slate-400" />
          )}
          <span className="text-[10px] font-bold text-primary dark:text-teal-400 tracking-tight font-mono">{title}</span>
       </div>
    </div>
    <div className="space-y-3">
       <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{label}</h4>
       <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed font-mono transition-colors italic">
          {completed ? "Analysis protocol complete. Results synthesized." : text}
       </p>
    </div>
  </div>
);

const DNASection = ({ icon, label, title, content }: { icon: React.ReactNode, label: string, title: string, content: string }) => (
  <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 p-10 shadow-sm space-y-6 transition-colors group">
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">{icon}</div>
          <span className="text-[10px] font-bold text-slate-400 tracking-tight font-mono">{label}</span>
       </div>
       <ChevronRight className="text-slate-200 group-hover:text-primary transition-colors" size={20} />
    </div>
    <div className="space-y-4">
       <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
       <p className="text-[15px] font-medium text-slate-500 dark:text-slate-400 leading-[1.8]">
          {content}
       </p>
    </div>
  </div>
);

export default WebsiteScanner;

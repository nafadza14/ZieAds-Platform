
import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Upload, 
  Palette, 
  Type, 
  Layout, 
  ArrowRight,
  Eye,
  Edit3,
  Droplets,
  RefreshCcw
} from 'lucide-react';
import { scanWebsite } from '../services/geminiService';
import { BrandProfile } from '../types';

interface WebsiteScannerProps {
  onScanComplete: (profile: BrandProfile) => void;
  currentProfile: BrandProfile | null;
}

const WebsiteScanner: React.FC<WebsiteScannerProps> = ({ onScanComplete, currentProfile }) => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState('');
  const [step, setStep] = useState(1);
  
  // Refinement State
  const [editableProfile, setEditableProfile] = useState<BrandProfile | null>(currentProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (currentProfile) {
      setEditableProfile(currentProfile);
      setStep(2); // If profile exists, show refinement
    }
  }, [currentProfile]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setProgress('Initializing ZieAds crawler...');
    
    try {
      // Simulate steps for UI feedback
      setTimeout(() => setProgress('Extracting high-resolution assets...'), 1000);
      setTimeout(() => setProgress('Detecting brand DNA and colors...'), 2000);
      setTimeout(() => setProgress('Synthesizing brand strategy...'), 3500);

      const profile = await scanWebsite(url);
      setEditableProfile(profile);
      onScanComplete(profile);
      setStep(2);
    } catch (err) {
      alert('Failed to scan website. Please check the URL and try again.');
    } finally {
      setIsScanning(false);
      setProgress('');
    }
  };

  const updateProfile = (updates: Partial<BrandProfile>) => {
    if (!editableProfile) return;
    const newProfile = { ...editableProfile, ...updates };
    setEditableProfile(newProfile);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoUrl = event.target?.result as string;
        updateProfile({ logoUrl });
        extractColorsFromImage(logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColorsFromImage = (src: string) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Simple dominant color extraction
      const samplePoints = [
        [Math.floor(img.width / 2), Math.floor(img.height / 2)],
        [Math.floor(img.width / 4), Math.floor(img.height / 4)],
        [Math.floor(img.width * 0.75), Math.floor(img.height * 0.75)],
      ];

      const rgbToHex = (r: number, g: number, b: number) => 
        "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

      const colors = samplePoints.map(([x, y]) => {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        return rgbToHex(pixel[0], pixel[1], pixel[2]);
      });

      updateProfile({ 
        primaryColor: colors[0], 
        secondaryColor: colors[1] || colors[0] 
      });
    };
    img.src = src;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-700 font-sans">
      <canvas ref={canvasRef} className="hidden" />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Side: Configuration & Onboarding */}
        <div className="space-y-8">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-primary text-[11px] font-bold rounded-full border border-teal-100">
              <Sparkles size={12} /> ZieAds AI Brand Engine
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Build Your Brand DNA
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Our AI analyzes your digital presence to automate campaign creation. No manual setup required.
            </p>
          </header>

          {step === 1 ? (
            <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 font-display">
                  <Globe size={20} className="text-primary" /> Scan from Website
                </h3>
                <form onSubmit={handleScan} className="relative group">
                  <div className={`flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border transition-all ${isScanning ? 'border-primary ring-4 ring-primary/10' : 'border-slate-100 group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary/10'}`}>
                    <div className="pl-4 text-slate-400">
                      <Globe size={20} />
                    </div>
                    <input 
                      type="url" 
                      placeholder="https://your-business.com" 
                      className="flex-1 bg-transparent py-4 text-slate-800 font-bold outline-none placeholder:text-slate-300 placeholder:font-medium"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={isScanning}
                      required
                    />
                    <button 
                      type="submit"
                      disabled={isScanning || !url}
                      className="tosca-bg text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isScanning ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                      {isScanning ? 'Scanning...' : 'Start Scan'}
                    </button>
                  </div>
                </form>
              </div>

              {isScanning && (
                <div className="space-y-6 pt-4 text-center">
                  <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full tosca-bg animate-[progress_5s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-sm font-bold text-slate-400 animate-pulse italic">
                    {progress}
                  </p>
                </div>
              )}

              <div className="pt-6 grid grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto text-primary">
                    <Layout size={20} />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400">Logo extract</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto text-primary">
                    <Palette size={20} />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400">Color match</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto text-primary">
                    <Type size={20} />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400">Voice synth</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
              <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 font-display">
                    <Edit3 size={20} className="text-primary" /> Refine brand profile
                  </h3>
                  <button onClick={() => setStep(1)} className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                    <RefreshCcw size={12} /> Restart scan
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Logo & identity</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-40 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-teal-50/30 transition-all group overflow-hidden relative"
                    >
                      {editableProfile?.logoUrl ? (
                        <>
                          <img src={editableProfile.logoUrl} alt="Logo" className="h-full w-full object-contain p-4" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-bold text-xs">Change logo</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload size={24} className="text-slate-300 group-hover:text-primary" />
                          <span className="text-xs font-bold text-slate-400">Upload your logo</span>
                          <span className="text-[10px] text-slate-300 font-semibold">PNG, JPG or SVG</span>
                        </>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Brand colors</label>
                      {editableProfile?.logoUrl && (
                        <button 
                          onClick={() => extractColorsFromImage(editableProfile.logoUrl!)}
                          className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                        >
                          <Droplets size={10} /> Sync colors from logo
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400">Primary Color</span>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <input 
                            type="color" 
                            className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none appearance-none" 
                            value={editableProfile?.primaryColor || '#14B8A6'}
                            onChange={(e) => updateProfile({ primaryColor: e.target.value })}
                          />
                          <div className="flex-1">
                            <span className="text-[11px] font-mono font-bold uppercase block">{editableProfile?.primaryColor}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Main CTA</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400">Secondary Color</span>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <input 
                            type="color" 
                            className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none appearance-none" 
                            value={editableProfile?.secondaryColor || '#1E293B'}
                            onChange={(e) => updateProfile({ secondaryColor: e.target.value })}
                          />
                          <div className="flex-1">
                            <span className="text-[11px] font-mono font-bold uppercase block">{editableProfile?.secondaryColor}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Backdrops</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Business name & summary</label>
                  <div className="space-y-3">
                    <input 
                      type="text"
                      placeholder="Your business name"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                      value={editableProfile?.name}
                      onChange={(e) => updateProfile({ name: e.target.value })}
                    />
                    <textarea 
                      className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[32px] text-sm font-medium text-slate-700 leading-relaxed focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                      rows={4}
                      placeholder="What makes your business special?"
                      value={editableProfile?.description}
                      onChange={(e) => updateProfile({ description: e.target.value })}
                    />
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (editableProfile) onScanComplete(editableProfile);
                    setStep(3);
                  }}
                  className="w-full py-5 tosca-bg text-white font-bold text-xl rounded-2xl shadow-xl shadow-teal-500/20 flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 transition-all font-display"
                >
                  Confirm brand DNA <ArrowRight size={24} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 space-y-8 animate-in zoom-in-95 duration-500">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full tosca-bg flex items-center justify-center text-white shadow-lg">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-display">Final Step: Connect Channels</h3>
                <p className="text-slate-500 text-sm max-w-sm">Select which ad networks you want to sync your new brand profile with.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PlatformSelector label="Meta Ads" platform="Meta" />
                <PlatformSelector label="Google Ads" platform="Google" />
                <PlatformSelector label="TikTok Ads" platform="TikTok" />
                <PlatformSelector label="Bing Ads" platform="Bing" />
                <PlatformSelector label="LinkedIn Ads" platform="LinkedIn" />
              </div>

              <button 
                onClick={() => window.location.href = '/'}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors"
              >
                Go to dashboard
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Preview */}
        <div className="sticky top-8 lg:block">
          <div className="bg-slate-900 rounded-[48px] p-1 border-4 border-slate-800 shadow-2xl">
             <div className="bg-white rounded-[44px] overflow-hidden min-h-[600px] flex flex-col">
                <div className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-slate-50/50">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full tosca-bg flex items-center justify-center text-white text-[8px] font-bold">Z</div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">ZieAds Preview</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                   </div>
                </div>

                <div className="flex-1 p-8 flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50/50">
                   <div className="w-full max-w-[340px] space-y-8 text-center">
                      <div className="relative group mx-auto">
                        <div className="absolute inset-0 tosca-bg opacity-10 blur-2xl rounded-full scale-150 animate-pulse"></div>
                        <div className="relative w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto border border-slate-100 overflow-hidden">
                          {editableProfile?.logoUrl ? (
                            <img src={editableProfile.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <div className="text-slate-200">
                              <Layout size={40} />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-3xl font-extrabold text-slate-900 leading-[1.1] tracking-tight font-display">
                          {editableProfile?.name || 'Your Brand Name'}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                          {editableProfile?.description?.slice(0, 160) || 'Paste your URL to see your brand value proposition synthesized in real-time.'}
                          {editableProfile?.description && editableProfile.description.length > 160 ? '...' : ''}
                        </p>
                      </div>

                      <div className="pt-4">
                        <button 
                          style={{ backgroundColor: editableProfile?.primaryColor || '#14B8A6' }}
                          className="w-full py-4 px-8 text-white font-bold text-lg rounded-2xl shadow-xl shadow-teal-500/10 transition-all hover:scale-[1.02] active:scale-95 font-display"
                        >
                          Discover more
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-6">
                        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: editableProfile?.primaryColor || '#14B8A6' }}></div>
                           <span className="text-[10px] font-bold text-slate-500">Primary color</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: editableProfile?.secondaryColor || '#1E293B' }}></div>
                           <span className="text-[10px] font-bold text-slate-500">Secondary color</span>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="h-16 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-12 text-slate-300">
                    <Globe size={18} />
                    <Eye size={18} />
                    <CheckCircle2 size={18} />
                </div>
             </div>
          </div>
          
          <div className="mt-8 text-center text-[11px] font-bold text-slate-400 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> AI Compliant</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> Cross platform</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> Roas optimized</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlatformSelector = ({ label, platform }: { label: string, platform: string }) => {
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    if (connected) return;
    setTimeout(() => {
      setConnected(true);
    }, 1000);
  };

  return (
    <div 
      onClick={handleConnect}
      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
        connected 
          ? 'bg-[#7C3AED]/10 border-[#7C3AED] shadow-lg shadow-[#7C3AED]/10' 
          : 'bg-white border-slate-100 hover:border-primary'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${connected ? 'bg-[#7C3AED] text-white' : 'bg-slate-50 text-slate-400'}`}>
            <Globe size={20} />
          </div>
          <div>
            <p className={`text-sm font-bold ${connected ? 'text-[#7C3AED]' : 'text-slate-700'}`}>{label}</p>
            <p className="text-[10px] font-medium text-slate-400">Marketing API v14.0</p>
          </div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${connected ? 'bg-[#7C3AED] border-[#7C3AED]' : 'border-slate-200'}`}>
          {connected && <CheckCircle2 size={12} className="text-white" />}
        </div>
      </div>
      <div className="mt-3">
        <button 
          className={`w-full py-2 rounded-lg text-[11px] font-bold transition-all ${
            connected ? 'bg-[#7C3AED] text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-600'
          }`}
        >
          {connected ? 'Select ad account' : 'Connect first'}
        </button>
      </div>
    </div>
  );
};

export default WebsiteScanner;

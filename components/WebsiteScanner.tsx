
import React, { useState } from 'react';
import { Globe, Search, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
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

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setProgress('Initializing crawler...');
    
    setTimeout(() => setProgress('Extracting brand assets...'), 1500);
    setTimeout(() => setProgress('Analyzing content with AI...'), 3000);

    try {
      const profile = await scanWebsite(url);
      onScanComplete(profile);
    } catch (err) {
      alert('Failed to scan website. Please try again.');
    } finally {
      setIsScanning(false);
      setProgress('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl tosca-bg text-white mb-6">
          <Search size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Website Scanner</h1>
        <p className="text-slate-500 max-w-lg mx-auto">Enter your website URL, and our AI will automatically build your brand profile for high-converting ads.</p>
      </header>

      <form onSubmit={handleScan} className="flex gap-4 p-2 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="flex-1 flex items-center px-4 gap-3">
          <Globe className="text-slate-400" size={20} />
          <input 
            type="url" 
            placeholder="https://your-business.com" 
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 font-medium py-4"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isScanning}
            required
          />
        </div>
        <button 
          type="submit"
          disabled={isScanning}
          className="px-8 py-4 rounded-xl tosca-bg text-white font-bold hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isScanning ? <><Loader2 className="animate-spin" size={20} /> Scanning...</> : 'Scan Website'}
        </button>
      </form>

      {isScanning && (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full tosca-bg animate-[progress_5s_ease-in-out_infinite]" style={{width: '60%'}}></div>
          </div>
          <p className="text-sm font-medium text-slate-500 italic">{progress}</p>
        </div>
      )}

      {currentProfile && !isScanning && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-700">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm col-span-2">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Sparkles size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">AI Generated Brand Identity</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Brand Summary</h2>
            <p className="text-slate-600 leading-relaxed mb-6">{currentProfile.summary}</p>
            
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 rounded-lg bg-teal-50 border border-teal-100">
                <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Tone of Voice</span>
                <span className="text-primary font-bold">{currentProfile.tone}</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Primary Colors</span>
                <div className="flex gap-2 mt-1">
                  {currentProfile.colors.map(c => (
                    <div key={c} className="w-6 h-6 rounded-full border border-slate-200" style={{backgroundColor: c}}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" /> Products & Services
            </h3>
            <ul className="space-y-3">
              {currentProfile.products.map(p => (
                <li key={p} className="flex items-center gap-3 text-slate-600 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full tosca-bg"></div>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" /> Target Audiences
            </h3>
            <ul className="space-y-3">
              {currentProfile.audiences.map(a => (
                <li key={a} className="flex items-center gap-3 text-slate-600 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full tosca-bg"></div>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 flex justify-center pt-8">
            <button className="px-8 py-3 rounded-xl border-2 tosca-border tosca-text font-bold hover:bg-teal-50 transition-all">
              Re-Scan Website
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteScanner;

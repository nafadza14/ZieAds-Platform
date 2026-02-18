
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, X, Edit, Copy, Trash2, 
  ChevronDown, CheckCircle2, AlertCircle, 
  Plus, Play, Pause, MoreHorizontal,
  Layout, Smartphone, Monitor, Check, Loader2, Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Platform, AdCreative, CreativeStatus, CreativeType, AIGenerationJob } from '../types';
import { startCreativeGeneration, getGenerationJob, listCreatives } from '../services/dbService';

type StudioTab = 'Performance' | 'Generate' | 'Library' | 'Variations';

const AdminLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StudioTab>('Performance');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [creatives, setCreatives] = useState<AdCreative[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [generatingJob, setGeneratingJob] = useState<AIGenerationJob | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Load creatives from DB
  const loadCreatives = async () => {
    setLoading(true);
    try {
      // Mocking workspace ID for now
      const data = await listCreatives({ workspace_id: 'zieads-root-master' });
      setCreatives(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreatives();
  }, []);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleStartGeneration = async () => {
    try {
      const job = await startCreativeGeneration({
        workspace_id: 'zieads-root-master',
        brand_voice: 'Professional',
        platforms: [Platform.Meta],
        count: 10,
        include_video: false,
        focus: 'conversions'
      });
      
      setGeneratingJob(job);
      setGenerationProgress(10);
      
      // Start Polling simulation (In real app, use Supabase Realtime)
      const poll = setInterval(async () => {
        const updated = await getGenerationJob(job.id);
        if (updated.status === 'processing') setGenerationProgress(45);
        if (updated.status === 'completed') {
          setGenerationProgress(100);
          clearInterval(poll);
          setTimeout(() => {
            setGeneratingJob(null);
            setShowGenerateModal(false);
            loadCreatives();
          }, 1000);
        }
      }, 2000);

    } catch (err) {
      alert("Generation failed to start");
    }
  };

  return (
    <div className="bg-[#0F172A] min-h-full font-sans text-[#F8FAFC]">
      {/* HEADER */}
      <header className="p-6 pb-0 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-[24px] font-semibold text-white">AI Creative Studio</h1>
            <p className="text-[14px] text-[#94A3B8]">Generate and manage your ad creatives</p>
          </div>
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="bg-[#8B5CF6] text-white px-7 py-3.5 rounded-lg font-semibold text-[16px] hover:bg-[#7C3AED] transition-all flex items-center gap-2 shadow-lg shadow-[#8B5CF6]/10"
          >
            <Sparkles size={20} fill="white" /> Generate New Creatives
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-8 border-b border-[#334155]">
          {(['Performance', 'Generate', 'Library', 'Variations'] as StudioTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium transition-all relative ${
                activeTab === tab ? 'text-white' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="studio-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5CF6]" />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6 space-y-8">
        {activeTab === 'Performance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Click-through Rate" value="3.84%" change="+12.4%" positive />
            <MetricCard label="Average Creative Score" value="78/100" change="-2.1%" negative />
            <MetricCard label="Creatives Need Refresh" value="14%" change="-4%" warning />
            <MetricCard 
              label="Top Concept" 
              value="Minimalist Hero" 
              preview="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=40" 
            />
          </div>
        )}

        {/* CREATIVE GRID */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#8B5CF6]" size={40} />
            <p className="text-sm text-[#94A3B8] mt-4 uppercase tracking-widest font-bold">Accessing asset library...</p>
          </div>
        ) : creatives.length > 0 ? (
          <div className="space-y-6">
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-4 bg-[#1E293B] p-4 rounded-xl border border-[#8B5CF6]/30 animate-in slide-in-from-top-2">
                <span className="text-sm font-bold text-white">{selectedIds.size} selected</span>
                <div className="h-4 w-px bg-[#334155]"></div>
                <button className="text-xs font-bold text-[#8B5CF6] hover:underline">Deploy Selected</button>
                <button className="text-xs font-bold text-[#94A3B8] hover:text-white">Download</button>
                <button className="text-xs font-bold text-red-400 hover:text-red-300">Archive</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {creatives.map(creative => (
                <CreativeCard 
                  key={creative.id} 
                  creative={creative} 
                  isSelected={selectedIds.has(creative.id)}
                  onSelect={() => toggleSelect(creative.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-[#1E293B] rounded-full flex items-center justify-center text-[#8B5CF6]">
              <Sparkles size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-[20px] font-semibold text-white">Your creative library is empty</h2>
              <p className="text-[14px] text-[#94A3B8] max-w-xs mx-auto">Generate AI creatives to start testing what works.</p>
            </div>
            <button 
              onClick={() => setShowGenerateModal(true)}
              className="bg-[#8B5CF6] text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-[#7C3AED] transition-all shadow-lg shadow-[#8B5CF6]/20"
            >
              Generate Creatives
            </button>
          </div>
        )}
      </main>

      {/* GENERATE MODAL */}
      <AnimatePresence>
        {showGenerateModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !generatingJob && setShowGenerateModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pl-[240px] pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="pointer-events-auto w-full max-w-[600px] bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-[#334155] flex items-center justify-between">
                  <h2 className="text-[20px] font-semibold text-white">Generate New Creatives</h2>
                  {!generatingJob && (
                    <button onClick={() => setShowGenerateModal(false)} className="p-2 text-[#94A3B8] hover:text-white rounded-lg">
                      <X size={20} />
                    </button>
                  )}
                </div>

                {generatingJob ? (
                  <div className="p-20 flex flex-col items-center justify-center space-y-8 text-center">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-4 border-[#334155] flex items-center justify-center">
                         <Loader2 className="animate-spin text-[#8B5CF6]" size={48} />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-xs font-bold text-white">{generationProgress}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-lg font-bold text-white">AI Engine Orchestrating...</h3>
                       <p className="text-sm text-[#94A3B8] max-w-xs">
                         {generationProgress < 40 ? 'Analyzing product patterns...' : 
                          generationProgress < 80 ? 'Synthesizing visual layers...' : 
                          'Predicting performance score...'}
                       </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Step 1 */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">What are you advertising?</label>
                      <textarea 
                        placeholder="Paste your product URL or description"
                        className="w-full h-[100px] p-4 bg-[#0F172A] border border-[#334155] rounded-lg text-sm outline-none focus:border-[#8B5CF6] transition-all resize-none text-white"
                      />
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Brand voice</label>
                      <div className="relative">
                        <select className="w-full h-12 pl-4 pr-10 bg-[#0F172A] border border-[#334155] rounded-lg text-sm outline-none appearance-none focus:border-[#8B5CF6] text-white">
                          <option>Professional</option>
                          <option>Casual</option>
                          <option>Bold</option>
                          <option>Playful</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                      </div>
                    </div>

                    <div className="p-8 border-t border-[#334155] bg-[#111827]">
                      <button 
                        onClick={handleStartGeneration}
                        className="w-full bg-[#8B5CF6] text-white py-4 rounded-lg font-bold text-[16px] shadow-xl shadow-[#8B5CF6]/10 hover:bg-[#7C3AED] transition-all"
                      >
                        Generate 10 Creatives
                      </button>
                      <p className="text-center text-[10px] text-[#94A3B8] mt-3 font-medium uppercase tracking-widest">Takes about 2 minutes</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const MetricCard = ({ label, value, change, positive, negative, warning, preview }: any) => (
  <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 flex flex-col justify-between shadow-sm min-h-[120px]">
    <div className="flex justify-between items-start">
      <div className={`text-[28px] font-bold leading-none ${warning ? 'text-[#F59E0B]' : 'text-white'}`}>
        {value}
      </div>
      {preview && <img src={preview} className="w-10 h-10 rounded-lg object-cover border border-[#334155]" alt="" />}
    </div>
    <div className="space-y-1">
      {change && (
        <div className={`text-[12px] font-bold ${positive ? 'text-[#10B981]' : negative ? 'text-red-400' : warning ? 'text-[#F59E0B]' : 'text-[#94A3B8]'}`}>
          {change}
        </div>
      )}
      <div className="text-[12px] text-[#94A3B8] font-medium uppercase tracking-tight">{label}</div>
    </div>
  </div>
);

const CreativeCard = ({ creative, isSelected, onSelect }: { creative: AdCreative, isSelected: boolean, onSelect: () => void }) => (
  <div 
    onClick={onSelect}
    className={`bg-[#1E293B] border rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 relative ${
      isSelected ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20' : 'border-[#334155] hover:border-[#8B5CF6]'
    }`}
  >
    {/* CHECKBOX */}
    <div className={`absolute top-3 left-3 w-5 h-5 rounded border z-10 flex items-center justify-center transition-all ${
      isSelected ? 'bg-[#8B5CF6] border-[#8B5CF6]' : 'bg-black/20 border-white/30'
    }`}>
      {isSelected && <Check size={12} className="text-white" />}
    </div>

    {/* IMAGE AREA */}
    <div className="h-[160px] relative overflow-hidden">
      <img src={creative.asset_urls[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
      
      {/* Platform Badge */}
      <div className="absolute top-3 left-10 flex items-center gap-1.5 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-md border border-white/10">
        <div className={`w-1.5 h-1.5 rounded-full ${
          creative.platform === Platform.Meta ? 'bg-[#3B82F6]' : 
          creative.platform === Platform.Google ? 'bg-[#EF4444]' : 'bg-white'
        }`} />
        <span className="text-[10px] font-bold text-white uppercase">{creative.platform}</span>
      </div>

      {/* Status Badge */}
      <div className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        creative.predicted_score > 90 ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30' :
        creative.predicted_score > 70 ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30' :
        'bg-red-400/20 text-red-400 border border-red-400/30'
      }`}>
        {creative.predicted_score > 90 ? 'High Performance' : 'Stable'}
      </div>
    </div>

    {/* INFO AREA */}
    <div className="p-3 space-y-3">
      <h3 className="text-[14px] font-medium text-white truncate">{creative.name}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#8B5CF6] flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-[#8B5CF6]/20">
            {creative.predicted_score}
          </div>
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">AI Score</span>
        </div>
        <div className="text-[12px] font-bold text-[#94A3B8]">
          CTR: <span className="text-white">{(creative.predicted_ctr * 100).toFixed(1)}%</span>
        </div>
      </div>
      <button className="w-full py-2 border border-[#8B5CF6]/50 text-[#8B5CF6] rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-[#8B5CF6] hover:text-white transition-all">
        Deploy Asset
      </button>
    </div>
  </div>
);

export default AdminLibrary;


import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ImageIcon, 
  Layout, 
  CheckCircle2, 
  Globe, 
  Sparkles,
  Trash2,
  Edit,
  ArrowRight,
  Loader2,
  Code2,
  Zap,
  MousePointer2,
  Layers,
  Box
} from 'lucide-react';
import { Platform } from '../types';
import { generateDynamicAdTemplateLogic, AdTemplateLogic } from '../services/geminiService';

interface Template {
  id: string;
  name: string;
  platform: Platform;
  category: string;
  imageUrl: string;
  headline: string;
  status: 'active' | 'draft';
}

const TEMPLATE_STYLES = [
  "SaaS Venture Modern",
  "Cyberpunk Ecommerce",
  "Luxury Minimal",
  "Retro Pop Art",
  "Tech Noir Corporate",
  "Playful Gen-Z"
];

const AdminLibrary: React.FC = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [productName, setProductName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(TEMPLATE_STYLES[0]);
  const [generatedLogic, setGeneratedLogic] = useState<AdTemplateLogic | null>(null);

  const [templates, setTemplates] = useState<Template[]>([
    { 
      id: 't1', 
      name: 'Modern SaaS LeadGen', 
      platform: Platform.Meta, 
      category: 'Software', 
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
      headline: 'Scale your operations with ZieAds Intelligence',
      status: 'active'
    },
    { 
      id: 't2', 
      name: 'E-commerce Flash sale', 
      platform: Platform.TikTok, 
      category: 'Retail', 
      imageUrl: 'https://images.unsplash.com/photo-1556742049-02e49f61b4ee?auto=format&fit=crop&q=80&w=400',
      headline: 'The biggest drop of the year is here!',
      status: 'active'
    }
  ]);

  const handleGenerateLogic = async () => {
    if (!productName) return;
    setIsGenerating(true);
    try {
      const logic = await generateDynamicAdTemplateLogic(
        productName,
        selectedStyle,
        ['#14B8A6', '#1E293B']
      );
      setGeneratedLogic(logic);
    } catch (e) {
      alert("Logic synthesis failed. Check API connectivity.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTemplate = () => {
    if (!generatedLogic) return;
    const newTemplate: Template = {
      id: `t-${Date.now()}`,
      name: `${productName} (${selectedStyle})`,
      platform: Platform.Meta,
      category: 'Dynamic AI',
      imageUrl: '',
      headline: generatedLogic.canvas_layers.find(l => l.id === 'headline')?.text || productName,
      status: 'draft'
    };
    setTemplates([newTemplate, ...templates]);
    setShowAdd(false);
    resetForm();
  };

  const resetForm = () => {
    setProductName('');
    setGeneratedLogic(null);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight font-display mb-1 transition-colors">Global ad library</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Manage master templates distributed to all platform users.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="tosca-bg text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all font-display tracking-tight"
        >
          <Plus size={20} /> Create new template
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-primary dark:text-teal-400 transition-colors">
            <Layout size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 tracking-tight">Active templates</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{templates.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 transition-colors">
            <Globe size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 tracking-tight">Global reach</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">1.2M+</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search templates..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map(t => (
            <div key={t.id} className="group bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all flex flex-col">
              <div className="aspect-video relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                {t.imageUrl ? (
                  <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 text-center bg-slate-900">
                    <Sparkles size={32} className="mb-2 text-teal-500/50" />
                    <span className="text-[10px] font-bold tracking-tight opacity-50">AI Dynamic Template</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg text-[10px] font-black tracking-tight text-primary dark:text-teal-400 shadow-sm transition-colors">{t.platform}</span>
                  <span className={`px-2.5 py-1 backdrop-blur-md rounded-lg text-[10px] font-black tracking-tight text-white shadow-sm transition-colors capitalize ${t.status === 'active' ? 'bg-green-500' : 'bg-orange-500'}`}>{t.status}</span>
                </div>
              </div>
              <div className="p-6 space-y-3 flex-1">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-tight transition-colors">{t.category}</p>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display leading-tight transition-colors">{t.name}</h4>
              </div>
              <div className="px-6 py-4 bg-white/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors">
                <button className="p-2 text-slate-400 hover:text-primary dark:hover:text-teal-400 transition-colors">
                  <Edit size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowAdd(false)}></div>
          <div className="relative w-full max-w-6xl bg-[#FDFDFF] dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 transition-colors flex flex-col md:flex-row h-[90vh]">
             
             {/* Left Column: Input Workbench */}
             <div className="w-full md:w-[40%] p-10 space-y-8 border-r border-slate-100 dark:border-slate-800 overflow-y-auto">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white font-display transition-colors flex items-center gap-3">
                    <Box className="text-primary" /> Template lab
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">ZieAds dynamic ad logic orchestrator</p>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 tracking-tight ml-1">Product identity</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="e.g. NeoWatch Series 4" 
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className="w-full h-14 pl-12 pr-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white transition-colors outline-none focus:border-primary" 
                        />
                        <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 tracking-tight ml-1">Composition style</label>
                      <div className="grid grid-cols-2 gap-2">
                        {TEMPLATE_STYLES.map(style => (
                          <button 
                            key={style}
                            onClick={() => setSelectedStyle(style)}
                            className={`px-4 py-3 rounded-xl text-[11px] font-bold transition-all border ${
                              selectedStyle === style 
                              ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-500 text-primary dark:text-teal-400' 
                              : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-300'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                   </div>

                   <button 
                    onClick={handleGenerateLogic}
                    disabled={isGenerating || !productName}
                    className="w-full h-14 tosca-bg text-white font-black rounded-2xl shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all font-display tracking-tight flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     {isGenerating ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
                     {isGenerating ? 'Synthesizing logic...' : 'Generate design logic'}
                   </button>
                </div>

                {generatedLogic && (
                  <div className="space-y-4 pt-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 text-[10px] font-black text-teal-500 tracking-tight">
                      <Code2 size={12} /> Design system output
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-5 font-mono text-[10px] text-teal-400 leading-relaxed overflow-x-auto max-h-48 custom-scrollbar">
                      <pre>{JSON.stringify(generatedLogic, null, 2)}</pre>
                    </div>
                  </div>
                )}
             </div>

             {/* Right Column: Canvas Preview & Prompt */}
             <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-10 flex flex-col gap-8 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary">
                      <MousePointer2 size={16} />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight font-display">Spatial preview</h4>
                  </div>
                  {generatedLogic && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 text-[10px] font-black tracking-tight">
                      <CheckCircle2 size={12} /> Composition valid
                    </div>
                  )}
                </div>

                {/* The Mockup Canvas */}
                <div className="relative aspect-square w-full max-w-[500px] mx-auto bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                   {/* Background Overlay Simulation */}
                   <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 transition-colors"></div>
                   
                   {/* Elements visualization */}
                   {generatedLogic ? (
                     generatedLogic.canvas_layers.map(layer => (
                       <div 
                        key={layer.id}
                        className="absolute flex items-center justify-center p-2 rounded border border-dashed border-teal-500/40 bg-teal-500/5 group/layer transition-all cursor-default"
                        style={{
                          left: `${(layer.pos[0] / 1000) * 100}%`,
                          top: `${(layer.pos[1] / 1000) * 100}%`,
                          transform: 'translate(-50%, -50%)',
                          fontSize: `${(layer.fontSize / 1000) * 400}px`,
                          color: layer.color,
                          fontFamily: layer.font.includes('Bold') ? 'Plus Jakarta Sans, sans-serif' : 'Inter, sans-serif',
                          fontWeight: layer.font.includes('Bold') ? 800 : 500
                        }}
                       >
                          <span className="relative z-10">{layer.text}</span>
                          <div className="absolute -top-6 left-0 px-1.5 py-0.5 bg-teal-500 text-white text-[8px] font-black rounded opacity-0 group-hover/layer:opacity-100 transition-opacity">
                            {layer.id} ({layer.pos[0]}, {layer.pos[1]})
                          </div>
                       </div>
                     ))
                   ) : (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 space-y-4">
                        <Layers size={64} strokeWidth={1} className="animate-pulse" />
                        <p className="text-xs font-bold tracking-widest">Awaiting generation</p>
                     </div>
                   )}
                </div>

                {/* AI Background Prompt */}
                {generatedLogic && (
                  <div className="bg-white dark:bg-slate-900 rounded-[28px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-tight">
                       <ImageIcon size={14} /> Background prompt engine
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      "{generatedLogic.ai_image_prompt}"
                    </p>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                       <button 
                        onClick={handleSaveTemplate}
                        className="flex-1 h-12 tosca-bg text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all font-display tracking-tight text-xs"
                       >
                         Save master logic <ArrowRight size={14} />
                       </button>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLibrary;

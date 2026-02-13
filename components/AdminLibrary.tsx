
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
  ArrowRight
} from 'lucide-react';
import { Platform } from '../types';

interface Template {
  id: string;
  name: string;
  platform: Platform;
  category: string;
  imageUrl: string;
  headline: string;
  status: 'active' | 'draft';
}

const AdminLibrary: React.FC = () => {
  const [showAdd, setShowAdd] = useState(false);
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
      name: 'E-commerce Flash Sale', 
      platform: Platform.TikTok, 
      category: 'Retail', 
      imageUrl: 'https://images.unsplash.com/photo-1556742049-02e49f61b4ee?auto=format&fit=crop&q=80&w=400',
      headline: 'The biggest drop of the year is here!',
      status: 'active'
    },
    { 
      id: 't3', 
      name: 'Google B2B Search', 
      platform: Platform.Google, 
      category: 'Services', 
      imageUrl: '',
      headline: 'Best Ad Automation Platform 2025',
      status: 'draft'
    }
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight font-display mb-1 transition-colors">Global Ad Library</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Manage master templates distributed to all platform users.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="tosca-bg text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all font-display uppercase tracking-tight"
        >
          <Plus size={20} /> Create New Template
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-primary dark:text-teal-400 transition-colors">
            <Layout size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Templates</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{templates.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 transition-colors">
            <Globe size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Reach</p>
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
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map(t => (
            <div key={t.id} className="group bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all flex flex-col">
              <div className="aspect-video relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                {t.imageUrl ? (
                  <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                    <ImageIcon size={48} strokeWidth={1} />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-primary dark:text-teal-400 shadow-sm transition-colors">{t.platform}</span>
                  <span className={`px-2.5 py-1 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-sm transition-colors ${t.status === 'active' ? 'bg-green-500' : 'bg-orange-500'}`}>{t.status}</span>
                </div>
              </div>
              <div className="p-6 space-y-3 flex-1">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">{t.category}</p>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display leading-tight transition-colors">{t.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic font-medium transition-colors">"{t.headline}"</p>
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

          <button 
            onClick={() => setShowAdd(true)}
            className="group border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px] flex flex-col items-center justify-center gap-4 py-12 hover:border-primary/20 dark:hover:border-teal-500/20 hover:bg-teal-50/20 dark:hover:bg-teal-500/5 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-primary dark:group-hover:text-teal-400 transition-all">
              <Plus size={32} />
            </div>
            <p className="text-sm font-bold text-slate-400 group-hover:text-primary transition-colors">Add New Template</p>
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setShowAdd(false)}></div>
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 transition-colors">
             <div className="p-10 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white font-display transition-colors">Template Designer</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Define the creative DNA for this master template.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Template Name</label>
                      <input type="text" placeholder="e.g. Modern Minimalist" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white transition-colors outline-none focus:border-primary" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform</label>
                      <select className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white transition-colors outline-none focus:border-primary">
                        <option>Meta</option>
                        <option>Google</option>
                        <option>TikTok</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Master Headline</label>
                  <textarea placeholder="Write the conversion hook..." className="w-full p-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[32px] font-medium dark:text-white transition-colors outline-none focus:border-primary" rows={3}></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setShowAdd(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all uppercase tracking-widest text-xs">Cancel</button>
                  <button onClick={() => setShowAdd(false)} className="flex-2 py-4 tosca-bg text-white font-black rounded-2xl shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all font-display uppercase tracking-tight flex items-center justify-center gap-2">Save Master Template <ArrowRight size={18} /></button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLibrary;

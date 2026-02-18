
import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, RefreshCw, Edit2, Pause, Play, 
  MoreHorizontal, ChevronRight, X, Layout, 
  Smartphone, Monitor, AlertCircle, Check, 
  Trash2, Copy, ExternalLink, Bot, Loader2,
  TrendingUp, TrendingDown, Image as ImageIcon,
  Send, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Added Workspace to imports from types
import { Platform, CampaignStatus, Campaign, Workspace } from '../types';

// Mock data for the campaign screen
const MOCK_CAMPAIGNS: any[] = [
  {
    id: 'c1',
    name: 'Summer Sale 2026',
    status: 'active',
    platform: 'Meta',
    budget_daily: 100,
    spent_today: 84.20,
    roas: '4.2x',
    ai_managed: true,
    revenue: 353.64,
    purchases: 42
  },
  {
    id: 'c2',
    name: 'TikTok Retargeting',
    status: 'learning',
    platform: 'TikTok',
    budget_daily: 50,
    spent_today: 48.00,
    roas: '1.8x',
    ai_managed: false,
    revenue: 86.40,
    purchases: 12
  },
  {
    id: 'c3',
    name: 'Google Search Alpha',
    status: 'active',
    platform: 'Google',
    budget_daily: 200,
    spent_today: 156.40,
    roas: '3.1x',
    ai_managed: true,
    revenue: 484.84,
    purchases: 28
  },
  {
    id: 'c4',
    name: 'Draft - Q3 Launch',
    status: 'draft',
    platform: 'Meta',
    budget_daily: 0,
    spent_today: 0,
    roas: '0.0x',
    ai_managed: false,
    revenue: 0,
    purchases: 0
  },
  {
    id: 'c5',
    name: 'Seasonal Paused',
    status: 'paused',
    platform: 'Google',
    budget_daily: 75,
    spent_today: 0,
    roas: '2.5x',
    ai_managed: false,
    revenue: 0,
    purchases: 0
  }
];

const MotionDiv = (motion as any).div;

// Defined interface for Campaigns component props
interface CampaignsProps {
  activeWorkspace: Workspace;
}

// Updated component to accept activeWorkspace prop as expected by App.tsx
const Campaigns: React.FC<CampaignsProps> = ({ activeWorkspace }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Paused' | 'Draft'>('All');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Meta', 'Google', 'TikTok']);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const filteredCampaigns = useMemo(() => {
    return MOCK_CAMPAIGNS.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || c.status.toLowerCase() === selectedStatus.toLowerCase();
      const matchesPlatform = selectedPlatforms.includes(c.platform);
      return matchesSearch && matchesStatus && matchesPlatform;
    });
  }, [searchQuery, selectedStatus, selectedPlatforms]);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#10B981]';
      case 'learning': return 'bg-[#F59E0B]';
      case 'paused': return 'bg-[#94A3B8]';
      case 'draft': return 'bg-[#475569]';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="flex h-full bg-[#0F172A] text-[#F8FAFC] font-sans relative overflow-hidden">
      {/* LEFT SIDEBAR (280px) */}
      <aside className="w-[280px] border-r border-[#334155] p-6 space-y-8 flex-shrink-0 flex flex-col">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
          <input 
            type="text" 
            placeholder="Search campaigns..."
            className="w-full h-10 pl-10 pr-4 bg-[#1E293B] border border-[#334155] rounded-lg text-sm outline-none focus:border-[#8B5CF6] transition-all placeholder:text-[#64748B]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">Status</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'All', count: 20 },
              { label: 'Active', count: 15 },
              { label: 'Paused', count: 3 },
              { label: 'Draft', count: 2 }
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => setSelectedStatus(s.label as any)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                  selectedStatus === s.label 
                  ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20' 
                  : 'bg-transparent border-[#334155] text-[#94A3B8] hover:border-[#475569]'
                }`}
              >
                <span>{s.label}</span>
                <span className={`opacity-60 ${selectedStatus === s.label ? 'text-white' : 'text-[#64748B]'}`}>{s.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">Platform</h3>
          <div className="space-y-3">
            {[
              { label: 'Meta', count: 12 },
              { label: 'Google', count: 5 },
              { label: 'TikTok', count: 3 }
            ].map((p) => (
              <label key={p.label} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => togglePlatform(p.label)}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      selectedPlatforms.includes(p.label) 
                      ? 'bg-[#8B5CF6] border-[#8B5CF6]' 
                      : 'border-[#334155] group-hover:border-[#475569]'
                    }`}
                  >
                    {selectedPlatforms.includes(p.label) && <Check size={12} className="text-white" />}
                  </div>
                  <span className={`text-sm ${selectedPlatforms.includes(p.label) ? 'text-white font-medium' : 'text-[#94A3B8]'}`}>
                    {p.label}
                  </span>
                </div>
                <span className="text-[11px] text-[#64748B] font-medium">{p.count} campaigns</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-auto bg-[#F59E0B]/10 border-l-[3px] border-[#F59E0B] p-4 rounded-r-lg space-y-2">
          <p className="text-[13px] text-[#F8FAFC] leading-relaxed">
            2 Meta campaigns need attention. Review budget allocation.
          </p>
          <button className="text-[12px] font-bold text-[#F59E0B] hover:underline flex items-center gap-1">
            Review <ChevronRight size={14} />
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0F172A]">
        {/* HEADER */}
        <header className="p-8 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-[24px] font-semibold text-white tracking-tight">Campaigns</h1>
            <p className="text-sm text-[#94A3B8]">Manage your ad campaigns</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              className="bg-[#1E293B] border border-[#334155] p-2.5 rounded-lg text-[#94A3B8] hover:text-white transition-all shadow-sm"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#7C3AED] transition-all flex items-center gap-2 shadow-lg shadow-[#8B5CF6]/10">
              <Plus size={18} /> New Campaign
            </button>
          </div>
        </header>

        {/* TABLE CONTENT */}
        <div className="flex-1 overflow-auto">
          {filteredCampaigns.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 bg-[#0F172A] z-10">
                <tr className="border-b border-[#334155]">
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider w-[60px]">Status</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">Campaign name</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider w-[100px]">Platform</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider w-[120px]">Daily budget</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider w-[120px]">Spent today</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider w-[80px]">ROAS</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider w-[80px]">AI</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/30">
                {filteredCampaigns.map((c) => (
                  <tr 
                    key={c.id} 
                    className="group hover:bg-[#1E293B] cursor-pointer transition-colors"
                    onClick={() => setSelectedCampaign(c)}
                  >
                    <td className="px-6 py-5">
                      <div className={`w-2 h-2 rounded-full mx-auto ${getStatusColor(c.status)}`} />
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-base font-medium text-white">{c.name}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={c.platform} />
                        <span className="text-sm font-medium text-[#94A3B8]">{c.platform}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-[#94A3B8]">${c.budget_daily}/day</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-white font-medium">${c.spent_today.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-sm font-bold ${
                        parseFloat(c.roas) >= 3 ? 'text-[#10B981]' : 
                        parseFloat(c.roas) >= 1.5 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                      }`}>
                        {c.roas}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {c.ai_managed ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
                          <Bot size={12} /> Auto
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#334155]/50 text-[#94A3B8] border border-[#334155]">
                          Manual
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button className="p-2 text-[#94A3B8] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded-lg transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 rounded-lg transition-all">
                          {c.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-20 space-y-6 text-center">
              <div className="w-24 h-24 bg-[#1E293B] rounded-full flex items-center justify-center text-[#8B5CF6]/20">
                 {/* Corrected missing icon: Send */}
                 <Send size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-[20px] font-semibold text-white">No campaigns yet</h2>
                <p className="text-[14px] text-[#94A3B8] max-w-xs">Create your first campaign to start advertising.</p>
              </div>
              <button className="bg-[#8B5CF6] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#7C3AED] transition-all shadow-lg shadow-[#8B5CF6]/20">
                Create Campaign
              </button>
            </div>
          )}
        </div>
      </main>

      {/* DETAIL PANEL */}
      <AnimatePresence>
        {selectedCampaign && (
          <>
            <MotionDiv 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCampaign(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <MotionDiv 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[400px] bg-[#1E293B] border-l border-[#334155] shadow-2xl z-[110] flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-6 flex items-center justify-between border-b border-[#334155]">
                 <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/5 rounded-xl">
                      <PlatformIcon platform={selectedCampaign.platform} size={32} />
                    </div>
                    <div>
                       <h2 className="text-[20px] font-semibold text-white tracking-tight leading-none">{selectedCampaign.name}</h2>
                       <div className="flex items-center gap-2 mt-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(selectedCampaign.status)}`} />
                          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">{selectedCampaign.status}</span>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedCampaign(null)} className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg">
                    <X size={20} />
                 </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-auto p-6 space-y-10 custom-scrollbar">
                 {/* Stats Row */}
                 <div className="grid grid-cols-4 gap-2">
                    <DetailStat label="Spend" value={`$${selectedCampaign.spent_today}`} />
                    <DetailStat label="Revenue" value={`$${selectedCampaign.revenue.toFixed(0)}`} />
                    <DetailStat label="ROAS" value={selectedCampaign.roas} />
                    <DetailStat label="Sales" value={selectedCampaign.purchases} />
                 </div>

                 {/* Mini Chart */}
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Performance (7d)</h3>
                       <span className="text-[10px] text-[#10B981] font-bold">+12.4%</span>
                    </div>
                    <div className="h-20 w-full bg-white/5 rounded-xl border border-[#334155] p-3 overflow-hidden relative">
                       <div className="absolute inset-0 flex items-end justify-between px-4 pb-4 gap-1">
                          {[30, 45, 35, 60, 50, 80, 70].map((h, i) => (
                             <div key={i} className="flex-1 bg-[#8B5CF6]/20 rounded-sm" style={{ height: `${h}%` }}>
                                <div className="w-full bg-[#8B5CF6] rounded-sm" style={{ height: `${h * 0.4}%` }}></div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Creatives */}
                 <div className="space-y-4">
                    <h3 className="text-[16px] font-semibold text-white">Active Creatives</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                       {[1, 2, 3].map(i => (
                          <div key={i} className="w-[80px] h-[100px] bg-white/5 border border-[#334155] rounded-lg shrink-0 overflow-hidden relative group">
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                {/* Corrected missing icon: Eye */}
                                <Eye size={16} className="text-white" />
                             </div>
                             <img 
                                src={`https://images.unsplash.com/photo-${i === 1 ? '1523275335684-37898b6baf30' : i === 2 ? '1505740420928-5e560c06d30e' : '1526170301355-dc0035f81c63'}?auto=format&fit=crop&q=80&w=80`} 
                                className="w-full h-full object-cover"
                                alt=""
                             />
                          </div>
                       ))}
                       <button className="w-[80px] h-[100px] border border-dashed border-[#334155] rounded-lg flex flex-col items-center justify-center text-[#64748B] hover:text-[#8B5CF6] hover:border-[#8B5CF6] transition-all">
                          <Plus size={16} />
                          <span className="text-[10px] font-bold mt-1 uppercase">Add</span>
                       </button>
                    </div>
                 </div>

                 {/* AI Recommendations */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#8B5CF6]">
                       <Bot size={16} />
                       <h3 className="text-sm font-bold uppercase tracking-wider">AI Suggestions for this campaign</h3>
                    </div>
                    <div className="space-y-3">
                       <SuggestionItem text="Increase daily budget by 20% for peak hours (6pm-9pm)" />
                       <SuggestionItem text="Audience 'Past Buyers' showing high ROAS. Scaling reach." />
                       <SuggestionItem text="Creative #2 has lower CPC but lower CTR. Try a new hook." />
                    </div>
                 </div>
              </div>

              {/* Panel Footer */}
              <div className="p-6 border-t border-[#334155] bg-[#1E293B] grid grid-cols-3 gap-2">
                 <FooterButton label="Edit" icon={<Edit2 size={14} />} />
                 <FooterButton label="Duplicate" icon={<Copy size={14} />} />
                 <FooterButton label="Archive" icon={<Trash2 size={14} />} color="text-red-400" />
              </div>
            </MotionDiv>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const PlatformIcon = ({ platform, size = 20 }: { platform: string, size?: number }) => {
  switch (platform) {
    case 'Meta': return <div className="text-[#3B82F6]"><Layout size={size} fill="currentColor" fillOpacity={0.1} /></div>;
    case 'Google': return <div className="text-[#EF4444]"><Monitor size={size} fill="currentColor" fillOpacity={0.1} /></div>;
    case 'TikTok': return <div className="text-white"><Smartphone size={size} fill="currentColor" fillOpacity={0.1} /></div>;
    default: return <Monitor size={size} />;
  }
};

const DetailStat = ({ label, value }: { label: string, value: any }) => (
  <div className="flex flex-col">
    <span className="text-[20px] font-bold text-white tracking-tight">{value}{label === 'ROAS' ? '' : ''}</span>
    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">{label}</span>
  </div>
);

const SuggestionItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3 p-3 bg-white/5 border border-[#334155] rounded-xl group transition-all hover:border-[#8B5CF6]/50">
    <div className="w-1 h-1 rounded-full bg-[#8B5CF6] mt-2 shrink-0" />
    <div className="space-y-2">
      <p className="text-xs text-[#94A3B8] leading-relaxed">{text}</p>
      <button className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-widest hover:underline">Apply Recommendation</button>
    </div>
  </div>
);

const FooterButton = ({ label, icon, color = 'text-[#94A3B8]' }: any) => (
  <button className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border border-[#334155] bg-[#0F172A] hover:bg-white/5 transition-all group ${color}`}>
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">{label}</span>
  </button>
);

export default Campaigns;

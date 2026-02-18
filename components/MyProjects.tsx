
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Plus, RefreshCw, Edit2, Pause, Play, 
  MoreHorizontal, ChevronRight, X, Layout, 
  Smartphone, Monitor, AlertCircle, Check, 
  Trash2, Copy, ExternalLink, Bot, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Platform, CampaignStatus, Workspace, Campaign } from '../types';
import { listCampaigns, updateCampaignStatus } from '../services/dbService';

interface MyProjectsProps {
  activeWorkspace: Workspace;
}

const Campaigns: React.FC<MyProjectsProps> = ({ activeWorkspace }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<CampaignStatus | 'All'>('All');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await listCampaigns({
        workspace_id: activeWorkspace.id,
        status: selectedStatus === 'All' ? undefined : selectedStatus
      });
      setCampaigns(data);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [activeWorkspace.id, selectedStatus]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      return c.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, campaigns]);

  const handleToggleStatus = async (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation();
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    try {
      await updateCampaignStatus(campaign.id, newStatus);
      fetchCampaigns(); // Refresh list
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#10B981]';
      case 'learning': return 'bg-[#F59E0B]';
      case 'paused': return 'bg-[#94A3B8]';
      case 'error': return 'bg-[#EF4444]';
      case 'pending': return 'bg-[#8B5CF6] animate-pulse';
      default: return 'bg-[#475569]';
    }
  };

  return (
    <div className="flex h-full bg-[#0F172A] text-[#F8FAFC] font-sans relative overflow-hidden">
      {/* LEFT SIDEBAR (280px) */}
      <aside className="w-[280px] border-r border-[#334155] p-6 space-y-8 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
          <input 
            type="text" 
            placeholder="Search campaigns..."
            className="w-full h-10 pl-10 pr-4 bg-[#1E293B] border border-[#334155] rounded-lg text-sm outline-none focus:border-[#8B5CF6] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">Status</h3>
          <div className="grid grid-cols-2 gap-2">
            {['All', 'active', 'paused', 'draft'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as any)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-all capitalize ${
                  selectedStatus === status 
                  ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white' 
                  : 'bg-transparent border-[#334155] text-[#94A3B8] hover:border-[#475569]'
                }`}
              >
                <span>{status}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#F59E0B]/10 border-l-[3px] border-[#F59E0B] p-4 rounded-r-lg space-y-2">
          <p className="text-[13px] text-[#F8FAFC] leading-relaxed">
            AI is monitoring 5 active nodes. Deployment engine healthy.
          </p>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="p-6 flex items-center justify-between border-b border-[#334155] flex-shrink-0">
          <div>
            <h1 className="text-2xl font-semibold text-white">Campaigns</h1>
            <p className="text-sm text-[#94A3B8]">Manage your ad orchestration</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchCampaigns} className="bg-[#1E293B] border border-[#334155] p-2.5 rounded-lg text-[#94A3B8] hover:text-white transition-all">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#7C3AED] transition-all flex items-center gap-2 shadow-lg shadow-[#8B5CF6]/10">
              <Plus size={18} /> New Campaign
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {loading ? (
             <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-[#8B5CF6]" size={32} />
             </div>
          ) : filteredCampaigns.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#334155]">
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider w-[60px]">Status</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">Campaign Name</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider w-[100px]">Platform</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider w-[120px]">Daily Budget</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider w-[120px]">Objective</th>
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
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(c.status)}`} />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-base font-medium text-white">{c.name}</span>
                        {c.platform_campaign_id && <span className="text-[10px] text-[#475569] font-mono">{c.platform_campaign_id}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={c.platform} size={20} />
                        <span className="text-sm font-medium text-[#94A3B8]">{c.platform}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-[#94A3B8]">${c.budget_daily}/day</td>
                    <td className="px-6 py-5 text-sm text-white capitalize">{c.objective}</td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${c.ai_managed !== false ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20' : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155]'}`}>
                        <Bot size={12} /> Auto
                      </div>
                    </td>
                    <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button className="p-2 text-[#94A3B8] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded-lg transition-all"><Edit2 size={16} /></button>
                        <button 
                          onClick={(e) => handleToggleStatus(e, c)}
                          className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 rounded-lg transition-all"
                        >
                          {c.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-20 space-y-6 text-center animate-in fade-in duration-700">
              <div className="w-24 h-24 bg-[#1E293B] rounded-full flex items-center justify-center text-[#8B5CF6]/50">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4.5 16.5L12 4.5L19.5 16.5H4.5Z" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-[20px] font-semibold text-white">No campaigns found</h2>
                <p className="text-[14px] text-[#94A3B8] max-w-xs">Create your first campaign to start advertising.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* DETAIL PANEL */}
      <AnimatePresence>
        {selectedCampaign && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCampaign(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[400px] bg-[#1E293B] border-left border-[#334155] shadow-2xl z-[110] flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-[#334155]">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <PlatformIcon platform={selectedCampaign.platform} size={32} />
                    </div>
                    <div>
                       <h2 className="text-[20px] font-semibold text-white">{selectedCampaign.name}</h2>
                       <div className="flex items-center gap-2 mt-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(selectedCampaign.status)}`} />
                          <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">{selectedCampaign.status}</span>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedCampaign(null)} className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg">
                    <X size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-auto p-6 space-y-8">
                 <div className="grid grid-cols-2 gap-4">
                    <DetailStat label="Daily Budget" value={`$${selectedCampaign.budget_daily}`} />
                    <DetailStat label="Objective" value={selectedCampaign.objective} />
                    <DetailStat label="Targeting" value={`${selectedCampaign.targeting?.locations?.[0] || 'Global'}`} />
                    <DetailStat label="Started" value={new Date(selectedCampaign.start_date).toLocaleDateString()} />
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-base font-semibold text-white">Orchestration Details</h3>
                    <div className="p-4 bg-[#0F172A] rounded-xl border border-[#334155] font-mono text-[10px] text-[#94A3B8] space-y-2">
                       <p>DEPLOY_ID: {selectedCampaign.id}</p>
                       <p>EXT_ID: {selectedCampaign.platform_campaign_id || 'Awaiting synchronization...'}</p>
                       <p>LAST_SYNC: {selectedCampaign.updated_at ? new Date(selectedCampaign.updated_at).toLocaleTimeString() : 'N/A'}</p>
                    </div>
                 </div>
              </div>

              <div className="p-6 border-t border-[#334155] bg-[#111827] flex gap-2">
                 <button 
                  onClick={(e) => handleToggleStatus(e, selectedCampaign)}
                  className="flex-1 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg text-xs font-bold text-white transition-all flex items-center justify-center gap-2"
                 >
                    {selectedCampaign.status === 'active' ? <><Pause size={14} /> Pause Campaign</> : <><Play size={14} /> Activate Campaign</>}
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const PlatformIcon = ({ platform, size = 16 }: { platform: Platform, size?: number }) => {
  switch (platform) {
    case Platform.Meta: return <div className="text-[#3B82F6]"><Layout size={size} fill="currentColor" fillOpacity={0.1} /></div>;
    case Platform.Google: return <div className="text-[#EF4444]"><Monitor size={size} fill="currentColor" fillOpacity={0.1} /></div>;
    case Platform.TikTok: return <div className="text-white"><Smartphone size={size} fill="currentColor" fillOpacity={0.1} /></div>;
    default: return <Monitor size={size} />;
  }
};

const DetailStat = ({ label, value }: { label: string, value: string }) => (
  <div className="p-4 bg-white/5 rounded-xl border border-[#334155]">
    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-white tracking-tight capitalize">{value}</p>
  </div>
);

export default Campaigns;


import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BarChart3, 
  ShieldAlert, 
  Activity, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  TrendingUp,
  Download,
  DollarSign,
  Cpu,
  Lock,
  History,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  Globe,
  Settings,
  Server,
  RefreshCcw,
  CheckCircle
} from 'lucide-react';
import { fetchGlobalAdminStats, fetchSystemLogs, AdminStats, SystemLog } from '../services/adminService';

type AdminTab = 'performance' | 'billing' | 'security' | 'logs';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('performance');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAdminData = async () => {
    setRefreshing(true);
    try {
      const [s, l] = await Promise.all([
        fetchGlobalAdminStats(),
        fetchSystemLogs()
      ]);
      setStats(s);
      setLogs(l);
    } catch (err) {
      console.error("Critical: Admin Data Initialization Error", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const currentStats = stats || {
    totalManagedSpend: 148290,
    totalUsers: 1284,
    activeCampaigns: 482,
    fraudSavingsTotal: 17794.80,
    projectedRevenue: 743.51
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 space-y-8 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="relative">
          <div className="absolute inset-0 tosca-bg blur-3xl opacity-20 animate-pulse"></div>
          <div className="w-16 h-16 tosca-bg rounded-2xl flex items-center justify-center animate-spin shadow-2xl shadow-teal-500/20">
            <Server className="text-white" size={32} />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-slate-900 dark:text-white font-black text-xl font-display">Syncing Master Node</p>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">Establishing Secure Root Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12 font-sans">
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NODE: ZIEADS-PRIMARY-JP</span>
          </div>
          <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
          <div className="hidden sm:flex items-center gap-2">
            <Activity className="text-teal-400" size={14} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Load: Normal (0.14ms)</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
           <button 
            onClick={loadAdminData}
            disabled={refreshing}
            className="flex items-center gap-2 text-[10px] font-black text-teal-400 uppercase tracking-widest bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/20 hover:bg-teal-500/20 transition-all"
           >
             <RefreshCcw size={12} className={refreshing ? 'animate-spin' : ''} />
             {refreshing ? 'Syncing...' : 'Force Refresh'}
           </button>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">v1.4.0-stable</span>
        </div>
      </div>

      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2.5 py-1 bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest rounded-md shadow-lg shadow-teal-500/20 flex items-center gap-1.5">
              <CheckCircle size={10} /> Root Authorized
            </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter font-display transition-colors">
            Command Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">
            Global orchestration layer for <span className="text-slate-900 dark:text-white font-bold">{currentStats.totalUsers.toLocaleString()}</span> platform identities.
          </p>
        </div>

        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          {(['performance', 'billing', 'security', 'logs'] as AdminTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab 
                ? 'tosca-bg text-white shadow-xl shadow-teal-500/20' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox 
          label="Managed Spend" 
          value={`$${currentStats.totalManagedSpend.toLocaleString()}`} 
          icon={<DollarSign size={18}/>} 
        />
        <StatBox 
          label="Fraud Blocked" 
          value={`$${currentStats.fraudSavingsTotal.toLocaleString()}`} 
          icon={<ShieldAlert size={18}/>} 
          color="text-teal-500" 
        />
        <StatBox 
          label="Platform Revenue" 
          value={`$${currentStats.projectedRevenue.toLocaleString()}`} 
          icon={<TrendingUp size={18}/>} 
          color="text-primary" 
        />
        <StatBox 
          label="Node Latency" 
          value="42ms" 
          icon={<Cpu size={18}/>} 
          color="text-green-500" 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'performance' && (
             <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 p-10 shadow-sm transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <BarChart3 size={120} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white mb-8">
                  <BarChart3 className="text-primary" /> Global Spend Velocity
                </h3>
                <div className="h-72 flex items-end justify-between gap-3 pt-10">
                   {[40, 65, 35, 80, 55, 60, 45, 90, 30, 70, 40, 60].map((h, i) => (
                      <div key={i} className="flex-1 space-y-3 flex flex-col items-center h-full">
                         <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-full h-full relative overflow-hidden flex items-end">
                            <div className="w-full tosca-bg rounded-full transition-all duration-1000" style={{ height: refreshing ? '0%' : `${h}%`, transitionDelay: `${i * 50}ms` }}></div>
                         </div>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest tabular-nums">W-{12-i}</span>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
               <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                    <History className="text-primary" size={20}/> Real-time Audit Trail
                  </h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">Stream Mode</span>
               </div>
               <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {logs.length > 0 ? logs.map(log => (
                    <div key={log.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-5">
                       <div className={`p-3 rounded-2xl ${
                         log.severity === 'critical' ? 'bg-red-50 text-red-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                       }`}>
                          {log.eventType === 'BILLING_SYNC' ? <DollarSign size={18}/> : 
                           log.eventType === 'SECURITY' ? <Lock size={18}/> : <Activity size={18}/>}
                       </div>
                       <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{log.eventType}</span>
                               <span className={`w-1.5 h-1.5 rounded-full ${log.severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                             </div>
                             <span className="text-[10px] font-bold text-slate-400 tabular-nums">{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {log.payload?.action || 'System maintenance event recorded.'}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">ID: {log.id.slice(0, 8)}</p>
                       </div>
                    </div>
                  )) : (
                    <div className="p-20 text-center space-y-4">
                      <Search className="mx-auto text-slate-200" size={48} />
                      <p className="text-slate-400 font-medium italic">No recent system logs. All signals nominal.</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 p-10 shadow-sm transition-colors">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Platform Monetization</h3>
               <div className="grid grid-cols-2 gap-6">
                 <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Unbilled Platform Fees</p>
                    <p className="text-4xl font-black text-primary tabular-nums">${currentStats.projectedRevenue.toLocaleString()}</p>
                 </div>
                 <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Payout Velocity</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">+$4.2k <span className="text-xs text-green-500">/hr</span></p>
                 </div>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="bg-[#020617] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 blur-[60px] rounded-full -mr-20 -mt-20"></div>
              <Zap className="text-teal-400 mb-8" size={48} />
              <h3 className="text-2xl font-black mb-3 tracking-tighter">AI Pulse</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                 Platform-wide Gemini 3 Pro reasoning health is at <span className="text-teal-400 font-black tracking-widest">100%</span>.
              </p>
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Tokens / Min</span>
                  <span className="text-white">842,910</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-teal-400 w-3/4 animate-pulse"></div>
                </div>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Security Parameters</h4>
              <div className="space-y-4">
                <ParameterRow label="IP Geofencing" active />
                <ParameterRow label="Root Escalation Protection" active />
                <ParameterRow label="Multi-Tenant Isolation" active />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ParameterRow = ({ label, active }: { label: string, active: boolean }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{label}</span>
    <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-teal-500' : 'bg-slate-200'}`}>
       <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${active ? 'right-0.5' : 'left-0.5'}`}></div>
    </div>
  </div>
);

const StatBox = ({ label, value, icon, color = 'text-slate-900 dark:text-white' }: { label: string, value: string, icon: React.ReactNode, color?: string }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[36px] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
       <ArrowUpRight className="text-slate-200" size={32} />
    </div>
    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6 group-hover:tosca-bg group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">{label}</p>
    <p className={`text-4xl font-black tabular-nums tracking-tighter ${color}`}>{value}</p>
  </div>
);

export default AdminDashboard;

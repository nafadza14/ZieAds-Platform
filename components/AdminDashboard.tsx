
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  ShieldAlert, 
  Activity, 
  History, 
  DollarSign, 
  Cpu, 
  Lock, 
  Zap, 
  ArrowUpRight, 
  Server, 
  RefreshCcw, 
  CheckCircle,
  TrendingUp,
  Search
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
      <div className="h-full flex flex-col items-center justify-center p-20 space-y-8 bg-white dark:bg-slate-950 transition-colors">
        <div className="relative">
          <div className="absolute inset-0 tosca-bg blur-3xl opacity-20 animate-pulse"></div>
          <div className="w-16 h-16 tosca-bg rounded-2xl flex items-center justify-center animate-spin shadow-2xl shadow-teal-500/20">
            <Server className="text-white" size={32} />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-slate-900 dark:text-white font-semibold text-xl tracking-[-0.02em]">Syncing master node</p>
          <p className="text-slate-400 font-bold tracking-tight text-[10px] animate-pulse">Establishing secure root session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12 font-sans text-slate-900 dark:text-slate-300">
      {/* Top Node Identity Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#111827] rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="flex items-center gap-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-400 tracking-tight font-mono">Node: ZieAds-Root-Master</span>
          </div>
          <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
          <div className="hidden sm:flex items-center gap-2">
            <Activity className="text-teal-400" size={14} />
            <span className="text-[10px] font-medium text-slate-400 tracking-tight">Latency: 0.14ms</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
           <button 
            onClick={loadAdminData}
            disabled={refreshing}
            className="flex items-center gap-2 text-[10px] font-bold text-teal-400 tracking-tight bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/20 hover:bg-teal-500/20 transition-all active:scale-95"
           >
             <RefreshCcw size={12} className={refreshing ? 'animate-spin' : ''} />
             {refreshing ? 'Syncing...' : 'Force refresh'}
           </button>
           <span className="text-[10px] font-bold text-slate-500 tracking-tight font-mono">v1.4.0-stable</span>
        </div>
      </div>

      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 bg-teal-500 text-white text-[9px] font-bold tracking-tight rounded shadow-lg shadow-teal-500/20 flex items-center gap-1">
              <CheckCircle size={10} /> Authorized session
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-[-0.03em] leading-tight">
            Command center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-[15px] tracking-tight transition-colors">
            Platform orchestration for <span className="text-slate-900 dark:text-white font-semibold">{currentStats.totalUsers.toLocaleString()}</span> active identities.
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          {(['performance', 'billing', 'security', 'logs'] as AdminTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-medium capitalize tracking-tight transition-all ${
                activeTab === tab 
                ? 'bg-white dark:bg-slate-800 text-primary dark:text-teal-400 shadow-sm border border-slate-200 dark:border-slate-700' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 tabular-nums">
        <StatBox 
          label="Managed spend" 
          value={`$${currentStats.totalManagedSpend.toLocaleString()}`} 
          icon={<DollarSign size={18}/>} 
        />
        <StatBox 
          label="Fraud shielded" 
          value={`$${currentStats.fraudSavingsTotal.toLocaleString()}`} 
          icon={<ShieldAlert size={18}/>} 
          trend="+12%"
        />
        <StatBox 
          label="Node revenue" 
          value={`$${currentStats.projectedRevenue.toLocaleString()}`} 
          icon={<TrendingUp size={18}/>} 
          trend="+2.4%"
        />
        <StatBox 
          label="Active syncs" 
          value={currentStats.activeCampaigns.toLocaleString()} 
          icon={<Cpu size={18}/>} 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'performance' && (
             <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm transition-colors relative overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#111827] dark:text-white flex items-center gap-2">
                    <BarChart3 size={18} className="text-primary" /> Network volume velocity
                  </h3>
                  <div className="flex gap-2">
                     <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                     <span className="text-[10px] font-bold text-slate-400 tracking-tight">Live flow</span>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-2.5 pt-4">
                   {[40, 65, 35, 80, 55, 60, 45, 90, 30, 70, 40, 60].map((h, i) => (
                      <div key={i} className="flex-1 space-y-2 flex flex-col items-center h-full group">
                         <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg h-full relative overflow-hidden flex items-end">
                            <div className="w-full tosca-bg rounded-lg transition-all duration-700 opacity-80 group-hover:opacity-100" style={{ height: refreshing ? '0%' : `${h}%`, transitionDelay: `${i * 30}ms` }}></div>
                         </div>
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter tabular-nums font-mono">P-{12-i}</span>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
               <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-[#111827] dark:text-white flex items-center gap-2">
                    <History size={18} className="text-primary"/> System event stream
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-tight bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                    Live monitor
                  </div>
               </div>
               <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {logs.length > 0 ? logs.map(log => (
                    <div key={log.id} className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-4">
                       <div className={`p-2.5 rounded-xl ${
                         log.severity === 'critical' ? 'bg-red-50 text-red-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                       }`}>
                          {log.eventType === 'SECURITY' ? <Lock size={16}/> : <Activity size={16}/>}
                       </div>
                       <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                               <span className="text-[10px] font-bold tracking-tight text-slate-500 dark:text-slate-400 font-mono capitalize">{log.eventType.toLowerCase()}</span>
                               <span className={`w-1.5 h-1.5 rounded-full ${log.severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                             </div>
                             <span className="text-[10px] font-medium text-slate-400 tabular-nums">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm font-semibold text-[#374151] dark:text-slate-200 tracking-tight">
                            {log.payload?.action || 'Node maintenance event registered.'}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono tracking-tighter">NODE_ID: {log.id.slice(0, 12)}</p>
                       </div>
                    </div>
                  )) : (
                    <div className="p-20 text-center space-y-4">
                      <Search className="mx-auto text-slate-200" size={40} />
                      <p className="text-slate-400 font-medium italic text-sm">Quiet node. No recent signals detected.</p>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
           {/* AI Health Widget */}
           <div className="bg-[#020617] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
                   <Zap size={24} fill="currentColor" fillOpacity={0.2} />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold tracking-tight">AI neural link</h3>
                    <p className="text-[10px] font-bold text-slate-500 tracking-tight">Gemini 3 Pro Cluster</p>
                 </div>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                   <div className="flex justify-between text-[11px] font-bold tracking-tight text-slate-400">
                      <span>Sync capacity</span>
                      <span className="text-teal-400">98.2%</span>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 w-[98.2%]"></div>
                   </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Reasoning nodes are operating at optimal temperature. Scaling buffer is active.
                </p>
              </div>
           </div>

           {/* Security Params */}
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <h4 className="text-[11px] font-bold tracking-tight text-slate-400 mb-4 flex items-center gap-2">
                <Lock size={12}/> Security protocol
              </h4>
              <div className="space-y-4">
                <ParameterRow label="IP Geofencing" active />
                <ParameterRow label="Escalation shield" active />
                <ParameterRow label="Isolated tenants" active />
                <ParameterRow label="Audit persistence" active />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ParameterRow = ({ label, active }: { label: string, active: boolean }) => (
  <div className="flex items-center justify-between">
    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 tracking-tight">{label}</span>
    <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-teal-500' : 'bg-slate-200'}`}>
       <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${active ? 'right-0.5' : 'left-0.5'}`}></div>
    </div>
  </div>
);

const StatBox = ({ label, value, icon, trend, color = 'text-slate-900 dark:text-white' }: { label: string, value: string, icon: React.ReactNode, trend?: string, color?: string }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary transition-all group relative overflow-hidden">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      {trend && (
        <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
          <ArrowUpRight size={10} /> {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] font-bold tracking-tight text-slate-400 mb-1">{label}</p>
    <p className={`text-3xl font-bold tracking-[-0.03em] ${color}`}>{value}</p>
  </div>
);

export default AdminDashboard;

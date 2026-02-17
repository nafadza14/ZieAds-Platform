
import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Zap, 
  ArrowRight, 
  LayoutDashboard,
  Target,
  Activity,
  Award,
  ChevronRight,
  Sun,
  Moon,
  ArrowUpRight,
  Clock,
  ShieldAlert,
  ArrowDownRight,
  Sparkles,
  PieChart as PieIcon,
  Layers
} from 'lucide-react';
import { Workspace, AIInsight } from '../types';

interface DashboardProps {
  activeWorkspace: Workspace | null;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
  insights: AIInsight[];
}

const Dashboard: React.FC<DashboardProps> = ({ activeWorkspace, toggleTheme, isDarkMode, insights = [] }) => {
  const unifiedStats = {
    spend: 12450.80,
    revenue: 42890.30,
    roas: 3.44,
    cpa: 2.15
  };

  const platformDistribution = [
    { name: 'Meta', value: 45, color: '#7C5CFF' },
    { name: 'Google', value: 35, color: '#14B8A6' },
    { name: 'TikTok', value: 20, color: '#94A3B8' },
  ];

  const topCreatives = [
    { id: 'c1', name: 'Performance V1', ctr: 4.8, roas: 5.2, img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200' },
    { id: 'c2', name: 'Minimal Dark', ctr: 3.9, roas: 4.1, img: 'https://images.unsplash.com/photo-1556742049-02e49f61b4ee?auto=format&fit=crop&q=80&w=200' },
    { id: 'c3', name: 'Viral Hook', ctr: 6.2, roas: 3.8, img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=200' },
  ];

  const chartData = [
    { date: 'Feb 07', spend: 400, revenue: 1200 },
    { date: 'Feb 08', spend: 550, revenue: 1800 },
    { date: 'Feb 09', spend: 300, revenue: 900 },
    { date: 'Feb 10', spend: 700, revenue: 2500 },
    { date: 'Feb 11', spend: 600, revenue: 2100 },
    { date: 'Feb 12', spend: 850, revenue: 3200 },
    { date: 'Feb 13', spend: 500, revenue: 1900 },
  ];

  const unresolvedInsights = (insights || []).filter(i => !i?.resolved);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 selection:bg-accent/20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">
            <LayoutDashboard size={12} className="text-accent" />
            <span>ZieAds OS</span>
            <ChevronRight size={10} className="opacity-30" />
            <span className="text-slate-900 dark:text-white">{activeWorkspace?.name || 'Workspace'}</span>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-display">Command Overview</h1>
        </div>

        <div className="flex items-center gap-3">
           <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm dark:shadow-none">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
           </button>
           <button className="px-5 py-2.5 bg-accent text-white font-bold rounded-xl text-[13px] shadow-lg shadow-accent/20 flex items-center gap-2 hover:bg-accent/90 transition-all">
             <Activity size={16} /> Live Feed
           </button>
        </div>
      </header>

      {/* Unified Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Unified Spend" value={`$${unifiedStats.spend.toLocaleString()}`} trend="+14.2%" trendUp icon={<DollarSign size={18} />} />
        <MetricCard title="Unified Revenue" value={`$${unifiedStats.revenue.toLocaleString()}`} trend="+22.5%" trendUp icon={<Award size={18} />} />
        <MetricCard title="Cross-Platform ROAS" value={`${unifiedStats.roas}x`} trend="+0.4x" trendUp icon={<TrendingUp size={18} />} />
        <MetricCard title="Avg. CPA" value={`$${unifiedStats.cpa}`} trend="-12%" trendUp icon={<Target size={18} />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main Performance Area */}
        <div className="xl:col-span-8 space-y-8">
           <div className="bg-white dark:bg-panel p-8 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2">
                    <Layers size={18} className="text-accent" />
                    Network Volume Velocity
                 </h3>
                 <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                     <div className="w-2 h-2 rounded-full bg-accent"></div>
                     <span>Revenue</span>
                   </div>
                   <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                     <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                     <span>Spend</span>
                   </div>
                 </div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDarkMode ? '#52525B' : '#94A3B8', fontFamily: 'JetBrains Mono' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDarkMode ? '#52525B' : '#94A3B8', fontFamily: 'JetBrains Mono' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: isDarkMode ? '#111318' : '#FFFFFF', borderRadius: '12px', border: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0', color: isDarkMode ? '#fff' : '#000' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#7C5CFF" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      <Area type="monotone" dataKey="spend" stroke={isDarkMode ? "#3F3F46" : "#E2E8F0"} strokeWidth={2} fillOpacity={0} strokeDasharray="5 5" />
                   </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-panel p-8 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm">
                 <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display mb-6 flex items-center gap-2">
                   <PieIcon size={18} className="text-accent" />
                   Budget Distribution
                 </h3>
                 <div className="space-y-6">
                    {platformDistribution.map(p => (
                      <div key={p.name} className="space-y-2">
                         <div className="flex justify-between items-center text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            <span>{p.name}</span>
                            <span className="text-slate-900 dark:text-white">{p.value}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${p.value}%`, backgroundColor: p.color }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white dark:bg-panel p-8 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm">
                 <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display mb-6 flex items-center gap-2">
                   <Award size={18} className="text-accent" />
                   Top Creative Performance
                 </h3>
                 <div className="space-y-4">
                    {topCreatives.map(c => (
                      <div key={c.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-white/5">
                         <img src={c.img} className="w-10 h-10 rounded-xl object-cover" alt="" />
                         <div className="flex-1 min-w-0">
                            <h4 className="text-[13px] font-bold text-slate-900 dark:text-white truncate">{c.name}</h4>
                            <div className="flex gap-3 mt-0.5">
                               <span className="text-[10px] font-mono font-bold text-accent">{c.roas}x ROAS</span>
                               <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-600">{c.ctr}% CTR</span>
                            </div>
                         </div>
                         <ArrowUpRight size={14} className="text-slate-300 dark:text-slate-700" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Intelligence / Alerts Sidebar */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-white dark:bg-panel rounded-[32px] p-8 text-slate-900 dark:text-white border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[40px] rounded-full -mr-16 -mt-16"></div>
              
              <div className="flex items-center gap-3 mb-8 relative z-10">
                 <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    <Sparkles size={20} fill="currentColor" />
                 </div>
                 <h3 className="text-lg font-bold tracking-tight font-display">AI Alerts Panel</h3>
              </div>

              <div className="space-y-4 relative z-10">
                 {unresolvedInsights.length > 0 ? unresolvedInsights.map(insight => (
                   <div key={insight.id} className={`p-4 rounded-2xl border transition-all ${
                     insight.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10'
                   }`}>
                      <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${insight.severity === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-teal-500'}`}></div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{insight.insight_type}</span>
                         </div>
                         <span className="text-[9px] font-mono text-slate-400 dark:text-slate-700">Just now</span>
                      </div>
                      <p className="text-[13px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{insight.message}</p>
                      <button className="mt-4 flex items-center gap-2 text-[11px] font-bold text-slate-900 dark:text-white group/btn hover:text-accent transition-colors">
                         Review <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                   </div>
                 )) : (
                   <div className="py-12 text-center space-y-4 opacity-30">
                      <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto">
                        <Clock size={24} className="text-slate-400" />
                      </div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Awaiting signals...</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-white dark:bg-panel p-8 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display mb-6 flex items-center gap-2">
                <ShieldAlert size={18} className="text-accent" />
                Fraud Shield Protocol
              </h3>
              <div className="space-y-4">
                 <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Activity size={14} className="text-accent" />
                          <span className="text-[12px] font-bold text-slate-600 dark:text-slate-300">Scanning Intensity</span>
                       </div>
                       <span className="text-[11px] font-mono font-bold text-accent">High</span>
                    </div>
                    <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full">
                       <div className="h-full w-4/5 bg-accent rounded-full"></div>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-600 italic">Fingerprint validation active for all campaigns.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, trend, trendUp, icon }: any) => (
  <div className="bg-white dark:bg-panel p-8 rounded-[32px] border border-slate-200 dark:border-white/5 group hover:border-accent dark:hover:border-white/10 transition-all duration-300 relative overflow-hidden shadow-sm dark:shadow-none">
    <div className="absolute -bottom-6 -right-6 text-slate-100 dark:text-white/5 group-hover:text-accent/5 transition-colors duration-500">
      {React.cloneElement(icon, { size: 100 })}
    </div>
    
    <div className="flex items-center justify-between mb-6 relative z-10">
       <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-accent transition-colors">
          {icon}
       </div>
       <div className={`flex items-center gap-1 text-[11px] font-mono font-bold ${trendUp ? 'text-teal-600 dark:text-teal-500' : 'text-red-600 dark:text-red-500'}`}>
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
       </div>
    </div>
    
    <p className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1 relative z-10">{title}</p>
    <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-display relative z-10">{value}</p>
  </div>
);

export default Dashboard;

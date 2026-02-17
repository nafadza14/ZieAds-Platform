
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
  ShieldAlert
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
    { name: 'TikTok', value: 20, color: '#FFFFFF' },
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
    <div className="space-y-8 animate-in fade-in duration-500 selection:bg-[#7C5CFF]/20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            <LayoutDashboard size={12} className="text-[#7C5CFF]" />
            <span>Product</span>
            <ChevronRight size={10} />
            <span className="text-white">{activeWorkspace?.name || 'Workspace'}</span>
          </nav>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Overview</h1>
        </div>

        <div className="flex items-center gap-3">
           <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-[#111318] border border-[#1F2329] text-slate-500 hover:text-white transition-all">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
           </button>
           <button className="px-5 py-2.5 bg-[#7C5CFF] text-white font-bold rounded-xl text-xs shadow-lg shadow-[#7C5CFF]/10 flex items-center gap-2">
             <Activity size={16} /> Live Feed
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Spend" value={`$${unifiedStats.spend.toLocaleString()}`} trend="+14.2%" trendUp icon={<DollarSign size={18} />} />
        <MetricCard title="Revenue" value={`$${unifiedStats.revenue.toLocaleString()}`} trend="+22.5%" trendUp icon={<Award size={18} />} />
        <MetricCard title="ROAS" value={`${unifiedStats.roas}x`} trend="+0.4x" trendUp icon={<TrendingUp size={18} />} />
        <MetricCard title="CPA" value={`$${unifiedStats.cpa}`} trend="-12%" trendUp icon={<Target size={18} />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
           <div className="bg-[#111318] p-8 rounded-2xl border border-[#1F2329] shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-semibold text-white tracking-tight">Performance Stream</h3>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2329" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#52525B' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#52525B' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0B0D10', borderRadius: '12px', border: '1px solid #1F2329' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#7C5CFF" strokeWidth={2} fillOpacity={0.1} fill="#7C5CFF" />
                      <Area type="monotone" dataKey="spend" stroke="#3F3F46" strokeWidth={2} fillOpacity={0} />
                   </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#111318] p-8 rounded-2xl border border-[#1F2329]">
                 <h3 className="text-base font-semibold text-white tracking-tight mb-6">Budget Distribution</h3>
                 <div className="space-y-6">
                    {platformDistribution.map(p => (
                      <div key={p.name} className="space-y-2">
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <span>{p.name}</span>
                            <span className="text-white">{p.value}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-[#1F2329] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${p.value}%`, backgroundColor: p.color }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-[#111318] p-8 rounded-2xl border border-[#1F2329]">
                 <h3 className="text-base font-semibold text-white tracking-tight mb-6">Top Performers</h3>
                 <div className="space-y-4">
                    {topCreatives.map(c => (
                      <div key={c.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-[#1F2329]">
                         <img src={c.img} className="w-10 h-10 rounded-lg object-cover" alt="" />
                         <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{c.name}</h4>
                            <div className="flex gap-3 mt-0.5">
                               <span className="text-[10px] font-bold text-[#7C5CFF]">{c.roas}x ROAS</span>
                               <span className="text-[10px] font-bold text-slate-500">{c.ctr}% CTR</span>
                            </div>
                         </div>
                         <ArrowUpRight size={14} className="text-slate-600" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
           <div className="bg-[#111318] rounded-2xl p-8 text-white border border-[#1F2329] shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-[#7C5CFF]/10 text-[#7C5CFF] flex items-center justify-center">
                    <Zap size={20} fill="currentColor" />
                 </div>
                 <h3 className="text-lg font-semibold tracking-tight">AI Insights</h3>
              </div>

              <div className="space-y-4">
                 {unresolvedInsights.length > 0 ? unresolvedInsights.map(insight => (
                   <div key={insight.id} className={`p-4 rounded-xl border ${
                     insight.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/5'
                   }`}>
                      <div className="flex items-center gap-2 mb-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${insight.severity === 'critical' ? 'bg-red-500' : 'bg-teal-500'}`}></div>
                         <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{insight.insight_type}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-300 leading-relaxed">{insight.message}</p>
                      <button className="mt-4 flex items-center gap-2 text-[10px] font-bold text-white group/btn hover:text-[#7C5CFF] transition-colors">
                         Review <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                   </div>
                 )) : (
                   <div className="py-12 text-center space-y-4 opacity-30">
                      <Clock size={32} className="mx-auto" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting signals...</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-[#111318] p-8 rounded-2xl border border-[#1F2329]">
              <h3 className="text-base font-semibold text-white tracking-tight mb-6">Safety Protocol</h3>
              <div className="space-y-4">
                 <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-2">
                       <ShieldAlert size={14} className="text-[#7C5CFF]" />
                       <span className="text-[11px] font-semibold text-slate-300">Fraud Shield Active</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, trend, trendUp, icon }: any) => (
  <div className="bg-[#111318] p-8 rounded-2xl border border-[#1F2329] group hover:border-slate-700 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-[#7C5CFF] transition-colors">
          {icon}
       </div>
       <span className={`text-[10px] font-bold ${trendUp ? 'text-teal-400' : 'text-red-400'}`}>
          {trend}
       </span>
    </div>
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</p>
    <p className="text-3xl font-semibold text-white tracking-tight">{value}</p>
  </div>
);

export default Dashboard;

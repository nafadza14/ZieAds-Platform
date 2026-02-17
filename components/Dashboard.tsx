
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MousePointer2, 
  DollarSign, 
  AlertCircle,
  Zap,
  ArrowRight,
  Sparkles,
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
import { Workspace, Campaign, AIInsight } from '../types';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  activeWorkspace: Workspace | null;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
  insights: AIInsight[];
}

const Dashboard: React.FC<DashboardProps> = ({ activeWorkspace, toggleTheme, isDarkMode, insights }) => {
  const navigate = useNavigate();

  // Mocked state for unified overview metrics
  const unifiedStats = {
    spend: 12450.80,
    revenue: 42890.30,
    roas: 3.44,
    cpa: 2.15
  };

  const platformDistribution = [
    { name: 'Meta', value: 45, color: '#1877F2' },
    { name: 'Google', value: 35, color: '#DB4437' },
    { name: 'TikTok', value: 20, color: '#000000' },
  ];

  const topCreatives = [
    { id: 'c1', name: 'Product Hero V1', ctr: 4.8, roas: 5.2, img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200' },
    { id: 'c2', name: 'Minimalist Dark', ctr: 3.9, roas: 4.1, img: 'https://images.unsplash.com/photo-1556742049-02e49f61b4ee?auto=format&fit=crop&q=80&w=200' },
    { id: 'c3', name: 'Viral Hook UGC', ctr: 6.2, roas: 3.8, img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=200' },
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

  const unresolvedInsights = insights.filter(i => !i.resolved);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans selection:bg-teal-100 dark:selection:bg-teal-900/30">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-[12px] font-bold tracking-tight text-slate-400 uppercase">
            <LayoutDashboard size={14} className="text-primary" />
            <span>Command Center</span>
            <ChevronRight size={12} className="opacity-50" />
            <span className="text-slate-900 dark:text-white">{activeWorkspace?.name}</span>
          </nav>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">AI-First Overview</h1>
        </div>

        <div className="flex items-center gap-3">
           <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all shadow-sm">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
           </button>
           <button className="px-6 py-2.5 tosca-bg text-white font-black rounded-xl text-xs shadow-xl shadow-teal-500/20 flex items-center gap-2 uppercase tracking-widest">
             <Activity size={16} /> Live Pulse
           </button>
        </div>
      </header>

      {/* Hero Stats: Unified Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Unified Spend" value={`$${unifiedStats.spend.toLocaleString()}`} trend="+14.2%" trendUp icon={<DollarSign size={18} />} />
        <MetricCard title="Unified Revenue" value={`$${unifiedStats.revenue.toLocaleString()}`} trend="+22.5%" trendUp icon={<Award size={18} />} />
        <MetricCard title="Unified ROAS" value={`${unifiedStats.roas}x`} trend="+0.4x" trendUp icon={<TrendingUp size={18} />} />
        <MetricCard title="Unified CPA" value={`$${unifiedStats.cpa}`} trend="-12%" trendUp icon={<Target size={18} />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Col: Main Insights & Charts */}
        <div className="xl:col-span-8 space-y-8">
           {/* Performance Trends */}
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BarChart size={120} />
              </div>
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white font-display tracking-tight">Financial Velocity</h3>
                    <p className="text-sm font-medium text-slate-500">Unified spend vs revenue tracking (7d)</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                       <span className="text-[10px] font-black uppercase text-slate-400">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                       <span className="text-[10px] font-black uppercase text-slate-400">Spend</span>
                    </div>
                 </div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                      <defs>
                         <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontWeight: 800 }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      <Area type="monotone" dataKey="spend" stroke="#CBD5E1" strokeWidth={2} fillOpacity={0} />
                   </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Platform & Creative Grids */}
           <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm">
                 <h3 className="text-lg font-black text-slate-900 dark:text-white font-display tracking-tight mb-6">Budget Distribution</h3>
                 <div className="space-y-6">
                    {platformDistribution.map(p => (
                      <div key={p.name} className="space-y-2">
                         <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
                               {p.name}
                            </span>
                            <span className="text-slate-900 dark:text-white">{p.value}%</span>
                         </div>
                         <div className="h-2 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${p.value}%`, backgroundColor: p.color }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white font-display tracking-tight">Top Creatives</h3>
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</button>
                 </div>
                 <div className="space-y-4">
                    {topCreatives.map(c => (
                      <div key={c.id} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group transition-all hover:border-primary/30">
                         <img src={c.img} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                         <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{c.name}</h4>
                            <div className="flex gap-3 mt-0.5">
                               <span className="text-[10px] font-black text-teal-500">{c.roas}x ROAS</span>
                               <span className="text-[10px] font-bold text-slate-400">{c.ctr}% CTR</span>
                            </div>
                         </div>
                         <ArrowUpRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Right Col: AI Alerts & Optimization Hub */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-[#111827] rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-950/20">
              <div className="absolute top-0 right-0 w-32 h-32 tosca-bg/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/5">
                    <Zap size={24} fill="currentColor" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black font-display tracking-tight">AI Alert Panel</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Signals</p>
                 </div>
              </div>

              <div className="space-y-5">
                 {unresolvedInsights.length > 0 ? unresolvedInsights.map(insight => (
                   <div key={insight.id} className={`p-5 rounded-[28px] border transition-all hover:scale-[1.02] ${
                     insight.severity === 'critical' 
                     ? 'bg-red-500/10 border-red-500/20' 
                     : insight.severity === 'warning' 
                       ? 'bg-orange-500/10 border-orange-500/20' 
                       : 'bg-blue-500/10 border-blue-500/20'
                   }`}>
                      <div className="flex items-center gap-2 mb-2">
                         <div className={`w-2 h-2 rounded-full ${
                           insight.severity === 'critical' ? 'bg-red-500 animate-pulse' : 
                           insight.severity === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                         }`}></div>
                         <span className={`text-[10px] font-black uppercase tracking-widest ${
                           insight.severity === 'critical' ? 'text-red-400' : 
                           insight.severity === 'warning' ? 'text-orange-400' : 'text-blue-400'
                         }`}>{insight.insight_type.replace('_', ' ')}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-300 leading-relaxed">{insight.message}</p>
                      <button className="mt-4 flex items-center gap-2 text-[11px] font-black text-white group/btn">
                         Take Action <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                   </div>
                 )) : (
                   <div className="py-12 text-center space-y-4 opacity-50">
                      <Clock size={40} className="mx-auto text-slate-600" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Awaiting system signals...</p>
                   </div>
                 )}
              </div>

              <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                Dismiss All Signals
              </button>
           </div>

           <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-display tracking-tight mb-6">Scale Intensity</h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Level</span>
                       <span className="text-sm font-bold text-slate-900 dark:text-white">Balanced Control</span>
                    </div>
                    <div className="flex gap-1.5">
                       {[1, 2, 3].map(i => (
                         <div key={i} className={`w-3 h-3 rounded-full ${i <= 2 ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="p-5 bg-teal-500/5 rounded-3xl border border-teal-500/10 space-y-3">
                    <p className="text-[11px] font-black text-primary uppercase tracking-widest">Automation Status</p>
                    <div className="flex items-center gap-2">
                       <ShieldAlert size={16} className="text-teal-500" />
                       <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Click Fraud Protection Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Sparkles size={16} className="text-teal-500" />
                       <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Smart Budget Re-flow Active</span>
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
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
       {icon}
    </div>
    <div className="flex items-center gap-3 mb-4">
       <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:tosca-bg group-hover:text-white transition-all duration-500">
          {icon}
       </div>
       <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trendUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {trend}
       </span>
    </div>
    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">{value}</p>
  </div>
);

export default Dashboard;

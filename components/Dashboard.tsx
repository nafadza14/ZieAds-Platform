
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MousePointer2, 
  DollarSign, 
  AlertCircle,
  Lightbulb,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Home,
  Sun,
  Moon
} from 'lucide-react';
import { Business, Recommendation, Campaign } from '../types';
import { getRecommendations } from '../services/geminiService';

interface DashboardProps {
  activeBusiness: Business | null;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ activeBusiness, toggleTheme, isDarkMode }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const campaigns = activeBusiness?.campaigns || [];

  useEffect(() => {
    if (campaigns.length > 0) {
      loadRecommendations();
    }
  }, [campaigns.length, activeBusiness?.id]);

  const loadRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const recs = await getRecommendations(campaigns);
      setRecommendations(recs);
    } catch (e) {
      console.error("AI Recommendation error:", e);
    } finally {
      setLoadingRecs(false);
    }
  };

  const totalSpend = campaigns.reduce((acc, c) => acc + (c.metrics?.spend || 0), 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + (c.metrics?.conversions || 0), 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + (c.metrics?.clicks || 0), 0);
  const avgRoas = campaigns.length > 0 
    ? (campaigns.reduce((acc, c) => acc + (c.metrics?.roas || 0), 0) / campaigns.length).toFixed(2) 
    : '0';

  const chartData = [
    { name: 'Mon', spend: totalSpend * 0.1, conv: totalConversions * 0.1 },
    { name: 'Tue', spend: totalSpend * 0.12, conv: totalConversions * 0.11 },
    { name: 'Wed', spend: totalSpend * 0.15, conv: totalConversions * 0.18 },
    { name: 'Thu', spend: totalSpend * 0.2, conv: totalConversions * 0.22 },
    { name: 'Fri', spend: totalSpend * 0.18, conv: totalConversions * 0.15 },
    { name: 'Sat', spend: totalSpend * 0.13, conv: totalConversions * 0.12 },
    { name: 'Sun', spend: totalSpend * 0.12, conv: totalConversions * 0.12 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans selection:bg-teal-100 dark:selection:bg-teal-900/30">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-2 text-[13px] font-medium tracking-tight text-slate-400">
            <div className="flex items-center gap-1.5 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors">
              <Home size={14} />
              <span>Home</span>
            </div>
            <ChevronRight size={12} className="opacity-50" />
            <div className="flex items-center gap-1.5 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors">
              <span>{activeBusiness?.name || 'Business'}</span>
            </div>
            <ChevronRight size={12} className="opacity-50" />
            <span className="text-slate-900 dark:text-white font-semibold transition-colors">Overview</span>
          </nav>

          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-full transition-all relative">
            <div 
              className={`absolute top-1 left-1 bottom-1 w-[34px] bg-white dark:bg-slate-800 rounded-full shadow-sm transition-all duration-300 ease-in-out transform ${isDarkMode ? 'translate-x-[34px]' : 'translate-x-0'}`}
            ></div>
            <button 
              onClick={!isDarkMode ? undefined : toggleTheme}
              className={`relative flex items-center justify-center w-[34px] h-[34px] rounded-full transition-colors z-10 ${!isDarkMode ? 'text-slate-900' : 'text-slate-500 hover:text-slate-400'}`}
              aria-label="Light Mode"
            >
              <Sun size={16} strokeWidth={2.5} />
            </button>
            <button 
              onClick={isDarkMode ? undefined : toggleTheme}
              className={`relative flex items-center justify-center w-[34px] h-[34px] rounded-full transition-colors z-10 ${isDarkMode ? 'text-teal-400' : 'text-slate-400 hover:text-slate-50'}`}
              aria-label="Dark Mode"
            >
              <Moon size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#111827] dark:text-slate-100 tracking-[-0.02em] mb-1 transition-colors">Business Performance</h1>
            <p className="text-[#4B5563] dark:text-slate-400 font-normal text-base transition-colors">
              Monitoring active campaigns for <span className="font-semibold text-primary">{activeBusiness?.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] text-[#6B7280] dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  AI Optimization Live
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] text-primary dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-4 py-2 rounded-full border border-teal-100 dark:border-teal-500/20 shadow-sm transition-colors">
                  <ShieldAlert size={14} />
                  Fraud protection active
              </div>
          </div>
        </div>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total spend" value={`$${totalSpend.toLocaleString()}`} icon={<DollarSign size={20} />} trend="+12.5%" />
        <MetricCard title="Total clicks" value={totalClicks.toLocaleString()} icon={<MousePointer2 size={20} />} trend="+8.2%" trendColor="green" />
        <MetricCard title="Conversions" value={totalConversions.toLocaleString()} icon={<Users size={20} />} trend="+15.1%" trendColor="green" />
        <MetricCard title="Avg. roas" value={`${avgRoas}x`} icon={<TrendingUp size={20} />} trend="+2.4%" trendColor="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-7 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-lg tracking-[-0.01em] text-[#111827] dark:text-slate-100 transition-colors">Growth Trends</h3>
            <div className="flex gap-2 font-medium text-[11px] uppercase tracking-wider">
                <span className="text-primary dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-2.5 py-1 rounded-full">Spend</span>
                <span className="text-slate-400 dark:text-slate-500 px-2.5 py-1 rounded-full">Conversions</span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', 
                    fontSize: '12px',
                    fontWeight: 500,
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000'
                  }}
                />
                <Area type="monotone" dataKey="spend" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-7 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-primary dark:text-teal-400 transition-colors">
              <Lightbulb size={20} />
            </div>
            <h3 className="font-semibold text-lg tracking-[-0.01em] text-[#111827] dark:text-slate-100 transition-colors">AI Insights</h3>
          </div>
          
          <div className="flex-1 space-y-4">
            {loadingRecs ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-slate-50 dark:bg-slate-800 h-24 rounded-2xl transition-colors"></div>
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-teal-200 dark:hover:border-teal-500/50 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary dark:text-teal-400 px-2 py-0.5 bg-teal-50 dark:bg-teal-500/20 rounded-lg transition-colors">{rec.type}</span>
                    <span className="text-[11px] font-semibold text-green-600 dark:text-green-400 flex items-center gap-1 transition-colors tabular-nums">
                      <ArrowUpRight size={14} /> {rec.impact}
                    </span>
                  </div>
                  <h4 className="font-semibold text-[13px] mb-1 tracking-tight text-[#1F2937] dark:text-slate-200 transition-colors">{rec.title}</h4>
                  <p className="text-[12px] text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal transition-colors">{rec.description}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4 flex flex-col items-center justify-center h-full">
                <AlertCircle className="text-slate-300 dark:text-slate-600 mb-3 transition-colors" size={40} />
                <p className="text-[#9CA3AF] dark:text-slate-500 text-sm font-medium transition-colors">Launch a campaign to get AI insights.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-7 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-lg tracking-[-0.01em] text-[#111827] dark:text-slate-100 transition-colors">Active Campaigns</h3>
          <button className="text-primary dark:text-teal-400 text-xs font-bold hover:underline transition-colors uppercase tracking-[0.1em]">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] dark:text-slate-500 transition-colors border-b border-slate-100 dark:border-slate-800">
                <th className="px-7 py-4">Campaign</th>
                <th className="px-7 py-4">Status</th>
                <th className="px-7 py-4">Platforms</th>
                <th className="px-7 py-4">Roas</th>
                <th className="px-7 py-4">Budget</th>
                <th className="px-7 py-4">Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 tabular-nums">
              {campaigns.length > 0 ? campaigns.map((c) => (
                <tr key={c.id} className="text-sm text-[#374151] dark:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-7 py-5">
                    <p className="font-semibold text-[#111827] dark:text-slate-200 tracking-tight transition-colors">{c.name}</p>
                    <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-medium uppercase transition-colors">{c.id.slice(0, 8)}</p>
                  </td>
                  <td className="px-7 py-5">
                    <span className="flex items-center gap-1.5 text-xs font-medium transition-colors">
                      <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'active' ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}></span>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-7 py-5">
                    <div className="flex gap-1">
                        {c.platforms.map(p => (
                            <span key={p} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400 transition-colors">{p}</span>
                        ))}
                    </div>
                  </td>
                  <td className="px-7 py-5 text-primary dark:text-teal-400 font-bold">{c.metrics?.roas || 0}x</td>
                  <td className="px-7 py-5 font-medium text-slate-600 dark:text-slate-300 text-xs">${c.budget}/day</td>
                  <td className="px-7 py-5 font-medium text-slate-600 dark:text-slate-300 text-xs">${c.metrics?.spend || 0}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-7 py-12 text-center text-slate-400 dark:text-slate-600 font-medium italic transition-colors">No campaigns found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, trend, trendColor = 'green' }: { title: string, value: string, icon: React.ReactNode, trend: string, trendColor?: string }) => (
  <div className="bg-white dark:bg-slate-900 p-7 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg group">
    <div className="flex items-center justify-between mb-4">
      <div className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#6B7280] dark:text-slate-400 group-hover:tosca-bg group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors tabular-nums ${trendColor === 'green' ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10'}`}>{trend}</span>
    </div>
    <h3 className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#9CA3AF] dark:text-slate-500 mb-1 transition-colors">{title}</h3>
    <p className="text-3xl font-semibold text-[#111827] dark:text-white tracking-[-0.02em] leading-none transition-colors tabular-nums">{value}</p>
  </div>
);

export default Dashboard;

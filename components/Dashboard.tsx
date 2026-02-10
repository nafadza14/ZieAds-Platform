
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
  ShieldAlert
} from 'lucide-react';
import { Business, Recommendation, Campaign } from '../types';
import { getRecommendations } from '../services/geminiService';

interface DashboardProps {
  activeBusiness: Business | null;
}

const Dashboard: React.FC<DashboardProps> = ({ activeBusiness }) => {
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

  // Derived Metrics
  const totalSpend = campaigns.reduce((acc, c) => acc + (c.metrics?.spend || 0), 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + (c.metrics?.conversions || 0), 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + (c.metrics?.clicks || 0), 0);
  const avgRoas = campaigns.length > 0 
    ? (campaigns.reduce((acc, c) => acc + (c.metrics?.roas || 0), 0) / campaigns.length).toFixed(2) 
    : '0';

  // Real data simulation for the chart based on total spend
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Unified Command Center</h1>
          <p className="text-slate-500">Monitoring performance for <span className="font-bold text-primary">{activeBusiness?.name}</span></p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                AI Optimization Live
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 px-4 py-2 rounded-full border border-teal-100">
                <ShieldAlert size={14} />
                Fraud Protection: Active
            </div>
        </div>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Spend" value={`$${totalSpend.toLocaleString()}`} icon={<DollarSign size={20} />} trend="+12.5%" />
        <MetricCard title="Total Clicks" value={totalClicks.toLocaleString()} icon={<MousePointer2 size={20} />} trend="+8.2%" trendColor="green" />
        <MetricCard title="Conversions" value={totalConversions.toLocaleString()} icon={<Users size={20} />} trend="+15.1%" trendColor="green" />
        <MetricCard title="Avg. ROAS" value={`${avgRoas}x`} icon={<TrendingUp size={20} />} trend="+2.4%" trendColor="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Performance Trends</h3>
            <div className="flex gap-2">
                <span className="text-xs font-bold text-primary bg-teal-50 px-2 py-1 rounded">SPEND</span>
                <span className="text-xs font-bold text-slate-400 px-2 py-1 rounded">CONVERSIONS</span>
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="spend" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-teal-50 text-primary">
              <Lightbulb size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">AI Recommendations</h3>
          </div>
          
          <div className="flex-1 space-y-4">
            {loadingRecs ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-slate-50 h-24 rounded-xl"></div>
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-teal-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary px-2 py-0.5 bg-teal-50 rounded">{rec.type}</span>
                    <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                      <ArrowUpRight size={14} /> {rec.impact}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{rec.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{rec.description}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4">
                <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-slate-400 text-sm">Launch a campaign to get AI insights.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Recent Campaigns</h3>
          <button className="text-primary text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Campaign</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Platforms</th>
                <th className="px-6 py-4">ROAS</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.length > 0 ? campaigns.map((c) => (
                <tr key={c.id} className="text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{c.name}</p>
                    <p className="text-[10px] text-slate-400">{c.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 capitalize">
                      <span className={`w-2 h-2 rounded-full ${c.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                        {c.platforms.map(p => (
                            <span key={p} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold">{p}</span>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-primary font-bold">{c.metrics?.roas || 0}x</td>
                  <td className="px-6 py-4 font-medium">${c.budget}/day</td>
                  <td className="px-6 py-4">${c.metrics?.spend || 0}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No campaigns found.</td>
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
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
        {icon}
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${trendColor === 'green' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>{trend}</span>
    </div>
    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-2xl font-black text-slate-900">{value}</p>
  </div>
);

export default Dashboard;

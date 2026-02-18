
import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  LineChart, Line
} from 'recharts';
import { 
  CheckCircle2, AlertTriangle, Sparkles, TrendingUp, TrendingDown, RefreshCw, Loader2
} from 'lucide-react';
import { fetchDashboardSummary, triggerAnalyticsSync } from '../services/dbService';
import { DashboardSummary, Platform } from '../types';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadData = async (range: string) => {
    setLoading(true);
    try {
      // Mock workspace ID for implementation
      const data = await fetchDashboardSummary('zieads-root-master', range);
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(timeRange);
  }, [timeRange]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await triggerAnalyticsSync('zieads-root-master');
      await loadData(timeRange);
    } catch (err) {
      alert("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  if (loading && !summary) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-[#8B5CF6]" size={48} />
        <p className="text-[#94A3B8] font-bold uppercase tracking-widest text-sm">Synchronizing Command Center...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0F172A] min-h-full p-6 text-[#F8FAFC] font-sans">
      {/* HEADER SECTION */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold tracking-tight text-white font-display">ZieAds</span>
          <h1 className="text-2xl font-semibold text-white">Command Center</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSync}
            disabled={syncing}
            className={`flex items-center gap-2 px-3 py-1.5 bg-[#10B981]/10 rounded-lg border border-[#10B981]/20 hover:bg-[#10B981]/20 transition-all ${syncing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw size={14} className={`${syncing ? 'animate-spin' : ''} text-[#10B981]`} />
            <span className="text-[12px] font-medium text-[#10B981]">{syncing ? 'Syncing...' : 'Live Sync'}</span>
          </button>
          <button className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#7C3AED] transition-all shadow-lg shadow-[#8B5CF6]/10">
            Apply Recommendations
          </button>
        </div>
      </header>

      {summary && (
        <div className="max-w-[1200px] mx-auto space-y-4 animate-in fade-in duration-700">
          {/* TOP CARD (Performance Overview) */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 grid grid-cols-1 md:grid-cols-10 gap-8">
            <div className="md:col-span-3 space-y-4">
              <div className="space-y-1">
                <div className="text-[72px] font-bold text-white leading-none">
                  {Math.floor(summary.summary.total_roas * 10)}
                </div>
                <div className="text-[14px] font-medium text-[#10B981]">
                  AI Efficiency Score: {summary.summary.total_roas.toFixed(2)}x
                </div>
              </div>
              <div className="h-16 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={summary.trend}>
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[14px] text-[#94A3B8] italic">
                "Performing at {summary.summary.total_roas > 3 ? 'high' : 'standard'} efficiency benchmarks."
              </p>
            </div>

            <div className="md:col-span-7 grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-[#10B981] text-base font-semibold flex items-center gap-2">
                  <CheckCircle2 size={16} /> What's Working
                </h3>
                <ul className="text-sm text-[#F8FAFC] space-y-3 font-medium">
                  {summary.by_campaign.slice(0, 3).map((camp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>•</span> {camp.name} ({camp.roas}x)
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-[#F59E0B] text-base font-semibold flex items-center gap-2">
                  <AlertTriangle size={16} /> Watch Out
                </h3>
                <ul className="text-sm text-[#F8FAFC] space-y-3 font-medium">
                  <li className="flex items-start gap-2"><span>•</span> TikTok CPM up 18% in 24 hours</li>
                  <li className="flex items-start gap-2"><span>•</span> Retargeting audience saturated</li>
                  <li className="flex items-start gap-2"><span>•</span> Pixel firing delays detected</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-[#8B5CF6] text-base font-semibold flex items-center gap-2">
                  <Sparkles size={16} /> AI Suggestions
                </h3>
                <div className="space-y-3">
                  {[
                    "Scale Meta Winner #1 by 20%",
                    "Rotate tired UGC creative",
                    "Fix tracking issue"
                  ].map((sug, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <p className="text-xs font-medium text-[#F8FAFC]">{sug}</p>
                      <button className="w-fit px-3 py-1 border border-[#8B5CF6] text-[#8B5CF6] rounded text-[10px] font-bold hover:bg-[#8B5CF6] hover:text-white transition-all">
                        Do it
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* METRICS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard value={`$${summary.summary.total_spend.toLocaleString()}`} trend="+14.2%" label="TOTAL SPEND" />
            <MetricCard value={`$${summary.summary.total_revenue.toLocaleString()}`} trend="+22.5%" label="REVENUE" />
            <MetricCard value={`${summary.summary.total_roas.toFixed(2)}x`} trend="+0.4%" label="ROAS" />
            <MetricCard value={summary.summary.total_conversions.toLocaleString()} trend="+8%" label="TOTAL SALES" />
          </div>

          {/* BOTTOM SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
            <div className="lg:col-span-6 bg-[#1E293B] border border-[#334155] rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Revenue vs Spend</h3>
                <div className="flex bg-[#0F172A] p-1 rounded-lg border border-[#334155]">
                  {['7d', '30d'].map(range => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${timeRange === range ? 'bg-[#1E293B] text-white shadow-sm' : 'text-[#94A3B8] hover:text-white'}`}
                    >
                      {range === '7d' ? '7 days' : '30 days'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summary.trend}>
                    <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} hide />
                    <YAxis hide />
                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="spend" stroke="#94A3B8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#1E293B] border border-[#334155] rounded-xl p-6 space-y-8">
              <h3 className="text-base font-semibold text-white">Budget by Platform</h3>
              <div className="space-y-6">
                {summary.by_platform.map((p, i) => (
                  <PlatformBar 
                    key={i}
                    label={p.platform} 
                    percent={Math.floor((p.spend / summary.summary.total_spend) * 100)} 
                    amount={`$${p.spend.toLocaleString()}`} 
                    roas={`${p.roas}x`} 
                    color={p.platform === Platform.Meta ? '#3B82F6' : p.platform === Platform.Google ? '#EF4444' : '#000000'} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ value, trend, label }: any) => (
  <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 h-[120px] flex flex-col justify-between shadow-sm hover:border-[#8B5CF6]/50 transition-colors">
    <div className="text-[28px] font-bold text-white leading-none">{value}</div>
    <div className="flex items-center justify-between">
      <span className="text-[14px] font-medium text-[#10B981]">{trend}</span>
      <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{label}</span>
    </div>
  </div>
);

const PlatformBar = ({ label, percent, amount, roas, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold">
      <div className="flex gap-2 text-[#F8FAFC]">
        <span className="capitalize">{label}</span>
        <span className="text-[#94A3B8]">{percent}% ({amount})</span>
      </div>
      <div className="text-white">{roas} ROAS</div>
    </div>
    <div className="h-2 w-full bg-[#0F172A] rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-1000" 
        style={{ width: `${percent}%`, backgroundColor: color }}
      ></div>
    </div>
  </div>
);

export default Dashboard;

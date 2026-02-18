
import React, { useState } from 'react';
import { 
  Zap, TrendingUp, TrendingDown, Target, 
  AlertTriangle, BarChart3, Activity, 
  ChevronRight, ArrowUpRight, ArrowDownRight,
  CheckCircle2, AlertCircle, RefreshCw, 
  Filter, Share2, MousePointer2, Clock, Globe,
  Eye, DollarSign, Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, BarChart, Bar, Cell
} from 'recharts';

type InsightTab = 'Overview' | 'Audience' | 'Creative' | 'Budget';

const InsightsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InsightTab>('Overview');

  const sparkData = [20, 35, 25, 45, 30, 55, 42];

  return (
    <div className="flex h-full bg-[#0F172A] text-[#F8FAFC] font-sans overflow-hidden">
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-[#334155]">
        {/* HEADER */}
        <header className="p-8 flex items-center justify-between border-b border-[#334155] flex-shrink-0">
          <div>
            <h1 className="text-[24px] font-semibold text-white">Performance Insights</h1>
            <p className="text-[14px] text-[#94A3B8]">AI analysis of your ads</p>
          </div>
          <div className="flex bg-[#1E293B] p-1 rounded-xl border border-[#334155]">
            {(['Overview', 'Audience', 'Creative', 'Budget'] as InsightTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab 
                  ? 'bg-[#8B5CF6] text-white shadow-lg' 
                  : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* SCROLLABLE FEED */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[800px] mx-auto space-y-4">
            {activeTab === 'Overview' && (
              <>
                <InsightCard 
                  type="Budget Opportunity"
                  icon={<DollarSign size={18} />}
                  priority="Medium"
                  title="Untapped Audience"
                  border="border-l-[#10B981]"
                  find="Your best audience (past buyers) is making 5.2x return but only getting 4% of your budget."
                  why="You're limiting your best performing ads from reaching more people."
                  suggest="Switch to automatic bidding for this audience."
                  impact="+$1,400 per month"
                  confidence="92%"
                  buttonText="Switch to Auto Bidding →"
                />

                <InsightCard 
                  type="Cost Alert"
                  icon={<AlertTriangle size={18} />}
                  priority="High"
                  title="Meta Costs Increasing"
                  border="border-l-[#EF4444]"
                  find="Meta cost per purchase up 24% vs last week. Google costs down 18%."
                  why="Meta is getting saturated at your current spend level."
                  suggest="Move $150 per day from Meta to Google."
                  impact="+0.6x return boost"
                  confidence="86%"
                  buttonText="Move Budget →"
                />

                <InsightCard 
                  type="Creative Watch"
                  icon={<Eye size={18} />}
                  priority="Low"
                  title="Ad Fatigue Detected"
                  border="border-l-[#F59E0B]"
                  find="Your \"Summer Sale\" ad click rate down 15% over the past week."
                  why="People may be getting tired of seeing the same ad."
                  suggest="Generate 3 new ad variations to test."
                  impact="+12% click rate"
                  confidence="78%"
                  buttonText="Generate Variations →"
                />
              </>
            )}

            {activeTab === 'Audience' && <AudienceTabView />}
            {activeTab === 'Creative' && <CreativeTabView />}
            {activeTab === 'Budget' && <BudgetTabView />}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR (300px) */}
      <aside className="w-[300px] bg-[#0F172A] p-8 flex flex-col gap-10 flex-shrink-0">
        <section className="space-y-6">
          <h3 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-widest">Recent Activity</h3>
          <div className="space-y-6">
            <ActivityItem time="2h ago" text="Budget rebalanced from Meta to Google" />
            <ActivityItem time="5h ago" text="New creative variations generated" />
            <ActivityItem time="1d ago" text="Campaign 'Summer Sale' paused by rule" />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-widest">Performance Trend</h3>
          <div className="h-20 w-full bg-[#1E293B] rounded-xl border border-[#334155] p-3 overflow-hidden relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData.map((v, i) => ({ v, i }))}>
                <Area type="monotone" dataKey="v" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-[#94A3B8] font-medium">Last 7 days performance</p>
        </section>

        <section className="p-6 bg-[#1E293B] rounded-[24px] border border-[#334155] text-center space-y-2">
          <h3 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-widest">AI Confidence</h3>
          <div className="text-[48px] font-bold text-white tracking-tight leading-none">85%</div>
          <p className="text-[11px] text-[#94A3B8] font-medium">Average across all insights</p>
        </section>
      </aside>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const InsightCard = ({ type, icon, priority, title, border, find, why, suggest, impact, confidence, buttonText }: any) => {
  const priorityColor = priority === 'High' ? 'text-[#EF4444]' : priority === 'Medium' ? 'text-[#10B981]' : 'text-[#94A3B8]';

  return (
    <div className={`bg-[#1E293B] border border-[#334155] border-l-4 ${border} rounded-xl p-6 space-y-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${priorityColor} text-[12px] font-bold`}>
          {icon} <span>{type}</span>
        </div>
        <div className={`text-[10px] font-bold uppercase tracking-widest ${priorityColor} bg-white/5 px-2 py-0.5 rounded border border-current opacity-60`}>
          Priority: {priority}
        </div>
      </div>

      <h2 className="text-[18px] font-bold text-white">{title}</h2>

      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">What we found:</p>
          <p className="text-[14px] text-white leading-relaxed">{find}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">Why this matters:</p>
          <p className="text-[14px] text-[#94A3B8] leading-relaxed italic">{why}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">Suggested action:</p>
          <p className="text-[14px] text-[#F8FAFC] leading-relaxed font-medium">{suggest}</p>
        </div>
      </div>

      <button className="bg-[#8B5CF6] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#7C3AED] transition-all">
        {buttonText}
      </button>

      <div className="pt-4 border-t border-[#334155] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase">Potential impact:</span>
          <span className="text-[13px] font-bold text-[#10B981]">{impact}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase">AI confidence:</span>
          <span className="text-[13px] font-bold text-white">{confidence}</span>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ time, text }: { time: string, text: string }) => (
  <div className="flex gap-4">
    <div className="w-2 h-2 rounded-full bg-[#8B5CF6] mt-1.5 flex-shrink-0" />
    <div className="space-y-0.5">
      <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest">{time}</p>
      <p className="text-[12px] text-[#94A3B8] leading-snug">{text}</p>
    </div>
  </div>
);

const AudienceTabView = () => (
  <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-[#334155] bg-white/5">
          <th className="px-6 py-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Audience</th>
          <th className="px-6 py-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Spent</th>
          <th className="px-6 py-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Purchases</th>
          <th className="px-6 py-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Return</th>
          <th className="px-6 py-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Trend</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#334155]">
        <AudienceRow name="Past Buyers (30d)" spent="$420" sales="24" roas="5.2x" trend="+14%" />
        <AudienceRow name="Add to Cart (L7d)" spent="$850" sales="18" roas="3.1x" trend="-4%" />
        <AudienceRow name="Lookalike 1% Meta" spent="$1,200" sales="42" roas="4.8x" trend="+22%" />
      </tbody>
    </table>
  </div>
);

const AudienceRow = ({ name, spent, sales, roas, trend }: any) => (
  <tr className="hover:bg-white/2 transition-colors">
    <td className="px-6 py-4 text-sm font-semibold text-white">{name}</td>
    <td className="px-6 py-4 text-sm text-[#94A3B8]">{spent}</td>
    <td className="px-6 py-4 text-sm text-[#94A3B8]">{sales}</td>
    <td className="px-6 py-4 text-sm font-bold text-[#10B981]">{roas}</td>
    <td className={`px-6 py-4 text-xs font-bold text-right ${trend.includes('+') ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{trend}</td>
  </tr>
);

const CreativeTabView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div className="p-6 bg-[#1E293B] border border-[#334155] rounded-xl space-y-4">
        <div className="flex items-center gap-2 text-[#EF4444]">
          <AlertCircle size={18} />
          <h4 className="text-xs font-bold uppercase tracking-widest">Fatigue Warnings</h4>
        </div>
        <div className="space-y-3">
          <FatigueItem name="Summer Hero Video" status="Declining" />
          <FatigueItem name="Static_Product_V1" status="Critical" />
        </div>
      </div>
      <div className="p-6 bg-[#1E293B] border border-[#334155] rounded-xl space-y-4">
        <div className="flex items-center gap-2 text-[#10B981]">
          <TrendingUp size={18} />
          <h4 className="text-xs font-bold uppercase tracking-widest">Top Performers</h4>
        </div>
        <div className="space-y-3">
          <FatigueItem name="UGC_Hook_Test_B" status="Optimal" />
          <FatigueItem name="Customer_Review_Grid" status="Optimal" />
        </div>
      </div>
    </div>
    <div className="p-8 bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 rounded-xl flex items-center justify-between">
      <div className="space-y-1">
        <h4 className="text-lg font-bold text-white">Suggested tests</h4>
        <p className="text-sm text-[#94A3B8]">AI identified a gap in your creative mix.</p>
      </div>
      <button className="bg-[#8B5CF6] text-white px-6 py-2 rounded-lg font-bold text-sm">
        Start New Test
      </button>
    </div>
  </div>
);

const FatigueItem = ({ name, status }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-[#F8FAFC]">{name}</span>
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
      status === 'Optimal' ? 'text-[#10B981] bg-[#10B981]/10' : 
      status === 'Declining' ? 'text-[#F59E0B] bg-[#F59E0B]/10' : 
      'text-[#EF4444] bg-[#EF4444]/10'
    }`}>
      {status}
    </span>
  </div>
);

const BudgetTabView = () => (
  <div className="space-y-6">
    <div className="p-6 bg-[#1E293B] border border-[#334155] rounded-xl space-y-6">
      <h4 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-widest">Platform Rebalancing</h4>
      <div className="space-y-8">
        <RebalanceRow platform="Meta" current="$450/day" target="$300/day" action="Decrease" />
        <RebalanceRow platform="Google" current="$200/day" target="$350/day" action="Increase" />
      </div>
    </div>
    <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 p-6 rounded-xl space-y-4">
      <div className="flex items-center gap-2 text-[#EF4444]">
        <AlertTriangle size={18} />
        <h4 className="text-xs font-bold uppercase tracking-widest">Waste Identification</h4>
      </div>
      <p className="text-sm text-[#94A3B8]">We found 2 campaigns spending budget with 0 sales in the last 72 hours.</p>
      <button className="text-sm font-bold text-[#EF4444] hover:underline">Pause Wasteful Ads →</button>
    </div>
  </div>
);

const RebalanceRow = ({ platform, current, target, action }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center font-bold">{platform[0]}</div>
      <div>
        <p className="text-sm font-bold text-white">{platform}</p>
        <p className="text-[11px] text-[#94A3B8]">Current: {current}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">{action} to</p>
      <p className="text-lg font-bold text-white">{target}</p>
    </div>
  </div>
);

export default InsightsModule;

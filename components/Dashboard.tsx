
import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  LineChart, Line
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Check, AlertTriangle, Sparkles, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

// Aliasing motion components to bypass broken TypeScript definitions in this environment
const MotionDiv = (motion as any).div;

// Mock data for charts
const performanceData = [
  { date: 'Mon', revenue: 4000, spend: 2400 },
  { date: 'Tue', revenue: 3000, spend: 1398 },
  { date: 'Wed', revenue: 2000, spend: 9800 },
  { date: 'Thu', revenue: 2780, spend: 3908 },
  { date: 'Fri', revenue: 1890, spend: 4800 },
  { date: 'Sat', revenue: 2390, spend: 3800 },
  { date: 'Sun', revenue: 3490, spend: 4300 },
];

const sparkData = [
  { v: 10 }, { v: 15 }, { v: 12 }, { v: 20 }, { v: 18 }, { v: 25 }, { v: 22 }
];

const Dashboard: React.FC = () => {
  return (
    <div className="bg-[#0F172A] min-h-screen p-6 text-[#F8FAFC] font-sans transition-colors duration-300">
      {/* HEADER SECTION */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">ZieAds</span>
          <h1 className="text-[24px] font-semibold text-white">Command Center</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#1E293B] border border-[#334155] rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[12px] font-medium text-[#94A3B8]">Live</span>
          </div>
          <button className="bg-[#8B5CF6] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#7C3AED] transition-all">
            Apply Recommendations
          </button>
        </div>
      </header>

      {/* TOP CARD: PERFORMANCE OVERVIEW */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 mb-4 grid grid-cols-1 lg:grid-cols-[35%_65%] gap-8">
        {/* LEFT COLUMN: Main Score */}
        <div className="flex flex-col justify-center border-r border-[#334155]/50 pr-8">
          <div className="text-[72px] font-bold text-white leading-none mb-2">82</div>
          <div className="flex items-center gap-1.5 text-[#10B981] text-[14px] font-medium mb-4">
            <TrendingUp size={16} /> +14.5% vs last week
          </div>
          <div className="h-12 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <Area type="monotone" dataKey="v" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 bg-[#0F172A]/50 rounded-lg border border-[#334155]/30">
            <p className="text-[14px] text-[#94A3B8] italic leading-relaxed">
              "Up 18% from Google Search and Video Hook #4"
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Actionable Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* What's Working */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#10B981] text-[16px] font-semibold">
              <Check size={18} /> What's Working
            </div>
            <ul className="space-y-3">
              <InsightListItem text="Meta ROAS up 22% from Shopping" />
              <InsightListItem text="Google cost at lowest: $12.40" />
              <InsightListItem text="New video hook at 4.2x ROAS" />
            </ul>
          </div>

          {/* Watch Out */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#F59E0B] text-[16px] font-semibold">
              <AlertTriangle size={18} /> Watch Out
            </div>
            <ul className="space-y-3">
              <InsightListItem text="Retargeting audience saturated" />
              <InsightListItem text="TikTok CPM up 18% in 24 hours" />
              <InsightListItem text="Campaign A returns dropping" />
            </ul>
          </div>

          {/* AI Suggestions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#8B5CF6] text-[16px] font-semibold">
              <Sparkles size={18} /> AI Suggestions
            </div>
            <div className="space-y-3">
              <SuggestionAction text="Scale Meta Winner #1 by 20%" />
              <SuggestionAction text="Rotate tired UGC creative" />
              <SuggestionAction text="Fix tracking issue" />
            </div>
          </div>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <MetricCard label="Total Spend" value="$12,450.80" trend="+14.2%" />
        <MetricCard label="Revenue" value="$42,890.30" trend="+22.5%" />
        <MetricCard label="Return on Ad Spend" value="3.44x" trend="+0.4%" />
        <MetricCard label="Cost Per Purchase" value="$2.15" trend="-12%" isInverse />
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4">
        {/* Revenue vs Spend Chart */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[16px] font-semibold text-white">Revenue vs Spend</h3>
            <div className="flex items-center gap-1 bg-[#0F172A] p-1 rounded-lg border border-[#334155]">
              <ChartToggle label="7 days" active />
              <ChartToggle label="30 days" />
              <ChartToggle label="90 days" />
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis dataKey="date" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="spend" stroke="#475569" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Split */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <h3 className="text-[16px] font-semibold text-white mb-8">Budget by Platform</h3>
          <div className="space-y-8">
            <BudgetBar label="Meta" percentage={55} amount="$6,800" roas="3.2x" color="#3B82F6" />
            <BudgetBar label="Google" percentage={30} amount="$3,700" roas="2.8x" color="#EF4444" />
            <BudgetBar label="TikTok" percentage={15} amount="$1,900" roas="4.1x" color="#000000" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const InsightListItem = ({ text }: { text: string }) => (
  <li className="text-[13px] text-[#94A3B8] flex items-start gap-2 leading-tight">
    <span className="text-[#334155] mt-1">•</span> {text}
  </li>
);

const SuggestionAction = ({ text }: { text: string }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[13px] text-[#94A3B8] leading-tight flex-1">{text}</span>
    <button className="px-3 py-1.5 border border-[#8B5CF6] text-[#8B5CF6] rounded-md text-[11px] font-bold whitespace-nowrap hover:bg-[#8B5CF6] hover:text-white transition-all">
      Do it
    </button>
  </div>
);

const MetricCard = ({ label, value, trend, isInverse }: any) => {
  const isPositive = trend.includes('+');
  const colorClass = (isPositive && !isInverse) || (!isPositive && isInverse) ? 'text-[#10B981]' : 'text-white';

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col justify-between h-[120px] shadow-sm">
      <div className="text-[28px] font-bold text-white leading-none">{value}</div>
      <div>
        <div className={`text-[14px] font-medium ${colorClass} mb-1`}>{trend}</div>
        <div className="text-[12px] text-[#94A3B8] uppercase tracking-wider font-medium">{label}</div>
      </div>
    </div>
  );
};

const ChartToggle = ({ label, active }: any) => (
  <button className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${active ? 'bg-[#1E293B] text-white shadow-sm' : 'text-[#475569] hover:text-[#94A3B8]'}`}>
    {label}
  </button>
);

const BudgetBar = ({ label, percentage, amount, roas, color }: any) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-[13px]">
      <div className="flex items-center gap-2">
        <span className="font-bold text-white">{label}</span>
        <span className="text-[#94A3B8]">{percentage}% ({amount})</span>
      </div>
      <span className="font-bold text-[#10B981]">{roas}</span>
    </div>
    <div className="h-2 w-full bg-[#0F172A] rounded-full overflow-hidden">
      <MotionDiv 
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full" 
        style={{ backgroundColor: color }} 
      />
    </div>
  </div>
);

export default Dashboard;

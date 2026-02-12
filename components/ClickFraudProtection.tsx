
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Info, 
  Ban, 
  RefreshCw, 
  ExternalLink,
  Zap,
  Fingerprint,
  Globe,
  Loader2,
  Code2,
  Copy,
  CheckCircle2,
  MousePointerClick,
  Clock
} from 'lucide-react';
import { ClickLog, FraudSummary, Platform } from '../types';
import { fetchClickLogs, fetchFraudSummary } from '../services/dbService';

const ClickFraudProtection: React.FC = () => {
  const [logs, setLogs] = useState<ClickLog[]>([]);
  const [summary, setSummary] = useState<FraudSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [logsData, summaryData] = await Promise.all([
          fetchClickLogs('current_business'),
          fetchFraudSummary('current_business')
        ]);
        setLogs(logsData);
        setSummary(summaryData);
      } catch (e) {
        console.error("Error loading fraud data:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  const copyScript = () => {
    const script = `<script src="https://cdn.zieads.com/tracker.js" data-id="ZA-8821-X" async></script>`;
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !summary) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 space-y-4 font-sans bg-slate-50 dark:bg-slate-950 transition-colors">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-slate-400 dark:text-slate-500 font-bold tracking-tight text-sm">Syncing threat intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl tosca-bg flex items-center justify-center text-white shadow-2xl shadow-teal-500/30">
             <ShieldAlert size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight leading-none mb-1 transition-colors">Click fraud protection</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Monitoring device fingerprints and behavioral patterns 24/7.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
          >
             <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} /> 
             {syncing ? 'Syncing...' : 'Sync blocks'}
          </button>
          <button className="px-6 py-2.5 tosca-bg text-white rounded-xl text-sm font-bold shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all">
             Global settings
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricBox 
          label="Scanned clicks" 
          value={summary.totalScannedClicks.toLocaleString()} 
          color="#1E293B" 
          icon={<Globe size={18} />}
        />
        <MetricBox 
          label="Fraud blocked" 
          value={summary.totalFraudBlocked.toLocaleString()} 
          color="#EF4444" 
          icon={<Ban size={18} />}
        />
        <MetricBox 
          label="Excluded IPs" 
          value={summary.excludedIpsCount.toLocaleString()} 
          color="#F97316" 
          icon={<Fingerprint size={18} />}
        />
        <MetricBox 
          label="Money saved" 
          value={`$${summary.moneySaved.toLocaleString()}`} 
          color="#14B8A6" 
          icon={<Zap size={18} />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Recent History Table */}
         <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors">
            <div className="p-7 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display tracking-tight transition-colors">Recent click logs</h3>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-500/10 rounded-full border border-green-100 dark:border-green-500/20 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[11px] font-bold text-green-700 dark:text-green-400 tracking-tight">Live behavioral analysis</span>
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-bold tracking-tight text-slate-400 dark:text-slate-500">
                     <tr>
                        <th className="px-7 py-4">Threat type</th>
                        <th className="px-7 py-4">IP Address</th>
                        <th className="px-7 py-4">Platform</th>
                        <th className="px-7 py-4">Detected</th>
                        <th className="px-7 py-4"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                     {logs.map(log => (
                        <tr key={log.id} className="text-[13px] font-medium hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                           <td className="px-7 py-5">
                              <span className="flex items-center gap-2.5 font-bold text-slate-700 dark:text-slate-300 font-display">
                                 <div className={`w-2 h-2 rounded-full ${log.threatType === 'Bot Behavior' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                                 {log.threatType}
                              </span>
                           </td>
                           <td className="px-7 py-5 text-slate-500 dark:text-slate-400 font-mono tracking-tight">{log.ipAddress}</td>
                           <td className="px-7 py-5">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-tight transition-colors">
                                 {log.platform}
                              </span>
                           </td>
                           <td className="px-7 py-5 text-slate-400 dark:text-slate-500">{log.timestamp}</td>
                           <td className="px-7 py-5 text-right">
                              <button className="p-2 rounded-lg text-slate-300 dark:text-slate-600 hover:text-primary dark:hover:text-teal-400 transition-all">
                                 <ExternalLink size={16} />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            <div className="mt-auto p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-center transition-colors">
               <button className="text-[12px] font-bold text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-teal-400 transition-colors tracking-tight">View deep analysis report</button>
            </div>
         </div>

         <div className="space-y-6">
            {/* Tracking Script Onboarding */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-primary dark:text-teal-400 flex items-center justify-center">
                  <Code2 size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display transition-colors">Install tracking code</h3>
              </div>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Paste this script into the <code>&lt;head&gt;</code> of your website to enable sidik jari perangkat and behavioral monitoring.
              </p>
              <div className="relative group">
                <div className="w-full bg-slate-900 dark:bg-slate-950 text-teal-400 p-5 rounded-2xl font-mono text-[11px] break-all border border-slate-800 dark:border-slate-800 leading-relaxed group-hover:bg-slate-800 dark:group-hover:bg-slate-900 transition-colors">
                  &lt;script src="https://cdn.zieads.com/tracker.js" data-id="ZA-8821-X" async&gt;&lt;/script&gt;
                </div>
                <button 
                  onClick={copyScript}
                  className="absolute top-3 right-3 p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all active:scale-95"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCircle2 size={16} className="text-teal-400" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                <CheckCircle2 size={12} className="text-green-500 dark:text-green-400" />
                <span>Device Fingerprinting enabled</span>
              </div>
            </div>

            {/* Automated Exclusions Card */}
            <div className="bg-slate-900 dark:bg-slate-950 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20 transition-colors">
               <div className="absolute top-0 right-0 w-32 h-32 tosca-bg/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
               <ShieldCheck className="text-teal-400 mb-6 group-hover:rotate-6 transition-transform" size={40} />
               <h3 className="text-xl font-bold mb-3 font-display tracking-tight transition-colors">Automated exclusion sync</h3>
               <p className="text-[13px] text-slate-400 leading-relaxed mb-8 font-medium transition-colors">Flagged IPs are automatically synced to Meta 'ip_exclusions' and Google 'IpBlock' lists every 15 minutes.</p>
               
               <div className="space-y-4 pt-6 border-t border-white/10 font-sans">
                  <div className="flex justify-between items-center text-[12px] font-bold">
                     <span className="text-slate-500">Exclusion status</span>
                     <div className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                        <span>Active & Healthy</span>
                     </div>
                  </div>
                  <div className="flex justify-between items-center text-[12px] font-bold">
                     <span className="text-slate-500">Last 15m sync</span>
                     <span className="text-teal-400 font-display transition-colors">Just now</span>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 rounded-[32px] border border-slate-200 dark:border-slate-800 border-dashed relative group hover:bg-white dark:hover:bg-slate-900 transition-all">
               <div className="flex items-center gap-3 mb-4 text-slate-900 dark:text-white font-bold font-display transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-blue-500 dark:text-blue-400 flex items-center justify-center">
                     <Info size={18} />
                  </div>
                  <h4 className="tracking-tight">Threat thresholds</h4>
               </div>
               <div className="space-y-4">
                 <ThresholdItem icon={<Clock size={14}/>} label="Repeated click" value="> 3 clicks in 60s" />
                 <ThresholdItem icon={<MousePointerClick size={14}/>} label="Bot behavior" value="Headless signature" />
                 <ThresholdItem icon={<ShieldCheck size={14}/>} label="Proxy/VPN" value="Known datacenter IPs" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const ThresholdItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center justify-between text-[11px]">
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold tracking-tight transition-colors">
      {icon} {label}
    </div>
    <span className="text-slate-900 dark:text-slate-200 font-bold font-display transition-colors">{value}</span>
  </div>
);

interface MetricBoxProps {
  label: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}

const MetricBox: React.FC<MetricBoxProps> = ({ label, value, color, icon }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-7 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:shadow-xl transition-all duration-500 overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-1.5 h-full opacity-0 group-hover:opacity-100 transition-opacity" 
        style={{ backgroundColor: color }}
      ></div>
      <div className="flex items-center justify-between mb-5">
         <p className="text-[12px] font-bold text-slate-400 dark:text-slate-500 tracking-tight font-sans uppercase opacity-60 transition-colors">{label}</p>
         <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
            style={{ backgroundColor: `${color}10`, color: color }}
         >
            {icon}
         </div>
      </div>
      <p className="text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white group-hover:translate-x-1 transition-all duration-300">{value}</p>
      <div 
        className="mt-5 h-1 w-12 rounded-full opacity-20" 
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
};

export default ClickFraudProtection;


import React from 'react';
import { ShieldAlert, ShieldCheck, Info, Ban, RefreshCw, ExternalLink } from 'lucide-react';

const ClickFraudProtection: React.FC = () => {
  const stats = {
    scanned: 14534,
    blocked: 1451,
    ips: 491,
    saved: 748
  };

  const logs = [
    { id: 1, type: 'Bot Behavior', ip: '192.168.1.45', time: '2 mins ago', platform: 'Meta' },
    { id: 2, type: 'Suspicious IP', ip: '45.12.8.192', time: '14 mins ago', platform: 'Google' },
    { id: 3, type: 'Repeated Click', ip: '88.192.34.11', time: '1 hour ago', platform: 'TikTok' },
    { id: 4, type: 'Proxy/VPN', ip: '2.100.45.12', time: '3 hours ago', platform: 'Meta' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl tosca-bg flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
             <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Click Fraud Protection</h1>
            <p className="text-slate-500">AI is monitoring your campaigns 24/7 for suspicious activity.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
             <RefreshCw size={16} /> Sync Blocks
          </button>
          <button className="px-4 py-2 tosca-bg text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20">
             Settings
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricBox label="Scanned Clicks" value={stats.scanned.toLocaleString()} color="blue" />
        <MetricBox label="Fraud Blocked" value={stats.blocked.toLocaleString()} color="red" />
        <MetricBox label="Excluded IPs" value={stats.ips.toLocaleString()} color="orange" />
        <MetricBox label="Money Saved" value={`$${stats.saved}`} color="green" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
         <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
               <h3 className="font-bold text-slate-800">Recent Block History</h3>
               <span className="text-xs font-bold text-primary bg-teal-50 px-3 py-1 rounded-full">Real-time</span>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <tr>
                        <th className="px-6 py-4">Threat Type</th>
                        <th className="px-6 py-4">IP Address</th>
                        <th className="px-6 py-4">Platform</th>
                        <th className="px-6 py-4">Time</th>
                        <th className="px-6 py-4"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {logs.map(log => (
                        <tr key={log.id} className="text-xs hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4">
                              <span className="flex items-center gap-2 font-bold text-slate-700">
                                 <Ban size={12} className="text-red-500" /> {log.type}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-slate-500 font-mono">{log.ip}</td>
                           <td className="px-6 py-4 font-bold text-slate-700">{log.platform}</td>
                           <td className="px-6 py-4 text-slate-400">{log.time}</td>
                           <td className="px-6 py-4 text-right">
                              <button className="text-slate-300 hover:text-primary"><ExternalLink size={14} /></button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white">
               <ShieldCheck className="text-teal-400 mb-4" size={32} />
               <h3 className="text-xl font-bold mb-2">Automated Exclusions</h3>
               <p className="text-sm text-slate-400 leading-relaxed mb-6">Our AI automatically pushes blocked IPs and device fingerprints to your Meta & Google ad account exclusion lists every 15 minutes.</p>
               <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-500">Last Sync:</span>
                     <span className="font-bold text-teal-400">Just Now</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-500">Sync Status:</span>
                     <span className="font-bold text-green-400">Healthy</span>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-slate-200">
               <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
                  <Info size={18} className="text-blue-500" />
                  <h4>How it works</h4>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed">We analyze incoming traffic patterns and block clicks that show non-human behavior, repeated attempts from the same IP, or traffic from known malicious VPN networks.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

const MetricBox = ({ label, value, color }: { label: string, value: string, color: string }) => {
   const colors: any = {
      blue: 'text-blue-600 bg-blue-50',
      red: 'text-red-600 bg-red-50',
      orange: 'text-orange-600 bg-orange-50',
      green: 'text-green-600 bg-green-50'
   };
   return (
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
         <p className={`text-2xl font-black ${colors[color].split(' ')[0]}`}>{value}</p>
         <div className={`mt-2 h-1 w-12 rounded-full ${colors[color].split(' ')[1].replace('bg-', 'bg-')}`}></div>
      </div>
   );
};

export default ClickFraudProtection;

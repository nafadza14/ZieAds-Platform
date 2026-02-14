
import React from 'react';
import { 
  FolderKanban, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpRight,
  Plus,
  Play,
  Pause,
  Trash2,
  ExternalLink,
  Target,
  MousePointer2,
  TrendingUp
} from 'lucide-react';
import { Business, Campaign, Platform } from '../types';
import { useNavigate } from 'react-router-dom';

interface MyProjectsProps {
  activeBusiness: Business | null;
}

const MyProjects: React.FC<MyProjectsProps> = ({ activeBusiness }) => {
  const navigate = useNavigate();
  const campaigns = activeBusiness?.campaigns || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight leading-none mb-1 transition-colors">My projects</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm transition-colors">
            Managing <span className="font-bold text-primary">{campaigns.length}</span> active campaigns for {activeBusiness?.name}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/builder')}
            className="px-8 py-3 tosca-bg text-white font-bold rounded-2xl shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> New campaign
          </button>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by campaign name or ID..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Filter size={14} /> Filter
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-bold tracking-tight text-slate-400 dark:text-slate-500 transition-colors">
                <th className="px-8 py-5">Campaign node</th>
                <th className="px-8 py-5">Objective</th>
                <th className="px-8 py-5">Budget protocol</th>
                <th className="px-8 py-5">Real-time roas</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 tabular-nums">
              {campaigns.length > 0 ? campaigns.map((c) => (
                <tr key={c.id} className="group text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white tracking-tight transition-colors">{c.name}</p>
                      <div className="flex gap-1.5">
                        {c.platforms.map(p => (
                          <span key={p} className="px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-[10px] font-bold text-primary dark:text-teal-400 border border-teal-100 dark:border-teal-500/20">{p}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className="text-slate-600 dark:text-slate-400 font-medium">{c.objective}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-0.5">
                      <p className="text-slate-900 dark:text-white font-bold tracking-tight">${c.budget.toLocaleString()}/day</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Spend: ${c.metrics?.spend || 0}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2">
                        <span className="text-primary dark:text-teal-400 font-black text-base">{c.metrics?.roas || 0}x</span>
                        <TrendingUp size={14} className="text-green-500" />
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold ${
                       c.status === 'active' 
                       ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20' 
                       : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                     }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                        <span className="capitalize">{c.status}</span>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary dark:hover:text-teal-400 shadow-sm transition-all">
                          {c.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                       </button>
                       <button className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary dark:hover:text-teal-400 shadow-sm transition-all">
                          <ExternalLink size={16} />
                       </button>
                       <button className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 shadow-sm transition-all">
                          <Trash2 size={16} />
                       </button>
                    </div>
                    <MoreHorizontal className="text-slate-300 dark:text-slate-600 group-hover:hidden mx-auto md:mr-0 md:ml-auto" />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center space-y-4 transition-colors">
                     <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto text-slate-200 dark:text-slate-700">
                        <FolderKanban size={32} />
                     </div>
                     <div className="space-y-1">
                        <p className="text-slate-900 dark:text-white font-bold text-lg">No projects detected</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Initialize your first campaign to begin monitoring growth signals.</p>
                     </div>
                     <button 
                      onClick={() => navigate('/builder')}
                      className="px-6 py-2.5 tosca-bg text-white font-bold rounded-xl text-sm"
                     >
                       Launch project
                     </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Health Summary */}
      <div className="grid md:grid-cols-3 gap-6">
         <HealthCard 
            title="Ad reach efficiency" 
            value="Optimal" 
            icon={<Target className="text-blue-500" size={20} />} 
            desc="Algorithms are successfully reaching high-intent cohorts."
         />
         <HealthCard 
            title="Neural link stability" 
            value="99.9%" 
            icon={<TrendingUp className="text-teal-500" size={20} />} 
            desc="API synchronization with ad platforms is performing at peak."
         />
         <HealthCard 
            title="Conversion velocity" 
            value="High" 
            icon={<MousePointer2 className="text-primary" size={20} />} 
            desc="Landing pages are maintaining a consistent conversion rate."
         />
      </div>
    </div>
  );
};

const HealthCard = ({ title, value, icon, desc }: { title: string, value: string, icon: React.ReactNode, desc: string }) => (
  <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors group">
     <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
           {icon}
        </div>
        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</span>
     </div>
     <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
     <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default MyProjects;

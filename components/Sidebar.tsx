
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  PlusCircle, 
  Settings, 
  LogOut,
  Target,
  ShieldAlert,
  Building2,
  ChevronDown,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { Business } from '../types';

interface SidebarProps {
  onLogout: () => void;
  activeBusiness: Business | null;
  businesses: Business[];
  onSwitchBusiness: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, activeBusiness, businesses, onSwitchBusiness }) => {
  const navItems = [
    { to: '/builder', icon: PlusCircle, label: 'Create an ad' },
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/accounts', icon: UserCheck, label: 'Ad accounts' },
    { to: '/fraud', icon: ShieldAlert, label: 'Click fraud protection' },
    { to: '/businesses', icon: Building2, label: 'Businesses' },
    { to: '/scanner', icon: Globe, label: 'Website scanner' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex font-sans transition-colors">
      <div className="p-7">
        <div className="flex items-center gap-2 mb-8 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl tosca-bg flex items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Target size={20} fill="currentColor" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-white font-display leading-none transition-colors">ZieAds</span>
        </div>

        {/* Business Selector */}
        <div className="relative group">
          <button className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-6 h-6 rounded-lg tosca-bg flex-shrink-0 shadow-sm"></div>
              <span className="text-[13px] font-semibold text-[#111827] dark:text-slate-200 truncate tracking-tight">{activeBusiness?.name || 'Select business'}</span>
            </div>
            <ChevronDown size={14} className="text-[#9CA3AF] dark:text-slate-500" />
          </button>
          
          <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] rounded-[20px] py-2 invisible group-hover:visible z-50 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
            {businesses.map(b => (
              <button 
                key={b.id} 
                onClick={() => onSwitchBusiness(b.id)}
                className="w-full text-left px-5 py-2.5 text-[13px] font-medium text-[#4B5563] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-teal-400 transition-colors"
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-[14px] font-medium tracking-tight ${
                isActive 
                  ? 'bg-teal-50 dark:bg-teal-500/10 text-primary dark:text-teal-400 font-semibold' 
                  : 'text-[#4B5563] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#111827] dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={19} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-primary dark:text-teal-400' : 'text-[#9CA3AF] dark:text-slate-500'} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-5 border-t border-slate-100 dark:border-slate-800">
        <div className="mb-4 px-4 py-4 bg-[#111827] dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 transition-colors">
           <p className="text-[10px] font-bold text-teal-400 tracking-wider mb-1 uppercase">Current plan</p>
           <p className="text-sm text-white font-semibold mb-3 tracking-tight">Growth plan</p>
           <button className="text-[11px] font-bold text-white bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2">
             Upgrade now <ArrowRight size={12} />
           </button>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-[#6B7280] dark:text-slate-400 text-[14px] font-medium tracking-tight hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
        >
          <LogOut size={19} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  PlusCircle, 
  Settings, 
  LogOut,
  Zap,
  ShieldAlert,
  Building2,
  ChevronDown
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
    { to: '/builder', icon: PlusCircle, label: 'Create an Ad' },
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/fraud', icon: ShieldAlert, label: 'Click Fraud Protection' },
    { to: '/businesses', icon: Building2, label: 'Businesses' },
    { to: '/scanner', icon: Globe, label: 'Website Scanner' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg tosca-bg flex items-center justify-center text-white">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">ZieAds</span>
        </div>

        {/* Business Selector */}
        <div className="relative group">
          <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-md tosca-bg flex-shrink-0"></div>
              <span className="text-sm font-bold text-slate-700 truncate">{activeBusiness?.name || 'Select Business'}</span>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          
          <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 shadow-xl rounded-xl py-2 invisible group-hover:visible z-50">
            {businesses.map(b => (
              <button 
                key={b.id} 
                onClick={() => onSwitchBusiness(b.id)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
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
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-teal-50 text-primary font-bold' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="mb-4 px-3 py-2 bg-slate-900 rounded-xl">
           <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-1">Current Plan</p>
           <p className="text-sm text-white font-bold mb-2">Growth Plan</p>
           <button className="text-[10px] font-black text-white hover:text-teal-400">UPGRADE NOW →</button>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

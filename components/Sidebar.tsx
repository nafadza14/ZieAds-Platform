
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  PlusCircle, 
  Settings, 
  LogOut,
  ShieldAlert,
  Building2,
  ChevronDown,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Users,
  Image as ImageIcon,
  CreditCard,
  BarChart3,
  Server
} from 'lucide-react';
import { Business } from '../types';

const LOGO_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgNTAiPgogIDxyZWN0IHg9IjYwIiB5PSI1IiB3aWR0aD0iOTUiIGhlaWdodD0iNDAiIGZpbGw9IiMxNEI4QTYiLz4KICA8dGV4dCB4PSIwIiB5PSIzOCIgZmlsbD0iIzE0QjhBNiIgc3R5bGU9ImZvbnQ6Ym9sZCAzOHB4ICdQbHVzIEpha2FydGEgU2FucycsIHNhbnMtc2VyaWYiPlppZTwvdGV4dD4KICA8dGV4dCB4PSI2NSIgeT0iMzgiIGZpbGw9IiNmZmZmZmYiIHN0eWxlPSJmb250OmJvbGQgMzhweCAnUGx1cyBKYWthcnRhIFNhbnMnLCBzYW5zLXNlcmlmIj5BZHMuPC90ZXh0Pgo8L3N2Zz4=";

interface SidebarProps {
  onLogout: () => void;
  activeBusiness: Business | null;
  businesses: Business[];
  onSwitchBusiness: (id: string) => void;
  userEmail?: string;
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, activeBusiness, businesses, onSwitchBusiness, userEmail, isAdmin = false }) => {
  const adminItems = [
    { to: '/', icon: Server, label: 'Command Center' },
    { to: '/library', icon: ImageIcon, label: 'Ad Library' },
    { to: '/users', icon: Users, label: 'Identities' },
    { to: '/revenue', icon: CreditCard, label: 'Capital Control' },
    { to: '/analytics', icon: BarChart3, label: 'Node Metrics' },
    { to: '/settings', icon: Settings, label: 'System Parameters' },
  ];

  const userItems = [
    { to: '/builder', icon: PlusCircle, label: 'Create an ad' },
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/accounts', icon: UserCheck, label: 'Ad accounts' },
    { to: '/fraud', icon: ShieldAlert, label: 'Click fraud protection' },
    { to: '/businesses', icon: Building2, label: 'Businesses' },
    { to: '/scanner', icon: Globe, label: 'Website scanner' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const navItems = isAdmin ? adminItems : userItems;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex font-sans transition-colors">
      <div className="p-7">
        <div className="flex items-center mb-8 group cursor-pointer">
          <img src={LOGO_URL} alt="ZieAds Logo" className="h-10 w-auto object-contain hover:scale-105 transition-transform" />
        </div>

        {isAdmin ? (
           <div className="p-4 rounded-2xl border border-teal-500/20 bg-teal-500/5 flex flex-col gap-1 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/5 rounded-full -mr-8 -mt-8"></div>
              <div className="flex items-center gap-2 relative z-10">
                <ShieldCheck className="text-primary" size={16} />
                <span className="text-[10px] font-black text-primary tracking-widest uppercase">Super Admin</span>
              </div>
              <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200 truncate tracking-tight relative z-10">ZieAds Control Plane</span>
           </div>
        ) : (
          <div className="relative group">
            <button className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-6 h-6 rounded-lg tosca-bg flex-shrink-0 shadow-sm"></div>
                <span className="text-[13px] font-semibold text-[#111827] dark:text-slate-200 truncate tracking-tight">{activeBusiness?.name || 'Select business'}</span>
              </div>
              <ChevronDown size={14} className="text-[#9CA3AF] dark:text-slate-500" />
            </button>
            
            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] rounded-[20px] py-2 invisible group-hover:visible z-50 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
              {businesses && businesses.filter(b => b !== null).map(b => (
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
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-[14px] font-medium tracking-tight ${
                isActive 
                  ? 'bg-teal-50 dark:bg-teal-500/10 text-primary dark:text-teal-400 font-semibold shadow-sm' 
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
        {!isAdmin && (
          <div className="mb-4 px-4 py-4 bg-[#111827] dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 transition-colors">
             <p className="text-[10px] font-bold text-teal-400 tracking-wider mb-1 uppercase">Current plan</p>
             <p className="text-sm text-white font-semibold mb-3 tracking-tight">Growth plan</p>
             <button className="text-[11px] font-bold text-white bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2">
               Upgrade now <ArrowRight size={12} />
             </button>
          </div>
        )}
        <div className="px-4 py-3 mb-2">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{userEmail}</p>
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

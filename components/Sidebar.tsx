import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Rocket, 
  Sparkles, 
  Zap, 
  BarChart3, 
  Share2, 
  Settings,
  LogOut,
  ChevronDown,
  Plus
} from 'lucide-react';
import { Workspace, AIInsight } from '../types';

const LOGO_MARK = (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#7C5CFF"/>
    <path d="M12 12H28L12 28H28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface SidebarProps {
  onLogout: () => void;
  activeWorkspace: Workspace | null;
  workspaces: Workspace[];
  onSwitchWorkspace: (id: string) => void;
  userEmail?: string;
  insights: AIInsight[];
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, activeWorkspace, workspaces = [], onSwitchWorkspace, userEmail, insights = [] }) => {
  const location = useLocation();
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const unresolvedCount = (insights || []).filter(i => i && !i.resolved).length;

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/" },
    { label: "Campaigns", icon: Rocket, to: "/campaigns" },
    { label: "Creatives", icon: Sparkles, to: "/creatives" },
    { label: "Automation", icon: Zap, to: "/automation" },
    { label: "Insights", icon: BarChart3, to: "/insights", badge: unresolvedCount > 0 ? unresolvedCount : undefined },
    { label: "Integrations", icon: Share2, to: "/integrations" },
    { label: "Settings", icon: Settings, to: "/settings" }
  ];

  return (
    <aside className="w-64 bg-[#0B0D10] border-r border-[#1F2329] flex flex-col hidden md:flex z-50">
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3 mb-8">
           {LOGO_MARK}
           <span className="text-xl font-bold tracking-tight text-white">ZieAds</span>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            className="w-full flex items-center justify-between p-2.5 bg-[#111318] border border-[#1F2329] rounded-xl hover:bg-[#1A1D23] transition-all"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#7C5CFF]/10 flex-shrink-0 flex items-center justify-center text-[#7C5CFF] font-bold text-xs">
                {activeWorkspace?.name?.charAt(0) || 'W'}
              </div>
              <span className="text-xs font-bold text-white truncate">
                {activeWorkspace?.name || 'Workspace'}
              </span>
            </div>
            <ChevronDown size={12} className={`text-slate-500 transition-transform ${isWorkspaceOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isWorkspaceOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#0B0D10] border border-[#1F2329] shadow-2xl rounded-xl py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="px-4 py-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Workspaces</p>
              {(workspaces || []).map(w => (
                <button 
                  key={w.id} 
                  onClick={() => { onSwitchWorkspace(w.id); setIsWorkspaceOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-3 transition-colors ${activeWorkspace?.id === w.id ? 'text-[#7C5CFF] bg-[#7C5CFF]/5' : 'text-slate-400 hover:bg-white/5'}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${activeWorkspace?.id === w.id ? 'bg-[#7C5CFF]' : 'bg-slate-700'}`}></div>
                  {w.name}
                </button>
              ))}
              <div className="h-px bg-[#1F2329] my-2"></div>
              <button className="w-full text-left px-4 py-2 text-xs font-bold text-[#7C5CFF] flex items-center gap-2 hover:bg-white/5">
                <Plus size={12} /> New Workspace
              </button>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
          
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-xs font-semibold ${
                isActive ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#7C5CFF] text-white text-[9px] font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1F2329] space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-[#1F2329]">
           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
              {userEmail?.charAt(0) || 'U'}
           </div>
           <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-white truncate">{userEmail?.split('@')[0] || 'User'}</span>
              <span className="text-[9px] font-bold text-slate-500 truncate">{userEmail}</span>
           </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-white transition-all text-xs font-semibold"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
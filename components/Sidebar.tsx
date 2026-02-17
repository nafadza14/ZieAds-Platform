
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
  <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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

  const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/", badge: "AI-First" },
    { label: "Campaigns", icon: Rocket, to: "/campaigns" },
    { label: "Creatives", icon: Sparkles, to: "/creatives" },
    { label: "Automation", icon: Zap, to: "/automation" },
    { label: "Insights", icon: BarChart3, to: "/insights", badge: unresolvedCount > 0 ? unresolvedCount : undefined },
    { label: "Integrations", icon: Share2, to: "/integrations" },
    { label: "Team & Settings", icon: Settings, to: "/settings" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-dark border-r border-slate-200 dark:border-white/5 flex flex-col hidden md:flex z-50 overflow-y-auto custom-scrollbar transition-colors">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 px-2">
           {LOGO_MARK}
           <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">ZieAds</span>
        </div>

        {/* Workspace Selector */}
        <div className="relative mb-8">
          <button 
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            className="w-full flex items-center justify-between p-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-6 h-6 rounded-md bg-accent/20 flex-shrink-0 flex items-center justify-center text-accent font-bold text-[10px]">
                {activeWorkspace?.name?.charAt(0) || 'W'}
              </div>
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white truncate">
                {activeWorkspace?.name || 'Workspace'}
              </span>
            </div>
            <ChevronDown size={14} className={`text-slate-400 dark:text-slate-600 transition-transform ${isWorkspaceOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isWorkspaceOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#111318] border border-slate-200 dark:border-white/5 shadow-2xl rounded-xl py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="px-4 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Your Workspaces</p>
              {(workspaces || []).map(w => (
                <button 
                  key={w.id} 
                  onClick={() => { onSwitchWorkspace(w.id); setIsWorkspaceOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[13px] font-medium flex items-center gap-3 transition-colors ${activeWorkspace?.id === w.id ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'}`}
                >
                  <div className={`w-1 h-1 rounded-full ${activeWorkspace?.id === w.id ? 'bg-accent' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                  {w.name}
                </button>
              ))}
              <div className="h-px bg-slate-100 dark:bg-white/5 my-2"></div>
              <button className="w-full text-left px-4 py-2 text-[13px] font-bold text-accent flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5">
                <Plus size={14} /> New Workspace
              </button>
            </div>
          )}
        </div>

        {/* Primary Navigation - Flat 7-item list */}
        <div className="space-y-1.5">
          {sidebarItems.map((item) => {
            const isActive = item.to === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.to);
            
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-[13px] font-medium ${
                  isActive ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-none' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-accent' : ''} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                    typeof item.badge === 'string' ? 'bg-accent/10 dark:bg-accent/20 text-accent' : 'bg-accent text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer Info / Logout */}
      <div className="mt-auto p-4 border-t border-slate-200 dark:border-white/5 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
           <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase border border-slate-300 dark:border-white/5">
              {userEmail?.charAt(0) || 'U'}
           </div>
           <div className="flex flex-col overflow-hidden">
              <span className="text-[12px] font-bold text-slate-900 dark:text-white truncate">{userEmail?.split('@')[0] || 'User'}</span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-600 truncate">{userEmail}</span>
           </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all text-[13px] font-medium"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

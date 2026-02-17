
import React, { useState, useEffect } from 'react';
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
  Building2,
  ChevronRight,
  ShieldAlert,
  Users,
  LineChart,
  Repeat,
  Target,
  Bell,
  Activity,
  CreditCard,
  Key,
  Plus
} from 'lucide-react';
import { Workspace, AIInsight } from '../types';

const LOGO_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMjAgMTAwIj4KICA8dGV4dCB4PSI1IiB5PSI3NSIgZmlsbD0iIzE0QjhBNiIgZm9udC1mYW1pbHk9IlBsdXMgSmFrYXJ0YSBTYW5zLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iODAwIiBmb250LXNpemU9IjcwIj5aaWU8L3RleHQ+CiAgPHJlY3QgeD0iMTE1IiB5PSIxNSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSI3NSIgZmlsbD0iIzE0QjhBNiIgLz4KICA8dGV4dCB4PSIxMjUiIHk4Ijc1IiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IlBsdXMgSmFrYXJ0YSBTYW5zLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iODAwIiBmb250LXNpemU9IjcwIj5BZHMuPC90ZXh0Pgo8L3N2Zz4=";

interface SidebarProps {
  onLogout: () => void;
  activeWorkspace: Workspace | null;
  workspaces: Workspace[];
  onSwitchWorkspace: (id: string) => void;
  userEmail?: string;
  insights: AIInsight[];
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, activeWorkspace, workspaces, onSwitchWorkspace, userEmail, insights }) => {
  const location = useLocation();
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  // Filter unresolved insights to drive navigation highlights
  const unresolved = (insights || []).filter(i => !i.resolved);
  const fatigueCount = unresolved.filter(i => i.insight_type === 'fatigue').length;
  const perfDropCount = unresolved.filter(i => i.insight_type === 'performance_drop').length;
  const imbalanceCount = unresolved.filter(i => i.insight_type === 'budget_imbalance').length;

  const menuStructure = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/",
      badge: unresolved.length > 0 ? unresolved.length : undefined,
    },
    {
      id: "campaigns",
      label: "Campaigns",
      icon: Rocket,
      to: "/campaigns",
      highlight: imbalanceCount > 0,
      children: [
        { label: "All Campaigns", to: "/campaigns/all" },
        { label: "Drafts", to: "/campaigns/drafts" },
        { label: "AI-Managed", to: "/campaigns/ai-managed" }
      ]
    },
    {
      id: "creatives",
      label: "Creatives",
      icon: Sparkles,
      to: "/creatives",
      highlight: fatigueCount > 0,
      children: [
        { label: "AI Generate", to: "/creatives/generate" },
        { label: "Library", to: "/creatives/library" },
        { label: "Performance", to: "/creatives/performance" }
      ]
    },
    {
      id: "automation",
      label: "Automation",
      icon: Zap,
      to: "/automation",
      highlight: perfDropCount > 0,
      children: [
        { label: "AI Control", to: "/automation/ai-control" },
        { label: "Rules", to: "/automation/rules" },
        { label: "Budget Flow", to: "/automation/budget-flow" }
      ]
    },
    {
      id: "insights",
      label: "Insights",
      icon: BarChart3,
      to: "/insights",
      children: [
        { label: "Cross-Platform", to: "/insights/cross-platform" },
        { label: "Creative Angle", to: "/insights/creative-analysis" },
        { label: "Performance Trends", to: "/insights/trends" }
      ]
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: Share2,
      to: "/integrations",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      to: "/settings",
      children: [
        { label: "Workspace", to: "/settings/workspace" },
        { label: "Team & Members", to: "/settings/team" },
        { label: "Billing", to: "/settings/billing" }
      ]
    }
  ];

  return (
    <aside className="w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 flex flex-col hidden md:flex font-sans transition-all overflow-hidden z-50">
      {/* Workspace Context Switcher */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-900">
        <div className="flex items-center mb-6 group cursor-pointer" onClick={() => (window.location.href = '#/')}>
          <img src={LOGO_URL} alt="ZieAds Logo" className="h-10 w-auto object-contain hover:scale-105 transition-transform" />
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ring-primary/5 hover:ring-4"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg tosca-bg flex-shrink-0 flex items-center justify-center text-white shadow-sm">
                <Building2 size={16} />
              </div>
              <div className="flex flex-col items-start overflow-hidden text-left">
                <span className="text-[12px] font-black text-slate-900 dark:text-slate-100 truncate tracking-tight uppercase">
                  {activeWorkspace?.name || 'Initialize...'}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{activeWorkspace?.plan_type || 'Personal'} Plan</span>
              </div>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isWorkspaceOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isWorkspaceOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Your Workspaces</p>
              {workspaces.map(w => (
                <button 
                  key={w.id} 
                  onClick={() => { onSwitchWorkspace(w.id); setIsWorkspaceOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-[13px] font-bold flex items-center gap-3 transition-colors ${activeWorkspace?.id === w.id ? 'text-primary bg-teal-50/50 dark:bg-teal-500/5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${activeWorkspace?.id === w.id ? 'bg-primary' : 'bg-slate-200'}`}></div>
                  {w.name}
                </button>
              ))}
              <div className="h-px bg-slate-50 dark:bg-slate-800 my-2"></div>
              <button className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-primary flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Plus size={14} /> Create Workspace
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Layer with AI Highlights */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuStructure.map((item) => {
          const isActive = location.pathname.startsWith(item.to) && (item.to !== '/' || location.pathname === '/');
          
          return (
            <div key={item.id} className="space-y-1">
              <NavLink
                to={item.to}
                className={({ isActive: navActive }) => 
                  `flex items-center justify-between px-4 py-3 rounded-2xl transition-all relative group ${
                    navActive || isActive 
                      ? 'bg-teal-50 dark:bg-teal-500/10 text-primary dark:text-teal-400' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <item.icon 
                      size={20} 
                      strokeWidth={isActive ? 2.5 : 2} 
                      className={`${item.highlight ? 'text-orange-500 animate-pulse' : ''}`} 
                    />
                    {item.highlight && (
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 absolute -top-1 -right-1 ring-2 ring-white dark:ring-slate-950"></div>
                    )}
                  </div>
                  <span className={`text-[14px] font-bold tracking-tight ${isActive ? 'font-black' : ''}`}>
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md bg-primary text-white text-[9px] font-black min-w-[18px] text-center shadow-lg shadow-teal-500/20 animate-in zoom-in-50">
                      {item.badge}
                    </span>
                  )}
                  {item.children && (
                    <ChevronRight size={14} className={`transition-transform opacity-30 ${isActive ? 'rotate-90 opacity-100' : ''}`} />
                  )}
                </div>
              </NavLink>

              {/* Functional Children Routes */}
              {isActive && item.children && (
                <div className="ml-9 py-1 space-y-1 animate-in slide-in-from-left-2 duration-300">
                  {item.children.map(child => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive: childActive }) => 
                        `block px-4 py-2 text-[12px] font-bold rounded-xl transition-all ${
                          childActive 
                            ? 'text-primary dark:text-teal-400 bg-teal-50/30 dark:bg-teal-500/5' 
                            : 'text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Infrastructure Area */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-900 space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group cursor-pointer hover:border-primary transition-all">
           <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-black text-xs">
              {userEmail?.charAt(0).toUpperCase() || 'U'}
           </div>
           <div className="flex flex-col overflow-hidden text-left">
              <span className="text-[12px] font-bold text-slate-900 dark:text-white truncate">{userEmail?.split('@')[0] || 'User'}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{userEmail}</span>
           </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all group"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="text-[14px] font-bold tracking-tight">Logout session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

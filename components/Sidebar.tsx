import React from 'react';
// @ts-ignore
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Rocket, 
  Sparkles, 
  Zap, 
  BarChart3, 
  Share2, 
  Settings,
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  userEmail?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, userEmail }) => {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/" },
    { label: "Campaigns", icon: Rocket, to: "/campaigns" },
    { label: "AI Creative Studio", icon: Sparkles, to: "/creatives" },
    { label: "Automation", icon: Zap, to: "/automation" },
    { label: "Insights", icon: BarChart3, to: "/insights" },
    { label: "Integrations", icon: Share2, to: "/integrations" },
    { label: "Settings", icon: Settings, to: "/settings" },
  ];

  return (
    <aside className="w-[240px] bg-[#0F172A] border-r border-[#334155] flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xl font-bold tracking-tight text-white font-sans">ZieAds</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = item.to === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.to);
            
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 transition-all text-[14px] font-medium ${
                  isActive 
                    ? 'bg-[#1E293B] text-white border-l-[3px] border-[#8B5CF6]' 
                    : 'text-[#94A3B8] hover:bg-[#1E293B]/50 hover:text-white border-l-[3px] border-transparent'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-[#94A3B8]'} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-[#334155]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#334155] flex items-center justify-center text-white font-bold text-xs">
            {userEmail?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[14px] font-medium text-white truncate">
              {userEmail?.split('@')[0] || 'User'}
            </span>
            <span className="text-[12px] text-[#94A3B8] truncate">{userEmail}</span>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="text-[13px] font-medium text-[#94A3B8] hover:text-white transition-all flex items-center gap-2"
        >
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
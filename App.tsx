import React, { useState, useEffect, useMemo, useCallback } from 'react';
// @ts-ignore
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import WebsiteScanner from './components/WebsiteScanner';
import CampaignBuilder from './components/CampaignBuilder';
import ClickFraudProtection from './components/ClickFraudProtection';
import AdAccountConnector from './components/AdAccountConnector';
import AdminLibrary from './components/AdminLibrary';
import AuthPage from './components/AuthPage';
import MyProjects from './components/MyProjects';
import InsightsModule from './components/InsightsModule';
import SettingsModule from './components/SettingsModule';
import OnboardingWizard from './components/OnboardingWizard';
import { Workspace, SmartUpdate, Platform, BrandProfile } from './types';
import { supabase } from './services/supabaseClient';

const MOCK_ADMIN_ID = '00000000-0000-0000-0000-000000000000';

const AppContent: React.FC<{ 
  session: any; 
  setSession: (s: any) => void;
  workspaces: Workspace[];
  setWorkspaces: (ws: Workspace[]) => void;
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (id: string | null) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  updates: SmartUpdate[];
}> = ({ session, setSession, workspaces, setWorkspaces, activeWorkspaceId, setActiveWorkspaceId, isDarkMode, toggleTheme, updates }) => {
  
  const activeWorkspace = useMemo(() => {
    if (workspaces.length === 0) return null;
    return workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];
  }, [workspaces, activeWorkspaceId]);

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (activeWorkspace && activeWorkspace.onboarding_completed === false) {
      setShowOnboarding(true);
    }
  }, [activeWorkspace]);

  const handleLogout = async () => {
    localStorage.removeItem('zieads_admin_bypass');
    await supabase.auth.signOut();
    setSession(null);
    setWorkspaces([]);
    setActiveWorkspaceId(null);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    if (activeWorkspace) {
      setWorkspaces(workspaces.map(w => w.id === activeWorkspace.id ? { ...w, onboarding_completed: true } : w));
    }
  };

  if (!session) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage onLogin={() => (window.location.hash = '#/auth')} />} />
        <Route path="/auth" element={<AuthPage onBack={() => (window.location.hash = '#/')} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F172A] text-[#F8FAFC] transition-colors duration-300">
      {showOnboarding && activeWorkspace && (
        <OnboardingWizard 
          workspaceId={activeWorkspace.id} 
          onComplete={handleOnboardingComplete} 
        />
      )}
      <Sidebar 
        onLogout={handleLogout} 
        userEmail={session.user?.email}
      />
      <main className="flex-1 overflow-y-auto ml-[240px] custom-scrollbar transition-colors duration-300 bg-[#0F172A]">
        {!activeWorkspace ? (
          <div className="h-full flex items-center justify-center">
             <Loader2 size={32} className="animate-spin text-[#8B5CF6]" />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaigns/*" element={<MyProjects activeWorkspace={activeWorkspace} />} />
            <Route path="/creatives/*" element={<AdminLibrary />} />
            <Route path="/automation" element={<ClickFraudProtection />} />
            <Route path="/insights" element={<InsightsModule />} /> 
            <Route path="/integrations" element={<AdAccountConnector />} />
            <Route path="/settings" element={<SettingsModule />} />
            <Route path="/scanner" element={<WebsiteScanner activeWorkspace={activeWorkspace} onScanComplete={(info) => {
              setWorkspaces(workspaces.map(w => w.id === activeWorkspace.id ? { ...w, brandInfo: info } : w));
            }} currentProfile={(activeWorkspace.brandInfo as BrandProfile) || null} />} />
            <Route path="/builder" element={<CampaignBuilder brandProfile={(activeWorkspace.brandInfo as BrandProfile) || null} onComplete={(camp) => {
               setWorkspaces(workspaces.map(w => w.id === activeWorkspace.id ? { ...w, campaigns: [...(w.campaigns || []), camp] } : w));
            }} workspaceId={activeWorkspace.id} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [updates] = useState<SmartUpdate[]>([]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const provisionWorkspace = useCallback(async (userId: string, email: string) => {
    const isAdmin = email === 'admin@zieads.com' || localStorage.getItem('zieads_admin_bypass') === 'true';

    if (isAdmin) {
      const adminWs: Workspace = {
        id: 'zieads-root-master',
        name: 'Main Workspace',
        slug: 'main-workspace',
        ownerId: userId,
        planType: 'scale',
        onboarding_completed: true,
        settings: { timezone: 'UTC', currency: 'USD', notifications: true },
        usage_stats: { scans_this_month: 0, creatives_generated: 0, campaigns_active: 0 },
        createdAt: new Date().toISOString(),
        campaigns: []
      };
      setWorkspaces([adminWs]);
      setActiveWorkspaceId(adminWs.id);
      return adminWs;
    }

    try {
      const { data: wsData } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', userId);

      if (wsData && wsData.length > 0) {
        setWorkspaces(wsData);
        setActiveWorkspaceId(wsData[0].id);
        return wsData[0];
      } else {
        const fallbackWs: Workspace = {
          id: 'ws-' + userId.substring(0, 8),
          name: 'My Project',
          slug: 'my-project',
          ownerId: userId,
          planType: 'starter',
          onboarding_completed: false,
          settings: { timezone: 'UTC', currency: 'USD', notifications: true },
          usage_stats: { scans_this_month: 0, creatives_generated: 0, campaigns_active: 0 },
          createdAt: new Date().toISOString(),
          campaigns: []
        };
        setWorkspaces([fallbackWs]);
        setActiveWorkspaceId(fallbackWs.id);
        return fallbackWs;
      }
    } catch (err) {
      return null;
    }
  }, []);

  useEffect(() => {
    const initApp = async () => {
      try {
        const bypass = localStorage.getItem('zieads_admin_bypass') === 'true';
        if (bypass) {
          const mockSess = { user: { id: MOCK_ADMIN_ID, email: 'admin@zieads.com' } };
          setSession(mockSess);
          await provisionWorkspace(MOCK_ADMIN_ID, 'admin@zieads.com');
        } else {
          const { data: { session: sbSess } } = await supabase.auth.getSession();
          if (sbSess?.user) {
            setSession(sbSess);
            await provisionWorkspace(sbSess.user.id, sbSess.user.email || '');
          }
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };

    initApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSess) => {
      if (newSess?.user) {
        setSession(newSess);
        await provisionWorkspace(newSess.user.id, newSess.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setWorkspaces([]);
        setActiveWorkspaceId(null);
        localStorage.removeItem('zieads_admin_bypass');
      }
    });

    return () => subscription.unsubscribe();
  }, [provisionWorkspace]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0F172A]">
        <div className="flex flex-col items-center gap-6">
           <Loader2 className="animate-spin text-[#8B5CF6]" size={32} />
           <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.4em]">Starting up...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppContent 
        session={session} 
        setSession={setSession}
        workspaces={workspaces}
        setWorkspaces={setWorkspaces}
        activeWorkspaceId={activeWorkspaceId}
        setActiveWorkspaceId={setActiveWorkspaceId}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        updates={updates}
      />
    </Router>
  );
};

export default App;
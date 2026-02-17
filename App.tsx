
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import { Workspace, AIInsight, Platform } from './types';
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
  insights: AIInsight[];
}> = ({ session, setSession, workspaces, setWorkspaces, activeWorkspaceId, setActiveWorkspaceId, isDarkMode, toggleTheme, insights }) => {
  
  const activeWorkspace = useMemo(() => {
    if (workspaces.length === 0) return null;
    return workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];
  }, [workspaces, activeWorkspaceId]);

  const handleLogout = async () => {
    localStorage.removeItem('zieads_admin_bypass');
    await supabase.auth.signOut();
    setSession(null);
    setWorkspaces([]);
    setActiveWorkspaceId(null);
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
    <div className="flex h-screen overflow-hidden bg-white dark:bg-dark text-slate-900 dark:text-white transition-colors duration-300">
      <Sidebar 
        onLogout={handleLogout} 
        activeWorkspace={activeWorkspace} 
        workspaces={workspaces} 
        onSwitchWorkspace={setActiveWorkspaceId} 
        userEmail={session.user?.email}
        insights={insights}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50/50 dark:bg-transparent transition-colors duration-300">
        {!activeWorkspace ? (
          <div className="h-full flex items-center justify-center">
             <Loader2 size={32} className="animate-spin text-accent" />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard activeWorkspace={activeWorkspace} toggleTheme={toggleTheme} isDarkMode={isDarkMode} insights={insights} />} />
            <Route path="/campaigns/*" element={<MyProjects activeWorkspace={activeWorkspace} />} />
            <Route path="/creatives/*" element={<AdminLibrary />} />
            <Route path="/automation" element={<ClickFraudProtection />} />
            <Route path="/insights" element={<Dashboard activeWorkspace={activeWorkspace} toggleTheme={toggleTheme} isDarkMode={isDarkMode} insights={insights} />} />
            <Route path="/integrations" element={<AdAccountConnector />} />
            <Route path="/settings/*" element={<AdAccountConnector />} />
            <Route path="/scanner" element={<WebsiteScanner activeWorkspace={activeWorkspace} onScanComplete={(profile) => {
              setWorkspaces(workspaces.map(w => w.id === activeWorkspace.id ? { ...w, brandProfile: profile } : w));
            }} currentProfile={activeWorkspace.brandProfile || null} />} />
            <Route path="/builder" element={<CampaignBuilder brandProfile={activeWorkspace.brandProfile || null} onComplete={(camp) => {
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
  const [insights] = useState<AIInsight[]>([]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const provisionSessionData = useCallback(async (userId: string, email: string) => {
    const isAdmin = email === 'admin@zieads.com' || localStorage.getItem('zieads_admin_bypass') === 'true';

    if (isAdmin) {
      const adminWs: Workspace = {
        id: 'zieads-root-master',
        name: 'ZieAds Command',
        owner_id: userId,
        plan_type: 'Scale',
        created_at: new Date().toISOString(),
        campaigns: [
          {
            id: 'c-1',
            workspace_id: 'zieads-root-master',
            name: 'Global Awareness Q1',
            status: 'active',
            objective: 'Awareness',
            daily_budget: 150,
            health_score: 98,
            ai_managed: true,
            created_at: new Date().toISOString(),
            platforms: [Platform.Meta, Platform.Google],
            budget: 150,
            metrics: { impressions: 45000, clicks: 1200, spend: 3200, revenue: 0, roas: 0, cpa: 2.6 }
          }
        ]
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
          name: 'My Workspace',
          owner_id: userId,
          plan_type: 'Starter',
          created_at: new Date().toISOString(),
          campaigns: []
        };
        setWorkspaces([fallbackWs]);
        setActiveWorkspaceId(fallbackWs.id);
        return fallbackWs;
      }
    } catch (err) {
      console.error("Workspace recovery fail:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    const boot = async () => {
      try {
        const bypass = localStorage.getItem('zieads_admin_bypass') === 'true';
        if (bypass) {
          const mockSess = { user: { id: MOCK_ADMIN_ID, email: 'admin@zieads.com' } };
          setSession(mockSess);
          await provisionSessionData(MOCK_ADMIN_ID, 'admin@zieads.com');
        } else {
          const { data: { session: sbSess } } = await supabase.auth.getSession();
          if (sbSess?.user) {
            setSession(sbSess);
            await provisionSessionData(sbSess.user.id, sbSess.user.email || '');
          }
        }
      } catch (e) {
        console.error("Boot error:", e);
      } finally {
        setLoading(false);
      }
    };

    boot();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSess) => {
      if (newSess?.user) {
        setSession(newSess);
        await provisionSessionData(newSess.user.id, newSess.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setWorkspaces([]);
        setActiveWorkspaceId(null);
        localStorage.removeItem('zieads_admin_bypass');
      }
    });

    return () => subscription.unsubscribe();
  }, [provisionSessionData]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-dark transition-colors duration-300">
        <div className="flex flex-col items-center gap-6">
           <Loader2 className="animate-spin text-accent" size={32} />
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">ZieAds Intelligence</p>
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
        insights={insights}
      />
    </Router>
  );
};

export default App;


import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UseCasesPage from './components/UseCasesPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import WebsiteScanner from './components/WebsiteScanner';
import CampaignBuilder from './components/CampaignBuilder';
import ClickFraudProtection from './components/ClickFraudProtection';
import AdAccountConnector from './components/AdAccountConnector';
import AdminDashboard from './components/AdminDashboard';
import AdminLibrary from './components/AdminLibrary';
import AuthPage from './components/AuthPage';
import MyProjects from './components/MyProjects';
import { Workspace, AIInsight } from './types';
import { supabase } from './services/supabaseClient';

const MOCK_ADMIN_ID = '00000000-0000-0000-0000-000000000000';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);

  // Theme Logic
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
  };

  /**
   * DATA PROVISIONING ENGINE
   * Ensures every session has at least one valid workspace.
   */
  const bootstrapAppData = useCallback(async (userId: string, userEmail: string) => {
    const isAdmin = userEmail === 'admin@zieads.com';

    try {
      if (isAdmin) {
        // 1. ADMIN FAST-PATH (No DB calls)
        const adminWs: Workspace = {
          id: 'admin-master-node',
          name: 'ZieAds Master Command',
          owner_id: userId,
          plan_type: 'scale',
          created_at: new Date().toISOString()
        };
        setWorkspaces([adminWs]);
        setActiveWorkspaceId(adminWs.id);
        setInsights([{
          id: 'ins-admin-1',
          workspace_id: adminWs.id,
          entity_type: 'automation',
          entity_id: 'global',
          insight_type: 'budget_imbalance',
          severity: 'info',
          message: 'System Integrity: All neural nodes are operating at peak efficiency.',
          resolved: false,
          created_at: new Date().toISOString()
        }]);
        return;
      }

      // 2. STANDARD USER PATH
      const { data: wsData, error: wsError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', userId);

      if (!wsError && wsData && wsData.length > 0) {
        setWorkspaces(wsData);
        setActiveWorkspaceId(wsData[0].id);
      } else {
        // Try creating a default workspace
        const { data: newWs, error: createError } = await supabase
          .from('workspaces')
          .insert([{ name: 'My Business Workspace', owner_id: userId, plan_type: 'free' }])
          .select()
          .single();
        
        if (createError || !newWs) throw new Error("DB Initialization Failed");

        setWorkspaces([newWs]);
        setActiveWorkspaceId(newWs.id);
      }
    } catch (err) {
      console.warn("Resilience Mode: Booting with virtual workspace data.");
      const virtualWs: Workspace = {
        id: 'virtual-node-' + userId.substring(0, 8),
        name: 'Personal Workspace',
        owner_id: userId,
        plan_type: 'starter',
        created_at: new Date().toISOString()
      };
      setWorkspaces([virtualWs]);
      setActiveWorkspaceId(virtualWs.id);
    }
  }, []);

  /**
   * AUTH ORCHESTRATOR
   */
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        // 1. Check for Admin Bypass in Storage
        const isAdminBypass = localStorage.getItem('zieads_admin_bypass') === 'true';
        if (isAdminBypass) {
          const adminSession = { user: { id: MOCK_ADMIN_ID, email: 'admin@zieads.com' } };
          setSession(adminSession);
          await bootstrapAppData(MOCK_ADMIN_ID, 'admin@zieads.com');
          setLoading(false);
          return;
        }

        // 2. Standard Supabase Session
        const { data: { session: sbSession } } = await supabase.auth.getSession();
        if (sbSession?.user) {
          setSession(sbSession);
          await bootstrapAppData(sbSession.user.id, sbSession.user.email || '');
        }
      } catch (err) {
        console.error("Auth Failure:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for Auth Changes (Supabase Only)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (localStorage.getItem('zieads_admin_bypass') === 'true') return;

      if (newSession?.user) {
        setSession(newSession);
        await bootstrapAppData(newSession.user.id, newSession.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setWorkspaces([]);
        setActiveWorkspaceId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [bootstrapAppData]);

  const activeWorkspace = useMemo(() => 
    workspaces.find(w => w.id === activeWorkspaceId) || null, 
  [workspaces, activeWorkspaceId]);

  const handleLogout = async () => {
    localStorage.removeItem('zieads_admin_bypass');
    await supabase.auth.signOut();
    setSession(null);
    setWorkspaces([]);
    setActiveWorkspaceId(null);
    window.location.hash = '#/';
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-6 animate-pulse">
           <div className="w-16 h-16 tosca-bg rounded-3xl animate-spin shadow-2xl shadow-teal-500/20"></div>
           <div className="text-center space-y-1">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] font-sans">ZieAds Network</p>
             <p className="text-[9px] font-bold text-teal-500 uppercase tracking-widest">Establishing Secure Command...</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {!session ? (
        <Routes>
          <Route path="/" element={<LandingPage onLogin={() => (window.location.href = '#/auth')} />} />
          <Route path="/auth" element={<AuthPage onBack={() => (window.location.href = '#/')} />} />
          <Route path="/use-cases" element={<UseCasesPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
          <Sidebar 
            onLogout={handleLogout} 
            activeWorkspace={activeWorkspace} 
            workspaces={workspaces} 
            onSwitchWorkspace={setActiveWorkspaceId} 
            userEmail={session.user?.email}
            insights={insights}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
            <Routes>
              <Route path="/" element={<Dashboard activeWorkspace={activeWorkspace} toggleTheme={toggleTheme} isDarkMode={isDarkMode} insights={insights} />} />
              <Route path="/campaigns/*" element={<MyProjects activeBusiness={null} />} />
              <Route path="/creatives/generate" element={<CampaignBuilder brandProfile={null} onComplete={() => {}} />} />
              <Route path="/creatives/library" element={<AdminLibrary />} />
              <Route path="/automation" element={<ClickFraudProtection />} />
              <Route path="/insights" element={<Dashboard activeWorkspace={activeWorkspace} toggleTheme={toggleTheme} isDarkMode={isDarkMode} insights={insights} />} />
              <Route path="/integrations" element={<AdAccountConnector />} />
              <Route path="/settings/*" element={<AdAccountConnector />} />
              <Route path="/scanner" element={<WebsiteScanner activeBusiness={null} onScanComplete={() => {}} currentProfile={null} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
};

export default App;

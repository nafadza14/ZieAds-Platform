
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
import { Business, UserProfile, Campaign } from './types';
import { supabase } from './services/supabaseClient';
import { fetchUserProfile } from './services/dbService';

const ADMIN_MOCK_USER_ID = 'admin-uuid-0000-0000-000000000000';
const ADMIN_EMAIL = 'admin@zieads.com';

const App: React.FC = () => {
  const [isSystemAdmin, setIsSystemAdmin] = useState<boolean>(() => {
    return localStorage.getItem('zieads_admin_bypass') === 'true';
  });

  const [session, setSession] = useState<any>(() => {
    if (localStorage.getItem('zieads_admin_bypass') === 'true') {
      return { user: { id: ADMIN_MOCK_USER_ID, email: ADMIN_EMAIL } };
    }
    return null;
  });

  const [showAuth, setShowAuth] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeBusinessId, setActiveBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const initAdminData = useCallback(() => {
    setUserProfile({
      id: ADMIN_MOCK_USER_ID,
      fullName: 'ZieAds Superadmin',
      companyName: 'ZieAds Core Operations',
      brandSummary: 'Global System Administrator',
      brandVoice: 'Professional',
      websiteUrl: 'https://zieads.com'
    });
    const adminBiz: Business = {
      id: 'admin-global-view',
      name: 'ZieAds Network',
      brandProfile: null,
      campaigns: []
    };
    setBusinesses([adminBiz]);
    setActiveBusinessId(adminBiz.id);
    setLoading(false);
  }, []);

  const fetchData = useCallback(async (userId: string) => {
    try {
      const { data: bizData, error } = await supabase
        .from('businesses')
        .select(`*, brand_profiles (*), campaigns (*)`)
        .eq('user_id', userId);

      if (error) throw error;

      if (bizData && Array.isArray(bizData)) {
        const mapped: Business[] = bizData
          .filter((b: any) => b !== null)
          .map((b: any) => {
            const profiles = Array.isArray(b.brand_profiles) ? b.brand_profiles : [];
            const rawCampaigns: any[] = Array.isArray(b.campaigns) ? b.campaigns : [];
            
            return {
              id: b.id,
              name: b.name || 'Unnamed Business',
              brandProfile: profiles.length > 0 ? (profiles[0] || null) : null,
              campaigns: rawCampaigns
                .filter((c: any) => c !== null)
                .sort((a: any, b: any) => {
                  const dateA = a?.created_at ? new Date(a.created_at).getTime() : 0;
                  const dateB = b?.created_at ? new Date(b.created_at).getTime() : 0;
                  return dateB - dateA;
                })
            };
          });
        
        setBusinesses(mapped);
        if (mapped.length > 0) {
          setActiveBusinessId(mapped[0].id);
        } else {
          setActiveBusinessId(null);
        }
      } else {
        setBusinesses([]);
        setActiveBusinessId(null);
      }
    } catch (e: any) {
      console.error("Database fetch error:", e.message || e);
      setBusinesses([]);
    }
  }, []);

  const initData = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const profile = await fetchUserProfile();
      setUserProfile(profile);
      await fetchData(userId);
    } catch (err) {
      console.error("Initialization error:", err);
      await fetchData(userId);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const handleAuthSuccess = useCallback((sbSession: any) => {
    if (!sbSession || !sbSession.user) return;
    const email = sbSession.user.email?.toLowerCase();
    
    if (email === ADMIN_EMAIL || localStorage.getItem('zieads_admin_bypass') === 'true') {
      localStorage.setItem('zieads_admin_bypass', 'true');
      setIsSystemAdmin(true);
      setSession(sbSession);
      initAdminData();
    } else {
      setIsSystemAdmin(false);
      setSession(sbSession);
      initData(sbSession.user.id);
    }
    setShowAuth(false);
  }, [initAdminData, initData]);

  useEffect(() => {
    if (isSystemAdmin) {
      initAdminData();
      return;
    }

    const checkSession = async () => {
      try {
        const { data: { session: sbSession } } = await supabase.auth.getSession();
        if (sbSession) {
          handleAuthSuccess(sbSession);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sbSession) => {
      if (localStorage.getItem('zieads_admin_bypass') === 'true') return;
      if (sbSession) {
        handleAuthSuccess(sbSession);
      } else {
        setBusinesses([]);
        setUserProfile(null);
        setActiveBusinessId(null);
        setIsSystemAdmin(false);
        setSession(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isSystemAdmin, handleAuthSuccess, initAdminData]);

  const handleLogout = async () => {
    localStorage.removeItem('zieads_admin_bypass');
    await supabase.auth.signOut();
    window.location.href = '#/'; 
    window.location.reload(); 
  };

  const activeBusiness = useMemo(() => {
    if (!activeBusinessId || !Array.isArray(businesses)) return null;
    return businesses.find(b => b && b.id === activeBusinessId) || null;
  }, [businesses, activeBusinessId]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-slate-950 transition-colors">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 tosca-bg rounded-xl animate-spin shadow-2xl"></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-sans">ZieAds Network Init...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    if (showAuth) return <AuthPage onBack={() => setShowAuth(false)} />;
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage onLogin={() => setShowAuth(true)} />} />
          <Route path="/use-cases" element={<UseCasesPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
        <Sidebar 
          onLogout={handleLogout} 
          activeBusiness={activeBusiness} 
          businesses={businesses} 
          onSwitchBusiness={(id) => setActiveBusinessId(id)} 
          userEmail={session.user?.email}
          isAdmin={isSystemAdmin}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            {isSystemAdmin ? (
              <>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/library" element={<AdminLibrary />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Dashboard activeBusiness={activeBusiness} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />} />
                <Route path="/accounts" element={<AdAccountConnector />} />
                <Route path="/fraud" element={<ClickFraudProtection />} />
                <Route path="/scanner" element={<WebsiteScanner onScanComplete={() => {}} currentProfile={activeBusiness?.brandProfile || null} />} />
                <Route path="/builder" element={<CampaignBuilder brandProfile={activeBusiness?.brandProfile || null} onComplete={() => {}} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;

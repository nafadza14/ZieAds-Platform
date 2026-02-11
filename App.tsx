
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import WebsiteScanner from './components/WebsiteScanner';
import CampaignBuilder from './components/CampaignBuilder';
import ClickFraudProtection from './components/ClickFraudProtection';
import AdAccountConnector from './components/AdAccountConnector';
import AuthPage from './components/AuthPage';
import { Business, Campaign, BrandProfile, UserProfile } from './types';
import { supabase } from './services/supabaseClient';
import { fetchUserProfile } from './services/dbService';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeBusinessId, setActiveBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        initData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setShowAuth(false);
        initData(session.user.id);
      } else {
        setBusinesses([]);
        setUserProfile(null);
        setActiveBusinessId(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const initData = async (userId: string) => {
    setLoading(true);
    try {
      const profile = await fetchUserProfile();
      setUserProfile(profile);
      await fetchData(userId);
    } catch (err) {
      console.error("Init Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (userId: string) => {
    const { data: bizData, error: bizError } = await supabase
      .from('businesses')
      .select(`*, brand_profiles (*), campaigns (*)`)
      .eq('user_id', userId);

    if (bizError) throw bizError;

    if (bizData && bizData.length > 0) {
      const mapped = bizData.map(b => ({
        id: b.id,
        name: b.name,
        brandProfile: b.brand_profiles[0] || null,
        campaigns: (b.campaigns || []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }));
      setBusinesses(mapped);
      setActiveBusinessId(mapped[0].id);
    } else {
      const { data: newBiz, error: createError } = await supabase
        .from('businesses')
        .insert([{ name: 'My First Business', user_id: userId }])
        .select()
        .single();

      if (createError) throw createError;
      
      const initial: Business = {
        id: newBiz.id,
        name: newBiz.name,
        brandProfile: null,
        campaigns: []
      };
      setBusinesses([initial]);
      setActiveBusinessId(initial.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const activeBusiness = businesses.find(b => b.id === activeBusinessId) || null;

  const updateActiveBusinessBrand = async (profile: BrandProfile) => {
    if (!activeBusinessId) return;
    try {
      const { error } = await supabase
        .from('brand_profiles')
        .upsert([{ business_id: activeBusinessId, ...profile }], { onConflict: 'business_id' });

      if (error) throw error;
      setBusinesses(prev => prev.map(b => b.id === activeBusinessId ? { ...b, brandProfile: profile, name: profile.name } : b));
      await supabase.from('businesses').update({ name: profile.name }).eq('id', activeBusinessId);
    } catch (err) {
      console.error('Failed to update brand profile:', err);
    }
  };

  const addCampaignToActiveBusiness = async (campaign: Campaign) => {
    // Just refresh local state after dbService orchestrates the publish
    if (!activeBusinessId) return;
    setBusinesses(prev => prev.map(b => 
      b.id === activeBusinessId ? { ...b, campaigns: [campaign, ...b.campaigns] } : b
    ));
  };

  const switchBusiness = (id: string) => setActiveBusinessId(id);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 tosca-bg rounded-xl animate-bounce"></div>
           <p className="font-bold text-slate-400 tracking-widest text-xs uppercase">ZieAds Core Sync</p>
        </div>
      </div>
    );
  }

  if (!session) {
    if (showAuth) return <AuthPage onBack={() => setShowAuth(false)} />;
    return <LandingPage onLogin={() => setShowAuth(true)} />;
  }

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar onLogout={handleLogout} activeBusiness={activeBusiness} businesses={businesses} onSwitchBusiness={switchBusiness} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard activeBusiness={activeBusiness} />} />
            <Route path="/accounts" element={<AdAccountConnector />} />
            <Route path="/fraud" element={<ClickFraudProtection />} />
            <Route path="/scanner" element={<WebsiteScanner onScanComplete={updateActiveBusinessBrand} currentProfile={activeBusiness?.brandProfile || null} />} />
            <Route path="/builder" element={<CampaignBuilder brandProfile={activeBusiness?.brandProfile || null} onComplete={addCampaignToActiveBusiness} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;

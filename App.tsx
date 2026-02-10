
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import WebsiteScanner from './components/WebsiteScanner';
import CampaignBuilder from './components/CampaignBuilder';
import ClickFraudProtection from './components/ClickFraudProtection';
import AuthPage from './components/AuthPage';
import { Business, Campaign, BrandProfile } from './types';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeBusinessId, setActiveBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchData(session.user.id);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setShowAuth(false);
        fetchData(session.user.id);
      } else {
        setBusinesses([]);
        setActiveBusinessId(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async (userId: string) => {
    setLoading(true);
    try {
      const { data: bizData, error: bizError } = await supabase
        .from('businesses')
        .select(`
          *,
          brand_profiles (*),
          campaigns (*)
        `)
        .eq('user_id', userId);

      if (bizError) throw bizError;

      if (bizData && bizData.length > 0) {
        const mapped = bizData.map(b => ({
          id: b.id,
          name: b.name,
          brandProfile: b.brand_profiles[0] || null,
          campaigns: b.campaigns || []
        }));
        setBusinesses(mapped);
        setActiveBusinessId(mapped[0].id);
      } else {
        // Create initial business for the new user
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
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
    } finally {
      setLoading(false);
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
        .upsert([{ 
          business_id: activeBusinessId,
          ...profile
        }], { onConflict: 'business_id' });

      if (error) throw error;

      setBusinesses(prev => prev.map(b => 
        b.id === activeBusinessId ? { ...b, brandProfile: profile, name: profile.name } : b
      ));

      await supabase.from('businesses').update({ name: profile.name }).eq('id', activeBusinessId);
      
    } catch (err) {
      console.error('Failed to update brand profile:', err);
    }
  };

  const addCampaignToActiveBusiness = async (campaign: Campaign) => {
    if (!activeBusinessId) return;

    try {
      const { error } = await supabase
        .from('campaigns')
        .insert([{
          business_id: activeBusinessId,
          name: campaign.name,
          type: campaign.type,
          platforms: campaign.platforms,
          objective: campaign.objective,
          audience: campaign.audience,
          creatives: campaign.creatives,
          budget: campaign.budget,
          duration: campaign.duration,
          status: campaign.status,
          metrics: campaign.metrics
        }]);

      if (error) throw error;

      setBusinesses(prev => prev.map(b => 
        b.id === activeBusinessId ? { ...b, campaigns: [campaign, ...b.campaigns] } : b
      ));
    } catch (err) {
      console.error('Failed to save campaign:', err);
    }
  };

  const switchBusiness = (id: string) => setActiveBusinessId(id);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 tosca-bg rounded-xl animate-bounce"></div>
           <p className="font-bold text-slate-400">ZieAds Syncing...</p>
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
        <Sidebar 
          onLogout={handleLogout} 
          activeBusiness={activeBusiness} 
          businesses={businesses} 
          onSwitchBusiness={switchBusiness} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard activeBusiness={activeBusiness} />} />
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

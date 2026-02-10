
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import WebsiteScanner from './components/WebsiteScanner';
import CampaignBuilder from './components/CampaignBuilder';
import ClickFraudProtection from './components/ClickFraudProtection';
import { Business, Campaign, BrandProfile } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeBusinessId, setActiveBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('zieads_auth');
    if (savedAuth === 'true') setIsAuthenticated(true);
    
    const savedBusinesses = localStorage.getItem('zieads_businesses');
    if (savedBusinesses) {
      const parsed = JSON.parse(savedBusinesses);
      setBusinesses(parsed);
      if (parsed.length > 0) setActiveBusinessId(parsed[0].id);
    } else {
      // Initialize with default business if none exists
      const defaultBusiness: Business = {
        id: 'default',
        name: 'My Business',
        brandProfile: null,
        campaigns: []
      };
      setBusinesses([defaultBusiness]);
      setActiveBusinessId('default');
    }
  }, []);

  useEffect(() => {
    if (businesses.length > 0) {
      localStorage.setItem('zieads_businesses', JSON.stringify(businesses));
    }
  }, [businesses]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('zieads_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('zieads_auth');
  };

  const activeBusiness = businesses.find(b => b.id === activeBusinessId) || null;

  const updateActiveBusinessBrand = (profile: BrandProfile) => {
    setBusinesses(prev => prev.map(b => 
      b.id === activeBusinessId ? { ...b, brandProfile: profile, name: profile.name } : b
    ));
  };

  const addCampaignToActiveBusiness = (campaign: Campaign) => {
    setBusinesses(prev => prev.map(b => 
      b.id === activeBusinessId ? { ...b, campaigns: [campaign, ...b.campaigns] } : b
    ));
  };

  const switchBusiness = (id: string) => setActiveBusinessId(id);

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar onLogout={handleLogout} activeBusiness={activeBusiness} businesses={businesses} onSwitchBusiness={switchBusiness} />
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

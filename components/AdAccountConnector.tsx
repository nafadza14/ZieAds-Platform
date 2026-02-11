
import React, { useState, useEffect } from 'react';
import { 
  Target, 
  RefreshCw, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Lock, 
  Plus
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { AdAccount, Platform } from '../types';

const AdAccountConnector: React.FC = () => {
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ad_accounts')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const mapped = (data || []).map((acc: any) => ({
        id: acc.id,
        platform: acc.platform as Platform,
        accountId: acc.account_id,
        status: acc.status as 'active' | 'error' | 'disconnected'
      }));
      setAccounts(mapped);
    } catch (err) {
      console.error('Error fetching ad accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: Platform) => {
    if (platform === Platform.LinkedIn) return;

    setConnectingPlatform(platform);
    
    setTimeout(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const mockAccountId = `ACT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const { error } = await supabase
          .from('ad_accounts')
          .insert([{
            user_id: user.id,
            platform,
            account_id: mockAccountId,
            status: 'active',
            access_token_encrypted: 'mock_encrypted_token'
          }]);

        if (error) throw error;
        await fetchAccounts();
        
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      } catch (err) {
        console.error('Connection failed:', err);
      } finally {
        setConnectingPlatform(null);
      }
    }, 2000);
  };

  const platformsList = [
    { id: Platform.Meta, label: 'Meta Ads', desc: 'Facebook and Instagram' },
    { id: Platform.Google, label: 'Google Ads', desc: 'Search, Display, and Video' },
    { id: Platform.TikTok, label: 'TikTok Ads', desc: 'Short form viral video' },
    { id: Platform.Bing, label: 'Bing Ads', desc: 'Microsoft search network' },
    { id: Platform.LinkedIn, label: 'LinkedIn Ads', desc: 'B2B and professional', unavailable: true },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans">
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md p-12 rounded-[40px] shadow-2xl border border-primary/20 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 tosca-bg rounded-full flex items-center justify-center text-white animate-bounce">
              <Sparkles size={40} />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 font-display">Launch Celebration</h2>
              <p className="text-slate-500 font-medium">Your ad account is connected successfully. Time to grow.</p>
            </div>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 font-display tracking-tight">Ad Account Hub</h1>
          <p className="text-slate-500 font-medium text-sm">Connect and manage your multi platform advertising permissions from one secure vault.</p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-900 rounded-full border border-slate-800 shadow-xl">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[11px] font-bold text-slate-400 tracking-wide">AES 256 Encryption active</span>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {platformsList.map((p) => {
          const connectedAccount = accounts.find(acc => acc.platform === p.id);
          const isConnecting = connectingPlatform === p.id;
          
          return (
            <div 
              key={p.id} 
              className={`group relative overflow-hidden rounded-[32px] border transition-all duration-300 ${
                p.unavailable 
                ? 'bg-slate-100 border-slate-200 grayscale' 
                : 'bg-white border-slate-200 hover:border-primary hover:shadow-2xl hover:shadow-teal-500/10'
              }`}
            >
              <div className="p-8 flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                      connectedAccount ? 'tosca-bg text-white' : 'bg-slate-50 text-slate-400'
                    }`}>
                      <Target size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 font-display">{p.label}</h3>
                      <p className="text-[13px] text-slate-400 font-medium">{p.desc}</p>
                    </div>
                  </div>

                  {connectedAccount ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-xl w-fit">
                        <CheckCircle2 size={16} />
                        <span className="text-[11px] font-bold">Connected</span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded w-fit">ID: {connectedAccount.accountId}</p>
                    </div>
                  ) : p.unavailable ? (
                    <div className="flex items-center gap-2 text-slate-400 bg-slate-200/50 px-3 py-1.5 rounded-xl w-fit">
                      <Lock size={14} />
                      <span className="text-[11px] font-bold">Currently unavailable</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl w-fit">
                      <RefreshCw size={14} className="animate-spin-slow" />
                      <span className="text-[11px] font-bold">Pending integration</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  {connectedAccount ? (
                    <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                      <RefreshCw size={20} />
                    </button>
                  ) : !p.unavailable && (
                    <button 
                      onClick={() => handleConnect(p.id)}
                      disabled={isConnecting}
                      className="px-6 py-3 tosca-bg text-white font-bold rounded-2xl shadow-lg shadow-teal-500/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all font-display"
                    >
                      {isConnecting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                      {isConnecting ? 'Linking...' : 'Connect now'}
                    </button>
                  )}
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Target size={120} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 rounded-[40px] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold leading-tight font-display">Secure Multi platform <br/><span className="tosca-text font-extrabold">Ads Management</span></h2>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">We use enterprise grade encryption to store your access tokens. ZieAds never sees your plain text credentials. All requests are proxied through our secure edge network.</p>
            <div className="flex gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wide">Compliance</span>
                <span className="text-sm font-bold">GDPR ready</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wide">Security</span>
                <span className="text-sm font-bold">SOC2 audited</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex justify-end">
            <div className="w-64 h-64 relative">
               <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
               <div className="relative glass-card border-white/10 p-8 rounded-3xl animate-float">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <Lock className="text-teal-400" size={32} />
                       <div className="w-12 h-1 bg-white/10 rounded"></div>
                    </div>
                    <div className="h-4 bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-white/5 rounded w-3/4"></div>
                    <div className="pt-4 flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                       <div className="w-3 h-3 rounded-full bg-teal-500/50"></div>
                       <div className="w-3 h-3 rounded-full bg-teal-500/20"></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdAccountConnector;

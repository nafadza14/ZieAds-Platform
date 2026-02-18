
import React, { useState } from 'react';
import { 
  RefreshCw, CheckCircle2, X, Plus, Trash2, 
  ChevronRight, Circle, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Platform } from '../types';

type ConnectStep = 'initial' | 'select' | 'success';

const AdAccountConnector: React.FC = () => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectStep, setConnectStep] = useState<ConnectStep>('initial');
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null);

  const startConnect = (platform: Platform) => {
    setActivePlatform(platform);
    setConnectStep('initial');
    setShowConnectModal(true);
  };

  const nextStep = () => {
    if (connectStep === 'initial') setConnectStep('select');
    else if (connectStep === 'select') setConnectStep('success');
  };

  const closePortal = () => {
    setShowConnectModal(false);
    setActivePlatform(null);
  };

  return (
    <div className="bg-[#0F172A] min-h-full p-8 text-[#F8FAFC] font-sans">
      {/* HEADER */}
      <header className="mb-10 space-y-1">
        <h1 className="text-[24px] font-semibold text-white">Connect Ad Accounts</h1>
        <p className="text-[14px] text-[#94A3B8]">Link your advertising platforms</p>
      </header>

      {/* PLATFORM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <PlatformCard 
          platform={Platform.Meta} 
          status="Connected" 
          detail="1 ad account" 
          onAction={() => {}}
        />
        <PlatformCard 
          platform={Platform.Google} 
          status="Connected" 
          detail="1 ad account" 
          onAction={() => {}}
        />
        <PlatformCard 
          platform={Platform.TikTok} 
          status="Not Connected" 
          detail="Connect to sync campaigns" 
          onAction={() => startConnect(Platform.TikTok)}
        />
      </div>

      {/* CONNECTED ACCOUNTS */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-white">Your connected accounts</h2>
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-sm">
          <div className="divide-y divide-[#334155]">
            <AccountListItem 
              platform={Platform.Meta}
              name="Global Retail Main"
              campaigns={12}
              creatives={84}
              lastSync="2m ago"
            />
            <AccountListItem 
              platform={Platform.Google}
              name="Search Performance Max"
              campaigns={5}
              creatives={22}
              lastSync="15m ago"
            />
          </div>
        </div>
      </section>

      {/* CONNECT FLOW MODAL */}
      <AnimatePresence>
        {showConnectModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePortal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pl-[240px] pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="pointer-events-auto w-full max-w-[500px] bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl overflow-hidden p-10 text-center"
              >
                <button 
                  onClick={closePortal} 
                  className="absolute top-6 right-6 p-2 text-[#94A3B8] hover:text-white rounded-lg"
                >
                  <X size={20} />
                </button>

                <div className="space-y-8 py-4">
                  {connectStep === 'initial' && (
                    <>
                      <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-white/5 border border-white/10">
                        <PlatformIcon platform={activePlatform!} size={32} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">Connect your {activePlatform} Ads account</h3>
                        <p className="text-sm text-[#94A3B8]">We'll sync your campaigns and enable AI optimization.</p>
                      </div>
                      <button 
                        onClick={nextStep}
                        className="w-full bg-[#8B5CF6] text-white py-4 rounded-xl font-bold text-base hover:bg-[#7C3AED] transition-all flex items-center justify-center gap-2"
                      >
                        Continue to {activePlatform} <ArrowRight size={18} />
                      </button>
                    </>
                  )}

                  {connectStep === 'select' && (
                    <>
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Select accounts to connect</h3>
                        <div className="space-y-2 text-left">
                          <SelectionRow label={`${activePlatform} Retail Main`} id="ACT_102938" />
                          <SelectionRow label={`${activePlatform} Growth Scaling`} id="ACT_5521" />
                          <SelectionRow label="Legacy Archive" id="ACT_0093" disabled />
                        </div>
                      </div>
                      <button 
                        onClick={nextStep}
                        className="w-full bg-[#8B5CF6] text-white py-4 rounded-xl font-bold text-base hover:bg-[#7C3AED] transition-all"
                      >
                        Connect Selected
                      </button>
                    </>
                  )}

                  {connectStep === 'success' && (
                    <>
                      <div className="w-16 h-16 mx-auto bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center">
                        <CheckCircle2 size={40} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">Successfully connected!</h3>
                        <p className="text-sm text-[#94A3B8]">Your campaigns will appear in 2-3 minutes.</p>
                      </div>
                      <button 
                        onClick={closePortal}
                        className="w-full bg-[#8B5CF6] text-white py-4 rounded-xl font-bold text-base hover:bg-[#7C3AED] transition-all"
                      >
                        Go to Dashboard
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const PlatformCard = ({ platform, status, detail, onAction }: any) => {
  const isConnected = status === 'Connected';
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 flex flex-col items-center text-center space-y-6 shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${
        platform === Platform.Meta ? 'bg-[#3B82F6]' : 
        platform === Platform.Google ? 'bg-[#EF4444]' : 'bg-black'
      }`}>
        <PlatformIcon platform={platform} size={28} />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">{platform} Ads</h3>
        <div className="flex items-center justify-center gap-1.5">
          {isConnected ? (
            <CheckCircle2 size={14} className="text-[#10B981]" />
          ) : (
            <Circle size={14} className="text-[#94A3B8]" />
          )}
          <span className={`text-sm font-medium ${isConnected ? 'text-[#10B981]' : 'text-[#94A3B8]'}`}>{status}</span>
        </div>
      </div>

      <p className="text-sm text-[#94A3B8]">{detail}</p>

      <div className="flex gap-2 w-full">
        {isConnected ? (
          <>
            <button className="flex-1 py-2.5 bg-white/5 border border-[#334155] rounded-lg text-sm font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-1.5">
              Manage <ChevronRight size={14} />
            </button>
            <button className="px-3 py-2.5 bg-white/5 border border-[#334155] rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-all">
              <RefreshCw size={16} />
            </button>
          </>
        ) : (
          <button 
            onClick={onAction}
            className="w-full py-2.5 bg-white/5 border border-[#334155] rounded-lg text-sm font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
          >
            Connect {platform} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

const AccountListItem = ({ platform, name, campaigns, creatives, lastSync }: any) => (
  <div className="px-6 py-5 flex flex-wrap items-center gap-4 group hover:bg-white/5 transition-all">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 ${
      platform === Platform.Meta ? 'bg-[#3B82F6]' : 'bg-[#EF4444]'
    }`}>
      <PlatformIcon platform={platform} size={20} />
    </div>
    
    <div className="flex-1 min-w-[200px]">
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-white">{name}</span>
        <span className="text-xs text-[#94A3B8]">| {platform}</span>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-[#94A3B8]">
      <span>{campaigns} campaigns</span>
      <span>{creatives} creatives</span>
      <span className="flex items-center gap-1.5">Synced {lastSync}</span>
    </div>

    <div className="flex items-center gap-2 ml-auto shrink-0">
      <button className="p-2 text-[#94A3B8] hover:text-white transition-colors">
        <RefreshCw size={16} />
      </button>
      <button className="p-2 text-[#94A3B8] hover:text-red-400 transition-colors">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

const PlatformIcon = ({ platform, size = 16 }: { platform: Platform, size?: number }) => {
  switch (platform) {
    case Platform.Meta: return <span className="font-black" style={{ fontSize: size }}>M</span>;
    case Platform.Google: return <span className="font-black" style={{ fontSize: size }}>G</span>;
    case Platform.TikTok: return <span className="font-black" style={{ fontSize: size }}>T</span>;
    default: return null;
  }
};

const SelectionRow = ({ label, id, disabled }: any) => (
  <label className={`flex items-center justify-between p-4 rounded-xl border border-[#334155] cursor-pointer transition-all ${disabled ? 'opacity-50 grayscale pointer-events-none' : 'hover:bg-white/5'}`}>
    <div className="space-y-0.5">
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-[10px] text-[#94A3B8] font-mono">{id}</p>
    </div>
    <div className={`w-5 h-5 rounded border border-[#334155] flex items-center justify-center transition-all ${!disabled && 'group-hover:border-[#8B5CF6]'}`}>
       {!disabled && <CheckCircle2 size={14} className="text-[#8B5CF6] opacity-0 group-hover:opacity-100" />}
    </div>
  </label>
);

export default AdAccountConnector;


import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, Globe, CreditCard, Users, 
  Shield, Check, ChevronRight, Plus, 
  MoreHorizontal, Mail, Key, Trash2, 
  AlertCircle, ExternalLink, Zap, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getWorkspace, 
  updateWorkspace, 
  listWorkspaceMembers, 
  inviteMember, 
  removeMember, 
  getSubscription, 
  getInvoices 
} from '../services/dbService';
import { Workspace, WorkspaceMember, Subscription, Invoice, WorkspaceRole } from '../types';

type SettingsTab = 'Workspace' | 'Billing' | 'Team' | 'Security';

const SettingsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Workspace');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [workspaceId] = useState('zieads-root-master'); // Fixed for implementation

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        if (activeTab === 'Workspace') {
          const ws = await getWorkspace(workspaceId);
          setWorkspace(ws);
        } else if (activeTab === 'Billing') {
          const [sub, invs] = await Promise.all([
            getSubscription(workspaceId),
            getInvoices(workspaceId)
          ]);
          setSubscription(sub);
          setInvoices(invs);
        } else if (activeTab === 'Team') {
          const m = await listWorkspaceMembers(workspaceId);
          setMembers(m);
        }
      } catch (err) {
        console.error("Settings load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [activeTab, workspaceId]);

  const handleSaveWorkspace = async () => {
    if (!workspace) return;
    setIsSaving(true);
    try {
      await updateWorkspace(workspaceId, workspace);
      alert("Settings saved successfully.");
    } catch (err) {
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInvite = async () => {
    const email = prompt("Enter team member email:");
    if (!email) return;
    try {
      await inviteMember(workspaceId, email, 'manager');
      alert("Invitation dispatched.");
      // Refresh members
      const m = await listWorkspaceMembers(workspaceId);
      setMembers(m);
    } catch (err) {
      alert("Failed to invite member.");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await removeMember(workspaceId, userId);
      setMembers(members.filter(m => m.user_id !== userId));
    } catch (err) {
      alert("Failed to remove member.");
    }
  };

  if (loading && !workspace && members.length === 0 && !subscription) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-[#8B5CF6]" size={48} />
        <p className="text-[#94A3B8] font-bold uppercase tracking-widest text-sm">Accessing Node Configuration...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0F172A] min-h-full font-sans text-[#F8FAFC]">
      {/* HEADER */}
      <header className="p-8 pb-0 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-[24px] font-semibold text-white">Platform Settings</h1>
            <p className="text-[14px] text-[#94A3B8]">Manage your workspace and team</p>
          </div>
          {activeTab === 'Workspace' && (
            <button 
              onClick={handleSaveWorkspace}
              disabled={isSaving}
              className="bg-[#8B5CF6] text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-[#7C3AED] transition-all flex items-center gap-2 shadow-lg shadow-[#8B5CF6]/10 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>

        {/* TABS */}
        <div className="flex gap-8 border-b border-[#334155]">
          {(['Workspace', 'Billing', 'Team', 'Security'] as SettingsTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium transition-all relative ${
                activeTab === tab ? 'text-white' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="settings-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5CF6]" />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="p-8 max-w-[900px] animate-in fade-in duration-500">
        {activeTab === 'Workspace' && workspace && (
          <div className="space-y-6">
            <SettingsCard title="General Information" description="How your workspace appears to your team.">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Workspace Name</label>
                  <input 
                    type="text" 
                    value={workspace.name} 
                    onChange={(e) => setWorkspace({...workspace, name: e.target.value})}
                    className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-lg text-sm outline-none focus:border-[#8B5CF6] text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Company Slug</label>
                  <input 
                    type="text" 
                    value={workspace.slug} 
                    readOnly
                    className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-lg text-sm outline-none opacity-50 cursor-not-allowed text-white" 
                  />
                </div>
              </div>
            </SettingsCard>

            <SettingsCard title="Localization" description="Used for reporting and currency calculations.">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Currency</label>
                  <select 
                    value={workspace.settings.currency}
                    onChange={(e) => setWorkspace({...workspace, settings: {...workspace.settings, currency: e.target.value}})}
                    className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-lg text-sm outline-none appearance-none text-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Timezone</label>
                  <select 
                    value={workspace.settings.timezone}
                    onChange={(e) => setWorkspace({...workspace, settings: {...workspace.settings, timezone: e.target.value}})}
                    className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-lg text-sm outline-none appearance-none text-white"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="EST">EST (Eastern Standard Time)</option>
                    <option value="PST">PST (Pacific Standard Time)</option>
                  </select>
                </div>
              </div>
            </SettingsCard>
          </div>
        )}

        {activeTab === 'Billing' && (
          <div className="space-y-6">
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 flex items-center justify-between shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 blur-3xl rounded-full"></div>
              <div className="space-y-2 relative z-10">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] text-[10px] font-bold rounded-md border border-[#8B5CF6]/20 uppercase tracking-widest">
                  <Zap size={12} fill="currentColor" /> {subscription?.plan_type || 'Starter'} Plan
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {subscription?.plan_type === 'scale' ? '$799' : subscription?.plan_type === 'growth' ? '$299' : '$99'} / month
                </h3>
                <p className="text-sm text-[#94A3B8]">
                  Status: <span className="capitalize text-teal-400 font-bold">{subscription?.status || 'Active'}</span> 
                  {subscription?.current_period_end && ` • Next billing: ${new Date(subscription.current_period_end).toLocaleDateString()}`}
                </p>
              </div>
              <button className="bg-[#1E293B] border border-[#334155] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-white/5 transition-all relative z-10 shadow-sm">
                Change Plan
              </button>
            </div>

            <SettingsCard title="Payment Method" description="Your primary method for subscription payments.">
              <div className="flex items-center justify-between p-4 bg-[#0F172A] border border-[#334155] rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-white/5 rounded-md flex items-center justify-center text-[10px] font-bold">VISA</div>
                  <div>
                    <p className="text-sm font-bold text-white">•••• •••• •••• 4242</p>
                    <p className="text-xs text-[#94A3B8]">Expires 12/28</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-[#8B5CF6] hover:underline">Update</button>
              </div>
            </SettingsCard>

            <SettingsCard title="Invoices" description="Download your recent billing history.">
              <div className="divide-y divide-[#334155]">
                {invoices.length > 0 ? invoices.map(inv => (
                  <InvoiceRow key={inv.id} date={new Date(inv.created_at).toLocaleDateString()} amount={`$${inv.amount}`} status={inv.status} />
                )) : (
                  <div className="py-8 text-center text-sm text-[#94A3B8] italic">No billing history available yet.</div>
                )}
              </div>
            </SettingsCard>
          </div>
        )}

        {activeTab === 'Team' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white">Team Members</h2>
              <button 
                onClick={handleInvite}
                className="bg-[#8B5CF6] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#7C3AED] transition-all flex items-center gap-2 shadow-lg shadow-[#8B5CF6]/10"
              >
                <Plus size={14} /> Invite Member
              </button>
            </div>
            
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-sm">
              <div className="divide-y divide-[#334155]">
                {members.length > 0 ? members.map(m => (
                  <TeamMemberRow 
                    key={m.id}
                    name={m.profile?.fullName || 'Pending Invitation'}
                    email={m.profile?.email || 'Awaiting response...'}
                    role={m.role}
                    avatar={m.profile?.fullName?.charAt(0) || '?'}
                    onRemove={() => handleRemoveMember(m.user_id)}
                  />
                )) : (
                  <div className="p-10 text-center text-slate-500 italic">Only you are currently in this workspace.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Security' && (
          <div className="space-y-6">
            <SettingsCard title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Authenticator App</p>
                  <p className="text-xs text-[#94A3B8]">Use an app like Google Authenticator to get codes.</p>
                </div>
                <div className="w-10 h-5 bg-[#8B5CF6] rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </SettingsCard>

            <SettingsCard title="API Access" description="Connect ZieAds to your custom tools via API.">
              <div className="space-y-4">
                <div className="p-4 bg-[#0F172A] border border-[#334155] rounded-xl flex items-center justify-between group">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">PROD_KEY_ZIE_001</p>
                    <p className="text-[10px] text-[#94A3B8] font-mono">Created on Jan 12, 2026</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-[#94A3B8] hover:text-white"><Key size={14} /></button>
                    <button className="p-2 text-[#94A3B8] hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
                <button className="text-xs font-bold text-[#8B5CF6] flex items-center gap-1.5 hover:underline">
                  <Plus size={14} /> Create New API Key
                </button>
              </div>
            </SettingsCard>

            <div className="pt-6">
               <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-red-400">Danger Zone</h4>
                    <p className="text-xs text-[#94A3B8]">Permanently delete this workspace and all associated data.</p>
                  </div>
                  <button className="px-4 py-2 border border-red-500/30 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
                    Delete Workspace
                  </button>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SettingsCard = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
  <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-sm">
    <div className="p-6 border-b border-[#334155]">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-sm text-[#94A3B8] mt-1">{description}</p>
    </div>
    <div className="p-6 bg-[#111827]/30">
      {children}
    </div>
  </div>
);

const InvoiceRow = ({ date, amount, status }: any) => (
  <div className="flex items-center justify-between py-4 group px-4">
    <div className="flex items-center gap-8">
      <span className="text-sm text-[#F8FAFC] w-24">{date}</span>
      <span className="text-sm font-bold text-white">{amount}</span>
    </div>
    <div className="flex items-center gap-6">
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
        status === 'paid' ? 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20' : 'text-red-400 bg-red-400/10 border-red-400/20'
      }`}>{status}</span>
      <button className="text-xs font-bold text-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        PDF <ExternalLink size={12} />
      </button>
    </div>
  </div>
);

const TeamMemberRow = ({ name, email, role, avatar, onRemove }: any) => (
  <div className="px-6 py-5 flex items-center justify-between group hover:bg-white/5 transition-all">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#8B5CF6]/20">
        {avatar}
      </div>
      <div>
        <p className="text-sm font-bold text-white">{name}</p>
        <p className="text-xs text-[#94A3B8]">{email}</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <span className="text-xs text-[#94A3B8] font-medium capitalize">{role}</span>
      <div className="flex items-center gap-2">
        <button onClick={onRemove} className="p-2 text-[#94A3B8] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <Trash2 size={16} />
        </button>
        <button className="p-2 text-[#94A3B8] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  </div>
);

export default SettingsModule;

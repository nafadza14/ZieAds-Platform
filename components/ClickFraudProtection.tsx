
import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, History as HistoryIcon, 
  CheckCircle2, AlertCircle, X, ChevronDown, 
  Lightbulb, Shield, Zap, Search, MoreHorizontal, Loader2, Undo2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  listOptimizationRules, 
  createOptimizationRule, 
  toggleOptimizationRule, 
  deleteOptimizationRule,
  fetchOptimizationSuggestions,
  applyOptimizationSuggestion,
  fetchOptimizationHistory,
  revertOptimizationAction
} from '../services/dbService';
import { OptimizationRule, OptimizationAction, OptimizationSuggestion } from '../types';

type AutoTab = 'Active Rules' | 'Suggestions' | 'History' | 'Safety';

const sparkData = [20, 35, 25, 45, 30, 55, 42];

const ClickFraudProtection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AutoTab>('Active Rules');
  const [showNewRuleModal, setShowNewRuleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [workspaceId] = useState('zieads-root-master'); // Mocked for now

  const [rules, setRules] = useState<OptimizationRule[]>([]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [history, setHistory] = useState<OptimizationAction[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'Active Rules') {
        const data = await listOptimizationRules(workspaceId);
        setRules(data);
      } else if (activeTab === 'Suggestions') {
        const data = await fetchOptimizationSuggestions(workspaceId);
        setSuggestions(data);
      } else if (activeTab === 'History') {
        const data = await fetchOptimizationHistory(workspaceId);
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleToggleRule = async (ruleId: string, currentStatus: boolean) => {
    try {
      await toggleOptimizationRule(ruleId, !currentStatus);
      setRules(rules.map(r => r.id === ruleId ? { ...r, is_active: !currentStatus } : r));
    } catch (err) {
      alert("Failed to toggle rule");
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteOptimizationRule(ruleId);
      setRules(rules.filter(r => r.id !== ruleId));
    } catch (err) {
      alert("Failed to delete rule");
    }
  };

  const handleApplySuggestion = async (suggestionId: string) => {
    try {
      await applyOptimizationSuggestion(suggestionId);
      setSuggestions(suggestions.map(s => s.id === suggestionId ? { ...s, is_applied: true } : s));
    } catch (err) {
      alert("Failed to apply suggestion");
    }
  };

  const handleRevertAction = async (actionId: string) => {
    try {
      await revertOptimizationAction(actionId);
      setHistory(history.map(a => a.id === actionId ? { ...a, reverted_at: new Date().toISOString() } : a));
    } catch (err) {
      alert("Failed to revert action");
    }
  };

  return (
    <div className="bg-[#0F172A] min-h-full p-6 text-[#F8FAFC] font-sans">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Automation Rules</h1>
          <p className="text-sm text-[#94A3B8]">Set up AI to manage your campaigns</p>
        </div>
        <button 
          onClick={() => setShowNewRuleModal(true)}
          className="bg-[#8B5CF6] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#7C3AED] transition-all flex items-center gap-2 shadow-lg shadow-[#8B5CF6]/10"
        >
          <Plus size={18} /> New Rule
        </button>
      </header>

      {/* TABS */}
      <div className="flex gap-8 border-b border-[#334155] mb-8">
        {(['Active Rules', 'Suggestions', 'History', 'Safety'] as AutoTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-medium transition-all relative ${
              activeTab === tab ? 'text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="auto-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5CF6]" />
            )}
          </button>
        ))}
      </div>

      <div className="max-w-[1200px] mx-auto space-y-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
             <Loader2 size={32} className="animate-spin text-[#8B5CF6]" />
             <p className="text-sm text-[#94A3B8] font-bold uppercase tracking-widest">Scanning automation hub...</p>
          </div>
        ) : (
          <>
            {activeTab === 'Active Rules' && (
              <>
                <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex items-center justify-between shadow-sm">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-[#94A3B8]">Total Executions</p>
                    <div className="flex items-end gap-4">
                      <span className="text-[48px] font-bold text-white leading-none">
                        {rules.reduce((acc, r) => acc + r.execution_count, 0)}
                      </span>
                      <div className="h-12 w-32 mb-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={sparkData.map((v, i) => ({ v, i }))}>
                            <Area type="monotone" dataKey="v" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-[#334155] flex items-center gap-3 text-xs font-medium text-[#94A3B8]">
                      <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-[#10B981]" /> Deployment engine healthy</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Status: Active</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rules.length > 0 ? rules.map(rule => (
                    <RuleCard 
                      key={rule.id}
                      rule={rule}
                      onToggle={() => handleToggleRule(rule.id, rule.is_active)}
                      onDelete={() => handleDeleteRule(rule.id)}
                    />
                  )) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                      <Zap size={48} className="mx-auto text-slate-700" />
                      <p className="text-slate-400">No active rules found. Set one up to start saving time.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'Suggestions' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white">AI Engine Signals:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.length > 0 ? suggestions.map(s => (
                    <SuggestionCard 
                      key={s.id}
                      suggestion={s}
                      onApply={() => handleApplySuggestion(s.id)}
                    />
                  )) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                      <Lightbulb size={48} className="mx-auto text-slate-700" />
                      <p className="text-slate-400">Awaiting more performance data to generate high-confidence signals.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'History' && (
              <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#334155]">
                      <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase">Time</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase">Action</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase">Campaign</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase">Trigger</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase">Result</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]/50">
                    {history.length > 0 ? history.map(item => (
                      <HistoryRow 
                        key={item.id} 
                        item={item} 
                        onRevert={() => handleRevertAction(item.id)}
                      />
                    )) : (
                      <tr>
                        <td colSpan={6} className="py-20 text-center text-slate-500 italic">No automation logs recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'Safety' && (
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 space-y-10 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Enable AI Automation</h3>
                <p className="text-sm text-[#94A3B8]">Allow the system to make changes automatically based on your rules.</p>
              </div>
              <Toggle active={true} />
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-[#334155]">
              <div className="space-y-4">
                <label className="text-sm font-medium text-white block">Max actions per day</label>
                <input type="number" defaultValue={50} className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-lg text-white outline-none focus:border-[#8B5CF6]" />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium text-white block">Email me about:</label>
                <select className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-lg text-white outline-none">
                  <option>All actions</option>
                  <option>Important only</option>
                  <option>None</option>
                </select>
              </div>
            </div>

            <div className="pt-10 border-t border-[#334155]">
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-red-400">Kill switch</h4>
                  <p className="text-sm text-[#94A3B8]">Stop all automation immediately across all campaigns.</p>
                </div>
                <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold transition-all">
                  Stop Everything
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NEW RULE MODAL */}
      <AnimatePresence>
        {showNewRuleModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewRuleModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pl-[240px] pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="pointer-events-auto w-full max-w-[600px] bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-[#334155] flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Create Automation Rule</h2>
                  <button onClick={() => setShowNewRuleModal(false)} className="p-2 text-[#94A3B8] hover:text-white rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                  {/* Step 1 */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest">Step 1: Condition</label>
                    <p className="text-sm font-medium text-white">When this happens:</p>
                    <select className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm outline-none">
                      <option>Cost per purchase (CPA) is more than $___</option>
                      <option>Return on ad spend (ROAS) drops below ___</option>
                      <option>Click rate (CTR) falls below ___%</option>
                      <option>Daily spend goes over $___</option>
                    </select>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest">Step 2: Action</label>
                    <p className="text-sm font-medium text-white">Do this:</p>
                    <select className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm outline-none">
                      <option>Pause the campaign</option>
                      <option>Increase budget by ___%</option>
                      <option>Decrease budget by ___%</option>
                      <option>Send an alert notification</option>
                    </select>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest">Step 3: Name & Scope</label>
                    <input type="text" placeholder="Rule Name (e.g. Stop Waste)" className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-sm" />
                    <div className="flex items-center gap-3 pt-2">
                       <input type="checkbox" checked readOnly className="w-4 h-4 rounded accent-[#8B5CF6]" />
                       <span className="text-xs text-[#94A3B8]">Apply to all active campaigns</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-[#334155] bg-[#111827]">
                  <button 
                    onClick={() => setShowNewRuleModal(false)}
                    className="w-full bg-[#8B5CF6] text-white py-4 rounded-lg font-bold text-base shadow-xl shadow-[#8B5CF6]/10 hover:bg-[#7C3AED] transition-all"
                  >
                    Deploy Rule
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub-components ---

const RuleCard = ({ rule, onToggle, onDelete }: { rule: OptimizationRule, onToggle: () => void, onDelete: () => void }) => (
  <div className={`bg-[#1E293B] border border-[#334155] rounded-xl p-6 space-y-6 shadow-sm relative group transition-all hover:border-[#8B5CF6]/50 ${!rule.is_active && 'opacity-60 grayscale-[0.5]'}`}>
    <div className="flex justify-between items-start">
      <h3 className="text-base font-semibold text-white">{rule.name}</h3>
      <div onClick={onToggle}>
        <Toggle active={rule.is_active} />
      </div>
    </div>
    
    <div className="space-y-2 py-2">
      <p className="text-sm text-[#F8FAFC]">
        <span className="font-bold">If</span> {rule.conditions.metric.toUpperCase()} {rule.conditions.operator} <span className="text-[#8B5CF6] font-bold">{rule.conditions.value}</span>
      </p>
      <p className="text-sm text-[#F8FAFC]">
        <span className="font-bold">Then</span> {rule.actions.type} {rule.actions.value ? `(${rule.actions.value}%)` : ''}
      </p>
    </div>

    <div className="pt-4 border-t border-[#334155] flex flex-col gap-1">
      <div className="text-[12px] text-[#94A3B8]">Last ran: <span className="text-white">{rule.last_executed_at ? new Date(rule.last_executed_at).toLocaleString() : 'Never'}</span></div>
      <div className="text-[12px] text-[#94A3B8]">Applied <span className="text-white">{rule.execution_count} times</span></div>
    </div>

    <div className="flex items-center gap-3 pt-2">
      <button className="text-[12px] font-bold text-[#94A3B8] hover:text-[#8B5CF6] flex items-center gap-1.5"><Edit2 size={12} /> Edit</button>
      <button className="text-[12px] font-bold text-[#94A3B8] hover:text-[#8B5CF6] flex items-center gap-1.5"><HistoryIcon size={12} /> View History</button>
      <div className="flex-1"></div>
      <button onClick={onDelete} className="p-2 text-[#94A3B8] hover:text-red-400"><Trash2 size={16} /></button>
    </div>
  </div>
);

const SuggestionCard = ({ suggestion, onApply }: { suggestion: OptimizationSuggestion, onApply: () => void }) => (
  <div className={`bg-[#1E293B] border border-[#334155] rounded-xl p-6 space-y-6 shadow-sm border-l-4 border-l-[#8B5CF6] ${suggestion.is_applied && 'opacity-60 pointer-events-none'}`}>
    <div className="flex items-center gap-2 text-[#8B5CF6]">
      <Lightbulb size={18} />
      <span className="text-xs font-bold uppercase tracking-widest">AI Performance Signal</span>
    </div>
    <div className="space-y-4">
      <h4 className="text-base font-bold text-white">{suggestion.title}</h4>
      <p className="text-sm text-[#F8FAFC] leading-relaxed">
        {suggestion.description}
      </p>
      <div className="flex items-center justify-between p-3 bg-[#8B5CF6]/10 rounded-lg">
         <span className="text-xs font-medium text-[#8B5CF6]">Expected Impact: {suggestion.expected_impact?.roas_change || 'N/A'} ROAS</span>
         <span className="text-[10px] font-bold text-[#94A3B8]">Confidence: {(suggestion.confidence_score * 100).toFixed(0)}%</span>
      </div>
    </div>
    <div className="flex gap-2">
      <button 
        onClick={onApply}
        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
          suggestion.is_applied ? 'bg-teal-500/20 text-teal-400' : 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED]'
        }`}
      >
        {suggestion.is_applied ? 'Applied' : 'Apply Suggestion'}
      </button>
      <button className="px-4 py-2 text-[#94A3B8] text-xs font-bold hover:text-white transition-all">Dismiss</button>
    </div>
  </div>
);

const HistoryRow = ({ item, onRevert }: { item: OptimizationAction, onRevert: () => void }) => (
  <tr className="hover:bg-[#0F172A]/50 transition-all group">
    <td className="px-6 py-4 text-sm text-[#94A3B8]">{new Date(item.executed_at).toLocaleTimeString()}</td>
    <td className="px-6 py-4">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white capitalize">{item.action_type.replace('_', ' ')}</span>
        <span className="text-[10px] text-slate-500 font-mono">ID: {item.id.slice(0, 8)}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-[#F8FAFC]">{item.campaign_name || 'Campaign'}</td>
    <td className="px-6 py-4 text-[12px] text-[#94A3B8]">
      {item.triggered_by?.metric} {item.triggered_by?.operator} {item.triggered_by?.threshold}
    </td>
    <td className="px-6 py-4">
      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
        item.result === 'success' ? 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20' : 'text-red-400 bg-red-400/10 border-red-400/20'
      }`}>
        {item.result}
      </span>
    </td>
    <td className="px-6 py-4">
      {item.action_type !== 'alert' && !item.reverted_at && (
        <button 
          onClick={onRevert}
          className="p-2 text-[#94A3B8] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded-lg transition-all flex items-center gap-1 text-xs"
        >
          <Undo2 size={14} /> Undo
        </button>
      )}
      {item.reverted_at && (
        <span className="text-[10px] text-slate-500 italic">Reverted</span>
      )}
    </td>
  </tr>
);

const Toggle = ({ active }: { active: boolean }) => (
  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${active ? 'bg-[#8B5CF6]' : 'bg-[#334155]'}`}>
    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${active ? 'right-0.5' : 'left-0.5'}`}></div>
  </div>
);

export default ClickFraudProtection;

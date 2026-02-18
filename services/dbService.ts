
import { supabase } from './supabaseClient';
import { 
  Campaign, AdCreative, UserProfile, ClickLog, FraudSummary, Platform, 
  BrandProfile, UnifiedMetric, CampaignObjective, CampaignStatus,
  AIGenerationJob, GenerationJobStatus, CreativeType, CreativeStatus,
  DashboardSummary, AnalyticsDaily,
  OptimizationRule, OptimizationAction, OptimizationSuggestion,
  Workspace, WorkspaceMember, WorkspaceRole, Subscription, Invoice, PlanType
} from '../types';

/**
 * --- WORKSPACE & USER SERVICES ---
 */

export const getWorkspace = async (workspaceId: string): Promise<Workspace> => {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', workspaceId)
    .single();

  if (error) throw error;
  return {
    ...data,
    ownerId: data.owner_id,
    planType: data.plan_type
  };
};

export const updateWorkspace = async (workspaceId: string, payload: Partial<Workspace>): Promise<void> => {
  const { error } = await supabase
    .from('workspaces')
    .update({
      name: payload.name,
      settings: payload.settings,
      updated_at: new Date().toISOString()
    })
    .eq('id', workspaceId);

  if (error) throw error;
};

export const completeWorkspaceOnboarding = async (workspaceId: string, data: any): Promise<void> => {
  const { error } = await supabase
    .from('workspaces')
    .update({
      name: data.workspace_name,
      slug: data.workspace_name.toLowerCase().replace(/\s+/g, '-'),
      settings: {
        timezone: data.timezone,
        currency: data.currency,
        notifications: data.notifications || true,
        ad_types: data.ad_types,
        monthly_spend: data.monthly_spend
      },
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', workspaceId);

  if (error) throw error;
};

export const listWorkspaceMembers = async (workspaceId: string): Promise<WorkspaceMember[]> => {
  const { data, error } = await supabase
    .from('workspace_members')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('workspace_id', workspaceId);

  if (error) throw error;
  return data || [];
};

export const inviteMember = async (workspaceId: string, email: string, role: WorkspaceRole): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from('workspace_members')
    .insert([{
      workspace_id: workspaceId,
      role: role,
      invited_by: user.id,
      status: 'pending'
    }]);

  if (error) throw error;
};

export const removeMember = async (workspaceId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('workspace_members')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId);

  if (error) throw error;
};

/**
 * --- BILLING SERVICES ---
 */

export const getSubscription = async (workspaceId: string): Promise<Subscription | null> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('workspace_id', workspaceId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getInvoices = async (workspaceId: string): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * --- AUTOMATION SERVICES ---
 */

export const createOptimizationRule = async (payload: Partial<OptimizationRule>): Promise<OptimizationRule> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from('optimization_rules')
    .insert([{ ...payload, created_by: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const listOptimizationRules = async (workspaceId: string): Promise<OptimizationRule[]> => {
  const { data, error } = await supabase
    .from('optimization_rules')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const toggleOptimizationRule = async (ruleId: string, isActive: boolean): Promise<void> => {
  const { error } = await supabase
    .from('optimization_rules')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', ruleId);

  if (error) throw error;
};

export const deleteOptimizationRule = async (ruleId: string): Promise<void> => {
  const { error } = await supabase
    .from('optimization_rules')
    .delete()
    .eq('id', ruleId);

  if (error) throw error;
};

export const fetchOptimizationSuggestions = async (workspaceId: string, unreadOnly: boolean = false): Promise<OptimizationSuggestion[]> => {
  let query = supabase
    .from('optimization_suggestions')
    .select('*, campaign:campaigns(name)')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(s => ({
    ...s,
    campaign_name: s.campaign?.name
  }));
};

export const applyOptimizationSuggestion = async (suggestionId: string): Promise<void> => {
  await new Promise(r => setTimeout(r, 1000));
  const { error } = await supabase
    .from('optimization_suggestions')
    .update({ is_applied: true, is_read: true })
    .eq('id', suggestionId);
  if (error) throw error;
};

export const fetchOptimizationHistory = async (workspaceId: string, limit: number = 20, offset: number = 0): Promise<OptimizationAction[]> => {
  const { data, error } = await supabase
    .from('optimization_actions')
    .select('*, campaign:campaigns(name), rule:optimization_rules(name)')
    .eq('workspace_id', workspaceId)
    .order('executed_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return (data || []).map(a => ({ ...a, campaign_name: a.campaign?.name }));
};

export const revertOptimizationAction = async (actionId: string): Promise<void> => {
  await new Promise(r => setTimeout(r, 1000));
  const { error } = await supabase
    .from('optimization_actions')
    .update({ reverted_at: new Date().toISOString() })
    .eq('id', actionId);
  if (error) throw error;
};

/**
 * --- ANALYTICS SERVICES ---
 */

export const fetchDashboardSummary = async (workspaceId: string, range: string = '7d'): Promise<DashboardSummary> => {
  try {
    const { data: cache } = await supabase
      .from('dashboard_cache')
      .select('data')
      .eq('workspace_id', workspaceId)
      .eq('cache_key', `dashboard_${range}`)
      .single();
    if (cache) return cache.data as DashboardSummary;
    return await mockCalculateDashboardSummary(workspaceId, range);
  } catch (e) {
    return await mockCalculateDashboardSummary(workspaceId, range);
  }
};

const mockCalculateDashboardSummary = async (workspaceId: string, range: string): Promise<DashboardSummary> => {
  const days = range === '30d' ? 30 : 7;
  const trend = Array.from({ length: days }).map((_, i) => ({
    date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    revenue: Math.floor(Math.random() * 5000) + 2000,
    spend: Math.floor(Math.random() * 2000) + 1000
  }));
  const totalSpend = trend.reduce((acc, curr) => acc + curr.spend, 0);
  const totalRevenue = trend.reduce((acc, curr) => acc + curr.revenue, 0);
  return {
    summary: { total_spend: totalSpend, total_revenue: totalRevenue, total_roas: totalRevenue / totalSpend, total_conversions: Math.floor(totalSpend / 42) },
    by_platform: [{ platform: Platform.Meta, spend: totalSpend * 0.55, roas: 3.2 }, { platform: Platform.Google, spend: totalSpend * 0.30, roas: 2.8 }, { platform: Platform.TikTok, spend: totalSpend * 0.15, roas: 4.1 }],
    by_campaign: [{ id: '1', name: 'Summer Launch V1', spend: 4500, revenue: 15400, roas: 3.42 }, { id: '2', name: 'Retargeting Global', spend: 2100, revenue: 8200, roas: 3.90 }, { id: '3', name: 'Search Brand Alpha', spend: 1200, revenue: 4500, roas: 3.75 }],
    trend,
    cached_at: new Date().toISOString()
  };
};

export const fetchCampaignAnalytics = async (campaignId: string): Promise<any> => {
  const { data, error } = await supabase.from('analytics_daily').select('*').eq('campaign_id', campaignId).order('date', { ascending: true });
  if (error) throw error;
  return data;
};

export const triggerAnalyticsSync = async (workspaceId: string) => {
  console.log(`[Edge Function] Syncing analytics for workspace ${workspaceId}...`);
  await new Promise(r => setTimeout(r, 2000));
  return { status: 'success', timestamp: new Date().toISOString() };
};

/**
 * --- CREATIVE SERVICES ---
 */

export const startCreativeGeneration = async (payload: { workspace_id: string; product_url?: string; product_description?: string; brand_voice: string; platforms: Platform[]; count: number; include_video: boolean; focus: string; }): Promise<AIGenerationJob> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const jobPayload = { workspace_id: payload.workspace_id, user_id: user.id, job_type: 'full_creative', status: 'queued', input_params: payload, created_at: new Date().toISOString() };
  const { data: job, error } = await supabase.from('ai_generation_jobs').insert([jobPayload]).select().single();
  if (error) throw error;
  mockEdgeCreativeEngine(job.id, payload);
  return job;
};

const mockEdgeCreativeEngine = async (jobId: string, params: any) => {
  console.log(`[Edge Function] AI Generation started for job ${jobId}...`);
  await supabase.from('ai_generation_jobs').update({ status: 'processing', started_at: new Date().toISOString() }).eq('id', jobId);
  await new Promise(r => setTimeout(r, 2000));
  const creativeIds: string[] = [];
  for (let i = 0; i < params.count; i++) {
    const { data: creative } = await supabase.from('creatives').insert([{ workspace_id: params.workspace_id, name: `${params.brand_voice}_Variation_${i + 1}`, platform: params.platforms[0] || Platform.Universal, type: params.include_video ? CreativeType.Video : CreativeType.Image, headline: `Winning Headline #${i + 1}`, description: `Description for ${params.brand_voice}.`, cta_text: 'Shop Now', asset_urls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'], predicted_ctr: (Math.random() * 0.05) + 0.01, predicted_score: Math.floor(Math.random() * 20) + 80, ai_generated: true, status: 'draft', metadata: { style: params.brand_voice }, created_by: params.user_id }]).select().single();
    if (creative) creativeIds.push(creative.id);
  }
  await supabase.from('ai_generation_jobs').update({ status: 'completed', completed_at: new Date().toISOString(), result_ids: creativeIds }).eq('id', jobId);
};

export const getGenerationJob = async (jobId: string): Promise<AIGenerationJob> => {
  const { data, error } = await supabase.from('ai_generation_jobs').select('*').eq('id', jobId).single();
  if (error) throw error;
  return data;
};

export const listCreatives = async (filters: { workspace_id: string; status?: CreativeStatus; platform?: Platform; sort_by?: 'created_at' | 'predicted_score'; limit?: number; offset?: number; }): Promise<AdCreative[]> => {
  let query = supabase.from('creatives').select('*').eq('workspace_id', filters.workspace_id);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.platform) query = query.eq('platform', filters.platform);
  query = query.order(filters.sort_by || 'created_at', { ascending: false });
  const { data, error } = await query.range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 20) - 1);
  if (error) throw error;
  return data || [];
};

export const deployCreative = async (creativeId: string, campaignId: string, platform: Platform) => {
  await new Promise(r => setTimeout(r, 1500));
  const { error } = await supabase.from('creatives').update({ status: 'active', campaign_id: campaignId }).eq('id', creativeId);
  if (error) throw error;
  return { success: true, platform_asset_id: `ext_asset_${Math.random().toString(36).substr(2, 9)}` };
};

export const orchestrateCampaignPublish = async (campaignData: any, creatives: AdCreative[]): Promise<Campaign> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: campaign, error } = await supabase.from('campaigns').insert([{ ...campaignData, status: 'active', created_by: user.id }]).select().single();
  if (error) throw error;
  return campaign as Campaign;
};

export const listCampaigns = async (filters: { workspace_id: string; status?: CampaignStatus }) => {
  let query = supabase.from('campaigns').select('*').eq('workspace_id', filters.workspace_id);
  if (filters.status) query = query.eq('status', filters.status);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const updateCampaignStatus = async (campaignId: string, status: CampaignStatus) => {
  const { data, error } = await supabase.from('campaigns').update({ status }).eq('id', campaignId).select().single();
  if (error) throw error;
  return data;
};

export const updateWorkspaceBrandProfile = async (workspaceId: string, profile: BrandProfile) => true;


export enum Platform {
  Meta = 'meta',
  Google = 'google',
  TikTok = 'tiktok',
  Universal = 'universal'
}

export type SyncStatus = 'Active' | 'Syncing' | 'Error' | 'Paused' | 'Pending' | 'Not Connected' | 'Idle';
export type HealthStatus = 'Optimal' | 'Stable' | 'Critical';
export type ActivityStatus = 'Success' | 'Failed' | 'Retrying' | 'Pending';
export type UserRole = 'Owner' | 'Admin' | 'Manager' | 'Analyst' | 'Viewer';

export interface UserProfile {
  id: string;
  fullName: string;
  companyName: string;
  brandSummary: string;
  brandVoice: string;
  websiteUrl: string;
  logoUrl?: string;
  avatarUrl?: string;
  email?: string;
}

export enum CampaignObjective {
  Awareness = 'awareness',
  Traffic = 'traffic',
  Engagement = 'engagement',
  Conversions = 'conversions',
  Sales = 'sales',
  Leads = 'leads'
}

export type CampaignStatus = 'draft' | 'pending' | 'active' | 'learning' | 'paused' | 'error' | 'completed';

export interface CampaignTargeting {
  audiences?: string[];
  locations?: string[];
  age_min?: number;
  age_max?: number;
  genders?: string[];
  languages?: string[];
  interests?: string[];
  behaviors?: string[];
}

export interface Campaign {
  id: string;
  workspace_id: string;
  platform_account_id?: string;
  platform: Platform;
  platform_campaign_id?: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  budget_daily: number;
  budget_total?: number;
  start_date: string;
  end_date?: string;
  targeting: CampaignTargeting;
  settings: Record<string, any>;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  ai_managed?: boolean;
}

export enum CreativeType {
  Image = 'image',
  Video = 'video',
  Carousel = 'carousel',
  Text = 'text'
}

export type CreativeStatus = 'generating' | 'draft' | 'active' | 'paused' | 'archived';

export interface AdCreative {
  id: string;
  workspace_id: string;
  campaign_id?: string;
  name: string;
  platform: Platform;
  type: CreativeType;
  headline?: string;
  description?: string;
  cta_text?: string;
  asset_urls: string[];
  predicted_ctr: number;
  predicted_score: number;
  ai_generated: boolean;
  ai_model?: string;
  generation_prompt?: string;
  status: CreativeStatus;
  metadata: {
    colors?: string[];
    fonts?: string[];
    style?: string;
    reference_creatives?: string[];
  };
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type WorkspaceRole = 'owner' | 'admin' | 'manager' | 'viewer';
export type MemberStatus = 'pending' | 'active' | 'removed';
export type PlanType = 'starter' | 'growth' | 'scale' | 'enterprise';

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  invited_by?: string;
  invited_at: string;
  joined_at?: string;
  status: MemberStatus;
  // UI Helpers
  profile?: UserProfile;
}

export interface WorkspaceUsageStats {
  scans_this_month: number;
  creatives_generated: number;
  campaigns_active: number;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  planType: PlanType;
  settings: {
    timezone: string;
    currency: string;
    notifications: boolean;
  };
  usage_stats: WorkspaceUsageStats;
  onboarding_completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  campaigns?: Campaign[];
  brandInfo?: BrandInfo;
}

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';

export interface Subscription {
  id: string;
  workspace_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  stripe_price_id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  trial_ends_at?: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  usage_this_period: any;
  created_at: string;
  updated_at: string;
}

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

export interface Invoice {
  id: string;
  workspace_id: string;
  stripe_invoice_id: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  invoice_pdf?: string;
  period_start: string;
  period_end: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  workspace_id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: any;
  ip_address?: string;
  created_at: string;
}

export interface BrandDNA {
  narrative: string;
  audience: string;
  visuals: string;
}

export interface BrandInfo {
  id?: string;
  workspaceId?: string;
  name: string;
  summary: string;
  description: string;
  tone: string;
  primaryColor: string;
  secondaryColor: string;
  colors: string[];
  products: string[];
  audiences: string[];
  url?: string;
  logoUrl?: string;
  dna?: BrandDNA;
}

export interface BrandProfile extends BrandInfo {
  workspace_id?: string;
}

export interface UnifiedMetric {
  date: string;
  platform: Platform;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roas: number;
  cpa: number;
  ctr?: number;
  cpc?: number;
}

// Added missing interface AnalyticsDaily for dbService.ts
export interface AnalyticsDaily {
  id: string;
  campaign_id: string;
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

// Added missing interface DashboardSummary for Dashboard.tsx and dbService.ts
export interface DashboardSummary {
  summary: { 
    total_spend: number; 
    total_revenue: number; 
    total_roas: number; 
    total_conversions: number; 
  };
  by_platform: { 
    platform: Platform; 
    spend: number; 
    roas: number; 
  }[];
  by_campaign: { 
    id: string; 
    name: string; 
    spend: number; 
    revenue: number; 
    roas: number; 
  }[];
  trend: {
    date: string;
    revenue: number;
    spend: number;
  }[];
  cached_at: string;
}

export interface Recommendation {
  id: string;
  type: 'optimization' | 'budget' | 'creative';
  title: string;
  description: string;
  impact: string;
}

export interface SmartUpdate {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'performance' | 'security' | 'creative';
}

export interface ClickLog {
  id: string;
  timestamp: string;
  ip: string;
  user_agent: string;
  platform: Platform;
  is_fraud: boolean;
}

export interface FraudSummary {
  total_clicks: number;
  blocked_clicks: number;
  savings: number;
}

export type GenerationJobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface AIGenerationJob {
  id: string;
  workspace_id: string;
  user_id: string;
  job_type: 'text_generation' | 'image_generation' | 'video_generation' | 'full_creative';
  status: GenerationJobStatus;
  input_params: any;
  result_ids?: string[];
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface OptimizationRule {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  conditions: {
    metric: 'cpa' | 'roas' | 'ctr' | 'spend' | 'conversions' | 'frequency';
    operator: '>' | '<' | '=' | '>=' | '<=';
    value: number;
    time_window: '1h' | '24h' | '7d' | 'lifetime';
    min_spend?: number;
  };
  actions: {
    type: 'pause' | 'scale' | 'alert' | 'rotate_creative';
    value?: number;
    notify: boolean;
    max_daily_applications?: number;
  };
  scope: {
    campaigns: string[] | 'all';
    platforms: Platform[];
    exclude_campaigns?: string[];
  };
  execution_count: number;
  last_executed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OptimizationAction {
  id: string;
  workspace_id: string;
  rule_id?: string;
  campaign_id?: string;
  campaign_name?: string; // UI helper
  action_type: 'pause' | 'activate' | 'scale_up' | 'scale_down' | 'rotate_creative' | 'alert';
  action_details: any;
  triggered_by: any;
  executed_at: string;
  result: 'success' | 'failed' | 'pending';
  result_details?: string;
  reverted_at?: string;
}

export interface OptimizationSuggestion {
  id: string;
  workspace_id: string;
  type: 'scale' | 'pause' | 'rotate' | 'reallocate';
  title: string;
  description: string;
  campaign_id: string;
  campaign_name?: string; // UI helper
  recommended_action: any;
  expected_impact: any;
  confidence_score: number;
  is_read: boolean;
  is_applied: boolean;
  created_at: string;
}

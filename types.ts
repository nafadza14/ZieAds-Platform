
export enum Platform {
  Meta = 'Meta',
  Google = 'Google',
  TikTok = 'TikTok',
  LinkedIn = 'LinkedIn',
  Pinterest = 'Pinterest',
  X = 'X',
  Snapchat = 'Snapchat',
  Bing = 'Bing'
}

export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'analyst';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  companyName?: string;
  brandSummary?: string;
  brandVoice?: string;
  websiteUrl?: string;
  logoUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  plan_type: string;
  created_at: string;
  campaigns?: Campaign[];
  brandProfile?: BrandProfile;
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
}

export interface Integration {
  id: string;
  workspace_id: string;
  platform: Platform;
  account_id: string;
  sync_status: string;
  created_at: string;
}

export enum CampaignType {
  Instant = 'Instant AI-Driven',
  SmartMulti = 'Smart Multi-Platform',
  Manual = 'Manual Single-Platform'
}

export interface Campaign {
  id: string;
  workspace_id: string;
  integration_id?: string;
  external_id?: string;
  name: string;
  status: string;
  objective: string;
  daily_budget: number;
  health_score: number;
  ai_managed: boolean;
  created_at: string;
  metrics?: CampaignMetrics;
  // Publishing fields
  type?: CampaignType | string;
  budget?: number;
  duration?: number;
  platforms?: Platform[];
  audience?: string;
  region?: string;
  startDate?: string;
  endDate?: string;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  spend: number;
  revenue: number;
  roas: number;
  cpa: number;
}

export interface BrandDNA {
  narrative: string;
  audience: string;
  visuals: string;
}

/**
 * BrandProfile represents the identity of a business.
 * workspace_id is made optional as profiles are often synthesized before workspace assignment.
 */
export interface BrandProfile {
  workspace_id?: string;
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

/**
 * AdCreative represents a generated advertisement asset.
 */
export interface AdCreative {
  platform: Platform;
  headline: string;
  primaryText: string;
  cta: string;
  imageUrl: string;
  predictedCTR: number;
}

export interface AIInsight {
  id: string;
  workspace_id: string;
  entity_type: 'campaign' | 'creative' | 'automation';
  entity_id: string;
  insight_type: 'fatigue' | 'performance_drop' | 'budget_imbalance';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  resolved: boolean;
  created_at: string;
}

export enum CampaignObjective {
  Awareness = 'Awareness',
  Traffic = 'Traffic',
  Leads = 'Leads',
  Sales = 'Sales'
}

export interface ClickLog {
  id: string;
  workspace_id: string;
  ipAddress: string;
  userAgent: string;
  fingerprint: string;
  threatType: string;
  platform: Platform;
  timestamp: string;
}

export interface FraudSummary {
  workspace_id: string;
  totalScannedClicks: number;
  totalFraudBlocked: number;
  excludedIpsCount: number;
  moneySaved: number;
}

export interface Recommendation {
  id: string;
  type: 'optimization' | 'budget' | 'creative';
  title: string;
  description: string;
  impact: string;
}

export interface AdAccount {
  id: string;
  platform: Platform;
  accountId: string;
  status: 'active' | 'error' | 'disconnected';
}

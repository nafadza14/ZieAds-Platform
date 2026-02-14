
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

export enum CampaignType {
  InstantAI = 'Instant AI-Driven',
  SmartMulti = 'Smart Multi-Platform',
  Manual = 'Manual Single-Platform'
}

export enum CampaignObjective {
  Awareness = 'Awareness',
  Traffic = 'Traffic',
  Leads = 'Leads',
  Sales = 'Sales'
}

export type CampaignStatus = 'draft' | 'pending_review' | 'publishing' | 'active' | 'paused' | 'completed';

export interface UserProfile {
  id: string;
  fullName: string;
  companyName: string;
  brandSummary: string;
  brandVoice: string;
  websiteUrl: string;
  logoUrl?: string;
}

export interface BrandDNA {
  narrative: string;
  audience: string;
  visuals: string;
}

export interface BrandProfile {
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

export interface Business {
  id: string;
  name: string;
  brandProfile: BrandProfile | null;
  campaigns: Campaign[];
}

export interface AdCreative {
  id?: string;
  platform: Platform;
  headline: string;
  primaryText: string;
  cta: string;
  imageUrl?: string;
  predictedCTR?: number;
  imagePrompt?: string; // Prompt used to generate the image
}

export interface AdAccount {
  id: string;
  platform: Platform;
  accountId: string;
  status: 'active' | 'error' | 'disconnected';
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  type: CampaignType;
  platforms: Platform[];
  objective: CampaignObjective;
  audience: string;
  creatives: AdCreative[];
  budget: number;
  duration: number;
  status: CampaignStatus;
  createdAt: string;
  region?: string;
  startDate?: string;
  endDate?: string;
  metrics: {
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    roas: number;
  };
}

export interface Recommendation {
  id: string;
  type: 'optimization' | 'budget' | 'creative';
  title: string;
  description: string;
  impact: string;
}

export type ThreatType = 'Bot Behavior' | 'Repeated Click' | 'Proxy/VPN' | 'Suspicious IP';

export interface ClickLog {
  id: string;
  businessId: string;
  ipAddress: string;
  userAgent: string;
  fingerprint: string;
  threatType: ThreatType;
  platform: Platform;
  timestamp: string;
}

export interface FraudSummary {
  businessId: string;
  totalScannedClicks: number;
  totalFraudBlocked: number;
  excludedIpsCount: number;
  moneySaved: number;
}

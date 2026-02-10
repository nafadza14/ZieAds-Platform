
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

export interface BrandProfile {
  name: string;
  summary: string;
  tone: string;
  colors: string[];
  products: string[];
  audiences: string[];
  url?: string;
}

export interface AdCreative {
  headline: string;
  primaryText: string;
  cta: string;
  imageUrl?: string;
  predictedCTR?: number;
}

export interface Campaign {
  id: string;
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
  metrics: {
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    roas: number;
  };
}

export interface Business {
  id: string;
  name: string;
  brandProfile: BrandProfile | null;
  campaigns: Campaign[];
}

export interface Recommendation {
  id: string;
  type: 'optimization' | 'budget' | 'creative';
  title: string;
  description: string;
  impact: string;
}

export interface ClickFraudStats {
  scannedClicks: number;
  blockedClicks: number;
  blockedIps: number;
  moneySaved: number;
}


import { supabase } from './supabaseClient';
import { Campaign, AdCreative, UserProfile, ClickLog, FraudSummary, Platform, BrandProfile } from '../types';

export const orchestrateCampaignPublish = async (
  campaign: Partial<Campaign> & { business_id?: string },
  creatives: AdCreative[]
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");

  // 1. Create Campaign Record with the new UI fields
  const { data: campaignData, error: campaignError } = await supabase
    .from('campaigns')
    .insert([{
      user_id: user.id,
      business_id: campaign.business_id,
      name: campaign.name,
      type: campaign.type,
      objective: campaign.objective,
      budget: campaign.budget,
      duration: campaign.duration,
      platforms: campaign.platforms,
      target_audience: campaign.audience,
      region: campaign.region,
      start_date: campaign.startDate,
      end_date: campaign.endDate,
      status: 'active'
    }])
    .select()
    .single();

  if (campaignError) throw campaignError;

  // 2. Create Ad Records
  const adsToInsert = creatives.map(ad => ({
    campaign_id: campaignData.id,
    platform: ad.platform,
    headline: ad.headline,
    primary_text: ad.primaryText,
    cta: ad.cta,
    image_url: ad.imageUrl,
    predicted_ctr: ad.predictedCTR
  }));

  const { error: adsError } = await supabase.from('ads').insert(adsToInsert);
  if (adsError) throw adsError;

  // 3. LOG AI USAGE
  await supabase.from('system_logs').insert([{
    event_type: 'AI_GEN',
    user_id: user.id,
    severity: 'info',
    payload: {
      campaign_id: campaignData.id,
      platforms: campaign.platforms,
      creative_count: creatives.length,
      model: 'gemini-3-flash-preview'
    }
  }]);

  return campaignData;
};

export const updateBusinessBrandProfile = async (businessId: string, profile: BrandProfile) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Use UPSERT logic on business_id (requires unique constraint in DB)
  // Ensure the 'dna' field is included in the payload
  const payload = {
    business_id: businessId,
    name: profile.name,
    description: profile.summary,
    tone: profile.tone,
    primary_color: profile.primaryColor,
    secondary_color: profile.secondaryColor,
    products: profile.products,
    audiences: profile.audiences,
    logo_url: profile.logoUrl,
    dna: profile.dna // This is the AI analysis result
  };

  const { error } = await supabase
    .from('brand_profiles')
    .upsert(payload, { onConflict: 'business_id' });

  if (error) {
    console.error("Supabase Upsert Error:", error);
    throw error;
  }
};

export const fetchUserProfile = async (): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  if (!data) return null;

  return {
    id: data.id,
    fullName: data.full_name,
    companyName: data.company_name,
    brandSummary: data.brand_summary,
    brandVoice: data.brand_voice,
    websiteUrl: data.website_url,
    logoUrl: data.logo_url
  };
};

export const updateUserProfile = async (profile: Partial<UserProfile>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: profile.fullName,
      company_name: profile.companyName,
      brand_summary: profile.brandSummary,
      brand_voice: profile.brandVoice,
      website_url: profile.websiteUrl,
      logo_url: profile.logoUrl,
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
};

export const fetchClickLogs = async (businessId: string): Promise<ClickLog[]> => {
  return [
    { id: '1', businessId, ipAddress: '192.168.1.45', userAgent: 'Mozilla/5.0...', fingerprint: 'hash_1', threatType: 'Bot Behavior', platform: Platform.Meta, timestamp: '2 mins ago' },
    { id: '2', businessId, ipAddress: '45.12.8.192', userAgent: 'Mozilla/5.0...', fingerprint: 'hash_2', threatType: 'Suspicious IP', platform: Platform.Google, timestamp: '14 mins ago' },
    { id: '3', businessId, ipAddress: '88.192.34.11', userAgent: 'Mozilla/5.0...', fingerprint: 'hash_3', threatType: 'Repeated Click', platform: Platform.TikTok, timestamp: '1 hour ago' },
    { id: '4', businessId, ipAddress: '2.100.45.12', userAgent: 'Mozilla/5.0...', fingerprint: 'hash_4', threatType: 'Proxy/VPN', platform: Platform.Meta, timestamp: '3 hours ago' },
  ];
};

export const fetchFraudSummary = async (businessId: string): Promise<FraudSummary> => {
  return {
    businessId,
    totalScannedClicks: 14534,
    totalFraudBlocked: 1451,
    excludedIpsCount: 491,
    moneySaved: 748.50
  };
};

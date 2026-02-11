
import { supabase } from './supabaseClient';
import { Campaign, AdCreative, UserProfile } from '../types';

export const orchestrateCampaignPublish = async (
  campaign: Partial<Campaign>,
  creatives: AdCreative[]
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");

  // 1. Create Campaign Record
  const { data: campaignData, error: campaignError } = await supabase
    .from('campaigns')
    .insert([{
      user_id: user.id,
      name: campaign.name,
      type: campaign.type,
      objective: campaign.objective,
      budget: campaign.budget,
      duration: campaign.duration,
      platforms: campaign.platforms,
      target_audience: campaign.audience,
      status: 'active'
    }])
    .select()
    .single();

  if (campaignError) throw campaignError;

  // 2. Create Ad Records for each platform/creative
  const adsToInsert = creatives.map(ad => ({
    campaign_id: campaignData.id,
    platform: ad.platform,
    headline: ad.headline,
    primary_text: ad.primaryText,
    cta: ad.cta,
    image_url: ad.imageUrl,
    predicted_ctr: ad.predictedCTR
  }));

  const { error: adsError } = await supabase
    .from('ads')
    .insert(adsToInsert);

  if (adsError) throw adsError;

  return campaignData;
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

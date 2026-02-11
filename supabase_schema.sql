
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (User & Brand Settings)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  brand_summary TEXT,
  brand_voice TEXT,
  website_url TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AD ACCOUNTS (Multi-platform OAuth tokens)
CREATE TABLE IF NOT EXISTS ad_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'Meta', 'Google', 'TikTok', etc.
  account_id TEXT NOT NULL,
  access_token_encrypted TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform, account_id)
);

-- 3. CAMPAIGNS (Cross-platform metadata)
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'InstantAI', 'SmartMulti', 'Manual'
  objective TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  duration INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  platforms TEXT[] NOT NULL,
  target_audience TEXT,
  metrics JSONB DEFAULT '{"spend": 0, "clicks": 0, "conversions": 0, "roas": 0}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ADS (AI-generated creative content)
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  headline TEXT,
  primary_text TEXT,
  cta TEXT,
  image_url TEXT,
  predicted_ctr NUMERIC,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile" ON profiles 
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage their own ad accounts" ON ad_accounts 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own campaigns" ON campaigns 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own ads" ON ads 
  FOR ALL USING (campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid()));

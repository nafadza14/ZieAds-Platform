
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (User account settings)
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

-- 2. BUSINESSES (Entity level)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BRAND PROFILES (Marketing DNA per business)
CREATE TABLE IF NOT EXISTS brand_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  tone TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  products TEXT[],
  audiences TEXT[],
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AD ACCOUNTS
CREATE TABLE IF NOT EXISTS ad_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  account_id TEXT NOT NULL,
  access_token_encrypted TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform, account_id)
);

-- 5. CAMPAIGNS (Linked to business)
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  objective TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  duration INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  platforms TEXT[] NOT NULL,
  target_audience TEXT,
  metrics JSONB DEFAULT '{"spend": 0, "clicks": 0, "conversions": 0, "roas": 0}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ADS
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

-- 7. ADMIN CONTROL PLANE TABLES
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  severity TEXT DEFAULT 'info',
  payload JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage their own businesses" ON businesses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage brand profiles of their businesses" ON brand_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM businesses WHERE businesses.id = business_id AND businesses.user_id = auth.uid())
);
CREATE POLICY "Users can manage their own ad accounts" ON ad_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own campaigns" ON campaigns FOR ALL USING (auth.uid() = user_id);

-- Admin Policy
CREATE POLICY "Admins can view all logs" ON system_logs FOR SELECT USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@zieads.com'
);


-- ZieAds Production Schema
-- Multi-workspace data isolation with AI integration layers

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (Public User Data)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workspaces (Business Entities)
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_type TEXT DEFAULT 'free', -- free, starter, growth, scale
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Workspace Members (RBAC)
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member, analyst
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- 4. Integrations (Encrypted Ad Accounts)
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- Meta, Google, TikTok
  account_id TEXT NOT NULL,
  access_token TEXT, -- Encrypted at rest
  refresh_token TEXT,
  token_expiry TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Campaigns (Execution Layer)
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  integration_id UUID REFERENCES integrations(id) ON DELETE SET NULL,
  external_id TEXT,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  objective TEXT,
  daily_budget NUMERIC DEFAULT 0,
  health_score NUMERIC DEFAULT 100,
  ai_managed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Daily Campaign Metrics (Reporting Layer)
CREATE TABLE IF NOT EXISTS campaign_metrics_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  spend NUMERIC DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  roas NUMERIC DEFAULT 0,
  cpa NUMERIC DEFAULT 0,
  UNIQUE(campaign_id, date)
);

-- 7. Creatives (Asset Library)
CREATE TABLE IF NOT EXISTS creatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  type TEXT, -- poster, video, carousel
  asset_path TEXT, -- Storage reference
  ai_generated BOOLEAN DEFAULT FALSE,
  fatigue_score NUMERIC DEFAULT 0,
  performance_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Daily Creative Metrics
CREATE TABLE IF NOT EXISTS creative_metrics_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creative_id UUID REFERENCES creatives(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  spend NUMERIC DEFAULT 0,
  roas NUMERIC DEFAULT 0,
  UNIQUE(creative_id, date)
);

-- 9. Automation Rules
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_condition JSONB,
  action_payload JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AI Insights (The Alert Layer)
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  entity_type TEXT, -- campaign, creative, automation
  entity_id UUID,
  insight_type TEXT, -- fatigue, drop, budget_imbalance
  severity TEXT, -- info, warning, critical
  message TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Billing
CREATE TABLE IF NOT EXISTS billing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  subscription_status TEXT,
  plan_type TEXT,
  renewal_date TIMESTAMPTZ
);

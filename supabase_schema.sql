
-- ZieAds Production Schema - Backend V2
-- Multi-tenant isolation for B2B SaaS Advertising

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums for new system
CREATE TYPE plan_type_enum AS ENUM ('starter', 'growth', 'scale', 'enterprise');
CREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'manager', 'viewer');
CREATE TYPE member_status AS ENUM ('pending', 'active', 'removed');
CREATE TYPE sub_status AS ENUM ('active', 'canceled', 'past_due', 'unpaid', 'trialing');
CREATE TYPE invoice_status AS ENUM ('draft', 'open', 'paid', 'void', 'uncollectible');

-- 1. Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_type plan_type_enum DEFAULT 'starter',
  settings JSONB DEFAULT '{"timezone": "UTC", "currency": "USD", "notifications": true}'::jsonb,
  usage_stats JSONB DEFAULT '{"scans_this_month": 0, "creatives_generated": 0, "campaigns_active": 0}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Workspace Members
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role workspace_role NOT NULL DEFAULT 'viewer',
  invited_by UUID REFERENCES profiles(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  status member_status DEFAULT 'pending',
  UNIQUE(workspace_id, user_id)
);

-- 4. Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT NOT NULL,
  plan_type plan_type_enum NOT NULL,
  status sub_status DEFAULT 'trialing',
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  usage_this_period JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  status invoice_status NOT NULL,
  invoice_pdf TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Platform Accounts
CREATE TYPE ad_platform AS ENUM ('meta', 'google', 'tiktok', 'universal');
CREATE TABLE IF NOT EXISTS platform_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  platform ad_platform NOT NULL,
  account_id TEXT NOT NULL,
  account_name TEXT,
  status TEXT DEFAULT 'active',
  token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Campaigns
CREATE TYPE campaign_status AS ENUM ('draft', 'pending', 'active', 'paused', 'learning', 'error', 'completed');
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  platform_account_id UUID REFERENCES platform_accounts(id) ON DELETE SET NULL,
  platform ad_platform NOT NULL,
  platform_campaign_id TEXT,
  name TEXT NOT NULL,
  objective TEXT,
  status campaign_status DEFAULT 'draft',
  budget_daily NUMERIC(15, 2) DEFAULT 0,
  start_date DATE,
  targeting JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_workspace_date ON audit_logs (workspace_id, created_at);

-- RLS Policies
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner full access" ON workspaces FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "Member select" ON workspaces FOR SELECT USING (id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Member access" ON workspace_members FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subscription access" ON subscriptions FOR SELECT USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Invoice access" ON invoices FOR SELECT USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Audit access" ON audit_logs FOR SELECT USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

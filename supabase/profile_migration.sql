-- ================================================
-- Profile & Form Enhancement Migration
-- Run this in your Supabase SQL Editor
-- ================================================

-- 1. Create designer_profiles table
CREATE TABLE IF NOT EXISTS designer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  studio_name TEXT,
  designer_name TEXT,
  logo_url TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  instagram TEXT,
  studio_address TEXT,
  default_accent_color TEXT DEFAULT '#4263eb',
  default_payment_terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index for fast user lookup
CREATE INDEX IF NOT EXISTS idx_designer_profiles_user ON designer_profiles(user_id);

-- 3. Enable RLS
ALTER TABLE designer_profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies for designer_profiles
CREATE POLICY "Users can view own profile"
  ON designer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profile"
  ON designer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON designer_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON designer_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Add new columns to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_size TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS quotation_validity INTEGER DEFAULT 30;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS estimated_start_date TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS estimated_timeline TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS services_included TEXT[] DEFAULT '{}';

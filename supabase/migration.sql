-- ================================================
-- ProposalFlow Database Schema
-- Run this in your Supabase SQL Editor
-- ================================================

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  project_address TEXT,
  project_type TEXT NOT NULL DEFAULT 'Residential',
  designer_name TEXT,
  designer_email TEXT,
  designer_phone TEXT,
  logo_url TEXT,
  accent_color TEXT DEFAULT '#4263eb',
  notes TEXT,
  payment_terms TEXT,
  template TEXT DEFAULT 'minimal',
  tax_rate NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  square_footage NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Line items table
CREATE TABLE IF NOT EXISTS line_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit_price NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals (generated PDFs) table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_rooms_project ON rooms(project_id);
CREATE INDEX IF NOT EXISTS idx_line_items_project ON line_items(project_id);
CREATE INDEX IF NOT EXISTS idx_proposals_project ON proposals(project_id);

-- Enable Row Level Security (but allow all for now since no auth)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Policies to allow all operations (no auth - single designer use case)
CREATE POLICY "Allow all on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on line_items" ON line_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on proposals" ON proposals FOR ALL USING (true) WITH CHECK (true);

-- Storage buckets (run these separately or via Supabase Dashboard)
-- 1. Create a bucket named "logos" (public)
-- 2. Create a bucket named "proposals" (public)
-- In Supabase Dashboard: Storage > New Bucket > "logos" (check "Public bucket")
-- In Supabase Dashboard: Storage > New Bucket > "proposals" (check "Public bucket")

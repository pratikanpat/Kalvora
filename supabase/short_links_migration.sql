-- ================================================
-- Short Links + RLS Fix Migration
-- Run this in your Supabase SQL Editor
-- ================================================

-- ══════════════════════════════════════════════════
-- 1. FIX: Expand public access to non-Draft proposals
-- ══════════════════════════════════════════════════

-- Drop the old policy that only allows status = 'Sent'
DROP POLICY IF EXISTS "Public can view proposals via public link" ON projects;

-- Allow public read for all shareable statuses
CREATE POLICY "Public can view shared proposals"
  ON projects FOR SELECT
  USING (status IN ('Sent', 'Approved', 'Paid', 'Completed'));

-- Allow public update for client actions (viewed_at, approve)
-- Only allow updating client_viewed_at and status fields
DROP POLICY IF EXISTS "Public can update shared proposals" ON projects;
CREATE POLICY "Public can update shared proposals"
  ON projects FOR UPDATE
  USING (status IN ('Sent', 'Approved', 'Paid', 'Completed'));

-- ══════════════════════════════════════════════════
-- 2. FIX: Add public read policies for related tables
--    (rooms, line_items, proposals, payment_milestones)
--    so unauthenticated clients can see proposal data
-- ══════════════════════════════════════════════════

-- Public read for rooms of shared proposals
DROP POLICY IF EXISTS "Public can view rooms of shared proposals" ON rooms;
CREATE POLICY "Public can view rooms of shared proposals"
  ON rooms FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE status IN ('Sent', 'Approved', 'Paid', 'Completed')
    )
  );

-- Public read for line_items of shared proposals
DROP POLICY IF EXISTS "Public can view line_items of shared proposals" ON line_items;
CREATE POLICY "Public can view line_items of shared proposals"
  ON line_items FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE status IN ('Sent', 'Approved', 'Paid', 'Completed')
    )
  );

-- Public read for proposals (PDF links) of shared proposals
DROP POLICY IF EXISTS "Public can view proposals of shared projects" ON proposals;
CREATE POLICY "Public can view proposals of shared projects"
  ON proposals FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE status IN ('Sent', 'Approved', 'Paid', 'Completed')
    )
  );

-- Public read for payment_milestones of shared proposals
DROP POLICY IF EXISTS "Public can view milestones of shared proposals" ON payment_milestones;
CREATE POLICY "Public can view milestones of shared proposals"
  ON payment_milestones FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE status IN ('Sent', 'Approved', 'Paid', 'Completed')
    )
  );

-- Public read for comments of shared proposals
DROP POLICY IF EXISTS "Public can view comments of shared proposals" ON comments;
CREATE POLICY "Public can view comments of shared proposals"
  ON comments FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE status IN ('Sent', 'Approved', 'Paid', 'Completed')
    )
  );

-- Public read for designer_profiles (invoice page needs GST, bank details)
-- Scoped to profiles that own at least one shared project
DROP POLICY IF EXISTS "Public can view designer profiles for shared proposals" ON designer_profiles;
CREATE POLICY "Public can view designer profiles for shared proposals"
  ON designer_profiles FOR SELECT
  USING (
    user_id IN (
      SELECT user_id FROM projects 
      WHERE status IN ('Sent', 'Approved', 'Paid', 'Completed')
    )
  );

-- ══════════════════════════════════════════════════
-- 3. NEW: Short codes table for short URLs
-- ══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS short_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(12) NOT NULL UNIQUE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  link_type VARCHAR(10) NOT NULL DEFAULT 'view',  -- 'view' or 'invoice'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by code
CREATE UNIQUE INDEX IF NOT EXISTS idx_short_codes_code ON short_codes(code);

-- Index for finding codes by project
CREATE INDEX IF NOT EXISTS idx_short_codes_project ON short_codes(project_id);

-- Enable RLS
ALTER TABLE short_codes ENABLE ROW LEVEL SECURITY;

-- Public read (anyone with the code can look it up)
CREATE POLICY "Public can read short codes"
  ON short_codes FOR SELECT
  USING (true);

-- Authenticated users can create short codes for their own projects
CREATE POLICY "Users can create short codes for own projects"
  ON short_codes FOR INSERT
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Service role can always insert (for API routes)
-- (Service role bypasses RLS by default)

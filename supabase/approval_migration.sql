-- ================================================
-- Client Approval Workflow Migration
-- Run this in your Supabase SQL Editor
-- ================================================

-- Add client_viewed_at to projects to track when they open the magic link
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_viewed_at TIMESTAMPTZ;

-- Create comments table to store client feedback
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_type TEXT DEFAULT 'Client', -- e.g., 'Client' or 'Designer'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster retrieval by project
CREATE INDEX IF NOT EXISTS idx_comments_project ON comments(project_id);

-- Enable RLS and add basic policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'comments' AND policyname = 'Allow all on comments'
    ) THEN
        CREATE POLICY "Allow all on comments" ON comments FOR ALL USING (true) WITH CHECK (true);
    END IF;
END
$$;

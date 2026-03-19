-- ================================================
-- Feedback Table Migration (v2 — Structured Feedback)
-- Run this in your Supabase SQL Editor
-- ================================================

-- If the old table exists, add the new columns
-- If starting fresh, use the full CREATE TABLE below.

-- Option A: ALTER existing table (safe if table already exists)
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS prior_tools TEXT[];
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS ease_rating INTEGER;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS best_feature TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS frustrations TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS feature_wish TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS pmf_answer TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS feedback_type TEXT DEFAULT 'structured';
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS user_id UUID;

-- Make 'message' column nullable (it was NOT NULL before, but structured feedback may not have it)
ALTER TABLE feedback ALTER COLUMN message DROP NOT NULL;

-- Option B: Full CREATE TABLE (only if the table doesn't exist yet)
-- CREATE TABLE IF NOT EXISTS feedback (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   name TEXT NOT NULL,
--   email TEXT,
--   message TEXT,
--   prior_tools TEXT[],
--   ease_rating INTEGER,
--   best_feature TEXT,
--   frustrations TEXT,
--   feature_wish TEXT,
--   pmf_answer TEXT,
--   feedback_type TEXT DEFAULT 'structured',
--   user_id UUID,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- Enable Row Level Security (idempotent)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including unauthenticated visitors) to insert feedback
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on feedback') THEN
        CREATE POLICY "Allow public insert on feedback" ON feedback FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Allow authenticated users to read feedback
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated read on feedback') THEN
        CREATE POLICY "Allow authenticated read on feedback" ON feedback FOR SELECT USING (auth.uid() IS NOT NULL);
    END IF;
END $$;

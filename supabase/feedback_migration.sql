-- ================================================
-- Feedback Table Migration
-- Run this in your Supabase SQL Editor
-- ================================================

CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including unauthenticated visitors) to insert feedback
CREATE POLICY "Allow public insert on feedback" ON feedback FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read feedback
CREATE POLICY "Allow authenticated read on feedback" ON feedback FOR SELECT USING (auth.uid() IS NOT NULL);

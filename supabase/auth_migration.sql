-- ================================================
-- Auth Migration: Add user_id and update RLS
-- Run this in your Supabase SQL Editor
-- ================================================

-- 1. Add user_id column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Create index for faster user-scoped queries
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);

-- 3. Drop old "allow all" policies
DROP POLICY IF EXISTS "Allow all on projects" ON projects;
DROP POLICY IF EXISTS "Allow all on rooms" ON rooms;
DROP POLICY IF EXISTS "Allow all on line_items" ON line_items;
DROP POLICY IF EXISTS "Allow all on proposals" ON proposals;

-- 4. Create user-scoped policies for projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Policies for rooms (via project ownership)
CREATE POLICY "Users can view own rooms"
  ON rooms FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can create rooms for own projects"
  ON rooms FOR INSERT
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own rooms"
  ON rooms FOR UPDATE
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own rooms"
  ON rooms FOR DELETE
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- 6. Policies for line_items (via project ownership)
CREATE POLICY "Users can view own line_items"
  ON line_items FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can create line_items for own projects"
  ON line_items FOR INSERT
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own line_items"
  ON line_items FOR UPDATE
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own line_items"
  ON line_items FOR DELETE
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- 7. Policies for proposals (via project ownership)
CREATE POLICY "Users can view own proposals"
  ON proposals FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can create proposals for own projects"
  ON proposals FOR INSERT
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own proposals"
  ON proposals FOR DELETE
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- 8. Allow service role to bypass RLS (for API routes like PDF generation)
-- The service role key already bypasses RLS by default in Supabase,
-- so no additional policy is needed for the generate-pdf API route.

-- 9. Allow public read access for shared proposal view (/view/[id])
CREATE POLICY "Public can view proposals via public link"
  ON projects FOR SELECT
  USING (status = 'Sent');

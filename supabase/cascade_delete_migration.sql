-- ================================================
-- Proper Cascade Delete Migration
-- Run this in your Supabase SQL Editor
-- ================================================

-- Drop the existing foreign key constraint from the projects table
ALTER TABLE projects
DROP CONSTRAINT IF EXISTS projects_user_id_fkey;

-- Re-add the foreign key constraint with ON DELETE CASCADE
ALTER TABLE projects
ADD CONSTRAINT projects_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Note: The designer_profiles table already has ON DELETE CASCADE from its creation.
-- rooms, line_items, proposals, and comments already cascade from projects.

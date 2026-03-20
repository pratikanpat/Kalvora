-- Payment Milestones Table
-- Tracks advance, mid-project, and final payment amounts with dates

CREATE TABLE IF NOT EXISTS payment_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE payment_milestones ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage milestones for their own projects
CREATE POLICY "Users can manage own milestones"
ON payment_milestones
FOR ALL
USING (
  project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
)
WITH CHECK (
  project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

-- Policy: Public read for invoice/proposal view (anyone with the project link)
CREATE POLICY "Public read milestones"
ON payment_milestones
FOR SELECT
USING (true);

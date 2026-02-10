-- Aether Dashboard Tables
-- Run this in Supabase SQL Editor

-- Agent Heartbeats (status tracking)
CREATE TABLE IF NOT EXISTS agent_heartbeats (
  agent TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'offline',
  current_task TEXT,
  last_beat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE agent_heartbeats ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON agent_heartbeats FOR SELECT USING (true);

-- Allow service role to update
CREATE POLICY "Allow service update" ON agent_heartbeats FOR ALL USING (true);

-- Insert default agents
INSERT INTO agent_heartbeats (agent, status, current_task, last_beat)
VALUES 
  ('aether', 'idle', NULL, NOW()),
  ('surgeon', 'offline', NULL, NOW())
ON CONFLICT (agent) DO NOTHING;

-- Agent Tasks (inbox/outbox)
CREATE TABLE IF NOT EXISTS agent_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbox', 'outbox')),
  title TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  verdict TEXT CHECK (verdict IN ('approved', 'needs_work', 'rejected')),
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON agent_tasks FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Allow service access" ON agent_tasks FOR ALL USING (true);

-- Activity Log
CREATE TABLE IF NOT EXISTS activity_log (
  id BIGSERIAL PRIMARY KEY,
  agent TEXT NOT NULL,
  action TEXT NOT NULL,
  detail TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON activity_log FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Allow service access" ON activity_log FOR ALL USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_created_at ON agent_tasks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_agent ON agent_tasks (agent);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE agent_heartbeats;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;

-- Insert sample activity
INSERT INTO activity_log (agent, action, detail)
VALUES 
  ('aether', 'system_start', 'Dashboard connected to Supabase'),
  ('system', 'tables_created', 'Agent dashboard tables initialized');

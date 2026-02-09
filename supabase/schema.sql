-- Aether Dashboard Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Agent Tasks (inbox/outbox)
-- ============================================
create table if not exists agent_tasks (
  id uuid primary key default gen_random_uuid(),
  agent text not null,                    -- 'aether' | 'surgeon'
  direction text not null,                -- 'inbox' | 'outbox'
  title text not null,
  priority text default 'medium',         -- 'low' | 'medium' | 'high' | 'urgent'
  status text default 'pending',          -- 'pending' | 'in_progress' | 'completed' | 'rejected'
  verdict text,                           -- null | 'approved' | 'needs_work' | 'rejected'
  content text,                           -- markdown body
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Index for fast queries
create index if not exists idx_agent_tasks_agent on agent_tasks(agent);
create index if not exists idx_agent_tasks_status on agent_tasks(status);
create index if not exists idx_agent_tasks_created on agent_tasks(created_at desc);

-- ============================================
-- 2. Activity Log
-- ============================================
create table if not exists activity_log (
  id bigint generated always as identity primary key,
  agent text not null,                    -- 'aether' | 'surgeon' | 'daniel' | 'system'
  action text not null,                   -- 'push', 'task_created', 'task_completed', 'lock_acquired', etc.
  detail text,                            -- human-readable description
  metadata jsonb,                         -- commit hash, task id, etc.
  created_at timestamptz default now()
);

-- Index for fast queries
create index if not exists idx_activity_log_agent on activity_log(agent);
create index if not exists idx_activity_log_created on activity_log(created_at desc);

-- ============================================
-- 3. Agent Heartbeats
-- ============================================
create table if not exists agent_heartbeats (
  agent text primary key,                 -- 'aether' | 'surgeon'
  status text not null,                   -- 'idle' | 'working' | 'offline'
  current_task text,
  last_beat timestamptz default now()
);

-- ============================================
-- 4. Enable Realtime
-- ============================================
alter publication supabase_realtime add table agent_tasks;
alter publication supabase_realtime add table activity_log;
alter publication supabase_realtime add table agent_heartbeats;

-- ============================================
-- 5. RLS Policies (Dashboard = read-only)
-- ============================================
alter table agent_tasks enable row level security;
alter table activity_log enable row level security;
alter table agent_heartbeats enable row level security;

-- Allow read for everyone (dashboard uses anon key)
create policy "Allow read agent_tasks" on agent_tasks for select using (true);
create policy "Allow read activity_log" on activity_log for select using (true);
create policy "Allow read agent_heartbeats" on agent_heartbeats for select using (true);

-- Allow insert/update for service role only (agents use service key)
create policy "Allow service write agent_tasks" on agent_tasks for all using (auth.role() = 'service_role');
create policy "Allow service write activity_log" on activity_log for all using (auth.role() = 'service_role');
create policy "Allow service write agent_heartbeats" on agent_heartbeats for all using (auth.role() = 'service_role');

-- ============================================
-- 6. Insert initial heartbeat records
-- ============================================
insert into agent_heartbeats (agent, status, current_task) 
values 
  ('aether', 'idle', null),
  ('surgeon', 'offline', null)
on conflict (agent) do nothing;

-- ============================================
-- Done! Tables ready for dashboard.
-- ============================================

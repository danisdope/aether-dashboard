import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our tables
export interface AgentTask {
  id: string;
  agent: 'aether' | 'surgeon';
  direction: 'inbox' | 'outbox';
  title: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  verdict: 'approved' | 'needs_work' | 'rejected' | null;
  content: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface ActivityLog {
  id: number;
  agent: 'aether' | 'surgeon' | 'daniel' | 'system';
  action: string;
  detail: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface AgentHeartbeat {
  agent: 'aether' | 'surgeon';
  status: 'idle' | 'working' | 'offline';
  current_task: string | null;
  last_beat: string;
}

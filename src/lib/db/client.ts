import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

/**
 * Create a Supabase client authenticated as a specific user.
 * Setting the Authorization header causes Supabase to evaluate
 * RLS policies as that user — so all queries are automatically scoped.
 *
 * Production note: for privileged server-side operations (e.g., admin
 * writes that bypass RLS) swap `key` for a SUPABASE_SERVICE_ROLE_KEY
 * stored in a server-only env var.
 */
export function createUserDbClient(token: string): SupabaseClient {
  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
}

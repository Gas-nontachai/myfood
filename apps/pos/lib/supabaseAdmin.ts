import { createClient } from '@supabase/supabase-js';

function getAdminConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase URL or Service Role Key for admin client');
  }

  return { supabaseUrl, serviceRoleKey };
}

export function createAdminClient() {
  const { supabaseUrl, serviceRoleKey } = getAdminConfig();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    },
    global: {
      headers: {
        'X-Client-Info': 'myfood-dashboard-admin'
      }
    }
  });
}

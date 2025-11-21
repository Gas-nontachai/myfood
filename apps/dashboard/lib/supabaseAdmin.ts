import { createClient } from '@supabase/supabase-js';
import type { Database } from '@myfood/shared-types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing Supabase URL or Service Role Key for admin client');
}

export function createAdminClient() {
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
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

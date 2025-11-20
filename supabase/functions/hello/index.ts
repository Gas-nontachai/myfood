// Example Supabase Edge Function (Deno)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const payload = await req.json().catch(() => ({}));
  return new Response(
    JSON.stringify({ message: 'Hello from Supabase Edge Functions', payload }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});

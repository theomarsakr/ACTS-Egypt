import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Admin client — SERVER-ONLY. Used by /api/inquiries to insert RFQ leads.
// Returns null when Supabase isn't configured yet (no .env.local), so the
// site still runs locally without a database.
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

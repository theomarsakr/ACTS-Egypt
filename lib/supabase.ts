import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Admin client — SERVER-ONLY. Used by /api/inquiries to insert RFQ leads.
// Returns null when Supabase isn't configured yet (no .env.local), so the
// site still runs locally without a database.
export function getSupabaseAdmin(): SupabaseClient | null {
  // Prefer the unprefixed name. NEXT_PUBLIC_* is inlined into client bundles
  // wherever it is referenced, and this URL has no business being there — it
  // is only ever read here, on the server. The fallback keeps existing
  // deployments working; drop it once SUPABASE_URL is set in Vercel.
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

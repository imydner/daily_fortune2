import "server-only";
import { createClient } from "@supabase/supabase-js";

// Admin client. Uses the secret key, which bypasses Row Level Security.
// Import this ONLY from server-side code that truly needs to bypass RLS
// (e.g. trusted background jobs). For normal auth-aware server reads/writes,
// use `src/lib/supabase/server.ts` instead — it respects the logged-in
// user's session and RLS policies.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
  },
});

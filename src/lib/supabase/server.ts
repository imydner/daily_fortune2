import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only client. Uses the secret key, which bypasses Row Level Security.
// Import this ONLY from Server Components, Route Handlers, or Server Actions —
// never from a "use client" file, or the secret key will end up in the
// browser bundle.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

export const supabaseServer = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
  },
});

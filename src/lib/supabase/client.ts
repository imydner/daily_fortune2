"use client";

import { createClient } from "@supabase/supabase-js";

// Browser-safe client. Uses the publishable key, which is designed to be
// exposed to the client (equivalent to the old "anon" key).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabaseBrowser = createClient(
  supabaseUrl,
  supabasePublishableKey,
);

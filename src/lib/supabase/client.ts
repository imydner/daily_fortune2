"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser-safe client. Uses the publishable key, which is designed to be
// exposed to the client (equivalent to the old "anon" key). Reads/writes
// the auth session via cookies so the server can see who's logged in too.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabaseBrowser = createBrowserClient(
  supabaseUrl,
  supabasePublishableKey,
);

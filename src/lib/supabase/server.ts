import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Auth-aware server client. Uses the publishable key (not the secret key),
// and reads/writes the session via Next.js cookies so Server Components,
// Server Actions, and Route Handlers can see who's logged in. Respects
// Row Level Security based on the current user's session.
//
// Must be created fresh per request (that's why this is a function, not a
// module-level singleton like the browser client).
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component render, where cookies can't be
            // written. Safe to ignore as long as `src/proxy.ts` is refreshing
            // the session on every request.
          }
        },
      },
    },
  );
}

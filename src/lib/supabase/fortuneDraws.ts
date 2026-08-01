import { supabaseBrowser } from "./client";
import type { FortuneResult } from "@/lib/fortune";

export type FortuneDraw = {
  id: string;
  created_at: string;
  client_id: string;
  user_id: string | null;
  fortune: string;
  lucky_item: string;
  lucky_color: string;
  lotto_numbers: number[];
  week_label: string;
};

export async function saveFortuneDraw(
  clientId: string,
  result: FortuneResult,
  userId?: string | null,
): Promise<FortuneDraw | null> {
  const { data, error } = await supabaseBrowser
    .from("fortune_draws")
    .insert({
      client_id: clientId,
      user_id: userId ?? null,
      fortune: result.fortune,
      lucky_item: result.luckyItem,
      lucky_color: result.luckyColor,
      lotto_numbers: result.lottoNumbers,
      week_label: result.weekLabel,
    })
    .select()
    .single();

  if (error) {
    // Table/columns may be out of date if supabase/schema.sql or
    // supabase/schema_auth.sql hasn't been run, or the network/keys may be
    // misconfigured. Fail quietly so the card still works without history.
    console.error("Failed to save fortune draw:", error.message);
    return null;
  }
  return data as FortuneDraw;
}

export async function fetchRecentDraws(
  { clientId, userId }: { clientId: string; userId?: string | null },
  limit = 5,
): Promise<FortuneDraw[]> {
  // Logged-in users see their history across devices (by user_id).
  // Anonymous visitors only see history from this browser (by client_id).
  const query = supabaseBrowser
    .from("fortune_draws")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  const { data, error } = userId
    ? await query.eq("user_id", userId)
    : await query.eq("client_id", clientId);

  if (error) {
    console.error("Failed to fetch fortune draws:", error.message);
    return [];
  }
  return (data ?? []) as FortuneDraw[];
}

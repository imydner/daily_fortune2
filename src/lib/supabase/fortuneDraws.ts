import { supabaseBrowser } from "./client";
import type { FortuneResult } from "@/lib/fortune";

export type FortuneDraw = {
  id: string;
  created_at: string;
  client_id: string;
  fortune: string;
  lucky_item: string;
  lucky_color: string;
  lotto_numbers: number[];
  week_label: string;
};

export async function saveFortuneDraw(
  clientId: string,
  result: FortuneResult,
): Promise<FortuneDraw | null> {
  const { data, error } = await supabaseBrowser
    .from("fortune_draws")
    .insert({
      client_id: clientId,
      fortune: result.fortune,
      lucky_item: result.luckyItem,
      lucky_color: result.luckyColor,
      lotto_numbers: result.lottoNumbers,
      week_label: result.weekLabel,
    })
    .select()
    .single();

  if (error) {
    // Table may not exist yet if supabase/schema.sql hasn't been run,
    // or the network/keys may be misconfigured. Fail quietly so the
    // card still works without history.
    console.error("Failed to save fortune draw:", error.message);
    return null;
  }
  return data as FortuneDraw;
}

export async function fetchRecentDraws(
  clientId: string,
  limit = 5,
): Promise<FortuneDraw[]> {
  const { data, error } = await supabaseBrowser
    .from("fortune_draws")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch fortune draws:", error.message);
    return [];
  }
  return (data ?? []) as FortuneDraw[];
}

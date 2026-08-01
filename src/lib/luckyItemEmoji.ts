// Zero-cost "image" for each lucky item — a plain lookup table, no AI call.
// Every draw's luckyItem already comes from a fixed local list (see
// LUCKY_ITEMS in fortune.ts), so we can just map it to an emoji instantly.
const LUCKY_ITEM_EMOJI: Record<string, string> = {
  우산: "☂️",
  손거울: "🪞",
  "노란색 머그컵": "☕",
  만년필: "🖋️",
  동전지갑: "👛",
  "동전 지갑": "👛",
  손목시계: "⌚",
  향초: "🕯️",
  작은화분: "🪴",
  "작은 화분": "🪴",
  이어폰: "🎧",
  귀걸이: "💎",
  책갈피: "🔖",
  손수건: "🤍",
  열쇠고리: "🔑",
  텀블러: "🥤",
  선글라스: "🕶️",
  노트: "📓",
  반지: "💍",
  스카프: "🧣",
  "휴대폰 케이스": "📱",
  향수: "🧴",
};

const DEFAULT_EMOJI = "🍀";

export function getLuckyItemEmoji(luckyItem: string): string {
  return LUCKY_ITEM_EMOJI[luckyItem] ?? DEFAULT_EMOJI;
}

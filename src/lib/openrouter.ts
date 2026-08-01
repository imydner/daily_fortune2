import "server-only";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// 모델명만 바꾸면 다른 AI로 교체 끝 (OpenRouter의 장점).
// 다른 모델을 쓰고 싶으면 이 문자열만 바꿔주세요.
const MODEL = "openai/gpt-4o-mini";

const SYSTEM_PROMPT =
  "너는 한국어로 오늘의 운세를 써주는 다정한 운세가야. " +
  "뻔한 덕담 말고 위트 있게, 반말로, 세 줄 이내로 짧게 써줘. " +
  "이모지나 별표 같은 특수기호는 쓰지 말고 순수 텍스트로만 답해줘.";

// 서버에서만 호출되는 함수 — API 키가 브라우저로 절대 전달되지 않아요.
export async function generateAiFortuneText(): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY가 설정되어 있지 않아요. .env.local을 확인해주세요.",
    );
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: "오늘의 운세를 알려줘." },
      ],
      max_tokens: 200,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`OpenRouter 호출 실패 (${res.status}): ${detail}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;

  if (!content || !content.trim()) {
    throw new Error("AI가 빈 응답을 보냈어요.");
  }

  return content.trim();
}

"use server";

import { generateAiFortuneText } from "@/lib/openrouter";

export type AiFortuneResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

// 클라이언트(브라우저)에서 호출하는 Server Action.
// 실제 API 키 사용은 전부 서버 쪽 openrouter.ts 안에서만 일어나요.
export async function getAiFortuneMessage(): Promise<AiFortuneResult> {
  try {
    const message = await generateAiFortuneText();
    return { ok: true, message };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했어요.";
    console.error("AI 운세 생성 실패:", errorMessage);
    return { ok: false, error: errorMessage };
  }
}

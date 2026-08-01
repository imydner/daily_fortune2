"use client";

import { useEffect, useRef, useState } from "react";
import { generateFortune, type FortuneResult } from "@/lib/fortune";
import { getClientId } from "@/lib/clientId";
import {
  fetchRecentDraws,
  saveFortuneDraw,
  type FortuneDraw,
} from "@/lib/supabase/fortuneDraws";
import { getAiFortuneMessage } from "@/app/actions/aiFortune";
import { getLuckyItemEmoji } from "@/lib/luckyItemEmoji";

const LOTTO_COLORS = [
  { max: 10, className: "bg-yellow-400 text-yellow-950" },
  { max: 20, className: "bg-blue-500 text-white" },
  { max: 30, className: "bg-red-500 text-white" },
  { max: 40, className: "bg-gray-500 text-white" },
  { max: 45, className: "bg-green-500 text-white" },
];

function lottoBallClass(num: number) {
  return LOTTO_COLORS.find((c) => num <= c.max)!.className;
}

export default function FortuneCard({
  userId,
}: {
  userId: string | null;
}) {
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [animating, setAnimating] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [history, setHistory] = useState<FortuneDraw[]>([]);
  const clientIdRef = useRef("");

  useEffect(() => {
    const id = getClientId();
    clientIdRef.current = id;
    if (id) {
      fetchRecentDraws({ clientId: id, userId }).then(setHistory);
    }
  }, [userId]);

  const persistDraw = (id: string, next: FortuneResult) => {
    saveFortuneDraw(id, next, userId).then((saved) => {
      if (saved) {
        setHistory((prev) => [saved, ...prev].slice(0, 5));
      }
    });
  };

  const reveal = async () => {
    // Lucky item/color/lotto numbers stay local (fast, free). Only the
    // fortune message itself is asked from the AI — falls back to the
    // static message list if OpenRouter isn't configured or fails.
    const base = generateFortune();
    setAiLoading(true);
    const ai = await getAiFortuneMessage();
    setAiLoading(false);

    const next: FortuneResult = ai.ok
      ? { ...base, fortune: ai.message }
      : base;

    setIsAiGenerated(ai.ok);
    setResult(next);
    setFlipped(true);
    window.setTimeout(() => setAnimating(false), 600);
    if (clientIdRef.current) persistDraw(clientIdRef.current, next);
  };

  const handleDraw = () => {
    if (animating) return;
    setAnimating(true);

    if (flipped) {
      // Already showing a result: flip back first, then reveal a new one.
      setFlipped(false);
      window.setTimeout(reveal, 300);
    } else {
      reveal();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="[perspective:1200px] w-72 h-96 sm:w-80 sm:h-[26rem]">
        <div
          className={`relative w-full h-full transition-transform duration-600 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
          style={{ transitionDuration: "600ms" }}
        >
          {/* Card back */}
          <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 shadow-xl flex flex-col items-center justify-center gap-4 text-white border border-white/20">
            <span className="text-6xl">🔮</span>
            <p className="text-lg font-semibold tracking-wide">오늘의 운세</p>
            <p className="text-sm text-white/80">
              {aiLoading
                ? "AI가 운세를 만드는 중..."
                : "카드를 눌러 확인해보세요"}
            </p>
          </div>

          {/* Card front */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-white shadow-xl border border-gray-100 flex flex-col items-center justify-start gap-4 p-6 overflow-y-auto">
            {result && (
              <>
                <span className="text-4xl">✨</span>
                <div className="text-center">
                  <p className="text-xs font-medium text-purple-500 mb-1">
                    오늘의 운세{" "}
                    {isAiGenerated && (
                      <span className="text-[10px] text-indigo-400">
                        · AI가 방금 만들었어요
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {result.fortune}
                  </p>
                </div>

                <div className="w-full h-px bg-gray-100" />

                <div className="text-center">
                  <p className="text-xs font-medium text-purple-500 mb-1">
                    행운의 아이템 &amp; 색상
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl" aria-hidden>
                      {getLuckyItemEmoji(result.luckyItem)}
                    </span>
                    <p className="text-sm text-gray-800">
                      {result.luckyItem} · {result.luckyColor}색
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100" />

                <div className="text-center w-full">
                  <p className="text-xs font-medium text-purple-500 mb-2">
                    이번 주 로또 추천 번호
                  </p>
                  <p className="text-[11px] text-gray-400 mb-2">
                    {result.weekLabel}
                  </p>
                  <div className="flex justify-center gap-1.5 flex-wrap">
                    {result.lottoNumbers.map((n) => (
                      <span
                        key={n}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${lottoBallClass(
                          n
                        )}`}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleDraw}
        disabled={animating}
        className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90 active:scale-95 transition disabled:opacity-60"
      >
        {aiLoading ? "AI가 만드는 중..." : flipped ? "다시 뽑기" : "카드 뒤집기"}
      </button>

      {history.length > 0 && (
        <div className="w-full max-w-xs">
          <p className="text-xs font-medium text-gray-400 mb-2 text-center">
            지난 기록
          </p>
          <ul className="space-y-1.5">
            {history.map((h) => (
              <li
                key={h.id}
                className="text-xs text-gray-500 bg-white/60 rounded-lg px-3 py-1.5 truncate"
              >
                <span className="text-gray-400">
                  {new Date(h.created_at).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>{" "}
                · {h.fortune}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

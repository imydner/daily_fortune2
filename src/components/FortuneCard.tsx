"use client";

import { useState } from "react";
import { generateFortune, type FortuneResult } from "@/lib/fortune";

const LOTTO_COLORS = [
  { max: 7, className: "bg-red-500 text-white" },
  { max: 14, className: "bg-orange-500 text-white" },
  { max: 21, className: "bg-yellow-400 text-yellow-950" },
  { max: 28, className: "bg-green-500 text-white" },
  { max: 35, className: "bg-blue-500 text-white" },
  { max: 41, className: "bg-indigo-600 text-white" },
  { max: 45, className: "bg-violet-500 text-white" },
];

function lottoBallClass(num: number) {
  return LOTTO_COLORS.find((c) => num <= c.max)!.className;
}

export default function FortuneCard() {
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [animating, setAnimating] = useState(false);

  const handleDraw = () => {
    if (animating) return;
    setAnimating(true);

    if (flipped) {
      // Already showing a result: flip back first, then reveal a new one.
      setFlipped(false);
      window.setTimeout(() => {
        setResult(generateFortune());
        setFlipped(true);
        setAnimating(false);
      }, 300);
    } else {
      setResult(generateFortune());
      setFlipped(true);
      window.setTimeout(() => setAnimating(false), 600);
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
          <div className="rainbow-bg absolute inset-0 [backface-visibility:hidden] rounded-2xl shadow-xl flex flex-col items-center justify-center gap-4 text-white border border-white/20">
            <span className="text-6xl drop-shadow">🌈</span>
            <p className="text-lg font-semibold tracking-wide drop-shadow">
              오늘의 운세
            </p>
            <p className="text-sm text-white/90 drop-shadow">
              카드를 눌러 확인해보세요
            </p>
          </div>

          {/* Card front */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-white shadow-xl border border-gray-100 flex flex-col items-center justify-start gap-4 p-6 pt-7 overflow-y-auto">
            <div className="rainbow-bg absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl" />
            {result && (
              <>
                <span className="text-4xl">✨</span>
                <div className="text-center">
                  <p className="text-xs font-bold text-red-500 mb-1">
                    오늘의 운세
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {result.fortune}
                  </p>
                </div>

                <div className="rainbow-bg w-full h-px opacity-60" />

                <div className="text-center">
                  <p className="text-xs font-bold text-green-600 mb-1">
                    행운의 아이템 &amp; 색상
                  </p>
                  <p className="text-sm text-gray-800">
                    {result.luckyItem} · {result.luckyColor}색
                  </p>
                </div>

                <div className="rainbow-bg w-full h-px opacity-60" />

                <div className="text-center w-full">
                  <p className="text-xs font-bold text-indigo-600 mb-2">
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
        className="rainbow-bg px-8 py-3 rounded-full text-white font-semibold shadow-lg hover:opacity-90 active:scale-95 transition disabled:opacity-60"
      >
        {flipped ? "다시 뽑기" : "카드 뒤집기"}
      </button>
    </div>
  );
}

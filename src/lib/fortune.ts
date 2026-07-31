export type FortuneResult = {
  fortune: string;
  luckyItem: string;
  luckyColor: string;
  lottoNumbers: number[];
  weekLabel: string;
};

const FORTUNES = [
  "오늘은 뜻밖의 좋은 소식이 들려올 거예요. 마음을 열고 기다려보세요.",
  "작은 용기가 큰 변화를 만드는 하루입니다. 망설이지 말고 도전해보세요.",
  "주변 사람과의 대화 속에서 뜻밖의 힌트를 얻게 될 거예요.",
  "재물운이 상승하는 하루! 계획했던 일을 실행에 옮기기 좋은 타이밍입니다.",
  "몸과 마음의 휴식이 필요한 날이에요. 무리하지 말고 여유를 가지세요.",
  "새로운 인연이 찾아올 수 있는 하루입니다. 주변을 잘 살펴보세요.",
  "오늘 내린 결정이 앞으로 큰 도움이 될 거예요. 신중하게 생각해보세요.",
  "그동안 노력한 일들이 서서히 결실을 맺기 시작합니다.",
  "예상치 못한 지출이 생길 수 있으니 소비에 조금 신경 쓰세요.",
  "긍정적인 에너지가 가득한 하루! 자신감을 갖고 움직이세요.",
  "누군가에게 받은 작은 친절이 하루를 특별하게 만들어 줄 거예요.",
  "일이 술술 풀리는 날입니다. 미뤄뒀던 일을 처리해보세요.",
  "감정 기복이 있을 수 있는 날이에요. 잠시 심호흡하고 마음을 다스려보세요.",
  "귀인이 나타나 도움을 줄 수 있는 하루입니다. 주변에 감사함을 표현해보세요.",
  "직감을 믿어도 좋은 날이에요. 마음이 이끄는 대로 움직여보세요.",
  "가족이나 가까운 사람과의 시간이 큰 행복을 가져다줄 거예요.",
  "오늘은 배움의 기운이 강한 날입니다. 새로운 지식을 쌓아보세요.",
  "작은 실수에 너무 연연하지 마세요. 내일은 더 나아질 거예요.",
  "숨겨진 재능이 빛을 발할 수 있는 하루입니다. 자신을 믿어보세요.",
  "계획보다 여유를 갖고 흐름에 맡기는 것이 좋은 하루입니다.",
];

const LUCKY_ITEMS = [
  "우산",
  "손거울",
  "노란색 머그컵",
  "만년필",
  "동전 지갑",
  "손목시계",
  "향초",
  "작은 화분",
  "이어폰",
  "귀걸이",
  "책갈피",
  "손수건",
  "열쇠고리",
  "텀블러",
  "선글라스",
  "노트",
  "반지",
  "스카프",
  "휴대폰 케이스",
  "향수",
];

const LUCKY_COLORS = [
  "빨강",
  "주황",
  "노랑",
  "초록",
  "파랑",
  "남색",
  "보라",
  "분홍",
  "하양",
  "검정",
  "금색",
  "은색",
];

// Simple deterministic PRNG (mulberry32) so results can be seeded.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash;
}

function getISOWeekKey(date: Date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return { key: `${d.getUTCFullYear()}-W${weekNo}`, week: weekNo, year: d.getUTCFullYear() };
}

function pickLottoNumbers(rand: () => number) {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  const numbers: number[] = [];
  while (numbers.length < 6) {
    const idx = Math.floor(rand() * pool.length);
    numbers.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return numbers.sort((a, b) => a - b);
}

export function generateFortune(): FortuneResult {
  // Fortune & lucky item change on every draw.
  const freshRand = Math.random;
  const fortune = FORTUNES[Math.floor(freshRand() * FORTUNES.length)];
  const luckyItem = LUCKY_ITEMS[Math.floor(freshRand() * LUCKY_ITEMS.length)];
  const luckyColor = LUCKY_COLORS[Math.floor(freshRand() * LUCKY_COLORS.length)];

  // Lotto numbers stay fixed for the current week (based on ISO week).
  const now = new Date();
  const { key, week, year } = getISOWeekKey(now);
  const weekRand = mulberry32(hashString(key));
  const lottoNumbers = pickLottoNumbers(weekRand);

  return {
    fortune,
    luckyItem,
    luckyColor,
    lottoNumbers,
    weekLabel: `${year}년 ${week}주차`,
  };
}

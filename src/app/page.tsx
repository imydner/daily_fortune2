import FortuneCard from "@/components/FortuneCard";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-10 px-4 py-16 bg-gradient-to-b from-indigo-50 via-white to-pink-50">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          🍀 오늘의 운세
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          카드를 뒤집어 오늘의 운세와 행운의 아이템, 이번 주 로또 번호를
          확인해보세요
        </p>
      </div>
      <FortuneCard />
    </main>
  );
}

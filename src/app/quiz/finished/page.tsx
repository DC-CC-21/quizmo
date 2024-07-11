"use client";

import { useSearchParams } from "next/navigation";

export default function FinishedView() {
  const params = useSearchParams();
  const name = params.get("name");
  const qCount: number = +params.get("count")!;
  const correct: number = +params.get("correct")!;
  const percentage = ((correct / qCount) * 100).toFixed(2);

  return (
    <main>
      <h2 className="text-center text-2xl border-b-2 border-b-d_blue w-[80%] mx-auto">
        Results
      </h2>
      <div className="text-center px-4 py-5">
              <span className="text-3xl p-2 text-black">{name}</span>
              <span className="text-4xl p-2 text-l_blue">{percentage}%</span>
      </div>
      <a
        href="/"
        className="text-center text-xl px-4 py-2 bg-sky-500 rounded-xl mx-auto block w-1/2"
      >
        Play Another
      </a>
    </main>
  );
}

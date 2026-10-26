"use client";

import { useState } from "react";

// 결과 요약을 클립보드에 복사한다 (공유 창이 막힌 환경에서도 동작)
export default function ShareButton({ text }: { text: string }) {
  const [label, setLabel] = useState("결과 복사하기");

  function copy() {
    navigator.clipboard
      .writeText(text)
      .then(() => setLabel("복사됨"))
      .catch(() => setLabel("복사할 수 없음"))
      .finally(() => setTimeout(() => setLabel("결과 복사하기"), 2000));
  }

  return (
    <button onClick={copy} className="rounded-xl bg-gold px-6 py-3 font-bold text-black">
      {label}
    </button>
  );
}

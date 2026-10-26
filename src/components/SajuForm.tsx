"use client";

import { useState } from "react";
import { HOURS, STEMS, BRANCHES, calculate, type Calendar, type SajuInput } from "@/lib/saju";

const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: THIS_YEAR - 1930 + 1 }, (_, i) => THIS_YEAR - i);

const select =
  "w-full rounded-xl border border-gold/30 bg-black/50 px-4 py-3 text-foreground outline-none focus:border-gold";

export default function SajuForm({ onDone }: { onDone: (input: SajuInput) => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [sex, setSex] = useState<"M" | "F" | "">("");
  const [calendar, setCalendar] = useState("S_C");
  const [year, setYear] = useState(1995);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(-1);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");

  const daysInMonth = calendar === "S_C" ? new Date(year, month, 0).getDate() : 30;

  function submit() {
    const input: SajuInput = {
      name: name.trim(),
      sex: sex || "M",
      year,
      month,
      day: Math.min(day, daysInMonth),
      hour,
      calendar: calendar as Calendar,
    };
    try {
      calculate(input);
    } catch {
      setError("그 해에는 해당 윤달이 없습니다. 음력 평달로 다시 선택해 주세요.");
      setStep(2);
      return;
    }
    setError("");
    setReading(true);
    // 해독 연출을 보여준 뒤 결과로 이동
    setTimeout(() => onDone(input), 3200);
  }

  const bubbles = [
    "그대의 이름을 알려주시오.",
    "그대는 남자인가, 여자인가?",
    "언제 이 세상에 왔는가?",
    "태어난 시간을 아는가? 모른다면 그대로 두어도 좋소.",
  ];

  if (reading) return <Decoding name={name} />;

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-gold/25 bg-black/55 p-6 backdrop-blur-md">
      <div className="mb-5 flex gap-1.5">
        {bubbles.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-gold" : "bg-white/15"}`} />
        ))}
      </div>

      <p key={step} className="rise mb-5 rounded-2xl rounded-tl-sm bg-gold/10 px-4 py-3 font-serif text-lg text-gold-bright">
        {bubbles[step]}
      </p>

      {step === 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) setStep(1);
          }}
          className="flex gap-2"
        >
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={20} placeholder="이름" className={select} />
          <button className="shrink-0 rounded-xl bg-gold px-5 font-bold text-black disabled:opacity-40" disabled={!name.trim()}>
            다음
          </button>
        </form>
      )}

      {step === 1 && (
        <div className="grid grid-cols-2 gap-3">
          {(["M", "F"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setSex(s);
                setStep(2);
              }}
              className="rounded-xl border border-gold/40 py-4 text-lg hover:bg-gold/15"
            >
              {s === "M" ? "남자" : "여자"}
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              ["S_C", "양력"],
              ["L_C", "음력"],
              ["L_L", "음력 윤달"],
            ].map(([v, label]) => (
              <button
                key={v}
                onClick={() => setCalendar(v)}
                className={`rounded-xl border py-2 text-sm ${calendar === v ? "border-gold bg-gold/20 text-gold-bright" : "border-white/15"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-2">
            <select aria-label="태어난 해" value={year} onChange={(e) => setYear(+e.target.value)} className={select}>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
            <select aria-label="태어난 달" value={month} onChange={(e) => setMonth(+e.target.value)} className={select}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}월
                </option>
              ))}
            </select>
            <select aria-label="태어난 날" value={Math.min(day, daysInMonth)} onChange={(e) => setDay(+e.target.value)} className={select}>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}일
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button onClick={() => setStep(3)} className="w-full rounded-xl bg-gold py-3 font-bold text-black">
            다음
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <select aria-label="태어난 시간" value={hour} onChange={(e) => setHour(+e.target.value)} className={select}>
            <option value={-1}>모름</option>
            {HOURS.map((h, i) => (
              <option key={h} value={i}>
                {h}
              </option>
            ))}
          </select>
          <button onClick={submit} className="w-full rounded-xl bg-gold py-3 text-lg font-bold text-black shadow-[0_4px_24px_rgba(212,175,55,0.35)]">
            운명 해독하기
          </button>
        </div>
      )}

      {step > 0 && (
        <button onClick={() => setStep(step - 1)} className="mt-4 text-sm text-white/50 hover:text-white/80">
          ← 이전
        </button>
      )}
    </div>
  );
}

// 60갑자가 도는 해독 연출
function Decoding({ name }: { name: string }) {
  const ring = Array.from({ length: 60 }, (_, i) => STEMS[i % 10] + BRANCHES[i % 12]);
  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div className="relative h-64 w-64">
        <svg viewBox="0 0 260 260" className="spin-slow absolute inset-0">
          {ring.map((gz, i) => {
            const a = (i / 60) * Math.PI * 2;
            return (
              <text
                key={i}
                x={130 + Math.cos(a) * 112}
                y={134 + Math.sin(a) * 112}
                fontSize="9"
                textAnchor="middle"
                fill="#d4af37"
                opacity={0.35 + (i % 5) * 0.12}
              >
                {gz}
              </text>
            );
          })}
        </svg>
        <div className="absolute inset-16 rounded-full bg-gold/20 blur-xl pulse" />
        <div className="absolute inset-0 flex items-center justify-center font-serif text-4xl text-gold-bright pulse">命</div>
      </div>
      <p className="font-serif text-xl text-gold-bright">{name}님의 운명을 해독하는 중…</p>
      <p className="text-sm text-white/60">사주팔자를 세우고 오행의 흐름을 읽고 있습니다</p>
    </div>
  );
}

"use client";

import Oracle from "@/components/Oracle";
import Scene from "@/components/Scene";
import ShareButton from "@/components/ShareButton";
import { buildReadings, guardianOf, type Tone } from "@/lib/readings";
import { ELEMENTS, ELEMENT_HANJA, ELEMENT_KO, HOURS, branchKo, stemKo, type Element, type SajuResult } from "@/lib/saju";
import { isLight, themeFor } from "@/lib/theme";

const ELEMENT_COLOR: Record<Element, string> = {
  wood: "#4caf6a",
  fire: "#e5533a",
  earth: "#d6a443",
  metal: "#b9c3cf",
  water: "#3f78d6",
};

const TONE_LABEL: Record<Tone, string> = { good: "좋음", normal: "보통", caution: "주의" };
const TONE_COLOR: Record<Tone, string> = { good: "#4caf6a", normal: "#d4af37", caution: "#e5533a" };

const MOOD_LINE = {
  bright: "맑은 기운이 그대를 감싸고 있구려.",
  calm: "빛과 그림자가 함께 흐르는 운명이오.",
  dark: "짙은 어둠 속에서도 길은 있소. 귀 기울여 들으시오.",
};

export default function ResultView({ result, onBack }: { result: SajuResult; onBack: () => void }) {
  const input = result.input;
  const theme = themeFor(result.strongest, result.mood);
  const light = isLight(result.mood);
  const ink = light ? "text-neutral-900" : "text-white";
  const sub = light ? "text-neutral-600" : "text-white/65";
  const readings = buildReadings(result);
  const total = result.pillars.length * 2;
  const shareText = `${input.name}님의 평생사주: ${guardianOf(result.dayElement)}의 예언, ${theme.label}
${readings[0].body.join(" ")}`;
  const calLabel = { S_C: "양력", L_C: "음력", L_L: "음력 윤달" }[input.calendar];

  return (
    <main className="relative flex-1">
      <Scene element={result.strongest} mood={result.mood} theme={theme} />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <button onClick={onBack} className={`text-sm ${sub} hover:underline`}>
          ← 다시 보기
        </button>

        {/* 수호신 */}
        <section className="rise mt-4 flex flex-col items-center text-center">
          <Oracle element={result.dayElement} mood={result.mood} theme={theme} size={200} />
          <p className="mt-2 text-xs tracking-[0.3em]" style={{ color: theme.accent }}>
            {theme.label}
          </p>
          <h1 className={`mt-2 font-serif text-3xl font-bold ${ink}`}>
            {guardianOf(result.dayElement)}의 예언
          </h1>
          <p className="mt-3 rounded-2xl px-5 py-3 font-serif text-lg" style={{ background: theme.card, color: theme.accent }}>
            “{input.name}님, {MOOD_LINE[result.mood]}”
          </p>
        </section>

        {/* 사주명식 */}
        <section className="rise mt-8 rounded-3xl p-6 backdrop-blur-md" style={{ background: theme.card }}>
          <h2 className={`font-serif text-xl font-bold ${ink}`}>사주명식</h2>
          <p className={`mt-1 text-sm ${sub}`}>
            {input.name} · {input.sex === "M" ? "남" : "여"} · {calLabel} {input.year}.{input.month}.{input.day}
            {input.calendar !== "S_C" && ` (양력 ${result.solarDate})`} · {input.hour < 0 ? "시간 모름" : HOURS[input.hour].split(" ")[0] + "시"} ·{" "}
            {result.zodiac}띠
          </p>
          <div className={`mt-5 grid gap-2 text-center`} style={{ gridTemplateColumns: `repeat(${result.pillars.length}, minmax(0, 1fr))` }}>
            {result.pillars.map((p) => (
              <div key={p.label} className="space-y-2">
                <p className={`text-xs ${sub}`}>{p.label}</p>
                {[
                  [p.stem, p.stemElement, p.stemGod ?? "일간", stemKo(p.stem)],
                  [p.branch, p.branchElement, p.branchGod, branchKo(p.branch)],
                ].map(([ch, el, god, ko]) => (
                  <div
                    key={ch + god}
                    className="rounded-2xl py-3"
                    style={{ background: ELEMENT_COLOR[el as Element] + "33", border: `1px solid ${ELEMENT_COLOR[el as Element]}88` }}
                  >
                    <p className={`font-serif text-3xl ${ink}`}>{ch}</p>
                    <p className={`text-xs ${sub}`}>
                      {ko} · {ELEMENT_KO[el as Element]}
                    </p>
                    <p className="mt-1 text-xs font-bold" style={{ color: god === "일간" ? theme.accent : undefined }}>
                      <span className={god === "일간" ? "" : sub}>{god}</span>
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <h3 className={`mt-7 font-serif text-lg font-bold ${ink}`}>오행 분석</h3>
          <div className="mt-3 space-y-2">
            {ELEMENTS.map((e) => (
              <div key={e} className="flex items-center gap-3">
                <span className={`w-14 text-sm ${ink}`}>
                  {ELEMENT_HANJA[e]} {ELEMENT_KO[e]}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-black/15">
                  <div className="h-full rounded-full" style={{ width: `${(result.elements[e] / total) * 100}%`, background: ELEMENT_COLOR[e] }} />
                </div>
                <span className={`w-8 text-right text-sm ${result.elements[e] === 0 ? "text-red-400" : sub}`}>{result.elements[e]}</span>
              </div>
            ))}
          </div>
          <p className={`mt-3 text-sm ${sub}`}>
            가장 강한 기운은 {ELEMENT_KO[result.strongest]}
            {result.missing.length > 0 && `, 비어 있는 기운은 ${result.missing.map((e) => ELEMENT_KO[e]).join("·")}`}입니다. 일간의 힘은{" "}
            {{ strong: "강한", weak: "약한", balanced: "균형 잡힌" }[result.strength]} 편입니다.
          </p>
        </section>

        {/* 풀이 */}
        <section className="mt-8 space-y-4">
          {readings.map((r, i) => (
            <article
              key={r.title}
              className="rise rounded-3xl p-6 backdrop-blur-md"
              style={{ background: theme.card, borderLeft: `4px solid ${TONE_COLOR[r.tone]}`, animationDelay: `${Math.min(i, 8) * 0.06}s` }}
            >
              <div className="flex items-center justify-between">
                <h2 className={`font-serif text-xl font-bold ${ink}`}>{r.title}</h2>
                <span className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: TONE_COLOR[r.tone] }}>
                  {TONE_LABEL[r.tone]}
                </span>
              </div>
              <div className={`mt-3 space-y-2 leading-7 ${light ? "text-neutral-800" : "text-white/85"}`}>
                {r.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <div className="mt-10 flex justify-center gap-3">
          <ShareButton text={shareText} />
          <button onClick={onBack} className="rounded-xl border border-gold/60 bg-black/50 px-6 py-3 font-bold text-gold-bright">
            다른 사주 보기
          </button>
        </div>
        <p className={`mt-6 text-center text-xs ${sub}`}>사주풀이는 재미로 보는 참고용 콘텐츠입니다.</p>
      </div>
    </main>
  );
}

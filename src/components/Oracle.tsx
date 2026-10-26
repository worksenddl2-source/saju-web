import { ELEMENT_HANJA, type Element, type Mood } from "@/lib/saju";
import type { Theme } from "@/lib/theme";

const ROBE: Record<Element, string> = {
  wood: "#2f7a4a",
  fire: "#b8321f",
  earth: "#a77a2c",
  metal: "#c9d1dc",
  water: "#1f3f7a",
};

// 오행 수호신 예언자. 분위기에 따라 눈빛·오라 세기가 바뀐다.
export default function Oracle({ element, mood, theme, size = 220 }: { element: Element; mood: Mood; theme: Theme; size?: number }) {
  const robe = ROBE[element];
  const aura = mood === "dark" ? 0.75 : mood === "calm" ? 0.5 : 0.35;
  const eye = mood === "dark" ? "#ff5a3c" : theme.glow;
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 200 240" className="float" aria-hidden>
      <defs>
        <radialGradient id={`aura-${element}`}>
          <stop offset="0" stopColor={theme.glow} stopOpacity={aura} />
          <stop offset="1" stopColor={theme.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`robe-${element}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={robe} />
          <stop offset="1" stopColor="#0b0b12" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="110" r="100" fill={`url(#aura-${element})`} className="pulse" />
      {/* 로브 */}
      <path d="M100 52 C64 52 54 92 56 120 L34 230 H166 L144 120 C146 92 136 52 100 52Z" fill={`url(#robe-${element})`} />
      {/* 후드와 얼굴 그림자 */}
      <path d="M100 40 C70 40 58 70 60 104 C74 92 126 92 140 104 C142 70 130 40 100 40Z" fill={robe} />
      <ellipse cx="100" cy="98" rx="30" ry="26" fill="#07070c" />
      {/* 눈 */}
      {mood === "bright" ? (
        <g stroke={eye} strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M86 98 Q90 92 94 98" />
          <path d="M106 98 Q110 92 114 98" />
        </g>
      ) : mood === "calm" ? (
        <g stroke={eye} strokeWidth="3" strokeLinecap="round">
          <line x1="85" y1="98" x2="94" y2="98" />
          <line x1="106" y1="98" x2="115" y2="98" />
        </g>
      ) : (
        <g fill={eye} className="pulse">
          <path d="M84 96 L95 99 L84 101Z" />
          <path d="M116 96 L105 99 L116 101Z" />
        </g>
      )}
      {/* 손과 구슬 */}
      <ellipse cx="100" cy="176" rx="34" ry="10" fill="#0b0b12" opacity="0.5" />
      <circle cx="100" cy="160" r="22" fill={theme.glow} opacity="0.9" />
      <circle cx="100" cy="160" r="22" fill="none" stroke="#fff" strokeOpacity="0.5" />
      <text x="100" y="168" textAnchor="middle" fontSize="22" fontWeight="700" fill={robe}>
        {ELEMENT_HANJA[element]}
      </text>
    </svg>
  );
}

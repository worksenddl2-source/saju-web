import type { Element, Mood } from "@/lib/saju";
import type { Theme } from "@/lib/theme";

// 별 위치를 매번 같게 만드는 고정 시드 난수
function seeded(n: number) {
  let x = 1234567;
  return Array.from({ length: n }, () => {
    x = (x * 16807) % 2147483647;
    return x / 2147483647;
  });
}
const RAND = seeded(240);

function Stars({ color }: { color: string }) {
  return (
    <g>
      {Array.from({ length: 80 }, (_, i) => (
        <circle
          key={i}
          cx={RAND[i * 3] * 1200}
          cy={RAND[i * 3 + 1] * 420}
          r={0.6 + RAND[i * 3 + 2] * 1.6}
          fill={color}
          className="twinkle"
          style={{ animationDelay: `${(RAND[i * 3 + 2] * 4).toFixed(2)}s` }}
        />
      ))}
    </g>
  );
}

function Celestial({ t }: { t: Theme }) {
  if (t.celestial === "none") return null;
  const color = t.celestial === "blood-moon" ? "#c0281a" : t.glow;
  return (
    <g className="float-slow">
      <circle cx="880" cy="190" r="150" fill="url(#glow)" />
      <circle cx="880" cy="190" r={t.celestial === "sun" ? 70 : 56} fill={color} />
      {t.celestial !== "sun" && <circle cx="904" cy="176" r="50" fill={t.skyTop} opacity="0.85" />}
    </g>
  );
}

function Tree({ x, y, s, color }: { x: number; y: number; s: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="sway" style={{ transformOrigin: `${x}px ${y}px` }}>
      <rect x="-4" y="-20" width="8" height="40" fill={color} />
      <path d="M0 -120 L40 -40 L22 -40 L52 10 L-52 10 L-22 -40 L-40 -40 Z" fill={color} />
    </g>
  );
}

function Landscape({ element, t }: { element: Element; t: Theme }) {
  switch (element) {
    case "wood":
      return (
        <g>
          <path d="M0 560 Q200 470 420 540 T820 520 T1200 530 V800 H0Z" fill={t.far} />
          {[60, 180, 300, 690, 800, 940, 1080].map((x, i) => (
            <Tree key={x} x={x} y={590 - (i % 3) * 18} s={0.9 + (i % 3) * 0.25} color={t.near} />
          ))}
          <path d="M0 650 Q300 600 600 650 T1200 640 V800 H0Z" fill={t.near} />
        </g>
      );
    case "fire":
      return (
        <g>
          <path d="M0 600 L180 480 L260 520 L420 400 L560 520 L700 470 L880 560 L1040 450 L1200 540 V800 H0Z" fill={t.far} />
          {[150, 430, 760, 1050].map((x, i) => (
            <path
              key={x}
              className="flicker"
              style={{ transformOrigin: `${x}px 680px`, animationDelay: `${i * 0.3}s` }}
              d={`M${x} 680 C${x - 40} 640 ${x - 10} 600 ${x - 20} 560 C${x + 10} 590 ${x + 20} 560 ${x + 10} 520 C${x + 50} 580 ${x + 40} 640 ${x} 680Z`}
              fill={t.glow}
              opacity="0.85"
            />
          ))}
          <path d="M0 680 Q300 640 600 690 T1200 670 V800 H0Z" fill={t.near} />
        </g>
      );
    case "earth":
      return (
        <g>
          <path d="M0 520 L220 380 L380 470 L560 330 L760 480 L940 380 L1200 500 V800 H0Z" fill={t.far} opacity="0.7" />
          <path d="M0 600 L160 560 L300 600 H420 L470 540 H640 L690 600 L900 580 L1200 620 V800 H0Z" fill={t.far} />
          <path d="M0 690 Q400 650 800 690 T1200 680 V800 H0Z" fill={t.near} />
        </g>
      );
    case "metal":
      return (
        <g>
          <path d="M0 560 L120 420 L170 470 L300 300 L380 420 L460 360 L600 520 L720 330 L800 420 L900 380 L1040 500 L1200 400 V800 H0Z" fill={t.far} />
          <path d="M300 300 L330 360 L310 350 L290 380 Z M720 330 L750 380 L730 372 Z" fill={t.glow} opacity="0.35" />
          <path d="M0 660 L200 600 L360 650 L520 610 L700 660 L900 620 L1200 660 V800 H0Z" fill={t.near} />
        </g>
      );
    case "water":
      return (
        <g>
          <rect x="0" y="540" width="1200" height="260" fill={t.far} />
          <rect x="840" y="540" width="80" height="200" fill={t.glow} opacity="0.12" />
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              className="wave"
              style={{ animationDelay: `${i * 0.8}s` }}
              d={`M-200 ${580 + i * 50} Q-100 ${565 + i * 50} 0 ${580 + i * 50} T200 ${580 + i * 50} T400 ${580 + i * 50} T600 ${580 + i * 50} T800 ${580 + i * 50} T1000 ${580 + i * 50} T1200 ${580 + i * 50} T1400 ${580 + i * 50}`}
              stroke={t.glow}
              strokeOpacity={0.18 + i * 0.08}
              strokeWidth="2"
              fill="none"
            />
          ))}
          <path d="M0 740 Q300 720 600 745 T1200 735 V800 H0Z" fill={t.near} />
        </g>
      );
  }
}

export default function Scene({ element, mood, theme }: { element: Element; mood: Mood; theme: Theme }) {
  return (
    <svg className="fixed inset-0 -z-10 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={theme.skyTop} />
          <stop offset="1" stopColor={theme.skyBottom} />
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0" stopColor={theme.celestial === "blood-moon" ? "#ff3b2a" : theme.glow} stopOpacity="0.55" />
          <stop offset="1" stopColor={theme.glow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vignette" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#sky)" />
      {theme.stars && <Stars color={theme.glow} />}
      <Celestial t={theme} />
      <Landscape element={element} t={theme} />
      {theme.fog > 0 && <rect className="drift" x="-200" y="420" width="1600" height="380" fill={theme.skyBottom} opacity={theme.fog} />}
      {mood === "dark" && <rect width="1200" height="800" fill="url(#vignette)" />}
    </svg>
  );
}

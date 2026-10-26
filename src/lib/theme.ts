import type { Element, Mood } from "./saju";

export interface Theme {
  skyTop: string;
  skyBottom: string;
  far: string; // 먼 배경 실루엣
  near: string; // 가까운 전경
  glow: string; // 해·달·오라
  accent: string; // 글자 포인트
  card: string; // 카드 배경
  stars: boolean;
  fog: number; // 안개 짙기 0~1
  celestial: "sun" | "moon" | "blood-moon" | "none";
  label: string;
}

const SCENE_NAME: Record<Element, string> = {
  wood: "숲",
  fire: "불꽃의 노을",
  earth: "대지와 산",
  metal: "달빛 바위산",
  water: "밤바다",
};

const MOOD_NAME: Record<Mood, string> = { bright: "맑음", calm: "고요함", dark: "어둠" };

const PALETTE: Record<Element, Record<Mood, Omit<Theme, "label" | "card">>> = {
  wood: {
    bright: { skyTop: "#7cc6e8", skyBottom: "#e9f7d8", far: "#5fa36a", near: "#2f6b3c", glow: "#fff4b0", accent: "#1f5130", stars: false, fog: 0, celestial: "sun" },
    calm: { skyTop: "#1d3b4a", skyBottom: "#6f9a7c", far: "#2f5a45", near: "#173527", glow: "#f3e3a3", accent: "#bfe6b0", stars: true, fog: 0.15, celestial: "moon" },
    dark: { skyTop: "#05100c", skyBottom: "#1b2b22", far: "#0f2018", near: "#060d09", glow: "#8fbf9a", accent: "#8fd19e", stars: false, fog: 0.5, celestial: "moon" },
  },
  fire: {
    bright: { skyTop: "#ff9a5a", skyBottom: "#ffe2a8", far: "#d96a3b", near: "#8c2f1c", glow: "#fff1c1", accent: "#7a1f10", stars: false, fog: 0, celestial: "sun" },
    calm: { skyTop: "#3a1638", skyBottom: "#e3714a", far: "#7b2e33", near: "#3b1420", glow: "#ffcf87", accent: "#ffcf87", stars: true, fog: 0.1, celestial: "sun" },
    dark: { skyTop: "#0d0204", skyBottom: "#3a0a0a", far: "#2a0707", near: "#0f0203", glow: "#ff4a2e", accent: "#ff7a5c", stars: false, fog: 0.35, celestial: "blood-moon" },
  },
  earth: {
    bright: { skyTop: "#9fd0ef", skyBottom: "#fbe9c4", far: "#c79a5b", near: "#8a5a2b", glow: "#fff2b8", accent: "#5c3a16", stars: false, fog: 0, celestial: "sun" },
    calm: { skyTop: "#2b2440", skyBottom: "#c79568", far: "#6e4d34", near: "#3a2818", glow: "#f6d48f", accent: "#f6d48f", stars: true, fog: 0.15, celestial: "moon" },
    dark: { skyTop: "#0b0806", skyBottom: "#2d2116", far: "#1f170f", near: "#0b0805", glow: "#c7a46a", accent: "#d9b47a", stars: false, fog: 0.5, celestial: "none" },
  },
  metal: {
    bright: { skyTop: "#b9d4ec", skyBottom: "#f4f6f8", far: "#9aa6b2", near: "#5b6672", glow: "#ffffff", accent: "#2d3a46", stars: false, fog: 0.1, celestial: "sun" },
    calm: { skyTop: "#0f1830", skyBottom: "#5a6b86", far: "#3c4860", near: "#1a2132", glow: "#eef3ff", accent: "#d8e2f5", stars: true, fog: 0.15, celestial: "moon" },
    dark: { skyTop: "#030407", skyBottom: "#191d26", far: "#12151c", near: "#050608", glow: "#aab4c8", accent: "#c2ccdd", stars: true, fog: 0.4, celestial: "moon" },
  },
  water: {
    bright: { skyTop: "#5cb8f0", skyBottom: "#dff3ff", far: "#3f8fc7", near: "#1c5f96", glow: "#ffffff", accent: "#0e3a63", stars: false, fog: 0, celestial: "sun" },
    calm: { skyTop: "#050a24", skyBottom: "#24407a", far: "#14306a", near: "#081a40", glow: "#f2f0d8", accent: "#bcd6ff", stars: true, fog: 0.1, celestial: "moon" },
    dark: { skyTop: "#010208", skyBottom: "#0a1226", far: "#060c1c", near: "#02050d", glow: "#7f93b8", accent: "#9fb4dd", stars: false, fog: 0.55, celestial: "moon" },
  },
};

export function themeFor(element: Element, mood: Mood): Theme {
  const p = PALETTE[element][mood];
  return {
    ...p,
    card: mood === "bright" ? "rgba(255,255,255,0.78)" : "rgba(8,8,16,0.62)",
    label: `${SCENE_NAME[element]} · ${MOOD_NAME[mood]}`,
  };
}

export function isLight(mood: Mood) {
  return mood === "bright";
}

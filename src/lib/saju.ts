import { Lunar, Solar } from "lunar-javascript";

export type Element = "wood" | "fire" | "earth" | "metal" | "water";
export type Calendar = "S_C" | "L_C" | "L_L"; // 양력 / 음력 평달 / 음력 윤달
export type TenGodGroup = "peer" | "output" | "wealth" | "power" | "resource";
export type Mood = "bright" | "calm" | "dark";

export interface SajuInput {
  name: string;
  sex: "M" | "F";
  year: number;
  month: number;
  day: number;
  hour: number; // 시진 번호 0~11 (子=0), -1 = 모름
  calendar: Calendar;
}

export interface Pillar {
  label: string;
  stem: string;
  branch: string;
  stemElement: Element;
  branchElement: Element;
  stemGod: string | null; // 일간 자신은 null
  branchGod: string;
}

export interface SajuResult {
  input: SajuInput;
  solarDate: string;
  pillars: Pillar[]; // 시주(있을 때) · 일주 · 월주 · 년주 순
  dayMaster: string;
  dayElement: Element;
  elements: Record<Element, number>;
  strongest: Element;
  missing: Element[];
  groups: Record<TenGodGroup, number>;
  strength: "strong" | "weak" | "balanced";
  zodiac: string;
  mood: Mood;
}

export const STEMS = "甲乙丙丁戊己庚辛壬癸";
export const BRANCHES = "子丑寅卯辰巳午未申酉戌亥";
export const STEM_KO = "갑을병정무기경신임계";
export const BRANCH_KO = "자축인묘진사오미신유술해";
export const ZODIAC = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
export const ELEMENTS: Element[] = ["wood", "fire", "earth", "metal", "water"];
export const ELEMENT_KO: Record<Element, string> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
export const ELEMENT_HANJA: Record<Element, string> = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };
export const HOURS = [
  "子 (23:30 ~ 01:29)", "丑 (01:30 ~ 03:29)", "寅 (03:30 ~ 05:29)", "卯 (05:30 ~ 07:29)",
  "辰 (07:30 ~ 09:29)", "巳 (09:30 ~ 11:29)", "午 (11:30 ~ 13:29)", "未 (13:30 ~ 15:29)",
  "申 (15:30 ~ 17:29)", "酉 (17:30 ~ 19:29)", "戌 (19:30 ~ 21:29)", "亥 (21:30 ~ 23:29)",
];

const STEM_ELEMENT: Element[] = ["wood", "wood", "fire", "fire", "earth", "earth", "metal", "metal", "water", "water"];
const BRANCH_ELEMENT: Element[] = ["water", "earth", "wood", "wood", "earth", "fire", "fire", "earth", "metal", "metal", "earth", "water"];
// 지지의 본기(정기) 천간 인덱스: 子癸 丑己 寅甲 卯乙 辰戊 巳丙 午丁 未己 申庚 酉辛 戌戊 亥壬
const BRANCH_MAIN_STEM = [9, 5, 0, 1, 4, 2, 3, 5, 6, 7, 4, 8];

// 상생: 목→화→토→금→수→목, 상극: 목→토→수→화→금→목
const GENERATES: Record<Element, Element> = { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" };
const CONTROLS: Record<Element, Element> = { wood: "earth", earth: "water", water: "fire", fire: "metal", metal: "wood" };

export function tenGodGroup(me: Element, other: Element): TenGodGroup {
  if (me === other) return "peer";
  if (GENERATES[me] === other) return "output";
  if (CONTROLS[me] === other) return "wealth";
  if (CONTROLS[other] === me) return "power";
  return "resource";
}

const GOD_NAMES: Record<TenGodGroup, [string, string]> = {
  peer: ["비견", "겁재"],
  output: ["식신", "상관"],
  wealth: ["편재", "정재"],
  power: ["편관", "정관"],
  resource: ["편인", "정인"],
};

function tenGod(dayStem: number, otherStem: number): string {
  const group = tenGodGroup(STEM_ELEMENT[dayStem], STEM_ELEMENT[otherStem]);
  const samePolarity = dayStem % 2 === otherStem % 2;
  return GOD_NAMES[group][samePolarity ? 0 : 1];
}

export function calculate(input: SajuInput): SajuResult {
  // 시간을 모르면 정오로 계산하고 시주는 버린다
  const hour = input.hour < 0 ? 12 : input.hour * 2;
  const lunarMonth = input.calendar === "L_L" ? -input.month : input.month;
  const lunar =
    input.calendar === "S_C"
      ? Solar.fromYmdHms(input.year, input.month, input.day, hour, 0, 0).getLunar()
      : Lunar.fromYmdHms(input.year, lunarMonth, input.day, hour, 0, 0);
  const solar = lunar.getSolar();
  const ec = lunar.getEightChar();

  const raw: [string, string][] = [
    ["생시", ec.getTime()],
    ["생일", ec.getDay()],
    ["생월", ec.getMonth()],
    ["생년", ec.getYear()],
  ];
  const used = input.hour < 0 ? raw.slice(1) : raw;
  const dayStem = STEMS.indexOf(ec.getDay()[0]);
  const dayElement = STEM_ELEMENT[dayStem];

  const elements: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const groups: Record<TenGodGroup, number> = { peer: 0, output: 0, wealth: 0, power: 0, resource: 0 };

  const pillars: Pillar[] = used.map(([label, gz]) => {
    const s = STEMS.indexOf(gz[0]);
    const b = BRANCHES.indexOf(gz[1]);
    const stemElement = STEM_ELEMENT[s];
    const branchElement = BRANCH_ELEMENT[b];
    elements[stemElement]++;
    elements[branchElement]++;
    const isDayMaster = label === "생일";
    if (!isDayMaster) groups[tenGodGroup(dayElement, stemElement)]++;
    groups[tenGodGroup(dayElement, branchElement)]++;
    return {
      label,
      stem: gz[0],
      branch: gz[1],
      stemElement,
      branchElement,
      stemGod: isDayMaster ? null : tenGod(dayStem, s),
      branchGod: tenGod(dayStem, BRANCH_MAIN_STEM[b]),
    };
  });

  const strongest = ELEMENTS.reduce((a, b) => (elements[b] > elements[a] ? b : a));
  const missing = ELEMENTS.filter((e) => elements[e] === 0);
  const total = used.length * 2;

  // 일간을 돕는 기운(비겁·인성) + 일간 자신(1)과 나머지를 비교
  const support = groups.peer + groups.resource + 1;
  const drain = total - support;
  const strength = support - drain >= 2 ? "strong" : drain - support >= 2 ? "weak" : "balanced";

  // 오행이 고르면 밝게, 크게 치우치거나 둘 이상 빠지면 어둡게
  const max = elements[strongest];
  const skew = max / total;
  const mood: Mood =
    missing.length >= 2 || skew >= 0.5 ? "dark" : missing.length === 0 && skew <= 0.3 ? "bright" : "calm";

  return {
    input,
    solarDate: `${solar.getYear()}-${String(solar.getMonth()).padStart(2, "0")}-${String(solar.getDay()).padStart(2, "0")}`,
    pillars,
    dayMaster: ec.getDay()[0],
    dayElement,
    elements,
    strongest,
    missing,
    groups,
    strength,
    zodiac: ZODIAC[BRANCHES.indexOf(ec.getYear()[1])],
    mood,
  };
}

export function stemKo(stem: string) {
  return STEM_KO[STEMS.indexOf(stem)];
}

export function branchKo(branch: string) {
  return BRANCH_KO[BRANCHES.indexOf(branch)];
}

export function elementOfChar(ch: string): Element {
  const s = STEMS.indexOf(ch);
  return s >= 0 ? STEM_ELEMENT[s] : BRANCH_ELEMENT[BRANCHES.indexOf(ch)];
}

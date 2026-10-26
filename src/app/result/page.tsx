import { redirect } from "next/navigation";
import ResultClient from "./ResultClient";
import { calculate, type Calendar, type SajuInput } from "@/lib/saju";

// 입력값(URL)으로 바로 계산하는 페이지라 미리 렌더링하지 않는다
export const instant = false;

function parse(sp: Record<string, string | string[] | undefined>): SajuInput | null {
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const m = get("birth").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const cal = get("cal") as Calendar;
  const hour = Number(get("hour") || "-1");
  if (!m || !["S_C", "L_C", "L_L"].includes(cal) || !(hour >= -1 && hour <= 11)) return null;
  return {
    name: get("name").slice(0, 20) || "손님",
    sex: get("sex") === "F" ? "F" : "M",
    year: +m[1],
    month: +m[2],
    day: +m[3],
    hour,
    calendar: cal,
  };
}

export default async function ResultPage({ searchParams }: PageProps<"/result">) {
  const input = parse(await searchParams);
  if (!input) redirect("/");
  try {
    calculate(input);
  } catch {
    // 존재하지 않는 음력 윤달 등
    redirect("/");
  }
  return <ResultClient input={input} />;
}

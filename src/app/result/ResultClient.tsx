"use client";

import { useRouter } from "next/navigation";
import ResultView from "@/components/ResultView";
import { calculate, type SajuInput } from "@/lib/saju";

export default function ResultClient({ input }: { input: SajuInput }) {
  const router = useRouter();
  return <ResultView result={calculate(input)} onBack={() => router.push("/")} />;
}

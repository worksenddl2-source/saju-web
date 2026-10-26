"use client";

import { useRouter } from "next/navigation";
import SajuForm from "@/components/SajuForm";

const pad = (n: number) => String(n).padStart(2, "0");

export default function HomeForm() {
  const router = useRouter();
  return (
    <SajuForm
      onDone={(i) =>
        router.push(
          `/result?${new URLSearchParams({
            name: i.name,
            sex: i.sex,
            cal: i.calendar,
            birth: `${i.year}-${pad(i.month)}-${pad(i.day)}`,
            hour: String(i.hour),
          })}`,
        )
      }
    />
  );
}

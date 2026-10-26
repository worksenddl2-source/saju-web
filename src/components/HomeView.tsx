import Oracle from "@/components/Oracle";
import Scene from "@/components/Scene";
import { guardianOf } from "@/lib/readings";
import { ELEMENTS, ELEMENT_HANJA } from "@/lib/saju";
import { themeFor } from "@/lib/theme";

const GUARDIAN_LINE: Record<string, string> = {
  wood: "성장과 시작을 읽는다",
  fire: "열정과 표현을 읽는다",
  earth: "믿음과 중심을 읽는다",
  metal: "결단과 의리를 읽는다",
  water: "지혜와 흐름을 읽는다",
};

export default function HomeView({ form }: { form: React.ReactNode }) {
  const bg = themeFor("water", "calm");
  return (
    <main className="relative flex-1">
      <Scene element="water" mood="calm" theme={bg} />

      <section className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-16 pt-14 text-center">
        <p className="mb-3 text-sm tracking-[0.3em] text-gold">五行 守護神</p>
        <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
          오행 수호신이 읽어주는
          <br />
          <span className="text-gold-bright">당신의 평생사주</span>
        </h1>
        <p className="mt-4 max-w-md text-white/70">
          생년월일만 알려주면 사주팔자를 세우고, 당신의 기운에 맞는 수호신이 17가지 운명을 들려줍니다. 회원가입은 필요 없습니다.
        </p>

        <div className="mt-10 w-full">
          {form}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24">
        <h2 className="mb-2 text-center font-serif text-2xl text-white">다섯 수호신</h2>
        <p className="mb-8 text-center text-sm text-white/60">
          태어난 날의 기운(일간)에 따라 수호신이 정해지고, 사주의 균형에 따라 세상의 빛깔이 달라집니다.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {ELEMENTS.map((e) => (
            <div key={e} className="flex flex-col items-center rounded-2xl border border-gold/15 bg-black/40 p-4 backdrop-blur">
              <Oracle element={e} mood="calm" theme={themeFor(e, "calm")} size={110} />
              <p className="mt-2 font-serif text-lg text-gold-bright">
                {guardianOf(e)} <span className="text-white/50">{ELEMENT_HANJA[e]}</span>
              </p>
              <p className="text-xs text-white/60">{GUARDIAN_LINE[e]}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/60 py-6 text-center text-xs text-white/40">
        사주풀이는 재미로 보는 참고용 콘텐츠입니다.
      </footer>
    </main>
  );
}

// 서버 없이 브라우저만으로 동작하는 단일 HTML 버전의 진입점 (scripts/build-standalone.mjs 참고)
import { useState } from "react";
import { createRoot } from "react-dom/client";
import HomeView from "@/components/HomeView";
import ResultView from "@/components/ResultView";
import SajuForm from "@/components/SajuForm";
import { calculate, type SajuResult } from "@/lib/saju";

function App() {
  const [result, setResult] = useState<SajuResult | null>(null);

  function show(next: SajuResult | null) {
    setResult(next);
    window.scrollTo(0, 0);
  }

  return (
    <div className="flex min-h-full flex-col">
      {result ? (
        <ResultView key={JSON.stringify(result.input)} result={result} onBack={() => show(null)} />
      ) : (
        <HomeView form={<SajuForm onDone={(input) => show(calculate(input))} />} />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

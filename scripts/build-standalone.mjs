// 사이트 전체를 한 장의 HTML(dist/saju.html)로 묶는다. 서버 없이 어디에 올려도 열린다.
//   node scripts/build-standalone.mjs
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { build } from "esbuild";

mkdirSync("dist", { recursive: true });

const js = await build({
  entryPoints: ["src/standalone/main.tsx"],
  bundle: true,
  minify: true,
  write: false,
  format: "iife",
  jsx: "automatic",
  alias: { "@": "./src" },
  define: { "process.env.NODE_ENV": '"production"' },
  target: "es2020",
});

execSync("npx @tailwindcss/cli -i src/app/globals.css -o dist/standalone.css --minify", { stdio: "inherit" });
const css = readFileSync("dist/standalone.css", "utf8");
const script = js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

const head = `<title>오행 수호신 평생사주</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@500;700&display=swap">
<style>
:root { --font-sans-kr: "Noto Sans KR"; --font-serif-kr: "Noto Serif KR", serif; color-scheme: dark; }
html, body { min-height: 100%; }
#root { min-height: 100vh; display: flex; flex-direction: column; }
${css}
</style>
`;
const body = `<div id="root"></div>
<script>${script}</script>
`;
const page = head + body;
// saju.html: claude.ai 아티팩트용 본문 조각 (문서 뼈대는 게시할 때 붙는다)
// index.html: GitHub Pages 등 일반 웹 호스팅용 완성 문서
writeFileSync("dist/saju.html", page);
writeFileSync(
  "dist/index.html",
  `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="생년월일을 입력하면 사주팔자와 오행을 계산해 평생사주 17개 항목을 풀어드립니다.">
<style>body { margin: 0; }</style>
${head}</head>
<body>
${body}</body>
</html>
`,
);
console.log(`dist/index.html ${(page.length / 1024).toFixed(0)} KB`);

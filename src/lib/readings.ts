import {
  ELEMENT_KO,
  STEMS,
  tenGodGroup,
  type Element,
  type SajuResult,
  type TenGodGroup,
} from "./saju";

export type Tone = "good" | "normal" | "caution";

export interface Reading {
  title: string;
  tone: Tone;
  body: string[];
}

interface StemProfile {
  image: string;
  nature: string;
  gift: string;
  flaw: string;
  love: string;
  jobs: string;
}

const STEM_PROFILE: StemProfile[] = [
  { image: "하늘로 곧게 뻗은 큰 나무", nature: "곧고 우직하며 남보다 먼저 앞장서는 사람", gift: "흔들림 없는 추진력과 리더십", flaw: "한번 정하면 굽히지 않아 주변과 부딪히는 일", love: "상대가 기댈 수 있게 듬직하게 버텨주는", jobs: "기획자, 교육자, 경영자" },
  { image: "바람에 흔들려도 꺾이지 않는 덩굴", nature: "부드럽고 유연해 어디서든 뿌리를 내리는 사람", gift: "사람과 사람을 엮어내는 친화력과 끈기", flaw: "남의 눈치를 보느라 결정을 미루는 일", love: "작은 것까지 섬세하게 챙기고 표현하는", jobs: "디자이너, 상담가, 마케터" },
  { image: "온 세상을 비추는 태양", nature: "밝고 열정적이며 속을 숨기지 않는 사람", gift: "사람을 끌어당기는 에너지와 표현력", flaw: "쉽게 달아오르고 쉽게 식는 마음", love: "솔직하고 뜨겁게 마음을 드러내는", jobs: "방송인, 영업 전문가, 강사" },
  { image: "어둠 속을 밝히는 촛불", nature: "따뜻하고 섬세하며 속이 깊은 사람", gift: "한 가지에 몰입하는 집중력과 배려심", flaw: "서운한 마음을 속으로만 삭이는 습관", love: "조용하지만 깊고 오래 헌신하는", jobs: "연구원, 작가, 의료인" },
  { image: "넓고 묵직한 큰 산", nature: "믿음직하고 품이 넓어 사람들이 모여드는 사람", gift: "어떤 상황에서도 중심을 잡는 신뢰감", flaw: "변화에 느리고 속마음을 잘 말하지 않는 무뚝뚝함", love: "말보다 행동으로 변함없이 곁을 지키는", jobs: "공무원, 부동산 전문가, 관리자" },
  { image: "곡식을 길러내는 기름진 밭", nature: "현실적이고 꼼꼼하며 실속을 챙기는 사람", gift: "사람과 일을 키워내는 살림 솜씨", flaw: "걱정이 많아 쉽게 의심하는 마음", love: "일상을 함께 가꾸며 정을 쌓아가는", jobs: "회계사, 교육자, 요식업 경영자" },
  { image: "단단한 바위와 무쇠", nature: "결단력이 있고 의리를 목숨처럼 여기는 사람", gift: "위기 앞에서 더 빛나는 결단력", flaw: "직설적인 말로 뜻하지 않게 상처를 주는 일", love: "표현은 서툴러도 마음만큼은 확실한", jobs: "군인·경찰, 엔지니어, 운동선수" },
  { image: "갈고닦은 보석", nature: "깔끔하고 자존심이 강하며 감각이 뛰어난 사람", gift: "무엇이든 완성도를 끌어올리는 안목", flaw: "작은 상처도 오래 기억하는 예민함", love: "취향이 맞는 사람과 우아하게 이어가는", jobs: "패션·뷰티 전문가, 금융인, 전문직" },
  { image: "끝없이 흘러가는 큰 강", nature: "생각이 깊고 스케일이 큰 사람", gift: "멀리 내다보는 지혜와 넓은 시야", flaw: "방향을 정하지 못하고 흘러가 버리는 일", love: "구속하지 않고 너그럽게 품어주는", jobs: "무역인, 전략 기획자, 여행 전문가" },
  { image: "조용히 스며드는 봄비", nature: "총명하고 직관이 뛰어난 사람", gift: "보이지 않는 마음까지 읽어내는 감수성", flaw: "생각이 많아 걱정을 스스로 키우는 일", love: "상대의 마음을 먼저 알아채고 맞춰주는", jobs: "심리 상담가, 개발자, 예술가" },
];

interface ElementInfo {
  organ: string;
  taste: string;
  habit: string;
  color: string;
  excess: string;
  lack: string;
}

const ELEMENT_INFO: Record<Element, ElementInfo> = {
  wood: { organ: "간과 담, 눈, 근육", taste: "신맛", habit: "숲길 걷기와 꾸준한 스트레칭", color: "초록색", excess: "고집과 조급함이 커지기 쉽습니다", lack: "새로 시작하는 힘과 성장 의욕이 약해지기 쉽습니다" },
  fire: { organ: "심장과 혈액순환", taste: "쓴맛", habit: "햇볕 아래 산책과 가벼운 유산소 운동", color: "붉은색", excess: "감정 기복과 성급한 말이 늘기 쉽습니다", lack: "열정과 자기표현이 약해 존재감이 가려지기 쉽습니다" },
  earth: { organ: "위장과 비장, 소화기", taste: "단맛", habit: "규칙적인 식사와 가벼운 등산", color: "노란색", excess: "생각이 많아지고 움직임이 무거워지기 쉽습니다", lack: "마음의 중심이 흔들리고 신뢰를 쌓는 데 시간이 걸립니다" },
  metal: { organ: "폐와 대장, 피부, 호흡기", taste: "매운맛", habit: "깊은 호흡 운동과 수영", color: "흰색", excess: "날카로운 말과 냉정함이 앞서기 쉽습니다", lack: "결단을 내리고 맺고 끊는 힘이 약해지기 쉽습니다" },
  water: { organ: "신장과 방광, 허리", taste: "짠맛", habit: "충분한 수면과 반신욕", color: "검은색과 남색", excess: "생각과 걱정이 많아 실행이 늦어지기 쉽습니다", lack: "지혜를 쌓고 쉬어 가는 여유가 부족해지기 쉽습니다" },
};

const GROUP_INFO: Record<TenGodGroup, { name: string; social: string; career: string; money: string; period: string }> = {
  peer: { name: "비겁(나와 같은 기운)", social: "동료와 함께할 때 힘이 나고 경쟁 속에서 성장하는", career: "독립이나 창업, 팀을 이끄는 일", money: "벌어들이는 만큼 사람에게 나가는 돈도 많습니다", period: "형제·친구와 어울리며 자립심을 키우는" },
  output: { name: "식상(재능과 표현)", social: "말과 재주로 주목받고 분위기를 이끄는", career: "창작, 기술, 서비스처럼 손과 말로 만드는 일", money: "재능을 돈으로 바꾸는 감각이 있습니다", period: "재주와 끼가 일찍 드러나 칭찬을 받는" },
  wealth: { name: "재성(재물과 현실 감각)", social: "현실 감각이 좋아 성과를 숫자로 보여주는", career: "사업, 영업, 금융처럼 돈의 흐름을 다루는 일", money: "돈이 어디로 흐르는지 읽는 눈이 있습니다", period: "일찍부터 돈과 현실에 눈을 뜨는" },
  power: { name: "관성(책임과 명예)", social: "조직 안에서 책임을 맡고 원칙을 지키는", career: "공직, 대기업, 관리직처럼 체계 안에서 오르는 일", money: "직위와 월급을 통해 안정적으로 모으는 편입니다", period: "규율과 책임을 일찍 배우는" },
  resource: { name: "인성(배움과 도움)", social: "배움과 자격으로 인정받고 윗사람의 도움을 받는", career: "교육, 연구, 자격이 필요한 전문직", money: "문서·자격·부동산처럼 남는 자산으로 재물을 지킵니다", period: "부모와 스승의 보살핌 속에 배움을 쌓는" },
};

function josa(word: string, withFinal: string, withoutFinal: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  const hasFinal = code >= 0 && code <= 11171 && code % 28 !== 0;
  return word + (hasFinal ? withFinal : withoutFinal);
}

const GUARDIAN: Record<Element, string> = { wood: "청룡", fire: "주작", earth: "황룡", metal: "백호", water: "현무" };

export function guardianOf(e: Element) {
  return GUARDIAN[e];
}

function dominantGroup(r: SajuResult): TenGodGroup {
  const order: TenGodGroup[] = ["wealth", "power", "output", "resource", "peer"];
  return order.reduce((a, b) => (r.groups[b] > r.groups[a] ? b : a));
}

function pillarGroup(r: SajuResult, label: string): TenGodGroup | null {
  const p = r.pillars.find((x) => x.label === label);
  return p ? tenGodGroup(r.dayElement, p.branchElement) : null;
}

const PERIOD_TONE: Record<TenGodGroup, Record<"strong" | "weak" | "balanced", Tone>> = {
  peer: { strong: "caution", weak: "good", balanced: "normal" },
  output: { strong: "good", weak: "normal", balanced: "good" },
  wealth: { strong: "good", weak: "caution", balanced: "good" },
  power: { strong: "good", weak: "caution", balanced: "normal" },
  resource: { strong: "normal", weak: "good", balanced: "good" },
};

export function buildReadings(r: SajuResult): Reading[] {
  const sp = STEM_PROFILE[STEMS.indexOf(r.dayMaster)];
  const strong = ELEMENT_INFO[r.strongest];
  const dom = dominantGroup(r);
  const gi = GROUP_INFO[dom];
  const lackKo = r.missing.map((e) => ELEMENT_KO[e]).join("·");
  const weakest = r.missing[0] ?? (["wood", "fire", "earth", "metal", "water"] as Element[]).reduce((a, b) => (r.elements[b] < r.elements[a] ? b : a));
  const weakInfo = ELEMENT_INFO[weakest];
  const strengthText =
    r.strength === "strong"
      ? "타고난 기운이 강해 스스로 길을 개척하는 힘이 있습니다."
      : r.strength === "weak"
        ? "타고난 기운이 여린 편이라 좋은 사람과 환경을 만날수록 크게 피어납니다."
        : "기운이 한쪽으로 크게 기울지 않아 상황에 맞게 균형을 잡는 힘이 있습니다.";

  const moodText =
    r.mood === "bright"
      ? "오행이 고르게 어우러져 큰 굴곡 없이 자기 몫을 꾸준히 키워가는 사주입니다."
      : r.mood === "calm"
        ? "빛과 그림자가 함께 있는 사주로, 부족한 기운을 채워갈수록 운이 단단해집니다."
        : `기운이 한쪽으로 크게 치우친 사주라 굴곡이 깊을 수 있지만, 그만큼 한 분야에서 남다른 깊이를 가질 수 있습니다.`;

  const early = pillarGroup(r, "생년") ?? dom;
  const middle = pillarGroup(r, "생월") ?? dom;
  const late = pillarGroup(r, "생시") ?? pillarGroup(r, "생일") ?? dom;

  const wealthCount = r.groups.wealth;
  const wealthTone: Tone = wealthCount === 0 ? "caution" : r.strength === "weak" && wealthCount >= 3 ? "caution" : wealthCount >= 1 && r.strength !== "weak" ? "good" : "normal";
  const loveGroup = r.input.sex === "M" ? "wealth" : "power";
  const loveCount = r.groups[loveGroup];

  return [
    {
      title: "총평",
      tone: r.mood === "bright" ? "good" : r.mood === "dark" ? "caution" : "normal",
      body: [
        `${r.input.name}님은 ${sp.image}의 기운을 타고난 ${sp.nature}입니다.`,
        moodText,
        `사주에서 가장 강한 기운은 ${ELEMENT_KO[r.strongest]}(${r.elements[r.strongest]}개)이고, 십신으로는 ${gi.name}의 힘이 두드러집니다. ${strengthText}`,
        r.missing.length ? `${lackKo}의 기운이 비어 있으니 그 기운을 보태는 사람과 습관을 가까이하면 좋습니다.` : "다섯 기운이 모두 갖춰져 있어 어느 쪽으로든 쓰임이 있는 사주입니다.",
      ],
    },
    {
      title: "초년운",
      tone: PERIOD_TONE[early][r.strength],
      body: [
        `초년에는 ${GROUP_INFO[early].period} 시기를 보냅니다.`,
        early === "power" || early === "peer" ? "어린 나이에 감당해야 할 몫이 있어 철이 일찍 들 수 있습니다." : "주변의 관심 속에서 자기 색깔을 일찍 찾아가는 편입니다.",
        `이 시기에 익힌 ${josa(sp.gift, "이", "가")} 평생의 밑천이 됩니다.`,
      ],
    },
    {
      title: "중년운",
      tone: PERIOD_TONE[middle][r.strength],
      body: [
        `중년에는 ${GROUP_INFO[middle].period} 흐름이 이어지며, ${GROUP_INFO[middle].career}에서 성과가 나기 쉽습니다.`,
        r.strength === "weak" ? "혼자 모든 것을 짊어지기보다 믿을 만한 조력자를 곁에 두는 것이 운을 키우는 길입니다." : "스스로 판을 짜고 밀어붙일 때 결과가 가장 좋습니다.",
        `다만 ${josa(sp.flaw, "은", "는")} 이 시기에 특히 조심해야 합니다.`,
      ],
    },
    {
      title: "말년운",
      tone: PERIOD_TONE[late][r.strength] === "caution" ? "normal" : "good",
      body: [
        `말년에는 ${GROUP_INFO[late].period} 기운이 함께하여 그동안 쌓은 것을 정리하고 누리는 시기가 됩니다.`,
        late === "resource" || late === "output" ? "배우고 가르치며 다음 세대에게 경험을 나누는 데서 큰 보람을 느낍니다." : "사람과 재물이 곁에 남아 외롭지 않은 노후를 보냅니다.",
        r.input.hour < 0 ? "태어난 시간을 알면 말년운을 더 정확하게 볼 수 있습니다." : "",
      ].filter(Boolean),
    },
    {
      title: "건강운",
      tone: r.missing.length >= 2 || r.elements[r.strongest] >= 4 ? "caution" : "normal",
      body: [
        `${ELEMENT_KO[r.strongest]} 기운이 강해 ${strong.organ} 쪽에 무리가 오기 쉽습니다.`,
        `반대로 ${ELEMENT_KO[weakest]} 기운이 약하니 ${weakInfo.organ} 건강을 미리 챙기세요.`,
        `${josa(weakInfo.habit, "이", "가")} 몸의 균형을 잡는 데 도움이 됩니다.`,
      ],
    },
    {
      title: "체질운",
      tone: "normal",
      body: [
        `${ELEMENT_KO[r.strongest]} 기운이 중심인 체질이라 ${strong.taste}을 지나치게 즐기면 균형이 깨지기 쉽습니다.`,
        `${weakInfo.taste} 음식과 ${weakInfo.color}을 생활 가까이 두면 부족한 기운을 채울 수 있습니다.`,
        r.strength === "strong" ? "기초 체력이 좋은 편이지만 과로를 자주 넘기면 한꺼번에 탈이 납니다." : "쉽게 지치는 편이니 잠과 식사 시간을 일정하게 지키는 것이 가장 좋은 보약입니다.",
      ],
    },
    {
      title: "사회운",
      tone: r.groups.power + r.groups.resource >= 2 ? "good" : "normal",
      body: [
        `사회에서는 ${gi.social} 사람으로 평가받습니다.`,
        `잘 맞는 분야는 ${gi.career}입니다.`,
        r.groups.power === 0 ? "조직의 틀이 답답하게 느껴질 수 있으니 자율성이 보장되는 환경을 고르는 것이 좋습니다." : "윗사람에게 신뢰를 얻기 쉬워 책임 있는 자리를 맡을 기회가 옵니다.",
      ],
    },
    {
      title: "사회적성격",
      tone: "normal",
      body: [
        r.groups.peer >= 2 ? "경쟁심이 강하고 지기 싫어해 팀 안에서 존재감이 뚜렷합니다." : "다투기보다 조율하는 쪽을 택해 갈등을 부드럽게 넘깁니다.",
        r.groups.output >= 2 ? "말솜씨와 아이디어가 좋아 회의에서 분위기를 주도합니다." : "말보다 결과로 보여주는 편이라 처음엔 조용해 보여도 시간이 지날수록 인정받습니다.",
        `다만 ${josa(sp.flaw, "이", "가")} 인간관계의 걸림돌이 될 수 있습니다.`,
      ],
    },
    {
      title: "성격운",
      tone: "good",
      body: [
        `${sp.image}처럼 ${sp.nature}입니다.`,
        `가장 큰 장점은 ${sp.gift}입니다.`,
        `${ELEMENT_KO[r.strongest]} 기운이 강해 ${strong.excess}`,
      ],
    },
    {
      title: "타고난 성향",
      tone: "normal",
      body: [
        r.strength === "strong" ? "남의 지시보다 스스로 정한 길을 갈 때 힘이 나는 주도형입니다." : r.strength === "weak" ? "함께하는 사람의 기운을 받아 성장하는 협력형입니다." : "상황에 따라 앞에 서기도, 뒤에서 받치기도 하는 균형형입니다.",
        r.missing.length ? `${lackKo} 기운이 비어 있어 ${ELEMENT_INFO[r.missing[0]].lack}` : "기운이 고루 갖춰져 낯선 환경에도 금방 적응합니다.",
      ],
    },
    {
      title: "타고난 인품",
      tone: "good",
      body: [
        r.groups.resource >= 2 ? "배우는 것을 좋아하고 예의를 중시해 어른들에게 사랑받습니다." : "격식보다 진심을 중시해 꾸밈없는 사람으로 기억됩니다.",
        r.groups.power >= 2 ? "약속과 원칙을 지키는 사람이라 믿고 일을 맡길 수 있다는 평을 듣습니다." : "자유로운 기질 덕분에 어떤 사람과도 편하게 어울립니다.",
      ],
    },
    {
      title: "이성운",
      tone: loveCount === 0 ? "caution" : loveCount >= 3 ? "normal" : "good",
      body: [
        loveCount === 0
          ? "이성의 기운이 사주에 드러나지 않아 인연이 늦게 오거나 스스로 연애에 관심을 덜 두는 편입니다."
          : loveCount >= 3
            ? "이성의 기운이 많아 인기가 많지만 그만큼 인연을 고르는 눈이 필요합니다."
            : "이성의 기운이 알맞게 자리해 자연스럽게 좋은 인연을 만나는 편입니다.",
        `${sp.love} 사랑을 할 때 가장 행복합니다.`,
      ],
    },
    {
      title: "애정운",
      tone: r.groups.peer >= 3 ? "caution" : "good",
      body: [
        `연애를 시작하면 ${sp.love} 모습을 보여줍니다.`,
        r.groups.peer >= 3 ? "자존심 싸움으로 번지기 쉬우니 먼저 한 발 물러서는 연습이 관계를 지켜줍니다." : "서로의 속도를 맞춰가며 오래가는 관계를 만듭니다.",
        r.groups.output >= 2 ? "표현이 풍부해 상대를 즐겁게 하지만 말이 앞서지 않도록 주의하세요." : "표현이 적은 편이니 가끔은 마음을 말로 전해주세요.",
      ],
    },
    {
      title: "재물운",
      tone: wealthTone,
      body: [
        wealthCount === 0 ? "사주에 재물의 기운이 드러나지 않아 돈보다 실력과 명예를 먼저 쫓는 편입니다." : `재물의 기운이 ${wealthCount}개 자리하고 있어 ${GROUP_INFO.wealth.money}`,
        `${gi.money}`,
        r.strength === "weak" && wealthCount >= 2 ? "큰돈을 혼자 감당하면 오히려 부담이 되니 나눠서 굴리는 것이 좋습니다." : "꾸준히 쌓아가면 중년 이후 재물이 눈에 띄게 늘어납니다.",
      ],
    },
    {
      title: "재물모으는법",
      tone: "good",
      body: [
        `가장 잘 맞는 돈벌이는 ${gi.career}입니다.`,
        r.groups.resource >= 1 ? "자격증이나 문서로 남는 자산(부동산, 연금)이 재물을 지켜줍니다." : "수입이 생기는 즉시 일정 비율을 자동으로 떼어두는 습관이 가장 효과적입니다.",
        `${ELEMENT_INFO[weakest].color} 지갑이나 소품이 부족한 기운을 채워 재물 흐름을 돕습니다.`,
      ],
    },
    {
      title: "재물손실 막는법",
      tone: r.groups.peer >= 2 ? "caution" : "normal",
      body: [
        r.groups.peer >= 2 ? "가까운 사람과의 돈 거래, 보증, 동업에서 손실이 나기 쉽습니다. 정이 많을수록 계약서를 먼저 챙기세요." : "충동적인 소비보다 '남들이 다 한다'는 투자에서 손실이 나기 쉽습니다.",
        r.groups.output >= 3 ? "기분에 따라 쓰는 돈이 많으니 큰 지출은 하루 미뤘다가 결정하세요." : "",
        `${josa(sp.flaw, "이", "가")} 돈 문제로 번지지 않도록 큰 결정은 믿을 만한 사람과 상의하세요.`,
      ].filter(Boolean),
    },
    {
      title: "재테크비법",
      tone: "normal",
      body: [
        r.strength === "strong" ? "기운이 강해 어느 정도 위험을 감수하는 투자도 감당할 수 있습니다. 다만 한 번에 몰아넣지는 마세요." : "원금을 지키는 안정형 상품을 중심에 두고, 여유 자금만 조금씩 굴리는 편이 맞습니다.",
        r.groups.wealth + r.groups.output >= 3 ? "돈 흐름을 읽는 감각이 있어 직접 공부한 분야에서 기회를 잡을 수 있습니다." : "직접 굴리기보다 적립식으로 길게 가져가는 방식이 체질에 맞습니다.",
        "이 풀이는 재미로 보는 참고용이며 실제 투자는 본인의 판단으로 결정하세요.",
      ],
    },
  ];
}

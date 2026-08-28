import type { L } from "@/lib/content";

/**
 * Hero carousel slides. Light studio-tone placeholders for now — drop a real
 * product photo into `image` (and remove `tone`) when assets arrive.
 */
export type HeroSlide = { tone: string; image?: string };

export const heroSlides: HeroSlide[] = [
  { tone: "from-stone-200 via-amber-50 to-stone-100", image: "/hero/hero-1.png" },
  { tone: "from-rose-100 via-orange-50 to-amber-50", image: "/hero/hero-2c.jpg" },
  { tone: "from-sky-100 via-slate-50 to-stone-100", image: "/hero/hero-3.jpg" },
];

/** "Why work with us?" — USPs from the Notion brief. */
export const whyUs: { icon: string; title: L; desc: L }[] = [
  {
    icon: "history",
    title: { en: "Know-how since 1984", ko: "1984년부터 이어온 제작 노하우" },
    desc: {
      en: "Decades of accumulated packaging experience and know-how behind every proposal we make.",
      ko: "오랜 시간 축적한 패키지 제작 경험과|노하우를 바탕으로 제안합니다.",
    },
  },
  {
    icon: "factory",
    title: { en: "Our own factory", ko: "직영 공장 보유" },
    desc: {
      en: "An in-house production base we control directly, from consultation all the way through production.",
      ko: "상담부터 제작까지 안정적으로 관리할 수 있는|직영 생산 기반을 갖추고 있습니다.",
    },
  },
  {
    icon: "team",
    title: { en: "Expert packaging team", ko: "전문 패키지 제작팀" },
    desc: {
      en: "Specialized package designers and veteran print experts support every project.",
      ko: "패키지 전문 디자이너와 오랜 경력의|인쇄 전문가가 프로젝트를 지원합니다.",
    },
  },
  {
    icon: "leaf",
    title: { en: "Eco soy-based ink", ko: "친환경 콩기름 인쇄" },
    desc: {
      en: "We offer eco-friendly soy-based ink printing, safe and suited for food packaging.",
      ko: "식품 패키지에 적합한|친환경 콩기름 인쇄 옵션을 제공합니다.",
    },
  },
  {
    icon: "tag",
    title: { en: "Competitive pricing", ko: "합리적인 제작 단가" },
    desc: {
      en: "We can propose more reasonable production terms than local U.S. manufacturers.",
      ko: "미국 현지 업체 대비 더 합리적인|제작 조건을 제안할 수 있습니다.",
    },
  },
  {
    icon: "chat",
    title: { en: "Fast, reliable communication", ko: "빠르고 성실한 커뮤니케이션" },
    desc: {
      en: "Clear consultation, realistic schedules, and sincere project management throughout.",
      ko: "명확한 상담, 현실적인 일정 안내,|성실한 프로젝트 관리를 제공합니다.",
    },
  },
];

/** Production process steps. */
export const processSteps: { step: number; title: L }[] = [
  { step: 1, title: { en: "In-depth consultation", ko: "꼼꼼한 상담" } },
  { step: 2, title: { en: "Quote & deposit", ko: "견적안내, 계약금 결제" } },
  { step: 3, title: { en: "Blank sample", ko: "무지샘플제작" } },
  { step: 4, title: { en: "Design confirmation", ko: "디자인 확정" } },
  { step: 5, title: { en: "Production", ko: "제품생산" } },
  { step: 6, title: { en: "Inspection & shipping", ko: "검수·배송" } },
];

/**
 * Solution cards — entry points by customer readiness. `tone` is a light
 * placeholder gradient for the card's bottom image until real photos arrive.
 */
export const solutionCards: { title: L; desc: L; cta: L; image: string }[] = [
  {
    title: { en: "I need a brand-new custom package", ko: "완전히 새로운|맞춤 패키지가 필요합니다" },
    desc: {
      en: "For brands that need to shape packaging planning, structure and design direction together.",
      ko: "패키지 기획, 구조, 디자인 방향까지|함께 잡아야 하는 브랜드를 위한 문의입니다.",
    },
    cta: { en: "Start a custom project", ko: "맞춤 프로젝트 시작하기" },
    image: "/solution/s1.png",
  },
  {
    title: { en: "I already have specs or a sample", ko: "이미 사양 또는|샘플이 있습니다" },
    desc: {
      en: "Best when you want to remake existing packaging or improve it to better specs.",
      ko: "기존 패키지를 재제작하거나,|더 나은 사양으로 개선하고 싶은 경우에|적합합니다.",
    },
    cta: { en: "Get an optimized quote", ko: "최적화 견적 받기" },
    image: "/solution/s2.png",
  },
  {
    title: { en: "I'm not sure what specs I need", ko: "아직 어떤 사양이|필요한지 모르겠습니다" },
    desc: {
      en: "Even first-time customers just leave basic info and our experts recommend the right specs.",
      ko: "처음 제작하는 고객도 간단한 정보만 남기면|전문가가 적합한 사양을 추천합니다.",
    },
    cta: { en: "Get an expert pick", ko: "전문가 추천 받기" },
    image: "/solution/s3.png",
  },
];

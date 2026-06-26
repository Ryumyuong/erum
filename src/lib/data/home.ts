import type { L } from "@/lib/content";

/** "Why work with us?" — USPs from the Notion brief. */
export const whyUs: { icon: string; title: L; desc: L }[] = [
  {
    icon: "history",
    title: { en: "Know-how since 1984", ko: "1984년부터 이어온 노하우" },
    desc: {
      en: "Decades of printing and packaging experience behind every order.",
      ko: "오랜 인쇄·패키지 제작 경력을 바탕으로 제작합니다.",
    },
  },
  {
    icon: "factory",
    title: { en: "Our own factory", ko: "직영 공장 보유" },
    desc: {
      en: "An in-house factory we control directly for stable quality and timing.",
      ko: "안정적인 품질과 납기를 위해 직영 공장을 운영합니다.",
    },
  },
  {
    icon: "team",
    title: { en: "Expert packaging team", ko: "전문 패키지 제작팀" },
    desc: {
      en: "In-house package designers and veteran print experts on staff.",
      ko: "전담 패키지 디자이너와 인쇄 전문가가 상주합니다.",
    },
  },
  {
    icon: "leaf",
    title: { en: "Eco soy-based ink", ko: "친환경 콩기름 인쇄" },
    desc: {
      en: "Soy-based ink on every product — safe for food packaging.",
      ko: "전 제품 콩기름 인쇄로 식품 포장에 안전합니다.",
    },
  },
  {
    icon: "tag",
    title: { en: "Competitive pricing", ko: "합리적인 제작 단가" },
    desc: {
      en: "Lower cost than local U.S. manufacturers for the same quality.",
      ko: "동일 품질 대비 미국 현지보다 합리적인 단가를 제안합니다.",
    },
  },
  {
    icon: "chat",
    title: { en: "Fast, reliable communication", ko: "빠르고 성실한 커뮤니케이션" },
    desc: {
      en: "Clear guidance and honest, on-time updates throughout the project.",
      ko: "명확한 안내와 성실한 진행으로 프로젝트를 관리합니다.",
    },
  },
];

/** Production process steps. */
export const processSteps: { step: number; title: L }[] = [
  { step: 1, title: { en: "Inquiry", ko: "문의 접수" } },
  { step: 2, title: { en: "Consulting", ko: "상담" } },
  { step: 3, title: { en: "Structure & material", ko: "구조·재질 추천" } },
  { step: 4, title: { en: "Quote", ko: "견적 안내" } },
  { step: 5, title: { en: "Sample & confirm", ko: "샘플·제작 확정" } },
  { step: 6, title: { en: "Production & shipping", ko: "생산·배송" } },
];

/** Solution cards — entry points by customer readiness. */
export const solutionCards: { title: L; desc: L; cta: L }[] = [
  {
    title: { en: "I need a brand-new custom package", ko: "완전히 새로운 맞춤 패키지가 필요합니다" },
    desc: {
      en: "Start from scratch — we design structure and printing for your brand.",
      ko: "처음부터 시작 — 브랜드에 맞는 구조와 인쇄를 함께 설계합니다.",
    },
    cta: { en: "Get a recommendation", ko: "추천 받기" },
  },
  {
    title: { en: "I already have specs or a sample", ko: "이미 사양 또는 샘플이 있습니다" },
    desc: {
      en: "Send your sample or spec and we'll match it precisely.",
      ko: "샘플이나 사양을 보내주시면 동일하게 제작해 드립니다.",
    },
    cta: { en: "Send your spec", ko: "사양 보내기" },
  },
  {
    title: { en: "I'm not sure what specs I need", ko: "아직 어떤 사양이 필요한지 모르겠습니다" },
    desc: {
      en: "No problem — tell us about your product and we'll recommend options.",
      ko: "괜찮습니다 — 제품 정보만 주시면 적합한 옵션을 추천해 드립니다.",
    },
    cta: { en: "Ask an expert", ko: "전문가에게 문의" },
  },
];

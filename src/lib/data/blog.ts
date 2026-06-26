import type { L } from "@/lib/content";

export type BlogCategory = { id: string; label: L };

export const blogCategories: BlogCategory[] = [
  { id: "basics", label: { en: "Packaging Basics", ko: "패키지 기초" } },
  { id: "printing", label: { en: "Printing Guide", ko: "인쇄 가이드" } },
  { id: "material", label: { en: "Paper & Material Guide", ko: "지류·재질 가이드" } },
  { id: "bakery", label: { en: "Bakery Packaging", ko: "베이커리 패키지" } },
];

export type BlogPost = {
  slug: string;
  category: string;
  title: L;
  summary: L;
  date: string; // ISO
  tone: string;
  cover?: string; // real cover image URL when available
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-a-cake-box",
    category: "bakery",
    title: {
      en: "How to choose the right cake box for your bakery",
      ko: "베이커리를 위한 케이크 박스 선택 방법",
    },
    summary: {
      en: "A complete guide to picking the perfect cake box by size, structure and brand needs.",
      ko: "사이즈, 구조, 브랜드 니즈에 맞는 완벽한 케이크 박스 선택 가이드.",
    },
    date: "2026-05-10",
    tone: "from-sky-100 to-cyan-50",
  },
  {
    slug: "cmyk-vs-spot-color",
    category: "printing",
    title: {
      en: "CMYK vs Spot Color: what every bakery brand should know",
      ko: "CMYK와 별색, 베이커리 브랜드가 알아야 할 차이",
    },
    summary: {
      en: "Understand the difference between CMYK and spot color in packaging printing.",
      ko: "패키지 인쇄에서 CMYK와 별색의 차이 이해하기.",
    },
    date: "2026-05-08",
    tone: "from-fuchsia-100 to-amber-50",
  },
  {
    slug: "why-moq-matters",
    category: "basics",
    title: {
      en: "Why minimum order quantity matters in custom packaging",
      ko: "맞춤 패키지에서 최소 제작 수량이 중요한 이유",
    },
    summary: {
      en: "Why MOQ exists and how to plan your packaging production around it.",
      ko: "최소 제작 수량이 왜 존재하는지, 패키지 생산을 어떻게 계획해야 하는지.",
    },
    date: "2026-05-05",
    tone: "from-amber-100 to-stone-50",
  },
  {
    slug: "soy-ink-for-food-packaging",
    category: "material",
    title: {
      en: "Soy-based ink for food packaging",
      ko: "식품 패키지를 위한 콩기름 인쇄",
    },
    summary: {
      en: "Why soy-based ink is the eco-friendly choice for food and bakery packaging.",
      ko: "식품 및 베이커리 패키지에 콩기름 인쇄가 친환경 선택인 이유.",
    },
    date: "2026-05-03",
    tone: "from-lime-100 to-green-50",
  },
];

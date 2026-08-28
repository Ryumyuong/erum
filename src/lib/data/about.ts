import type { L } from "@/lib/content";

/** Core values — 3 columns under the intro. */
export const coreValues: { icon: string; title: L; desc: L }[] = [
  {
    icon: "quality",
    title: { en: "Quality", ko: "품질" },
    desc: {
      en: "Consistent, high production standards.",
      ko: "일관되고 높은 품질의 |생산 기준",
    },
  },
  {
    icon: "detail",
    title: { en: "Attention to detail", ko: "세심한" },
    desc: {
      en: "Careful control over every detail.",
      ko: "모든 디테일에 대한 |세심한 관리",
    },
  },
  {
    icon: "creative",
    title: { en: "Creativity", ko: "창의적" },
    desc: {
      en: "Innovative packaging solutions.",
      ko: "혁신적인 |패키지 솔루션",
    },
  },
];

/** "System" — how an order flows, as 3 image cards. */
export const systemSteps: { title: L; desc: L; tone: string }[] = [
  {
    title: { en: "Consulting & Design", ko: "컨설팅·디자인" },
    desc: {
      en: "Based on your requirements and product characteristics, our packaging designers propose the right box structure, specs and design.",
      ko: "고객의 요구사항과 제품 특성을 바탕으로 패키지 전문 디자이너가 제품에 적합한 지기구조와 사양, 디자인을 제안합니다.",
    },
    tone: "from-stone-200 to-neutral-100",
  },
  {
    title: { en: "In-house Production", ko: "자체생산" },
    desc: {
      en: "Specialists take charge of the entire production process. Backed by 40+ years of manufacturing know-how, we break production into stages and manage each one systematically.",
      ko: "각 공정별 전문 인력이 생산 전 과정을 책임지고 작업합니다. 40년 이상의 제조 노하우를 바탕으로 생산과정을 단계별로 쪼개 체계적으로 관리합니다.",
    },
    tone: "from-neutral-300 to-neutral-100",
  },
  {
    title: { en: "Shipping Support", ko: "출고지원" },
    desc: {
      en: "We support fast delivery to your desired location, and connect you with trusted forwarders when overseas shipping is needed.",
      ko: "고객이 원하는 장소까지 신속한 배송을 지원하며, 해외 운송이 필요한 경우 신뢰할 수 있는 포워더를 연계해 드립니다.",
    },
    tone: "from-sky-100 to-slate-100",
  },
];

/** Factory & equipment gallery slides (auto-sliding infinite loop). */
export const gallerySlides: { caption: L; image?: string; tone: string }[] = [
  { caption: { en: "Printing Machine", ko: "인쇄 장비" }, image: "/about/gallery-1.png", tone: "from-zinc-300 to-zinc-100" },
  { caption: { en: "Finishing Equipment", ko: "마무리 장비" }, image: "/about/gallery-2.png", tone: "from-slate-300 to-slate-100" },
  { caption: { en: "Quality Check", ko: "품질 검사" }, image: "/about/gallery-3.jpg", tone: "from-stone-300 to-stone-100" },
  { caption: { en: "Packaging Process", ko: "포장 공정" }, image: "/about/gallery-4.jpg", tone: "from-neutral-300 to-neutral-100" },
  { caption: { en: "Factory Overview", ko: "공장 전경" }, image: "/about/gallery-5.jpg", tone: "from-gray-300 to-gray-100" },
  { caption: { en: "Team Consultation", ko: "팀 상담" }, image: "/about/gallery-6.jpg", tone: "from-zinc-200 to-stone-100" },
];

/** Client / brand list with logo images. `compact` text logos are capped to a
 *  smaller height so they line up with the longer wordmarks (e.g. CHOISEOLSONG). */
export const clients: {
  name: string;
  logo: string;
  compact?: boolean;
  box?: string;
}[] = [
  { name: "TOUS les JOURS", logo: "/about/clients/client-01.png" },
  { name: "PARIS BAGUETTE", logo: "/about/clients/client-02.png", box: "max-h-16 max-w-[85%]" },
  { name: "성심당", logo: "/about/clients/client-03.png", box: "max-h-[4.5rem] max-w-[75%]" },
  { name: "amazon", logo: "/about/clients/client-04.png", box: "max-h-[3rem] max-w-[75%]" },
  { name: "Salon de LA", logo: "/about/clients/client-05.png", compact: true },
  { name: "WP", logo: "/about/clients/client-06.png", compact: true },
  { name: "동경제과", logo: "/about/clients/client-07.png", box: "h-[1.75rem] max-w-[75%]" },
  { name: "PAUL", logo: "/about/clients/client-08.png" },
  { name: "DELI'S", logo: "/about/clients/client-09.png", box: "max-h-[3rem] max-w-[75%]" },
  { name: "Détre", logo: "/about/clients/client-10.png", box: "max-h-[3rem] max-w-[75%]" },
  { name: "수수", logo: "/about/clients/client-11.png", box: "h-[1.75rem] max-w-[75%]" },
  { name: "CRESCENT", logo: "/about/clients/client-12.png" },
  { name: "LEEZLE", logo: "/about/clients/client-13.png", compact: true },
  { name: "CHOISEOLSONG", logo: "/about/clients/client-14.png" },
  { name: "MAMMONS", logo: "/about/clients/client-15.png", compact: true },
  { name: "IEEZLE", logo: "/about/clients/ieezle.png", compact: true },
  { name: "차이라떼", logo: "/about/clients/client-17.png", box: "h-[1.75rem] max-w-[75%]" },
  { name: "夢中軒", logo: "/about/clients/client-18.png", box: "max-h-28 max-w-[75%]" },
  { name: "호두앤유", logo: "/about/clients/client-19.png", box: "max-h-24 max-w-[75%]" },
  { name: "BonFranz", logo: "/about/clients/client-20.png", compact: true },
];

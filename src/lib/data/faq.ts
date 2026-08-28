import type { L } from "@/lib/content";

export type FaqCategory = {
  id: string;
  label: L;
};

export const faqCategories: FaqCategory[] = [
  { id: "design", label: { en: "Design & Structure", ko: "디자인 및 구조" } },
  { id: "quote", label: { en: "Quote & Pricing", ko: "견적 및 가격" } },
  { id: "production", label: { en: "Production & Process", ko: "제작 및 절차" } },
  { id: "moq", label: { en: "MOQ & Samples", ko: "최소수량 및 샘플" } },
  { id: "payment", label: { en: "Payment & Contract", ko: "결제 및 계약" } },
  { id: "shipping", label: { en: "Shipping & Export", ko: "배송 및 수출" } },
  { id: "aftercare", label: { en: "After-care", ko: "사후관리" } },
];

export type FaqItem = {
  id: string;
  category: string;
  q: L;
  a: L;
  /** Optional illustration shown under the answer (uploaded in the admin). */
  image?: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "moq-1",
    category: "moq",
    q: { en: "What is the minimum order quantity?", ko: "최소 제작 수량은 몇 개인가요?" },
    a: {
      en: "MOQ depends on the box type and finishing, typically starting around 500–1,000 units. Tell us your product and we'll confirm the exact minimum.",
      ko: "박스 종류와 후가공에 따라 다르며 보통 500~1,000개부터 시작합니다. 제품을 알려주시면 정확한 최소 수량을 안내해 드립니다.",
    },
  },
  {
    id: "moq-2",
    category: "moq",
    q: { en: "Can I order a small sample first?", ko: "먼저 샘플을 받아볼 수 있나요?" },
    a: {
      en: "Yes. We can produce a sample so you can check structure and print quality before mass production.",
      ko: "네. 양산 전에 구조와 인쇄 품질을 확인할 수 있도록 샘플을 제작해 드립니다.",
    },
  },
  {
    id: "quote-1",
    category: "quote",
    q: {
      en: "What information do you need for an accurate quote?",
      ko: "정확한 견적을 위해 어떤 정보가 필요한가요?",
    },
    a: {
      en: "Box type, dimensions (L×W×H), material, printing, finishing, and quantity. If you're unsure, just describe your product and we'll recommend options.",
      ko: "박스 종류, 장폭고(L×W×H), 재질, 인쇄, 후가공, 수량입니다. 잘 모르셔도 제품만 설명해 주시면 옵션을 추천해 드립니다.",
    },
  },
  {
    id: "quote-2",
    category: "quote",
    q: { en: "Why do you ask about my budget?", ko: "제작 예산을 왜 물어보나요?" },
    a: {
      en: "Knowing your budget lets us recommend the best combination of material, printing and finishing within range — not to raise the price.",
      ko: "예산을 알면 그 범위 안에서 최적의 재질·인쇄·후가공 조합을 추천하기 위함이며, 가격을 올리기 위한 것이 아닙니다.",
    },
  },
  {
    id: "design-1",
    category: "design",
    q: {
      en: "What is the difference between CMYK and RGB?",
      ko: "CMYK와 RGB의 차이는 무엇인가요?",
    },
    a: {
      en: "RGB is for screens; CMYK is for printing. Always provide CMYK files for accurate printed colors — RGB may look different once printed.",
      ko: "RGB는 화면용, CMYK는 인쇄용입니다. 정확한 인쇄 색상을 위해 항상 CMYK 파일을 제공해 주세요. RGB는 인쇄 시 다르게 보일 수 있습니다.",
    },
  },
  {
    id: "design-3",
    category: "design",
    q: {
      en: "What is a print-ready design file?",
      ko: "전문 디자인 파일이란 무엇인가요?",
    },
    a: {
      en: "A print-ready file is a vector file (AI or PDF) prepared for production — set in CMYK, with outlined fonts, proper cut/fold lines, and at least 3 mm of bleed. Don't have one? Our designers can create it for you.",
      ko: "인쇄용으로 준비된 벡터 파일(AI 또는 PDF)을 말합니다. CMYK 색상, 윤곽선 처리된 글꼴, 재단·접지선과 3mm 이상의 여백(도련)이 포함되어야 정확하게 제작됩니다. 파일이 없으셔도 저희 디자이너가 만들어 드립니다.",
    },
  },
  {
    id: "design-2",
    category: "design",
    q: { en: "Can you design the package for us?", ko: "패키지 디자인도 함께 맡길 수 있나요?" },
    a: {
      en: "Yes. Our in-house package designers can develop structure and artwork based on your brand guidelines.",
      ko: "네. 전담 패키지 디자이너가 브랜드 가이드에 맞춰 구조와 디자인을 함께 작업해 드립니다.",
    },
  },
  {
    id: "production-1",
    category: "production",
    q: {
      en: "Which paper is safe for food packaging?",
      ko: "식품 포장에 안전한 종이는 무엇인가요?",
    },
    a: {
      en: "We use food-safe paper and soy-based ink on all products, so packaging is safe for direct food contact.",
      ko: "전 제품에 식품용 종이와 콩기름 인쇄를 사용하여 식품 포장에 안전합니다.",
    },
  },
  {
    id: "production-2",
    category: "production",
    q: {
      en: "How long does custom box production take?",
      ko: "맞춤 박스 제작 기간은 얼마나 걸리나요?",
    },
    a: {
      en: "Typically 2–4 weeks after artwork and sample approval, depending on quantity and finishing. We'll confirm a schedule with your quote.",
      ko: "보통 디자인·샘플 확정 후 수량과 후가공에 따라 2~4주가 소요됩니다. 견적과 함께 일정을 안내해 드립니다.",
    },
  },
  {
    id: "shipping-1",
    category: "shipping",
    q: {
      en: "What shipping options are available for U.S. customers?",
      ko: "미국 고객은 어떤 배송 방식을 선택할 수 있나요?",
    },
    a: {
      en: "We support air and sea freight, including FOB terms. We'll recommend the best option based on volume and timing.",
      ko: "항공·해상 운송을 지원하며 FOB 조건도 가능합니다. 물량과 일정에 맞춰 최적의 방식을 추천해 드립니다.",
    },
  },
  {
    id: "payment-1",
    category: "payment",
    q: { en: "Can I pay via PayPal?", ko: "페이팔 결제가 가능한가요?" },
    a: {
      en: "Yes, PayPal is available for smaller orders. For larger orders we also accept bank transfer (T/T).",
      ko: "네, 소액 주문은 페이팔 결제가 가능합니다. 대량 주문은 계좌 이체(T/T)도 지원합니다.",
    },
  },
  {
    id: "aftercare-1",
    category: "aftercare",
    q: {
      en: "What happens if a product defect is found?",
      ko: "제품 불량이 발생하면 어떻게 처리되나요?",
    },
    a: {
      en: "Contact us with photos and your item number. We review every claim and arrange remake or compensation for verified defects.",
      ko: "사진과 품번을 보내주시면 모든 건을 검토하여, 확인된 불량은 재제작 또는 보상으로 처리해 드립니다.",
    },
  },
];

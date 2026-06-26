import type { L } from "@/lib/content";

export type GlossaryCategory = { id: string; label: L };

export const glossaryCategories: GlossaryCategory[] = [
  { id: "printing", label: { en: "Printing", ko: "인쇄" } },
  { id: "paperboard", label: { en: "Paper & Board", ko: "판지" } },
  { id: "structure", label: { en: "Box Structure", ko: "지기구조" } },
  { id: "finishing", label: { en: "Finishing", ko: "후가공" } },
  { id: "packaging", label: { en: "Packaging Material", ko: "포장재" } },
];

export type GlossaryTerm = {
  id: string;
  category: string;
  term: L;
  desc: L;
  tags: L[];
  relatedPortfolioIds: string[];
};

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: "folding-carton",
    category: "structure",
    term: { en: "Folding Carton", ko: "단상자" },
    desc: {
      en: "A box made from a single folded paperboard sheet — flat-packable for efficient storage and shipping.",
      ko: "한 장의 판지를 접어 만드는 박스로, 평평하게 접혀 보관·배송이 효율적입니다.",
    },
    tags: [{ en: "Paperboard", ko: "판지" }, { en: "Flat-pack", ko: "평적" }],
    relatedPortfolioIds: ["bd-fb-001", "bd-rc-001"],
  },
  {
    id: "rigid-box",
    category: "structure",
    term: { en: "Rigid Box", ko: "싸바리상자" },
    desc: {
      en: "A sturdy box made by wrapping thick chipboard with printed paper — used for premium gift packaging.",
      ko: "두꺼운 판지를 인쇄지로 감싸 만든 견고한 박스로, 프리미엄 선물 패키지에 사용됩니다.",
    },
    tags: [{ en: "Premium", ko: "프리미엄" }, { en: "Gift", ko: "선물" }],
    relatedPortfolioIds: ["bd-ts-001", "bd-ch-001"],
  },
  {
    id: "kraft-paper",
    category: "paperboard",
    term: { en: "Kraft Paper", ko: "크라프트지" },
    desc: {
      en: "Natural brown paper made from wood pulp — eco-friendly, durable, and popular for a natural look.",
      ko: "목재 펄프로 만든 자연스러운 갈색 종이로, 친환경적이고 튼튼해 내추럴한 이미지에 인기입니다.",
    },
    tags: [{ en: "Eco", ko: "친환경" }, { en: "Natural", ko: "내추럴" }],
    relatedPortfolioIds: ["bd-rc-002", "bd-pb-001"],
  },
  {
    id: "spot-color",
    category: "printing",
    term: { en: "Spot Color", ko: "별색" },
    desc: {
      en: "A pre-mixed ink (e.g. Pantone) used for exact, consistent brand colors that CMYK can't reproduce reliably.",
      ko: "정확하고 일관된 브랜드 컬러를 위한 사전 혼합 잉크(팬톤 등)로, CMYK로 표현이 어려운 색을 구현합니다.",
    },
    tags: [{ en: "Pantone", ko: "팬톤" }, { en: "Brand color", ko: "브랜드 컬러" }],
    relatedPortfolioIds: ["bd-sl-001", "bd-ts-001"],
  },
  {
    id: "soy-ink",
    category: "printing",
    term: { en: "Soy-based Ink", ko: "콩기름 인쇄" },
    desc: {
      en: "Eco-friendly ink made from soybean oil — safe for food packaging and easier to recycle.",
      ko: "콩기름으로 만든 친환경 잉크로, 식품 포장에 안전하고 재활용이 쉽습니다.",
    },
    tags: [{ en: "Eco", ko: "친환경" }, { en: "Food-safe", ko: "식품 안전" }],
    relatedPortfolioIds: ["bd-bc-001", "bd-db-001"],
  },
  {
    id: "foil-stamping",
    category: "finishing",
    term: { en: "Foil Stamping", ko: "박" },
    desc: {
      en: "A metallic foil (gold, silver, etc.) pressed onto paper with heat for a premium, eye-catching accent.",
      ko: "금·은 등 메탈릭 박을 열로 눌러 찍어 고급스럽고 눈에 띄는 포인트를 만드는 후가공입니다.",
    },
    tags: [{ en: "Premium", ko: "프리미엄" }, { en: "Metallic", ko: "메탈릭" }],
    relatedPortfolioIds: ["bd-sl-001", "bd-ts-001"],
  },
  {
    id: "matte-coating",
    category: "finishing",
    term: { en: "Matte Coating", ko: "무광 코팅" },
    desc: {
      en: "A smooth, non-reflective surface coating that protects the print and gives an elegant, soft finish.",
      ko: "반사 없는 매끈한 표면 코팅으로, 인쇄를 보호하고 우아하고 부드러운 외관을 줍니다.",
    },
    tags: [{ en: "Surface", ko: "표면" }, { en: "Protection", ko: "보호" }],
    relatedPortfolioIds: ["bd-rc-001", "bd-ds-001"],
  },
  {
    id: "die-cut",
    category: "structure",
    term: { en: "Die-cut", ko: "도무송" },
    desc: {
      en: "Cutting paper into a custom shape with a steel die — used for windows, tabs, and custom outlines.",
      ko: "목형(칼선)으로 종이를 원하는 모양으로 재단하는 방식으로, 윈도우·탭·커스텀 형태에 사용됩니다.",
    },
    tags: [{ en: "Custom shape", ko: "커스텀 형태" }],
    relatedPortfolioIds: ["bd-st-001", "bd-ck-001"],
  },
];

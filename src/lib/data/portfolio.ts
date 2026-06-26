import type { L } from "@/lib/content";

/**
 * Portfolio filter taxonomy (from the Notion brief).
 * Drives the portfolio filter sidebar (P2) and the admin selectors (P4).
 * `tbd: true` = values not finalized by the client yet.
 */
export type FilterGroupId =
  | "useField"
  | "material"
  | "packageType"
  | "packageForm"
  | "printing";

export type FilterOption = { id: string; label: L };
export type FilterGroup = {
  id: FilterGroupId;
  label: L;
  options: FilterOption[];
  tbd?: boolean;
};

export const portfolioFilters: FilterGroup[] = [
  {
    id: "useField",
    label: { en: "Use Field", ko: "사용 분야" },
    options: [
      { id: "food", label: { en: "Food", ko: "식품" } },
      { id: "dessert-cafe", label: { en: "Dessert & Cafe", ko: "디저트·카페" } },
      { id: "pharma", label: { en: "Pharmaceutical", ko: "제약" } },
      { id: "cosmetics", label: { en: "Cosmetics", ko: "화장품" } },
      { id: "lifestyle", label: { en: "Lifestyle & Goods", ko: "생활·소품" } },
    ],
  },
  {
    id: "material",
    label: { en: "Material", ko: "지류·재질" },
    options: [
      { id: "uncoated", label: { en: "Uncoated Paper", ko: "비도공지" } },
      { id: "coated", label: { en: "Coated Paper", ko: "도공지" } },
      { id: "kraft", label: { en: "Kraft Paper", ko: "크라프트지" } },
      { id: "specialty", label: { en: "Specialty Paper", ko: "특수지" } },
      { id: "eco", label: { en: "Eco Paper", ko: "친환경지" } },
    ],
  },
  {
    id: "packageType",
    label: { en: "Package Type", ko: "패키지 종류" },
    options: [
      { id: "folding-carton", label: { en: "Folding Carton", ko: "단상자(종이)" } },
      { id: "rigid-box", label: { en: "Rigid Box", ko: "싸바리상자" } },
      { id: "corrugated", label: { en: "Corrugated Box", ko: "골판지상자" } },
      { id: "custom", label: { en: "Custom Form", ko: "커스텀 형태" } },
      { id: "shopping-bag", label: { en: "Shopping Bag", ko: "쇼핑백" } },
      { id: "etc", label: { en: "Other (Sticker etc.)", ko: "기타(스티커 등)" } },
    ],
  },
  {
    id: "packageForm",
    label: { en: "Package Form", ko: "패키지 형태" },
    options: [
      { id: "tuck-top", label: { en: "Tuck Top", ko: "덮개형" } },
      { id: "handle", label: { en: "Handle Box", ko: "손잡이형" } },
      { id: "auto-lock", label: { en: "Auto-lock", ko: "자동 바닥" } },
      { id: "window", label: { en: "Window Box", ko: "윈도우형" } },
      { id: "sleeve", label: { en: "Sleeve", ko: "슬리브형" } },
      { id: "hd-bag", label: { en: "HD Bag", ko: "비닐백(HD BAG)" } },
      { id: "sticker-deco", label: { en: "Sticker & Deco", ko: "스티커·데코" } },
    ],
  },
  {
    id: "printing",
    label: { en: "Printing", ko: "인쇄 방식" },
    tbd: true,
    options: [
      { id: "cmyk", label: { en: "CMYK (4-Color)", ko: "4도(CMYK)" } },
      { id: "spot", label: { en: "Spot Color", ko: "별색" } },
      { id: "soy", label: { en: "Soy-based Ink", ko: "콩기름 인쇄" } },
    ],
  },
];

export type PortfolioItem = {
  id: string;
  itemNo: string;
  name: L;
  hover: L;
  useField: string;
  material: string;
  packageType: string;
  packageForm: string;
  printing: string[];
  coating: L;
  finishing: L;
  dims: { l: number; w: number; h: number }; // mm
  tone: string; // placeholder background until real images arrive
  thumbnail?: string; // real image URL (Supabase Storage) when available
};

/**
 * Seed portfolio data (placeholder). Replace with real items + images via the
 * admin / DB. Item numbers mirror the admin mockup.
 */
export const portfolioItems: PortfolioItem[] = [
  {
    id: "bd-rc-001",
    itemNo: "BD-RC-001",
    name: { en: "Custom Roll Cake Box", ko: "맞춤 롤케이크 박스" },
    hover: { en: "Folding carton · Handle type", ko: "단상자 · 손잡이형" },
    useField: "dessert-cafe",
    material: "coated",
    packageType: "folding-carton",
    packageForm: "handle",
    printing: ["cmyk", "soy"],
    coating: { en: "Matte", ko: "무광" },
    finishing: { en: "—", ko: "—" },
    dims: { l: 250, w: 110, h: 110 },
    tone: "from-amber-100 to-orange-50",
  },
  {
    id: "bd-ck-001",
    itemNo: "BD-CK-001",
    name: { en: "Custom Whole Cake Box", ko: "맞춤 홀케이크 박스" },
    hover: { en: "Handle box · Window", ko: "손잡이형 · 윈도우" },
    useField: "dessert-cafe",
    material: "coated",
    packageType: "folding-carton",
    packageForm: "handle",
    printing: ["cmyk"],
    coating: { en: "Gloss", ko: "유광" },
    finishing: { en: "Window patch", ko: "윈도우 부착" },
    dims: { l: 200, w: 200, h: 180 },
    tone: "from-rose-100 to-pink-50",
  },
  {
    id: "bd-sl-001",
    itemNo: "BD-SL-001",
    name: { en: "G-Type Laminated Sleeve Box", ko: "G형 합지 슬리브 박스" },
    hover: { en: "Sleeve · Specialty paper", ko: "슬리브형 · 특수지" },
    useField: "dessert-cafe",
    material: "specialty",
    packageType: "custom",
    packageForm: "sleeve",
    printing: ["spot", "soy"],
    coating: { en: "Soft-touch", ko: "소프트터치" },
    finishing: { en: "Foil stamping", ko: "박" },
    dims: { l: 160, w: 160, h: 60 },
    tone: "from-stone-200 to-stone-50",
  },
  {
    id: "bd-fb-001",
    itemNo: "BD-FB-001",
    name: { en: "B-Type Paper Folding Carton", ko: "B형 종이 단상자" },
    hover: { en: "Folding carton · Tuck top", ko: "단상자 · 덮개형" },
    useField: "food",
    material: "coated",
    packageType: "folding-carton",
    packageForm: "tuck-top",
    printing: ["cmyk", "soy"],
    coating: { en: "Matte", ko: "무광" },
    finishing: { en: "—", ko: "—" },
    dims: { l: 180, w: 120, h: 80 },
    tone: "from-neutral-200 to-neutral-50",
  },
  {
    id: "bd-rc-002",
    itemNo: "BD-RC-002",
    name: { en: "Handle Type Rice Cake Box", ko: "손잡이형 떡 박스" },
    hover: { en: "Handle box · Kraft", ko: "손잡이형 · 크라프트" },
    useField: "food",
    material: "kraft",
    packageType: "folding-carton",
    packageForm: "handle",
    printing: ["spot", "soy"],
    coating: { en: "—", ko: "—" },
    finishing: { en: "—", ko: "—" },
    dims: { l: 220, w: 150, h: 90 },
    tone: "from-amber-200 to-yellow-50",
  },
  {
    id: "bd-bc-001",
    itemNo: "BD-BC-001",
    name: { en: "Bakery Cafe Paper Package", ko: "베이커리 카페 종이 패키지" },
    hover: { en: "Handle box · Eco paper", ko: "손잡이형 · 친환경지" },
    useField: "dessert-cafe",
    material: "eco",
    packageType: "folding-carton",
    packageForm: "handle",
    printing: ["soy"],
    coating: { en: "—", ko: "—" },
    finishing: { en: "—", ko: "—" },
    dims: { l: 180, w: 130, h: 150 },
    tone: "from-lime-100 to-green-50",
  },
  {
    id: "bd-ds-001",
    itemNo: "BD-DS-001",
    name: { en: "Paper Sleeve Dessert Package", ko: "종이 슬리브 디저트 패키지" },
    hover: { en: "Sleeve · Coated", ko: "슬리브형 · 도공지" },
    useField: "dessert-cafe",
    material: "coated",
    packageType: "custom",
    packageForm: "sleeve",
    printing: ["cmyk"],
    coating: { en: "Matte", ko: "무광" },
    finishing: { en: "—", ko: "—" },
    dims: { l: 140, w: 90, h: 50 },
    tone: "from-orange-100 to-amber-50",
  },
  {
    id: "bd-ts-001",
    itemNo: "BD-TS-001",
    name: { en: "Traditional Sweets Gift Box", ko: "전통 과자 선물 박스" },
    hover: { en: "Rigid box · Foil", ko: "싸바리상자 · 박" },
    useField: "food",
    material: "specialty",
    packageType: "rigid-box",
    packageForm: "tuck-top",
    printing: ["spot", "soy"],
    coating: { en: "Soft-touch", ko: "소프트터치" },
    finishing: { en: "Gold foil", ko: "금박" },
    dims: { l: 300, w: 220, h: 60 },
    tone: "from-teal-100 to-cyan-50",
  },
  {
    id: "bd-ch-001",
    itemNo: "BD-CH-001",
    name: { en: "Chocolate Gift Box (15)", ko: "초콜릿 선물 박스 (15구)" },
    hover: { en: "Rigid box · Insert tray", ko: "싸바리상자 · 내지" },
    useField: "dessert-cafe",
    material: "specialty",
    packageType: "rigid-box",
    packageForm: "tuck-top",
    printing: ["spot"],
    coating: { en: "Matte", ko: "무광" },
    finishing: { en: "Embossing", ko: "엠보싱" },
    dims: { l: 240, w: 180, h: 40 },
    tone: "from-stone-300 to-amber-100",
  },
  {
    id: "bd-db-001",
    itemNo: "BD-DB-001",
    name: { en: "Coffee Drip Bag Box", ko: "커피 드립백 박스" },
    hover: { en: "Tuck top · Eco", ko: "덮개형 · 친환경" },
    useField: "dessert-cafe",
    material: "eco",
    packageType: "folding-carton",
    packageForm: "tuck-top",
    printing: ["soy"],
    coating: { en: "—", ko: "—" },
    finishing: { en: "—", ko: "—" },
    dims: { l: 90, w: 90, h: 110 },
    tone: "from-amber-100 to-stone-50",
  },
  {
    id: "bd-pb-001",
    itemNo: "BD-PB-001",
    name: { en: "Bakery Paper Shopping Bag", ko: "베이커리 종이 쇼핑백" },
    hover: { en: "Shopping bag · Kraft", ko: "쇼핑백 · 크라프트" },
    useField: "dessert-cafe",
    material: "kraft",
    packageType: "shopping-bag",
    packageForm: "handle",
    printing: ["spot", "soy"],
    coating: { en: "—", ko: "—" },
    finishing: { en: "—", ko: "—" },
    dims: { l: 250, w: 120, h: 300 },
    tone: "from-pink-100 to-rose-50",
  },
  {
    id: "bd-st-001",
    itemNo: "BD-ST-001",
    name: { en: "Sticker & Deco Package", ko: "스티커 · 데코 패키지" },
    hover: { en: "Sticker & deco set", ko: "스티커·데코 세트" },
    useField: "lifestyle",
    material: "specialty",
    packageType: "etc",
    packageForm: "sticker-deco",
    printing: ["cmyk"],
    coating: { en: "Gloss", ko: "유광" },
    finishing: { en: "Die-cut", ko: "도무송" },
    dims: { l: 100, w: 100, h: 1 },
    tone: "from-violet-100 to-purple-50",
  },
];

export function getFilterLabel(groupId: FilterGroupId, optionId: string): L | undefined {
  return portfolioFilters
    .find((g) => g.id === groupId)
    ?.options.find((o) => o.id === optionId)?.label;
}

export function getPortfolioByItemNo(itemNo: string): PortfolioItem | undefined {
  return portfolioItems.find((p) => p.itemNo === itemNo);
}

export function getPortfolioById(id: string): PortfolioItem | undefined {
  return portfolioItems.find((p) => p.id === id);
}

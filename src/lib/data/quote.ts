import type { L } from "@/lib/content";

export type QuoteOption = {
  id: string;
  label: L;
  desc?: L; // shown in the (?) tooltip
  tone?: string; // placeholder image background
  recommend?: boolean; // the "Recommend for me" choice
};

export type QuoteGroup = {
  id: string;
  label: L;
  options: QuoteOption[];
};

const RECOMMEND: QuoteOption = {
  id: "recommend",
  label: { en: "Recommend for me", ko: "추천해주세요" },
  recommend: true,
};

export const packageTypeGroup: QuoteGroup = {
  id: "packageType",
  label: { en: "Package type", ko: "패키지 종류" },
  options: [
    { id: "cake", label: { en: "Cake Box", ko: "케이크 박스" }, tone: "from-rose-100 to-pink-50" },
    { id: "roll-cake", label: { en: "Roll Cake Box", ko: "롤케이크 박스" }, tone: "from-amber-100 to-orange-50" },
    { id: "slice-cake", label: { en: "Slice Cake Box", ko: "조각케이크 박스" }, tone: "from-pink-100 to-rose-50" },
    { id: "dessert", label: { en: "Dessert Box", ko: "디저트 박스" }, tone: "from-orange-100 to-amber-50" },
    { id: "chocolate", label: { en: "Chocolate Box", ko: "초콜릿 박스" }, tone: "from-stone-300 to-amber-100" },
    { id: "macaron", label: { en: "Macaron Box", ko: "마카롱 박스" }, tone: "from-violet-100 to-purple-50" },
    { id: "ricecake", label: { en: "Rice Cake Box", ko: "떡 박스" }, tone: "from-lime-100 to-green-50" },
    RECOMMEND,
  ],
};

export const boxStructureGroup: QuoteGroup = {
  id: "boxStructure",
  label: { en: "Box structure", ko: "박스 구조" },
  options: [
    {
      id: "tuck-top",
      label: { en: "Tuck Top", ko: "덮개형" },
      desc: { en: "Simple folding lid, easy to assemble.", ko: "간단한 접이식 뚜껑, 조립이 쉬움." },
      tone: "from-stone-200 to-stone-50",
    },
    {
      id: "auto-lock",
      label: { en: "Auto-lock", ko: "자동 바닥" },
      desc: { en: "Self-locking bottom for fast, sturdy assembly.", ko: "빠르고 견고한 조립을 위한 자동 바닥." },
      tone: "from-rose-100 to-pink-50",
    },
    {
      id: "handle",
      label: { en: "Handle", ko: "손잡이형" },
      desc: { en: "Built-in handle for easy carrying.", ko: "간편한 운반을 위한 내장 손잡이." },
      tone: "from-neutral-200 to-neutral-50",
    },
    {
      id: "window",
      label: { en: "Window", ko: "윈도우형" },
      desc: { en: "Clear window to show the product inside.", ko: "내용물이 보이는 투명 윈도우." },
      tone: "from-sky-100 to-cyan-50",
    },
    {
      id: "sleeve",
      label: { en: "Sleeve", ko: "슬리브형" },
      desc: { en: "Wrap-around sleeve over a base tray.", ko: "받침 위로 감싸는 슬리브 형태." },
      tone: "from-amber-100 to-yellow-50",
    },
    RECOMMEND,
  ],
};

export const materialGroup: QuoteGroup = {
  id: "material",
  label: { en: "Material", ko: "재질" },
  options: [
    {
      id: "coated-white",
      label: { en: "Coated Paper (White)", ko: "백색 도공지" },
      desc: { en: "Bright, smooth surface for vivid printing.", ko: "선명한 인쇄를 위한 밝고 매끄러운 표면." },
      tone: "from-neutral-100 to-white",
    },
    {
      id: "kraft",
      label: { en: "Kraft Paper", ko: "크라프트지" },
      desc: { en: "Natural brown, eco-friendly look.", ko: "자연스러운 갈색의 친환경 이미지." },
      tone: "from-amber-200 to-yellow-50",
    },
    {
      id: "uncoated",
      label: { en: "Uncoated Paper", ko: "비도공지" },
      desc: { en: "Matte, natural texture without coating.", ko: "코팅 없는 매트하고 자연스러운 질감." },
      tone: "from-stone-200 to-stone-50",
    },
    {
      id: "specialty",
      label: { en: "Specialty Paper", ko: "특수지" },
      desc: { en: "Textured or premium papers for a unique feel.", ko: "독특한 질감의 프리미엄 특수지." },
      tone: "from-indigo-100 to-violet-50",
    },
    RECOMMEND,
  ],
};

export const printingGroup: QuoteGroup = {
  id: "printing",
  label: { en: "Printing method", ko: "인쇄 방식" },
  options: [
    { id: "cmyk", label: { en: "4-Color (CMYK)", ko: "4도 (CMYK)" } },
    { id: "cmyk-spot1", label: { en: "CMYK + 1 Spot", ko: "4도 + 별색 1도" } },
    { id: "spot1", label: { en: "1 Spot Color", ko: "별색 1도" } },
    { id: "spot2", label: { en: "2 Spot Colors", ko: "별색 2도" } },
    { id: "black1", label: { en: "1-Color (Black)", ko: "먹 1도" } },
    RECOMMEND,
  ],
};

export const finishingGroup: QuoteGroup = {
  id: "finishing",
  label: { en: "Finishing", ko: "후가공" },
  options: [
    {
      id: "matte",
      label: { en: "Matte Coating", ko: "무광 코팅" },
      desc: { en: "Smooth, non-reflective protective finish.", ko: "매끄럽고 반사 없는 보호 코팅." },
      tone: "from-orange-100 to-amber-50",
    },
    {
      id: "gloss",
      label: { en: "Gloss Coating", ko: "유광 코팅" },
      desc: { en: "Shiny finish that makes colors pop.", ko: "색을 돋보이게 하는 광택 코팅." },
      tone: "from-sky-100 to-blue-50",
    },
    {
      id: "gold-foil",
      label: { en: "Gold Foil", ko: "금박" },
      desc: { en: "Metallic gold accent for a premium look.", ko: "프리미엄 느낌의 금색 메탈릭 포인트." },
      tone: "from-amber-300 to-yellow-100",
    },
    {
      id: "silver-foil",
      label: { en: "Silver Foil", ko: "은박" },
      desc: { en: "Metallic silver accent.", ko: "은색 메탈릭 포인트." },
      tone: "from-slate-200 to-slate-50",
    },
    {
      id: "emboss",
      label: { en: "Embossing", ko: "엠보싱" },
      desc: { en: "Raised texture pressed into the paper.", ko: "종이에 눌러 올린 입체 질감." },
      tone: "from-rose-100 to-pink-50",
    },
    {
      id: "spot-uv",
      label: { en: "Spot UV", ko: "부분 UV" },
      desc: { en: "Glossy UV coating on selected areas.", ko: "선택 영역에만 광택 UV 코팅." },
      tone: "from-violet-100 to-purple-50",
    },
    { id: "none", label: { en: "None", ko: "없음" } },
    RECOMMEND,
  ],
};

export const photoGroups: QuoteGroup[] = [
  boxStructureGroup,
  materialGroup,
  finishingGroup,
];

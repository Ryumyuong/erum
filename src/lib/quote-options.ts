import type { L } from "@/lib/content";

/**
 * Shared quote-form constants.
 *
 * These live outside the "use client" components on purpose: a server
 * component that imports a value from a client module receives a client
 * reference stub, not the value, so `for (const g of QUOTE_GROUPS)` fails at
 * runtime with "not iterable".
 */

/** Product category options — fallback before the admin list is seeded. */
export const CATEGORY_OPTIONS: L[] = [
  { ko: "베이커리·카페", en: "Bakery & Cafe" },
  { ko: "초콜릿", en: "Chocolate" },
  { ko: "전자상거래", en: "E-commerce" },
  { ko: "패션 및 의류", en: "Fashion & Apparel" },
  { ko: "식품 및 테이크아웃", en: "Food & Takeout" },
  { ko: "농산물", en: "Agricultural Products" },
  { ko: "수산물", en: "Seafood" },
  { ko: "축산물", en: "Livestock Products" },
  { ko: "와인", en: "Wine" },
  { ko: "완구", en: "Toys" },
  { ko: "화장품", en: "Cosmetics" },
  { ko: "냉동제품", en: "Frozen Products" },
  { ko: "선물용품", en: "Gifts" },
  { ko: "청소용품", en: "Cleaning Supplies" },
];

/** "저희를 어떻게 알게 되셨나요?" — fallback before the admin list is seeded. */
export const HEAR_OPTIONS: L[] = [
  { ko: "구글", en: "Google" },
  { ko: "인스타그램", en: "Instagram" },
  { ko: "링크드인", en: "LinkedIn" },
  { ko: "무역박람회", en: "Trade Show" },
  { ko: "지인추천", en: "Recommendation from a Friend" },
  { ko: "홍보물", en: "Promotional Material" },
  { ko: "기타", en: "Other" },
];

/** "어떤 점이 가장 중요하신가요?" — the last entry reveals a free-text box. */
export const PRIORITY_OPTIONS: L[] = [
  { ko: "가격", en: "Price" },
  { ko: "품질 및 완성도", en: "Quality and finish" },
  { ko: "제작 기간", en: "Lead time" },
  { ko: "샘플 확인", en: "Seeing a sample" },
  { ko: "기타", en: "Other" },
];

export type OptionCard = {
  id: string;
  tab: string;
  label_en: string;
  label_kr: string;
  desc_en: string;
  desc_kr: string;
  image: string;
  kind: "option" | "recommend" | "custom" | "other";
};

/** Quote-form question groups shown in the admin editor, in form order. */
export const QUOTE_GROUPS: { id: string; title: string; hint: string }[] = [
  { id: "sectionTip", title: "섹션 제목 물음표", hint: "각 섹션 제목(패키지 종류 · 재질 정보 · 인쇄 방식 · 후가공 옵션) 옆 물음표 설명입니다. 비우면 기본 문구가 나옵니다." },
  { id: "packageTab", title: "패키지 종류 — 분류 설명", hint: "분류(탭) 옆 물음표에 뜨는 설명입니다. 이름은 탭 이름과 같아야 하고, 설명이 비어 있으면 물음표가 표시되지 않습니다." },
  { id: "packageType", title: "패키지 종류", hint: "제품 정보 섹션의 카드입니다. 분류(탭)를 적으면 필터 탭으로 묶입니다." },
  { id: "materialPaper", title: "재질 — 종이 재질", hint: "패키지 종류에서 ‘종이박스’를 고른 경우 표시됩니다." },
  { id: "materialCorrugated", title: "재질 — 골판지 재질", hint: "‘골판지박스’ 선택 시 표시됩니다." },
  { id: "materialSurface", title: "재질 — 표면지(합지)", hint: "‘골판지박스’ 선택 시 표시됩니다." },
  { id: "materialInnerColor", title: "재질 — 골판지 내부 색상", hint: "‘골판지박스’ 선택 시 표시됩니다." },
  { id: "materialRigidOuter", title: "재질 — 겉지", hint: "‘싸바리박스’ 선택 시 표시됩니다." },
  { id: "materialRigidInner", title: "재질 — 내지", hint: "‘싸바리박스’ 선택 시 표시됩니다." },
  { id: "materialOppAdhesive", title: "재질 — 접착여부(OPP)", hint: "비닐류 중 OPP 선택 시 표시됩니다." },
  { id: "materialPoly", title: "재질 — 비닐 재질", hint: "비닐백·기타 비닐 패키지 선택 시 표시됩니다." },
  { id: "materialBagPaper", title: "재질 — 쇼핑백 재질", hint: "쇼핑백 선택 시 표시됩니다." },
  { id: "materialBagHandleManual", title: "재질 — 손잡이(수동쇼핑백)", hint: "수동·기타 쇼핑백 선택 시 표시됩니다." },
  { id: "materialBagHandleAuto", title: "재질 — 손잡이(자동쇼핑백)", hint: "자동쇼핑백 선택 시 표시됩니다." },
  { id: "materialEtc", title: "재질 — 기타", hint: "패키지 종류에서 ‘기타’를 고른 경우 표시됩니다." },
  { id: "accessoryNeeded", title: "부자재 유무", hint: "종이·골판지·싸바리박스 선택 시 표시됩니다." },
  { id: "printNeeded", title: "인쇄 — 필요 여부", hint: "‘아니요’를 고르면 이후 인쇄 질문이 숨겨집니다." },
  { id: "printColorsOpp", title: "인쇄 — 도수(OPP)", hint: "비닐류 중 OPP 선택 시 표시됩니다." },
  { id: "printColorsPoly", title: "인쇄 — 도수(비닐백)", hint: "비닐백·기타 비닐 패키지 선택 시 표시됩니다." },
  { id: "printColorsDefault", title: "인쇄 — 도수(기본)", hint: "비닐류 외 모든 종류에서 표시됩니다." },
  { id: "printSpot", title: "인쇄 — 별색", hint: "비닐류를 제외한 종류에서 표시됩니다." },
  { id: "finishHandle", title: "후가공 — 손잡이 가공", hint: "비닐백·기타 비닐 패키지 선택 시 표시됩니다." },
  { id: "finishCoating", title: "후가공 — 코팅", hint: "박스·쇼핑백류에서 목록상자로 표시됩니다." },
  { id: "finishSpecialCoating", title: "후가공 — 특수 코팅", hint: "박스·쇼핑백류에서 목록상자로 표시됩니다." },
  { id: "finishFoil", title: "후가공 — 박", hint: "박스·쇼핑백류에서 목록상자로 표시됩니다." },
  { id: "finishEmboss", title: "후가공 — 형압", hint: "박스·쇼핑백류에서 목록상자로 표시됩니다." },
  { id: "finishDiecut", title: "후가공 — 타공(도무송)", hint: "박스·쇼핑백류에서 목록상자로 표시됩니다." },
];

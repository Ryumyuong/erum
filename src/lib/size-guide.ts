import type { L } from "@/lib/content";

/**
 * 1-3 패키지 사이즈 — what to ask, and how to explain it, per 패키지 종류.
 *
 * The measurements themselves differ by category: a box is 장/폭/고, a flat OPP
 * sleeve only has 가로/세로, and 기타 has no fixed shape at all. The copy lives
 * here rather than in messages/*.json because it is selected by package id, the
 * same way MATERIAL_PLAN and finishingGroupsFor already work.
 */

/** Which of the three inputs to show, in order. */
export type SizeField = "length" | "width" | "height";

/** Diagram artwork, one per package family (null = no drawing). */
export type FigureKind = "box" | "rigid" | "bag" | "poly" | "opp" | null;

export type SizeGuide = {
  fields: { key: SizeField; label: L }[];
  /** Bullet list explaining each measurement. */
  bullets: L[];
  /** Extra lines under the bullets (measuring caveats). */
  notes: L[];
  /** Which drawing to show, if any. Files live in /public/quote/size. */
  figure: FigureKind;
  /** Size is optional rather than required. */
  optional?: boolean;
};

const MM = (ko: string, en: string): L => ({ ko: `${ko}(mm)`, en: `${en} (mm)` });

const BOX_FIELDS: SizeGuide["fields"] = [
  { key: "length", label: MM("장", "Length") },
  { key: "width", label: MM("폭", "Width") },
  { key: "height", label: MM("고", "Height") },
];

const UNDECIDED: L = {
  ko: "※ 사이즈가 정해지지 않은 경우: 상품을 보내주시면 상품에 맞는 크기를 제안해 드립니다.",
  en: "※ If the size isn't decided yet, send us the product and we'll suggest one that fits.",
};

const BOX_BULLETS: L[] = [
  {
    ko: "장(가로): 정면에서 바라볼 때 좌우 길이",
    en: "Length (L): left-to-right when viewed from the front",
  },
  {
    ko: "폭(세로): 정면에서 바라볼 때 앞뒤 방향의 깊이",
    en: "Width (W): front-to-back depth when viewed from the front",
  },
  {
    ko: "고(높이): 바닥부터 박스 위쪽 까지의 높이",
    en: "Height (H): from the bottom to the top of the box",
  },
];

/** The measurement guidance for a package selection. */
export function sizeGuideFor(tab: string, packageId: string): SizeGuide {
  if (tab === "기타") {
    return {
      fields: BOX_FIELDS,
      bullets: [],
      notes: [
        {
          ko: "입력이 어렵다면 아래 추가 요청사항에 작성해 주세요.",
          en: "If it's hard to give numbers, describe it in the additional requests below.",
        },
      ],
      figure: null,
      optional: true,
    };
  }

  if (tab === "비닐류") {
    // A flat OPP sleeve has no depth — only the two edges of the sheet.
    if (packageId === "opp") {
      return {
        fields: [
          { key: "length", label: MM("가로", "Width") },
          { key: "width", label: MM("세로", "Height") },
        ],
        bullets: [
          {
            ko: "가로: OPP 봉투 입구와 나란한 방향의 길이",
            en: "Width: the edge running parallel to the opening",
          },
          {
            ko: "세로: OPP 봉투 입구와 수직인 방향의 길이",
            en: "Height: the edge running perpendicular to the opening",
          },
        ],
        notes: [
          {
            ko: "*접착 OPP: 접착면을 제외한 길이를 측정해 주세요.",
            en: "*Self-seal OPP: measure excluding the adhesive flap.",
          },
          {
            ko: "*비접착 OPP: 비닐 전체의 길이를 측정해 주세요.",
            en: "*Plain OPP: measure the whole sleeve.",
          },
        ],
        figure: "opp",
      };
    }
    return {
      fields: BOX_FIELDS,
      bullets: [
        BOX_BULLETS[0],
        {
          ko: "폭(세로): 정면에서 바라볼 때 앞뒤 방향(측면)의 길이",
          en: "Width (W): the side gusset depth, viewed from the front",
        },
        {
          ko: "고(높이): 바닥부터 손잡이 위쪽 까지의 높이",
          en: "Height (H): from the bottom to the top of the handle",
        },
      ],
      notes: [
        {
          ko: "*폭이 없는 형태는 폭 입력란에 ‘0’을 입력해 주세요.",
          en: "*If there is no gusset, enter ‘0’ for width.",
        },
        UNDECIDED,
      ],
      figure: "poly",
    };
  }

  if (tab === "쇼핑백") {
    return {
      fields: BOX_FIELDS,
      bullets: [
        BOX_BULLETS[0],
        BOX_BULLETS[1],
        {
          ko: "고(높이): 바닥부터 쇼핑백 위쪽 까지의 높이",
          en: "Height (H): from the bottom to the top of the bag",
        },
      ],
      notes: [UNDECIDED],
      figure: "bag",
    };
  }

  // 종이박스 · 골판지박스 · 싸바리박스 — and the pre-selection default.
  return {
    fields: BOX_FIELDS,
    bullets: BOX_BULLETS,
    notes:
      tab === "싸바리박스"
        ? [UNDECIDED]
        : [
            {
              ko: "*손잡이박스의 경우, 손잡이는 제외하고 물건이 담기는 부분의 사이즈를 적어주세요.",
              en: "*For handled boxes, give the size of the part that holds the product, excluding the handle.",
            },
            UNDECIDED,
          ],
    figure: tab === "싸바리박스" ? "rigid" : "box",
  };
}

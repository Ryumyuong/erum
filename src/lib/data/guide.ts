import type { L } from "@/lib/content";

export type GuideItem = {
  title: L;
  subtitle?: string; // small english label shown beside title in the mockup
  desc: L;
  tip?: L; // purple expert comment
  tone: string;
  image?: string; // admin-uploaded image (first of images[]); falls back to tone
};

export type GuideSection = {
  id: string;
  title: L;
  description?: L; // 2–3 line intro shown under the section title
  items: GuideItem[];
};

export const guideSections: GuideSection[] = [
  {
    id: "package-types",
    title: { en: "Package Types", ko: "패키지 종류" },
    description: {
      en: "Choose the box type that fits your product. The type shapes the form, assembly and use of your packaging — pick the one that suits your product to build the ideal box.",
      ko: "제품에 맞는 박스 종류를 선택해 보세요. 박스 종류에 따라 형태와 조립 방식, 활용도가 달라집니다. 제품 특성과 용도에 맞는 종류를 골라 최적의 패키지를 제작해 보세요!",
    },
    items: [
      {
        title: { en: "Folding Carton", ko: "단상자" },
        subtitle: "Folding Carton",
        desc: {
          en: "A flat-foldable single-sheet paper box. Economical and versatile.",
          ko: "평평하게 접히는 한 장짜리 종이 박스. 경제적이고 활용도가 높습니다.",
        },
        tone: "from-neutral-200 to-neutral-50",
      },
      {
        title: { en: "Rigid Box", ko: "싸바리상자" },
        subtitle: "Rigid Box",
        desc: {
          en: "A premium, sturdy wrapped box for high-end packaging.",
          ko: "고급 패키징을 위한 프리미엄 견고한 박스.",
        },
        tone: "from-stone-200 to-stone-50",
      },
    ],
  },
  {
    id: "box-structures",
    title: { en: "Box Structures", ko: "박스 구조" },
    description: {
      en: "Choose how your box opens and closes. Structures like tuck-top or handle boxes change ease of use and how well the product is protected.",
      ko: "박스를 여닫는 구조를 선택해 보세요. 덮개형·손잡이형 등 구조에 따라 사용 편의성과 제품을 보호하는 정도가 달라집니다.",
    },
    items: [
      {
        title: { en: "Tuck Top", ko: "덮개형" },
        subtitle: "Tuck Top",
        desc: {
          en: "A simple folding lid that's easy to assemble. Great for bakery products.",
          ko: "간단한 접이식 뚜껑으로 조립이 쉬움. 베이커리 제품에 적합.",
        },
        tone: "from-rose-100 to-pink-50",
      },
      {
        title: { en: "Handle Box", ko: "손잡이형" },
        subtitle: "Handle Box",
        desc: {
          en: "A built-in handle for easy carrying. Ideal for cakes and gift boxes.",
          ko: "간편한 운반을 위한 내장 손잡이. 케이크와 선물 박스에 적합.",
        },
        tone: "from-teal-100 to-cyan-50",
      },
    ],
  },
  {
    id: "paper-materials",
    title: { en: "Paper & Materials", ko: "지류·재질" },
    description: {
      en: "Choose your paper stock. Paper varies in weight, thickness, gloss, surface texture and color — the right choice helps your packaging express your product's image.",
      ko: "종이 재질을 선택해 보세요. 종이는 무게, 두께, 광택정도, 표면 거칠기, 색상 등 다양한 특성을 가지고 있습니다. 종이 선택을 통해 내 제품의 이미지를 더욱 잘 나타낼 수 있는 패키지를 제작해 보세요!",
    },
    items: [
      {
        title: { en: "Coated Paper (White)", ko: "백색 도공지" },
        subtitle: "Coated Paper",
        desc: {
          en: "Smooth, bright surface ideal for vivid color printing. FSC-certifiable.",
          ko: "선명한 색상 인쇄에 이상적인 매끄럽고 밝은 표면. FSC 인증 가능.",
        },
        tone: "from-neutral-100 to-white",
      },
      {
        title: { en: "Kraft Paper", ko: "크라프트지" },
        subtitle: "Kraft Paper",
        desc: {
          en: "Natural brown paper with an eco-friendly image. 100% recyclable.",
          ko: "친환경적인 이미지의 자연스러운 갈색 종이. 100% 재활용 가능.",
        },
        tone: "from-amber-200 to-yellow-50",
      },
    ],
  },
  {
    id: "printing",
    title: { en: "Printing", ko: "인쇄" },
    description: {
      en: "Choose your printing method. Options like CMYK process or spot colors change how colors appear and how accurately your brand color is reproduced.",
      ko: "인쇄 방식을 선택해 보세요. CMYK·별색 등 인쇄 방식에 따라 색 표현과 브랜드 컬러의 재현 정도가 달라집니다.",
    },
    items: [
      {
        title: { en: "CMYK (4-Color Process)", ko: "CMYK (4도 프로세스)" },
        subtitle: "4-Color Process",
        desc: {
          en: "Mixes cyan, magenta, yellow and black to reproduce full-color images.",
          ko: "시안·마젠타·옐로우·블랙 4가지 잉크로 모든 색상을 표현하는 기본 컬러 인쇄.",
        },
        tip: {
          en: "Best for photos and full-color artwork.",
          ko: "사진이나 풀컬러 디자인에 적합합니다.",
        },
        tone: "from-fuchsia-100 to-amber-50",
      },
      {
        title: { en: "Spot Color (Pantone)", ko: "별색 (팬톤)" },
        subtitle: "Spot Color",
        desc: {
          en: "Pre-mixed ink for exact, consistent brand color matching.",
          ko: "정확한 브랜드 컬러 매칭을 위한 사전 혼합 잉크.",
        },
        tip: {
          en: "Choose this when brand color accuracy is critical.",
          ko: "브랜드 색상 정확도가 중요할 때 선택하세요.",
        },
        tone: "from-sky-100 to-indigo-50",
      },
    ],
  },
  {
    id: "finishing",
    title: { en: "Finishing", ko: "후가공" },
    description: {
      en: "Choose your finishing options. Coating, foil stamping, embossing and more add surface texture and a premium feel to your packaging.",
      ko: "후가공 옵션을 선택해 보세요. 코팅·박·엠보싱 등 후가공으로 표면 질감과 고급스러움을 더할 수 있습니다.",
    },
    items: [
      {
        title: { en: "Matte Coating", ko: "무광 코팅" },
        subtitle: "Matte Coating",
        desc: {
          en: "Smooth, non-reflective surface protection for an elegant look.",
          ko: "매끄럽고 반사 없는 표면 보호. 우아하고 세련된 외관.",
        },
        tone: "from-orange-100 to-amber-50",
      },
      {
        title: { en: "Gold Foil Stamping", ko: "금박" },
        subtitle: "Gold Foil Stamping",
        desc: {
          en: "Metallic gold foil for a premium, eye-catching accent.",
          ko: "프리미엄 포인트를 위한 금색 메탈릭 박.",
        },
        tone: "from-amber-300 to-yellow-100",
      },
    ],
  },
];

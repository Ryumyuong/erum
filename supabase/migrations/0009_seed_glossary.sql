-- Seed dummy glossary categories + terms so the admin starts with editable data.
-- Run once on an empty glossary table. (Re-running would duplicate terms.)

insert into glossary_category (id, label_en, label_kr, sort) values
  ('printing', 'Printing', '인쇄', 1),
  ('paperboard', 'Paper & Material', '지류·재질', 2),
  ('structure', 'Box Structure', '지기구조', 3),
  ('finishing', 'Finishing', '후가공', 4),
  ('packaging', 'Packaging Material', '포장재', 5)
on conflict (id) do nothing;

insert into glossary (category, term_en, term_kr, desc_en, desc_kr, tags_en, tags_kr, images, sort) values
  ('structure', 'Folding Carton', '단상자',
   'A box made from a single folded paperboard sheet, flat-packable for efficient storage and shipping.',
   '한 장의 판지를 접어 만드는 박스로, 평평하게 접혀 보관 배송이 효율적입니다.',
   array['Paperboard','Flat-pack'], array['판지','평적'], '{}', 1),
  ('structure', 'Rigid Box', '싸바리상자',
   'A sturdy box made by wrapping thick chipboard with printed paper, used for premium gift packaging.',
   '두꺼운 판지를 인쇄지로 감싸 만든 견고한 박스로, 프리미엄 선물 패키지에 사용됩니다.',
   array['Premium','Gift'], array['프리미엄','선물'], '{}', 2),
  ('structure', 'Die-cut', '도무송',
   'Cutting paper into a custom shape with a steel die, used for windows, tabs and custom outlines.',
   '목형(칼선)으로 종이를 원하는 모양으로 재단하는 방식으로, 윈도우 탭 커스텀 형태에 사용됩니다.',
   array['Custom shape'], array['커스텀 형태'], '{}', 3),
  ('paperboard', 'Kraft Paper', '크라프트지',
   'Natural brown paper made from wood pulp, eco-friendly and durable, popular for a natural look.',
   '목재 펄프로 만든 자연스러운 갈색 종이로, 친환경적이고 튼튼해 내추럴한 이미지에 인기입니다.',
   array['Eco','Natural'], array['친환경','내추럴'], '{}', 1),
  ('printing', 'Spot Color', '별색',
   'A pre-mixed ink (e.g. Pantone) used for exact, consistent brand colors that CMYK cannot reproduce reliably.',
   '정확하고 일관된 브랜드 컬러를 위한 사전 혼합 잉크(팬톤 등)로, CMYK로 표현이 어려운 색을 구현합니다.',
   array['Pantone','Brand color'], array['팬톤','브랜드 컬러'], '{}', 1),
  ('printing', 'Soy-based Ink', '콩기름 인쇄',
   'Eco-friendly ink made from soybean oil, safe for food packaging and easier to recycle.',
   '콩기름으로 만든 친환경 잉크로, 식품 포장에 안전하고 재활용이 쉽습니다.',
   array['Eco','Food-safe'], array['친환경','식품 안전'], '{}', 2),
  ('finishing', 'Foil Stamping', '박',
   'A metallic foil (gold, silver, etc.) pressed onto paper with heat for a premium, eye-catching accent.',
   '금 은 등 메탈릭 박을 열로 눌러 찍어 고급스럽고 눈에 띄는 포인트를 만드는 후가공입니다.',
   array['Premium','Metallic'], array['프리미엄','메탈릭'], '{}', 1),
  ('finishing', 'Matte Coating', '무광 코팅',
   'A smooth, non-reflective surface coating that protects the print and gives an elegant, soft finish.',
   '반사 없는 매끈한 표면 코팅으로, 인쇄를 보호하고 우아하고 부드러운 외관을 줍니다.',
   array['Surface','Protection'], array['표면','보호'], '{}', 2);

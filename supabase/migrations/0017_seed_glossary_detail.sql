-- 용어사전 상세: "어떤 경우에 사용하나요?" / "추천 분야" 멘트 채우기 (용어명 매칭, 재실행 안전)

update glossary set
  when_used_kr = '평평하게 접혀 보관과 배송이 효율적이라, 대량 생산과 빠른 조립이 필요한 제품에 적합합니다. 가벼운 식품·디저트·화장품 포장에 널리 쓰입니다.',
  when_used_en = 'Folds flat for efficient storage and shipping, ideal for products that need fast assembly and high-volume production. Widely used for light food, dessert, and cosmetics packaging.',
  recommended_for_kr = '비용 효율과 대량 제작이 중요한 식품·디저트·화장품 브랜드에 추천합니다.',
  recommended_for_en = 'Recommended for food, dessert, and cosmetics brands where cost efficiency and large runs matter.'
where term_kr = '단상자';

update glossary set
  when_used_kr = '두꺼운 판지에 인쇄지를 감싸 만든 고급 박스로, 제품의 프리미엄 이미지를 강조하거나 견고한 보호가 필요할 때 사용합니다.',
  when_used_en = 'A premium box made by wrapping thick chipboard in printed paper. Used when you want to emphasize a high-end image or need sturdy protection.',
  recommended_for_kr = '선물·기프트, 주얼리, 프리미엄 디저트 등 고급스러운 브랜드 경험이 중요한 제품에 추천합니다.',
  recommended_for_en = 'Ideal for gifts, jewelry, and premium desserts where a luxurious brand experience matters.'
where term_kr = '싸바리상자';

update glossary set
  when_used_kr = '자연스러운 갈색과 친환경 이미지가 필요할 때 사용하며, 내추럴하고 핸드메이드한 감성을 표현하기 좋습니다.',
  when_used_en = 'Used when a natural brown look and eco-friendly image are desired; great for a handmade, natural feel.',
  recommended_for_kr = '친환경·비건·베이커리·카페 등 자연스러운 무드를 추구하는 브랜드에 추천합니다.',
  recommended_for_en = 'Recommended for eco, vegan, bakery, and cafe brands seeking a natural mood.'
where term_kr = '크라프트지';

update glossary set
  when_used_kr = '사진이나 다양한 색상이 들어가는 디자인을 표현할 때 사용하는 기본 인쇄 방식입니다.',
  when_used_en = 'The standard printing method for reproducing photos and a wide range of colors.',
  recommended_for_kr = '풀컬러 그래픽·사진·일러스트가 포함된 대부분의 패키지 디자인에 추천합니다.',
  recommended_for_en = 'Recommended for most packaging with full-color graphics, photos, or illustrations.'
where term_kr = 'CMYK (4도 프로세스)';

update glossary set
  when_used_kr = '정확하고 일관된 브랜드 컬러가 필요하거나, CMYK로 재현이 어려운 형광·메탈릭 색을 구현할 때 사용합니다.',
  when_used_en = 'Used when exact, consistent brand colors are required, or for fluorescent and metallic colors that CMYK cannot reproduce.',
  recommended_for_kr = '브랜드 고유 색상 관리가 중요한 기업·프리미엄 제품에 추천합니다.',
  recommended_for_en = 'Recommended for companies and premium products where brand color accuracy is critical.'
where term_kr = '별색 (팬톤)';

update glossary set
  when_used_kr = '식품에 닿는 포장이나 친환경 인증이 필요할 때 사용하는 콩기름 기반의 안전한 잉크입니다.',
  when_used_en = 'A safe, soy-based ink used for food-contact packaging or when eco-certification is needed.',
  recommended_for_kr = '식품·베이커리·친환경 브랜드 등 안전성과 재활용이 중요한 제품에 추천합니다.',
  recommended_for_en = 'Recommended for food, bakery, and eco brands where safety and recyclability matter.'
where term_kr = '콩기름 인쇄';

update glossary set
  when_used_kr = '로고나 포인트 영역에 금속 광택을 더해 고급스러움을 강조할 때 사용합니다.',
  when_used_en = 'Used to add metallic shine to logos or accent areas for a luxurious finish.',
  recommended_for_kr = '선물·명절·프리미엄 라인 등 고급 마감이 필요한 제품에 추천합니다.',
  recommended_for_en = 'Recommended for gifts, holiday, and premium lines that need a high-end finish.'
where term_kr = '박';

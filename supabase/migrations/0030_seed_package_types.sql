-- Full 패키지 종류 list for the redesigned quote form (spec: 1-1).
--
-- Replaces the placeholder rows 0028 copied out of the guide taxonomy: the new
-- list is quote-specific, grouped into filter tabs, and includes an "기타" card
-- per tab. Ids are readable slugs so inquiries stay legible in the admin.
--
-- Images are intentionally empty — upload them per option in
-- /admin/견적문의 → 견적문의 선택 항목.

delete from quote_option where group_id = 'packageType';

insert into quote_option
  (id, group_id, tab, label_en, label_kr, desc_en, desc_kr, kind, sort) values
  ('paper-a', 'packageType', '종이박스', 'Type A Paper Box', 'A형 종이 박스', '', '', 'option', 1),
  ('paper-b-glue', 'packageType', '종이박스', 'Type B Paper Box – Glued Bottom', 'B형 종이 박스 - 삼면접착 바닥', '', '', 'option', 2),
  ('paper-b-cross', 'packageType', '종이박스', 'Type B Paper Box – Crash-lock Bottom', 'B형 종이 박스 - 십자조립 바닥', '', '', 'option', 3),
  ('paper-b-tuck', 'packageType', '종이박스', 'Type B Paper Box – Tuck-in Bottom', 'B형 종이 박스 - 맞뚜껑 바닥', '', '', 'option', 4),
  ('paper-c', 'packageType', '종이박스', 'Type C Paper Box', 'C형 종이 박스', '', '', 'option', 5),
  ('paper-g', 'packageType', '종이박스', 'Type G Paper Box', 'G형 종이 박스', '', '', 'option', 6),
  ('paper-r', 'packageType', '종이박스', 'Type R Paper Box', 'R형 종이 박스', '', '', 'option', 7),
  ('paper-sleeve', 'packageType', '종이박스', 'Paper Sleeve Box', '종이 슬리브 박스', '', '', 'option', 8),
  ('paper-y', 'packageType', '종이박스', 'Type Y Paper Box', 'Y형 종이 박스', '', '', 'option', 9),
  ('paper-envelope', 'packageType', '종이박스', 'Paper Envelope Box', '종이 봉투형 박스', '', '', 'option', 10),
  ('paper-other', 'packageType', '종이박스', 'Other Paper Box', '기타 종이박스', 'Tell us the packaging you want in the additional requests below.', '원하는 패키지를 아래 추가 요청사항에 작성해 주세요.', 'other', 11),
  ('corr-a', 'packageType', '골판지박스', 'Type A Corrugated Box', 'A형 골판지 박스', '', '', 'option', 12),
  ('corr-b-glue', 'packageType', '골판지박스', 'Type B Corrugated Box – Glued Bottom', 'B형 골판지 박스 - 삼면접착 바닥', '', '', 'option', 13),
  ('corr-b-cross', 'packageType', '골판지박스', 'Type B Corrugated Box – Crash-lock Bottom', 'B형 골판지 박스 - 십자조립 바닥', '', '', 'option', 14),
  ('corr-b-tuck', 'packageType', '골판지박스', 'Type B Corrugated Box – Tuck-in Bottom', 'B형 골판지 박스 - 맞뚜껑 바닥', '', '', 'option', 15),
  ('corr-c', 'packageType', '골판지박스', 'Type C Corrugated Box', 'C형 골판지 박스', '', '', 'option', 16),
  ('corr-g', 'packageType', '골판지박스', 'Type G Corrugated Box', 'G형 골판지 박스', '', '', 'option', 17),
  ('corr-m', 'packageType', '골판지박스', 'Type M Corrugated Box', 'M형 골판지 박스', '', '', 'option', 18),
  ('corr-r', 'packageType', '골판지박스', 'Type R Corrugated Box', 'R형 골판지 박스', '', '', 'option', 19),
  ('corr-sleeve', 'packageType', '골판지박스', 'Corrugated Sleeve Box', '골판지 슬리브 박스', '', '', 'option', 20),
  ('corr-y', 'packageType', '골판지박스', 'Type Y Corrugated Box', 'Y형 골판지 박스', '', '', 'option', 21),
  ('corr-pizza', 'packageType', '골판지박스', 'Pizza Box', '피자박스', '', '', 'option', 22),
  ('corr-cake', 'packageType', '골판지박스', 'Cake Box', '케이크박스', '', '', 'option', 23),
  ('corr-handle', 'packageType', '골판지박스', 'Plastic Handle Box', '플라스틱 핸들형 박스', '', '', 'option', 24),
  ('corr-other', 'packageType', '골판지박스', 'Other Corrugated Box', '기타 골판지 박스', 'Tell us the packaging you want in the additional requests below.', '원하는 패키지를 아래 추가 요청사항에 작성해 주세요.', 'other', 25),
  ('rigid-y', 'packageType', '싸바리박스', 'Type Y Rigid Box', 'Y형 싸바리 박스', '', '', 'option', 26),
  ('rigid-cover', 'packageType', '싸바리박스', 'Cover Rigid Box', '표지 싸바리 박스', '', '', 'option', 27),
  ('rigid-drawer', 'packageType', '싸바리박스', 'Drawer Rigid Box', '서랍식 싸바리 박스', '', '', 'option', 28),
  ('rigid-other', 'packageType', '싸바리박스', 'Other Rigid Box', '기타 싸바리 박스', 'Tell us the packaging you want in the additional requests below.', '원하는 패키지를 아래 추가 요청사항에 작성해 주세요.', 'other', 29),
  ('opp', 'packageType', '비닐류', 'OPP', 'OPP', '', '', 'option', 30),
  ('poly-bag', 'packageType', '비닐류', 'Poly Bag', '비닐백', '', '', 'option', 31),
  ('poly-other', 'packageType', '비닐류', 'Other Poly Packaging', '기타 비닐 패키지', 'Tell us the packaging you want in the additional requests below.', '원하는 패키지를 아래 추가 요청사항에 작성해 주세요.', 'other', 32),
  ('bag-manual', 'packageType', '쇼핑백', 'Hand-made Shopping Bag', '수동쇼핑백', 'Punched holes with handle cords threaded through.
Minimum 1,000–2,000 pcs (varies by size).', '펀칭하여 손잡이 끈을 끼우는 방식
최소수량 1,000매~2,000매 (사이즈에 따라 상이)', 'option', 33),
  ('bag-auto', 'packageType', '쇼핑백', 'Machine-made Shopping Bag', '자동쇼핑백', 'Handles attached during production.
Minimum 20,000 pcs (varies by size).', '손잡이가 부착되어 제작되는 방식
최소수량 20,000매 (사이즈에 따라 상이)', 'option', 34),
  ('bag-other', 'packageType', '쇼핑백', 'Other Shopping Bag', '기타 쇼핑백', 'Tell us the packaging you want in the additional requests below.', '원하는 패키지를 아래 추가 요청사항에 작성해 주세요.', 'other', 35),
  ('etc-cup', 'packageType', '기타', 'Cup Holder / Carrier', '컵홀더/컵캐리어', '', '', 'option', 36),
  ('etc-paper', 'packageType', '기타', 'Tags, Cake Picks and Other Paper Items', '택, 케익픽 등 종이 제품', '', '', 'option', 37),
  ('etc-deco', 'packageType', '기타', 'Stickers, Ribbons and Other Decorations', '스티커, 리본 등 데코 상품', '', '', 'option', 38),
  ('etc-other', 'packageType', '기타', 'Other Packaging / Accessories', '기타 패키지/부자재', 'Tell us the packaging you want in the additional requests below.', '원하는 패키지를 아래 추가 요청사항에 작성해 주세요.', 'other', 39)
on conflict (group_id, id) do nothing;

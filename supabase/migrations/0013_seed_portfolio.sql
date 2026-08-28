-- Seed the 16 reference portfolio items (photos added later via admin).
-- Visible fields (item_no / name_en / category) come from the design;
-- the rest mirror the prior static seed or use sensible defaults — edit freely
-- in the admin afterwards.

-- 1) Use-field (사용분야) options matching the reference categories.
insert into use_field (id, label_en, label_kr, sort) values
  ('bakery',            'Bakery',            '베이커리',  1),
  ('dessert',           'Dessert',           '디저트',    2),
  ('rice-cake',         'Rice Cake',         '떡',        3),
  ('cafe',              'Café',              '카페',      4),
  ('traditional-sweets','Traditional Sweets','전통과자',  5),
  ('coffee',            'Coffee',            '커피',      6),
  ('food',              'Food',              '식품',      7),
  ('decoration',        'Decoration',        '데코',      8)
on conflict (id) do nothing;

-- 2) Portfolio items. Idempotent on item_no (re-running won't duplicate).
insert into portfolio
  (item_no, name_en, name_kr, use_field, material, package_type, package_form,
   printing, coating_en, coating_kr, finishing_en, finishing_kr,
   dim_l, dim_w, dim_h, sort)
values
  ('BD-RC-001','Custom Roll Cake Box','맞춤 롤케이크 박스','bakery','coated','folding-carton','handle',
    array['cmyk','soy'],'Matte','무광','','', 250,110,110, 1),
  ('BD-CK-001','Custom Whole Cake Box','맞춤 홀케이크 박스','bakery','coated','folding-carton','handle',
    array['cmyk'],'Gloss','유광','Window patch','윈도우 부착', 200,200,180, 2),
  ('BD-SL-001','G-Type Laminated Sleeve Box','G형 합지 슬리브 박스','dessert','specialty','custom','sleeve',
    array['spot','soy'],'Soft-touch','소프트터치','Gold foil','금박', 160,160,60, 3),
  ('BD-FB-001','B-Type Paper Folding Carton','B형 종이 단상자','bakery','coated','folding-carton','tuck-top',
    array['cmyk','soy'],'Matte','무광','','', 180,120,80, 4),
  ('BD-RC-002','Handle Type Rice Cake Box','손잡이형 떡 박스','rice-cake','kraft','folding-carton','handle',
    array['spot','soy'],'','','','', 220,150,90, 5),
  ('BD-BC-001','Bakery Café Paper Package','베이커리 카페 종이 패키지','cafe','eco','folding-carton','handle',
    array['soy'],'','','','', 180,130,150, 6),
  ('BD-DS-001','Paper Sleeve Dessert Package','종이 슬리브 디저트 패키지','dessert','coated','custom','sleeve',
    array['cmyk'],'Matte','무광','','', 140,90,50, 7),
  ('BD-TS-001','Traditional Sweets Gift Box','전통 과자 선물 박스','traditional-sweets','specialty','rigid-box','tuck-top',
    array['spot','soy'],'Soft-touch','소프트터치','Gold foil','금박', 300,220,60, 8),
  ('BD-CK-002','Cake Box with Window','윈도우 케이크 박스','bakery','coated','folding-carton','window',
    array['cmyk'],'Gloss','유광','Window patch','윈도우 부착', 200,200,150, 9),
  ('BD-PC-001','Piece Cake Mini Box','조각 케이크 미니 박스','bakery','coated','folding-carton','tuck-top',
    array['cmyk'],'Matte','무광','','', 90,90,80, 10),
  ('BD-CH-001','Chocolate Gift Box','초콜릿 선물 박스','dessert','specialty','rigid-box','tuck-top',
    array['spot'],'Matte','무광','Embossing','엠보싱', 240,180,40, 11),
  ('BD-MC-001','Macaron Box','마카롱 박스','dessert','coated','folding-carton','window',
    array['cmyk'],'Matte','무광','','', 180,90,50, 12),
  ('BD-DB-001','Coffee Drip Bag Box','커피 드립백 박스','coffee','eco','folding-carton','tuck-top',
    array['soy'],'','','','', 90,90,110, 13),
  ('BD-BT-001','Bottle Gift Box','보틀 선물 박스','food','specialty','rigid-box','tuck-top',
    array['spot'],'Soft-touch','소프트터치','Gold foil','금박', 100,100,320, 14),
  ('BD-PB-001','Bakery Paper Shopping Bag','베이커리 종이 쇼핑백','bakery','kraft','shopping-bag','handle',
    array['spot','soy'],'','','','', 250,120,300, 15),
  ('BD-ST-001','Sticker & Deco Package','스티커 · 데코 패키지','decoration','specialty','etc','sticker-deco',
    array['cmyk'],'Gloss','유광','Die-cut','도무송', 100,100,1, 16)
on conflict (item_no) do nothing;

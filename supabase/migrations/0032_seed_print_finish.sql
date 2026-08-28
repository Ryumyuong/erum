-- 부자재 / 인쇄 / 후가공 options (spec 1-4, 2, 3).
--
-- Which of these appear depends on the 패키지 종류 the customer picked, e.g.
-- 인쇄 도수 differs for OPP, poly bags and everything else, and 후가공 is a set
-- of dropdowns for boxes but a single 손잡이 가공 question for poly bags.
-- That mapping lives in the form; this migration only supplies the choices.

delete from quote_option
 where group_id in (
   'accessoryNeeded','printNeeded','printColorsOpp','printColorsPoly',
   'printColorsDefault','printSpot','finishHandle','finishCoating',
   'finishSpecialCoating','finishFoil','finishEmboss','finishDiecut'
 );

insert into quote_option
  (id, group_id, label_en, label_kr, desc_en, desc_kr, kind, sort) values
  ('yes','accessoryNeeded','Yes','네','','','option',1),
  ('no','accessoryNeeded','No','아니요','','','option',2),
  ('yes','printNeeded','Yes','네','','','option',1),
  ('no','printNeeded','No','아니요','','','option',2),
  ('single-1','printColorsOpp','1 Colour, One Side','단면 1도','Printed in a single colour.','1가지 색상으로 인쇄하는 방식입니다.','option',1),
  ('single-2','printColorsOpp','2 Colours, One Side','단면 2도','Printed in two colours.','2가지 색상으로 인쇄하는 방식입니다.','option',2),
  ('other','printColorsOpp','Other','그 외','','','other',3),
  ('single-1','printColorsPoly','1 Colour, One Side','단면 1도','One colour on one side only.','한쪽 면에만 1가지 색상으로 인쇄하는 방식입니다.','option',1),
  ('single-2','printColorsPoly','2 Colours, One Side','단면 2도','Two colours on one side only.','한쪽 면에만 2가지 색상으로 인쇄하는 방식입니다.','option',2),
  ('double-1','printColorsPoly','1 Colour, Both Sides','양면 1도','One colour on both sides.','1가지 색상으로 양면 인쇄하는 방식입니다.','option',3),
  ('double-2','printColorsPoly','2 Colours, Both Sides','양면 2도','Two colours on both sides.','2가지 색상으로 양면 인쇄하는 방식입니다.','option',4),
  ('other','printColorsPoly','Other','그 외','','','other',5),
  ('cmyk','printColorsDefault','4-Colour (CMYK)','4도 풀컬러','The standard process: four base inks combined to make colour.','4가지 기본잉크를 조합하여 색을 만드는 일반적인 인쇄 방식입니다.','option',1),
  ('black-1','printColorsDefault','1-Colour (Black)','먹 1도 인쇄','Single-colour printing using black ink only.','검은색 잉크 1가지만 사용하여 단색 인쇄하는 방식입니다.','option',2),
  ('other','printColorsDefault','Other','기타','','','other',3),
  ('none','printSpot','No Spot Colour','별색 없음','','','option',1),
  ('spot-1','printSpot','1 Spot Colour','별색 1도','','','option',2),
  ('spot-2','printSpot','2 Spot Colours','별색 2도','','','option',3),
  ('ring','finishHandle','Ring Handle','링가공','','','option',1),
  ('m-cut','finishHandle','M-cut Handle','M가공','','','option',2),
  ('none','finishHandle','No Handle','손잡이없음','','','option',3),
  ('gloss','finishCoating','Gloss Coating','유광코팅','','','option',1),
  ('matte','finishCoating','Matte Coating','무광코팅','','','option',2),
  ('none','finishCoating','No Coating','비코팅','','','option',3),
  ('spot-uv','finishSpecialCoating','Spot UV Coating','부분 UV 코팅','','','option',1),
  ('velvet','finishSpecialCoating','Velvet Coating','벨벳 코팅','','','option',2),
  ('gold','finishFoil','Gold Foil','금박','','','option',1),
  ('silver','finishFoil','Silver Foil','은박','','','option',2),
  ('copper','finishFoil','Copper Foil','동박','','','option',3),
  ('rose-gold','finishFoil','Rose Gold Foil','로즈골드박','','','option',4),
  ('red','finishFoil','Red Foil','적박','','','option',5),
  ('blue','finishFoil','Blue Foil','청박','','','option',6),
  ('black','finishFoil','Black Foil','먹박','','','option',7),
  ('none','finishFoil','No Foil','박 없음','','','option',8),
  ('emboss','finishEmboss','Embossing','엠보싱','','','option',1),
  ('deboss','finishEmboss','Debossing','디보싱','','','option',2),
  ('none','finishEmboss','None','형압 없음','','','option',3),
  ('window-pet','finishDiecut','Window – PET film','창문 타공 - PET 접착','','','option',1),
  ('window-vinyl','finishDiecut','Window – vinyl film','창문 타공 - 비닐 접착','','','option',2),
  ('window-open','finishDiecut','Window – cut only','창문 타공 - 타공만','','','option',3),
  ('hole','finishDiecut','Hole Punch','구멍 타공','','','option',4),
  ('design','finishDiecut','Custom Die-cut','디자인 타공','','','option',5)
on conflict (group_id, id) do nothing;

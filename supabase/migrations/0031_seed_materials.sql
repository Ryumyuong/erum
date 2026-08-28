-- 재질 options (spec 1-2). One group per question, because which questions
-- appear depends on the 패키지 종류 tab the customer picked:
--
--   종이박스        → materialPaper
--   골판지박스      → materialCorrugated + materialSurface + materialInnerColor
--   싸바리박스      → materialRigidOuter + materialRigidInner
--   비닐 OPP        → materialOppAdhesive
--   비닐 백/기타    → materialPoly
--   쇼핑백 수동/기타 → materialBagPaper + materialBagHandleManual
--   쇼핑백 자동     → materialBagPaper + materialBagHandleAuto
--   기타            → materialEtc
--
-- `custom`/`other` rows are what reveal the free-text box in the form.

delete from quote_option where group_id like 'material%';

insert into quote_option (id, group_id, label_en, label_kr, kind, sort) values
  ('recommend', 'materialPaper', 'Recommend for me', '추천해주세요', 'recommend', 1),
  ('sc-manila', 'materialPaper', 'SC Manila', 'SC 마닐라', 'option', 2),
  ('iv', 'materialPaper', 'IV (Ivory)', 'IV(아이보리)', 'option', 3),
  ('riv', 'materialPaper', 'RIV (Royal Ivory)', 'RIV(로얄아이보리)', 'option', 4),
  ('kraft', 'materialPaper', 'Kraft', '크라프트', 'option', 5),
  ('custom', 'materialPaper', 'Enter my own', '직접 입력', 'custom', 6),
  ('recommend', 'materialCorrugated', 'Recommend for me', '추천해주세요', 'recommend', 1),
  ('e-flute', 'materialCorrugated', 'E-flute', 'E골', 'option', 2),
  ('b-flute', 'materialCorrugated', 'B-flute', 'B골', 'option', 3),
  ('a-flute', 'materialCorrugated', 'A-flute', 'A골', 'option', 4),
  ('custom', 'materialCorrugated', 'Enter my own', '직접 입력', 'custom', 5),
  ('none', 'materialSurface', 'No lamination', '합지 안함', 'option', 1),
  ('sc-manila', 'materialSurface', 'SC Manila (default)', 'SC 마닐라(기본)', 'option', 2),
  ('iv', 'materialSurface', 'IV (Ivory)', 'IV(아이보리)', 'option', 3),
  ('riv', 'materialSurface', 'RIV (Royal Ivory)', 'RIV(로얄아이보리)', 'option', 4),
  ('kraft', 'materialSurface', 'Kraft', '크라프트', 'option', 5),
  ('custom', 'materialSurface', 'Enter my own', '직접 입력', 'custom', 6),
  ('white', 'materialInnerColor', 'White', '화이트', 'option', 1),
  ('kraft', 'materialInnerColor', 'Kraft', '크라프트', 'option', 2),
  ('recommend', 'materialRigidOuter', 'Recommend for me', '추천해주세요', 'recommend', 1),
  ('mojo', 'materialRigidOuter', 'Woodfree Paper', '모조지', 'option', 2),
  ('snow', 'materialRigidOuter', 'Snow Paper', '스노우지', 'option', 3),
  ('ivory', 'materialRigidOuter', 'Ivory', '아이보리', 'option', 4),
  ('other', 'materialRigidOuter', 'Other', '기타', 'other', 5),
  ('recommend', 'materialRigidInner', 'Recommend for me', '추천해주세요', 'recommend', 1),
  ('none', 'materialRigidInner', 'None (white)', '없음(백색)', 'option', 2),
  ('mojo', 'materialRigidInner', 'Woodfree Paper', '모조지', 'option', 3),
  ('sc', 'materialRigidInner', 'SC', 'SC', 'option', 4),
  ('snow', 'materialRigidInner', 'Snow Paper', '스노우지', 'option', 5),
  ('other', 'materialRigidInner', 'Other', '기타', 'other', 6),
  ('adhesive', 'materialOppAdhesive', 'Adhesive', '접착', 'option', 1),
  ('non-adhesive', 'materialOppAdhesive', 'Non-adhesive', '비접착', 'option', 2),
  ('recommend', 'materialPoly', 'Recommend for me', '추천해주세요', 'recommend', 1),
  ('clear-hd', 'materialPoly', 'Clear HD', '투명HD', 'option', 2),
  ('white-hd', 'materialPoly', 'White HD', '백색HD', 'option', 3),
  ('clear-pe', 'materialPoly', 'Clear PE', '투명PE', 'option', 4),
  ('other', 'materialPoly', 'Other (colored HD, etc.)', '기타(칼라HD 등)', 'other', 5),
  ('recommend', 'materialBagPaper', 'Recommend for me', '추천해주세요', 'recommend', 1),
  ('mojo', 'materialBagPaper', 'Woodfree Paper', '모조지', 'option', 2),
  ('art', 'materialBagPaper', 'Art Paper', '아트지', 'option', 3),
  ('snow', 'materialBagPaper', 'Snow Paper', '스노우지', 'option', 4),
  ('kraft', 'materialBagPaper', 'Kraft Paper', '크라프트지', 'option', 5),
  ('other', 'materialBagPaper', 'Other', '기타', 'other', 6),
  ('pp', 'materialBagHandleManual', 'PP Cord', 'PP끈', 'option', 1),
  ('cotton', 'materialBagHandleManual', 'Cotton Cord', '면끈', 'option', 2),
  ('tape', 'materialBagHandleManual', 'Tape Cord', '테이프끈', 'option', 3),
  ('satin', 'materialBagHandleManual', 'Satin Cord', '주자유광끈', 'option', 4),
  ('ribbed', 'materialBagHandleManual', 'Ribbed Cord', '골직끈', 'option', 5),
  ('other', 'materialBagHandleManual', 'Other', '기타', 'other', 6),
  ('twist', 'materialBagHandleAuto', 'Twisted Handle', '트위스트끈', 'option', 1),
  ('flat', 'materialBagHandleAuto', 'Flat Handle', '납작끈', 'option', 2),
  ('other', 'materialBagHandleAuto', 'Other', '기타', 'other', 3),
  ('custom', 'materialEtc', 'Enter my own', '직접 입력', 'custom', 1)
on conflict (group_id, id) do nothing;

-- The 추천해주세요 cards in 재질 정보 render with no caption, so they read as an
-- unexplained icon. Give them the same line the 기타 cards use in 패키지 종류,
-- worded for materials rather than packages.
--
-- Only the 재질 groups are touched; the legacy 'material' / 'printing' /
-- 'finishing' groups belong to the old form and are left alone.

update quote_option
   set desc_kr = '원하는 재질을 아래 추가 요청사항에 작성해 주세요.',
       desc_en = 'Tell us which material you have in mind in the additional requests below.'
 where kind = 'recommend'
   and group_id like 'material%'
   and coalesce(desc_kr, '') = '';

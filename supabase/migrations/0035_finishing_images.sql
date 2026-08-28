-- The old quote form's 후가공 / 인쇄 cards (group_id 'finishing', 'printing')
-- already carry real uploaded photos. The rebuilt form asks the same questions
-- through the new per-question groups, which were seeded without images — so
-- copy the existing artwork across instead of asking for it to be uploaded
-- again.
--
-- Matching is by label, listed explicitly rather than joined, so a later rename
-- of either side cannot silently move an image onto the wrong option.

update quote_option t
   set image = s.image
  from quote_option s
 where s.group_id = 'finishing'
   and s.image is not null
   and (
        (t.group_id = 'finishCoating'        and t.id = 'gloss'   and s.label_kr = '유광 코팅')
     or (t.group_id = 'finishCoating'        and t.id = 'matte'   and s.label_kr = '무광 코팅')
     or (t.group_id = 'finishSpecialCoating' and t.id = 'spot-uv' and s.label_kr = '부분 UV')
     or (t.group_id = 'finishFoil'           and t.id = 'gold'    and s.label_kr = '금박')
     or (t.group_id = 'finishFoil'           and t.id = 'silver'  and s.label_kr = '은박')
     or (t.group_id = 'finishEmboss'         and t.id = 'emboss'  and s.label_kr = '엠보싱')
   );

-- 4도 풀컬러 likewise already has a photo on the old 인쇄 card.
update quote_option t
   set image = s.image
  from quote_option s
 where s.group_id = 'printing'
   and s.image is not null
   and s.label_kr = 'CMYK (4도 프로세스)'
   and t.group_id = 'printColorsDefault'
   and t.id = 'cmyk';

-- 0034 put the supplied white swatch on all three coating options as a
-- placeholder. 유광 / 무광 now have their own photos, so the plain swatch is
-- left only on 비코팅, where an uncoated surface is what it actually shows.

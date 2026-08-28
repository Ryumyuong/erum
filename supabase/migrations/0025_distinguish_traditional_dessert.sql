-- 전통과자 and 전통 디저트 are separate 사용분야 categories, but both carried the
-- English label "Traditional Sweets", so the English filter showed the same
-- name twice. Give the dessert one its own translation.
--
--   traditional-sweets            전통과자    → Traditional Sweets   (unchanged)
--   a79f799b-1863-41f2-a6c2-…     전통 디저트  → Traditional Dessert

update portfolio_filter_option
   set label_en = 'Traditional Dessert'
 where group_id = 'useField'
   and id = 'a79f799b-1863-41f2-a6c2-50dc757313f4';

update use_field
   set label_en = 'Traditional Dessert'
 where id = 'a79f799b-1863-41f2-a6c2-50dc757313f4';

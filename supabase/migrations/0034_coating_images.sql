-- Put the supplied swatch on the 코팅 options so the 후가공 dropdown shows a
-- thumbnail instead of an empty grey square.
--
-- One image was supplied, so all three coating choices share it for now.
-- Replace them individually in /admin/견적문의 → 견적문의 선택 항목 → 후가공 — 코팅
-- once there is separate artwork for gloss / matte / none.

update quote_option
   set image = '/quote/coating-sample.png'
 where group_id = 'finishCoating'
   and coalesce(image, '') = '';

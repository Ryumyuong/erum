-- Category notes for 패키지 종류 (the (?) beside 싸바리박스, 비닐류 …).
--
-- They were hard-coded in PackageTypePicker, so the client could not change
-- them. Storing them as ordinary quote_option rows means the existing
-- 견적문의 선택 항목 editor manages them: the option label is the category
-- name and the description is the note the (?) shows.

insert into quote_option (id, group_id, label_en, label_kr, desc_en, desc_kr, kind, sort)
values
  ('종이박스',   'packageTab', 'Paper Box',      '종이박스',   '', '', 'option', 1),
  ('골판지박스', 'packageTab', 'Corrugated Box', '골판지박스', '', '', 'option', 2),
  ('싸바리박스', 'packageTab', 'Rigid Box',      '싸바리박스',
   'Sturdy and premium, but not a good fit on a tight budget.',
   '견고하고 고급스럽지만, 예산이 제한적인 경우 적합하지 않아요.', 'option', 3),
  ('비닐류',     'packageTab', 'Poly',           '비닐류',
   'Minimum order is 10,000–20,000 pcs.',
   '최소 수량이 1만장~2만장 이상이에요.', 'option', 4),
  ('쇼핑백',     'packageTab', 'Shopping Bag',   '쇼핑백',     '', '', 'option', 5),
  ('기타',       'packageTab', 'Other',          '기타',       '', '', 'option', 6)
on conflict (group_id, id) do update
  set label_en = excluded.label_en,
      label_kr = excluded.label_kr,
      desc_en  = excluded.desc_en,
      desc_kr  = excluded.desc_kr,
      sort     = excluded.sort;

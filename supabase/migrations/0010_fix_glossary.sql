-- Fix the glossary seed: remove duplicate terms and set the categories to the
-- four canonical ones (correct labels + order).

-- 1) De-duplicate: keep the earliest row of each (category, term_en).
delete from glossary g using (
  select id, row_number() over (partition by category, term_en order by id) as rn
  from glossary
) d
where g.id = d.id and d.rn > 1;

-- 2) Keep only the four categories.
delete from glossary_category
where id not in ('structure', 'paperboard', 'printing', 'finishing');

-- 3) Ensure they exist with the right labels and order.
insert into glossary_category (id, label_en, label_kr, sort) values
  ('structure', 'Box Structure', '지기구조', 1),
  ('paperboard', 'Paper & Material', '지류·재질', 2),
  ('printing', 'Printing', '인쇄', 3),
  ('finishing', 'Finishing', '후가공', 4)
on conflict (id) do update set
  label_en = excluded.label_en,
  label_kr = excluded.label_kr,
  sort = excluded.sort;

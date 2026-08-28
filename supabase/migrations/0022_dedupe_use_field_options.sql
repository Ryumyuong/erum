-- Undo the useField over-merge introduced by 0021.
--
-- Before 0021, getUseFields() read the `use_field` table and only fell back to
-- the static list in src/lib/data/portfolio.ts when that table was empty. It
-- was not empty, so the live 사용분야 filter showed the `use_field` rows only.
-- 0021 seeded the static list *as well*, which is why near-duplicates appeared
-- ("Bakery" vs "Bakery & Cafe", two "Rice Cake", …).
--
-- Fix: keep exactly the options that `use_field` holds — the list the admin
-- actually curated — and drop the static ones 0021 added.
--
-- Preview before running, if you want to see what goes:
--   select id, label_kr, label_en from portfolio_filter_option o
--    where o.group_id = 'useField'
--      and not exists (select 1 from use_field u where u.id = o.id)
--      and not exists (select 1 from portfolio p where p.use_field = o.id);

delete from portfolio_filter_option o
where o.group_id = 'useField'
  -- not part of the curated list
  and not exists (select 1 from use_field u where u.id = o.id)
  -- …and safety net: never remove an option a portfolio item still points at,
  -- even if it only exists in the static list.
  and not exists (select 1 from portfolio p where p.use_field = o.id);

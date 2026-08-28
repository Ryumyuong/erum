-- Blog categories as an admin-managed table (single source, like FAQ/glossary).
-- id is text so the existing string ids ('bakery' etc.) and new uuids both work.
create table if not exists blog_category (
  id text primary key,
  label_en text not null default '',
  label_kr text not null default '',
  sort int not null default 0
);

-- Seed the current static categories so existing posts keep matching.
insert into blog_category (id, label_en, label_kr, sort) values
  ('basics', 'Packaging Basics', '패키지 기초', 1),
  ('printing', 'Printing Guide', '인쇄 가이드', 2),
  ('material', 'Paper & Material Guide', '지류·재질 가이드', 3),
  ('bakery', 'Bakery Packaging', '베이커리 패키지', 4)
on conflict (id) do nothing;

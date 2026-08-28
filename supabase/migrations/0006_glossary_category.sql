-- Glossary categories become admin-managed (add / edit / delete).
-- The glossary.category column stores the category id (text) — unchanged.

create table if not exists glossary_category (
  id          text primary key,
  label_en    text not null default '',
  label_kr    text not null default '',
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

insert into glossary_category (id, label_en, label_kr, sort) values
  ('printing',   'Printing',           '인쇄',       1),
  ('paperboard', 'Paper & Material',    '지류·재질',  2),
  ('structure',  'Box Structure',       '지기구조',   3),
  ('finishing',  'Finishing',           '후가공',     4),
  ('packaging',  'Packaging Material',   '포장재',     5)
on conflict (id) do nothing;

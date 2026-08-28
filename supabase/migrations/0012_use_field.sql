-- Portfolio "사용분야 (Use Field)" becomes admin-managed (add via the portfolio
-- modal). The portfolio.use_field column stores the option id (text) — unchanged.

create table if not exists use_field (
  id          text primary key,
  label_en    text not null default '',
  label_kr    text not null default '',
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Seed the existing static options with their current slug ids so portfolio
-- rows that already reference them (e.g. 'food', 'dessert-cafe') keep working.
insert into use_field (id, label_en, label_kr, sort) values
  ('food',         'Food',              '식품',       1),
  ('dessert-cafe', 'Dessert & Cafe',    '디저트·카페', 2),
  ('pharma',       'Pharmaceutical',    '제약',       3),
  ('cosmetics',    'Cosmetics',         '화장품',     4),
  ('lifestyle',    'Lifestyle & Goods', '생활·소품',   5)
on conflict (id) do nothing;

-- RLS: public read (so the public filter can resolve labels) + admin write.
alter table use_field enable row level security;
drop policy if exists "use_field_read" on use_field;
create policy "use_field_read" on use_field for select using (true);
drop policy if exists "use_field_write" on use_field;
create policy "use_field_write" on use_field for all to authenticated using (true) with check (true);

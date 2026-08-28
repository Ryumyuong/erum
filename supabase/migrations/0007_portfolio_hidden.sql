-- Portfolio item visibility toggle. When true, the item is hidden from the
-- public site (home + portfolio page) but still managed in the admin.
alter table portfolio
  add column if not exists hidden boolean not null default false;

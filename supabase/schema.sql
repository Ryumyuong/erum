-- ============================================================
-- BOXDLE — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- gen_random_uuid()
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------

create table if not exists portfolio (
  id            uuid primary key default gen_random_uuid(),
  item_no       text unique not null,
  name_en       text not null default '',
  name_kr       text not null default '',
  hover_en      text not null default '',
  hover_kr      text not null default '',
  use_field     text,
  material      text,
  package_type  text,
  package_form  text,
  printing      text[] not null default '{}',
  coating_en    text default '',
  coating_kr    text default '',
  finishing_en  text default '',
  finishing_kr  text default '',
  dim_l         integer,
  dim_w         integer,
  dim_h         integer,
  thumbnail     text,
  images        text[] not null default '{}',
  sort          integer not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists inquiry (
  id              uuid primary key default gen_random_uuid(),
  type            text not null default 'standard' check (type in ('standard','recommended')),
  company         text not null,
  contact_name    text not null,
  email           text not null,
  phone           text not null,
  city            text,
  country         text,
  category        text,
  hear_about      text[],
  product         text default '',
  quantity        text default '',
  source_item_no  text,
  package_type    text,
  box_structure   text,
  material        text,
  printing        text,
  finishing       text,
  size_w          text,
  size_d          text,
  size_h          text,
  design_link     text,
  design_needed   text check (design_needed is null or design_needed in ('yes','no')),
  budget          text,
  lead_time       text,
  message         text,
  files           text[] not null default '{}',
  locale          text default 'en',
  status          text not null default 'new' check (status in ('new','reviewing','quoted')),
  created_at      timestamptz not null default now()
);

create table if not exists faq (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  q_en        text not null default '',
  q_kr        text not null default '',
  a_en        text not null default '',
  a_kr        text not null default '',
  image       text,
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists glossary (
  id                    uuid primary key default gen_random_uuid(),
  category              text not null,
  term_en               text not null default '',
  term_kr               text not null default '',
  desc_en               text not null default '',
  desc_kr               text not null default '',
  tags_en               text[] not null default '{}',
  tags_kr               text[] not null default '{}',
  related_portfolio_ids text[] not null default '{}',
  images                text[] not null default '{}',
  sort                  integer not null default 0,
  created_at            timestamptz not null default now()
);

create table if not exists blog (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  category      text not null,
  title_en      text not null default '',
  title_kr      text not null default '',
  summary_en    text not null default '',
  summary_kr    text not null default '',
  body_en       text not null default '',
  body_kr       text not null default '',
  cover         text,
  published_at  date not null default current_date,
  created_at    timestamptz not null default now()
);

create table if not exists guide_section (
  id          uuid primary key default gen_random_uuid(),
  key         text not null,
  title_en    text not null default '',
  title_kr    text not null default '',
  sort        integer not null default 0
);

create table if not exists guide_item (
  id          uuid primary key default gen_random_uuid(),
  section_id  uuid not null references guide_section(id) on delete cascade,
  title_en    text not null default '',
  title_kr    text not null default '',
  subtitle    text default '',
  desc_en     text not null default '',
  desc_kr     text not null default '',
  tip_en      text default '',
  tip_kr      text default '',
  images      text[] not null default '{}',
  sort        integer not null default 0
);

-- Single-row settings table (id is always 1)
create table if not exists site_settings (
  id            integer primary key default 1 check (id = 1),
  site_name     text default 'BOXDLE',
  company_en    text default '',
  company_kr    text default '',
  ceo_en        text default '',
  ceo_kr        text default '',
  email         text default '',
  phone         text default '',
  biz_no        text default '',
  address_en    text default '',
  address_kr    text default '',
  instagram     text default '',
  blog_url      text default '',
  default_lang  text default 'en'
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ------------------------------------------------------------
-- updated_at tracking (powers the admin "recent activity" feed)
-- Idempotent: safe to run on a fresh or existing database.
-- ------------------------------------------------------------
create or replace function set_updated_at() returns trigger
  language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['portfolio','faq','glossary','blog','inquiry','site_settings']
  loop
    execute format('alter table %I add column if not exists updated_at timestamptz not null default now();', t);
    execute format('drop trigger if exists %I_set_updated_at on %I;', t, t);
    -- backfill existing rows while no trigger is active (so it's not re-stamped);
    -- skip tables without a created_at column (e.g. site_settings)
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = t and column_name = 'created_at'
    ) then
      execute format('update %I set updated_at = created_at;', t);
    end if;
    execute format('create trigger %I_set_updated_at before update on %I for each row execute function set_updated_at();', t, t);
  end loop;
end $$;

-- ------------------------------------------------------------
-- Row Level Security
-- Model: anyone may READ published content and CREATE an inquiry.
-- Only authenticated (admin) users may write content or read inquiries.
-- IMPORTANT: disable public sign-ups in Auth so "authenticated" == admin.
-- ------------------------------------------------------------

alter table portfolio      enable row level security;
alter table faq            enable row level security;
alter table glossary       enable row level security;
alter table blog           enable row level security;
alter table guide_section  enable row level security;
alter table guide_item     enable row level security;
alter table site_settings  enable row level security;
alter table inquiry        enable row level security;

-- Public read for content tables
do $$
declare t text;
begin
  foreach t in array array['portfolio','faq','glossary','blog','guide_section','guide_item','site_settings']
  loop
    execute format('drop policy if exists "public read" on %I;', t);
    execute format('create policy "public read" on %I for select using (true);', t);

    execute format('drop policy if exists "admin write" on %I;', t);
    execute format('create policy "admin write" on %I for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- Inquiry: anyone can submit, only admins can read/update/delete
drop policy if exists "anyone submit" on inquiry;
create policy "anyone submit" on inquiry for insert with check (true);

drop policy if exists "admin manage inquiry" on inquiry;
create policy "admin manage inquiry" on inquiry for select to authenticated using (true);

drop policy if exists "admin update inquiry" on inquiry;
create policy "admin update inquiry" on inquiry for update to authenticated using (true) with check (true);

drop policy if exists "admin delete inquiry" on inquiry;
create policy "admin delete inquiry" on inquiry for delete to authenticated using (true);

-- ------------------------------------------------------------
-- Storage: public "media" bucket for all images
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects
  for all to authenticated
  using (bucket_id = 'media') with check (bucket_id = 'media');

-- Public visitors may upload reference files into the inquiries/ folder only.
drop policy if exists "media public upload to inquiries" on storage.objects;
create policy "media public upload to inquiries" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = 'inquiries');

-- Helpful indexes
create index if not exists portfolio_sort_idx on portfolio (sort, created_at desc);
create index if not exists inquiry_created_idx on inquiry (created_at desc);
create index if not exists blog_published_idx on blog (published_at desc);

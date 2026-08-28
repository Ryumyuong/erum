-- quote_option — the selectable elements of the quote form (패키지 종류, 재질,
-- 후가공 …), owned by the quote form itself rather than borrowed from the
-- guide taxonomy.
--
-- Why separate from guide_item: the form needs entries the guide has no reason
-- to carry — "기타 종이박스", "직접입력", "추천해주세요" — and the client wants
-- the quote form's pictures and wording editable without touching /guide or the
-- portfolio, which share the guide data.
--
-- `tab` groups options inside one section (제품 정보 has 종이박스 / 싸바리박스 …
-- shown under filter tabs). `kind` marks the special cards that behave
-- differently from a normal pick.

create table if not exists quote_option (
  id          text not null,
  group_id    text not null,           -- packageType | material | finishing | …
  tab         text,                    -- optional sub-group within a section
  label_en    text not null default '',
  label_kr    text not null default '',
  desc_en     text not null default '', -- (?) tooltip
  desc_kr     text not null default '',
  image       text,
  kind        text not null default 'option'
              check (kind in ('option', 'recommend', 'custom', 'other')),
  sort        integer not null default 0,
  created_at  timestamptz not null default now(),
  primary key (group_id, id)
);

create index if not exists quote_option_group_idx
  on quote_option (group_id, sort);

alter table quote_option enable row level security;
drop policy if exists "quote_option_read" on quote_option;
create policy "quote_option_read" on quote_option for select using (true);
drop policy if exists "quote_option_write" on quote_option;
create policy "quote_option_write" on quote_option for all to authenticated
  using (true) with check (true);

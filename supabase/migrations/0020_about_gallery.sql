-- about_gallery — the "공장 및 장비 갤러리" slides on /about, so the photo and
-- its caption can be edited from the admin instead of living in
-- src/lib/data/about.ts.

create table if not exists about_gallery (
  id          uuid primary key default gen_random_uuid(),
  image       text,
  caption_en  text not null default '',
  caption_kr  text not null default '',
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Seed with the slides that were hard-coded, so the page looks unchanged after
-- this migration runs. Only on an empty table — re-running must not duplicate.
insert into about_gallery (image, caption_en, caption_kr, sort)
select * from (values
  ('/about/gallery-1.png', 'Printing Machine',   '인쇄 장비', 1),
  ('/about/gallery-2.png', 'Finishing Equipment', '마무리 장비', 2),
  ('/about/gallery-3.jpg', 'Quality Check',      '품질 검사', 3),
  ('/about/gallery-4.jpg', 'Packaging Process',  '포장 공정', 4),
  ('/about/gallery-5.jpg', 'Factory Overview',   '공장 전경', 5),
  ('/about/gallery-6.jpg', 'Team Consultation',  '팀 상담',   6)
) as seed(image, caption_en, caption_kr, sort)
where not exists (select 1 from about_gallery);

-- RLS: public read (the /about page renders it) + admin write.
alter table about_gallery enable row level security;
drop policy if exists "about_gallery_read" on about_gallery;
create policy "about_gallery_read" on about_gallery for select using (true);
drop policy if exists "about_gallery_write" on about_gallery;
create policy "about_gallery_write" on about_gallery for all to authenticated
  using (true) with check (true);

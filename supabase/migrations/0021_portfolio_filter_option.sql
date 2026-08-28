-- portfolio_filter_option — every portfolio filter option in one admin-managed
-- table. Until now only "사용분야" was editable (the `use_field` table, 0012);
-- the other eight groups were hard-coded in src/lib/data/portfolio.ts.
--
-- Composite key (group_id, id): option ids are only unique within their group,
-- and portfolio rows store the bare option id per group.

create table if not exists portfolio_filter_option (
  id          text not null,
  group_id    text not null,
  label_en    text not null default '',
  label_kr    text not null default '',
  image       text,
  sort        integer not null default 0,
  created_at  timestamptz not null default now(),
  primary key (group_id, id)
);

-- Seed from the previously hard-coded taxonomy, keeping the same option ids so
-- existing portfolio rows keep resolving. Skipped where a row already exists.
insert into portfolio_filter_option (id, group_id, label_en, label_kr, image, sort) values
  ('type-a', 'packageForm', 'Type A', 'A형', '/filters/package-form/type-a.png', 1),
  ('type-b', 'packageForm', 'Type B', 'B형', '/filters/package-form/type-b.png', 2),
  ('type-c', 'packageForm', 'Type C', 'C형', '/filters/package-form/type-c.png', 3),
  ('type-g', 'packageForm', 'Type G', 'G형', '/filters/package-form/type-g.png', 4),
  ('type-m', 'packageForm', 'Type M', 'M형', '/filters/package-form/type-m.png', 5),
  ('type-r', 'packageForm', 'Type R', 'R형', '/filters/package-form/type-r.png', 6),
  ('type-rrp', 'packageForm', 'Type RRP', 'RRP형', '/filters/package-form/type-rrp.png', 7),
  ('sleeve', 'packageForm', 'Sleeve', '슬리브', '/filters/package-form/sleeve.png', 8),
  ('type-y', 'packageForm', 'Type Y', 'Y형', '/filters/package-form/type-y.png', 9),
  ('envelope', 'packageForm', 'Envelope', '봉투형', '/filters/package-form/envelope.png', 10),
  ('rigid', 'packageForm', 'Rigid (Set-up)', '싸바리형', '/filters/package-form/rigid.png', 11),
  ('paper-handle', 'packageForm', 'Paper Handle', '종이손잡이형', '/filters/package-form/paper-handle.png', 12),
  ('custom', 'packageForm', 'Custom', '커스텀형', '/filters/package-form/custom.png', 13),
  ('shopping-bag', 'packageForm', 'Shopping Bag', '쇼핑백', '/filters/package-form/shopping-bag.png', 14),
  ('poly-bag', 'packageForm', 'Poly Bag', '비닐백', '/filters/package-form/poly-bag.png', 15),
  ('deco-etc', 'packageForm', 'Deco & Etc', '데코·기타', '/filters/package-form/deco-etc.png', 16),
  ('food', 'useField', 'Food', '식품', null, 1),
  ('bakery-cafe', 'useField', 'Bakery & Cafe', '베이커리·카페', null, 2),
  ('beverage', 'useField', 'Beverage & Liquor', '주류·액체류', null, 3),
  ('pharma-bio', 'useField', 'Pharma & Bio', '의약·바이오', null, 4),
  ('beauty', 'useField', 'Beauty', '뷰티', null, 5),
  ('fashion', 'useField', 'Fashion & Goods', '패션·잡화', null, 6),
  ('electronics', 'useField', 'Electronics & IT', '전자·IT', null, 7),
  ('household', 'useField', 'Household', '생활용품', null, 8),
  ('sports', 'useField', 'Sports', '스포츠', null, 9),
  ('pet-kids', 'useField', 'Pet & Kids', '반려동물·키즈', null, 10),
  ('folding-carton', 'packageType', 'Folding Carton', '단상자(종이)', null, 1),
  ('rigid-box', 'packageType', 'Rigid Box', '싸바리상자', null, 2),
  ('corrugated', 'packageType', 'Corrugated Box', '골판지상자', null, 3),
  ('custom-form', 'packageType', 'Custom Form', '커스텀 형태', null, 4),
  ('shopping-bag', 'packageType', 'Shopping Bag', '쇼핑백', null, 5),
  ('etc', 'packageType', 'Other (Sticker etc.)', '기타(스티커 등)', null, 6),
  ('uncoated', 'material', 'Uncoated Paper', '비도공지', null, 1),
  ('coated', 'material', 'Coated Paper', '도공지', null, 2),
  ('kraft', 'material', 'Kraft Paper', '크라프트지', null, 3),
  ('specialty', 'material', 'Specialty Paper', '특수지', null, 4),
  ('eco', 'material', 'Eco Paper', '친환경지', null, 5),
  ('offset', 'printMethod', 'Offset', '옵셋 인쇄', null, 1),
  ('digital', 'printMethod', 'Digital', '디지털 인쇄', null, 2),
  ('flexo', 'printMethod', 'Flexo', '플렉소 인쇄', null, 3),
  ('silk', 'printMethod', 'Silk Screen', '실크 인쇄', null, 4),
  ('gravure', 'printMethod', 'Gravure', '그라비어 인쇄', null, 5),
  ('black', 'printing', 'Black (K)', '먹색', '/filters/print-colors/black.png', 1),
  ('white', 'printing', 'White', '백색', '/filters/print-colors/white.png', 2),
  ('color', 'printing', 'Color (CMYK)', '컬러', '/filters/print-colors/color.png', 3),
  ('spot', 'printing', 'Spot Color', '별색', '/filters/print-colors/spot.png', 4),
  ('color-spot', 'printing', 'Color + Spot', '컬러+별색', '/filters/print-colors/color-spot.png', 5),
  ('matte', 'coating', 'Matte Coating', '무광 코팅', null, 1),
  ('gloss', 'coating', 'Gloss Coating', '유광 코팅', null, 2),
  ('soft-touch', 'coating', 'Soft Touch', '소프트터치', null, 3),
  ('hologram', 'coating', 'Hologram', '홀로그램', null, 4),
  ('none', 'coating', 'No Coating', '무코팅', null, 5),
  ('gold-foil', 'finishing', 'Gold Foil', '금박', null, 1),
  ('silver-foil', 'finishing', 'Silver Foil', '은박', null, 2),
  ('emboss', 'finishing', 'Embossing', '엠보싱', null, 3),
  ('deboss', 'finishing', 'Debossing', '형압', null, 4),
  ('spot-uv', 'finishing', 'Spot UV', '부분 UV', null, 5),
  ('die-cut', 'finishing', 'Die-cut', '도무송', null, 6),
  ('ribbon', 'accessories', 'Ribbon', '리본', null, 1),
  ('handle', 'accessories', 'Handle', '손잡이', null, 2),
  ('magnet', 'accessories', 'Magnet', '자석', null, 3),
  ('window', 'accessories', 'Window (PVC)', '창(PVC)', null, 4),
  ('cushion', 'accessories', 'Cushioning', '완충재', null, 5),
  ('sticker', 'accessories', 'Sticker', '스티커', null, 6)
on conflict (group_id, id) do nothing;

-- The useField group is authoritative in `use_field` (it has been editable, so
-- it may hold admin-added options and edited labels). Carry that over on top of
-- the static seed. `use_field` itself is left in place as a fallback/backup —
-- nothing reads it after this migration, and it can be dropped once the new
-- table is confirmed good.
insert into portfolio_filter_option (id, group_id, label_en, label_kr, sort)
select id, 'useField', label_en, label_kr, sort from use_field
on conflict (group_id, id) do update
  set label_en = excluded.label_en,
      label_kr = excluded.label_kr,
      sort     = excluded.sort;

-- RLS: public read (the portfolio filter renders it) + admin write.
alter table portfolio_filter_option enable row level security;
drop policy if exists "portfolio_filter_option_read" on portfolio_filter_option;
create policy "portfolio_filter_option_read" on portfolio_filter_option for select using (true);
drop policy if exists "portfolio_filter_option_write" on portfolio_filter_option;
create policy "portfolio_filter_option_write" on portfolio_filter_option for all to authenticated using (true) with check (true);

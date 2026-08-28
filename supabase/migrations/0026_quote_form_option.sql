-- quote_form_option — the two option lists on the quote form that were
-- hard-coded in src/components/quote/QuoteForm.tsx:
--   category  : 제품 카테고리 (easy-quote dropdown)
--   hearAbout : "저희를 어떻게 알게 되셨나요?" checkboxes
--
-- The package type / box structure / material / printing / finishing groups are
-- NOT here: they come from the guide taxonomy (guide_section + guide_item) and
-- are shared with /guide and the portfolio, so they stay edited in one place.

create table if not exists quote_form_option (
  id          text not null,
  group_id    text not null,
  label_en    text not null default '',
  label_kr    text not null default '',
  sort        integer not null default 0,
  created_at  timestamptz not null default now(),
  primary key (group_id, id)
);

insert into quote_form_option (id, group_id, label_en, label_kr, sort) values
  ('bakery-cafe', 'category', 'Bakery & Cafe', '베이커리·카페', 1),
  ('chocolate', 'category', 'Chocolate', '초콜릿', 2),
  ('e-commerce', 'category', 'E-commerce', '전자상거래', 3),
  ('fashion-apparel', 'category', 'Fashion & Apparel', '패션 및 의류', 4),
  ('food-takeout', 'category', 'Food & Takeout', '식품 및 테이크아웃', 5),
  ('agricultural-products', 'category', 'Agricultural Products', '농산물', 6),
  ('seafood', 'category', 'Seafood', '수산물', 7),
  ('livestock-products', 'category', 'Livestock Products', '축산물', 8),
  ('wine', 'category', 'Wine', '와인', 9),
  ('toys', 'category', 'Toys', '완구', 10),
  ('cosmetics', 'category', 'Cosmetics', '화장품', 11),
  ('frozen-products', 'category', 'Frozen Products', '냉동제품', 12),
  ('gifts', 'category', 'Gifts', '선물용품', 13),
  ('cleaning-supplies', 'category', 'Cleaning Supplies', '청소용품', 14),
  ('google', 'hearAbout', 'Google', '구글', 1),
  ('instagram', 'hearAbout', 'Instagram', '인스타그램', 2),
  ('linkedin', 'hearAbout', 'LinkedIn', '링크드인', 3),
  ('trade-show', 'hearAbout', 'Trade Show', '무역박람회', 4),
  ('recommendation-from-a-friend', 'hearAbout', 'Recommendation from a Friend', '지인추천', 5),
  ('promotional-material', 'hearAbout', 'Promotional Material', '홍보물', 6),
  ('other', 'hearAbout', 'Other', '기타', 7)
on conflict (group_id, id) do nothing;

alter table quote_form_option enable row level security;
drop policy if exists "quote_form_option_read" on quote_form_option;
create policy "quote_form_option_read" on quote_form_option for select using (true);
drop policy if exists "quote_form_option_write" on quote_form_option;
create policy "quote_form_option_write" on quote_form_option for all to authenticated using (true) with check (true);

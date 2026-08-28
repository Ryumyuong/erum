-- FAQ categories become admin-managed (add / edit / delete).
-- The faq.category column stores the category id (text) — unchanged.

create table if not exists faq_category (
  id          text primary key,
  label_en    text not null default '',
  label_kr    text not null default '',
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Seed the existing static categories so nothing breaks.
insert into faq_category (id, label_en, label_kr, sort) values
  ('design',     'Design & Structure',   '디자인 및 구조',   1),
  ('quote',      'Quote & Pricing',       '견적 및 가격',     2),
  ('production', 'Production & Process',   '제작 및 절차',     3),
  ('moq',        'MOQ & Samples',          '최소수량 및 샘플', 4),
  ('payment',    'Payment & Contract',     '결제 및 계약',     5),
  ('shipping',   'Shipping & Export',      '배송 및 수출',     6),
  ('aftercare',  'After-care',             '사후관리',         7)
on conflict (id) do nothing;

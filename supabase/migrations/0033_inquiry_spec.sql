-- Columns for the redesigned quote form.
--
-- `spec` holds every option answer as { group_id: { id, label, note } }. The
-- option set is admin-editable and branches by package type, so a column per
-- question would need a migration every time the client adds a choice — JSONB
-- keeps the shape flexible while staying queryable.
-- The rest are first-class because they are asked on every inquiry.

alter table inquiry
  add column if not exists spec             jsonb   not null default '{}'::jsonb,
  -- 개인정보 수집 및 이용 동의 — required to submit
  add column if not exists privacy_agreed   boolean not null default false,
  -- 제작물 홍보 활용 동의 — optional
  add column if not exists promo_agreed     boolean,
  -- 어떤 점이 가장 중요하신가요?
  add column if not exists priority         text,
  -- 어떤 제품을 담으시나요?
  add column if not exists contains_product text;

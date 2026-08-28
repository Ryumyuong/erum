-- Glossary detail page fields: "어떤 경우에 사용하나요?" / "추천 분야"
alter table glossary
  add column if not exists when_used_en       text not null default '',
  add column if not exists when_used_kr       text not null default '',
  add column if not exists recommended_for_en text not null default '',
  add column if not exists recommended_for_kr text not null default '';

-- Portfolio filters become driven by the guide taxonomy (guide_section / guide_item).
-- Each portfolio row stores its selected guide-item ids per section as JSON:
--   { "<section_key>": ["<guide_item_id>", ...], ... }
-- This stays flexible as guide categories are added / renamed / removed in the admin.

alter table portfolio
  add column if not exists categories jsonb not null default '{}'::jsonb;

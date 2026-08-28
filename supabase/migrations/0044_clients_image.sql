-- 거래처 logo wall as a single artwork instead of a grid of files.
--
-- Maintaining 20+ individual logos (each needing its own size tweak) was
-- awkward; the client would rather drop in one composed image. Two columns so
-- the wide desktop version and a taller phone version can differ — leave the
-- mobile one empty to use the desktop image at both sizes.
--
-- With both empty the site falls back to the built-in logo grid, so nothing
-- changes until an image is uploaded.

alter table site_settings add column if not exists clients_image     text default '';
alter table site_settings add column if not exists clients_image_mobile text default '';

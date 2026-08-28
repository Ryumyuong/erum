-- WhatsApp was replaced by the KakaoTalk channel (0029). The column still held
-- a placeholder number that nothing reads any more, so clear it.
--
-- The column itself is left in place: dropping it would break any older
-- deployment still running the previous build.

update site_settings set whatsapp = '' where coalesce(whatsapp, '') <> '';

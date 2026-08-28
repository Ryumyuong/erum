-- Remove the WhatsApp field for good.
--
-- KakaoTalk replaced it as the chat contact in 0029; 0040 blanked the leftover
-- value and the application stopped reading or writing the column. Nothing
-- refers to it any more, so drop it.

alter table site_settings drop column if exists whatsapp;

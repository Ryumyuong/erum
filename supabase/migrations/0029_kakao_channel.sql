-- Replace WhatsApp with a KakaoTalk channel as the chat contact.
--
-- `whatsapp` held a phone number used to build a wa.me link; a Kakao channel is
-- a URL instead, so it needs its own column. The old column is left in place —
-- nothing reads it after this change, and dropping it would lose the number.

alter table site_settings
  add column if not exists kakao_url text default '';

update site_settings
   set kakao_url = 'http://pf.kakao.com/_xlxmHwd'
 where id = 1
   and coalesce(kakao_url, '') = '';

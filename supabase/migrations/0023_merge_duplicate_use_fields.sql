-- Merge the two 사용분야 options that exist twice with identical labels.
--
-- Each pair is one readable slug (added with the original seed, 0 items) and
-- one UUID row (added later from the admin, which generates a random id) that
-- carries the actual portfolio item. Keep the slug — it is the readable id the
-- rest of the taxonomy uses — and repoint the item before deleting the UUID.
--
--   떡 / Rice Cake  : rice-cake (0) ← 6faf63e4-… (1: BD-SL-001)
--   커피 / Coffee   : coffee    (0) ← a22dcbc3-… (1: BD-CK-002)
--
-- Deliberately NOT touched:
--   · 전통과자(traditional-sweets, 0) vs 전통 디저트(a79f799b-…, 1) — the English
--     labels match but the Korean ones differ, so this may be an intentional
--     distinction. Merge it by hand in the admin if it is not.
--   · pharma / cosmetics / decoration / traditional-sweets — unused today, but
--     they are valid taxonomy entries, not duplicates.

update portfolio set use_field = 'rice-cake'
 where use_field = '6faf63e4-5496-4cec-8952-4c9a5d67ddb1';

update portfolio set use_field = 'coffee'
 where use_field = 'a22dcbc3-7637-4486-87c5-72ec4d1451e6';

delete from portfolio_filter_option
 where group_id = 'useField'
   and id in (
     '6faf63e4-5496-4cec-8952-4c9a5d67ddb1',
     'a22dcbc3-7637-4486-87c5-72ec4d1451e6'
   )
   -- refuse to drop a row anything still points at
   and not exists (select 1 from portfolio p where p.use_field = portfolio_filter_option.id);

-- Legacy table kept in sync so it stays a usable fallback until it is dropped.
delete from use_field
 where id in (
   '6faf63e4-5496-4cec-8952-4c9a5d67ddb1',
   'a22dcbc3-7637-4486-87c5-72ec4d1451e6'
 );

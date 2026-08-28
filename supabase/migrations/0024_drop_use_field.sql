-- Retire the `use_field` table.
--
-- 0021 folded it into portfolio_filter_option (group_id = 'useField'), and no
-- application code reads it any more — getUseFields() is now a slice of the
-- unified table. It was left in place as a rollback reference for 0021–0023.
--
-- RUN THIS LAST, and only once the 사용분야 filter has been verified in the
-- admin and on /portfolio. Dropping it removes the ability to re-derive the
-- curated list, which is what 0022 keyed off.

drop table if exists use_field;

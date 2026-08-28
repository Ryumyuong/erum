-- Migration 0002: backfill updated_at = created_at for rows that existed before
-- the column was added (0001 set them all to the migration time, which made the
-- admin "recent activity" feed show everything as "업데이트됨").
-- The BEFORE UPDATE trigger would re-stamp now(), so disable it during backfill.
-- site_settings has no created_at column, so it is skipped (guarded).
-- Run once in the Supabase SQL editor (after 0001). Idempotent.

do $$
declare t text;
begin
  foreach t in array array['portfolio','faq','glossary','blog','inquiry','site_settings']
  loop
    execute format('alter table %I disable trigger %I_set_updated_at;', t, t);
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = t and column_name = 'created_at'
    ) then
      execute format('update %I set updated_at = created_at;', t);
    end if;
    execute format('alter table %I enable trigger %I_set_updated_at;', t, t);
  end loop;
end $$;

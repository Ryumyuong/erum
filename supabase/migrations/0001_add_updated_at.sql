-- Migration: add updated_at + auto-update trigger to content tables.
-- Powers the admin dashboard "recent activity" feed (등록/업데이트 + 새 문의).
-- Run once in the Supabase SQL editor on an existing database.
-- Idempotent.

create or replace function set_updated_at() returns trigger
  language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['portfolio','faq','glossary','blog','inquiry','site_settings']
  loop
    execute format('alter table %I add column if not exists updated_at timestamptz not null default now();', t);
    execute format('drop trigger if exists %I_set_updated_at on %I;', t, t);
    -- backfill existing rows while no trigger is active (so it's not re-stamped);
    -- skip tables without a created_at column (e.g. site_settings)
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = t and column_name = 'created_at'
    ) then
      execute format('update %I set updated_at = created_at;', t);
    end if;
    execute format('create trigger %I_set_updated_at before update on %I for each row execute function set_updated_at();', t, t);
  end loop;
end $$;

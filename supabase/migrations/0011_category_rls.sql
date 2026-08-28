-- The *_category tables had RLS enabled but no read policy, so neither the
-- public site nor the admin could read them (rows existed but returned empty).
-- Add a public SELECT policy (like the content tables) and an authenticated
-- write policy (for the admin server actions).

do $$
declare t text;
begin
  foreach t in array array['glossary_category','faq_category','blog_category']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "%s_read" on %I', t, t);
    execute format('create policy "%s_read" on %I for select using (true)', t, t);
    execute format('drop policy if exists "%s_write" on %I', t, t);
    execute format('create policy "%s_write" on %I for all to authenticated using (true) with check (true)', t, t);
  end loop;
end $$;

-- Migration 0003: reference-file uploads on the (public) quote form.
--   1) inquiry.files — array of public file URLs attached to an inquiry
--   2) allow anonymous uploads, but only into media/inquiries/* (scoped + safe)
-- Run once in the Supabase SQL editor. Idempotent.

alter table inquiry add column if not exists files text[] not null default '{}';

-- Public visitors (anon) may upload reference files into the inquiries/ folder.
drop policy if exists "media public upload to inquiries" on storage.objects;
create policy "media public upload to inquiries" on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'inquiries'
  );

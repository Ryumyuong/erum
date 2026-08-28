-- Backfills schema drift: these four inquiry columns have been written by the
-- quote form (src/app/quote/actions.ts) since the contact + easy-quote fields
-- were added, but they were only ever created by hand on the live database —
-- no migration and no entry in schema.sql. Without them a freshly provisioned
-- database rejects every quote submission.
--
-- `if not exists` makes this a no-op where the columns are already present, so
-- it is safe to run against the existing database.
alter table inquiry add column if not exists city       text;
alter table inquiry add column if not exists country    text;
alter table inquiry add column if not exists category   text;
-- Multi-select ("How did you hear about us?"), read as string[] by the admin
-- inquiry list.
alter table inquiry add column if not exists hear_about text[];

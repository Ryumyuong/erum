-- inquiry.design_needed — answer to "디자인 작업이 필요하신가요?" (Y/N).
-- Required in both the standard and easy quote forms.
alter table inquiry
  add column if not exists design_needed text
  check (design_needed is null or design_needed in ('yes', 'no'));

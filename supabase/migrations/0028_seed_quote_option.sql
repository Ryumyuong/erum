-- Seed quote_option from what the quote form currently shows, so switching the
-- form over to this table changes nothing visible.
--
-- The live source is the guide taxonomy: guide_section.key maps 1:1 to a quote
-- group, and each guide_item becomes an option carrying its first image. Only
-- runs where the group is still empty, so re-running can't duplicate or
-- overwrite edits made in the admin.

insert into quote_option (id, group_id, label_en, label_kr, desc_en, desc_kr, image, kind, sort)
select
  i.id::text,
  case s.key
    when 'package-types'   then 'packageType'
    when 'box-structures'  then 'boxStructure'
    when 'paper-materials' then 'material'
    when 'printing'        then 'printing'
    when 'finishing'       then 'finishing'
  end                                   as group_id,
  i.title_en,
  i.title_kr,
  coalesce(i.desc_en, ''),
  coalesce(i.desc_kr, ''),
  nullif(i.images[1], ''),
  'option',
  i.sort
from guide_item i
join guide_section s on s.id = i.section_id
where s.key in ('package-types','box-structures','paper-materials','printing','finishing')
  and not exists (
    select 1 from quote_option q
     where q.group_id = case s.key
       when 'package-types'   then 'packageType'
       when 'box-structures'  then 'boxStructure'
       when 'paper-materials' then 'material'
       when 'printing'        then 'printing'
       when 'finishing'       then 'finishing'
     end
  )
on conflict (group_id, id) do nothing;

-- The two cards every picker ends with. They are not guide content — they are
-- form affordances — which is exactly why they live here now.
insert into quote_option (id, group_id, label_en, label_kr, kind, sort)
select v.id, g.group_id, v.label_en, v.label_kr, v.kind, v.sort
from (values
  ('recommend', 'Recommend for me', '추천해주세요', 'recommend', 900),
  ('custom',    'Enter my own',     '직접입력',     'custom',    901)
) as v(id, label_en, label_kr, kind, sort)
cross join (values
  ('packageType'), ('boxStructure'), ('material'), ('printing'), ('finishing')
) as g(group_id)
on conflict (group_id, id) do nothing;

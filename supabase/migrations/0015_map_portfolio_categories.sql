-- Auto-map portfolio items onto the live guide taxonomy (sets portfolio.categories)
-- so the public portfolio filter actually works. Matches the REAL guide section
-- keys (package-types / box-structures / paper-materials / printing / finishing)
-- and the current guide item titles. Idempotent — safe to re-run.

with gi as (
  select gs.key as skey, i.title_kr, i.id::text as id
  from guide_item i
  join guide_section gs on i.section_id = gs.id
)
update portfolio p set categories = (
  select coalesce(jsonb_object_agg(k, v), '{}'::jsonb)
  from (
    select 'package-types' as k, to_jsonb(array_agg(id)) as v
    from gi
    where skey = 'package-types'
      and title_kr = case p.package_type
        when 'folding-carton' then '단상자'
        when 'rigid-box'      then '싸바리상자'
      end
    having count(*) > 0
    union all
    select 'box-structures', to_jsonb(array_agg(id))
    from gi
    where skey = 'box-structures'
      and title_kr = case p.package_form
        when 'tuck-top' then '덮개형'
        when 'handle'   then '손잡이형'
      end
    having count(*) > 0
    union all
    select 'paper-materials', to_jsonb(array_agg(id))
    from gi
    where skey = 'paper-materials'
      and title_kr = case p.material
        when 'specialty' then '특수지'
        when 'coated'    then '백색 도공지'
        when 'uncoated'  then '비도공지'
        when 'kraft'     then '크라프트지'
      end
    having count(*) > 0
    union all
    select 'printing', to_jsonb(array_agg(id))
    from gi
    where skey = 'printing'
      and (
        (title_kr = 'CMYK (4도 프로세스)' and 'cmyk' = any(p.printing)) or
        (title_kr = '별색 (팬톤)'          and 'spot' = any(p.printing))
      )
    having count(*) > 0
    union all
    select 'finishing', to_jsonb(array_agg(id))
    from gi
    where skey = 'finishing'
      and (
        (title_kr = '무광 코팅' and (coalesce(p.coating_kr,'') like '%무광%' or coalesce(p.finishing_kr,'') like '%무광%')) or
        (title_kr = '금박'      and (coalesce(p.coating_kr,'') like '%금박%' or coalesce(p.finishing_kr,'') like '%금박%'))
      )
    having count(*) > 0
  ) as parts
)
where p.item_no like 'BD-%';

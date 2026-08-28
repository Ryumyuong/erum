-- Section-heading (?) copy for the quote form.
--
-- These lived in the translation files, so changing them meant going to 언어
-- 관리 while the option-level (?) text was edited in 견적문의 선택 항목. Storing
-- them the same way as every other (?) puts both in one place: the option label
-- is the section name and the description is the note the (?) shows.
--
-- An empty description falls back to the translated text, so nothing changes
-- until someone edits a row.

insert into quote_option (id, group_id, label_en, label_kr, desc_en, desc_kr, kind, sort)
values
  ('packageType', 'sectionTip', 'Package Type', '패키지 종류',
   'Choose the box type that fits your product. Not sure? Pick ''Recommend for me'' and our experts will suggest one.',
   '제품에 맞는 박스 종류를 선택하세요. 잘 모르겠다면 ''추천해주세요''를 고르면 전문가가 추천해 드립니다.',
   'option', 1),
  ('material', 'sectionTip', 'Materials', '재질 정보',
   'The paper stock for your box — coated, kraft and more.',
   '박스에 사용할 종이·지류입니다. 도공지·크라프트지 등이 있습니다.',
   'option', 2),
  ('printing', 'sectionTip', 'Printing', '인쇄 방식',
   'The color printing method. CMYK is full color; spot colors match exact brand colors.',
   '색상 인쇄 방식입니다. 4도(CMYK)는 풀컬러, 별색은 정확한 브랜드 컬러용입니다.',
   'option', 3),
  ('finishing', 'sectionTip', 'Finishing', '후가공 옵션',
   'Finishing adds durability and polish through extra processing — it lifts the perceived quality and strengthens the brand image.',
   '후가공이란? 추가 가공을 통해 내구성을 높이고, 디자인의 완성도를 높이는 공정입니다. 고급스러운 분위기를 연출하고 브랜드 이미지를 강화할 수 있습니다.',
   'option', 4)
on conflict (group_id, id) do update
  set label_en = excluded.label_en,
      label_kr = excluded.label_kr,
      desc_en  = excluded.desc_en,
      desc_kr  = excluded.desc_kr,
      sort     = excluded.sort;

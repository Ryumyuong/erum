-- '그 외' reads as a different concept from the '기타' used everywhere else in
-- the form. One wording for the free-text choice.

update quote_option
   set label_kr = '기타'
 where group_id in ('printColorsOpp', 'printColorsPoly')
   and kind = 'other'
   and label_kr = '그 외';

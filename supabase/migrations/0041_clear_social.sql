-- Instagram and the blog are not running yet, and the stored values were the
-- bare domains — clicking either took visitors to a login page. Empty means the
-- footer icon is not rendered at all.

update site_settings
   set instagram = '',
       blog_url  = ''
 where instagram in ('https://instagram.com/', 'https://www.instagram.com/')
    or blog_url  in ('https://blog.naver.com/', 'https://blog.naver.com');

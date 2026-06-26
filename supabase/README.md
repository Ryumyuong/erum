# Supabase 설정 가이드 (P4)

프로젝트 URL: `https://mscjrwjifzwtpdcvezaw.supabase.co`

아래 3단계만 해주시면 제가 관리자 CMS를 실제 DB에 연결합니다.

---

## 1. 스키마 실행 (DB 테이블 생성)

1. Supabase 대시보드 접속 → 좌측 **SQL Editor**
2. **New query** 클릭
3. 이 폴더의 **`schema.sql`** 내용을 전부 복사해 붙여넣기
4. **Run** (Ctrl/Cmd + Enter)
5. "Success. No rows returned" 나오면 완료
   → Table Editor에 `portfolio`, `inquiry`, `faq`, `glossary`, `blog`,
     `guide_section`, `guide_item`, `site_settings` 테이블이 보입니다.

## 2. 관리자 로그인 설정 (회원가입 차단 + 관리자 계정 생성)

> 사이트엔 고객 로그인이 없으므로, 로그인 가능한 사람 = 관리자뿐이 되도록 막습니다.

1. 좌측 **Authentication → Sign In / Providers** (또는 **Providers**)
   - **Email** 활성화
   - **Authentication → Settings**(또는 Sign In / Providers 하단)에서
     **"Allow new users to sign up"** 을 **OFF**
2. 좌측 **Authentication → Users → Add user → Create new user**
   - Email: (관리자용 이메일)
   - Password: (원하는 비밀번호)
   - **Auto Confirm User** 체크 후 생성

## 3. anon key 전달

1. 좌측 **Project Settings → API Keys** (또는 **API**)
2. **Project API keys → `anon` `public`** 키 복사
3. 채팅으로 그 키만 보내주세요. (anon 키는 브라우저에 노출되는 공개 키라 안전합니다)

> ⚠️ `service_role` 키는 보내지 마세요 — 이 프로젝트는 RLS + 관리자 로그인 세션으로
> 동작하므로 필요 없습니다.

---

설정이 끝나면 알려주세요. anon 키를 `.env.local`에 넣고 관리자 CMS를 연결한 뒤,
실데이터 입력 화면까지 테스트해 드립니다.

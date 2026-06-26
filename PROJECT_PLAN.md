# 이룸디앤피(→ 상호변경예정) 영문 홈페이지 — 기획 & 기술 스택

> 영문 기본 + 국문(EN/KR) 토글 · 포트폴리오 필터링 · 관리자 CMS 포함 풀스택
> 브랜드: **BOXDLE** / 도메인: **boxdle.com**
> 레퍼런스: 박스마스터(boxmaster) · 패커티브(packtive) · 구카패키징 · 광성씨앤피
> 디자인 시안: BOXDLE 18종

---

## 0. 브랜드 · 포지셔닝 원칙 (노션 반영)

- **목적**: 수출 / 포트폴리오 전시 / 문의 유입 → 제작 전환
- **3대 핵심**: ① 문의(견적) 버튼이 **어디서나 항상 잘 보일 것** ② 고객이 포트폴리오를 **편하게 탐색**할 것 ③ **관리가 편할 것**
- **⚠ 회사명 최소화**: 상호 변경 예정. 본문에 회사 실명 노출 최소화하고 **"we / us (우리·저희)"** 로 대체. 브랜드/로고는 **BOXDLE**.
- **타겟**: 미국 소재 베이커리 사장·구매담당 / 정기 주문할 규모 / 한인·한국 제조 신뢰
- **타겟 고민**: 퀄리티·단가·배송비·최소수량·납기·수입 복잡성 → 포트폴리오 퀄리티 + 회사소개 신뢰도 + FAQ로 해소
- **USP**: 미국 현지 대비 저렴 / 전문팀(전담 디자이너·인쇄 전문가·직영공장) / **전 제품 친환경 콩기름 인쇄** / since 1984 노하우 / 빠른 납기·성실
- **SNS**: 인스타그램, 블로그 (푸터·연락처 노출)
- **브랜드 컬러**: 미정 → **착수 전 전달 예정** (시안 오렌지 기준 토큰화, 전달 시 교체)
- **고객 로그인 기능 없음** (회원제 X). 관리자 인증만 존재.

---

## 1. 기술 스택 (확정안)

| 영역 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | **Next.js 15 (App Router) + TypeScript** | SSR/SEO·다국어·관리자 단일 코드베이스 |
| 스타일 | **Tailwind CSS** | 오렌지/네이비 → 디자인 토큰화(브랜드컬러 교체 용이) |
| 다국어 | **next-intl**(UI) + DB 이중 컬럼(EN/KR)(콘텐츠) | 영문 기본, KR 토글, 누락 시 영문 폴백 |
| DB | **Supabase (PostgreSQL)** | DB + 이미지 스토리지 + 관리자 인증 일체 |
| 이미지 | **Supabase Storage** | 포트폴리오/가이드/블로그/용어 이미지 |
| 인증 | **Supabase Auth** (관리자 전용) | `/admin` 보호 |
| 폼/메일 | DB 저장 + **Resend** 알림 | 견적문의 접수 → 문의함 + 담당자 알림 |
| 배포 | **Vercel** + Supabase | 자동배포, 저비용 |

> 정부지원 산출물: **소스코드 + 배포본 + 관리자 인수인계 문서** 납품 형태 구성.

---

## 2. 사이트맵 / 라우트

### 공개 (영문 기본 `/`, EN/KR 토글 · 고객 로그인 없음)
- `/` **HOME** — Hero(시선끄는 첫화면) / 짧은 회사소개·슬로건 / 포트폴리오 전시 / 왜 우리인가 / 제작 프로세스 / 솔루션 / 가이드·FAQ / CTA. **견적 버튼 상시 고정(sticky)**
- `/about` **ABOUT** — 수출 이력 / 업력(1984) / 인증·특허 / 장비·공장 사진 / 핵심가치 / 거래처 (신뢰도 확보)
- `/portfolio` **PORTFOLIO** — 검색 + 필터(좌측 목록 / 우측 필터). *메뉴바 노출은 선택*
- `/portfolio/[id]` 상세 — **팝업(모달)** 우선, 이미지/스펙 테이블 좌우 배치
- `/guide` **CUSTOM GUIDE** — 페이지 내 내비게이션, 재질·인쇄·구조 사진+특징, "선택 어렵다면? 전문가 추천 [Contact us]" CTA
- `/faq` **FAQ** — 카테고리 필터 + 검색 + 아코디언, 하단 CTA(Email/WhatsApp)
- `/glossary` **GLOSSARY(용어사전)** — 카테고리 필터 + 검색, 상세에 **관련 포트폴리오 연결**
- `/blog` **BLOG** + `/blog/[slug]` — 카드(카테고리/제목/한줄) + 상단 필터, 상세는 제목/한줄/발행일/목차(TOC)
- `/quote` **INQUIRY** — 표준/추천 전환 + "전체 추천" 토글
- `/privacy`, `/terms`

### 관리자 `/admin` (인증)
대시보드 · 포트폴리오 · 문의함 · FAQ · 용어사전 · 블로그 · 제작가이드 · 언어 콘텐츠 · 사이트 설정 (전부 추가/수정/삭제)

---

## 3. 포트폴리오 필터 분류 (노션 확정/초안)

| 필터 | 값 |
|------|-----|
| **사용 분야** | 식품 / 디저트·카페 / 제약 / 화장품 / 생활·소품 |
| **재질(지류)** | 비도공지 / 도공지 / 크라프트지 / 특수지 / 친환경지 |
| **패키지 종류** | 단상자(종이) / 싸바리상자 / 골판지상자 / 커스텀 형태 / 쇼핑백 / 기타(스티커 등) |
| **패키지 형태** | 박스마스터 리스트 기준, '싸바리 서랍' 제외 + **비닐백(HD BAG)·스티커/데코 추가** |
| **인쇄 방식** | (확정 전 — 추후 값 전달) |

- **목록**: 사진 1컷만, 하단 설명 없음. **마우스 호버 시 간략 정보**. 품번/이름 검색.
- **상세(팝업)**: 좌측 스펙 **테이블** [품번 / 종류 / 형태 / 장폭고(L×W×H) / 지류 / 인쇄 / 코팅 / 후가공] + 우측 이미지. **[견적문의] 클릭 → 폼으로 이동, 유입 제품(품번) 자동 표기.**

---

## 4. 데이터 모델 (Postgres 초안)

```
portfolio    id, item_no, name_en, name_kr,
             use_field, material, package_type, package_form, printing,
             coating, finishing,
             dim_l, dim_w, dim_h,          -- 장폭고
             hover_en, hover_kr,            -- 호버 간략정보
             thumbnail, images[], created_at

inquiry      id, type(standard|recommended), company, contact_name, email,
             phone, product, quantity,
             source_item_no,               -- 포트폴리오 유입 제품 자동표기
             box_structure, material, printing, finishing, size,
             ref_link, files[], message, status(new|reviewing|quoted), created_at

faq          id, category, q_en, q_kr, a_en, a_kr, image, order
glossary     id, category(인쇄|판지|지기구조|후가공|포장재), term_en, term_kr,
             desc_en, desc_kr, tags[], images[], related_portfolio_ids[]
blog         id, slug, category, title_en, title_kr, summary_en, summary_kr,
             body_en, body_kr, cover, published_at
guide_section id, key, title_en, title_kr, order
guide_item   id, section_id, title_en, title_kr, desc_en, desc_kr, tip_en, tip_kr, images[]
site_settings site_name, ceo_en/kr, email, phone, whatsapp, biz_no,
             address_en/kr, instagram, blog_url, default_lang
admin_user   (Supabase Auth)
```

---

## 5. 핵심 구현 포인트

- **견적 버튼 상시 노출**: 헤더 고정 + 모바일 하단 sticky CTA. 모든 페이지에서 1클릭 도달.
- **포트폴리오 필터**: 전체 로드 후 클라이언트 다중 필터 + 검색, URL 쿼리 동기화(공유). 상세는 모달, 직접 URL(`/portfolio/[id]`)도 지원.
- **견적문의 폼(핵심 UX)**: 표준 ↔ 추천 전환. 상단 **"모든 항목 추천받기"** 토글. 옵션은 **사진 카드 선택형**, 각 항목 **? 툴팁(텍스트+사진)** 으로 생소한 용어 설명. 포트폴리오 유입 시 제품 자동 채움. 제출 → DB + Resend 메일. 결제(PayPal)·배송(FOB 등) 안내 포함.
- **다국어**: UI=next-intl, 콘텐츠=DB EN/KR. 헤더 토글 즉시 전환, 누락 영문 폴백 + 관리자 "Missing" 표기.
- **회사명 최소화**: 본문 카피 전수 점검해 실명 대신 we/us. 사이트설정의 회사명은 푸터/사업자정보 등 법적 필요 위치에만.
- **용어사전 ↔ 포트폴리오 연결**: 상세 하단 관련 포트폴리오 카드.
- **블로그 상세**: 본문 텍스트+이미지, 좌측 목차(TOC) 앵커 이동.
- **SEO**: 영문 메인, hreflang(en/ko), 메타·OG·사이트맵. **반응형**(모바일 햄버거 + sticky CTA).

---

## 6. 단계별 일정

1. **P0 기반** — 셋업, 디자인 토큰(브랜드컬러 교체 대비), 레이아웃/헤더/푸터/sticky CTA, 다국어 골격, Supabase 연결
2. **P1 공개 페이지** — 홈/About/Guide/FAQ/Glossary/Blog (더미→실데이터)
3. **P2 포트폴리오 + 필터 + 상세 모달**
4. **P3 견적문의** — 표준/추천·추천토글·? 툴팁·자동 유입표기·접수메일
5. **P4 관리자 CMS** — 인증 + 9개 관리 화면 CRUD + 이미지 업로드
6. **P5 마감** — 실콘텐츠 입력, SEO, 반응형 QA, 배포, 인수인계 문서

---

## 7. 착수 전 필요한 것

1. **브랜드 컬러** (착수 전 전달 예정 — 받는 즉시 토큰 교체)
2. **인쇄 방식 필터 값** 확정 리스트
3. **포트폴리오 데이터**: 품번 + EN/KR 이름·호버문구 + 분류(분야/재질/종류/형태/인쇄/코팅/후가공) + 장폭고 + 이미지 (스프레드시트 + 이미지 폴더 권장)
4. **FAQ / 용어 / 블로그 / 가이드** EN·KR 텍스트 + 이미지 (FAQ 카테고리: 디자인·구조 / 견적·가격 / 제작·절차 / 최소수량·샘플 / 결제·계약 / 배송·물류 / 사후관리 / 기타)
5. **회사 정보 확정값**: 주소/사업자번호/연락처/이메일/WhatsApp/인스타·블로그 URL/로고 파일
6. **계정**: Vercel·Supabase·Resend 소유 주체, 관리자 이메일, boxdle.com 도메인 관리 권한

> 자료를 `Desktop/erum/assets/` 에 넣어 주시거나 링크로 주시면 P0부터 착수합니다.
> (현 시점 진행 가능: 브랜드컬러·인쇄필터값 없이도 시안 오렌지/더미값으로 P0~P3 골격 선제작 가능)

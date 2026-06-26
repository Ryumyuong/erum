/**
 * Static site config.
 *
 * NOTE: contact details are placeholders from the design mockup. Once the
 * admin "Site Settings" / DB is wired up (P4/P5), these become the fallback
 * defaults and live values are read from `site_settings`.
 */

export type NavKey =
  | "about"
  | "portfolio"
  | "guide"
  | "faq"
  | "glossary"
  | "blog";

export const navItems: { key: NavKey; href: string }[] = [
  { key: "about", href: "/about" },
  { key: "portfolio", href: "/portfolio" },
  { key: "guide", href: "/guide" },
  { key: "faq", href: "/faq" },
  { key: "glossary", href: "/glossary" },
  { key: "blog", href: "/blog" },
];

export const QUOTE_HREF = "/quote";

export const siteContact = {
  email: "info@boxdle.com",
  phone: "+82-51-507-9090",
  whatsapp: "+82-10-XXXX-XXXX",
  bizNo: "452-20-01402",
  addressEn: "A-1F, 66 Jangpyeong-ro, Saha-gu, Busan, Republic of Korea",
  addressKo: "부산광역시 사하구 장평로 66 A동 1층",
  ceoEn: "Jaehyun Bae",
  ceoKo: "배재현",
  companyEn: "iiroom d&p",
  companyKo: "이룸디앤피",
  instagram: "https://instagram.com/",
  blog: "https://blog.naver.com/",
};

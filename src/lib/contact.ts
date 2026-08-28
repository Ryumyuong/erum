import { cache } from "react";
import { siteContact } from "@/lib/site";
import { getSiteSettings } from "@/lib/db/queries";

export type Contact = {
  siteName: string;
  email: string;
  phone: string;
  /** KakaoTalk channel URL — replaced WhatsApp as the chat contact. */
  kakao: string;
  bizNo: string;
  addressEn: string;
  addressKo: string;
  companyEn: string;
  companyKo: string;
  ceoEn: string;
  ceoKo: string;
  instagram: string;
  /** 거래처 logo wall image; empty falls back to the built-in grid. */
  clientsImage: string;
  clientsImageMobile: string;
  blog: string;
};

/**
 * Live contact/company info: admin "Site Settings" (DB) with the static
 * placeholders in site.ts as fallback for any empty field. Cached per request
 * so multiple consumers (footer, CTA, about) share one DB read.
 */
export const getContact = cache(async (): Promise<Contact> => {
  const s = await getSiteSettings();
  const v = (value: string | null | undefined, fallback: string) =>
    value && value.trim() ? value : fallback;
  return {
    siteName: v(s?.siteName, "BOXDLE"),
    email: v(s?.email, siteContact.email),
    phone: v(s?.phone, siteContact.phone),
    kakao: v(s?.kakaoUrl, siteContact.kakao),
    bizNo: v(s?.bizNo, siteContact.bizNo),
    addressEn: v(s?.addressEn, siteContact.addressEn),
    addressKo: v(s?.addressKo, siteContact.addressKo),
    companyEn: v(s?.companyEn, siteContact.companyEn),
    companyKo: v(s?.companyKo, siteContact.companyKo),
    ceoEn: v(s?.ceoEn, siteContact.ceoEn),
    ceoKo: v(s?.ceoKo, siteContact.ceoKo),
    instagram: v(s?.instagram, siteContact.instagram),
    clientsImage: s?.clientsImage ?? "",
    clientsImageMobile: s?.clientsImageMobile ?? "",
    blog: v(s?.blogUrl, siteContact.blog),
  };
});

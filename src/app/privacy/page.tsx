import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getLocale } from "next-intl/server";
import { LegalDoc } from "@/components/LegalDoc";
import { getContact } from "@/lib/contact";
import { privacyText } from "@/lib/data/legal";

export const dynamic = "force-dynamic";


export async function generateMetadata(): Promise<Metadata> {
  const ko = (await getLocale()) === "ko";
  return pageMeta({
    title: ko ? "개인정보처리방침" : "Privacy Policy",
    description: ko ? "BOXDLE이 수집하는 개인정보의 항목과 이용 목적, 보관 기간을 안내합니다." : "How BOXDLE collects, uses and retains personal information.",
    path: "/privacy",
  });
}

export default async function PrivacyPage() {
  const [contact, locale] = await Promise.all([getContact(), getLocale()]);
  const ko = locale === "ko";
  const title = ko ? "개인정보처리방침" : "Privacy Policy";
  const effectiveDate = ko ? "2026년 6월 29일" : "June 29, 2026";
  const company = ko ? contact.companyKo : contact.companyEn;
  return (
    <LegalDoc
      title={title}
      text={privacyText(company, contact.email, contact.phone, effectiveDate, locale)}
    />
  );
}

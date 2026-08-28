import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getLocale } from "next-intl/server";
import { LegalDoc } from "@/components/LegalDoc";
import { getContact } from "@/lib/contact";
import { termsText } from "@/lib/data/legal";

export const dynamic = "force-dynamic";


export async function generateMetadata(): Promise<Metadata> {
  const ko = (await getLocale()) === "ko";
  return pageMeta({
    title: ko ? "이용약관" : "Terms of Service",
    description: ko ? "BOXDLE 웹사이트 이용에 관한 약관입니다." : "Terms governing the use of the BOXDLE website.",
    path: "/terms",
  });
}

export default async function TermsPage() {
  const [contact, locale] = await Promise.all([getContact(), getLocale()]);
  const ko = locale === "ko";
  const title = ko ? "이용약관" : "Terms of Service";
  const effectiveDate = ko ? "2026년 6월 29일" : "June 29, 2026";
  return (
    <LegalDoc title={title} text={termsText(contact.siteName, effectiveDate, locale)} />
  );
}

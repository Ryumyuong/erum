import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { FaqList } from "@/components/faq/FaqList";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { pick } from "@/lib/content";
import { getFaqItems, getFaqCategories } from "@/lib/db/queries";


export async function generateMetadata(): Promise<Metadata> {
  const ko = (await getLocale()) === "ko";
  return pageMeta({
    title: ko ? "자주 묻는 질문" : "Frequently Asked Questions",
    description: ko ? "최소 주문 수량, 제작 기간, 배송, 샘플, 불량 처리 등 맞춤 패키지 제작에 대해 자주 묻는 질문을 모았습니다." : "Minimum order quantity, lead time, shipping, samples and quality — common questions about custom packaging.",
    path: "/faq",
  });
}

export default async function FaqPage() {
  const t = await getTranslations("page.faq");
  const locale = await getLocale();
  const [items, categories] = await Promise.all([
    getFaqItems(),
    getFaqCategories(),
  ]);

  // FAQPage schema — the question/answer pairs in the locale being served.
  // Entries missing either side are dropped; an incomplete pair invalidates
  // the whole block for validators.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items
      .map((item) => ({
        q: pick(item.q, locale).trim(),
        a: pick(item.a, locale).trim(),
      }))
      .filter(({ q, a }) => q && a)
      .map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
  };

  return (
    <>
      {faqSchema.mainEntity.length > 0 && <JsonLd data={faqSchema} />}
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        subtitleSize="text-[min(4.13vw,17px)] max-[500px]:text-[min(3.4vw,14.28px)] desktop:text-[1rem]"
      />
      <FaqList items={items} categories={categories} />

      {/* CTA band (shared, same as home) */}
      <CtaBand />
    </>
  );
}

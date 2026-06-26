import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { FaqList } from "@/components/faq/FaqList";
import { QUOTE_HREF, siteContact } from "@/lib/site";
import { getFaqItems } from "@/lib/db/queries";

export default async function FaqPage() {
  const t = await getTranslations("page.faq");
  const items = await getFaqItems();

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <FaqList items={items} />

      {/* CTA band */}
      <section className="mt-16 bg-cream">
        <div className="container-page flex flex-col items-center gap-6 py-16 text-center">
          <h2 className="max-w-2xl text-2xl font-bold md:text-3xl">
            {t("ctaHeading")}
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={QUOTE_HREF}
              className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              {t("ctaQuote")}
            </Link>
            <a
              href={`https://wa.me/${siteContact.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink"
            >
              {t("ctaWhatsapp")}
            </a>
            <a
              href={`mailto:${siteContact.email}`}
              className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy"
            >
              {t("ctaEmail")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

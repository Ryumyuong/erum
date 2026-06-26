import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { PortfolioBrowser } from "@/components/portfolio/PortfolioBrowser";
import { ArrowRightIcon } from "@/components/icons";
import { QUOTE_HREF } from "@/lib/site";
import { getPortfolio } from "@/lib/db/queries";

export default async function PortfolioPage() {
  const t = await getTranslations("page.portfolio");
  const items = await getPortfolio();

  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <Suspense>
        <PortfolioBrowser items={items} />
      </Suspense>

      {/* CTA band */}
      <section className="mt-16 bg-cream">
        <div className="container-page flex flex-col items-center gap-5 py-16 text-center">
          <h2 className="max-w-2xl text-2xl font-bold md:text-3xl">
            {t("ctaHeading")}
          </h2>
          <p className="max-w-xl text-sm text-muted">{t("ctaDesc")}</p>
          <Link
            href={QUOTE_HREF}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {t("ctaButton")}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

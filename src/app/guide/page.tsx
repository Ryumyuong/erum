import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Thumb } from "@/components/ui/Thumb";
import { ArrowRightIcon } from "@/components/icons";
import { pick } from "@/lib/content";
import { QUOTE_HREF } from "@/lib/site";
import { getGuideSections } from "@/lib/db/queries";

export default async function GuidePage() {
  const t = await getTranslations("page.guide");
  const locale = await getLocale();
  const guideSections = await getGuideSections();

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="container-page grid gap-10 pb-12 lg:grid-cols-[200px_1fr]">
        {/* In-page nav */}
        <nav className="hidden lg:block">
          <ul className="sticky top-[calc(var(--spacing-header)+1.5rem)] space-y-1">
            {guideSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-cream hover:text-ink"
                >
                  {pick(section.title, locale)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sections */}
        <div className="space-y-16">
          {guideSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="mb-6 border-b border-line pb-3 text-xl font-bold md:text-2xl">
                {pick(section.title, locale)}
              </h2>
              <div className="grid gap-8 sm:grid-cols-2">
                {section.items.map((item, i) => (
                  <article key={i}>
                    <Thumb tone={item.tone} ratio="video" />
                    <div className="mt-3 flex items-baseline gap-2">
                      <h3 className="font-semibold">{pick(item.title, locale)}</h3>
                      {item.subtitle && (
                        <span className="text-xs text-brand">{item.subtitle}</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {pick(item.desc, locale)}
                    </p>
                    {item.tip && (
                      <p className="mt-2 text-sm font-medium text-violet-600">
                        {pick(item.tip, locale)}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Help CTA */}
      <section className="bg-cream">
        <div className="container-page flex flex-col items-center gap-4 py-16 text-center">
          <h2 className="text-2xl font-bold">{t("helpTitle")}</h2>
          <p className="max-w-xl text-sm text-muted">{t("helpDesc")}</p>
          <Link
            href={QUOTE_HREF}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {t("helpCta")}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

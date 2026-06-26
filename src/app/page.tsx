import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { QuoteButton } from "@/components/QuoteButton";
import { PortfolioCard } from "@/components/PortfolioCard";
import { whyIcons, ArrowRightIcon } from "@/components/icons";
import { pick } from "@/lib/content";
import { QUOTE_HREF } from "@/lib/site";
import { getPortfolio } from "@/lib/db/queries";
import { whyUs, processSteps, solutionCards } from "@/lib/data/home";

export default async function HomePage() {
  const t = await getTranslations("home");
  const locale = await getLocale();
  const preview = (await getPortfolio()).slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-navy to-black opacity-95" />
        <div className="container-page relative flex min-h-[62vh] flex-col justify-end gap-6 py-24 md:min-h-[74vh]">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-xl text-base text-gray-300 md:text-lg">
            {t("heroSubtitle")}
          </p>
          <div>
            <QuoteButton />
          </div>
        </div>
      </section>

      {/* Portfolio preview */}
      <section className="bg-white">
        <div className="container-page py-16 md:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold md:text-3xl">
              {t("portfolioHeading")}
            </h2>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark"
            >
              {t("portfolioViewAll")}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {preview.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-cream">
        <div className="container-page py-16 md:py-20">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">
            {t("whyHeading")}
          </h2>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {whyUs.map((item) => {
              const Icon = whyIcons[item.icon];
              return (
                <div
                  key={item.icon}
                  className="flex gap-4 border-b border-line/70 pb-7"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                  </span>
                  <div>
                    <h3 className="font-semibold">{pick(item.title, locale)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {pick(item.desc, locale)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white">
        <div className="container-page py-16 md:py-20">
          <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">
              {t("processHeading")}
            </h2>
            <p className="text-sm text-muted">{t("processSubtitle")}</p>
          </div>
          <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {processSteps.map((step) => (
              <li
                key={step.step}
                className="rounded-[var(--radius-card)] border border-line bg-white p-5 text-center"
              >
                <span className="text-xs font-bold tracking-wide text-brand">
                  STEP {step.step}
                </span>
                <p className="mt-2 text-sm font-semibold">
                  {pick(step.title, locale)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Solution (dark band) */}
      <section className="bg-navy text-white">
        <div className="container-page py-16 md:py-20">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl">
            {t("solutionHeading")}
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {solutionCards.map((card) => (
              <div
                key={card.title.en}
                className="flex flex-col rounded-[var(--radius-card)] bg-white/5 p-6 ring-1 ring-white/10"
              >
                <h3 className="text-lg font-semibold">{pick(card.title, locale)}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-300">
                  {pick(card.desc, locale)}
                </p>
                <Link
                  href={QUOTE_HREF}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-white"
                >
                  {pick(card.cta, locale)}
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide + FAQ cards */}
      <section className="bg-white">
        <div className="container-page grid gap-5 py-16 md:grid-cols-2 md:py-20">
          <InfoCard
            href="/guide"
            title={t("guideCardTitle")}
            desc={t("guideCardDesc")}
          />
          <InfoCard href="/faq" title={t("faqCardTitle")} desc={t("faqCardDesc")} />
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-cream">
        <div className="container-page flex flex-col items-center gap-6 py-20 text-center">
          <h2 className="max-w-2xl text-2xl font-bold md:text-3xl">
            {t("ctaHeading")}
          </h2>
          <Link
            href={QUOTE_HREF}
            className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {t("heroCta")}
          </Link>
        </div>
      </section>
    </>
  );
}

function InfoCard({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[var(--radius-card)] border border-line bg-cream p-8 transition-colors hover:border-brand"
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand">
        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

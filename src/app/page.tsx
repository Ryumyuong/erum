import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { SolutionCarousel } from "@/components/home/SolutionCarousel";
import { PortfolioCard } from "@/components/PortfolioCard";
import { CtaBand } from "@/components/CtaBand";
import Image from "next/image";
import { pick } from "@/lib/content";
import { QUOTE_HREF } from "@/lib/site";
import { getPortfolio, getSiteSettings } from "@/lib/db/queries";
import { whyUs, solutionCards, heroSlides } from "@/lib/data/home";


/** Home keeps the site-level title; only the canonical needs declaring. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const t = await getTranslations("home");
  const locale = await getLocale();
  const settings = await getSiteSettings();
  const all = await getPortfolio();

  // Hero slides: admin-uploaded images (home_hero) win; else the built-in set.
  const heroImages = settings?.homeHero ?? [];
  const slides = heroImages.length
    ? heroImages.map((image) => ({ tone: "from-stone-200 to-stone-100", image }))
    : heroSlides;

  // Home portfolio preview: admin-picked items (home_featured), in order; else first 9.
  const featured = settings?.homeFeatured ?? [];
  const preview = featured.length
    ? featured
        .map((no) => all.find((p) => p.itemNo === no))
        .filter((p): p is (typeof all)[number] => Boolean(p))
        .slice(0, 9)
    : all.slice(0, 9);

  return (
    <>
      {/* Hero */}
      <HeroCarousel slides={slides} />

      {/* Portfolio preview */}
      <section className="bg-white">
        <div className="container-page pt-24 pb-24 desktop:pt-64 desktop:pb-32">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] font-bold text-black desktop:text-[2.5rem]">
              {t("portfolioHeading")}
            </h2>
            <Link
              href="/portfolio"
              className="inline-flex shrink-0 items-center gap-1 text-[min(4.13vw,17px)] desktop:text-[1.25rem] font-semibold text-brand hover:text-brand-dark"
            >
              {t("portfolioViewAll")}
              <span aria-hidden>{">"}</span>
            </Link>
          </div>
          {/* The first project leads: full width on mobile, a 2×2 block on
              desktop with the next two stacked beside it. Items 8-9 would leave
              a ragged last row on the 2-column phone grid, so they are desktop
              only. */}
          <div className="grid grid-cols-2 gap-5 desktop:grid-cols-3 desktop:gap-6">
            {preview.map((item, i) =>
              i === 0 ? (
                <div key={item.id} className="col-span-2 desktop:row-span-2">
                  <PortfolioCard item={item} feature />
                </div>
              ) : i >= 7 ? (
                <div key={item.id} className="hidden desktop:contents">
                  <PortfolioCard item={item} />
                </div>
              ) : (
                <PortfolioCard key={item.id} item={item} />
              ),
            )}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-white">
        <div className="container-page py-24 desktop:py-32">
          <h2 className="text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.5rem] font-bold text-black">{t("whyHeading")}</h2>
          <div className="mt-7 grid border-y-[3px] border-black desktop:grid-cols-2">
            {whyUs.map((item) => (
              <div
                key={item.icon}
                className="flex items-start gap-4 max-[500px]:gap-5 border-b border-black/30 py-6 desktop:gap-16 desktop:py-20 desktop:odd:border-r desktop:odd:pl-10 desktop:odd:pr-10 desktop:even:pl-10 desktop:even:pr-10"
              >
                <div className="flex w-1/3 shrink-0 justify-center max-[500px]:w-auto desktop:w-auto">
                  <Image
                    src={`/icons/why/${item.icon}.png`}
                    alt=""
                    width={206}
                    height={206}
                    className="h-28 w-28 max-[500px]:h-20 max-[500px]:w-20 shrink-0"
                  />
                </div>
                <div>
                  <h3 className="text-[min(5.34vw,22px)] max-[500px]:text-[min(4.248vw,17.84px)] desktop:text-[1.625rem] font-bold text-black">
                    {pick(item.title, locale)}
                  </h3>
                  <p className="mt-1.5 text-[min(3.64vw,15px)] max-[500px]:text-[min(2.913vw,12.23px)] desktop:text-[1.125rem] font-medium leading-relaxed text-black/70">
                    {pick(item.desc, locale)
                      .split("|")
                      .map((line, i, arr) => (
                        <Fragment key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </Fragment>
                      ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white">
        <div className="container-page pt-12 pb-28 desktop:pt-16 desktop:pb-36">
          <div className="mb-14 flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:justify-between">
            <h2 className="text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.5rem] font-bold text-black">
              {t("processHeading")}
            </h2>
            <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-6">
              <p className="text-[min(4.61vw,19px)] max-[500px]:text-[min(3.883vw,16.3px)] desktop:text-[1.375rem] leading-snug text-[#101828]">
                <span className="font-bold">{t("processQuestion")}</span>{" "}
                <br className="desktop:hidden" />
                <span className="font-medium">{t("processAnswer")}</span>
              </p>
              <Link
                href={QUOTE_HREF}
                className="inline-flex w-fit shrink-0 items-center gap-1 border-b border-brand pb-0.5 text-[min(4.13vw,17px)] max-[500px]:text-[min(3.4vw,14.28px)] desktop:text-[1.25rem] font-semibold text-brand"
              >
                {t("processExpertCta")}
                <span aria-hidden>{">"}</span>
              </Link>
            </div>
          </div>
          {/* Process steps — supplied designed images (Korean / English).
              Wide horizontal on desktop; vertical 2×3 grid on mobile. */}
          <Image
            src={
              locale === "ko"
                ? "/icons/process-steps.png"
                : "/icons/process-steps-en.png"
            }
            alt={t("processHeading")}
            width={1300}
            height={328}
            className="mx-auto hidden h-auto w-full max-w-[1300px] desktop:block"
          />
          <Image
            src={
              locale === "ko"
                ? "/icons/process-steps-mobile.png"
                : "/icons/process-steps-mobile-en.png"
            }
            alt={t("processHeading")}
            width={1044}
            height={1617}
            className="mx-auto h-auto w-full max-w-[480px] desktop:hidden"
          />
        </div>
      </section>

      {/* Solution */}
      <section className="relative bg-white">
        {/* Navy background — fills the whole section (full width, down past the cards) */}
        <div className="absolute inset-0 bg-[#1E2939]" />
        {/* Mobile — centered heading + full-bleed auto carousel (no side padding) */}
        <div className="relative pb-20 pt-16 desktop:hidden">
          <div className="text-center leading-[1.15] text-white">
            <p className="text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] font-medium">
              {t("solutionLabel")}
            </p>
            <p className="text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] font-black">SOLUTION</p>
          </div>
          <div className="mt-8">
            <SolutionCarousel cards={solutionCards} />
          </div>
        </div>
        {/* Desktop — existing static grid */}
        <div className="container-page relative hidden pb-40 pt-32 desktop:block">
          <div
            className={`flex flex-col gap-10 desktop:flex-row desktop:items-start ${
              locale === "ko" ? "desktop:gap-[11.6875rem]" : "desktop:gap-[3.1rem]"
            }`}
          >
            {/* Heading */}
            <div className="shrink-0 leading-[1.15] text-white">
              <p className="text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.5rem] font-medium">{t("solutionLabel")}</p>
              <p className="text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.5rem] font-black">SOLUTION</p>
            </div>

            {/* Cards */}
            <div className="grid flex-1 grid-cols-1 gap-8 desktop:grid-cols-3">
              {solutionCards.map((card) => (
                <div
                  key={card.title.en}
                  className="flex h-full flex-col overflow-hidden rounded-[0.625rem] bg-white"
                >
                  <div className="flex min-h-[14rem] flex-1 flex-col px-5 pb-10 pt-10 tracking-[-1px]">
                    <h3 className="text-[min(4.85vw,20px)] max-[500px]:text-[min(4.126vw,17.33px)] desktop:text-[1.5rem] font-bold leading-snug text-[#101828]">
                      {pick(card.title, locale)
                        .split("|")
                        .map((line, i, arr) => (
                          <Fragment key={i}>
                            {line}
                            {i < arr.length - 1 && <br />}
                          </Fragment>
                        ))}
                    </h3>
                    <p className="mt-1.5 text-[min(2.91vw,12px)] desktop:text-[0.875rem] leading-[1.1875rem] text-black/60">
                      {pick(card.desc, locale)
                        .split("|")
                        .map((line, i, arr) => (
                          <Fragment key={i}>
                            {line}
                            {i < arr.length - 1 && <br />}
                          </Fragment>
                        ))}
                    </p>
                    <Link
                      href={QUOTE_HREF}
                      className="mt-auto inline-flex w-fit items-center gap-1 border-b border-[#FF7200] pb-0.5 text-[min(2.91vw,12px)] desktop:text-[0.875rem] font-medium text-[#FF7200]"
                    >
                      {pick(card.cta, locale)}
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                  <div className="relative aspect-[284/198] w-full shrink-0">
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      sizes="284px"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guide + FAQ cards */}
      <section className="bg-white">
        <div className="container-page grid grid-cols-1 gap-[1.625rem] pb-4 pt-40 desktop:grid-cols-2 desktop:pb-6 desktop:pt-48">
          <InfoCard
            href="/guide"
            image="/icons/guide-card.png"
            imageClassName="h-[4.25rem] w-auto"
            title={t("guideCardTitle")}
            desc={t("guideCardDesc")}
            cta={t("guideCardCta")}
          />
          <InfoCard
            href="/faq"
            image="/icons/faq-card.png"
            title={t("faqCardTitle")}
            desc={t("faqCardDesc")}
            cta={t("faqCardCta")}
          />
        </div>
      </section>

      {/* CTA band (shared) */}
      <CtaBand />
    </>
  );
}

function InfoCard({
  href,
  image,
  imageClassName = "h-20 w-auto",
  title,
  desc,
  cta,
}: {
  href: string;
  image: string;
  imageClassName?: string;
  title: string;
  desc: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex aspect-[639/429] flex-col items-center justify-center rounded-[0.625rem] bg-[#FCF8F6] p-10 text-center"
    >
      <Image src={image} alt="" width={166} height={142} className={imageClassName} />
      <h3 className="mt-4 text-[min(6.55vw,27px)] max-[500px]:text-[min(5.34vw,22.4px)] desktop:text-[2rem] font-bold text-black">{title}</h3>
      <span className="mt-4 block h-px w-10 bg-black/20" />
      <p className="mx-auto mt-4 max-w-[28.75rem] text-[min(4.13vw,17px)] max-[500px]:text-[min(3.155vw,13.25px)] desktop:text-[1.25rem] leading-relaxed text-black/70">
        {desc.split("|").map((line, i, arr) => (
          <Fragment key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </Fragment>
        ))}
      </p>
      <span className="mt-6 inline-flex w-fit items-center gap-1 border-b border-[#FF7200] pb-0.5 text-[min(2.91vw,12px)] desktop:text-[0.875rem] font-medium text-[#FF7200]">
        {cta}
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}


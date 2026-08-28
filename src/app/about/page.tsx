import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { GalleryCarousel } from "@/components/about/GalleryCarousel";
import { SystemCarousel } from "@/components/about/SystemCarousel";
import { pick } from "@/lib/content";
import { whyUs } from "@/lib/data/home";
import { coreValues, systemSteps, clients } from "@/lib/data/about";
import { QUOTE_HREF } from "@/lib/site";
import { getContact } from "@/lib/contact";
import { getAboutGallery } from "@/lib/db/queries";


export async function generateMetadata(): Promise<Metadata> {
  const ko = (await getLocale()) === "ko";
  return pageMeta({
    title: ko ? "회사소개 — 1984년부터 이어온 패키지 제작" : "About — Packaging expertise since 1984",
    description: ko ? "1984년 작은 인쇄소로 시작해 미국 전역의 베이커리·카페·식품 브랜드와 함께해온 BOXDLE의 이야기와 공장·장비를 소개합니다." : "From a small print shop in 1984 to a trusted packaging partner for bakery, cafe and food brands across the U.S.",
    path: "/about",
  });
}

export default async function AboutPage() {
  const t = await getTranslations("page.about");
  const tc = await getTranslations("home");
  const locale = await getLocale();
  const contact = await getContact();
  const gallery = await getAboutGallery();

  return (
    <>
      {/* Intro */}
      <section className="container-page pt-44 pb-24 text-center desktop:pt-56 desktop:pb-32">
        <h1 className="mx-auto max-w-3xl text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.25rem] font-black text-black">
          {highlightYear(t("title"))}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[min(4.85vw,20px)] max-[500px]:text-[min(4.85vw,18px)] desktop:text-[1.25rem] leading-relaxed text-black">
          {t("subtitle")
            .split("|")
            .map((line, i, arr) => (
              <Fragment key={i}>
                {line}
                {i < arr.length - 1 && (
                  <>
                    <br className="desktop:hidden" />
                    <span className="hidden desktop:inline"> </span>
                  </>
                )}
              </Fragment>
            ))}
        </p>
        <div className="mt-10">
          {/* Desktop: wide press banner; mobile: printing-press photo */}
          <Image
            src="/about/press.png"
            alt=""
            width={2600}
            height={766}
            priority
            className="hidden w-full rounded-[0.625rem] desktop:block"
          />
          <Image
            src="/about/press-mobile.png"
            alt=""
            width={1044}
            height={624}
            priority
            className="w-full rounded-[0.625rem] desktop:hidden"
          />
        </div>
      </section>

      {/* Core values */}
      <section className="container-page pt-4 pb-20 desktop:pt-6 desktop:pb-28">
        <h2 className="mb-16 text-center text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.25rem] font-bold text-[#101828]">
          {t("coreValues")}
        </h2>
        <div className="grid grid-cols-3 desktop:divide-x desktop:divide-black/20">
          {coreValues.map((value) => (
            <div
              key={value.icon}
              className="flex flex-col items-center px-2 py-4 text-center desktop:px-6"
            >
              <Image
                src={`/about/core-${value.icon}.png`}
                alt=""
                width={160}
                height={173}
                className="h-14 w-auto desktop:h-20"
              />
              <h3 className="mt-3 text-[min(5.58vw,23px)] max-[500px]:text-[min(4.369vw,18.35px)] desktop:mt-6 desktop:text-[1.875rem] font-bold text-black">
                {pick(value.title, locale)}
              </h3>
              <p className="mt-2 text-[min(3.64vw,15px)] max-[500px]:text-[min(2.913vw,12.23px)] desktop:mt-3 desktop:text-[1.125rem] leading-relaxed text-[#4A5565]">
                {pick(value.desc, locale)
                  .split("|")
                  .map((line, i, arr) => (
                    <Fragment key={i}>
                      {line}
                      {i < arr.length - 1 && (
                  <>
                    <br className="desktop:hidden" />
                    <span className="hidden desktop:inline"> </span>
                  </>
                )}
                    </Fragment>
                  ))}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our story */}
      <section className="container-page pt-24 pb-20 desktop:pt-32 desktop:pb-28">
        <div className="grid gap-6 text-center desktop:grid-cols-[180px_1fr] desktop:items-start desktop:gap-12 desktop:text-left">
          <h2 className="text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.25rem] font-bold leading-snug text-[#101828]">
            {t("story")}
          </h2>
          <div className="w-full space-y-4 desktop:space-y-2">
            {t("storyBody")
              .split("||")
              .map((para, i) => (
                <p key={i} className="text-[min(4.13vw,17px)] desktop:text-[1.125rem] leading-relaxed text-black/70">
                  {para.split("|").map((line, j, arr) => (
                    <Fragment key={j}>
                      {line}
                      {j < arr.length - 1 && (
                  <>
                    <br className="desktop:hidden" />
                    <span className="hidden desktop:inline"> </span>
                  </>
                )}
                    </Fragment>
                  ))}
                </p>
              ))}
          </div>
        </div>
        <div className="mt-12 grid items-end gap-5 desktop:grid-cols-2">
          <Image
            src="/about/story-left.png"
            alt=""
            width={1346}
            height={814}
            className="w-full rounded-[0.625rem] shadow-xl"
          />
          <Image
            src="/about/story-2.png"
            alt=""
            width={1186}
            height={1066}
            className="hidden w-full rounded-[0.625rem] shadow-xl desktop:block"
          />
        </div>
      </section>

      {/* Our strengths */}
      <section className="bg-white">
        <div className="container-page py-24 desktop:py-32">
          <h2 className="mb-12 text-center text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.25rem] font-bold text-[#101828]">
            {t("strengths")}
          </h2>
          <div className="grid gap-5 desktop:grid-cols-2">
            {whyUs.map((item) => (
              <div
                key={item.icon}
                className="flex items-center gap-6 max-[500px]:gap-5 rounded-[0.625rem] border border-[#DDDDDD] bg-white px-12 max-[500px]:px-5 py-5 desktop:gap-20"
              >
                <Image
                  src={`/icons/why/${item.icon}.png`}
                  alt=""
                  width={96}
                  height={96}
                  className="h-24 w-24 max-[500px]:h-[4.375rem] max-[500px]:w-[4.375rem] shrink-0 object-contain"
                />
                <div>
                  <h3 className="text-[min(5.34vw,22px)] max-[500px]:text-[min(4.248vw,17.84px)] desktop:text-[1.5rem] font-bold text-black">
                    {pick(item.title, locale)}
                  </h3>
                  <p className="text-[min(3.64vw,15px)] max-[500px]:text-[min(2.913vw,12.23px)] max-[500px]:leading-[1.15rem] desktop:text-[1.125rem] font-medium leading-[1.4375rem] text-black/70">
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

      {/* System */}
      <section className="pt-24 pb-40 desktop:pt-32 desktop:pb-52">
        {/* Mobile — centered heading + auto carousel (30% neighbours, #FF7200 dots) */}
        <div className="desktop:hidden">
          <div className="container-page">
            <h2 className="text-center text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] font-bold text-[#101828]">
              {t("system")}
            </h2>
            <p className="mb-10 mt-3 text-center text-[min(3.64vw,15px)] text-black/60">
              {t("systemSubtitle")}
            </p>
          </div>
          <SystemCarousel
            steps={systemSteps.map((step, i) => ({
              title: step.title,
              desc: step.desc,
              image: `/about/system-${i + 1}.png`,
            }))}
          />
        </div>

        {/* Desktop — static 3-up grid (unchanged) */}
        <div className="container-page hidden desktop:block">
          <h2 className="text-center desktop:text-[2.25rem] font-bold text-[#101828]">
            {t("system")}
          </h2>
          <p className="mb-12 mt-3 text-center desktop:text-[1.125rem] text-black/60">
            {t("systemSubtitle")}
          </p>
          <div className="grid gap-5 desktop:grid-cols-3">
            {systemSteps.map((step, i) => (
              <div
                key={step.title.en}
                className="overflow-hidden rounded-[0.625rem] border border-[#DDDDDD] bg-white"
              >
                <div className="relative aspect-[800/454] w-full">
                  <Image
                    src={`/about/system-${i + 1}.png`}
                    alt=""
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                </div>
                <div className="px-7 py-12 text-left">
                  <h3 className="desktop:text-[1.6125rem] font-bold text-[#101828]">
                    {pick(step.title, locale)}
                  </h3>
                  <p className="mt-2.5 desktop:text-[1.25rem] leading-relaxed text-black/70">
                    {pick(step.desc, locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Factory & equipment gallery — full-bleed to the right, but its left edge
          lines up with the container-page content edge (same as the System section). */}
      {/* Same left/right gutter as every other section — the peeking slides
          crop at the content edge rather than the viewport edge. */}
      <section className="container-page py-20 desktop:py-28">
        <h2 className="mb-10 text-center text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-left desktop:text-[2.25rem] font-bold text-[#101828]">
          {t("gallery")}
        </h2>
        <GalleryCarousel gallerySlides={gallery} />
      </section>

      {/* Clients */}
      <section className="bg-white">
        <div className="container-page py-32 desktop:py-44">
          <h2 className="mb-12 text-center text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.25rem] font-bold text-[#101828]">
            {t("clients")}
          </h2>
          {/* One composed artwork when the admin has uploaded it; the
              per-logo grid stays as the fallback. */}
          {contact.clientsImage ? (
            <>
              <Image
                src={contact.clientsImage}
                alt=""
                width={1600}
                height={900}
                sizes="(min-width: 991px) 1280px, 100vw"
                className={`mx-auto h-auto w-full ${contact.clientsImageMobile ? "hidden desktop:block" : ""}`}
              />
              {contact.clientsImageMobile && (
                <Image
                  src={contact.clientsImageMobile}
                  alt=""
                  width={800}
                  height={1200}
                  sizes="100vw"
                  className="mx-auto h-auto w-full desktop:hidden"
                />
              )}
            </>
          ) : (
            <div className="grid grid-cols-3 gap-5 max-[500px]:grid-cols-2 desktop:grid-cols-4">
              {clients.map((client, i) => (
                <div
                  key={`${client.name}-${i}`}
                  className="flex h-24 items-center justify-center rounded-[0.625rem] border border-[#DDDDDD] max-[500px]:h-32 desktop:h-32"
                >
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={220}
                    height={90}
                    className={`w-auto object-contain ${
                      client.compact
                        ? `${client.box ?? "h-[1.375rem]"} max-w-[75%]`
                        : client.box ?? "max-h-16 max-w-[75%]"
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FCF8F6]">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-10 px-[19.95vw] max-[500px]:px-[13vw] py-24 text-center desktop:px-[9.9375rem] desktop:py-32">
          <h2 className="text-[min(6.8vw,28px)] max-[500px]:text-[min(5.825vw,24.47px)] desktop:text-[2.5rem] font-extrabold text-black">
            {t("startProject")
              .split("|")
              .map((part, i) => (
                <span key={i} className={i > 0 ? "font-medium" : undefined}>
                  {i > 0 ? " " : ""}
                  {part}
                </span>
              ))}
          </h2>
          <div className="grid w-full max-w-6xl gap-4 desktop:grid-cols-3">
            <OutlineCta href={QUOTE_HREF} label={tc("ctaQuote")} />
            <OutlineCta
              href={contact.kakao}
              label={tc("ctaKakao")}
              external
            />
            <OutlineCta
              href={`mailto:${contact.email}`}
              label={tc("ctaEmail")}
              external
            />
          </div>
        </div>
      </section>
    </>
  );
}

/** Wrap the "1984" token in the title with the brand color; `|` = mobile-only break. */
function highlightYear(text: string) {
  return text.split(/(1984년?|\|)/).map((part, i) => {
    if (/^1984년?$/.test(part))
      return (
        <span key={i} className="text-[#FD7304]">
          {part}
        </span>
      );
    if (part === "|") return <br key={i} className="desktop:hidden" />;
    return <span key={i}>{part}</span>;
  });
}

function OutlineCta({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      /* desktop:h-[3.75rem] — shared bottom-CTA height (see CtaBand). */
      className="flex items-center justify-between gap-3 rounded-[0.625rem] bg-white py-7 pl-10 max-[500px]:pl-6 pr-6 text-[min(4.85vw,20px)] max-[500px]:text-[min(4.126vw,17.33px)] font-bold text-black desktop:h-[3.75rem] desktop:py-0 desktop:text-[1.25rem]"
    >
      <span>{label}</span>
      <Image
        src="/icons/cta-arrow.png"
        alt=""
        width={62}
        height={62}
        className="h-9 w-9 shrink-0"
      />
    </Link>
  );
}

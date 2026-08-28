import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getLocale } from "next-intl/server";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { GuideNav } from "@/components/guide/GuideNav";
import { GuideSections } from "@/components/guide/GuideSections";
import { ArrowRightIcon } from "@/components/icons";
import { QUOTE_HREF } from "@/lib/site";
import { getGuideSections } from "@/lib/db/queries";


export async function generateMetadata(): Promise<Metadata> {
  const ko = (await getLocale()) === "ko";
  return pageMeta({
    title: ko ? "제작가이드 — 패키지 종류와 구조 안내" : "Production Guide — Packaging types and structures",
    description: ko ? "패키지 종류, 박스 구조, 지류·재질, 인쇄 방식, 후가공까지 맞춤 패키지 제작에 필요한 기본 지식을 정리했습니다." : "Package types, box structures, paper and materials, printing and finishing — the basics of custom packaging.",
    path: "/guide",
  });
}

export default async function GuidePage() {
  const t = await getTranslations("page.guide");
  const guideSections = await getGuideSections();

  return (
    <>
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        subtitleSize="text-[min(4.13vw,17px)] max-[500px]:text-[min(3.4vw,14.28px)] desktop:text-[1rem]"
      />

      <div className="container-page grid gap-10 pb-32 desktop:grid-cols-[200px_1fr]">
        {/* In-page nav (sticky, scroll-spy) */}
        <GuideNav
          sections={guideSections.map((s) => ({ id: s.id, title: s.title }))}
        />

        {/* Sections — desktop stack + scroll-spy; mobile tabs */}
        <GuideSections sections={guideSections} />
      </div>

      {/* Help CTA */}
      <section>
        <div className="rounded-[var(--radius-card)] bg-[#FCF8F6]">
          <div className="flex flex-col items-center px-[15.29vw] desktop:px-6 py-24 text-center">
          <h2 className="text-[min(6.31vw,26px)] max-[500px]:text-[min(5.34vw,22.4px)] desktop:text-[1.875rem] font-bold text-[#101828]">
            {t("helpTitle")
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
          </h2>
          <p className="mt-6 desktop:mt-3 w-full text-[min(4.37vw,18px)] max-[500px]:text-[min(3.4vw,14.28px)] desktop:text-[1rem] leading-relaxed text-black/70">
            {t("helpDesc")
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
          <div className="mt-10 grid w-full max-w-2xl gap-3 px-[4.854vw] desktop:px-0 desktop:grid-cols-2">
            <Link
              href={QUOTE_HREF}
              className="group flex items-center justify-between gap-3 rounded-xl bg-brand pl-10 pr-10 max-[500px]:pr-5 py-8 max-[500px]:py-3 text-[min(4.85vw,20px)] max-[500px]:text-[min(4.126vw,17.33px)] font-bold text-white transition-colors hover:bg-brand-dark desktop:h-[3.75rem] desktop:px-6 desktop:py-0 desktop:text-[1.25rem]"
            >
              <span>{t("helpCta")}</span>
              <Image
                src="/icons/arrow-orange.png"
                alt=""
                width={28}
                height={28}
                className="h-9 w-9 max-[500px]:h-7 max-[500px]:w-7 desktop:h-7 desktop:w-7 shrink-0 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/faq"
              className="group flex items-center justify-between gap-3 rounded-xl bg-white pl-10 pr-10 max-[500px]:pr-5 py-8 max-[500px]:py-3 text-[min(4.85vw,20px)] max-[500px]:text-[min(4.126vw,17.33px)] font-bold text-black desktop:h-[3.75rem] desktop:px-6 desktop:py-0 desktop:text-[1.25rem]"
            >
              <span>{t("helpFaqCta")}</span>
              <span className="flex h-9 w-9 max-[500px]:h-7 max-[500px]:w-7 desktop:h-7 desktop:w-7 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-transform group-hover:translate-x-0.5">
                <ArrowRightIcon className="h-5 w-5 max-[500px]:h-4 max-[500px]:w-4 desktop:h-4 desktop:w-4" />
              </span>
            </Link>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}

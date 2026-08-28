import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getLocale } from "next-intl/server";
import { Fragment, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PortfolioBrowser } from "@/components/portfolio/PortfolioBrowser";
import { QUOTE_HREF } from "@/lib/site";
import { getPortfolio, getPortfolioFilterGroups } from "@/lib/db/queries";


export async function generateMetadata(): Promise<Metadata> {
  const ko = (await getLocale()) === "ko";
  return pageMeta({
    title: ko ? "포트폴리오 — 박스 종류별 제작 사례" : "Portfolio — Custom packaging references",
    description: ko ? "패키지 종류·구조·재질·인쇄·후가공별로 실제 맞춤제작 사례를 확인하고 비슷한 제품으로 견적을 문의하세요." : "Browse real custom packaging references by type, structure, material, printing and finishing.",
    path: "/portfolio",
  });
}

export default async function PortfolioPage() {
  const t = await getTranslations("page.portfolio");
  const [items, filterGroups] = await Promise.all([
    getPortfolio(),
    getPortfolioFilterGroups(),
  ]);

  return (
    <div>
      <div className="container-page pt-8 desktop:pt-22">
        <h1 className="text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.25rem] font-bold leading-tight text-[#101828]">
          {t("title")
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
        </h1>
        <p className="mt-3 desktop:mt-0 text-[min(4.85vw,20px)] max-[500px]:text-[min(3.4vw,14.28px)] desktop:text-[1rem] leading-snug desktop:leading-relaxed text-black/70">
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
      </div>

      <Suspense>
        <PortfolioBrowser items={items} filterGroups={filterGroups} />
      </Suspense>

      {/* CTA card */}
      <section>
        <div className="bg-[#FCF8F6]">
          <div className="flex flex-col items-center px-[19.95vw] desktop:px-6 py-[19.95vw] desktop:py-20 text-center">
            <h2 className="max-w-3xl text-[min(7.767vw,32px)] max-[500px]:text-[min(5.583vw,23.45px)] desktop:text-[2.25rem] font-extrabold text-[#101828]">
              {t("ctaHeading")
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
            <p className="mt-4 w-full text-[min(4.85vw,20px)] max-[500px]:text-[min(3.64vw,15.29px)] desktop:mt-5 desktop:text-[1.5rem] font-medium text-[#101828]/70">
              {t("ctaDesc")
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
            <Link
              href={QUOTE_HREF}
              className="mt-6 inline-flex max-w-full items-center gap-3 rounded-[0.3875rem] bg-[#FD7304] py-4 pl-7 pr-5 text-[min(4.126vw,17.33px)] max-[500px]:text-[min(3.52vw,14.78px)] font-extrabold text-white transition-colors hover:bg-brand-dark desktop:h-[3.75rem] desktop:py-0 desktop:text-[1.25rem]"
            >
              {t("ctaButton")}
              <Image
                src="/icons/portfolio-cta-arrow.png"
                alt=""
                width={50}
                height={50}
                className="h-6 w-6"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

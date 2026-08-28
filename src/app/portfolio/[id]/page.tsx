import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { SaveReferenceButton } from "@/components/portfolio/SaveReferenceButton";
import { GlossaryTermLink } from "@/components/glossary/GlossaryTermLink";
import { KakaoIcon } from "@/components/icons";
import { getPortfolio, getPortfolioItem, getGlossaryTerms } from "@/lib/db/queries";
import { getContact } from "@/lib/contact";
import { pick } from "@/lib/content";
import { matchGlossaryTerm } from "@/lib/glossary-match";
import { QUOTE_HREF } from "@/lib/site";

/** Light-gray photo placeholder shown when an image hasn't been uploaded yet. */
function PhotoPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-[#F3F4F6] ${className}`}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#D1D5DC]">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="15" cy="10" r="1.6" fill="currentColor" />
        <path d="M4 17l5-5 4 4 2-2 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getPortfolioItem(id);
  if (!item) return {};
  const locale = await getLocale();
  const name = pick(item.name, locale);
  const ko = locale === "ko";
  return pageMeta({
    title: `${name} (${item.itemNo})`,
    description:
      pick(item.hover, locale).trim() ||
      (ko
        ? `${name} 맞춤 패키지 제작 사례입니다. 비슷한 제품으로 견적을 문의해보세요.`
        : `A custom packaging reference: ${name}. Request a quote for something similar.`),
    path: `/portfolio/${encodeURIComponent(item.itemNo)}`,
    image: item.thumbnail,
  });
}

export default async function PortfolioItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, all, contact, glossary] = await Promise.all([
    getPortfolioItem(id),
    getPortfolio(),
    getContact(),
    getGlossaryTerms(),
  ]);
  if (!item) notFound();

  const locale = await getLocale();
  const ko = locale === "ko";
  const tr = {
    back: ko ? "← 뒤로" : "← Back",
    field: ko ? "분야" : "Field",
    quote: ko ? "비슷한 제품으로 견적 문의하기" : "Request a quote for a similar product",
    kakao: ko ? "카카오톡으로 문의하기" : "Chat on KakaoTalk",
    related: ko ? "관련 포트폴리오" : "Related Portfolio",
    readMore: ko ? "자세히 보기" : "Learn more",
  };

  // Related: other items in the same 사용분야, else any other items. Max 4.
  const others = all.filter((p) => p.itemNo !== item.itemNo);
  const related = [
    ...others.filter((p) => p.useField && p.useField === item.useField),
    ...others.filter((p) => !p.useField || p.useField !== item.useField),
  ].slice(0, 4);

  const catPills = (item.categoryLabels ?? []).flatMap((g) => g.values);
  // Full ordered gallery; older rows only carry a thumbnail.
  const gallery = item.images?.length
    ? item.images
    : item.thumbnail
      ? [item.thumbnail]
      : [];
  const kakaoUrl = contact.kakao;

  // Spec values that exist in the glossary become links with a hover preview.
  const specValue = (label: string) => {
    const term = matchGlossaryTerm(label, glossary);
    return term ? (
      <GlossaryTermLink
        label={label}
        term={term}
        locale={locale}
        moreLabel={tr.readMore}
      />
    ) : (
      label
    );
  };

  return (
    <div className="bg-white desktop:bg-[#F9FAFB]">
      <div className="container-page pt-6 pb-16 desktop:pt-8 desktop:pb-24">
        <Link href="/portfolio" className="text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#6A7282] hover:text-brand">
          {tr.back}
        </Link>

        {/* Detail card */}
        <div className="mt-3 bg-white desktop:mt-6 desktop:rounded-[0.625rem] desktop:border desktop:border-[#D5D5D5] desktop:p-8">
          {/* `items-start` keeps the right column content-height so it can stick
              while the taller image column scrolls past it. */}
          <div className="grid items-start gap-10 desktop:grid-cols-[2fr_1fr] desktop:gap-16">
            {/* Left: large images stacked vertically */}
            {/* Mobile: horizontal swipe (snap) — desktop: vertical stack. */}
            <div className="flex flex-col gap-4 desktop:gap-6">
              {gallery.length > 0 ? (
                gallery.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="w-full overflow-hidden rounded-[0.625rem]"
                  >
                    {/* Uncropped: `height: auto` lets each photo keep its own
                        ratio — square, portrait or landscape all show whole.
                        width/height are only the pre-load ratio hint that
                        next/image requires for remote sources; the real ratio
                        takes over once the file loads. 3:2 matches the sizes
                        the studio shoots (≈5637×3752), so the reserved space
                        is usually already right. */}
                    <Image
                      src={src}
                      alt=""
                      width={3000}
                      height={2000}
                      sizes="(max-width:990px) 100vw, 55vw"
                      style={{ width: "100%", height: "auto" }}
                      priority={i === 0}
                    />
                  </div>
                ))
              ) : (
                <PhotoPlaceholder className="aspect-[3/2] w-full shrink-0 rounded-[0.625rem]" />
              )}
            </div>

            {/* Right: info — follows the image column on desktop */}
            <div className="flex flex-col desktop:sticky desktop:top-[calc(var(--spacing-header)+1.5rem)]">
              <span className="mt-2 text-[min(3.4vw,14px)] desktop:text-[0.875rem] text-[#6A7282]">{item.itemNo}</span>
              <h1 className="mt-1 text-[min(6.31vw,26px)] desktop:text-[1.875rem] font-bold leading-tight text-[#101828]">
                {pick(item.name, locale)}
              </h1>

              {catPills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {catPills.map((c, i) => (
                    <span
                      key={i}
                      className="rounded-[62.4375rem] bg-[#FFF7ED] px-3 py-1 text-[min(3.15vw,13px)] desktop:text-[0.8125rem] font-medium text-[#FD7304]"
                    >
                      {pick(c, locale)}
                    </span>
                  ))}
                </div>
              )}

              {/* 분야 + 가이드 분류(패키지 종류·구조·재질·인쇄·후가공…) —
                  categoryLabels를 그대로 순회하므로 가이드가 늘면 자동으로 늘어남. */}
              {/* Label and value share a row — a fixed label column keeps the
                  values aligned, and each value wraps within its own cell. */}
              <dl className="mt-6 space-y-3">
                {item.useFieldLabel && (
                  <div className="flex gap-3">
                    <dt className="w-[6.5rem] shrink-0 text-[min(3.4vw,14px)] desktop:text-[0.875rem] text-[#6A7282]">
                      {tr.field}
                    </dt>
                    <dd className="min-w-0 flex-1 text-[min(3.88vw,16px)] desktop:text-[1rem] font-medium text-[#101828]">
                      {specValue(pick(item.useFieldLabel, locale))}
                    </dd>
                  </div>
                )}
                {(item.categoryLabels ?? []).map((g) => (
                  <div key={g.key} className="flex gap-3">
                    <dt className="w-[6.5rem] shrink-0 text-[min(3.4vw,14px)] desktop:text-[0.875rem] text-[#6A7282]">
                      {pick(g.label, locale)}
                    </dt>
                    <dd className="min-w-0 flex-1 text-[min(3.88vw,16px)] desktop:text-[1rem] font-medium text-[#101828]">
                      {g.values.map((v, i) => (
                        <Fragment key={i}>
                          {i > 0 && " / "}
                          {specValue(pick(v, locale))}
                        </Fragment>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href={`${QUOTE_HREF}?item=${encodeURIComponent(item.itemNo)}`}
                  className="w-full rounded-[0.625rem] bg-brand py-3.5 text-center text-[min(3.88vw,16px)] desktop:text-[1rem] font-bold text-white transition-colors hover:bg-brand-dark"
                >
                  {tr.quote}
                </Link>
                <SaveReferenceButton itemNo={item.itemNo} />
                {kakaoUrl && (
                  <a
                    href={kakaoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-[0.625rem] bg-[#FEE500] py-3.5 text-center text-[min(3.88vw,16px)] desktop:text-[1rem] font-bold text-[#191600] transition-opacity hover:opacity-90"
                  >
                    <KakaoIcon className="h-5 w-5" />
                    {tr.kakao}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related portfolio */}
      {related.length > 0 && (
        <div className="bg-white">
          <div className="container-page py-20 desktop:py-24">
            <h2 className="mb-8 text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.5rem] font-bold text-[#101828]">{tr.related}</h2>
          <div className="-mx-[7.767vw] flex snap-x snap-mandatory items-start gap-4 overflow-x-auto px-[7.767vw] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden desktop:mx-0 desktop:grid desktop:grid-cols-4 desktop:gap-5 desktop:overflow-visible desktop:px-0 desktop:pb-0">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/portfolio/${encodeURIComponent(p.itemNo)}`}
                className="group block w-[46vw] shrink-0 snap-start desktop:w-auto"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-[0.625rem] border-2 border-transparent bg-[#F3F4F6] transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-brand group-hover:shadow-[0_14px_30px_rgba(0,0,0,0.16)]">
                  {p.thumbnail ? (
                    <Image
                      src={p.thumbnail}
                      alt=""
                      fill
                      sizes="(max-width:990px) 46vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <PhotoPlaceholder className="h-full w-full" />
                  )}
                  <span className="absolute bottom-3 left-3 rounded-[62.4375rem] bg-[#FD7304] px-3 py-1 text-[min(2.91vw,12px)] desktop:text-[0.875rem] font-bold text-white">
                    {pick(p.name, locale)}
                  </span>
                </div>
              </Link>
            ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getGlossaryTerms, getGlossaryCategories } from "@/lib/db/queries";
import { Thumb } from "@/components/ui/Thumb";
import { pick } from "@/lib/content";
import { glossaryTone } from "@/lib/glossary-tone";
import { QUOTE_HREF } from "@/lib/site";
import GlossaryGallery from "@/components/glossary/GlossaryGallery";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const term = (await getGlossaryTerms()).find((t) => t.id === id);
  if (!term) return {};
  const locale = await getLocale();
  return pageMeta({
    title: pick(term.term, locale),
    description: pick(term.desc, locale),
    path: `/glossary/${encodeURIComponent(id)}`,
    image: term.image,
  });
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [terms, categories] = await Promise.all([
    getGlossaryTerms(),
    getGlossaryCategories(),
  ]);
  const term = terms.find((t) => t.id === id);
  if (!term) notFound();

  const locale = await getLocale();
  const ko = locale === "ko";
  const tr = {
    back: ko ? "← 뒤로" : "← Back",
    whenUsed: ko ? "어떤 경우에 사용하나요?" : "When is it used?",
    recommendedFor: ko ? "추천 분야" : "Recommended for",
    ctaText: ko ? "이 용어에 대해 더 궁금하신가요?" : "Have more questions about this term?",
    ctaButton: ko ? "전문가에게 문의하기" : "Ask Our Packaging Expert",
    related: ko ? "관련 용어" : "Related Terms",
  };
  const catLabel = categories.find((c) => c.id === term.category)?.label;
  const related = terms
    .filter((t) => t.id !== term.id && t.category === term.category)
    .slice(0, 4);
  const galleryImages = term.images?.length
    ? term.images
    : term.image
      ? [term.image]
      : [];

  return (
    <div className="bg-[#F9FAFB]">
      <div className="container-page py-12 desktop:py-16">
        <Link href="/glossary" className="text-[min(3.64vw,15px)] desktop:text-sm font-medium text-[#6A7282] hover:text-brand">
          {tr.back}
        </Link>

        <article className="mt-6 rounded-[0.625rem] border border-[#D5D5D5] bg-white p-6 desktop:p-10">
          <div className="grid grid-cols-1 gap-8 desktop:grid-cols-2 desktop:gap-10 lg:gap-12">
            {/* Left: image gallery */}
            <GlossaryGallery images={galleryImages} />

            {/* Right: content */}
            <div>
              {catLabel && (
                <p className="text-[min(3.4vw,14px)] desktop:text-[0.875rem] font-medium text-[#FD7304]">
                  {pick(catLabel, locale)}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h1 className="text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.25rem] font-bold leading-tight text-[#101828]">
                  {pick(term.term, locale)}
                </h1>
                <span className="text-[min(3.4vw,14px)] desktop:text-[1rem] text-[#6A7282]">
                  {locale === "ko" ? term.term.en : term.term.ko}
                </span>
              </div>
              <p className="mt-4 text-[min(4.13vw,17px)] desktop:text-[1.125rem] leading-relaxed text-[#364153]">
                {pick(term.desc, locale)}
              </p>

              {term.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {term.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-[62.4375rem] bg-[#FFF7ED] px-3 py-1 text-[min(2.67vw,11px)] desktop:text-[0.8125rem] font-medium text-[#FD7304]"
                    >
                      {pick(tag, locale)}
                    </span>
                  ))}
                </div>
              )}

              {/* When is it used? */}
              {term.whenUsed && pick(term.whenUsed, locale).trim() && (
                <div className="mt-8 rounded-[0.625rem] bg-[#FFF7ED] p-6">
                  <p className="text-[min(4.37vw,18px)] desktop:text-[1.125rem] font-bold text-[#101828]">{tr.whenUsed}</p>
                  <p className="mt-2 text-[min(3.88vw,16px)] desktop:text-[1rem] leading-relaxed text-[#364153]">
                    {pick(term.whenUsed, locale)}
                  </p>
                </div>
              )}

              {/* Recommended for */}
              {term.recommendedFor && pick(term.recommendedFor, locale).trim() && (
                <div className="mt-4 rounded-[0.625rem] bg-[#ECFDF5] p-6">
                  <p className="text-[min(4.37vw,18px)] desktop:text-[1.125rem] font-bold text-[#101828]">{tr.recommendedFor}</p>
                  <p className="mt-2 text-[min(3.88vw,16px)] desktop:text-[1rem] leading-relaxed text-[#364153]">
                    {pick(term.recommendedFor, locale)}
                  </p>
                </div>
              )}

              {/* CTA */}
              <hr className="mt-10 border-t border-[#E5E7EB]" />
              <div className="mt-8 flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:justify-between">
                <p className="text-[min(4.13vw,17px)] desktop:text-[1rem] font-medium text-[#101828]">{tr.ctaText}</p>
                <Link
                  href={QUOTE_HREF}
                  className="inline-block shrink-0 self-start desktop:self-auto rounded-[0.3125rem] bg-[#FD7304] px-5 py-2.5 text-[min(4.13vw,17px)] desktop:rounded-[0.625rem] desktop:px-6 desktop:py-3 desktop:text-[1rem] font-bold text-white transition-colors hover:bg-brand-dark"
                >
                  {tr.ctaButton}
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Related terms */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-[min(5.83vw,24px)] desktop:text-[1.75rem] font-bold text-[#101828]">{tr.related}</h2>
            <div className="grid grid-cols-2 gap-5 desktop:grid-cols-4">
              {related.map((t) => {
                const rcat = categories.find((c) => c.id === t.category)?.label;
                return (
                  <Link
                    key={t.id}
                    href={`/glossary/${encodeURIComponent(t.id)}`}
                    className="block rounded-[0.625rem] border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-brand"
                  >
                    {/* Same Thumb treatment as the glossary list cards, so a
                        term looks the same wherever it appears. */}
                    <div className="mb-4 overflow-hidden rounded-[0.625rem]">
                      <Thumb
                        tone={glossaryTone(t.id)}
                        image={t.image}
                        ratio="square"
                        rounded={false}
                      />
                    </div>
                    {rcat && (
                      <p className="text-[min(3.15vw,13px)] desktop:text-[0.8125rem] font-medium text-[#FD7304]">
                        {pick(rcat, locale)}
                      </p>
                    )}
                    <p className="mt-1 text-[min(4.13vw,17px)] desktop:text-[1rem] font-bold text-[#101828]">
                      {pick(t.term, locale)}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[min(3.4vw,14px)] desktop:text-[0.875rem] text-[#6A7282]">
                      {pick(t.desc, locale)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

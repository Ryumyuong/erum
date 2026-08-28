import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getBlogPosts, getBlogCategories } from "@/lib/db/queries";
import { pick } from "@/lib/content";
import { QUOTE_HREF } from "@/lib/site";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getBlogPosts()).find((p) => p.slug === slug);
  if (!post) return {};
  const locale = await getLocale();
  return pageMeta({
    title: pick(post.title, locale),
    description: pick(post.summary, locale),
    path: `/blog/${encodeURIComponent(slug)}`,
    image: post.cover,
    type: "article",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
  ]);
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const locale = await getLocale();
  const ko = locale === "ko";
  const tr = {
    back: ko ? "← 뒤로" : "← Back",
    ctaText: ko ? "패키지 제작을 준비 중이신가요? 견적을 문의해보세요." : "Planning your packaging? Request a quote.",
    ctaButton: ko ? "견적 문의하기" : "Request a Quote",
  };
  const catLabel = categories.find((c) => c.id === post.category)?.label;
  const body = post.body ? pick(post.body, locale) : "";

  return (
    <div className="bg-[#F9FAFB]">
      <div className="container-page py-12 desktop:py-16">
        <Link href="/blog" className="text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#6A7282] hover:text-brand">
          {tr.back}
        </Link>

        <article className="mt-6 rounded-[0.625rem] border border-[#D5D5D5] bg-white p-6 desktop:p-10">
          {/* Cover — fixed ~580px height, full image visible (no cropping) */}
          <div className="relative h-[25rem] overflow-hidden rounded-[0.625rem] bg-[#F4F4F4] desktop:h-[36.25rem]">
            {post.cover ? (
              <Image src={post.cover} alt="" fill sizes="100vw" unoptimized className="object-contain" />
            ) : (
              <div className="h-full w-full bg-[#F3F4F6]" />
            )}
          </div>

          {/* Text content — 60% width */}
          <div className="w-full desktop:w-[60%]">
          {/* Header */}
          {catLabel && (
            <p className="mt-14 text-[min(2.91vw,12px)] desktop:text-[0.875rem] font-medium text-[#FD7304]">
              {pick(catLabel, locale)}
            </p>
          )}
          <h1 className="mt-2 text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.25rem] font-bold leading-tight text-[#101828]">
            {pick(post.title, locale)}
          </h1>
          <p className="mt-3 text-[min(4.13vw,17px)] desktop:text-[1.25rem] leading-relaxed text-[#364153]">
            {pick(post.summary, locale)}
          </p>
          <p className="mt-4 flex items-center gap-2 text-[min(3.64vw,15px)] desktop:text-[0.875rem] text-[#6A7282]">
            <Image src="/icons/calendar.png" alt="" width={39} height={39} className="h-4 w-4" />
            {post.date}
          </p>

          {/* Body */}
          {body.trim() && (
            <div
              className="blog-content mt-10 text-[min(3.4vw,14px)] desktop:text-[1rem] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          )}

          {/* CTA */}
          <hr className="mt-12 border-t border-[#E5E7EB]" />
          <p className="mt-8 text-[min(4.13vw,17px)] desktop:text-[1rem] font-medium text-[#101828]">{tr.ctaText}</p>
          <Link
            href={QUOTE_HREF}
            className="mt-4 inline-block rounded-[0.3125rem] bg-[#FD7304] px-5 py-2.5 text-[min(4.13vw,17px)] desktop:text-[1rem] font-bold text-white transition-colors hover:bg-brand-dark"
          >
            {tr.ctaButton}
          </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

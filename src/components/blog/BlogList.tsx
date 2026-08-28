"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Thumb } from "@/components/ui/Thumb";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import { type BlogPost, type BlogCategory } from "@/lib/data/blog";

export function BlogList({
  posts: allPosts,
  categories,
}: {
  posts: BlogPost[];
  categories: BlogCategory[];
}) {
  const tc = useTranslations("common");
  const locale = useLocale();
  const [category, setCategory] = useState<string | "all">("all");

  const posts = useMemo(
    () =>
      category === "all"
        ? allPosts
        : allPosts.filter((p) => p.category === category),
    [category, allPosts],
  );

  const catLabel = (id: string) =>
    categories.find((c) => c.id === id)?.label;

  return (
    <div className="container-page">
      <div className="mt-4 grid grid-cols-3 gap-2 desktop:-mt-2 desktop:flex desktop:flex-wrap">
        <Chip active={category === "all"} onClick={() => setCategory("all")}>
          {tc("all")}
        </Chip>
        {categories.map((cat) => (
          <Chip
            key={cat.id}
            active={category === cat.id}
            onClick={() => setCategory(cat.id)}
          >
            {pick(cat.label, locale)}
          </Chip>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 desktop:grid-cols-3 lg:grid-cols-4 desktop:mt-24 desktop:gap-5">
        {posts.map((post) => {
          const label = catLabel(post.category);
          return (
            <Link
              key={post.slug}
              href={`/blog/${encodeURIComponent(post.slug)}`}
              className="group flex h-full flex-col overflow-hidden rounded-[0.6631rem] border border-[#EEEEEE] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.07)] transition-shadow duration-300 hover:border-brand hover:shadow-[0_12px_30px_rgba(0,0,0,0.13)]"
            >
              <Thumb
                tone={post.tone}
                image={post.cover}
                ratio="blog"
                rounded={false}
              />
              <div className="flex flex-1 flex-col p-3 desktop:p-5">
                {label && (
                  <span className="inline-block w-fit rounded-[6.25rem] bg-[#FD7304] px-2.5 py-0.5 text-[min(2.43vw,10px)] desktop:text-[0.75rem] font-semibold text-white">
                    {pick(label, locale)}
                  </span>
                )}
                <h2 className="mt-3 line-clamp-2 min-h-[2lh] text-[min(4.13vw,17px)] max-[500px]:text-[min(3.4vw,14.28px)] desktop:text-[1.25rem] font-bold leading-snug text-[#101828]">
                  {pick(post.title, locale)}
                </h2>
                <p className="mt-2 line-clamp-2 text-[min(3.16vw,13px)] max-[500px]:text-[min(2.67vw,11.21px)] desktop:text-[0.9375rem] leading-relaxed text-[#4A5565]">
                  {pick(post.summary, locale)}
                </p>
                <p className="mt-auto flex items-center gap-2 pt-4 max-[500px]:pt-3 text-[min(2.91vw,12px)] max-[500px]:text-[min(2.43vw,10.21px)] desktop:text-[0.875rem] text-[#6A7282]">
                  <Image src="/icons/calendar.png" alt="" width={39} height={39} className="h-4 w-4" />
                  {post.date}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[5px] border px-2 py-3 max-[500px]:py-2 text-center text-[min(4.13vw,17px)] max-[500px]:text-[min(3.4vw,14.28px)] font-bold transition-colors desktop:rounded-[0.3125rem] desktop:px-4 desktop:py-1.5 desktop:text-sm desktop:font-medium",
        active
          ? "border-[#FD7304] bg-white text-[#FD7304] desktop:border-0 desktop:bg-brand desktop:text-white"
          : "border-[#D0D0D0] bg-white text-[#101828]/60 desktop:border-line desktop:text-muted desktop:hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

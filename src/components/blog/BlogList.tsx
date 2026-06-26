"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Thumb } from "@/components/ui/Thumb";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import { blogCategories, type BlogPost } from "@/lib/data/blog";

export function BlogList({ posts: allPosts }: { posts: BlogPost[] }) {
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
    blogCategories.find((c) => c.id === id)?.label;

  return (
    <div className="container-page">
      <div className="flex flex-wrap gap-2">
        <Chip active={category === "all"} onClick={() => setCategory("all")}>
          {tc("all")}
        </Chip>
        {blogCategories.map((cat) => (
          <Chip
            key={cat.id}
            active={category === cat.id}
            onClick={() => setCategory(cat.id)}
          >
            {pick(cat.label, locale)}
          </Chip>
        ))}
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {posts.map((post) => {
          const label = catLabel(post.category);
          return (
            <article key={post.slug} className="group">
              <Thumb tone={post.tone} image={post.cover} ratio="video" />
              <div className="mt-4">
                {label && (
                  <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                    {pick(label, locale)}
                  </span>
                )}
                <h2 className="mt-3 text-lg font-bold leading-snug group-hover:text-brand">
                  {pick(post.title, locale)}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {pick(post.summary, locale)}
                </p>
                <p className="mt-3 text-xs text-faint">{post.date}</p>
              </div>
            </article>
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
        "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-brand text-white"
          : "border border-line bg-white text-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SearchIcon } from "@/components/icons";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import { glossaryCategories, type GlossaryTerm } from "@/lib/data/glossary";

export function GlossaryList({ terms }: { terms: GlossaryTerm[] }) {
  const t = useTranslations("page.glossary");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter((term) => {
      if (category !== "all" && term.category !== category) return false;
      if (!q) return true;
      return (
        pick(term.term, locale).toLowerCase().includes(q) ||
        pick(term.desc, locale).toLowerCase().includes(q)
      );
    });
  }, [query, category, locale, terms]);

  const grouped = useMemo(
    () =>
      glossaryCategories
        .map((cat) => ({ cat, items: filtered.filter((i) => i.category === cat.id) }))
        .filter((g) => g.items.length > 0),
    [filtered],
  );

  return (
    <div className="container-page">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-faint" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-full border border-line bg-white py-3.5 pl-12 pr-4 text-sm outline-none focus:border-brand"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip active={category === "all"} onClick={() => setCategory("all")}>
          {tc("all")}
        </Chip>
        {glossaryCategories.map((cat) => (
          <Chip
            key={cat.id}
            active={category === cat.id}
            onClick={() => setCategory(cat.id)}
          >
            {pick(cat.label, locale)}
          </Chip>
        ))}
      </div>

      <div className="mt-10 space-y-12">
        {grouped.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">{tc("noResults")}</p>
        )}
        {grouped.map(({ cat, items }) => (
          <section key={cat.id}>
            <h2 className="mb-5 border-b border-line pb-2 text-lg font-bold">
              {pick(cat.label, locale)}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {items.map((term) => (
                <article
                  key={term.id}
                  className="rounded-[var(--radius-card)] border border-line bg-white p-5"
                >
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold">{pick(term.term, locale)}</h3>
                    <span className="text-xs text-faint">
                      {locale === "ko" ? term.term.en : term.term.ko}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {pick(term.desc, locale)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {term.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-medium text-muted"
                      >
                        {pick(tag, locale)}
                      </span>
                    ))}
                  </div>
                  {term.relatedPortfolioIds.length > 0 && (
                    <Link
                      href="/portfolio"
                      className="mt-4 inline-block text-xs font-semibold text-brand hover:text-brand-dark"
                    >
                      {t("related")} ({term.relatedPortfolioIds.length}) →
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
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

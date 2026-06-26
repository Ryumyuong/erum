"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SearchIcon, PlusIcon } from "@/components/icons";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import { faqCategories, type FaqItem } from "@/lib/data/faq";

export function FaqList({ items }: { items: FaqItem[] }) {
  const t = useTranslations("page.faq");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | "all">("all");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return (
        pick(item.q, locale).toLowerCase().includes(q) ||
        pick(item.a, locale).toLowerCase().includes(q)
      );
    });
  }, [query, category, locale, items]);

  const grouped = useMemo(
    () =>
      faqCategories
        .map((cat) => ({
          cat,
          items: filtered.filter((i) => i.category === cat.id),
        }))
        .filter((g) => g.items.length > 0),
    [filtered],
  );

  return (
    <div className="container-page">
      {/* Search */}
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

      {/* Category chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Chip active={category === "all"} onClick={() => setCategory("all")}>
          {tc("all")}
        </Chip>
        {faqCategories.map((cat) => (
          <Chip
            key={cat.id}
            active={category === cat.id}
            onClick={() => setCategory(cat.id)}
          >
            {pick(cat.label, locale)}
          </Chip>
        ))}
      </div>

      {/* Grouped accordion */}
      <div className="mt-10 space-y-10">
        {grouped.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">{tc("noResults")}</p>
        )}
        {grouped.map(({ cat, items }) => (
          <section key={cat.id}>
            <h2 className="mb-4 text-lg font-bold">{pick(cat.label, locale)}</h2>
            <div className="space-y-3">
              {items.map((item) => {
                const isOpen = open === item.id;
                return (
                  <div
                    key={item.id}
                    className="rounded-[var(--radius-card)] border border-line bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-sm font-semibold md:text-base">
                        {pick(item.q, locale)}
                      </span>
                      <PlusIcon
                        className={cn(
                          "h-5 w-5 shrink-0 text-faint transition-transform",
                          isOpen && "rotate-45 text-brand",
                        )}
                      />
                    </button>
                    {isOpen && (
                      <p className="border-t border-line px-5 py-4 text-sm leading-relaxed text-muted">
                        {pick(item.a, locale)}
                      </p>
                    )}
                  </div>
                );
              })}
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

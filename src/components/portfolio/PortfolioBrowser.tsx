"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Thumb } from "@/components/ui/Thumb";
import { SearchIcon } from "@/components/icons";
import { PortfolioModal } from "./PortfolioModal";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import {
  getFilterLabel,
  portfolioFilters,
  type FilterGroupId,
  type PortfolioItem,
} from "@/lib/data/portfolio";

const groupIds = portfolioFilters.map((g) => g.id);

export function PortfolioBrowser({ items }: { items: PortfolioItem[] }) {
  const t = useTranslations("page.portfolio");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filters are the URL source of truth (shareable links).
  const selected = useMemo(() => {
    const out = {} as Record<FilterGroupId, string[]>;
    for (const id of groupIds) {
      const raw = params.get(id);
      out[id] = raw ? raw.split(",").filter(Boolean) : [];
    }
    return out;
  }, [params]);

  const openItem = useMemo(() => {
    const itemNo = params.get("item");
    return itemNo ? items.find((p) => p.itemNo === itemNo) : undefined;
  }, [params, items]);

  const activeCount = groupIds.reduce((n, id) => n + selected[id].length, 0);

  const setParams = useCallback(
    (mutate: (next: URLSearchParams) => void) => {
      const next = new URLSearchParams(params.toString());
      mutate(next);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const toggleFilter = (groupId: FilterGroupId, optionId: string) => {
    setParams((next) => {
      const current = selected[groupId];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      if (updated.length) next.set(groupId, updated.join(","));
      else next.delete(groupId);
    });
  };

  const resetFilters = () =>
    setParams((next) => groupIds.forEach((id) => next.delete(id)));

  const openModal = (itemNo: string) =>
    setParams((next) => next.set("item", itemNo));
  const closeModal = () => setParams((next) => next.delete("item"));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      for (const group of portfolioFilters) {
        const sel = selected[group.id];
        if (!sel.length) continue;
        if (group.id === "printing") {
          if (!item.printing.some((p) => sel.includes(p))) return false;
        } else if (!sel.includes(item[group.id] as string)) {
          return false;
        }
      }
      if (q) {
        const hay = [
          item.itemNo,
          pick(item.name, locale),
          pick(item.hover, locale),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [selected, query, locale, items]);

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

      <p className="mt-6 text-center text-sm font-semibold text-muted">
        {t("results", { count: results.length })}
      </p>

      {/* Mobile filter toggle */}
      <button
        type="button"
        onClick={() => setShowFilters((v) => !v)}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium lg:hidden"
      >
        {t("filter")}
        {activeCount > 0 && (
          <span className="rounded-full bg-brand px-2 text-xs text-white">
            {activeCount}
          </span>
        )}
      </button>

      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filter panel */}
        <aside className={cn("lg:block", showFilters ? "block" : "hidden")}>
          <div className="rounded-[var(--radius-card)] border border-line p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold">{t("filter")}</span>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-medium text-brand hover:text-brand-dark"
                >
                  {t("reset")}
                </button>
              )}
            </div>
            <div className="divide-y divide-line">
              {portfolioFilters.map((group) => (
                <details key={group.id} open className="py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
                    <span>
                      {pick(group.label, locale)}
                      {group.tbd && (
                        <span className="ml-1 text-xs font-normal text-faint">
                          (TBD)
                        </span>
                      )}
                    </span>
                  </summary>
                  <div className="mt-3 space-y-2">
                    {group.options.map((option) => {
                      const checked = selected[group.id].includes(option.id);
                      return (
                        <label
                          key={option.id}
                          className="flex cursor-pointer items-center gap-2 text-sm text-muted"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleFilter(group.id, option.id)}
                            className="h-4 w-4 accent-[var(--color-brand)]"
                          />
                          <span className={cn(checked && "text-ink")}>
                            {pick(option.label, locale)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div>
          {results.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted">
              {tc("noResults")}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {results.map((item) => (
                <PortfolioGridCard
                  key={item.id}
                  item={item}
                  locale={locale}
                  onOpen={() => openModal(item.itemNo)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {openItem && <PortfolioModal item={openItem} onClose={closeModal} />}
    </div>
  );
}

function PortfolioGridCard({
  item,
  locale,
  onOpen,
}: {
  item: PortfolioItem;
  locale: string;
  onOpen: () => void;
}) {
  const typeLabel = getFilterLabel("packageType", item.packageType);
  return (
    <button type="button" onClick={onOpen} className="group block text-left">
      <Thumb tone={item.tone} image={item.thumbnail}>
        {typeLabel && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {pick(typeLabel, locale)}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-2 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-sm font-semibold text-white">
            {pick(item.name, locale)}
          </p>
          <p className="mt-0.5 text-xs text-white/80">
            {pick(item.hover, locale)}
          </p>
        </div>
      </Thumb>
    </button>
  );
}

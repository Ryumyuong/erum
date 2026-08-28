"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDownIcon } from "@/components/icons";
import { PortfolioModal } from "./PortfolioModal";
import { PortfolioCardMedia } from "./PortfolioCardMedia";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import {
  portfolioFilters,
  getFinishingIds,
  type FilterOption,
  type FilterGroup,
  type PortfolioItem,
} from "@/lib/data/portfolio";
import type { L } from "@/lib/content";

type Group = { key: string; label: L; options: FilterOption[] };

// 패키지형태 그룹은 일러스트 카드 그리드로 렌더링한다.
function isIllustrationGroup(group: Group): boolean {
  return (
    group.key === "packageForm" ||
    /형태/.test(group.label.ko) ||
    /\bform\b/i.test(group.label.en)
  );
}

export function PortfolioBrowser({
  items,
  filterGroups,
}: {
  items: PortfolioItem[];
  /** Admin-managed filter taxonomy; falls back to the static config. */
  filterGroups?: FilterGroup[];
}) {
  const t = useTranslations("page.portfolio");
  const tc = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useSearchParams();

  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  // Which filter groups are expanded. Open by default, and driven only by the
  // user clicking a summary — deriving it from the selection count meant
  // clearing the last chip in a group snapped that group shut.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const PER_PAGE = 15; // 5 full rows of the 3-column desktop grid

  // Filter groups come from the dedicated portfolio filter config (fixed).
  const groups: Group[] = useMemo(
    () =>
      (filterGroups ?? portfolioFilters)
        .filter((g) => !g.hidden)
        .map((g) => ({ key: g.id, label: g.label, options: g.options })),
    [filterGroups],
  );
  const groupKeys = useMemo(() => groups.map((g) => g.key), [groups]);

  // Filters are the URL source of truth (shareable links).
  const selected = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const key of groupKeys) {
      const raw = params.get(key);
      out[key] = raw ? raw.split(",").filter(Boolean) : [];
    }
    return out;
  }, [params, groupKeys]);

  const openItem = useMemo(() => {
    const itemNo = params.get("item");
    return itemNo ? items.find((p) => p.itemNo === itemNo) : undefined;
  }, [params, items]);

  const activeCount = groupKeys.reduce(
    (n, k) => n + (selected[k]?.length ?? 0),
    0,
  );

  function itemValues(item: PortfolioItem, key: string): string[] {
    if (key === "printing") return item.printing ?? [];
    if (key === "finishing") return getFinishingIds(item);
    const v = (item as unknown as Record<string, unknown>)[key];
    if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
    return typeof v === "string" && v ? [v] : [];
  }

  // Filter state lives in the URL (shareable links), but updating it must not
  // re-run the server component — `router.replace` refetched the whole
  // portfolio on every chip click even though the filtering happens here on
  // the already-loaded `items`. The native History API is the documented way
  // to change the query string while staying in sync with useSearchParams.
  const setParams = useCallback(
    (mutate: (next: URLSearchParams) => void) => {
      const next = new URLSearchParams(params.toString());
      mutate(next);
      const qs = next.toString();
      window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
    },
    [params, pathname],
  );

  const toggleFilter = (groupKey: string, optionId: string) => {
    setParams((next) => {
      const current = selected[groupKey] ?? [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      if (updated.length) next.set(groupKey, updated.join(","));
      else next.delete(groupKey);
    });
  };

  const resetFilters = () =>
    setParams((next) => groupKeys.forEach((k) => next.delete(k)));

  const openModal = (itemNo: string) =>
    setParams((next) => next.set("item", itemNo));
  const closeModal = () => setParams((next) => next.delete("item"));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      for (const g of groups) {
        const sel = selected[g.key];
        if (!sel?.length) continue;
        const vals = itemValues(item, g.key);
        if (!vals.some((v) => sel.includes(v))) return false;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, query, locale, items, groups]);

  // Paginate; reset to page 1 whenever the filtered set changes. Adjusted
  // during render rather than in an effect — an effect would paint page N of
  // the new result set for a frame first.
  const resultKey = `${query}|${params.toString()}`;
  const [pageKey, setPageKey] = useState(resultKey);
  if (pageKey !== resultKey) {
    setPageKey(resultKey);
    setPage(1);
  }
  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const pageClamped = Math.min(page, totalPages);
  const paged = results.slice(
    (pageClamped - 1) * PER_PAGE,
    pageClamped * PER_PAGE,
  );

  return (
    <div className="container-page pb-32">
      {/* Search */}
      <div className="relative mt-5 desktop:mt-8">
        <Image
          src="/icons/search.png"
          alt=""
          width={40}
          height={40}
          className="pointer-events-none absolute left-5 max-[500px]:left-4 top-1/2 h-5 w-5 max-[500px]:h-4 max-[500px]:w-4 -translate-y-1/2"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-[0.625rem] border border-[#D1D5DC] bg-white py-4 max-[500px]:py-2.5 pl-14 max-[500px]:pl-10 pr-4 text-[min(3.64vw,15px)] desktop:text-[1.125rem] outline-none placeholder:text-[min(3.64vw,15px)] max-[500px]:placeholder:text-[min(2.913vw,12.23px)] desktop:placeholder:text-[1.125rem] placeholder:text-[#0A0A0A]/50 focus:border-brand"
        />
      </div>

      {/* Mobile filter toggle */}
      <button
        type="button"
        onClick={() => setShowFilters((v) => !v)}
        className="mt-4 inline-flex items-center gap-2 rounded-[5px] border border-[#FD7304] px-4 py-1 text-[min(3.88vw,16px)] desktop:text-sm font-medium desktop:hidden"
      >
        <Image src="/icons/filter.png" alt="" width={44} height={44} className="h-4 w-4" />
        {t("filter")}
        {activeCount > 0 && (
          <span className="rounded-full bg-brand px-2 text-[min(2.43vw,10px)] desktop:text-xs text-white">
            {activeCount}
          </span>
        )}
      </button>

      <div className="mt-8 grid gap-8 desktop:mt-20 desktop:grid-cols-[320px_1fr]">
        {/* Backdrop (mobile bottom-sheet) */}
        {showFilters && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 desktop:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}
        {/* Filter panel — mobile bottom-sheet, desktop sidebar */}
        <aside
          className={cn(
            "desktop:static desktop:z-auto desktop:block desktop:max-h-none desktop:overflow-visible desktop:rounded-none desktop:bg-transparent desktop:p-0 desktop:shadow-none",
            showFilters
              ? "fixed inset-x-0 bottom-0 z-[101] max-h-[85vh] overflow-y-auto rounded-t-[1.25rem] bg-white px-0 pb-6 pt-3 shadow-2xl"
              : "hidden",
          )}
        >
          {/* Drag handle (mobile only) */}
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-black/20 desktop:hidden" />
          <div className="rounded-[0.625rem] border-0 px-[6.31vw] py-0 desktop:border desktop:border-[#DDDDDD] desktop:px-5 desktop:py-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2 text-[min(4.13vw,17px)] desktop:text-[1.2188rem] font-bold text-[#101828]">
                <Image src="/icons/filter.png" alt="" width={44} height={44} className="h-5 w-5" />
                {t("filter")}
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-[min(3.4vw,14px)] desktop:text-xs font-medium text-black/50 hover:text-black/70"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                  <path d="M21 3v6h-6" />
                </svg>
                전체초기화
              </button>
            </div>
            <div className="divide-y divide-line">
              {groups.map((group) => {
                const count = selected[group.key]?.length ?? 0;
                const illustration = isIllustrationGroup(group);
                return (
                  <details
                    key={group.key}
                    className="py-3"
                    open={!collapsed[group.key]}
                    onToggle={(e) => {
                      const isOpen = e.currentTarget.open;
                      setCollapsed((s) => ({ ...s, [group.key]: !isOpen }));
                    }}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between text-[min(4.13vw,17px)] desktop:text-[1.0831rem] font-medium text-[#101828]">
                      <span>
                        {pick(group.label, locale)}
                        {count > 0 && (
                          <span className="text-brand"> ({count})</span>
                        )}
                      </span>
                      <ChevronDownIcon className="accordion-chevron h-4 w-4 text-faint" />
                    </summary>

                    {illustration ? (
                      /* 패키지형태 — 일러스트 카드 그리드 */
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {group.options.map((option) => {
                          const checked = (selected[group.key] ?? []).includes(option.id);
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => toggleFilter(group.key, option.id)}
                              aria-pressed={checked}
                              className={cn(
                                "flex flex-col items-center gap-1 rounded-[2px] border p-0.5 text-center text-[min(3.4vw,14px)] desktop:text-[0.6875rem] leading-tight transition-colors",
                                checked
                                  ? "border-[#FD7304] bg-[#FD7304]/5"
                                  : "border-[#E5E7EB] hover:border-[#D5D5D5]",
                              )}
                            >
                              <div className="relative aspect-square w-full">
                                {option.image ? (
                                  <Image
                                    src={option.image}
                                    alt=""
                                    fill
                                    sizes="120px"
                                    unoptimized
                                    className="object-contain p-[6%] desktop:p-[3%]"
                                  />
                                ) : (
                                  <div className="h-full w-full rounded-[2px] bg-[#F3F4F6]" />
                                )}
                              </div>
                              <span className="break-keep text-[#364153]">
                                {pick(option.label, locale)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      /* 그 외 — 버튼식 pill (아이콘이 있으면 인쇄도수 스타일) */
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.options.map((option) => {
                          const checked = (selected[group.key] ?? []).includes(option.id);
                          const hasIcon = Boolean(option.image);
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => toggleFilter(group.key, option.id)}
                              aria-pressed={checked}
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-[0.375rem] border px-3 py-1.5 text-[min(3.64vw,14px)] desktop:text-[0.8125rem] transition-colors",
                                checked && !hasIcon &&
                                  "border-brand bg-brand font-medium text-white",
                                checked && hasIcon &&
                                  "border-[#FD7304] bg-[#FD7304]/5 font-medium text-[#101828]",
                                !checked &&
                                  "border-[#E5E7EB] text-[#364153] hover:border-[#D5D5D5]",
                              )}
                            >
                              {hasIcon && (
                                <Image
                                  src={option.image!}
                                  alt=""
                                  width={20}
                                  height={20}
                                  unoptimized
                                  className="h-4 w-4 object-contain"
                                />
                              )}
                              {pick(option.label, locale)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </details>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div>
          <p className="mb-5 text-[min(3.64vw,15px)] desktop:text-[1.0831rem] font-medium text-[#364153]">
            {t("results", { count: results.length })}
          </p>
          {results.length === 0 ? (
            <p className="py-16 text-center text-[min(2.91vw,12px)] desktop:text-sm text-muted">
              {tc("noResults")}
            </p>
          ) : (
            <>
              {/* Three across on desktop — dropping the lg:4 step is what makes
                  each thumbnail bigger. */}
              <div className="grid grid-cols-2 gap-4 max-[500px]:gap-2 desktop:grid-cols-3">
                {paged.map((item) => (
                  <PortfolioGridCard key={item.id} item={item} locale={locale} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        aria-current={p === pageClamped}
                        className={cn(
                          "h-9 w-9 rounded-full text-[min(2.91vw,12px)] desktop:text-sm font-medium transition-colors",
                          p === pageClamped
                            ? "bg-[#FD7304] text-white"
                            : "text-[#364153] hover:bg-[#F3F4F6]",
                        )}
                      >
                        {p}
                      </button>
                    ),
                  )}
                </div>
              )}
            </>
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
}: {
  item: PortfolioItem;
  locale: string;
}) {
  return (
    <Link
      href={`/portfolio/${encodeURIComponent(item.itemNo)}`}
      className="group block w-full self-start text-left"
    >
      <PortfolioCardMedia item={item} locale={locale} ratio="square" />
    </Link>
  );
}

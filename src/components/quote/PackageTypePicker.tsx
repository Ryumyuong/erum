"use client";

import { useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Tooltip } from "./Tooltip";
import { QuoteCardGrid, QuoteOptionCard } from "./QuoteOptionCard";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { L } from "@/lib/content";

export type PackageOption = {
  id: string;
  tab: string;
  label: L;
  desc: L;
  image?: string;
  kind: "option" | "recommend" | "custom" | "other";
};

/**
 * Notes shown on the (?) beside a category heading. Kept here rather than in
 * the option rows because they describe the whole category, not one card.
 */
const TAB_NOTES: Record<string, L> = {
  싸바리박스: {
    ko: "견고하고 고급스럽지만, 예산이 제한적인 경우 적합하지 않아요.",
    en: "Sturdy and premium, but not a good fit on a tight budget.",
  },
  비닐류: {
    ko: "최소 수량이 1만장~2만장 이상이에요.",
    en: "Minimum order is 10,000–20,000 pcs.",
  },
};

/**
 * 1-1 패키지 종류 — filter tabs over a card grid, five across on desktop.
 *
 * Cards stay grouped under their category heading even with no filter applied,
 * so 39 options read as six short lists rather than one long wall. The selected
 * id drives which material / printing / finishing questions the rest of the
 * form shows, so the tab is reported back alongside it.
 */
export function PackageTypePicker({
  options,
  value,
  onChange,
  allLabel,
  tabNotes = {},
  changeLabel,
}: {
  options: PackageOption[];
  value: string;
  onChange: (id: string, tab: string) => void;
  allLabel: string;
  /** Admin-managed category notes; TAB_NOTES is the fallback. */
  tabNotes?: Record<string, L>;
  changeLabel: string;
}) {
  const locale = useLocale();
  const [tab, setTab] = useState<string>("");
  // 39 cards are a lot to keep on screen once the choice is made, so the list
  // folds away and leaves the picked one. Tapping it opens the list again.
  const [openList, setOpenList] = useState(true);
  const chosen = options.find((o) => o.id === value);
  const rootRef = useRef<HTMLDivElement>(null);

  // Choosing a card near the bottom of a 39-item grid leaves the viewport deep
  // down the page; the section collapses under the reader rather than in front
  // of them. Bring its heading back to the top, clear of the sticky header.
  const pick_ = (id: string, tab: string) => {
    onChange(id, tab);
    setOpenList(false);
    const section = rootRef.current?.closest("section");
    if (!section) return;
    const header = 72;
    const top = section.getBoundingClientRect().top + window.scrollY - header;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Tab order follows the option order, so the admin controls it by sorting.
  const tabs = useMemo(() => {
    const seen: string[] = [];
    for (const o of options) if (o.tab && !seen.includes(o.tab)) seen.push(o.tab);
    return seen;
  }, [options]);

  const groups = useMemo(() => {
    const shown = tab ? options.filter((o) => o.tab === tab) : options;
    const order: string[] = [];
    const byTab = new Map<string, PackageOption[]>();
    for (const o of shown) {
      const key = o.tab || "";
      if (!byTab.has(key)) {
        byTab.set(key, []);
        order.push(key);
      }
      byTab.get(key)!.push(o);
    }
    // 기타 / 직접입력 cards close out their own category. sort() is stable, so
    // everything else keeps the admin's ordering.
    for (const list of byTab.values()) {
      list.sort(
        (a, b) => Number(a.kind !== "option") - Number(b.kind !== "option"),
      );
    }
    return order.map((name) => ({ tab: name, items: byTab.get(name)! }));
  }, [options, tab]);

  if (chosen && !openList) {
    return (
      <div ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpenList(true)}
        className="flex w-full items-center justify-between gap-3 rounded-[0.625rem] border-2 border-brand bg-white px-4 py-3 text-left"
      >
        <span className="min-w-0">
          {chosen.tab && (
            <span className="block text-[min(2.67vw,11px)] desktop:text-xs text-[#6A7282]">
              {chosen.tab}
            </span>
          )}
          <span className="block truncate text-[min(3.88vw,16px)] desktop:text-[1.0625rem] font-bold text-brand">
            {pick(chosen.label, locale)}
          </span>
        </span>
        <span className="shrink-0 rounded-[0.375rem] border border-[#D1D5DC] px-3 py-1.5 text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#364153]">
          {changeLabel}
        </span>
      </button>
      </div>
    );
  }

  return (
    <div ref={rootRef}>
      <div className="flex flex-wrap items-center gap-2">
        <TabButton active={!tab} onClick={() => setTab("")}>
          {allLabel}
        </TabButton>
        {tabs.map((name) => (
          <TabButton key={name} active={tab === name} onClick={() => setTab(name)}>
            {name}
          </TabButton>
        ))}
      </div>

      <div className="mt-5 space-y-7">
        {groups.map((g) => {
          const note = tabNotes[g.tab] ?? TAB_NOTES[g.tab];
          return (
            <div key={g.tab || "_"}>
              {g.tab && (
                <span className="mb-2.5 flex items-center gap-1 text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#6A7282]">
                  {g.tab}
                  {note && <Tooltip text={pick(note, locale)} />}
                </span>
              )}
              <QuoteCardGrid>
                {g.items.map((o) => (
                  <QuoteOptionCard
                    key={o.id}
                    option={o}
                    selected={value === o.id}
                    onSelect={() => pick_(o.id, o.tab)}
                  />
                ))}
              </QuoteCardGrid>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabButton({
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
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-1.5 text-[min(3.4vw,14px)] desktop:text-[0.9375rem] font-medium transition-colors",
        active
          ? "border-brand bg-brand text-white"
          : "border-[#D1D5DC] bg-white text-[#364153] hover:border-brand hover:text-brand",
      )}
    >
      {children}
    </button>
  );
}

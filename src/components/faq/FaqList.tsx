"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDownIcon } from "@/components/icons";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { FaqItem, FaqCategory } from "@/lib/data/faq";

export function FaqList({
  items,
  categories,
}: {
  items: FaqItem[];
  categories: FaqCategory[];
}) {
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

  const grouped = useMemo(() => {
    const known = new Set(categories.map((c) => c.id));
    const out: { cat: FaqCategory; items: FaqItem[] }[] = [];
    for (const cat of categories) {
      const items = filtered.filter((i) => i.category === cat.id);
      if (items.length) out.push({ cat, items });
    }
    // Items whose category isn't in the list still show, under "기타 / Other".
    const orphans = filtered.filter((i) => !known.has(i.category));
    if (orphans.length) {
      out.push({
        cat: { id: "__other__", label: { en: "Other", ko: "기타" } },
        items: orphans,
      });
    }
    return out;
  }, [filtered, categories]);

  return (
    <div className="container-page pb-24">
      {/* Search */}
      <div className="relative">
        <Image
          src="/icons/search.png"
          alt=""
          width={40}
          height={40}
          className="pointer-events-none absolute left-6 max-[500px]:left-4 top-1/2 h-5 w-5 max-[500px]:h-4 max-[500px]:w-4 -translate-y-1/2"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-[0.875rem] border border-[#DDDDDD] bg-white py-4 max-[500px]:py-2.5 pl-14 max-[500px]:pl-10 pr-4 text-[min(4.13vw,17px)] max-[500px]:text-[min(3.4vw,14.28px)] desktop:text-[1rem] outline-none placeholder:text-[min(4.13vw,17px)] max-[500px]:placeholder:text-[min(2.913vw,12.23px)] desktop:placeholder:text-[1rem] placeholder:text-[#0A0A0A]/50 focus:border-brand"
        />
      </div>

      {/* Category tabs (separate from search) */}
      <div className="mt-4 grid grid-cols-3 gap-2 desktop:flex desktop:flex-wrap">
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

      {/* Grouped accordion */}
      <div className="mt-12 space-y-12 desktop:mt-24 desktop:space-y-24">
        {grouped.length === 0 && (
          <p className="py-10 text-center text-[min(3.4vw,14px)] desktop:text-sm text-muted">{tc("noResults")}</p>
        )}
        {grouped.map(({ cat, items }) => (
          <section key={cat.id}>
            <h2 className="mb-5 text-[min(5.83vw,24px)] max-[500px]:text-[min(4.854vw,20.4px)] desktop:text-[1.5rem] font-bold text-[#101828]">
              {pick(cat.label, locale)}
            </h2>
            <div className="divide-y divide-[#DDDDDD] overflow-hidden rounded-[0.625rem] border border-[#DDDDDD] bg-white">
              {items.map((item) => {
                const isOpen = open === item.id;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-center justify-between gap-4 px-5 py-4 max-[500px]:px-4 max-[500px]:py-3 text-left"
                    >
                      <span
                        className={cn(
                          "text-[min(4.13vw,17px)] max-[500px]:text-[min(3.64vw,15.29px)] desktop:text-base font-medium transition-colors group-hover:text-brand",
                          isOpen ? "text-brand" : "text-[#101828]",
                        )}
                      >
                        {pick(item.q, locale)}
                      </span>
                      <ChevronDownIcon
                        className={cn(
                          "h-5 w-5 shrink-0 text-faint transition-transform",
                          isOpen && "rotate-180 text-brand",
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5">
                        <p className="text-[min(4.13vw,17px)] max-[500px]:text-[min(3.4vw,14.28px)] desktop:text-[1rem] leading-relaxed text-[#364153]">
                          {pick(item.a, locale)}
                        </p>
                        {item.image && (
                          /* width/height are the pre-load ratio hint only —
                             `h-auto` adopts the real ratio, so nothing is
                             cropped whatever shape is uploaded. */
                          <Image
                            src={item.image}
                            alt=""
                            width={1600}
                            height={1067}
                            sizes="(max-width: 990px) 90vw, 45vw"
                            className="mt-4 h-auto w-full max-w-xl rounded-[0.625rem]"
                          />
                        )}
                      </div>
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
        "rounded-[5px] border px-2 py-3 max-[500px]:py-2 text-center text-[min(4.13vw,17px)] max-[500px]:text-[min(3.4vw,14.28px)] font-bold transition-colors desktop:rounded-[0.3125rem] desktop:border-0 desktop:px-4 desktop:py-1.5 desktop:text-[0.875rem] desktop:font-medium",
        active
          ? "border-[#FD7304] bg-white text-[#FD7304] desktop:bg-[#FD7304] desktop:text-white"
          : "border-[#D0D0D0] bg-white text-[#101828]/60 desktop:border-0 desktop:bg-[#F3F4F6] desktop:text-[#364153] desktop:hover:bg-[#e9eaed]",
      )}
    >
      {children}
    </button>
  );
}

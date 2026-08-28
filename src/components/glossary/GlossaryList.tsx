"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FunnelIcon, ArrowRightIcon } from "@/components/icons";
import { Thumb } from "@/components/ui/Thumb";
import { pick } from "@/lib/content";
import { glossaryTone } from "@/lib/glossary-tone";
import { cn } from "@/lib/utils";
import type { GlossaryTerm, GlossaryCategory } from "@/lib/data/glossary";


export function GlossaryList({
  terms,
  categories,
}: {
  terms: GlossaryTerm[];
  categories: GlossaryCategory[];
}) {
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

  const grouped = useMemo(() => {
    const known = new Set(categories.map((c) => c.id));
    const out: { cat: GlossaryCategory; items: GlossaryTerm[] }[] = [];
    // Known categories, in their configured order.
    for (const cat of categories) {
      const items = filtered.filter((i) => i.category === cat.id);
      if (items.length) out.push({ cat, items });
    }
    // Terms whose category isn't in the category list still get shown — grouped
    // under a single "기타 / Other" bucket (never a raw id/uuid) so nothing
    // silently disappears.
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
    <div className="container-page">
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

      {/* Category label — desktop only */}
      <div className="mt-4 hidden items-center gap-2 text-[min(2.91vw,12px)] desktop:flex desktop:text-sm font-bold">
        <FunnelIcon className="h-4 w-4 text-brand" />
        {t("category")}
      </div>

      {/* Category tabs (separate from search) */}
      <div className="mt-4 grid grid-cols-3 gap-2 desktop:mt-2 desktop:flex desktop:flex-wrap">
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

      {/* Grouped term cards */}
      {/* space-y-24 matches the guide and FAQ section rhythm. */}
      <div className="mt-10 space-y-12 desktop:mt-20 desktop:space-y-24">
        {grouped.length === 0 && (
          <p className="py-10 text-center text-[min(2.91vw,12px)] desktop:text-sm text-muted">{tc("noResults")}</p>
        )}
        {grouped.map(({ cat, items }) => (
          <section key={cat.id}>
            <h2 className="mb-8 border-b border-black/30 pb-4 text-[min(6.55vw,27px)] max-[500px]:text-[min(5.34vw,22.4px)] desktop:text-[2rem] font-bold text-black">
              {pick(cat.label, locale)}
            </h2>
            <div className="grid grid-cols-2 gap-4 desktop:grid-cols-3 desktop:gap-6">
              {items.map((term) => (
                <Link
                  key={term.id}
                  href={`/glossary/${encodeURIComponent(term.id)}`}
                  className="group block rounded-[0.625rem] border border-[#DDDDDD] bg-[#FCFCFC] p-3 text-left"
                >
                  <div className="overflow-hidden rounded-[0.625rem]">
                    <Thumb
                      tone={glossaryTone(term.id)}
                      image={term.image}
                      ratio="square"
                      rounded={false}
                    />
                  </div>
                  <div className="px-1.5 pb-1.5 pt-4">
                    <h3 className="text-[min(4.85vw,20px)] max-[500px]:text-[min(4.126vw,17.33px)] desktop:text-[1.5rem] font-semibold text-[#101828]">
                      {pick(term.term, locale)}
                    </h3>
                    <p className="text-[min(2.91vw,12px)] desktop:text-[0.8538rem] text-[#99A1AF]">
                      {locale === "ko" ? term.term.en : term.term.ko}
                    </p>
                    <p className="mt-2 line-clamp-2 min-h-[3.66rem] max-[500px]:min-h-0 text-[min(3.64vw,15px)] max-[500px]:text-[min(3.155vw,13.25px)] desktop:text-[1.125rem] leading-relaxed text-[#4A5565]">
                      {pick(term.desc, locale)}
                    </p>
                    <span className="mt-4 max-[500px]:mt-3 inline-flex items-center gap-1 text-[min(3.4vw,14px)] max-[500px]:text-[min(2.913vw,12.23px)] desktop:text-[0.9956rem] font-medium text-[#FD7304]">
                      {t("viewDetail")}
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
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

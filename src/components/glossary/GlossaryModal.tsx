"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Thumb } from "@/components/ui/Thumb";
import { ArrowRightIcon } from "@/components/icons";
import { pick } from "@/lib/content";
import type { GlossaryTerm } from "@/lib/data/glossary";

export function GlossaryModal({
  term,
  tone,
  categoryLabel,
  onClose,
}: {
  term: GlossaryTerm;
  tone: string;
  categoryLabel: string;
  onClose: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("page.glossary");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 desktop:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 my-4 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl desktop:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={locale === "ko" ? "닫기" : "Close"}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-faint hover:bg-cream hover:text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="grid gap-6 desktop:grid-cols-2">
          <Thumb tone={tone} image={term.image} ratio="video" />
          <div>
            <span className="text-[min(2.43vw,10px)] desktop:text-xs font-bold uppercase tracking-wide text-brand">
              {categoryLabel}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <h2 className="text-[min(4.85vw,20px)] desktop:text-2xl font-bold">{pick(term.term, locale)}</h2>
              <span className="text-[min(2.91vw,12px)] desktop:text-sm text-faint">
                {locale === "ko" ? term.term.en : term.term.ko}
              </span>
            </div>
            <p className="mt-3 text-[min(2.91vw,12px)] desktop:text-sm leading-relaxed text-muted">
              {pick(term.desc, locale)}
            </p>
            {term.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {term.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-cream px-2.5 py-0.5 text-[min(2.43vw,10px)] desktop:text-xs font-medium text-muted"
                  >
                    {pick(tag, locale)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {term.relatedPortfolioIds.length > 0 && (
          <div className="mt-6 border-t border-line pt-5">
            <p className="mb-3 text-[min(2.91vw,12px)] desktop:text-sm font-semibold">{t("related")}</p>
            <div className="flex flex-wrap gap-2">
              {term.relatedPortfolioIds.map((id) => (
                <Link
                  key={id}
                  href={`/portfolio?item=${id.toUpperCase()}`}
                  className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[min(2.43vw,10px)] desktop:text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  {id.toUpperCase()}
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

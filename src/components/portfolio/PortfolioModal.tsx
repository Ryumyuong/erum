"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { PortfolioDetail } from "./PortfolioDetail";
import type { PortfolioItem } from "@/lib/data/portfolio";

export function PortfolioModal({
  item,
  onClose,
}: {
  item: PortfolioItem;
  onClose: () => void;
}) {
  const locale = useLocale();

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
      <div className="relative z-10 my-4 w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl desktop:p-8">
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
        <PortfolioDetail item={item} />
      </div>
    </div>
  );
}

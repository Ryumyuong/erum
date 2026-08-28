"use client";

import { ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/** Simple numbered pager for admin tables. Hidden when there's only one page. */
export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
}) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="mt-5 flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="이전"
        className="flex h-9 w-9 items-center justify-center rounded-[0.25rem] border border-line text-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-line disabled:hover:text-muted"
      >
        <ChevronRightIcon className="h-4 w-4 rotate-180" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page}
          className={cn(
            "h-9 min-w-9 rounded-[0.25rem] px-3.5 text-[0.875rem] font-bold transition-colors",
            p === page
              ? "bg-brand text-white"
              : "border border-line text-[#101828] hover:border-brand hover:text-brand",
          )}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="다음"
        className="flex h-9 w-9 items-center justify-center rounded-[0.25rem] border border-line text-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-line disabled:hover:text-muted"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { multiline } from "@/components/ui/Multiline";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { MaterialOption } from "./MaterialQuestions";

/**
 * Dropdown that shows a thumbnail beside each choice.
 *
 * A native <select> can't render images in its options, and the 후가공 options
 * (coatings, foils, embossing) are far easier to tell apart from a picture than
 * a name — so this is a button + listbox rather than a real select.
 */
export function ImageSelect({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: MaterialOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
}) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.id === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-[0.625rem] border bg-white px-4 py-3 text-left text-[min(3.9vw,16px)] font-semibold desktop:text-[1.0625rem] transition-colors",
          open ? "border-brand" : "border-[#D1D5DC] hover:border-brand/50",
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected?.image && (
            <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-[0.25rem]">
              <Image src={selected.image} alt="" fill sizes="28px" className="object-cover" />
            </span>
          )}
          <span className="truncate text-[#101828]">
            {selected ? pick(selected.label, locale) : placeholder}
          </span>
        </span>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden className="shrink-0">
          <path d="M1 1.5 6 6.5 11 1.5" stroke="#6A7282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-40 mt-1 max-h-72 w-full min-w-[12rem] overflow-hidden overflow-y-auto rounded-[0.625rem] border border-[#E5E7EB] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.14)]"
        >
          {options.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                role="option"
                aria-selected={o.id === value}
                onClick={() => {
                  onChange(o.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-stretch text-left text-[min(3.4vw,14px)] desktop:text-[0.9375rem] transition-colors hover:bg-[#F7F7F7]",
                  o.id === value ? "font-medium text-brand" : "text-[#364153]",
                )}
              >
                {/* Flush to the edge and full row height — the swatch reads
                    better as a solid block than a small inset square. */}
                {o.image ? (
                  <span className="relative w-14 shrink-0 self-stretch overflow-hidden">
                    <Image src={o.image} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                ) : (
                  <span className="w-14 shrink-0 self-stretch bg-[#F3F4F6]" />
                )}
                <span className="flex-1 px-3 py-3">{multiline(pick(o.label, locale))}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

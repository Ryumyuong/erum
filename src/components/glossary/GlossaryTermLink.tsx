"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { GlossaryTerm } from "@/lib/data/glossary";

/**
 * A spec value that exists in the glossary: shows a preview card, with a link
 * through to the full term.
 *
 * Two presentations. On desktop it is a popover anchored to the word — opened
 * by hover or click — that flips to whichever side has room, so it never runs
 * off the edge. On phones there is no hover and no room to anchor anything, so
 * the first tap opens a centred dialog instead; going straight to the glossary
 * lost the customer's place on the page.
 */
export function GlossaryTermLink({
  label,
  term,
  locale,
  moreLabel,
}: {
  label: string;
  term: GlossaryTerm;
  locale: string;
  /** "자세히 보기" — passed in so this stays free of the translation context. */
  moreLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [flip, setFlip] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
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

  // Anchor to whichever side has room. Measured on open (and on hover) rather
  // than at a fixed breakpoint, because the word can sit anywhere in the row.
  const place = () => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setFlip(rect.left < CARD_PX + 24);
  };

  const card = (
    <>
      {term.image && (
        <span className="relative mb-2.5 block aspect-video w-full overflow-hidden rounded-[0.5rem] bg-[#F3F4F6]">
          <Image src={term.image} alt="" fill sizes="352px" className="object-cover" />
        </span>
      )}
      <span className="block text-[1.0625rem] font-bold leading-tight text-[#101828]">
        {pick(term.term, locale)}
      </span>
      <span className="mt-2 block text-[0.875rem] font-normal leading-relaxed text-[#6A7282]">
        {pick(term.desc, locale)}
      </span>
      <Link
        href={`/glossary/${term.id}`}
        className="mt-3 inline-flex items-center gap-1 text-[0.875rem] font-semibold text-brand hover:text-brand-dark"
      >
        {moreLabel}
        <span aria-hidden>{">"}</span>
      </Link>
    </>
  );

  return (
    <span ref={ref} className="group/gloss relative inline-block">
      <button
        type="button"
        onClick={() => {
          place();
          setOpen((v) => !v);
        }}
        onMouseEnter={place}
        aria-expanded={open}
        className="underline decoration-[#FD7304]/50 decoration-dotted underline-offset-4 transition-colors hover:text-brand hover:decoration-[#FD7304]"
      >
        {label}
      </button>

      {/* Desktop: anchored popover, above the word so it clears the CTA buttons
          that sit under the spec list. */}
      <span
        role="tooltip"
        className={cn(
          "absolute bottom-full z-50 mb-2 hidden w-[22rem] rounded-[0.75rem] border border-[#E5E7EB] bg-white p-4 text-left shadow-[0_16px_36px_rgba(0,0,0,0.16)] transition-opacity duration-150 desktop:block",
          flip ? "left-0" : "right-0",
          open
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0 group-hover/gloss:visible group-hover/gloss:opacity-100",
        )}
      >
        {card}
      </span>

      {/* Mobile: centred dialog with a dimmed backdrop. */}
      {open && (
        <span className="desktop:hidden">
          <span
            className="fixed inset-0 z-[60] block bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <span
            role="dialog"
            className="fixed left-1/2 top-1/2 z-[61] block w-[min(20rem,calc(100vw-2.5rem))] -translate-x-1/2 -translate-y-1/2 rounded-[0.75rem] border border-[#E5E7EB] bg-white p-4 text-left shadow-[0_16px_36px_rgba(0,0,0,0.24)]"
          >
            {card}
          </span>
        </span>
      )}
    </span>
  );
}

/** Popover width in px — kept in step with the w-[22rem] above. */
const CARD_PX = 352;

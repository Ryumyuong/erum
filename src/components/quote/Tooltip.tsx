"use client";

import { useEffect, useRef, useState } from "react";
import { Thumb } from "@/components/ui/Thumb";
import { cn } from "@/lib/utils";

/**
 * (?) help tooltip — click the (?) to show a short explanation (and an optional
 * image); click outside or press Esc to close. Click-based so it works on touch
 * devices too. Helps customers who don't know the technical terms.
 *
 * `image` shows a real diagram above the text — used by the size fields, where
 * customers routinely mix up depth and height.
 */
export function Tooltip({
  text,
  tone,
  image,
  figure,
}: {
  text: string;
  tone?: string;
  image?: string;
  /** Drawn diagram shown instead of an uploaded image. */
  figure?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

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
    <span ref={ref} className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label={text}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-5 w-5 items-center justify-center rounded-full border border-line text-[min(2.43vw,10px)] desktop:text-xs font-bold text-faint transition-colors hover:border-brand hover:text-brand aria-expanded:border-brand aria-expanded:bg-brand aria-expanded:text-white"
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          className={cn(
            "absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 rounded-lg border border-line bg-white p-3 text-left shadow-lg",
            "max-w-[calc(100vw-2rem)]",
            image || figure ? "w-80" : "w-52",
          )}
        >
          {figure ? (
            <span className="mb-2 flex justify-center rounded-lg bg-[#FAFAFA] p-2">{figure}</span>
          ) : (
            (image || tone) && (
              <Thumb tone={tone} image={image} ratio="video" className="mb-2" />
            )
          )}
          <span className="block whitespace-pre-line text-[min(2.43vw,10px)] desktop:text-xs leading-relaxed text-muted">
            {text}
          </span>
        </span>
      )}
    </span>
  );
}

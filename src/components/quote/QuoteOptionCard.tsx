"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { multiline } from "@/components/ui/Multiline";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { L } from "@/lib/content";

export type CardOption = {
  id: string;
  label: L;
  desc: L;
  image?: string;
  kind: "option" | "recommend" | "custom" | "other";
};

/**
 * One picture card in the quote form — 패키지 종류 and 재질 both use it, so the
 * two sections stay visually identical as the spec asks.
 *
 * The wrapper is a div rather than a button because the 직접 입력 card carries
 * its own text field; a nested input inside a button is invalid markup and
 * swallows clicks. The button still covers the whole picture + label area.
 */
export function QuoteOptionCard({
  option,
  selected,
  onSelect,
  compact = false,
}: {
  option: CardOption;
  selected: boolean;
  onSelect: () => void;
  /** Shorter picture area — used everywhere except 패키지 종류. */
  compact?: boolean;
}) {
  const locale = useLocale();
  const desc = pick(option.desc, locale).trim();
  // 기타 / 추천해주세요 / 직접 입력 have no photo — the icon, name and note sit
  // together inside one centred card instead of under an empty grey square.
  const centred = option.kind !== "option" && !option.image;
  const shape = compact ? "aspect-[3/2]" : "aspect-square";

  if (centred) {
    return (
      <div
        className={cn(
          // Both children share one grid cell, so the card is as tall as a
          // picture card but still grows when the caption needs more room —
          // the previous absolute overlay let long text spill over the border.
          "grid rounded-[0.625rem] border-2 bg-white transition-colors",
          selected ? "border-brand" : "border-[#E5E7EB] hover:border-brand/50",
        )}
      >
        {/* Invisible stand-in for a picture card's image + name blocks. */}
        <div aria-hidden className="invisible col-start-1 row-start-1">
          <span className={cn("block w-full", shape)} />
          <span className="block px-2.5 py-3 text-[min(3.4vw,14px)] desktop:text-[1.0625rem] font-bold">
            &nbsp;
          </span>
        </div>

        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className={cn(
            "col-start-1 row-start-1 flex flex-col items-center justify-center text-center",
            compact ? "gap-1 px-2.5 py-3" : "gap-2 px-4 py-5",
          )}
        >
          {option.kind === "recommend" ? (
            <Image
              src="/quote/recommend.png"
              alt=""
              width={72}
              height={72}
              className={cn("object-contain", compact ? "h-9 w-9" : "h-14 w-14")}
            />
          ) : (
            <span
              className={cn(
                "flex items-center justify-center rounded-full bg-brand-soft font-bold text-brand",
                compact ? "h-9 w-9 text-base" : "h-14 w-14 text-xl",
              )}
              aria-hidden
            >
              ?
            </span>
          )}
          <span
            className={cn(
              "text-[min(3.4vw,14px)] font-bold",
              compact ? "desktop:text-[0.9375rem]" : "mt-1 desktop:text-[1.0625rem]",
              selected ? "text-brand" : "text-[#101828]",
            )}
          >
            {multiline(pick(option.label, locale))}
          </span>
          {desc && (
            <span
              className={cn(
                "whitespace-pre-line leading-snug text-[#6A7282]",
                compact
                  ? "text-[min(2.43vw,10px)] desktop:text-[0.6875rem]"
                  : "text-[min(2.67vw,11px)] desktop:text-[0.75rem]",
              )}
            >
              {desc}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[0.625rem] border-2 bg-white transition-colors",
        selected ? "border-brand" : "border-[#E5E7EB] hover:border-brand/50",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="flex flex-1 flex-col text-center"
      >
        <span className={cn("relative flex w-full items-center justify-center bg-[#F7F7F7]", shape)}>
          {option.image ? (
            <Image
              src={option.image}
              alt=""
              fill
              sizes="(max-width: 990px) 45vw, 18vw"
              className="object-cover"
            />
          ) : option.kind === "recommend" ? (
            <Image
              src="/quote/recommend.png"
              alt=""
              width={72}
              height={72}
              className="h-16 w-16 object-contain"
            />
          ) : (
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold",
                option.kind === "option"
                  ? "bg-[#E5E7EB] text-[#9CA3AF]"
                  : "bg-brand-soft text-brand",
              )}
              aria-hidden
            >
              ?
            </span>
          )}
        </span>
        {/* Name only — the description is dropped on picture cards so every
            card in a row ends at the same place. */}
        <span className="flex flex-1 items-center justify-center px-2.5 py-3">
          <span
            className={cn(
              "text-[min(3.4vw,14px)] desktop:text-[1.0625rem] font-bold",
              selected ? "text-brand" : "text-[#101828]",
            )}
          >
            {multiline(pick(option.label, locale))}
          </span>
        </span>
      </button>

    </div>
  );
}

/**
 * Five across on desktop, two on mobile — the layout both sections share.
 *
 * auto-rows-fr keeps every row the same height, so a card that wraps onto a
 * short last row still matches the ones above it.
 */
export function QuoteCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 desktop:auto-rows-fr desktop:grid-cols-5">
      {children}
    </div>
  );
}

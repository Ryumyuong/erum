"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Thumb } from "@/components/ui/Thumb";
import { Tooltip } from "./Tooltip";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { QuoteGroup } from "@/lib/data/quote";

// Fixed artwork for the two special, non-product options. The "card" entry is
// the wide (265:195) variant used by the 3-up groups; "square" is the 1:1.
const FIXED_IMAGE: Record<string, { square: string; card: string }> = {
  recommend: { square: "/quote/recommend.png", card: "/quote/recommend-wide.png" },
  none: { square: "/quote/none.png", card: "/quote/none.png" },
};

export function OptionCardGroup({
  group,
  value,
  onChange,
  columns = 3,
  bilingual = false,
}: {
  group: QuoteGroup;
  value: string;
  onChange: (id: string) => void;
  columns?: 3 | 4;
  /** In Korean locale, also show the English label in parentheses. */
  bilingual?: boolean;
}) {
  const locale = useLocale();

  const colClass =
    columns === 4
      ? "grid-cols-2 desktop:grid-cols-3 lg:grid-cols-4"
      : "grid-cols-2 desktop:grid-cols-3";
  // 4-up cards use a 1:1 image; 3-up cards use a 265:195 image.
  const ratio = columns === 4 ? "square" : "card";

  return (
    <div className={cn("grid gap-8", colClass)}>
      {group.options.map((option) => {
        const selected = value === option.id;
        const fixed = FIXED_IMAGE[option.id];
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={selected}
            className={cn(
              "flex w-full flex-col overflow-hidden rounded-[0.625rem] border bg-white text-left transition-colors",
              selected ? "border-[#FD7304]" : "border-[#DDDDDD]/[0.8667] hover:border-line",
            )}
          >
            {fixed ? (
              <FixedThumb src={fixed[ratio]} ratio={ratio} />
            ) : (
              <Thumb
                tone={option.tone ?? "from-neutral-200 to-neutral-50"}
                image={option.image}
                ratio={ratio}
                rounded={false}
                className="rounded-[0.625rem]"
              />
            )}

            <div className="relative flex items-center justify-center px-5 py-5">
              <span
                className={cn(
                  "absolute left-5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                  selected ? "border-[#FD7304]" : "border-[#D9D9D9]",
                )}
              >
                {selected && (
                  <span className="h-4 w-4 rounded-full bg-[#FD7304]" />
                )}
              </span>
              <span className="text-[min(3.64vw,15px)] desktop:text-[1.125rem] font-medium text-black">
                {bilingual &&
                locale === "ko" &&
                !option.recommend &&
                option.id !== "none" &&
                option.label.en &&
                option.label.en !== option.label.ko
                  ? `${option.label.ko} (${option.label.en})`
                  : pick(option.label, locale)}
              </span>
              {option.desc && (
                <Tooltip text={pick(option.desc, locale)} tone={option.tone} />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Fixed artwork for the special options. Falls back to the neutral placeholder
// while the image file is missing, instead of a broken-image icon.
function FixedThumb({ src, ratio }: { src: string; ratio: "square" | "card" }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <Thumb tone="from-neutral-200 to-neutral-50" ratio={ratio} rounded={false} className="rounded-[0.625rem]" />;
  }
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[0.625rem]",
        ratio === "card" ? "aspect-[265/195]" : "aspect-square",
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 990px) 50vw, 25vw"
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

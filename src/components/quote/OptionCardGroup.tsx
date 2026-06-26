"use client";

import { useLocale } from "next-intl";
import { Thumb } from "@/components/ui/Thumb";
import { Tooltip } from "./Tooltip";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { QuoteGroup } from "@/lib/data/quote";

export function OptionCardGroup({
  group,
  value,
  onChange,
}: {
  group: QuoteGroup;
  value: string;
  onChange: (id: string) => void;
}) {
  const locale = useLocale();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {group.options.map((option) => {
        const selected = value === option.id;
        return (
          <div key={option.id} className="relative">
            <button
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={selected}
              className={cn(
                "block w-full overflow-hidden rounded-[var(--radius-card)] border-2 transition-colors",
                selected ? "border-brand" : "border-transparent hover:border-line",
              )}
            >
              {option.recommend ? (
                <div className="flex aspect-square items-center justify-center bg-brand-soft">
                  <StarIcon
                    className={cn(
                      "h-8 w-8",
                      selected ? "text-brand" : "text-brand/50",
                    )}
                  />
                </div>
              ) : (
                <Thumb tone={option.tone ?? "from-neutral-200 to-neutral-50"} />
              )}
            </button>
            <div className="mt-1.5 flex items-center justify-center gap-1 px-1 text-center">
              <span
                className={cn(
                  "text-xs font-medium",
                  selected ? "text-ink" : "text-muted",
                )}
              >
                {pick(option.label, locale)}
              </span>
              {option.desc && (
                <Tooltip text={pick(option.desc, locale)} tone={option.tone} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 3l2.6 5.6 6.1.7-4.5 4.1 1.2 6L12 16.9 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3z"
        fill="currentColor"
      />
    </svg>
  );
}

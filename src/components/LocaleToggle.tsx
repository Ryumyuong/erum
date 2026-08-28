"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/i18n/actions";
import { locales, localeLabels, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LocaleToggle({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const active = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isDark = variant === "dark";

  function switchTo(next: Locale) {
    if (next === active || pending) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center",
        isDark ? "gap-1.5" : "rounded-full bg-[#F3F4F6] p-0.5",
        className,
      )}
    >
      {locales.map((loc) => {
        const isActive = loc === active;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchTo(loc)}
            aria-pressed={isActive}
            className={cn(
              "text-[min(3.4vw,14px)] max-[500px]:text-[min(2.67vw,11.21px)] desktop:text-[0.75rem] font-semibold transition-colors",
              isDark
                ? cn(
                    "rounded-[0.25rem] px-2.5 py-1 max-[500px]:px-3 max-[500px]:py-[3px]",
                    isActive
                      ? "bg-[#FD7304] text-white"
                      : "bg-[#1E2939] text-[#99A1AF] hover:text-white",
                  )
                : cn(
                    "rounded-full px-3 py-1",
                    isActive
                      ? "bg-white text-[#101828] shadow"
                      : "text-[#101828]/50 hover:text-[#101828]",
                  ),
            )}
          >
            {localeLabels[loc]}
          </button>
        );
      })}
    </div>
  );
}

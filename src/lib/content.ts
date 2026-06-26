import type { Locale } from "@/i18n/config";

/** A bilingual string. Mirrors the `*_en` / `*_kr` DB column pair. */
export type L = { en: string; ko: string };

/** Pick the value for the active locale, falling back to English. */
export function pick(value: L, locale: string): string {
  return (value as Record<string, string>)[locale] ?? value.en;
}

export type { Locale };

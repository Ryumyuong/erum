import Link from "next/link";
import { useTranslations } from "next-intl";
import { QUOTE_HREF } from "@/lib/site";

/**
 * Mobile-only sticky CTA. On small screens the header's quote button is
 * hidden, so this keeps the inquiry action visible at all times.
 */
export function StickyQuoteBar() {
  const t = useTranslations("nav");
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 backdrop-blur sm:hidden">
      <Link
        href={QUOTE_HREF}
        className="flex w-full items-center justify-center rounded-full bg-brand py-3 text-sm font-semibold text-white"
      >
        {t("quote")}
      </Link>
    </div>
  );
}

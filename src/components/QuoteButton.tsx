import Link from "next/link";
import { useTranslations } from "next-intl";
import { QUOTE_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Primary CTA — "Get a Quote". Always present in the header so the inquiry
 * action is reachable from every page (one of the 3 core requirements).
 */
export function QuoteButton({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const t = useTranslations("nav");
  return (
    <Link
      href={QUOTE_HREF}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-brand font-semibold text-white transition-colors hover:bg-brand-dark",
        size === "sm" ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-sm",
        className,
      )}
    >
      {t("quote")}
    </Link>
  );
}

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
  size?: "sm" | "md" | "lg";
}) {
  const t = useTranslations("nav");
  return (
    <Link
      href={QUOTE_HREF}
      className={cn(
        "inline-flex items-center justify-center rounded-[0.3569rem] bg-[#FD7304] font-extrabold text-white transition-colors hover:bg-brand-dark",
        size === "sm" && "px-5 max-[500px]:px-3 py-2 max-[500px]:py-1 text-[min(3.4vw,14px)] max-[500px]:text-[min(2.913vw,12.23px)] desktop:text-[1rem]",
        size === "md" && "px-6 py-3 text-[min(3.4vw,14px)] desktop:text-[1rem]",
        size === "lg" && "px-7 py-3.5 text-[min(3.64vw,15px)] desktop:text-lg",
        className,
      )}
    >
      {t("quote")}
    </Link>
  );
}

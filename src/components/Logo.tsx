import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * The two lockups are not interchangeable at a single height. The English one
 * is a big wordmark over a tagline; the Korean one packs 이룸디앤피 plus a much
 * smaller `iiroom / design & package` block into the same box, so it reads
 * lighter and needs a step more height to hold its own next to the nav.
 *
 * Hence a height class per variant per slot rather than one passed by the
 * caller — the sizes are a pair that has to be tuned together, so they live
 * together. Widths differ too, and next/image treats the declared dimensions as
 * the source's real size (getting them wrong reserves space at the wrong aspect
 * ratio), so each variant states its own. Rendered size stays CSS-driven.
 */
const VARIANTS = {
  ko: {
    src: "/logo/iiroom-ko.png",
    white: "/logo/iiroom-ko-white.png",
    width: 532,
    height: 240,
    sizes: { header: "h-9 desktop:h-10", footer: "h-11" },
  },
  en: {
    src: "/logo/iiroom-en.png",
    white: "/logo/iiroom-en-white.png",
    width: 586,
    height: 240,
    sizes: { header: "h-8 desktop:h-9", footer: "h-10" },
  },
} as const;

/**
 * iiroom design & package wordmark. The Korean lockup runs on ko pages and the
 * English one on en. Use `inverted` on dark backgrounds (footer / dark bands).
 */
export function Logo({
  inverted = false,
  size = "header",
  className,
  priority = false,
}: {
  inverted?: boolean;
  /** Picks the tuned height pair for this slot. */
  size?: "header" | "footer";
  /** Escape hatch — overrides the slot height entirely. */
  className?: string;
  priority?: boolean;
}) {
  const locale = useLocale();
  const variant = locale === "ko" ? VARIANTS.ko : VARIANTS.en;

  return (
    <Link
      href="/"
      aria-label="iiroom design & package — home"
      className="inline-flex items-center"
    >
      <Image
        src={inverted ? variant.white : variant.src}
        alt="iiroom design & package"
        width={variant.width}
        height={variant.height}
        priority={priority}
        className={cn("w-auto", className || variant.sizes[size])}
      />
    </Link>
  );
}

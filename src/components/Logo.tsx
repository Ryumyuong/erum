import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The two wordmark files were exported at different pixel sizes, so each
 * variant declares its own intrinsic width/height. next/image treats these as
 * the source's real dimensions — claiming 254x52 for the 170x35 white file
 * makes it generate a srcset wider than the source and reserve space at the
 * wrong aspect ratio. Rendered size stays CSS-driven (`w-auto` + a height
 * class), so the browser scales from the true ratio either way.
 */
const VARIANTS = {
  default: { src: "/logo/boxdle.png", width: 254, height: 52 },
  inverted: { src: "/logo/boxdle-white.png", width: 189, height: 39 },
} as const;

/**
 * BOXDLE wordmark. Use `inverted` on dark backgrounds (footer / dark bands).
 */
export function Logo({
  inverted = false,
  className,
  priority = false,
}: {
  inverted?: boolean;
  className?: string;
  priority?: boolean;
}) {
  const variant = inverted ? VARIANTS.inverted : VARIANTS.default;

  return (
    <Link href="/" aria-label="BOXDLE — home" className="inline-flex items-center">
      <Image
        src={variant.src}
        alt="BOXDLE"
        width={variant.width}
        height={variant.height}
        priority={priority}
        className={cn("w-auto", className || "h-7")}
      />
    </Link>
  );
}

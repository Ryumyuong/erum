import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  return (
    <Link href="/" aria-label="BOXDLE — home" className="inline-flex items-center">
      <Image
        src={inverted ? "/logo/boxdle-white.png" : "/logo/boxdle.png"}
        alt="BOXDLE"
        width={254}
        height={52}
        priority={priority}
        className={cn("h-7 w-auto", className)}
      />
    </Link>
  );
}

import Image from "next/image";
import { useLocale } from "next-intl";
import type { FigureKind } from "@/lib/size-guide";

/**
 * Intrinsic size of each drawing, so next/image reserves the right box.
 * The artwork carries its own labels, per locale — nothing is overlaid, which
 * is what used to drift out of place at other widths and in English.
 */
const ART: Record<Exclude<FigureKind, null>, { w: number; h: number }> = {
  box: { w: 1698, h: 1627 },
  rigid: { w: 1841, h: 1441 },
  bag: { w: 1606, h: 1200 },
  poly: { w: 1674, h: 1598 },
  opp: { w: 1293, h: 1512 },
};

/** Measurement diagram for the 사이즈 section, per package family. */
export function SizeDiagram({
  kind,
  className,
}: {
  kind: Exclude<FigureKind, null>;
  className?: string;
}) {
  const locale = useLocale();
  const art = ART[kind];

  return (
    <div className={className}>
      <Image
        src={`/quote/size/${kind}-${locale === "ko" ? "ko" : "en"}.png`}
        alt=""
        width={art.w}
        height={art.h}
        sizes="(min-width: 991px) 420px, 80vw"
        className="mx-auto h-auto w-full max-w-[24rem]"
      />
    </div>
  );
}

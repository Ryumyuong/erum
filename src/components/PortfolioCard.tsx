import Link from "next/link";
import { useLocale } from "next-intl";
import { PortfolioCardMedia } from "@/components/portfolio/PortfolioCardMedia";
import { pick } from "@/lib/content";
import { type PortfolioItem } from "@/lib/data/portfolio";

export function PortfolioCard({
  item,
  feature = false,
}: {
  item: PortfolioItem;
  /** The lead tile of the home grid — wide on mobile, 2x2 on desktop. */
  feature?: boolean;
}) {
  const locale = useLocale();

  return (
    <Link
      href={`/portfolio/${encodeURIComponent(item.itemNo)}`}
      className="group block"
      aria-label={pick(item.name, locale)}
    >
      <PortfolioCardMedia
        item={item}
        locale={locale}
        ratio={feature ? "feature" : "portfolioTile"}
      />
    </Link>
  );
}

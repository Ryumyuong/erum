import Link from "next/link";
import { useLocale } from "next-intl";
import { Thumb } from "@/components/ui/Thumb";
import { pick } from "@/lib/content";
import { getFilterLabel, type PortfolioItem } from "@/lib/data/portfolio";

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  const locale = useLocale();
  const typeLabel = getFilterLabel("packageType", item.packageType);

  return (
    <Link
      href={`/portfolio?item=${item.itemNo}`}
      className="group block"
      aria-label={pick(item.name, locale)}
    >
      <Thumb tone={item.tone} image={item.thumbnail}>
        {typeLabel && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {pick(typeLabel, locale)}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-2 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-sm font-semibold text-white">
            {pick(item.name, locale)}
          </p>
          <p className="mt-0.5 text-xs text-white/80">
            {pick(item.hover, locale)}
          </p>
        </div>
      </Thumb>
    </Link>
  );
}

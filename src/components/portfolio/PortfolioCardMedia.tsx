import Image from "next/image";
import { Thumb } from "@/components/ui/Thumb";
import { pick, type L } from "@/lib/content";
import { getFilterLabel, type PortfolioItem } from "@/lib/data/portfolio";

/**
 * Portfolio card media — a 640:418 product image that, on hover (parent
 * `.group`), reveals a dark overlay with the title, category tags, and a round
 * arrow button. Shared by the home preview and the portfolio grid.
 */
export function PortfolioCardMedia({
  item,
  locale,
  ratio = "portfolio",
}: {
  item: PortfolioItem;
  locale: string;
  ratio?: "square" | "portfolio" | "auto" | "feature" | "portfolioTile";
}) {
  // Prefer guide-driven category labels; fall back to the legacy columns.
  const catGroups = item.categoryLabels ?? [];
  const tags = (
    catGroups.length
      ? catGroups.slice(0, 2).map((g) => g.values[0])
      : [
          getFilterLabel("packageType", item.packageType),
          getFilterLabel("packageForm", item.packageForm),
        ]
  ).filter(Boolean) as L[];

  return (
    <Thumb
      tone={item.tone}
      image={item.thumbnail}
      ratio={ratio}
      rounded={false}
      className="rounded-[0.625rem] shadow-[0_10px_28px_rgba(0,0,0,0.1)] transition-[transform,box-shadow,filter] duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_22px_48px_rgba(0,0,0,0.22)]"
      imageClassName="transition-transform duration-500 ease-out group-hover:scale-105"
    >
      {/* Plus button image — revealed on hover */}
      <span className="absolute right-4 top-4 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Image
          src="/icons/portfolio-plus.png"
          alt=""
          width={104}
          height={104}
          className="h-8 w-8"
        />
      </span>

      {/* Info overlay — revealed on hover; bottom linear gradient (#000 70% → 0%) */}
      <div className="absolute inset-0 z-[5] flex flex-col justify-end rounded-[0.625rem] bg-gradient-to-t from-black/70 via-black/15 to-transparent p-6 max-[1440px]:p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <p className="line-clamp-2 text-[min(3.64vw,15px)] desktop:text-[1.125rem] max-[1440px]:desktop:text-[0.875rem] font-bold leading-tight text-white">
          {pick(item.name, locale)}
        </p>
        {tags.length > 0 && (
          <div className="mt-3 max-[1440px]:mt-1.5 flex flex-wrap gap-1.5 max-[1440px]:gap-1">
            {tags.map((tag) => (
              <span
                key={tag.en}
                className="rounded-full bg-[#FD7304]/90 px-2 py-0.5 text-[min(2.18vw,9px)] desktop:text-[0.625rem] max-[1440px]:desktop:text-[0.5625rem] font-medium text-white backdrop-blur-sm"
              >
                {pick(tag, locale)}
              </span>
            ))}
          </div>
        )}
      </div>
    </Thumb>
  );
}

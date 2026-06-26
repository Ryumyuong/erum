import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Thumb } from "@/components/ui/Thumb";
import { ArrowRightIcon } from "@/components/icons";
import { pick } from "@/lib/content";
import {
  getFilterLabel,
  type PortfolioItem,
} from "@/lib/data/portfolio";

/**
 * Presentational detail used by both the in-list modal and the dedicated
 * /portfolio/[id] page. Shows the spec table + image and the quote CTA that
 * carries the source item number into the inquiry form.
 */
export function PortfolioDetail({ item }: { item: PortfolioItem }) {
  const t = useTranslations("page.portfolio");
  const locale = useLocale();

  const typeLabel = getFilterLabel("packageType", item.packageType);
  const formLabel = getFilterLabel("packageForm", item.packageForm);
  const materialLabel = getFilterLabel("material", item.material);
  const printingLabels = item.printing
    .map((p) => getFilterLabel("printing", p))
    .filter(Boolean)
    .map((l) => pick(l!, locale))
    .join(", ");

  const rows: { label: string; value: string }[] = [
    { label: t("spec.itemNo"), value: item.itemNo },
    { label: t("spec.type"), value: typeLabel ? pick(typeLabel, locale) : "—" },
    { label: t("spec.form"), value: formLabel ? pick(formLabel, locale) : "—" },
    {
      label: t("spec.dimensions"),
      value: `${item.dims.l} × ${item.dims.w} × ${item.dims.h} mm`,
    },
    {
      label: t("spec.material"),
      value: materialLabel ? pick(materialLabel, locale) : "—",
    },
    { label: t("spec.printing"), value: printingLabels || "—" },
    { label: t("spec.coating"), value: pick(item.coating, locale) },
    { label: t("spec.finishing"), value: pick(item.finishing, locale) },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Thumb tone={item.tone} image={item.thumbnail} ratio="square" />

      <div className="flex flex-col">
        <span className="inline-block w-fit rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
          {typeLabel ? pick(typeLabel, locale) : item.itemNo}
        </span>
        <h2 className="mt-3 text-2xl font-bold">{pick(item.name, locale)}</h2>
        <p className="mt-1 text-sm text-muted">{pick(item.hover, locale)}</p>

        <table className="mt-6 w-full border-t border-line text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-line">
                <th className="w-2/5 py-2.5 pr-4 text-left font-medium text-muted">
                  {row.label}
                </th>
                <td className="py-2.5 font-medium">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Link
          href={`/quote?item=${encodeURIComponent(item.itemNo)}`}
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          {t("detailQuote")}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

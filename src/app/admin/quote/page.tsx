import { AdminShell, AdminPageHeader } from "@/components/admin/AdminShell";
import {
  QuoteFormManager,
  type OptionRow,
} from "@/components/admin/QuoteFormManager";
import { QuoteOptionManager } from "@/components/admin/QuoteOptionManager";
import {
  CATEGORY_OPTIONS,
  HEAR_OPTIONS,
  QUOTE_GROUPS,
  type OptionCard,
} from "@/lib/quote-options";
import { getQuoteFormOptionRows, getQuoteOptions } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

/** Slug used when seeding a group that has no rows yet. */
const slug = (en: string) =>
  en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default async function AdminQuotePage() {
  const [rows, quoteOptions] = await Promise.all([
    getQuoteFormOptionRows(),
    getQuoteOptions(),
  ]);

  const optionCards: Record<string, OptionCard[]> = {};
  for (const g of QUOTE_GROUPS) {
    optionCards[g.id] = (quoteOptions[g.id] ?? []).map((o) => ({
      id: o.id,
      tab: o.tab ?? "",
      label_en: o.label.en,
      label_kr: o.label.ko,
      desc_en: o.desc.en,
      desc_kr: o.desc.ko,
      image: o.image ?? "",
      kind: o.kind,
    }));
  }

  const grouped: Record<string, OptionRow[]> = {};
  for (const r of rows) {
    (grouped[r.group_id] ??= []).push({
      id: r.id,
      label_en: r.label_en,
      label_kr: r.label_kr,
    });
  }
  // Before migration 0026 is run the table is empty — show the built-in lists
  // so the editor isn't blank, and saving writes them for the first time.
  grouped.category ??= CATEGORY_OPTIONS.map((o) => ({
    id: slug(o.en),
    label_en: o.en,
    label_kr: o.ko,
  }));
  grouped.hearAbout ??= HEAR_OPTIONS.map((o) => ({
    id: slug(o.en),
    label_en: o.en,
    label_kr: o.ko,
  }));

  return (
    <AdminShell>
      <div className="container-admin pt-12 pb-12 desktop:pb-44">
        <AdminPageHeader title="견적문의 관리" />
        <div className="mb-6">
          <QuoteOptionManager options={optionCards} />
        </div>
        <QuoteFormManager options={grouped} />
      </div>
    </AdminShell>
  );
}

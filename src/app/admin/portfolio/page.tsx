import { AdminShell } from "@/components/admin/AdminShell";
import { PortfolioManager } from "@/components/admin/PortfolioManager";
import { FilterOptionManager } from "@/components/admin/FilterOptionManager";
import { createClient } from "@/lib/supabase/server";
import {
  getGuideTaxonomy,
  getUseFields,
  getPortfolioFilterGroups,
} from "@/lib/db/queries";

export const dynamic = "force-dynamic";

// The picture-card groups in the portfolio filter sidebar.
const IMAGE_GROUPS = new Set(["packageForm"]);

export default async function AdminPortfolioPage() {
  const supabase = await createClient();
  const [{ data }, taxonomy, useFields, filterGroups] = await Promise.all([
    supabase.from("portfolio").select("*").order("sort", { ascending: true }),
    getGuideTaxonomy(),
    getUseFields(),
    getPortfolioFilterGroups(),
  ]);
  const rows = (data ?? []).map((r) => ({
    ...r,
    categories: r.categories ?? {},
    images: r.images ?? [],
    hidden: r.hidden ?? false,
    sort: r.sort ?? 0,
  }));

  return (
    <AdminShell>
      <div className="container-admin pt-12 pb-12 desktop:pt-44 desktop:pb-44">
        <PortfolioManager rows={rows} taxonomy={taxonomy} useFields={useFields} />
        <div className="mt-10">
          <FilterOptionManager
            groups={filterGroups.map((g) => ({
              id: g.id,
              label: g.label,
              hasImage: IMAGE_GROUPS.has(g.id),
              options: g.options.map((o) => ({
                id: o.id,
                label_en: o.label.en,
                label_kr: o.label.ko,
                image: o.image ?? "",
              })),
            }))}
          />
        </div>
      </div>
    </AdminShell>
  );
}

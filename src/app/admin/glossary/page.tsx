import { AdminShell } from "@/components/admin/AdminShell";
import { GlossaryManager } from "@/components/admin/GlossaryManager";
import { createClient } from "@/lib/supabase/server";
import { glossaryCategories } from "@/lib/data/glossary";

export const dynamic = "force-dynamic";

export default async function AdminGlossaryPage() {
  const supabase = await createClient();
  const [{ data }, { data: catsData }] = await Promise.all([
    supabase
      .from("glossary")
      .select("*")
      .order("category", { ascending: true })
      .order("sort", { ascending: true }),
    supabase
      .from("glossary_category")
      .select("id, label_en, label_kr, sort")
      .order("sort", { ascending: true }),
  ]);

  // Fall back to the static categories when the DB returns none (e.g. RLS
  // blocks the read) so the admin always shows the 4 canonical categories.
  const categories =
    catsData && catsData.length > 0
      ? catsData
      : glossaryCategories.map((c, i) => ({
          id: c.id,
          label_en: c.label.en,
          label_kr: c.label.ko,
          sort: i + 1,
        }));

  return (
    <AdminShell>
      <div className="container-admin pt-12 pb-12 desktop:pt-44 desktop:pb-44">
        <GlossaryManager
          rows={(data ?? []).map((r) => ({
            ...r,
            when_used_en: r.when_used_en ?? "",
            when_used_kr: r.when_used_kr ?? "",
            recommended_for_en: r.recommended_for_en ?? "",
            recommended_for_kr: r.recommended_for_kr ?? "",
          }))}
          categories={categories}
        />
      </div>
    </AdminShell>
  );
}

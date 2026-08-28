import { AdminShell } from "@/components/admin/AdminShell";
import { GuideManager } from "@/components/admin/GuideManager";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminGuidePage() {
  const supabase = await createClient();
  const [{ data: sections }, { data: items }] = await Promise.all([
    supabase.from("guide_section").select("*").order("sort"),
    supabase
      .from("guide_item")
      .select("id, section_id, title_en, title_kr, subtitle, desc_en, desc_kr, tip_en, tip_kr, images")
      .order("sort"),
  ]);

  return (
    <AdminShell>
      <div className="container-admin pt-12 pb-12 desktop:pt-44 desktop:pb-44">
        <GuideManager sections={sections ?? []} items={items ?? []} />
      </div>
    </AdminShell>
  );
}

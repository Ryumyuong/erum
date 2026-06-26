import { AdminShell, AdminPageHeader } from "@/components/admin/AdminShell";
import { GuideManager } from "@/components/admin/GuideManager";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminGuidePage() {
  const supabase = await createClient();
  const [{ data: sections }, { data: items }] = await Promise.all([
    supabase.from("guide_section").select("id, key, title_en, title_kr").order("sort"),
    supabase
      .from("guide_item")
      .select("id, section_id, title_en, title_kr, subtitle, desc_en, desc_kr, tip_en, tip_kr")
      .order("sort"),
  ]);

  return (
    <AdminShell>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <AdminPageHeader title="제작가이드 관리" />
        <GuideManager sections={sections ?? []} items={items ?? []} />
      </div>
    </AdminShell>
  );
}

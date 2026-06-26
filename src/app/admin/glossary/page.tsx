import { AdminShell, AdminPageHeader } from "@/components/admin/AdminShell";
import { GlossaryManager } from "@/components/admin/GlossaryManager";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminGlossaryPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("glossary")
    .select("id, category, term_en, term_kr, desc_en, desc_kr, tags_en, tags_kr")
    .order("category", { ascending: true })
    .order("sort", { ascending: true });

  return (
    <AdminShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <AdminPageHeader title="용어사전 관리" />
        <GlossaryManager rows={data ?? []} />
      </div>
    </AdminShell>
  );
}

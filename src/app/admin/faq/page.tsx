import { AdminShell, AdminPageHeader } from "@/components/admin/AdminShell";
import { FaqManager } from "@/components/admin/FaqManager";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faq")
    .select("id, category, q_en, q_kr, a_en, a_kr")
    .order("category", { ascending: true })
    .order("sort", { ascending: true });

  return (
    <AdminShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <AdminPageHeader title="FAQ 관리" />
        <FaqManager rows={data ?? []} />
      </div>
    </AdminShell>
  );
}

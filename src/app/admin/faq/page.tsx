import { AdminShell } from "@/components/admin/AdminShell";
import { FaqManager } from "@/components/admin/FaqManager";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const supabase = await createClient();
  const [{ data }, { data: cats }] = await Promise.all([
    supabase
      .from("faq")
      .select("id, category, q_en, q_kr, a_en, a_kr, image")
      .order("category", { ascending: true })
      .order("sort", { ascending: true }),
    supabase
      .from("faq_category")
      .select("id, label_en, label_kr, sort")
      .order("sort", { ascending: true }),
  ]);

  return (
    <AdminShell>
      <div className="container-admin pt-12 pb-12 desktop:pt-44 desktop:pb-44">
        <FaqManager rows={data ?? []} categories={cats ?? []} />
      </div>
    </AdminShell>
  );
}

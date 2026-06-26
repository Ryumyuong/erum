import { AdminShell, AdminPageHeader } from "@/components/admin/AdminShell";
import { PortfolioManager } from "@/components/admin/PortfolioManager";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio")
    .select("*")
    .order("sort", { ascending: true });

  return (
    <AdminShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <AdminPageHeader title="포트폴리오 관리" />
        <PortfolioManager rows={data ?? []} />
      </div>
    </AdminShell>
  );
}

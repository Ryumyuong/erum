import { AdminShell, AdminPageHeader } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  const initial: Record<string, string> = {};
  for (const [k, v] of Object.entries(data ?? {})) {
    initial[k] = v == null ? "" : String(v);
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <AdminPageHeader title="사이트 설정" />
        <SettingsForm initial={initial} />
      </div>
    </AdminShell>
  );
}

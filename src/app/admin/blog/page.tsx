import { AdminShell, AdminPageHeader } from "@/components/admin/AdminShell";
import { BlogManager } from "@/components/admin/BlogManager";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog")
    .select("*")
    .order("published_at", { ascending: false });

  return (
    <AdminShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <AdminPageHeader title="블로그 관리" />
        <BlogManager rows={data ?? []} />
      </div>
    </AdminShell>
  );
}

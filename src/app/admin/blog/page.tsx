import { AdminShell } from "@/components/admin/AdminShell";
import { BlogManager } from "@/components/admin/BlogManager";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const [{ data }, { data: cats }] = await Promise.all([
    supabase.from("blog").select("*").order("published_at", { ascending: false }),
    supabase
      .from("blog_category")
      .select("id, label_en, label_kr, sort")
      .order("sort", { ascending: true }),
  ]);

  return (
    <AdminShell>
      <div className="container-admin pt-12 pb-12 desktop:pt-44 desktop:pb-44">
        <BlogManager rows={data ?? []} categories={cats ?? []} />
      </div>
    </AdminShell>
  );
}

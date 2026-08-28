import { AdminShell, AdminPageHeader } from "@/components/admin/AdminShell";
import { AboutManager } from "@/components/admin/AboutManager";
import { ClientsImageManager } from "@/components/admin/ClientsImageManager";
import { getAboutGallery } from "@/lib/db/queries";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const supabase = await createClient();
  const [slides, { data: settings }] = await Promise.all([
    getAboutGallery(),
    supabase.from("site_settings").select("*").eq("id", 1).single(),
  ]);

  return (
    <AdminShell>
      <div className="container-admin pt-12 pb-12 desktop:pb-44">
        <AdminPageHeader title="회사소개 관리" />
        <div className="space-y-6">
          <AboutManager
            slides={slides.map((s) => ({
              id: s.id,
              image: s.image ?? "",
              caption_en: s.caption.en,
              caption_kr: s.caption.ko,
            }))}
          />
          <ClientsImageManager settings={settings ?? {}} />
        </div>
      </div>
    </AdminShell>
  );
}

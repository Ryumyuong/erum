import { AdminShell, AdminPageHeader } from "@/components/admin/AdminShell";
import { HomeManager } from "@/components/admin/HomeManager";
import { getPortfolio, getSiteSettings } from "@/lib/db/queries";
import { pick } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [settings, portfolio] = await Promise.all([
    getSiteSettings(),
    getPortfolio(),
  ]);

  return (
    <AdminShell>
      <div className="container-admin pt-12 pb-12 desktop:pb-44">
        <AdminPageHeader title="메인 관리" />
        <HomeManager
          hero={settings?.homeHero ?? []}
          featured={settings?.homeFeatured ?? []}
          portfolio={portfolio.map((p) => ({
            itemNo: p.itemNo,
            name: pick(p.name, "ko"),
            thumbnail: p.thumbnail ?? null,
          }))}
        />
      </div>
    </AdminShell>
  );
}

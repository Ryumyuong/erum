import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ActivityList } from "@/components/admin/ActivityList";
import { getRecentActivity } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const activity = await getRecentActivity(50);

  return (
    <AdminShell>
      <div className="container-admin pt-12 pb-12 desktop:pt-44 desktop:pb-44">
        <Link href="/admin" className="text-sm font-medium text-[#6A7282] hover:text-brand">
          ← 대시보드
        </Link>
        <div className="mt-6 rounded-[0.625rem] bg-white p-8 shadow">
          <h1 className="mb-6 text-[1.5rem] font-bold text-[#101828]">최근 활동</h1>
          <ActivityList items={activity} />
        </div>
      </div>
    </AdminShell>
  );
}

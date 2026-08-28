import { AdminShell, AdminPageHeader } from "@/components/admin/AdminShell";
import { InquiryList, type Inquiry } from "@/components/admin/InquiryList";
import { createClient } from "@/lib/supabase/server";
import { getGuideTaxonomy } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const supabase = await createClient();
  const [{ data }, taxonomy] = await Promise.all([
    supabase
      .from("inquiry")
      .select("*")
      .order("created_at", { ascending: false }),
    getGuideTaxonomy(),
  ]);

  return (
    <AdminShell>
      <div className="container-admin pt-12 pb-12 desktop:pt-44 desktop:pb-44">
        <AdminPageHeader title="문의함 (Inquiry Inbox)" />
        <InquiryList inquiries={(data ?? []) as Inquiry[]} taxonomy={taxonomy} />
      </div>
    </AdminShell>
  );
}

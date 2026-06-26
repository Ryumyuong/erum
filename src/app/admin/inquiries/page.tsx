import { AdminShell, AdminPageHeader } from "@/components/admin/AdminShell";
import { InquiryStatusSelect } from "@/components/admin/InquiryStatusSelect";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function Detail({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-faint">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data: inquiries } = await supabase
    .from("inquiry")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <AdminPageHeader title="문의함 (Inquiry Inbox)" />

        {!inquiries || inquiries.length === 0 ? (
          <p className="rounded-2xl bg-white p-10 text-center text-sm text-muted shadow-sm">
            아직 문의가 없습니다.
          </p>
        ) : (
          <div className="space-y-4">
            {inquiries.map((q) => {
              const size = [q.size_w, q.size_d, q.size_h].filter(Boolean).join(" × ");
              return (
                <article key={q.id} className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold">{q.company}</h2>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-muted">
                          {q.type === "recommended" ? "추천" : "표준"}
                        </span>
                      </div>
                      <p className="text-sm text-muted">
                        {q.contact_name} · {q.email} · {q.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <InquiryStatusSelect id={q.id} value={q.status} />
                      <span className="text-xs text-faint">
                        {new Date(q.created_at).toLocaleString("ko-KR")}
                      </span>
                    </div>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-4 text-sm sm:grid-cols-3">
                    <Detail label="유입 제품" value={q.source_item_no} />
                    <Detail label="제품/카테고리" value={q.product} />
                    <Detail label="수량" value={q.quantity} />
                    <Detail label="패키지 종류" value={q.package_type} />
                    <Detail label="박스 구조" value={q.box_structure} />
                    <Detail label="재질" value={q.material} />
                    <Detail label="인쇄" value={q.printing} />
                    <Detail label="후가공" value={q.finishing} />
                    <Detail label="크기(mm)" value={size || null} />
                    <Detail label="예산" value={q.budget} />
                    <Detail label="희망 납기" value={q.lead_time} />
                    <Detail label="디자인 링크" value={q.design_link} />
                  </dl>

                  {q.message && (
                    <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm">
                      <p className="mb-1 text-xs text-faint">메시지</p>
                      <p className="whitespace-pre-wrap">{q.message}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}

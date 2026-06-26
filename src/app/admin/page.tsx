import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const quickLinks = [
  { href: "/admin/portfolio", label: "포트폴리오 관리" },
  { href: "/admin/inquiries", label: "문의 관리" },
  { href: "/admin/faq", label: "FAQ 관리" },
  { href: "/admin/glossary", label: "용어사전 관리" },
  { href: "/admin/blog", label: "블로그 관리" },
  { href: "/admin/guide", label: "제작가이드 관리" },
  { href: "/admin/language", label: "언어 콘텐츠 관리" },
  { href: "/admin/settings", label: "사이트 설정" },
];

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [newInq, portfolio, faq, blog, recent] = await Promise.all([
    supabase.from("inquiry").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("portfolio").select("*", { count: "exact", head: true }),
    supabase.from("faq").select("*", { count: "exact", head: true }),
    supabase.from("blog").select("*", { count: "exact", head: true }),
    supabase
      .from("inquiry")
      .select("company, created_at, status")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    { label: "신규 문의", value: newInq.count ?? 0 },
    { label: "전체 포트폴리오", value: portfolio.count ?? 0 },
    { label: "FAQ 항목", value: faq.count ?? 0 },
    { label: "블로그 게시물", value: blog.count ?? 0 },
  ];

  return (
    <AdminShell>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-10 text-center text-3xl font-bold">관리자 대시보드</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-muted">{s.label}</p>
              <p className="mt-1 text-3xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold">빠른 링크</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-line px-4 py-3 text-sm font-medium hover:border-brand hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold">최근 문의</h2>
          {recent.data && recent.data.length > 0 ? (
            <ul className="divide-y divide-line">
              {recent.data.map((r, i) => (
                <li key={i} className="flex items-center justify-between py-3 text-sm">
                  <span className="font-medium">{r.company}</span>
                  <span className="text-xs text-faint">
                    {new Date(r.created_at).toLocaleString("ko-KR")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-sm text-muted">아직 문의가 없습니다.</p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

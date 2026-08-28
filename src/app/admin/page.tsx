import Image from "next/image";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";
import { getRecentActivity } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

const quickLinks = [
  { href: "/admin/portfolio", label: "포트폴리오 관리", img: "/icons/admin-link-box.png" },
  { href: "/admin/inquiries", label: "문의 관리", img: "/icons/admin-link-mail.png" },
  { href: "/admin/faq", label: "FAQ 관리", img: "/icons/admin-link-faq.png" },
  { href: "/admin/glossary", label: "용어사전 관리", img: "/icons/admin-link-glossary.png" },
  { href: "/admin/blog", label: "블로그 관리", img: "/icons/admin-link-blog.png" },
  { href: "/admin/guide", label: "제작가이드 관리", img: "/icons/admin-link-guide.png" },
  { href: "/admin/language", label: "언어 콘텐츠 관리", img: "/icons/admin-link-lang.png" },
  { href: "/admin/settings", label: "사이트 설정", img: "/icons/admin-link-settings.png" },
];

/** "N분/시간/일 전" relative time (server-rendered). */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  return `${day}일 전`;
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [newInq, portfolio, faq, blog, activityAll] = await Promise.all([
    supabase.from("inquiry").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("portfolio").select("*", { count: "exact", head: true }),
    supabase.from("faq").select("*", { count: "exact", head: true }),
    supabase.from("blog").select("*", { count: "exact", head: true }),
    getRecentActivity(5),
  ]);

  const activity = activityAll.slice(0, 4);

  const stats = [
    { label: "신규 문의", value: newInq.count ?? 0, img: "/icons/admin-stat-mail.png" },
    { label: "전체 포트폴리오", value: portfolio.count ?? 0, img: "/icons/admin-stat-box.png" },
    { label: "FAQ 항목", value: faq.count ?? 0, img: "/icons/admin-stat-faq.png" },
    { label: "블로그 게시물", value: blog.count ?? 0, img: "/icons/admin-stat-blog.png" },
  ];

  return (
    <AdminShell>
      <div className="container-admin pt-12 pb-12 max-[500px]:pt-8 max-[500px]:pb-8 desktop:pt-44 desktop:pb-44">
        <h1 className="mb-16 text-center text-3xl font-bold">관리자 대시보드</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 max-[500px]:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between rounded-[0.625rem] bg-white p-6 max-[500px]:p-4 shadow"
            >
              <div>
                <p className="text-[0.875rem] text-[#4A5565]">{s.label}</p>
                <p className="mt-1 text-[1.875rem] font-bold text-[#101828]">{s.value}</p>
              </div>
              <Image src={s.img} alt="" width={96} height={96} className="h-14 w-14 shrink-0" />
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-12 max-[500px]:mt-6 rounded-[0.625rem] bg-white p-8 max-[500px]:p-5 shadow">
          <h2 className="mb-6 text-[1.25rem] font-bold text-[#101828]">빠른 링크</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-[0.625rem] border border-[#E5E7EB] px-4 py-3.5 text-[1rem] font-medium text-[#101828] transition-colors hover:border-brand hover:text-brand"
              >
                <Image src={link.img} alt="" width={32} height={32} className="h-6 w-6" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="mt-10 max-[500px]:mt-6 rounded-[0.625rem] bg-white p-8 max-[500px]:p-5 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[1.25rem] font-bold text-[#101828]">최근 활동</h2>
            <Link href="/admin/activity" className="text-[0.875rem] font-semibold text-brand hover:underline">
              전체보기
            </Link>
          </div>
          {activity.length > 0 ? (
            <ul className="space-y-6">
              {activity.map((a, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-[0.625rem] bg-[#F9FAFB] px-4 py-3.5"
                >
                  <Image src={a.img} alt="" width={96} height={96} className="h-11 w-11 shrink-0" />
                  <div>
                    <p className="text-[1rem] font-medium text-[#101828]">{a.text}</p>
                    <p className="text-[0.875rem] text-[#6A7282]">{timeAgo(a.at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-sm text-muted">아직 활동이 없습니다.</p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

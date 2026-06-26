import Link from "next/link";
import { AdminShell, AdminPageHeader } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Check = {
  label: string;
  href: string;
  total: number;
  missingEn: number;
  missingKr: number;
};

export default async function LanguagePage() {
  const supabase = await createClient();

  const [portfolio, faq, glossary, blog, guide] = await Promise.all([
    supabase.from("portfolio").select("name_en, name_kr"),
    supabase.from("faq").select("q_en, q_kr, a_en, a_kr"),
    supabase.from("glossary").select("term_en, term_kr, desc_en, desc_kr"),
    supabase.from("blog").select("title_en, title_kr"),
    supabase.from("guide_item").select("title_en, title_kr, desc_en, desc_kr"),
  ]);

  const blank = (v: unknown) => !v || String(v).trim() === "";

  const checks: Check[] = [
    {
      label: "포트폴리오",
      href: "/admin/portfolio",
      total: portfolio.data?.length ?? 0,
      missingEn: (portfolio.data ?? []).filter((r) => blank(r.name_en)).length,
      missingKr: (portfolio.data ?? []).filter((r) => blank(r.name_kr)).length,
    },
    {
      label: "FAQ",
      href: "/admin/faq",
      total: faq.data?.length ?? 0,
      missingEn: (faq.data ?? []).filter((r) => blank(r.q_en) || blank(r.a_en)).length,
      missingKr: (faq.data ?? []).filter((r) => blank(r.q_kr) || blank(r.a_kr)).length,
    },
    {
      label: "용어사전",
      href: "/admin/glossary",
      total: glossary.data?.length ?? 0,
      missingEn: (glossary.data ?? []).filter((r) => blank(r.term_en) || blank(r.desc_en)).length,
      missingKr: (glossary.data ?? []).filter((r) => blank(r.term_kr) || blank(r.desc_kr)).length,
    },
    {
      label: "블로그",
      href: "/admin/blog",
      total: blog.data?.length ?? 0,
      missingEn: (blog.data ?? []).filter((r) => blank(r.title_en)).length,
      missingKr: (blog.data ?? []).filter((r) => blank(r.title_kr)).length,
    },
    {
      label: "제작가이드",
      href: "/admin/guide",
      total: guide.data?.length ?? 0,
      missingEn: (guide.data ?? []).filter((r) => blank(r.title_en) || blank(r.desc_en)).length,
      missingKr: (guide.data ?? []).filter((r) => blank(r.title_kr) || blank(r.desc_kr)).length,
    },
  ];

  function status(missing: number) {
    return missing === 0 ? (
      <span className="font-medium text-green-600">완료</span>
    ) : (
      <span className="font-medium text-red-500">{missing}개 누락</span>
    );
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <AdminPageHeader title="언어 콘텐츠 관리" />
        <p className="mb-6 text-sm text-muted">
          각 콘텐츠의 영문(EN)·국문(KR) 입력 상태입니다. 누락 항목은 해당 관리 화면에서 채워주세요.
        </p>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs text-faint">
              <tr>
                <th className="px-4 py-3 font-medium">콘텐츠</th>
                <th className="px-4 py-3 font-medium">전체</th>
                <th className="px-4 py-3 font-medium">EN 상태</th>
                <th className="px-4 py-3 font-medium">KR 상태</th>
                <th className="px-4 py-3 text-right font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((c) => (
                <tr key={c.href} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium">{c.label}</td>
                  <td className="px-4 py-3 text-muted">{c.total}</td>
                  <td className="px-4 py-3">{status(c.missingEn)}</td>
                  <td className="px-4 py-3">{status(c.missingKr)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={c.href} className="text-brand hover:underline">
                      편집
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

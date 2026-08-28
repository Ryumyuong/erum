import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { BlogList } from "@/components/blog/BlogList";
import { getBlogPosts, getBlogCategories } from "@/lib/db/queries";


export async function generateMetadata(): Promise<Metadata> {
  const ko = (await getLocale()) === "ko";
  return pageMeta({
    title: ko ? "블로그 — 패키지 제작 인사이트" : "Blog — Packaging insights",
    description: ko ? "맞춤 패키지 기획부터 인쇄·후가공까지, 브랜드에 도움이 되는 제작 노하우와 사례를 전합니다." : "Practical know-how and case studies on planning, printing and finishing custom packaging.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const t = await getTranslations("page.blog");
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
  ]);
  return (
    <div className="pb-44">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <BlogList posts={posts} categories={categories} />
    </div>
  );
}

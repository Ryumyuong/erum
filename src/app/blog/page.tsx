import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { BlogList } from "@/components/blog/BlogList";
import { getBlogPosts } from "@/lib/db/queries";

export default async function BlogPage() {
  const t = await getTranslations("page.blog");
  const posts = await getBlogPosts();
  return (
    <div className="pb-20">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <BlogList posts={posts} />
    </div>
  );
}

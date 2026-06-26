import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PortfolioDetail } from "@/components/portfolio/PortfolioDetail";
import { getPortfolioItem } from "@/lib/db/queries";

export default async function PortfolioItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPortfolioItem(id);
  if (!item) notFound();

  const t = await getTranslations("page.portfolio");

  return (
    <div className="container-page py-12 md:py-16">
      <Link
        href="/portfolio"
        className="text-sm font-medium text-muted hover:text-brand"
      >
        ← {t("back")}
      </Link>
      <div className="mt-6">
        <PortfolioDetail item={item} />
      </div>
    </div>
  );
}

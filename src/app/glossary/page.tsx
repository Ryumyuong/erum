import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlossaryList } from "@/components/glossary/GlossaryList";
import { getGlossaryTerms, getGlossaryCategories } from "@/lib/db/queries";


export async function generateMetadata(): Promise<Metadata> {
  const ko = (await getLocale()) === "ko";
  return pageMeta({
    title: ko ? "패키지 용어사전" : "Packaging Glossary",
    description: ko ? "단상자, 싸바리상자, 크라프트지, 별색, 금박 등 패키지 제작에서 쓰이는 용어를 사진과 함께 설명합니다." : "Folding carton, rigid box, kraft paper, spot color, foil stamping — packaging terms explained with photos.",
    path: "/glossary",
  });
}

export default async function GlossaryPage() {
  const t = await getTranslations("page.glossary");
  const [terms, categories] = await Promise.all([
    getGlossaryTerms(),
    getGlossaryCategories(),
  ]);
  return (
    <div className="pb-44">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        subtitleSize="text-[min(4.13vw,17px)] max-[500px]:text-[min(3.4vw,14.28px)] desktop:text-[1rem]"
      />
      <GlossaryList terms={terms} categories={categories} />
    </div>
  );
}

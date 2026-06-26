import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlossaryList } from "@/components/glossary/GlossaryList";
import { getGlossaryTerms } from "@/lib/db/queries";

export default async function GlossaryPage() {
  const t = await getTranslations("page.glossary");
  const terms = await getGlossaryTerms();
  return (
    <div className="pb-20">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <GlossaryList terms={terms} />
    </div>
  );
}

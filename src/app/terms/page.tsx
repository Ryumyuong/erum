import { useTranslations } from "next-intl";
import { PageStub } from "@/components/PageStub";

export default function TermsPage() {
  const t = useTranslations("footer");
  return <PageStub title={t("terms")} phase="P5" />;
}

import { useTranslations } from "next-intl";
import { PageStub } from "@/components/PageStub";

export default function PrivacyPage() {
  const t = useTranslations("footer");
  return <PageStub title={t("privacy")} phase="P5" />;
}

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Logo } from "@/components/Logo";
import { LocaleToggle } from "@/components/LocaleToggle";
import { navItems, siteContact } from "@/lib/site";

const resourceKeys = ["faq", "glossary", "blog"] as const;
const menuKeys = ["about", "portfolio", "guide"] as const;

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const address = locale === "ko" ? siteContact.addressKo : siteContact.addressEn;

  return (
    <footer className="mt-auto bg-navy text-gray-300">
      <div className="container-page grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
            {t("brand.tagline")}
          </p>
          <LocaleToggle className="mt-5 bg-white/10" />
        </div>

        {/* Menu */}
        <FooterCol title={t("footer.menu")}>
          <FooterLink href="/">{t("footer.home")}</FooterLink>
          {menuKeys.map((k) => (
            <FooterLink key={k} href={hrefFor(k)}>
              {t(`nav.${k}`)}
            </FooterLink>
          ))}
        </FooterCol>

        {/* Resources */}
        <FooterCol title={t("footer.resources")}>
          {resourceKeys.map((k) => (
            <FooterLink key={k} href={hrefFor(k)}>
              {t(`nav.${k}`)}
            </FooterLink>
          ))}
          <FooterLink href="/quote">{t("common.contactUs")}</FooterLink>
        </FooterCol>

        {/* Contact */}
        <FooterCol title={t("footer.contact")}>
          <p className="text-sm">Email: {siteContact.email}</p>
          <p className="text-sm">Tel: {siteContact.phone}</p>
          <p className="text-sm">WhatsApp: {siteContact.whatsapp}</p>
          <p className="mt-2 text-sm font-medium text-gray-200">
            {t("footer.businessHours")}
          </p>
          <p className="text-sm">{t("footer.businessHoursValue")}</p>
          <p className="text-sm">{t("footer.lunch")}</p>
          <p className="text-sm">{t("footer.closed")}</p>
          <p className="mt-2 text-sm font-medium text-gray-200">
            {t("footer.location")}
          </p>
          <p className="text-sm">{address}</p>
        </FooterCol>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
          <div>
            <p>
              {locale === "ko" ? siteContact.companyKo : siteContact.companyEn} | CEO:{" "}
              {locale === "ko" ? siteContact.ceoKo : siteContact.ceoEn} | Biz. Reg.{" "}
              {siteContact.bizNo}
            </p>
            <p className="mt-1">© 2026 BOXDLE. {t("footer.rights")}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms" className="hover:text-gray-300">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function hrefFor(key: string) {
  return navItems.find((n) => n.key === key)?.href ?? "/";
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-gray-400 transition-colors hover:text-white">
      {children}
    </Link>
  );
}

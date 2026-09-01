import { Fragment } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Logo } from "@/components/Logo";
import { LocaleToggle } from "@/components/LocaleToggle";
import { navItems } from "@/lib/site";
import type { Contact } from "@/lib/contact";

const resourceKeys = ["faq", "glossary", "blog"] as const;
const menuKeys = ["about", "portfolio", "guide"] as const;

export function Footer({ contact }: { contact: Contact }) {
  const t = useTranslations();
  const locale = useLocale();
  const address = locale === "ko" ? contact.addressKo : contact.addressEn;

  return (
    <footer className="mt-auto bg-[#101828] text-[#99A1AF]">
      <div className="container-page grid grid-cols-2 gap-10 py-24 desktop:grid-cols-4">
        {/* Brand */}
        <div className="col-span-2 desktop:col-span-1">
          <Logo inverted size="footer" />
          <p className="mt-4 max-w-xs text-[min(3.64vw,15px)] desktop:text-[0.875rem] leading-relaxed text-[#99A1AF]">
            {t("brand.tagline")
              .split("|")
              .map((line, i, arr) => (
                <Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </Fragment>
              ))}
          </p>
          <LocaleToggle variant="dark" className="mt-5" />
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
        <FooterCol title={t("footer.contact")} wide>
          {/* Compact contact block — one line per fact, an icon instead of a
              label, the way the reference footer reads. */}
          <p className="text-[min(3.64vw,15px)] desktop:text-[0.875rem]">
            <a href={`mailto:${contact.email}`} className="hover:text-brand">
              {contact.email}
            </a>
            <span className="mx-2 text-white/30">/</span>
            <a
              href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
              className="whitespace-nowrap hover:text-brand"
            >
              {contact.phone}
            </a>
          </p>

          <p className="mt-3 break-keep text-[min(3.64vw,15px)] desktop:text-[0.875rem]">
            {address}
          </p>
          <p className="text-[min(3.64vw,15px)] desktop:text-[0.875rem]">
            {t("footer.businessHoursValue")}
          </p>
          <p className="text-[min(3.64vw,15px)] desktop:text-[0.875rem]">
            {t("footer.closed")}
          </p>

          <div className="mt-3 space-y-0.5 text-[min(3.64vw,15px)] desktop:text-[0.875rem]">
            {contact.instagram && (
              <p>
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                  {t("footer.instagram")}
                </a>
              </p>
            )}
            {contact.blog && (
              <p>
                <a href={contact.blog} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                  {t("footer.blog")}
                </a>
              </p>
            )}
            {contact.kakao && (
              <p>
                <a href={contact.kakao} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                  {t("footer.kakao")}
                </a>
              </p>
            )}
          </div>

          {/* Admin entry — the channels are listed above as text. */}
          <div className="mt-4">
            <Link
              href="/admin/login"
              className="ml-1 text-[min(2.91vw,12px)] desktop:text-[0.75rem] text-[#6A7282] transition-colors hover:text-[#99A1AF]"
            >
              {t("footer.admin")}
            </Link>
          </div>
        </FooterCol>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1E2939]">
        <div className="container-page flex flex-col gap-3 pt-8 pb-24 text-[min(2.91vw,12px)] desktop:text-[0.75rem] text-[#6A7282] desktop:flex-row desktop:items-center desktop:justify-between">
          <div>
            <p>
              {locale === "ko" ? contact.companyKo : contact.companyEn} |{" "}
              {t("footer.ceo")}:{" "}
              {locale === "ko" ? contact.ceoKo : contact.ceoEn}
            </p>
            <p className="mt-1">
              {t("footer.bizReg")}: {contact.bizNo}
            </p>
            <p className="mt-1">© 2026 BOXDLE. {t("footer.rights")}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[#99A1AF]">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms" className="hover:text-[#99A1AF]">
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
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  /** Full width on the 2-column phone grid — contact lines wrap badly in half. */
  wide?: boolean;
}) {
  return (
    <div className={wide ? "col-span-2 desktop:col-span-1" : undefined}>
      <h3 className="mb-4 text-[min(4.13vw,17px)] desktop:text-[1rem] font-semibold text-white">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[min(3.64vw,15px)] desktop:text-[0.875rem] text-[#99A1AF] transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}

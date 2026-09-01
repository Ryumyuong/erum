import { siteUrl, SITE_NAME } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import type { Contact } from "@/lib/contact";

/**
 * Organization JSON-LD. Lets search engines attach the company name, logo,
 * address and contact details to the site rather than guessing them, which is
 * what feeds the knowledge panel and rich results.
 */
export function StructuredData({
  contact,
  locale,
}: {
  contact: Contact;
  locale: string;
}) {
  const ko = locale === "ko";
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: ko ? contact.companyKo : contact.companyEn,
    url: siteUrl,
    logo: `${siteUrl}/logo/iiroom-en.png`,
    email: contact.email,
    telephone: contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: ko ? contact.addressKo : contact.addressEn,
      addressCountry: "KR",
    },
    foundingDate: "1984",
    sameAs: [contact.instagram, contact.blog].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: contact.email,
      telephone: contact.phone,
      availableLanguage: ["ko", "en"],
    },
  };

  return <JsonLd data={data} />;
}

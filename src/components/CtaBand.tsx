import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { QUOTE_HREF } from "@/lib/site";
import { getContact } from "@/lib/contact";

/**
 * Shared "Ready to create your custom packaging?" CTA band — used on the home
 * page and on content pages (FAQ etc.). White background, 3 contact buttons.
 */
export async function CtaBand() {
  const t = await getTranslations("home");
  const contact = await getContact();
  return (
    <section className="bg-[#FCF8F6] desktop:bg-white">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-7 px-[19.95vw] py-12 text-center desktop:gap-14 desktop:px-[9.9375rem] desktop:py-44">
        <p className="w-full text-[min(5.34vw,22.4px)] desktop:text-[2.5rem] leading-[1.2] text-black">
          <span className="font-medium">{t("ctaLabel")}</span>
          <br />
          <span className="font-extrabold">
            {t("ctaHeading")
              .split("|")
              .map((seg, i, arr) => (
                <Fragment key={i}>
                  {seg}
                  {/* mobile-only break: 3 lines on mobile, one line on desktop.
                      Desktop needs the space the break stood in for, otherwise
                      the segments run together ("패키지를제작할"). */}
                  {i < arr.length - 1 && (
                    <>
                      <br className="desktop:hidden" />
                      <span className="hidden desktop:inline"> </span>
                    </>
                  )}
                </Fragment>
              ))}
          </span>
        </p>
        <div className="grid w-full max-w-5xl gap-4 desktop:grid-cols-3">
          <CtaButton
            href={QUOTE_HREF}
            label={t("ctaQuote")}
            color="#FD7304"
            arrow="/icons/arrow-orange.png"
          />
          <CtaButton
            href={contact.kakao}
            label={t("ctaKakao")}
            color="#101828"
            external
          />
          <CtaButton
            href={`mailto:${contact.email}`}
            label={t("ctaEmail")}
            color="#1E1E1E"
            external
          />
        </div>
      </div>
    </section>
  );
}

function CtaButton({
  href,
  label,
  color,
  arrow = "/icons/cta-arrow.png",
  external,
}: {
  href: string;
  label: string;
  color: string;
  arrow?: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      /* desktop:h-[3.75rem] is the shared bottom-CTA height across pages —
         the aspect ratio made the height follow the column width, which is
         why every page ended up with a different one. */
      className="flex aspect-[324.81/80] items-center justify-between rounded-[0.4844rem] pl-8 pr-6 text-left text-[min(4.85vw,20px)] max-[500px]:text-[min(4.126vw,17.33px)] font-bold text-white desktop:aspect-auto desktop:h-[3.75rem] desktop:text-[1.25rem]"
      style={{ backgroundColor: color }}
    >
      <span>{label}</span>
      <Image src={arrow} alt="" width={62} height={62} className="h-8 w-8 shrink-0" />
    </Link>
  );
}

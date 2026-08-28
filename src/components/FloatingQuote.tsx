import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { QUOTE_HREF } from "@/lib/site";

/**
 * Global floating quote action (bottom-right). One tap to the inquiry form on
 * every page and screen size. Styling per the provided mockup spec.
 */
export function FloatingQuote() {
  const t = useTranslations("nav");
  return (
    <Link
      href={QUOTE_HREF}
      aria-label={t("quote")}
      className="floating-quote fixed bottom-16 right-16 max-[990px]:bottom-5 max-[990px]:right-5 max-[500px]:bottom-4 max-[500px]:right-4 z-40 flex flex-col items-center justify-center gap-1.5 rounded-[1.375rem] bg-brand transition-transform hover:scale-105 hover:bg-brand-dark desktop:bottom-24 desktop:right-24"
      style={{ boxShadow: "0px 7px 5.5px -4px #C65800A8" }}
    >
      <Image
        src="/icons/quote-float.png"
        alt=""
        width={58}
        height={58}
        className="floating-quote-icon object-contain"
      />
      <span className="floating-quote-label font-semibold leading-none text-[#FFF8F2]">
        {t("quoteShort")}
      </span>
    </Link>
  );
}

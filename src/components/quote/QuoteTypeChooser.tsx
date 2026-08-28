import { Fragment } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

/** `|` in the copy marks a deliberate line break. */
function lines(text: string) {
  return text.split("|").map((line, i, arr) => (
    <Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </Fragment>
  ));
}

/**
 * Landing step for /quote: pick standard or easy before seeing a form.
 * The forms themselves are reached with ?type=… so existing deep links
 * (?item=, ?mode=recommended) keep working.
 */
export async function QuoteTypeChooser({ itemQuery }: { itemQuery: string }) {
  const t = await getTranslations("page.quote.chooser");

  const cards = [
    {
      href: `/quote?type=standard${itemQuery}`,
      title: t("standardTitle"),
      desc: t("standardDesc"),
      primary: true,
      // Checklist — you pick the specs yourself.
      icon: (
        <>
          <path d="M9 5h10M9 12h10M9 19h10" />
          <path d="m3 5 1.5 1.5L7 4" />
          <path d="m3 12 1.5 1.5L7 11" />
          <path d="m3 19 1.5 1.5L7 18" />
        </>
      ),
    },
    {
      href: `/quote?type=recommended${itemQuery}`,
      title: t("easyTitle"),
      desc: t("easyDesc"),
      primary: false,
      // Sparkle — we suggest the specs for you.
      icon: (
        <>
          <path d="M12 3l1.9 4.8L18.7 9.7 13.9 11.6 12 16.4l-1.9-4.8L5.3 9.7l4.8-1.9z" />
          <path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
        </>
      ),
    },
  ];

  return (
    <div className="container-admin pb-16 desktop:pb-22">
      <h1 className="text-center text-[min(6.8vw,28px)] max-[500px]:text-[min(5.825vw,24.47px)] desktop:text-[2.25rem] font-bold text-[#101828]">
        {t("title")}
      </h1>
      <p className="mx-auto mt-4 max-w-3xl text-center text-[min(3.64vw,15px)] desktop:text-[1.0625rem] leading-relaxed text-[#364153]">
        {t("lead")}
        <br />
        {t("lead2")}
      </p>

      <div className="mt-20 desktop:mt-32 grid gap-5 desktop:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={
              "group flex flex-col items-center rounded-[var(--radius-card)] border-2 bg-white p-8 desktop:p-10 text-center transition-colors " +
              (c.primary
                ? "border-brand hover:bg-brand-soft"
                : "border-[#D1D5DC] hover:border-brand")
            }
          >
            <span
              className={
                "mb-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-colors " +
                (c.primary
                  ? "bg-brand-soft text-brand"
                  : "bg-[#F3F4F6] text-[#6A7282] group-hover:bg-brand-soft group-hover:text-brand")
              }
              aria-hidden
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {c.icon}
              </svg>
            </span>
            <span className="text-[min(4.85vw,20px)] desktop:text-[1.5rem] font-bold text-[#101828] group-hover:text-brand">
              {c.title}
            </span>
            <span className="mt-3 text-[min(3.4vw,14px)] desktop:text-[1rem] leading-relaxed text-[#6A7282]">
              {lines(c.desc)}
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-8 flex items-start gap-2 rounded-[0.625rem] border border-[#E4E4E4] bg-[#F9FAFB] px-5 py-4 text-[min(3.4vw,14px)] desktop:text-[1rem] leading-relaxed text-[#364153]">
        <span
          aria-hidden
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6A7282] text-xs font-bold text-white"
        >
          i
        </span>
        <span>{lines(t("note"))}</span>
      </p>
    </div>
  );
}

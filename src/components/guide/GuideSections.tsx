"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Thumb } from "@/components/ui/Thumb";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { GuideSection } from "@/lib/data/guide";

/**
 * Guide sections renderer.
 * - Desktop (≥lg): every section is stacked and visible; the sticky sidebar
 *   (GuideNav) scroll-spies between them.
 * - Mobile: a horizontal tab bar shows one section at a time; the others are
 *   hidden (still rendered for the desktop layout, revealed via `lg:block`).
 */
export function GuideSections({ sections }: { sections: GuideSection[] }) {
  const locale = useLocale();
  const [active, setActive] = useState(sections[0]?.id);

  return (
    <div>
      {/* Mobile tab bar */}
      <div className="mb-24 grid grid-cols-3 gap-2 desktop:hidden">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActive(section.id)}
            className={cn(
              "rounded-[5px] border px-2 py-3 max-[500px]:py-2 text-center text-[min(4.13vw,17px)] max-[500px]:text-[min(3.4vw,14.28px)] font-bold transition-colors",
              active === section.id
                ? "border-[#FD7304] bg-white text-[#FD7304]"
                : "border-[#D0D0D0] bg-white text-[#101828]/60",
            )}
          >
            {pick(section.title, locale)}
          </button>
        ))}
      </div>

      {/* Sections — desktop: all stacked; mobile: only the active one */}
      {/* Halved from space-y-48, and now the shared value across guide /
          FAQ / glossary so the section rhythm matches between pages. */}
      <div className="desktop:space-y-24">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className={cn(
              "scroll-mt-28",
              section.id !== active && "hidden desktop:block",
            )}
          >
            <h2 className="text-[min(6.55vw,27px)] max-[500px]:text-[min(5.34vw,22.4px)] desktop:text-[2rem] font-bold text-black">
              {pick(section.title, locale)}
            </h2>
            {section.description && (
              <p className="mt-3 max-w-4xl text-[min(3.4vw,14px)] desktop:text-[1.0625rem] leading-relaxed text-black/60">
                {pick(section.description, locale)}
              </p>
            )}
            <div className="mb-6 mt-5 border-b border-black/30" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 desktop:grid-cols-3 desktop:gap-x-8 desktop:gap-y-12">
              {section.items.map((item, i) => (
                <article key={i}>
                  <Thumb
                    tone={item.tone}
                    image={item.image}
                    ratio="wide"
                    rounded={false}
                    className="rounded-[0.625rem]"
                  />
                  <div className="mt-4 flex items-baseline gap-2.5">
                    <h3 className="text-[min(5.34vw,22px)] max-[500px]:text-[min(4.248vw,17.84px)] desktop:text-[1.625rem] font-bold text-black">
                      {pick(item.title, locale)}
                    </h3>
                    {item.subtitle && (
                      <span className="text-[min(2.91vw,12px)] desktop:text-[0.875rem] text-[#FD7304]">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[min(3.64vw,15px)] max-[500px]:text-[min(3.155vw,13.25px)] desktop:text-[1.125rem] leading-relaxed text-black/70">
                    {pick(item.desc, locale)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

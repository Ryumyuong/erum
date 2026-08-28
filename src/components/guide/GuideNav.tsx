"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { pick, type L } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Sticky in-page guide navigation with scroll-spy: the link for the section
 * currently in view is highlighted.
 */
export function GuideNav({ sections }: { sections: { id: string; title: L }[] }) {
  const locale = useLocale();
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="hidden desktop:block">
      <div className="sticky top-[calc(var(--spacing-header)+1.5rem)] rounded-[0.625rem] border border-line p-3">
        <p className="px-3 pb-3 pt-1 text-[min(2.43vw,10px)] desktop:text-[0.75rem] font-medium uppercase tracking-[0.15em] text-[#6A7282]">
          Guide
        </p>
        <ul className="space-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={cn(
                  "block rounded-[0.3125rem] px-3 py-2 text-[min(2.91vw,12px)] desktop:text-[0.875rem] font-extrabold transition-colors",
                  active === section.id
                    ? "bg-[#FD7304] text-white"
                    : "text-[#364153] hover:bg-cream",
                )}
              >
                {pick(section.title, locale)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

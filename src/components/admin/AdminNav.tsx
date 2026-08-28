"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/home", label: "메인" },
  { href: "/admin/about", label: "회사소개" },
  { href: "/admin/portfolio", label: "포트폴리오" },
  { href: "/admin/guide", label: "제작가이드" },
  { href: "/admin/blog", label: "블로그" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/glossary", label: "용어사전" },
  { href: "/admin/quote", label: "견적문의" },
  { href: "/admin/inquiries", label: "문의" },
  { href: "/admin/language", label: "언어" },
  { href: "/admin/settings", label: "설정" },
];

export function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  // On mobile this tab strip scrolls horizontally, and a navigation remounts it
  // with scrollLeft back at 0 — so tapping a tab far to the right (e.g. 언어)
  // snapped the strip to the far left and hid the tab you just picked. Re-centre
  // the active tab after each route change. Setting scrollLeft directly (rather
  // than scrollIntoView) keeps the page's own scroll position untouched.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const active = activeRef.current;
    if (!scroller || !active) return;
    const target =
      active.offsetLeft - (scroller.clientWidth - active.offsetWidth) / 2;
    scroller.scrollLeft = Math.max(0, target);
  }, [pathname]);

  return (
    <nav className="sticky top-[var(--spacing-header)] z-30 border-b border-line bg-white">
      <div
        ref={scrollerRef}
        className="container-page relative flex gap-1 overflow-x-auto py-2 max-[500px]:py-1"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            ref={isActive(item.href) ? activeRef : undefined}
            className={cn(
              "shrink-0 rounded-[0.5rem] px-3.5 py-2 max-[500px]:px-2.5 max-[500px]:py-1 text-[0.9375rem] max-[500px]:text-[0.8125rem] font-semibold transition-colors",
              isActive(item.href)
                ? "bg-[#FD7304] text-white"
                : "text-[#4A5565] hover:bg-[#F3F4F6] hover:text-ink",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

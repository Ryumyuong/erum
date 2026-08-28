"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { LocaleToggle } from "@/components/LocaleToggle";
import { QuoteButton } from "@/components/QuoteButton";
import { navItems, QUOTE_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Flag the open drawer on <body> so the floating quote button — which lives
  // outside this component — can hide itself behind it.
  useEffect(() => {
    if (!open) return;
    document.body.dataset.menuOpen = "true";
    return () => {
      delete document.body.dataset.menuOpen;
    };
  }, [open]);

  // On the homepage the header floats transparently over the hero image and
  // only gains a solid background once the user scrolls past the top.
  const isHome = pathname === "/";
  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Transparent overlay mode: home page, at the top, mobile menu closed.
  const overlay = isHome && !scrolled && !open;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        overlay
          ? "bg-transparent"
          : "border-b border-line bg-white/60 backdrop-blur",
      )}
    >
      <div className="container-page container-header relative flex h-[var(--spacing-header)] items-center justify-between gap-6">
        {/* Gaps tighten below 1360px so the nav still fits on one line once the
            container gutter is gone (see .container-header). */}
        <div className="flex min-w-0 items-center gap-20 max-[1440px]:gap-6">
          {/* Mobile menu toggle (left) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("header.closeMenu") : t("header.openMenu")}
            aria-expanded={open}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-md desktop:hidden",
              overlay ? "text-white" : "text-ink",
            )}
          >
            {open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <Image
                src="/icons/hamburger.png"
                alt=""
                width={46}
                height={39}
                className={cn("h-5 w-auto", overlay && "invert")}
              />
            )}
          </button>

          {/* Desktop logo */}
          <div className="hidden desktop:block">
            <Logo priority inverted={overlay} className="h-5" />
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 max-[1440px]:gap-4 desktop:flex">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "whitespace-nowrap text-[min(3.4vw,14px)] desktop:text-[1rem] max-[1440px]:desktop:text-[0.9375rem] font-medium transition-colors hover:text-brand",
                  isActive(item.href)
                    ? "text-brand"
                    : overlay
                      ? "text-white"
                      : "text-black",
                )}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile logo (centered) */}
        <div className="absolute left-1/2 -translate-x-1/2 desktop:hidden">
          <Logo priority inverted={overlay} className="h-5" />
        </div>

        <div className="flex shrink-0 items-center gap-5 max-[1440px]:gap-3">
          <div className="hidden desktop:block">
            <LocaleToggle />
          </div>
          <QuoteButton size="sm" />
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-line bg-white">
          <nav className="container-page flex flex-col py-3">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "rounded-md px-2 py-3 text-[min(3.4vw,14px)] desktop:text-base font-medium",
                  isActive(item.href) ? "text-brand" : "text-ink",
                )}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-4">
              <LocaleToggle />
              <Link
                href={QUOTE_HREF}
                className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 max-[500px]:px-4 max-[500px]:py-1.5 text-[min(4.13vw,17px)] max-[500px]:text-[min(3.155vw,13.25px)] desktop:text-sm font-semibold text-white"
              >
                {t("nav.quote")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

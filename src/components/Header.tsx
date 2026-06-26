"use client";

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

  // Close the mobile menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-page flex h-[var(--spacing-header)] items-center justify-between gap-6">
        <Logo priority />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand",
                isActive(item.href) ? "text-brand" : "text-ink",
              )}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleToggle className="hidden sm:inline-flex" />
          <QuoteButton className="hidden sm:inline-flex" size="sm" />

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("header.closeMenu") : t("header.openMenu")}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink lg:hidden"
          >
            <HamburgerIcon open={open} />
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-line bg-white lg:hidden">
          <nav className="container-page flex flex-col py-3">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "rounded-md px-2 py-3 text-base font-medium",
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
                className="inline-flex flex-1 items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
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

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

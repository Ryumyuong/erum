"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Neutralizes browser full-page zoom on the public site so the layout keeps a
 * constant on-screen size no matter how the user zooms (Ctrl +/-, Ctrl+wheel).
 *
 * How: browser zoom scales everything by a factor k and shrinks the CSS
 * viewport to 1/k. We detect k from `devicePixelRatio` (relative to the value
 * at page load, so OS display scaling and the user's load-time zoom are
 * respected) and apply the inverse `zoom` to <body>, cancelling it out. Because
 * this only works when nothing is sized in viewport units (vw/vh/dvh), the
 * public UI is built entirely in px/rem; anything that needs to track the
 * window is fed a pixel value here instead — `--hero-h` for the full-screen
 * hero.
 *
 * Admin routes are left alone (normal zoom) — this only locks the marketing site.
 * Mobile pinch-zoom is unaffected (it doesn't change devicePixelRatio), so
 * accessibility zoom on phones still works.
 *
 * The lock is desktop-only (≥991px). The mobile layout is built on vw units and
 * a fixed root font, which is the opposite of what the lock assumes: applying a
 * body `zoom` there scaled the page against a viewport that had not changed,
 * blowing the layout past the screen edge. Below the breakpoint everything is
 * cleared so the browser behaves normally.
 */
const DESKTOP_MIN = 991;
export function ZoomLock() {
  const pathname = usePathname();
  const baseDprRef = useRef<number | null>(null);

  useEffect(() => {
    if (baseDprRef.current == null) {
      baseDprRef.current = window.devicePixelRatio || 1;
    }
    const isAdmin = pathname.startsWith("/admin");

    const clear = () => {
      document.body.style.removeProperty("zoom");
      document.documentElement.style.removeProperty("--hero-h");
    };

    const apply = () => {
      if (isAdmin || window.innerWidth < DESKTOP_MIN) {
        clear();
        return;
      }
      const base = baseDprRef.current || 1;
      const cur = window.devicePixelRatio || 1;
      const z = base / cur; // inverse of the browser zoom factor
      document.body.style.setProperty("zoom", String(z));
      // Keep the full-screen hero filling the real viewport height despite body zoom.
      document.documentElement.style.setProperty(
        "--hero-h",
        `${window.innerHeight / z}px`,
      );
    };

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [pathname]);

  return null;
}

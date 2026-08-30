"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BoxIcon } from "@/components/icons";
import { heroSlides, type HeroSlide } from "@/lib/data/home";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 3500; // time each slide holds before crossfading
const FADE_MS = 1500; // crossfade in/out duration

/**
 * Light hero carousel matching the BOXDLE mockup: full product slide,
 * dark title at the bottom-left, vertical dot pagination on the right,
 * and a centered SCROLL hint. Image slides are placeholders until assets land.
 *
 * Each active slide runs a slow Ken Burns zoom-out (`heroZoom`). Combined with
 * the long crossfade, the outward motion reads as continuous across image
 * transitions. `gen` bumps on every change so the incoming slide remounts and
 * restarts its zoom from the beginning.
 */
export function HeroCarousel({ slides = heroSlides }: { slides?: HeroSlide[] }) {
  const t = useTranslations("home");
  const [active, setActive] = useState(0);
  // Per-slide activation counter — bumps only when a slide becomes active, so
  // its zoom layer remounts and restarts. A deactivating slide keeps its key
  // and thus keeps zooming smoothly through its fade-out (no scale pop).
  const [actGen, setActGen] = useState<number[]>(() =>
    slides.map(() => 0),
  );
  const count = slides.length;

  const activate = (next: number) => {
    setActive(next);
    setActGen((a) => {
      const c = [...a];
      c[next] += 1;
      return c;
    });
  };

  const goTo = (next: number) => {
    if (next === active) return;
    activate(next);
  };

  // Auto-advance; resets whenever `active` changes (incl. manual dot clicks).
  useEffect(() => {
    if (count <= 1) return;
    const id = setTimeout(() => activate((active + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, count]);

  return (
    <section className="-mt-[var(--spacing-header)] w-full">
      <div
        className="relative w-full overflow-hidden bg-stone-100"
        style={{ height: "var(--hero-h, 100dvh)" }}
      >
        {/* Slides */}
        {slides.map((slide, i) => {
          const isActive = i === active;
          return (
            <div
              key={i}
              aria-hidden={!isActive}
              style={{ transitionDuration: `${FADE_MS}ms` }}
              className={cn(
                "absolute inset-0 transition-opacity ease-out",
                isActive ? "opacity-100" : "opacity-0",
              )}
            >
              {/* Zoom layer — key bumps only on activation, so it restarts the
                  Ken Burns zoom then keeps running (incl. through fade-out). */}
              <div
                key={`zoom-${i}-${actGen[i]}`}
                className="absolute inset-0 animate-[heroZoom_9s_ease-out_both]"
              >
                {slide.image ? (
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className={cn(
                      "object-cover",
                      i === 1 && "object-[50%_80%]",
                      i === 2 && "object-[50%_80%]",
                    )}
                  />
                ) : (
                  <div
                    className={cn(
                      "h-full w-full bg-gradient-to-br",
                      slide.tone,
                    )}
                  >
                    <BoxIcon className="absolute left-1/2 top-[42%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 text-black/10" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Top scrim — keeps the transparent overlay header's nav legible over
            light hero images. Sits above the slides, below title/dots. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-black/30 to-transparent" />

        {/* Title — no dark scrim; a soft text shadow keeps it legible on light images */}
        <div className="absolute inset-x-0 bottom-0">
          {/* Not .container-page: on desktop the hero copy runs flush to the
              viewport edges, so it keeps that container's width cap and
              centering but drops its horizontal gutter. On mobile it takes the
              same 7.767vw gutter as every other section — flush to the screen
              edge reads as a mistake at phone width. */}
          <div className="mx-auto w-full max-w-[1600px] px-[7.767vw] pt-10 pb-16 desktop:px-14 desktop:pt-14 desktop:pb-24 min-[1441px]:px-0">
            {/* max-w-4xl, not 3xl: uppercase at the larger display size pushes
                the first line past 768px and splits it into three. */}
            <h1 className="hero-title max-w-4xl whitespace-pre-line text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]">
              {t("heroTitle")}
            </h1>
            {t("heroSubtitle") && (
              <p className="hero-subtitle mt-4 w-full text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.3)] desktop:max-w-2xl">
                {t("heroSubtitle")}
              </p>
            )}
          </div>
        </div>

        {/* Vertical dot pagination — hidden on mobile (≤990) */}
        <div className="absolute right-16 top-1/2 z-10 hidden w-20 -translate-y-1/2 flex-col items-center gap-3 desktop:flex desktop:right-24">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "rounded-full transition-all",
                i === active
                  ? "h-3 w-3 border-2 border-white bg-transparent"
                  : "h-2.5 w-2.5 bg-white hover:bg-white/80",
              )}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="pointer-events-none absolute inset-x-0 bottom-10 hidden justify-center desktop:flex">
          <span className="hero-scroll flex flex-col items-center gap-1.5 uppercase tracking-[0.2em] text-white">
            {t("scroll")}
            <svg width="12" height="16" viewBox="0 0 12 16" fill="none" aria-hidden="true">
              <path
                d="M6 1v13M1 9l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}

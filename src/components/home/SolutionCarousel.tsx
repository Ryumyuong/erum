"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { pick, type L } from "@/lib/content";
import { QUOTE_HREF } from "@/lib/site";

type Card = { title: L; desc: L; cta: L; image: string };

function multiline(text: string) {
  return text.split("|").map((line, i, arr) => (
    <Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </Fragment>
  ));
}

/**
 * Mobile-only SOLUTION carousel: active card centered, neighbours peek at 50%
 * opacity, auto-advances rightward on an infinite loop (a cloned first card
 * makes the wrap seamless). Desktop keeps the static grid in page.tsx.
 */
export function SolutionCarousel({ cards }: { cards: Card[] }) {
  const locale = useLocale();
  const n = cards.length;
  // Clone on BOTH ends so every position (incl. the first) shows a half-card
  // peek on each side: [last, ...cards, first, second].
  const items = [cards[n - 1], ...cards, cards[0], cards[1 % n]];
  const [active, setActive] = useState(1); // index 1 = the real first card
  const [anim, setAnim] = useState(true);
  // Swiping pauses the timer for a beat — advancing under the finger fights
  // the gesture.
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  // Auto-advance rightward every 3s.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => a + 1), 3000);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    if (!paused) return;
    const t = setTimeout(() => setPaused(false), 6000);
    return () => clearTimeout(t);
  }, [paused]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchX.current;
    touchX.current = null;
    if (start == null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) < 40) return; // a tap, not a swipe
    setPaused(true);
    setActive((a) => a + (dx < 0 ? 1 : -1));
  };

  // When we reach the appended clone of the first card, snap back to the real
  // first card with no transition so the loop only ever moves right.
  useEffect(() => {
    if (active === n + 1) {
      const t = setTimeout(() => {
        setAnim(false);
        setActive(1);
      }, 550);
      return () => clearTimeout(t);
    }
    // Same in reverse — swiping back off the front lands on the clone at 0.
    if (active === 0) {
      const t = setTimeout(() => {
        setAnim(false);
        setActive(n);
      }, 550);
      return () => clearTimeout(t);
    }
    if (!anim) {
      const r = requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnim(true)),
      );
      return () => cancelAnimationFrame(r);
    }
  }, [active, anim, n]);

  const dot = (active - 1) % n;

  return (
    <div>
      <div
        className="touch-pan-y overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(calc(25% - ${active * 50}%))`,
            transition: anim ? "transform 500ms ease" : "none",
          }}
        >
          {items.map((card, i) => (
            <div
              key={i}
              className="shrink-0 px-2"
              style={{
                flexBasis: "50%",
                opacity: i === active ? 1 : 0.5,
                // Disable the opacity fade during the seamless snap-back so the
                // loop doesn't flicker when it jumps from the clone to slide 0.
                transition: anim ? "opacity 500ms ease" : "none",
              }}
            >
              <div className="flex flex-col overflow-hidden rounded-[0.625rem] bg-white">
                <div className="flex flex-col px-5 pb-8 pt-8 tracking-[-1px]">
                  <h3 className="text-[min(4.85vw,20px)] max-[500px]:text-[min(4.126vw,17.33px)] font-bold leading-snug text-[#101828]">
                    {multiline(pick(card.title, locale))}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 h-[2.375rem] text-[min(2.91vw,12px)] leading-[1.1875rem] text-black/60">
                    {pick(card.desc, locale).replace(/\|/g, " ")}
                  </p>
                  <Link
                    href={QUOTE_HREF}
                    className="mt-4 inline-flex w-fit items-center gap-1 border-b border-[#FF7200] pb-0.5 text-[min(2.91vw,12px)] font-medium text-[#FF7200]"
                  >
                    {pick(card.cta, locale)}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
                <div className="relative aspect-[284/198] w-full shrink-0">
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="80vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots — inactive #fff 30% */}
      <div className="mt-6 flex justify-center gap-2">
        {cards.map((_, i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: i === dot ? "#fff" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

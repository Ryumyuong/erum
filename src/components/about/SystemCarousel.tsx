"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { pick, type L } from "@/lib/content";

type Step = { title: L; desc: L; image: string };

/**
 * Mobile-only one-stop-process carousel: active card centered, neighbours peek
 * at 30% opacity, auto-advances rightward on an infinite loop (both-end clones
 * make the wrap seamless). Same mechanics as the SOLUTION carousel; image-top
 * cards. Desktop keeps the static grid in the about page.
 */
export function SystemCarousel({ steps }: { steps: Step[] }) {
  const locale = useLocale();
  const n = steps.length;
  // Clone on BOTH ends so every position (incl. the first) shows a half-card
  // peek on each side: [last, ...steps, first, second].
  const items = [steps[n - 1], ...steps, steps[0], steps[1 % n]];
  const [active, setActive] = useState(1); // index 1 = the real first card
  const [anim, setAnim] = useState(true);

  // Auto-advance rightward every 3s.
  useEffect(() => {
    const id = setInterval(() => setActive((a) => a + 1), 3000);
    return () => clearInterval(id);
  }, []);

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
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(calc(18.75% - ${active * 62.5}%))`,
            transition: anim ? "transform 500ms ease" : "none",
          }}
        >
          {items.map((step, i) => (
            <div
              key={i}
              className="shrink-0 px-2"
              style={{
                flexBasis: "62.5%",
                opacity: i === active ? 1 : 0.3,
                transition: anim ? "opacity 500ms ease" : "none",
              }}
            >
              <div className="flex h-full flex-col overflow-hidden rounded-[0.625rem] border border-[#DDDDDD] bg-white">
                <div className="relative aspect-[800/454] w-full shrink-0">
                  <Image
                    src={step.image}
                    alt=""
                    fill
                    sizes="80vw"
                    className="object-cover"
                  />
                </div>
                <div className="px-5 pb-8 pt-6 text-left">
                  <h3 className="text-[min(5.34vw,22px)] max-[500px]:text-[min(4.248vw,17.84px)] font-bold text-[#101828]">
                    {pick(step.title, locale)}
                  </h3>
                  <p className="mt-2 text-[min(3.64vw,15px)] max-[500px]:text-[min(2.913vw,12.23px)] leading-relaxed text-black/70">
                    {pick(step.desc, locale)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots — active #FF7200, inactive 30% */}
      <div className="mt-6 flex justify-center gap-2">
        {steps.map((_, i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: i === dot ? "#FF7200" : "rgba(255,114,0,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

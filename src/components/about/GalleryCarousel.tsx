"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Thumb } from "@/components/ui/Thumb";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { L } from "@/lib/content";

export type GallerySlide = { caption: L; image?: string; tone: string };

const SLIDE_FRACTION = 0.75; // main slide width; the rest peeks the neighbours on BOTH sides
const GAP = 40;
// Clones per end. The track is full-bleed, so each peek is wider than a single
// slide — one clone would leave a gap at the wrap. Two covers any fraction
// down to ~0.2.
const CLONES = 2;
const AUTOPLAY_MS = 3500;
const TRANSITION_MS = 600;
const DRAG_THRESHOLD = 60; // px of travel before a drag counts as a slide change

/**
 * Factory & equipment gallery — auto-sliding, seamless infinite loop.
 * The active slide is centred, so a neighbour peeks on the left as well as the
 * right; clones on both ends keep those peeks filled at the first and last
 * slide. Advances by arrows, autoplay, or dragging the track.
 */
export function GalleryCarousel({
  gallerySlides,
}: {
  gallerySlides: GallerySlide[];
}) {
  const locale = useLocale();
  const real = gallerySlides.length;
  // Padded at both ends so the peeks are always filled. Real slide r sits at
  // padded position r + CLONES.
  const slides = [
    ...gallerySlides.slice(-CLONES),
    ...gallerySlides,
    ...gallerySlides.slice(0, CLONES),
  ];

  const [index, setIndex] = useState(CLONES); // position in the padded array
  const [animate, setAnimate] = useState(true);
  const [width, setWidth] = useState(0);
  // Mobile (≤990px): one full slide per view (no peek); desktop keeps the peek.
  const [isMobile, setIsMobile] = useState(false);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Authoritative drag distance — pointerup can land before a setDrag commits.
  const dragRef = useRef(0);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 990px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const measure = () => setWidth(containerRef.current?.clientWidth ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (dragging) return; // don't advance out from under the user's finger
    const id = setTimeout(() => setIndex((i) => i + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, dragging]);

  // Re-enable the transition on the frame after a seamless reset.
  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  // Seamless wrap: once the slide onto a clone has played out, jump to the real
  // slide it duplicates with the transition switched off.
  // This is driven by a timer rather than `transitionend`, which the track does
  // not reliably emit here — and a missed event used to leave `index` climbing
  // past the end of the array, scrolling the whole strip out of view.
  useEffect(() => {
    const first = CLONES; // padded position of real slide 0
    const last = CLONES + real - 1; // padded position of the final real slide
    if (index >= first && index <= last) return;
    const id = setTimeout(() => {
      setAnimate(false);
      setIndex(index > last ? index - real : index + real);
    }, TRANSITION_MS);
    return () => clearTimeout(id);
  }, [index, real]);

  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    setDragging(true);
    startXRef.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    dragRef.current = e.clientX - startXRef.current;
    setDrag(dragRef.current);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    const travelled = dragRef.current;
    dragRef.current = 0;
    setDrag(0);
    if (travelled <= -DRAG_THRESHOLD) next();
    else if (travelled >= DRAG_THRESHOLD) prev();
  };

  const current = (((index - CLONES) % real) + real) % real;
  const slideWidth = width * (isMobile ? 1 : SLIDE_FRACTION);
  const step = slideWidth + GAP;
  // Centring the active slide is what creates the left peek; on mobile the
  // slide fills the container so this collapses to 0.
  const edge = (width - slideWidth) / 2;
  const peek = Math.max(edge - GAP, 0);

  return (
    <div>
      <div
        ref={containerRef}
        className={cn(
          "select-none overflow-hidden",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{ touchAction: "pan-y" }} // let vertical page scrolling through
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(${edge - index * step + drag}px)`,
            transition:
              animate && !dragging ? `transform ${TRANSITION_MS}ms ease` : "none",
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className={cn(
                "shrink-0",
                animate && "transition-opacity duration-500",
                i === index ? "opacity-100" : "opacity-30",
              )}
              style={{ width: slideWidth || "66%", marginRight: GAP }}
            >
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt=""
                  width={1704}
                  height={888}
                  sizes="50vw"
                  draggable={false}
                  className="aspect-[16/9] w-full rounded-[0.625rem] object-cover"
                />
              ) : (
                <Thumb
                  tone={slide.tone}
                  ratio="wide"
                  rounded={false}
                  className="rounded-[0.625rem]"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Caption + pagination — mirrors the track: peek, main slide, peek */}
      <div className="mt-8 flex items-center" style={{ gap: GAP }}>
        {/* Only the active slide is captioned; the peeks stay blank. */}
        <span aria-hidden style={{ width: peek }} />

        {/* Spans the main slide: caption at left, controls at the slide's right edge */}
        <div
          className="flex items-center justify-between"
          style={{ width: slideWidth || "66%" }}
        >
          <span className="flex items-center gap-3 pl-3 text-[min(6.55vw,27px)] max-[500px]:text-[min(5.34vw,22.4px)] desktop:text-[2rem] font-medium text-black">
            <span className="h-2 w-2 shrink-0 rounded-full bg-black" />
            {pick(gallerySlides[current].caption, locale)}
          </span>

          <span className="flex shrink-0 items-center gap-8 max-[500px]:gap-5 text-[min(6.07vw,25px)] max-[500px]:text-[min(4.854vw,20.4px)] desktop:text-[1.8269rem]">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="cursor-pointer transition-opacity hover:opacity-60"
            >
              <Image src="/icons/gallery-arrow-left.png" alt="" width={28} height={53} className="h-6 max-[500px]:h-5 w-auto" />
            </button>
            <span className="inline-flex items-center gap-2">
              <b className="font-medium text-[#FD7304]">{current + 1}</b>
              <span className="text-black/20">/</span>
              <span className="text-black">{real}</span>
            </span>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="cursor-pointer transition-opacity hover:opacity-60"
            >
              <Image src="/icons/gallery-arrow-right.png" alt="" width={28} height={53} className="h-6 max-[500px]:h-5 w-auto" />
            </button>
          </span>
        </div>

        <span aria-hidden style={{ width: peek }} />
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";

export default function GlossaryGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-[0.625rem] bg-[#F4F4F4]">
        {current ? (
          <Image
            src={current}
            alt=""
            fill
            sizes="(max-width: 990px) 100vw, 50vw"
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[#F3F4F6]" />
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`이미지 ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square overflow-hidden rounded-[0.625rem] border transition-colors ${
                i === active
                  ? "border-brand"
                  : "border-[#E5E7EB] hover:border-[#D5D5D5]"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="120px"
                unoptimized
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import Image from "next/image";
import { BoxIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Image block for cards. Shows the real photo when `image` is provided
 * (uploaded via admin), otherwise a soft gradient placeholder.
 * `tone` is a Tailwind gradient pair, e.g. "from-amber-100 to-orange-50".
 *
 * `ratio="auto"` keeps the photo's own aspect ratio (nothing cropped); the
 * block height then follows the image. Every other ratio crops to a fixed box.
 */
export function Thumb({
  tone,
  image,
  ratio = "square",
  rounded = true,
  className,
  imageClassName,
  children,
}: {
  tone?: string;
  image?: string;
  ratio?: "square" | "video" | "wide" | "portfolio" | "card" | "blog" | "auto" | "feature" | "portfolioTile";
  rounded?: boolean;
  className?: string;
  imageClassName?: string;
  children?: React.ReactNode;
}) {
  // Without an image there is nothing to take a height from, so `auto` still
  // needs a box for the placeholder icon.
  const natural = ratio === "auto" && !!image;

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        rounded && "rounded-[var(--radius-card)]",
        !image && "bg-gradient-to-br",
        !image && tone,
        (ratio === "square" || (ratio === "auto" && !image)) && "aspect-square",
        ratio === "feature" && "aspect-[16/11] desktop:aspect-[3/2]",
        ratio === "portfolioTile" && "aspect-square desktop:aspect-[3/2]",
        ratio === "video" && "aspect-[4/3]",
        ratio === "wide" && "aspect-[16/9]",
        ratio === "portfolio" && "aspect-[640/418]",
        ratio === "card" && "aspect-[265/195]",
        ratio === "blog" && "aspect-[314/290]",
        className,
      )}
    >
      {image ? (
        natural ? (
          /* Remote URL of unknown size: width/height are only the pre-load
             ratio hint — `h-auto` adopts the real ratio once loaded. */
          <Image
            src={image}
            alt=""
            width={1600}
            height={1200}
            sizes="(max-width: 990px) 50vw, 25vw"
            className={cn("h-auto w-full", imageClassName)}
          />
        ) : (
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 990px) 50vw, 25vw"
            className={cn("object-cover", imageClassName)}
          />
        )
      ) : (
        <BoxIcon className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-black/15" />
      )}
      {children}
    </div>
  );
}

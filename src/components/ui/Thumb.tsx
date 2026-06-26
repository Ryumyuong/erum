import Image from "next/image";
import { BoxIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Image block for cards. Shows the real photo when `image` is provided
 * (uploaded via admin), otherwise a soft gradient placeholder.
 * `tone` is a Tailwind gradient pair, e.g. "from-amber-100 to-orange-50".
 */
export function Thumb({
  tone,
  image,
  ratio = "square",
  className,
  children,
}: {
  tone?: string;
  image?: string;
  ratio?: "square" | "video" | "wide";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-card)]",
        !image && "bg-gradient-to-br",
        !image && tone,
        ratio === "square" && "aspect-square",
        ratio === "video" && "aspect-[4/3]",
        ratio === "wide" && "aspect-[16/9]",
        className,
      )}
    >
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
      ) : (
        <BoxIcon className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-black/15" />
      )}
      {children}
    </div>
  );
}

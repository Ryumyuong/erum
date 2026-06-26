import { Thumb } from "@/components/ui/Thumb";

/**
 * (?) help tooltip — shows a short explanation (and an optional image) on hover
 * or keyboard focus. Helps customers who don't know the technical terms.
 */
export function Tooltip({ text, tone }: { text: string; tone?: string }) {
  return (
    <span className="group/tip relative inline-flex align-middle">
      <button
        type="button"
        aria-label={text}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-line text-[10px] font-bold text-faint hover:border-brand hover:text-brand"
      >
        ?
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-52 -translate-x-1/2 rounded-lg border border-line bg-white p-3 text-left shadow-lg group-hover/tip:block group-focus-within/tip:block"
      >
        {tone && <Thumb tone={tone} ratio="video" className="mb-2" />}
        <span className="block text-xs leading-relaxed text-muted">{text}</span>
      </span>
    </span>
  );
}

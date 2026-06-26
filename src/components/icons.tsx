import { cn } from "@/lib/utils";

type IconProps = { className?: string };

function base(className?: string) {
  return cn("h-6 w-6", className);
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BoxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path {...stroke} d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </svg>
  );
}

export function HistoryIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <circle {...stroke} cx="12" cy="12" r="8.5" />
      <path {...stroke} d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function FactoryIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M3 20h18M4 20V10l5 3V10l5 3V6h2v14" />
      <path {...stroke} d="M7 20v-3M11 20v-3M15 20v-3" />
    </svg>
  );
}

export function TeamIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <circle {...stroke} cx="9" cy="8" r="3" />
      <path {...stroke} d="M3.5 19a5.5 5.5 0 0 1 11 0M16 6.2a3 3 0 0 1 0 5.6M17 14.5a5.5 5.5 0 0 1 3.5 4.5" />
    </svg>
  );
}

export function LeafIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M20 4C9 4 4 9 4 18c8 0 16-4 16-14z" />
      <path {...stroke} d="M4 20c4-8 8-10 13-12" />
    </svg>
  );
}

export function TagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M4 12.5l7.5-7.5 7 7-7.5 7.5a2 2 0 0 1-2.8 0L4 15.3a2 2 0 0 1 0-2.8z" />
      <circle cx="14.5" cy="9.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M4 5h16v11H8l-4 4V5z" />
      <path {...stroke} d="M8 9h8M8 12h5" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <circle {...stroke} cx="11" cy="11" r="6.5" />
      <path {...stroke} d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export const whyIcons: Record<string, (p: IconProps) => React.ReactElement> = {
  history: HistoryIcon,
  factory: FactoryIcon,
  team: TeamIcon,
  leaf: LeafIcon,
  tag: TagIcon,
  chat: ChatIcon,
};

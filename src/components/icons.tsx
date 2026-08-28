import Image from "next/image";
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

/** KakaoTalk — the rounded speech bubble the app is known for. */
export function KakaoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 3C6.9 3 2.8 6.3 2.8 10.3c0 2.6 1.7 4.8 4.3 6.1-.2.7-.7 2.5-.8 2.9-.1.5.2.5.4.4.2-.1 2.7-1.8 3.8-2.5.5.1 1 .1 1.5.1 5.1 0 9.2-3.3 9.2-7.3S17.1 3 12 3Z" />
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

export function NetworkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <circle {...stroke} cx="12" cy="5" r="2.2" />
      <circle {...stroke} cx="5.5" cy="16" r="2.2" />
      <circle {...stroke} cx="18.5" cy="16" r="2.2" />
      <path {...stroke} d="M10.8 6.9L6.7 14M13.2 6.9l4.1 7.1M7.7 16h8.6" />
    </svg>
  );
}

export function BulbIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M9 17.5a6 6 0 1 1 6 0v1.5H9v-1.5z" />
      <path {...stroke} d="M9.5 21h5M10 19h4" />
    </svg>
  );
}

export function GuideIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M12 3l7 4v5" />
      <path {...stroke} d="M19 7l-7 4-7-4 7-4z" />
      <path {...stroke} d="M5 7v8l7 4 1.6-.9" />
      <path {...stroke} d="M12 11v4" />
      <circle {...stroke} cx="17.4" cy="17.4" r="2.2" />
      <path
        {...stroke}
        d="M17.4 14.5v-1M17.4 21.3v-1M20.3 17.4h-1M15.5 17.4h-1"
      />
    </svg>
  );
}

export function FaqIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M4 5h16v11H9l-4 3.5V16H4V5z" />
      <text
        x="12"
        y="12.5"
        textAnchor="middle"
        fontSize="6"
        fontWeight="700"
        fill="currentColor"
      >
        FAQ
      </text>
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <rect {...stroke} x="3" y="5" width="18" height="14" rx="2" />
      <path {...stroke} d="M4 7l8 6 8-6" />
    </svg>
  );
}

export function QuestionIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <circle {...stroke} cx="12" cy="12" r="8.5" />
      <path {...stroke} d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.7.3-.9.7-.9 1.4v.3" />
      <circle cx="12" cy="16.3" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function BookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M4 5a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2V5z" />
      <path {...stroke} d="M20 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2V5z" />
    </svg>
  );
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <circle {...stroke} cx="12" cy="12" r="8.5" />
      <path {...stroke} d="M3.5 12h17M12 3.5c2.5 2.3 2.5 14.7 0 17M12 3.5c-2.5 2.3-2.5 14.7 0 17" />
    </svg>
  );
}

export function GearIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <circle {...stroke} cx="12" cy="12" r="3.2" />
      <path
        {...stroke}
        d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7L17 17M7 7L5.3 5.3"
      />
    </svg>
  );
}

export function EditIcon({ className }: IconProps) {
  return (
    <Image
      src="/icons/admin-edit.png"
      alt=""
      width={36}
      height={36}
      className={className ?? "h-4 w-4"}
    />
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <Image
      src="/icons/admin-delete.png"
      alt=""
      width={36}
      height={36}
      className={className ?? "h-4 w-4"}
    />
  );
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <circle {...stroke} cx="12" cy="12" r="9" />
      <path {...stroke} d="M8.3 12.4l2.5 2.5 4.9-5.4" />
    </svg>
  );
}

export function AlertCircleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <circle {...stroke} cx="12" cy="12" r="9" />
      <path {...stroke} d="M12 7.5v5" />
      <circle cx="12" cy="16.2" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <rect {...stroke} x="4" y="5" width="16" height="15" rx="2" />
      <path {...stroke} d="M4 9.5h16M8 3v4M16 3v4" />
    </svg>
  );
}

export function FunnelIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M4 5h16l-6 7v6l-4 2v-8L4 5z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <rect {...stroke} x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle {...stroke} cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function BlogIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M6 3h8l4 4v14H6V3z" />
      <path {...stroke} d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  );
}

export function SendIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} aria-hidden="true">
      <path {...stroke} d="M21 3L10.5 13.5M21 3l-6.5 18-4-8-8-4L21 3z" />
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

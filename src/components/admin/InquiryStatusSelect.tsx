"use client";

import { useState, useTransition } from "react";
import { updateInquiryStatus } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const STATUSES = [
  { v: "new", l: "New" },
  { v: "reviewing", l: "Reviewing" },
  { v: "quoted", l: "Quoted" },
];

export function InquiryStatusSelect({
  id,
  value,
}: {
  id: string;
  value: string;
}) {
  const [val, setVal] = useState(value);
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={val}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        setVal(next);
        startTransition(() => {
          void updateInquiryStatus(id, next);
        });
      }}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-semibold outline-none",
        val === "new" && "border-brand/30 bg-brand-soft text-brand",
        val === "reviewing" && "border-yellow-300 bg-yellow-50 text-yellow-700",
        val === "quoted" && "border-green-300 bg-green-50 text-green-700",
        pending && "opacity-50",
      )}
    >
      {STATUSES.map((s) => (
        <option key={s.v} value={s.v}>
          {s.l}
        </option>
      ))}
    </select>
  );
}

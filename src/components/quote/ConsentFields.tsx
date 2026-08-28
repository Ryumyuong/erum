"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * 개인정보 수집 동의 (required to submit) and 제작물 홍보 활용 동의 (optional).
 * The privacy detail sits behind a toggle so the form doesn't turn into a wall
 * of legal text.
 */
export function ConsentFields({
  privacy,
  onPrivacy,
  promo,
  onPromo,
}: {
  privacy: boolean;
  onPrivacy: (v: boolean) => void;
  promo: "" | "yes" | "no";
  onPromo: (v: "yes" | "no") => void;
}) {
  const t = useTranslations("page.quote.field");
  const [open, setOpen] = useState(false);
  const body = t("privacyBody").split("|");

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-[0.625rem] border border-[#D1D5DC] bg-white">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
          >
            <span className="shrink-0 text-[#6A7282]" aria-hidden>
              {open ? "▲" : "▼"}
            </span>
            <span className="truncate text-[min(3.4vw,14px)] desktop:text-[1rem] font-medium text-[#101828]">
              {t("privacyTitle")}
              <span className="ml-1 text-[#ff0000]">*</span>
            </span>
          </button>
          <label className="flex shrink-0 cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand"
              checked={privacy}
              onChange={(e) => onPrivacy(e.target.checked)}
            />
            <span className="text-[min(3.4vw,14px)] desktop:text-[1rem] text-[#364153]">
              {t("agree")}
            </span>
          </label>
        </div>

        {open && (
          <div className="border-t border-[#E5E7EB] px-4 py-3">
            <p className="text-[min(3.15vw,13px)] desktop:text-[0.9375rem] leading-relaxed text-[#6A7282]">
              {body[0]}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[min(3.15vw,13px)] desktop:text-[0.9375rem] leading-relaxed text-[#6A7282]">
              {body.slice(1).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        )}

      </div>

      <div className="rounded-[0.625rem] border border-[#D1D5DC] bg-white px-4 py-3">
        <p className="text-[min(3.4vw,14px)] desktop:text-[1rem] font-medium text-[#101828]">
          {t("promoTitle")}
          <span className="ml-1 text-[#ff0000]">*</span>
        </p>
        <p className="mt-1 text-[min(3.15vw,13px)] desktop:text-[0.9375rem] leading-relaxed text-[#6A7282]">
          {t("promoBody")}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {(["yes", "no"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onPromo(v)}
              aria-pressed={promo === v}
              className={cn(
                "min-w-[7rem] max-w-[10.5rem] flex-1 basis-0 rounded-[0.625rem] border px-5 py-2.5 text-[min(3.4vw,14px)] desktop:text-[1rem] transition-colors",
                promo === v
                  ? "border-brand bg-brand-soft font-medium text-brand"
                  : "border-[#D1D5DC] text-[#364153] hover:border-brand/40",
              )}
            >
              {t(v === "yes" ? "agree" : "disagree")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import {
  getSavedReferences,
  getSavedReferencesServer,
  subscribeSavedReferences,
  toggleSavedReference,
} from "@/lib/saved-references";

/**
 * "참고 제품으로 저장하기" — bookmarks the item number locally. The quote form
 * picks the list up and attaches it to the inquiry.
 */
export function SaveReferenceButton({ itemNo }: { itemNo: string }) {
  const ko = useLocale() === "ko";
  const savedList = useSyncExternalStore(
    subscribeSavedReferences,
    getSavedReferences,
    getSavedReferencesServer,
  );
  const saved = savedList.includes(itemNo);

  const toggle = () => toggleSavedReference(itemNo);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-[0.625rem] border bg-white py-3.5 text-[min(3.88vw,16px)] desktop:text-[1rem] font-bold transition-colors hover:bg-gray-50",
        saved
          ? "border-[#101828] text-[#101828]"
          : "border-[#D1D5DC] text-[#364153]",
      )}
    >
      {/* Inline rather than the PNG so the saved state can fill the bookmark —
          the flat icon is the state indicator, not just the wording. */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M6 3h12a1 1 0 0 1 1 1v16l-7-4-7 4V4a1 1 0 0 1 1-1z" />
      </svg>
      {saved
        ? ko
          ? "참고 제품으로 저장됨"
          : "Saved as reference"
        : ko
          ? "참고 제품으로 저장하기"
          : "Save as reference"}
    </button>
  );
}

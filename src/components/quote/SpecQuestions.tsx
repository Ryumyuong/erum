"use client";

import { useLocale } from "next-intl";
import { ImageSelect } from "./ImageSelect";
import { Tooltip } from "./Tooltip";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { L } from "@/lib/content";
import type { MaterialOption } from "./MaterialQuestions";

/** Package-type tabs that behave the same for most questions. */
const BOX_TABS = ["종이박스", "골판지박스", "싸바리박스"];

/** 1-4 부자재 — only asked for the box categories. */
export function showsAccessory(tab: string): boolean {
  return BOX_TABS.includes(tab);
}

/** 1-3 사이즈 is optional (not required) only for the 기타 category. */
export function sizeOptional(tab: string): boolean {
  return tab === "기타";
}

/** Which 인쇄 도수 list applies to the current package selection. */
export function printColorsGroup(tab: string, packageId: string): string {
  if (tab === "비닐류") {
    return packageId === "opp" ? "printColorsOpp" : "printColorsPoly";
  }
  return "printColorsDefault";
}

/** 별색 is only offered outside the vinyl categories. */
export function showsSpotColour(tab: string): boolean {
  return tab !== "" && tab !== "비닐류";
}

/**
 * 3 후가공 — dropdown groups per package category.
 *  · OPP and machine-made shopping bags have no finishing at all
 *  · poly bags only choose a handle
 *  · everything else gets the five dropdowns
 */
export function finishingGroupsFor(
  tab: string,
  packageId: string,
): { group: string; label: L }[] {
  if (tab === "") return [];
  if (packageId === "opp" || packageId === "bag-auto") return [];
  if (tab === "비닐류") {
    return [{ group: "finishHandle", label: { ko: "손잡이 가공", en: "Handle" } }];
  }
  return [
    { group: "finishCoating", label: { ko: "코팅", en: "Coating" } },
    { group: "finishSpecialCoating", label: { ko: "특수코팅", en: "Special Coating" } },
    { group: "finishFoil", label: { ko: "박", en: "Foil" } },
    { group: "finishEmboss", label: { ko: "형압", en: "Embossing" } },
    { group: "finishDiecut", label: { ko: "도무송", en: "Die-cut" } },
  ];
}

/** Yes/no pair rendered as two buttons, with an optional free-text follow-up. */
export function YesNoQuestion({
  label,
  tip,
  options,
  value,
  onChange,
  note,
  onNote,
  noteLabel,
  notePlaceholder,
  noteOn = "yes",
}: {
  label: string;
  tip?: string;
  options: MaterialOption[];
  value: string;
  onChange: (id: string) => void;
  note?: string;
  onNote?: (text: string) => void;
  /** Caption above the follow-up box, so it is not a bare input. */
  noteLabel?: string;
  notePlaceholder?: string;
  noteOn?: string;
}) {
  const locale = useLocale();
  return (
    <div>
      <span className="mb-3 flex items-center gap-1 text-[min(3.4vw,14px)] desktop:text-[1rem] font-medium text-black">
        {label}
        {tip && <Tooltip text={tip} />}
      </span>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={value === o.id}
            className={cn(
              "flex-1 basis-0 min-w-[7rem] max-w-[10.5rem] rounded-[0.625rem] px-5 py-3 text-center text-[min(3.4vw,14px)] desktop:text-[1rem] transition-colors",
              value === o.id
                ? "border-2 border-[#FD7304] font-medium text-[#FD7304]"
                : "border border-[#D1D5DC] text-[#6A7282] hover:border-brand/40",
            )}
          >
            {pick(o.label, locale)}
          </button>
        ))}
      </div>
      {onNote && value === noteOn && (
        <>
        {noteLabel && (
          <span className="mt-5 mb-1.5 block text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#364153]">
            {noteLabel}
          </span>
        )}
        <input
          className="w-full rounded-[0.625rem] border border-[#D1D5DC] px-4 py-2.5 text-[min(3.4vw,14px)] desktop:text-[1rem] text-[#101828] outline-none placeholder:text-[#0A0A0A]/50 focus:border-brand"
          value={note ?? ""}
          onChange={(e) => onNote(e.target.value)}
          placeholder={notePlaceholder}
        />
        </>
      )}
    </div>
  );
}

/**
 * 3 후가공 — one labelled dropdown per group, laid out in a row so they fit
 * side by side on desktop.
 */
export function FinishingSelects({
  groups,
  options,
  values,
  onChange,
}: {
  groups: { group: string; label: L }[];
  options: Record<string, MaterialOption[]>;
  values: Record<string, string>;
  onChange: (group: string, id: string) => void;
}) {
  const locale = useLocale();
  return (
    <div className="flex flex-wrap gap-3">
      {groups.map((g) => {
        const list = options[g.group] ?? [];
        if (list.length === 0) return null;
        return (
          /* div, not label — ImageSelect is a button + listbox, not an input */
          <div key={g.group} className="min-w-[10rem] flex-1">
            <ImageSelect
              options={list}
              value={values[g.group] ?? ""}
              onChange={(id) => onChange(g.group, id)}
              placeholder={pick(g.label, locale)}
            />
          </div>
        );
      })}
    </div>
  );
}

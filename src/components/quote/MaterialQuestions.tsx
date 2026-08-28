"use client";

import { useLocale } from "next-intl";
import { Tooltip } from "./Tooltip";
import { QuoteCardGrid, QuoteOptionCard } from "./QuoteOptionCard";
import { pick } from "@/lib/content";
import type { L } from "@/lib/content";

export type MaterialOption = {
  id: string;
  label: L;
  desc: L;
  image?: string;
  kind: "option" | "recommend" | "custom" | "other";
};

/**
 * Which 재질 questions to ask, per 패키지 종류 tab. `when` narrows it further
 * for the two tabs whose answer depends on the exact card (OPP vs 비닐백,
 * 수동 vs 자동 쇼핑백).
 */
export type MaterialQuestion = {
  group: string;
  label: L;
  /** Only ask when the chosen package option id is in this list. */
  when?: string[];
  /** Skip when the chosen option id is in this list. */
  unless?: string[];
};

export const MATERIAL_PLAN: Record<string, MaterialQuestion[]> = {
  종이박스: [
    { group: "materialPaper", label: { ko: "종이 재질", en: "Paper Material" } },
  ],
  골판지박스: [
    { group: "materialCorrugated", label: { ko: "골판지 재질", en: "Corrugated Material" } },
    { group: "materialSurface", label: { ko: "표면지 (합지)", en: "Surface Paper (Lamination)" } },
    { group: "materialInnerColor", label: { ko: "골판지 내부 색상", en: "Inner Colour" } },
  ],
  싸바리박스: [
    { group: "materialRigidOuter", label: { ko: "겉지 재질", en: "Outer Paper" } },
    { group: "materialRigidInner", label: { ko: "내지 재질", en: "Inner Paper" } },
  ],
  비닐류: [
    { group: "materialOppAdhesive", label: { ko: "접착여부", en: "Adhesive" }, when: ["opp"] },
    { group: "materialPoly", label: { ko: "재질", en: "Material" }, unless: ["opp"] },
  ],
  쇼핑백: [
    { group: "materialBagPaper", label: { ko: "쇼핑백 재질", en: "Bag Material" } },
    { group: "materialBagHandleManual", label: { ko: "손잡이 재질", en: "Handle" }, unless: ["bag-auto"] },
    { group: "materialBagHandleAuto", label: { ko: "손잡이 재질", en: "Handle" }, when: ["bag-auto"] },
  ],
  기타: [{ group: "materialEtc", label: { ko: "재질", en: "Material" } }],
};

/** The questions to render for a given package selection. */
export function materialQuestionsFor(
  tab: string,
  packageId: string,
): MaterialQuestion[] {
  return (MATERIAL_PLAN[tab] ?? []).filter((q) => {
    if (q.when && !q.when.includes(packageId)) return false;
    if (q.unless && q.unless.includes(packageId)) return false;
    return true;
  });
}

/**
 * 1-2 재질 — one pill/card picker per question, with a free-text box revealed
 * by the 직접 입력 / 기타 choice.
 */
/** True when the chosen card is the free-text one. */
function chosen(list: MaterialOption[], value: string | undefined) {
  const o = list.find((x) => x.id === value);
  return o?.kind === "custom" || o?.kind === "other";
}

export function MaterialQuestions({
  questions,
  options,
  values,
  notes,
  onSelect,
  onNote,
  customPlaceholder,
  etcPlaceholder,
  tip,
  compact = true,
}: {
  questions: MaterialQuestion[];
  options: Record<string, MaterialOption[]>;
  values: Record<string, string>;
  notes: Record<string, string>;
  onSelect: (group: string, id: string) => void;
  onNote: (group: string, text: string) => void;
  customPlaceholder: string;
  etcPlaceholder: string;
  /** (?) shown beside every question label in this set. */
  tip?: string;
  /** Shorter picture area. 재질 opts out so it matches the 패키지 종류 cards. */
  compact?: boolean;
}) {
  const locale = useLocale();

  return (
    <div className="space-y-6">
      {questions.map((q) => {
        const list = options[q.group] ?? [];
        if (list.length === 0) return null;
        const onlyCustom = list.length === 1 && list[0].kind === "custom";

        return (
          <div key={q.group}>
            <span className="mb-2.5 flex items-center gap-1 text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#6A7282]">
              {pick(q.label, locale)}
              {tip && <Tooltip text={tip} />}
            </span>

            {/* Same picture cards as 패키지 종류, with 추천해주세요 / 직접 입력
                pushed to the end of the row. sort() is stable, so the rest keep
                the order the admin set. */}
            <QuoteCardGrid>
              {[...list]
                .sort(
                  (a, b) =>
                    Number(a.kind !== "option") - Number(b.kind !== "option"),
                )
                .map((o) => (
                  <QuoteOptionCard
                    key={o.id}
                    option={o}
                    compact={compact}
                    selected={values[q.group] === o.id}
                    onSelect={() => onSelect(q.group, o.id)}
                  />
                ))}
            </QuoteCardGrid>

            {/* 직접 입력 / 기타 — the box sits under the grid so a long example
                sentence has the full width and is never clipped. */}
            {chosen(list, values[q.group]) && (
              <input
                className="mt-3 w-full rounded-[0.625rem] border border-[#D1D5DC] px-4 py-2.5 text-[min(3.4vw,14px)] desktop:text-[1rem] text-[#101828] outline-none placeholder:text-[#0A0A0A]/50 focus:border-brand"
                value={notes[q.group] ?? ""}
                onChange={(e) => onNote(q.group, e.target.value)}
                placeholder={onlyCustom ? etcPlaceholder : customPlaceholder}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

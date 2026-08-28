"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { adminInput, btnGhost, btnPrimary } from "@/components/admin/fields";
import { TrashIcon } from "@/components/icons";
import { deleteQuoteOption, saveQuoteOption } from "@/app/admin/content-actions";
import { QUOTE_GROUPS, type OptionCard } from "@/lib/quote-options";


const KIND_LABEL: Record<OptionCard["kind"], string> = {
  option: "일반",
  recommend: "추천해주세요",
  custom: "직접입력",
  other: "기타",
};

const ctrl =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-white text-sm font-bold text-[#364153] hover:border-brand hover:text-brand disabled:opacity-30";

/**
 * Editor for the quote form's own option cards. Separate from 제작가이드 on
 * purpose — the quote form carries entries the guide has no reason to (직접입력,
 * 추천해주세요) and its wording/pictures are meant to be tuned independently.
 */
export function QuoteOptionManager({
  options,
}: {
  options: Record<string, OptionCard[]>;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(options);
  const [open, setOpen] = useState<string | null>(QUOTE_GROUPS[0]?.id ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const list = (g: string) => rows[g] ?? [];

  const patch = (g: string, id: string, changes: Partial<OptionCard>) =>
    setRows((r) => ({
      ...r,
      [g]: list(g).map((o) => (o.id === id ? { ...o, ...changes } : o)),
    }));

  const move = (g: string, i: number, dir: -1 | 1) =>
    setRows((r) => {
      const opts = [...list(g)];
      const j = i + dir;
      if (j < 0 || j >= opts.length) return r;
      [opts[i], opts[j]] = [opts[j], opts[i]];
      return { ...r, [g]: opts };
    });

  const add = (g: string, kind: OptionCard["kind"]) =>
    setRows((r) => ({
      ...r,
      [g]: [
        ...list(g),
        {
          id: crypto.randomUUID(),
          tab: "",
          label_en: "",
          label_kr: "",
          desc_en: "",
          desc_kr: "",
          image: "",
          kind,
        },
      ],
    }));

  async function remove(g: string, id: string) {
    if (!confirm("이 항목을 삭제할까요?")) return;
    setBusy(true);
    setError(null);
    const existed = (options[g] ?? []).some((o) => o.id === id);
    const res = existed ? await deleteQuoteOption(g, id) : { ok: true as const };
    if (!res.ok) setError(res.error ?? "삭제 실패");
    else setRows((r) => ({ ...r, [g]: list(g).filter((o) => o.id !== id) }));
    setBusy(false);
    router.refresh();
  }

  async function saveGroup(g: string) {
    setBusy(true);
    setError(null);
    const opts = list(g);
    for (let i = 0; i < opts.length; i++) {
      const o = opts[i];
      const res = await saveQuoteOption({ ...o, group_id: g, sort: i + 1 });
      if (!res.ok) {
        setError(res.error ?? "저장 실패");
        setBusy(false);
        return;
      }
    }
    setSavedAt(new Date().toLocaleTimeString("ko-KR"));
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-white p-6">
      <h2 className="text-lg max-[500px]:text-[0.9375rem] font-bold text-[#101828]">견적문의 선택 항목</h2>
      <p className="mt-1 text-sm text-muted">
        견적문의 폼에 표시되는 카드입니다. 제작가이드와 분리되어 있어 여기서
        바꿔도 제작가이드·포트폴리오에는 영향이 없습니다.
      </p>

      <div className="mt-5 space-y-3">
        {QUOTE_GROUPS.map((g) => {
          const isOpen = open === g.id;
          return (
            <div key={g.id} className="rounded-lg border border-line">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : g.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-bold text-[#101828]">
                  {g.title}
                  <span className="ml-2 font-normal text-muted">
                    {list(g.id).length}개
                  </span>
                </span>
                <span className="text-muted">{isOpen ? "▲" : "▼"}</span>
              </button>

              {isOpen && (
                <div className="border-t border-line p-4">
                  <p className="mb-3 text-xs text-muted">{g.hint}</p>
                  <div className="space-y-3">
                    {list(g.id).map((o, i) => (
                      <div
                        key={o.id}
                        className="rounded-md border border-line p-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-xs font-medium text-[#364153]">
                            {KIND_LABEL[o.kind]}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button type="button" className={ctrl} onClick={() => move(g.id, i, -1)} disabled={i === 0 || busy} aria-label="위로">↑</button>
                            <button type="button" className={ctrl} onClick={() => move(g.id, i, 1)} disabled={i === list(g.id).length - 1 || busy} aria-label="아래로">↓</button>
                            <button type="button" className={ctrl} onClick={() => remove(g.id, o.id)} disabled={busy} aria-label="삭제">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid gap-3 desktop:grid-cols-[16rem_1fr]">
                          {o.kind === "option" ? (
                            <ImageUpload
                              value={o.image}
                              folder="quote"
                              previewClassName="h-32 w-full"
                              onChange={(url) => patch(g.id, o.id, { image: url })}
                            />
                          ) : (
                            <p className="self-center rounded-md bg-[#F9FAFB] p-3 text-xs text-muted">
                              이 카드는 이미지 없이 아이콘으로 표시됩니다.
                            </p>
                          )}
                          <div className="space-y-2">
                            <div className="grid gap-2 desktop:grid-cols-2">
                              <input className={adminInput} value={o.label_kr} placeholder="이름 (한글)" onChange={(e) => patch(g.id, o.id, { label_kr: e.target.value })} />
                              <input className={adminInput} value={o.label_en} placeholder="이름 (영문)" onChange={(e) => patch(g.id, o.id, { label_en: e.target.value })} />
                            </div>
                            <div className="grid gap-2 desktop:grid-cols-2">
                              <input className={adminInput} value={o.desc_kr} placeholder="설명 · 물음표 도움말 (한글)" onChange={(e) => patch(g.id, o.id, { desc_kr: e.target.value })} />
                              <input className={adminInput} value={o.desc_en} placeholder="설명 · 물음표 도움말 (영문)" onChange={(e) => patch(g.id, o.id, { desc_en: e.target.value })} />
                            </div>
                            <input className={adminInput} value={o.tab} placeholder="분류 (예: 종이박스 / 싸바리박스) — 비우면 분류 없음" onChange={(e) => patch(g.id, o.id, { tab: e.target.value })} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button type="button" className={btnGhost} onClick={() => add(g.id, "option")} disabled={busy}>+ 항목 추가</button>
                    <button type="button" className={btnGhost} onClick={() => add(g.id, "custom")} disabled={busy}>+ 직접입력 카드</button>
                    <button type="button" className={btnGhost} onClick={() => add(g.id, "recommend")} disabled={busy}>+ 추천해주세요 카드</button>
                    <button type="button" className={btnPrimary} onClick={() => saveGroup(g.id)} disabled={busy}>
                      {busy ? "저장 중…" : `${g.title} 저장`}
                    </button>
                    {error && <span className="text-sm text-red-600">{error}</span>}
                    {!error && savedAt && <span className="text-sm text-muted">저장됨 · {savedAt}</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

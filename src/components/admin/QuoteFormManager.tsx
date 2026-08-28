"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminInput, btnGhost, btnPrimary } from "@/components/admin/fields";
import { TrashIcon } from "@/components/icons";
import {
  deleteQuoteFormOption,
  saveQuoteFormOption,
} from "@/app/admin/content-actions";

export type OptionRow = { id: string; label_en: string; label_kr: string };

const GROUPS: { id: string; title: string; hint: string }[] = [
  {
    id: "category",
    title: "제품 카테고리",
    hint: "추천 견적문의의 '카테고리' 선택 목록입니다.",
  },
  {
    id: "hearAbout",
    title: "유입경로",
    hint: "'저희를 어떻게 알게 되셨나요?' 체크박스 목록입니다. 표준·추천 견적문의 양쪽에 표시됩니다.",
  },
];

const ctrlBtn =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-white text-sm font-bold text-[#364153] hover:border-brand hover:text-brand disabled:opacity-30";

export function QuoteFormManager({
  options,
}: {
  options: Record<string, OptionRow[]>;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(options);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const list = (gid: string) => rows[gid] ?? [];

  const patch = (gid: string, oid: string, changes: Partial<OptionRow>) =>
    setRows((r) => ({
      ...r,
      [gid]: list(gid).map((o) => (o.id === oid ? { ...o, ...changes } : o)),
    }));

  const move = (gid: string, i: number, dir: -1 | 1) =>
    setRows((r) => {
      const opts = [...list(gid)];
      const j = i + dir;
      if (j < 0 || j >= opts.length) return r;
      [opts[i], opts[j]] = [opts[j], opts[i]];
      return { ...r, [gid]: opts };
    });

  const addOption = (gid: string) =>
    setRows((r) => ({
      ...r,
      [gid]: [
        ...list(gid),
        { id: crypto.randomUUID(), label_en: "", label_kr: "" },
      ],
    }));

  async function removeOption(gid: string, oid: string) {
    if (!confirm("이 항목을 삭제할까요?")) return;
    setBusy(true);
    setError(null);
    const existed = (options[gid] ?? []).some((o) => o.id === oid);
    const res = existed
      ? await deleteQuoteFormOption(gid, oid)
      : { ok: true as const };
    if (!res.ok) setError(res.error ?? "삭제 실패");
    else
      setRows((r) => ({ ...r, [gid]: list(gid).filter((o) => o.id !== oid) }));
    setBusy(false);
    router.refresh();
  }

  async function saveGroup(gid: string) {
    setBusy(true);
    setError(null);
    const opts = list(gid);
    for (let i = 0; i < opts.length; i++) {
      const res = await saveQuoteFormOption({
        id: opts[i].id,
        group_id: gid,
        label_en: opts[i].label_en,
        label_kr: opts[i].label_kr,
        sort: i + 1,
      });
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
    <div className="space-y-6">
      {GROUPS.map((g) => (
        <section
          key={g.id}
          className="rounded-[var(--radius-card)] border border-line bg-white p-6"
        >
          <h2 className="text-lg max-[500px]:text-[0.9375rem] font-bold text-[#101828]">{g.title}</h2>
          <p className="mt-1 text-sm text-muted">{g.hint}</p>

          <div className="mt-4 space-y-2">
            {list(g.id).length === 0 && (
              <p className="text-sm text-muted">항목이 없습니다.</p>
            )}
            {list(g.id).map((o, i) => (
              <div key={o.id} className="flex flex-wrap items-center gap-2">
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    className={ctrlBtn}
                    onClick={() => move(g.id, i, -1)}
                    disabled={i === 0 || busy}
                    aria-label="위로"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={ctrlBtn}
                    onClick={() => move(g.id, i, 1)}
                    disabled={i === list(g.id).length - 1 || busy}
                    aria-label="아래로"
                  >
                    ↓
                  </button>
                </div>
                <input
                  className={`${adminInput} min-w-[12rem] flex-1`}
                  value={o.label_kr}
                  onChange={(e) => patch(g.id, o.id, { label_kr: e.target.value })}
                  placeholder="이름 (한글)"
                />
                <input
                  className={`${adminInput} min-w-[12rem] flex-1`}
                  value={o.label_en}
                  onChange={(e) => patch(g.id, o.id, { label_en: e.target.value })}
                  placeholder="이름 (영문)"
                />
                <button
                  type="button"
                  className={ctrlBtn}
                  onClick={() => removeOption(g.id, o.id)}
                  disabled={busy}
                  aria-label="삭제"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className={btnGhost}
              onClick={() => addOption(g.id)}
              disabled={busy}
            >
              + 항목 추가
            </button>
            <button
              type="button"
              className={btnPrimary}
              onClick={() => saveGroup(g.id)}
              disabled={busy}
            >
              {busy ? "저장 중…" : "저장"}
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
            {!error && savedAt && (
              <span className="text-sm text-muted">저장됨 · {savedAt}</span>
            )}
          </div>
        </section>
      ))}

      {/* The remaining quote-form content is owned elsewhere — point at it
          rather than adding a second place that writes the same rows. */}
      <section className="rounded-[var(--radius-card)] border border-line bg-white p-6">
        <h2 className="text-lg max-[500px]:text-[0.9375rem] font-bold text-[#101828]">다른 곳에서 관리하는 항목</h2>
        <ul className="mt-3 space-y-3 text-sm text-[#364153]">
          <li>
            <b>섹션 제목 · 안내 문구</b>
            <br />
            <span className="text-muted">
              번역 문구로 관리합니다. 선택지별 (?) 설명은 위 &ldquo;견적문의 선택
              항목&rdquo;에서 항목마다 직접 입력합니다.
            </span>
            <br />
            <Link
              href="/admin/language"
              className="mt-1 inline-block font-semibold text-brand hover:underline"
            >
              언어 관리로 이동 →
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { adminInput, btnGhost, btnPrimary, Field } from "@/components/admin/fields";
import { TrashIcon } from "@/components/icons";
import {
  deleteAboutGallery,
  saveAboutGallery,
  saveAboutGalleryOrder,
} from "@/app/admin/content-actions";

export type GallerySlideRow = {
  id: string;
  image: string;
  caption_en: string;
  caption_kr: string;
};

const ctrlBtn =
  "flex h-8 w-8 items-center justify-center rounded-md border border-line bg-white text-sm font-bold text-[#364153] hover:border-brand hover:text-brand disabled:opacity-30 disabled:hover:border-line disabled:hover:text-[#364153]";

/**
 * "공장 및 장비 갤러리" editor for /about — photo + bilingual caption per slide,
 * reordered with ↑/↓. Rows are saved individually; the order is persisted as a
 * separate step so moving a slide doesn't rewrite every caption.
 */
export function AboutManager({ slides }: { slides: GallerySlideRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<GallerySlideRow[]>(slides);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const patch = (id: string, changes: Partial<GallerySlideRow>) =>
    setRows((list) =>
      list.map((r) => (r.id === id ? { ...r, ...changes } : r)),
    );

  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= rows.length) return;
    const copy = [...rows];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setRows(copy);
  };

  const addRow = () =>
    setRows((list) => [
      ...list,
      { id: crypto.randomUUID(), image: "", caption_en: "", caption_kr: "" },
    ]);

  async function removeRow(id: string) {
    setBusy(true);
    setError(null);
    // Rows that were never saved only exist in local state.
    const res = slides.some((s) => s.id === id)
      ? await deleteAboutGallery(id)
      : { ok: true as const };
    if (!res.ok) setError(res.error ?? "삭제 실패");
    else setRows((list) => list.filter((r) => r.id !== id));
    setBusy(false);
    router.refresh();
  }

  async function saveAll() {
    setBusy(true);
    setError(null);
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const res = await saveAboutGallery({
        id: r.id,
        image: r.image,
        caption_en: r.caption_en,
        caption_kr: r.caption_kr,
        sort: i + 1,
      });
      if (!res.ok) {
        setError(res.error ?? "저장 실패");
        setBusy(false);
        return;
      }
    }
    const order = await saveAboutGalleryOrder(rows.map((r) => r.id));
    if (!order.ok) {
      setError(order.error ?? "순서 저장 실패");
      setBusy(false);
      return;
    }
    setSavedAt(new Date().toLocaleTimeString("ko-KR"));
    setBusy(false);
    router.refresh();
  }

  return (
    <div>
      <p className="mb-5 text-sm text-muted">
        회사소개 페이지의 &ldquo;공장 및 장비 갤러리&rdquo;에 표시되는 사진과 제목입니다.
        위아래 화살표로 순서를 바꾼 뒤 저장하세요.
      </p>

      <div className="space-y-4">
        {rows.map((row, i) => (
          <div
            key={row.id}
            className="rounded-[var(--radius-card)] border border-line bg-white p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-[#101828]">
                슬라이드 {i + 1}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className={ctrlBtn}
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || busy}
                  aria-label="위로"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={ctrlBtn}
                  onClick={() => move(i, 1)}
                  disabled={i === rows.length - 1 || busy}
                  aria-label="아래로"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={ctrlBtn}
                  onClick={() => removeRow(row.id)}
                  disabled={busy}
                  aria-label="삭제"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Wide preview column — these are the gallery photos, so seeing
                which one is which matters more than a compact row. */}
            <div className="grid gap-4 desktop:grid-cols-[26rem_1fr]">
              <ImageUpload
                value={row.image}
                folder="about"
                previewClassName="h-56 w-full"
                onChange={(url) => patch(row.id, { image: url })}
              />
              <div className="space-y-3">
                <Field label="제목 (한글)">
                  <input
                    className={adminInput}
                    value={row.caption_kr}
                    onChange={(e) => patch(row.id, { caption_kr: e.target.value })}
                    placeholder="예: 인쇄 장비"
                  />
                </Field>
                <Field label="제목 (영문)">
                  <input
                    className={adminInput}
                    value={row.caption_en}
                    onChange={(e) => patch(row.id, { caption_en: e.target.value })}
                    placeholder="e.g. Printing Machine"
                  />
                </Field>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" className={btnGhost} onClick={addRow} disabled={busy}>
          + 슬라이드 추가
        </button>
        <button type="button" className={btnPrimary} onClick={saveAll} disabled={busy}>
          {busy ? "저장 중…" : "저장"}
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
        {!error && savedAt && (
          <span className="text-sm text-muted">저장됨 · {savedAt}</span>
        )}
      </div>
    </div>
  );
}

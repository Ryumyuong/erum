"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminInput, Field, Modal } from "@/components/admin/fields";
import { saveFaq, deleteFaq } from "@/app/admin/content-actions";
import { faqCategories } from "@/lib/data/faq";

type Row = {
  id: string;
  category: string;
  q_en: string;
  q_kr: string;
  a_en: string;
  a_kr: string;
};

const empty: Row = { id: "", category: faqCategories[0].id, q_en: "", q_kr: "", a_en: "", a_kr: "" };

export function FaqManager({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);

  function catLabel(id: string) {
    return faqCategories.find((c) => c.id === id)?.label.ko ?? id;
  }

  async function onDelete(id: string) {
    if (!confirm("이 FAQ를 삭제할까요?")) return;
    await deleteFaq(id);
    router.refresh();
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload: Record<string, unknown> = { ...editing };
    if (!editing.id) delete payload.id;
    await saveFaq(payload);
    setSaving(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setEditing({ ...empty })}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + FAQ 추가
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs text-faint">
            <tr>
              <th className="px-4 py-3 font-medium">카테고리</th>
              <th className="px-4 py-3 font-medium">질문 (한글)</th>
              <th className="px-4 py-3 font-medium">질문 (영문)</th>
              <th className="px-4 py-3 text-right font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-muted">{catLabel(r.category)}</td>
                <td className="px-4 py-3 font-medium">{r.q_kr}</td>
                <td className="px-4 py-3 text-muted">{r.q_en}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setEditing(r)} className="text-brand hover:underline">
                      수정
                    </button>
                    <button type="button" onClick={() => onDelete(r.id)} className="text-red-500 hover:underline">
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted">
                  등록된 FAQ가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing.id ? "FAQ 수정" : "FAQ 추가"} onClose={() => setEditing(null)}>
          <form onSubmit={onSave} className="space-y-4">
            <Field label="카테고리">
              <select
                className={adminInput}
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              >
                {faqCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label.ko}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="질문 (한글)">
                <input className={adminInput} value={editing.q_kr} onChange={(e) => setEditing({ ...editing, q_kr: e.target.value })} />
              </Field>
              <Field label="질문 (영문)">
                <input className={adminInput} value={editing.q_en} onChange={(e) => setEditing({ ...editing, q_en: e.target.value })} />
              </Field>
            </div>
            <Field label="답변 (한글)">
              <textarea className={`${adminInput} min-h-24`} value={editing.a_kr} onChange={(e) => setEditing({ ...editing, a_kr: e.target.value })} />
            </Field>
            <Field label="답변 (영문)">
              <textarea className={`${adminInput} min-h-24`} value={editing.a_en} onChange={(e) => setEditing({ ...editing, a_en: e.target.value })} />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-line px-5 py-2 text-sm font-medium">
                취소
              </button>
              <button type="submit" disabled={saving} className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
                {saving ? "저장 중…" : "저장"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

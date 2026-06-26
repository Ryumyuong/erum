"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminInput, Field, Modal } from "@/components/admin/fields";
import { saveGlossary, deleteGlossary } from "@/app/admin/content-actions";
import { glossaryCategories } from "@/lib/data/glossary";

type Row = {
  id: string;
  category: string;
  term_en: string;
  term_kr: string;
  desc_en: string;
  desc_kr: string;
  tags_en: string[];
  tags_kr: string[];
};

const empty: Row = {
  id: "", category: glossaryCategories[0].id, term_en: "", term_kr: "",
  desc_en: "", desc_kr: "", tags_en: [], tags_kr: [],
};

const toCsv = (a: string[]) => (a ?? []).join(", ");
const fromCsv = (s: string) => s.split(",").map((t) => t.trim()).filter(Boolean);

export function GlossaryManager({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);

  function catLabel(id: string) {
    return glossaryCategories.find((c) => c.id === id)?.label.ko ?? id;
  }

  async function onDelete(id: string) {
    if (!confirm("이 용어를 삭제할까요?")) return;
    await deleteGlossary(id);
    router.refresh();
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload: Record<string, unknown> = { ...editing };
    if (!editing.id) delete payload.id;
    await saveGlossary(payload);
    setSaving(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={() => setEditing({ ...empty })} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          + 용어 추가
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs text-faint">
            <tr>
              <th className="px-4 py-3 font-medium">카테고리</th>
              <th className="px-4 py-3 font-medium">용어 (영문)</th>
              <th className="px-4 py-3 font-medium">용어 (한글)</th>
              <th className="px-4 py-3 text-right font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-muted">{catLabel(r.category)}</td>
                <td className="px-4 py-3 font-medium">{r.term_en}</td>
                <td className="px-4 py-3 text-muted">{r.term_kr}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setEditing({ ...r, tags_en: r.tags_en ?? [], tags_kr: r.tags_kr ?? [] })} className="text-brand hover:underline">수정</button>
                    <button type="button" onClick={() => onDelete(r.id)} className="text-red-500 hover:underline">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-muted">등록된 용어가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing.id ? "용어 수정" : "용어 추가"} onClose={() => setEditing(null)}>
          <form onSubmit={onSave} className="space-y-4">
            <Field label="카테고리">
              <select className={adminInput} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {glossaryCategories.map((c) => <option key={c.id} value={c.id}>{c.label.ko}</option>)}
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="용어 (영문)"><input className={adminInput} value={editing.term_en} onChange={(e) => setEditing({ ...editing, term_en: e.target.value })} /></Field>
              <Field label="용어 (한글)"><input className={adminInput} value={editing.term_kr} onChange={(e) => setEditing({ ...editing, term_kr: e.target.value })} /></Field>
            </div>
            <Field label="설명 (영문)"><textarea className={`${adminInput} min-h-20`} value={editing.desc_en} onChange={(e) => setEditing({ ...editing, desc_en: e.target.value })} /></Field>
            <Field label="설명 (한글)"><textarea className={`${adminInput} min-h-20`} value={editing.desc_kr} onChange={(e) => setEditing({ ...editing, desc_kr: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="태그 (영문, 쉼표 구분)"><input className={adminInput} value={toCsv(editing.tags_en)} onChange={(e) => setEditing({ ...editing, tags_en: fromCsv(e.target.value) })} /></Field>
              <Field label="태그 (한글, 쉼표 구분)"><input className={adminInput} value={toCsv(editing.tags_kr)} onChange={(e) => setEditing({ ...editing, tags_kr: fromCsv(e.target.value) })} /></Field>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-line px-5 py-2 text-sm font-medium">취소</button>
              <button type="submit" disabled={saving} className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">{saving ? "저장 중…" : "저장"}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

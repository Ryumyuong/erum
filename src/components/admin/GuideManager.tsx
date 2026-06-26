"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminInput, Field, Modal } from "@/components/admin/fields";
import {
  saveGuideSection,
  deleteGuideSection,
  saveGuideItem,
  deleteGuideItem,
} from "@/app/admin/content-actions";

type Section = { id: string; key: string; title_en: string; title_kr: string };
type Item = {
  id: string;
  section_id: string;
  title_en: string;
  title_kr: string;
  subtitle: string;
  desc_en: string;
  desc_kr: string;
  tip_en: string;
  tip_kr: string;
};

export function GuideManager({
  sections,
  items,
}: {
  sections: Section[];
  items: Item[];
}) {
  const router = useRouter();
  const [secEdit, setSecEdit] = useState<Section | null>(null);
  const [itemEdit, setItemEdit] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);

  async function delSection(id: string) {
    if (!confirm("섹션과 하위 항목을 모두 삭제할까요?")) return;
    await deleteGuideSection(id);
    router.refresh();
  }
  async function delItem(id: string) {
    if (!confirm("이 항목을 삭제할까요?")) return;
    await deleteGuideItem(id);
    router.refresh();
  }

  async function saveSec(e: React.FormEvent) {
    e.preventDefault();
    if (!secEdit) return;
    setSaving(true);
    const p: Record<string, unknown> = { ...secEdit };
    if (!secEdit.id) delete p.id;
    await saveGuideSection(p);
    setSaving(false);
    setSecEdit(null);
    router.refresh();
  }
  async function saveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!itemEdit) return;
    setSaving(true);
    const p: Record<string, unknown> = { ...itemEdit };
    if (!itemEdit.id) delete p.id;
    await saveGuideItem(p);
    setSaving(false);
    setItemEdit(null);
    router.refresh();
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setSecEdit({ id: "", key: "", title_en: "", title_kr: "" })}
          className="rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-soft"
        >
          + 섹션 추가
        </button>
      </div>

      <div className="space-y-5">
        {sections.map((s) => (
          <div key={s.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold">
                {s.title_kr} <span className="text-sm font-normal text-faint">({s.title_en})</span>
              </h2>
              <div className="flex gap-3 text-sm">
                <button type="button" onClick={() => setItemEdit({ id: "", section_id: s.id, title_en: "", title_kr: "", subtitle: "", desc_en: "", desc_kr: "", tip_en: "", tip_kr: "" })} className="text-brand hover:underline">+ 항목</button>
                <button type="button" onClick={() => setSecEdit(s)} className="text-muted hover:underline">수정</button>
                <button type="button" onClick={() => delSection(s.id)} className="text-red-500 hover:underline">삭제</button>
              </div>
            </div>
            <ul className="divide-y divide-line">
              {items.filter((it) => it.section_id === s.id).map((it) => (
                <li key={it.id} className="flex items-center justify-between py-2 text-sm">
                  <span>{it.title_kr} <span className="text-faint">/ {it.title_en}</span></span>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setItemEdit(it)} className="text-brand hover:underline">수정</button>
                    <button type="button" onClick={() => delItem(it.id)} className="text-red-500 hover:underline">삭제</button>
                  </div>
                </li>
              ))}
              {items.filter((it) => it.section_id === s.id).length === 0 && (
                <li className="py-2 text-sm text-faint">항목이 없습니다.</li>
              )}
            </ul>
          </div>
        ))}
        {sections.length === 0 && (
          <p className="rounded-2xl bg-white p-10 text-center text-sm text-muted shadow-sm">섹션이 없습니다.</p>
        )}
      </div>

      {secEdit && (
        <Modal title={secEdit.id ? "섹션 수정" : "섹션 추가"} onClose={() => setSecEdit(null)}>
          <form onSubmit={saveSec} className="space-y-4">
            <Field label="키 (영문 식별자, 예: printing)"><input className={adminInput} value={secEdit.key} onChange={(e) => setSecEdit({ ...secEdit, key: e.target.value })} required /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="제목 (영문)"><input className={adminInput} value={secEdit.title_en} onChange={(e) => setSecEdit({ ...secEdit, title_en: e.target.value })} /></Field>
              <Field label="제목 (한글)"><input className={adminInput} value={secEdit.title_kr} onChange={(e) => setSecEdit({ ...secEdit, title_kr: e.target.value })} /></Field>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setSecEdit(null)} className="rounded-full border border-line px-5 py-2 text-sm font-medium">취소</button>
              <button type="submit" disabled={saving} className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">{saving ? "저장 중…" : "저장"}</button>
            </div>
          </form>
        </Modal>
      )}

      {itemEdit && (
        <Modal title={itemEdit.id ? "항목 수정" : "항목 추가"} onClose={() => setItemEdit(null)}>
          <form onSubmit={saveItem} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="제목 (영문)"><input className={adminInput} value={itemEdit.title_en} onChange={(e) => setItemEdit({ ...itemEdit, title_en: e.target.value })} /></Field>
              <Field label="제목 (한글)"><input className={adminInput} value={itemEdit.title_kr} onChange={(e) => setItemEdit({ ...itemEdit, title_kr: e.target.value })} /></Field>
            </div>
            <Field label="부제 (작은 영문 라벨)"><input className={adminInput} value={itemEdit.subtitle} onChange={(e) => setItemEdit({ ...itemEdit, subtitle: e.target.value })} /></Field>
            <Field label="설명 (영문)"><textarea className={`${adminInput} min-h-20`} value={itemEdit.desc_en} onChange={(e) => setItemEdit({ ...itemEdit, desc_en: e.target.value })} /></Field>
            <Field label="설명 (한글)"><textarea className={`${adminInput} min-h-20`} value={itemEdit.desc_kr} onChange={(e) => setItemEdit({ ...itemEdit, desc_kr: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="전문가 코멘트 (영문)"><input className={adminInput} value={itemEdit.tip_en} onChange={(e) => setItemEdit({ ...itemEdit, tip_en: e.target.value })} /></Field>
              <Field label="전문가 코멘트 (한글)"><input className={adminInput} value={itemEdit.tip_kr} onChange={(e) => setItemEdit({ ...itemEdit, tip_kr: e.target.value })} /></Field>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setItemEdit(null)} className="rounded-full border border-line px-5 py-2 text-sm font-medium">취소</button>
              <button type="submit" disabled={saving} className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">{saving ? "저장 중…" : "저장"}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

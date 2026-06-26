"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminInput, Field, Modal } from "@/components/admin/fields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { saveBlog, deleteBlog } from "@/app/admin/content-actions";
import { blogCategories } from "@/lib/data/blog";

type Row = {
  id: string;
  slug: string;
  category: string;
  title_en: string;
  title_kr: string;
  summary_en: string;
  summary_kr: string;
  body_en: string;
  body_kr: string;
  cover: string | null;
  published_at: string;
};

const today = "2026-01-01";
const empty: Row = {
  id: "", slug: "", category: blogCategories[0].id, title_en: "", title_kr: "",
  summary_en: "", summary_kr: "", body_en: "", body_kr: "", cover: "", published_at: today,
};

export function BlogManager({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);

  function catLabel(id: string) {
    return blogCategories.find((c) => c.id === id)?.label.ko ?? id;
  }
  function set<K extends keyof Row>(k: K, v: Row[K]) {
    setEditing((e) => (e ? { ...e, [k]: v } : e));
  }

  async function onDelete(id: string) {
    if (!confirm("이 게시물을 삭제할까요?")) return;
    await deleteBlog(id);
    router.refresh();
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload: Record<string, unknown> = { ...editing };
    if (!editing.id) delete payload.id;
    await saveBlog(payload);
    setSaving(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={() => setEditing({ ...empty })} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          + 새 게시물
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs text-faint">
            <tr>
              <th className="px-4 py-3 font-medium">커버</th>
              <th className="px-4 py-3 font-medium">카테고리</th>
              <th className="px-4 py-3 font-medium">제목 (한글)</th>
              <th className="px-4 py-3 font-medium">날짜</th>
              <th className="px-4 py-3 text-right font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="px-4 py-2">
                  <div className="relative h-10 w-14 overflow-hidden rounded bg-gray-100">
                    {r.cover && <Image src={r.cover} alt="" fill sizes="56px" className="object-cover" />}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{catLabel(r.category)}</td>
                <td className="px-4 py-3 font-medium">{r.title_kr}</td>
                <td className="px-4 py-3 text-muted">{r.published_at}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setEditing(r)} className="text-brand hover:underline">수정</button>
                    <button type="button" onClick={() => onDelete(r.id)} className="text-red-500 hover:underline">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted">게시물이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing.id ? "게시물 수정" : "새 게시물"} onClose={() => setEditing(null)}>
          <form onSubmit={onSave} className="space-y-4">
            <Field label="커버 이미지">
              <ImageUpload folder="blog" value={editing.cover ?? ""} onChange={(url) => set("cover", url)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="슬러그 (URL)"><input className={adminInput} value={editing.slug} onChange={(e) => set("slug", e.target.value)} required /></Field>
              <Field label="카테고리">
                <select className={adminInput} value={editing.category} onChange={(e) => set("category", e.target.value)}>
                  {blogCategories.map((c) => <option key={c.id} value={c.id}>{c.label.ko}</option>)}
                </select>
              </Field>
              <Field label="제목 (영문)"><input className={adminInput} value={editing.title_en} onChange={(e) => set("title_en", e.target.value)} /></Field>
              <Field label="제목 (한글)"><input className={adminInput} value={editing.title_kr} onChange={(e) => set("title_kr", e.target.value)} /></Field>
            </div>
            <Field label="요약 (영문)"><input className={adminInput} value={editing.summary_en} onChange={(e) => set("summary_en", e.target.value)} /></Field>
            <Field label="요약 (한글)"><input className={adminInput} value={editing.summary_kr} onChange={(e) => set("summary_kr", e.target.value)} /></Field>
            <Field label="본문 (영문)"><textarea className={`${adminInput} min-h-24`} value={editing.body_en} onChange={(e) => set("body_en", e.target.value)} /></Field>
            <Field label="본문 (한글)"><textarea className={`${adminInput} min-h-24`} value={editing.body_kr} onChange={(e) => set("body_kr", e.target.value)} /></Field>
            <Field label="발행일">
              <input type="date" className={adminInput} value={editing.published_at} onChange={(e) => set("published_at", e.target.value)} />
            </Field>
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

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { adminInput, adminSelect, btnGhost, btnPrimary, Field, Modal } from "@/components/admin/fields";
import { Pagination } from "@/components/admin/Pagination";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { EditIcon, TrashIcon } from "@/components/icons";
import {
  saveBlog,
  deleteBlog,
  saveBlogCategory,
  deleteBlogCategory,
} from "@/app/admin/content-actions";

type Cat = { id: string; label_en: string; label_kr: string; sort: number };

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
  id: "", slug: "", category: "", title_en: "", title_kr: "",
  summary_en: "", summary_kr: "", body_en: "", body_kr: "", cover: "", published_at: today,
};

export function BlogManager({
  rows,
  categories,
}: {
  rows: Row[];
  categories: Cat[];
}) {
  const router = useRouter();
  const [cats, setCats] = useState<Cat[]>(categories);
  const [editing, setEditing] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [addingCat, setAddingCat] = useState(false);
  const [managingCat, setManagingCat] = useState(false);
  const [newCat, setNewCat] = useState({ label_kr: "", label_en: "" });

  const PER_PAGE = 10;
  const pageCount = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const paged = rows.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  function catLabel(id: string) {
    return cats.find((c) => c.id === id)?.label_kr ?? id;
  }
  function set<K extends keyof Row>(k: K, v: Row[K]) {
    setEditing((e) => (e ? { ...e, [k]: v } : e));
  }

  async function onDelete(id: string) {
    if (!confirm("이 게시물을 삭제할까요?")) return;
    const res = await deleteBlog(id);
    if (!res.ok) {
      alert(`삭제 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    router.refresh();
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload: Record<string, unknown> = { ...editing };
    if (!editing.id) delete payload.id;
    const res = await saveBlog(payload);
    setSaving(false);
    if (!res.ok) {
      alert(`저장 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    setEditing(null);
    router.refresh();
  }

  // Add a new category from inside the post modal, then select it.
  async function onAddCat() {
    if (!newCat.label_kr.trim() || !editing) return;
    const cat: Cat = {
      id: crypto.randomUUID(),
      label_kr: newCat.label_kr.trim(),
      label_en: newCat.label_en.trim(),
      sort: cats.length + 1,
    };
    setSaving(true);
    const res = await saveBlogCategory(cat);
    setSaving(false);
    if (!res.ok) {
      alert(`카테고리 추가 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    setCats([...cats, cat]);
    setEditing({ ...editing, category: cat.id });
    setNewCat({ label_kr: "", label_en: "" });
    setAddingCat(false);
    router.refresh();
  }

  // 관리 패널: 카테고리 편집·삭제·순서변경
  function setCatLabel(id: string, key: "label_kr" | "label_en", value: string) {
    setCats((list) => list.map((c) => (c.id === id ? { ...c, [key]: value } : c)));
  }

  async function onSaveCatEdit(cat: Cat, index: number) {
    if (!cat.label_kr.trim()) return;
    setSaving(true);
    const res = await saveBlogCategory({
      id: cat.id,
      label_kr: cat.label_kr.trim(),
      label_en: (cat.label_en || cat.label_kr).trim(),
      sort: index + 1,
    });
    setSaving(false);
    if (!res.ok) {
      alert(`카테고리 저장 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    router.refresh();
  }

  async function onDeleteCat(id: string) {
    if (
      !confirm(
        "이 카테고리를 삭제할까요?\n이 카테고리의 게시물은 분류되지 않은 상태가 됩니다.",
      )
    )
      return;
    setSaving(true);
    const res = await deleteBlogCategory(id);
    setSaving(false);
    if (!res.ok) {
      alert(`카테고리 삭제 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    setCats((list) => list.filter((c) => c.id !== id));
    setEditing((e) => (e && e.category === id ? { ...e, category: "" } : e));
    router.refresh();
  }

  async function moveCat(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= cats.length) return;
    const next = cats.map((c) => ({ ...c }));
    [next[index], next[j]] = [next[j], next[index]];
    const reordered = next.map((c, i) => ({ ...c, sort: i + 1 }));
    setCats(reordered);
    setSaving(true);
    const results = await Promise.all(
      [reordered[index], reordered[j]].map((c) =>
        saveBlogCategory({
          id: c.id,
          label_kr: c.label_kr,
          label_en: c.label_en,
          sort: c.sort,
        }),
      ),
    );
    setSaving(false);
    const failed = results.find((r) => !r.ok);
    if (failed) alert(`순서 변경 실패\n${failed.error ?? "알 수 없는 오류"}`);
    router.refresh();
  }

  function closeModal() {
    setEditing(null);
    setAddingCat(false);
    setManagingCat(false);
    setNewCat({ label_kr: "", label_en: "" });
  }

  return (
    <>
      <AdminPageHeader
        title="블로그 관리"
        actions={
          <button
            type="button"
            onClick={() => setEditing({ ...empty, category: cats[0]?.id ?? "" })}
            className="inline-flex items-center gap-2 rounded-[0.625rem] bg-[#FD7304] px-4 py-2 text-[1rem] font-medium text-white hover:bg-brand-dark"
          >
            <Image src="/icons/admin-plus.png" alt="" width={40} height={40} className="h-4 w-4" />
            새 게시물
          </button>
        }
      />

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-sm">
          <thead className="border-b border-line bg-[#F9FAFB] text-xs text-[#6A7282]">
            <tr>
              <th className="px-6 py-4 font-medium">커버</th>
              <th className="px-6 py-4 font-medium">카테고리</th>
              <th className="px-6 py-4 font-medium">제목 (한글)</th>
              <th className="px-6 py-4 font-medium">날짜</th>
              <th className="px-6 py-4 font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="px-6 py-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-[0.25rem] bg-gray-100">
                    {r.cover && <Image src={r.cover} alt="" fill sizes="80px" className="object-cover" />}
                  </div>
                </td>
                <td className="px-6 py-4 text-muted">{catLabel(r.category)}</td>
                <td className="px-6 py-4 font-medium">{r.title_kr}</td>
                <td className="px-6 py-4 text-muted">{r.published_at}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(r)}
                      aria-label="수정"
                      className="flex h-9 w-9 items-center justify-center rounded-md text-brand hover:bg-brand-soft"
                    >
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(r.id)}
                      aria-label="삭제"
                      className="flex h-9 w-9 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
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
      </div>

      <Pagination page={current} pageCount={pageCount} onChange={setPage} />

      {editing && (
        <Modal title={editing.id ? "게시물 수정" : "새 게시물"} onClose={closeModal}>
          <form onSubmit={onSave} className="space-y-4">
            <Field label="커버 이미지">
              <ImageUpload folder="blog" value={editing.cover ?? ""} onChange={(url) => set("cover", url)} />
            </Field>
            <Field label="카테고리">
              {managingCat ? (
                <div className="space-y-2 rounded-lg border border-line bg-gray-50 p-3">
                  {cats.length === 0 && (
                    <p className="text-sm text-muted">카테고리가 없습니다.</p>
                  )}
                  {cats.map((c, i) => (
                    <div key={c.id} className="flex items-center gap-2">
                      <div className="flex shrink-0 flex-col">
                        <button
                          type="button"
                          onClick={() => moveCat(i, -1)}
                          disabled={saving || i === 0}
                          aria-label="위로"
                          className="px-1 text-xs leading-none text-muted hover:text-brand disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveCat(i, 1)}
                          disabled={saving || i === cats.length - 1}
                          aria-label="아래로"
                          className="px-1 text-xs leading-none text-muted hover:text-brand disabled:opacity-30"
                        >
                          ▼
                        </button>
                      </div>
                      <input
                        className={adminInput}
                        placeholder="이름 (한글)"
                        value={c.label_kr}
                        onChange={(e) => setCatLabel(c.id, "label_kr", e.target.value)}
                      />
                      <input
                        className={adminInput}
                        placeholder="이름 (영문)"
                        value={c.label_en}
                        onChange={(e) => setCatLabel(c.id, "label_en", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => onSaveCatEdit(c, i)}
                        disabled={saving || !c.label_kr.trim()}
                        className="shrink-0 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteCat(c.id)}
                        disabled={saving}
                        className="shrink-0 rounded-lg border border-line px-3 py-2 text-sm font-medium text-red-600 hover:border-red-300 disabled:opacity-50"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setManagingCat(false)}
                      className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium"
                    >
                      완료
                    </button>
                  </div>
                </div>
              ) : !addingCat ? (
                <div className="flex gap-2">
                  <select className={adminSelect} value={editing.category} onChange={(e) => set("category", e.target.value)}>
                    {cats.length === 0 && <option value="">카테고리를 추가하세요</option>}
                    {cats.map((c) => <option key={c.id} value={c.id}>{c.label_kr}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={() => setAddingCat(true)}
                    className="shrink-0 rounded-lg border border-line px-3 text-sm font-semibold whitespace-nowrap hover:border-brand hover:text-brand"
                  >
                    + 새 카테고리
                  </button>
                  <button
                    type="button"
                    onClick={() => setManagingCat(true)}
                    disabled={cats.length === 0}
                    className="shrink-0 rounded-lg border border-line px-3 text-sm font-semibold whitespace-nowrap hover:border-brand hover:text-brand disabled:opacity-50"
                  >
                    관리
                  </button>
                </div>
              ) : (
                <div className="space-y-2 rounded-lg border border-line bg-gray-50 p-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input className={adminInput} placeholder="이름 (한글)" value={newCat.label_kr} onChange={(e) => setNewCat({ ...newCat, label_kr: e.target.value })} />
                    <input className={adminInput} placeholder="이름 (영문)" value={newCat.label_en} onChange={(e) => setNewCat({ ...newCat, label_en: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setAddingCat(false); setNewCat({ label_kr: "", label_en: "" }); }}
                      className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={onAddCat}
                      disabled={saving || !newCat.label_kr.trim()}
                      className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                      추가
                    </button>
                  </div>
                </div>
              )}
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="슬러그 (URL)"><input className={adminInput} value={editing.slug} onChange={(e) => set("slug", e.target.value)} required /></Field>
              <Field label="제목 (영문)"><input className={adminInput} value={editing.title_en} onChange={(e) => set("title_en", e.target.value)} /></Field>
              <Field label="제목 (한글)"><input className={adminInput} value={editing.title_kr} onChange={(e) => set("title_kr", e.target.value)} /></Field>
            </div>
            <Field label="요약 (영문)"><input className={adminInput} value={editing.summary_en} onChange={(e) => set("summary_en", e.target.value)} /></Field>
            <Field label="요약 (한글)"><input className={adminInput} value={editing.summary_kr} onChange={(e) => set("summary_kr", e.target.value)} /></Field>
            <Field label="본문 (영문)">
              <RichTextEditor
                value={editing.body_en}
                onChange={(html) => set("body_en", html)}
                placeholder="본문을 입력하세요. 제목/소제목/굵게로 서식을 지정할 수 있습니다."
              />
            </Field>
            <Field label="본문 (한글)">
              <RichTextEditor
                value={editing.body_kr}
                onChange={(html) => set("body_kr", html)}
                placeholder="본문을 입력하세요. 제목/소제목/굵게로 서식을 지정할 수 있습니다."
              />
            </Field>
            <Field label="발행일">
              <input type="date" className={adminInput} value={editing.published_at} onChange={(e) => set("published_at", e.target.value)} />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeModal} className={btnGhost}>취소</button>
              <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "저장 중…" : "저장"}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

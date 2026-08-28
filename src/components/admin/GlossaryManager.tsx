"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { adminInput, adminSelect, btnGhost, btnPrimary, Field, Modal } from "@/components/admin/fields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { EditIcon, TrashIcon } from "@/components/icons";
import {
  saveGlossary,
  deleteGlossary,
  saveGlossaryCategory,
  deleteGlossaryCategory,
} from "@/app/admin/content-actions";

type Row = {
  id: string;
  category: string;
  term_en: string;
  term_kr: string;
  desc_en: string;
  desc_kr: string;
  tags_en: string[];
  tags_kr: string[];
  images: string[];
  when_used_en: string;
  when_used_kr: string;
  recommended_for_en: string;
  recommended_for_kr: string;
};

type Cat = { id: string; label_en: string; label_kr: string; sort: number };

const toCsv = (a: string[]) => (a ?? []).join(", ");
const fromCsv = (s: string) => s.split(",").map((t) => t.trim()).filter(Boolean);

export function GlossaryManager({
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

  // Raw tag input strings — kept as-is while typing so commas/spaces aren't
  // stripped mid-edit; parsed into arrays on change. Reset when switching item.
  const [tagsEnStr, setTagsEnStr] = useState("");
  const [tagsKrStr, setTagsKrStr] = useState("");
  useEffect(() => {
    if (editing) {
      setTagsEnStr(toCsv(editing.tags_en));
      setTagsKrStr(toCsv(editing.tags_kr));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing?.id]);

  // Inline "add category" state (inside the term modal)
  const [addingCat, setAddingCat] = useState(false);
  const [managingCat, setManagingCat] = useState(false);
  // Same panel, opened from the toolbar instead of the 용어 modal.
  const [catModal, setCatModal] = useState(false);
  const [newCat, setNewCat] = useState({ label_kr: "", label_en: "" });

  const empty: Row = {
    id: "",
    category: cats[0]?.id ?? "",
    term_en: "",
    term_kr: "",
    desc_en: "",
    desc_kr: "",
    tags_en: [],
    tags_kr: [],
    images: [],
    when_used_en: "",
    when_used_kr: "",
    recommended_for_en: "",
    recommended_for_kr: "",
  };

  // Group by the categories actually present on the terms, looking up labels
  // from the category list — so terms still show even if a category row is
  // missing (falls back to the raw category id as the label).
  const catById = new Map(cats.map((c) => [c.id, c] as const));
  const grouped: { cat: Cat; items: Row[] }[] = [];
  const byCat = new Map<string, Row[]>();
  for (const r of rows) {
    let arr = byCat.get(r.category);
    if (!arr) {
      arr = [];
      byCat.set(r.category, arr);
      grouped.push({
        cat:
          catById.get(r.category) ?? {
            id: r.category,
            label_en: r.category,
            label_kr: r.category,
            sort: 999,
          },
        items: arr,
      });
    }
    arr.push(r);
  }
  grouped.sort((a, b) => a.cat.sort - b.cat.sort);

  async function onDelete(id: string) {
    if (!confirm("이 용어를 삭제할까요?")) return;
    const res = await deleteGlossary(id);
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
    const res = await saveGlossary(payload);
    setSaving(false);
    if (!res.ok) {
      alert(`저장 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    setEditing(null);
    router.refresh();
  }

  // Add a new category from inside the term modal, then select it.
  async function onAddCat() {
    if (!newCat.label_kr.trim() || !editing) return;
    const cat: Cat = {
      id: crypto.randomUUID(),
      label_kr: newCat.label_kr.trim(),
      label_en: newCat.label_en.trim(),
      sort: cats.length + 1,
    };
    setSaving(true);
    const res = await saveGlossaryCategory(cat);
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

  // 관리 패널: 카테고리 라벨 인라인 수정(로컬) → 저장 시 DB upsert.
  function setCatLabel(id: string, key: "label_kr" | "label_en", value: string) {
    setCats((list) => list.map((c) => (c.id === id ? { ...c, [key]: value } : c)));
  }

  async function onSaveCatEdit(cat: Cat, index: number) {
    if (!cat.label_kr.trim()) return;
    setSaving(true);
    const res = await saveGlossaryCategory({
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
        "이 카테고리를 삭제할까요?\n이 카테고리의 용어는 분류되지 않은 상태가 됩니다.",
      )
    )
      return;
    setSaving(true);
    const res = await deleteGlossaryCategory(id);
    setSaving(false);
    if (!res.ok) {
      alert(`카테고리 삭제 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    setCats((list) => list.filter((c) => c.id !== id));
    setEditing((e) => (e && e.category === id ? { ...e, category: "" } : e));
    router.refresh();
  }

  // 순서 변경: 두 카테고리를 맞바꾸고 sort를 위치 기준으로 다시 저장.
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
        saveGlossaryCategory({
          id: c.id,
          label_kr: c.label_kr,
          label_en: c.label_en,
          sort: c.sort,
        }),
      ),
    );
    setSaving(false);
    const failed = results.find((r) => !r.ok);
    if (failed) {
      alert(`순서 변경 실패\n${failed.error ?? "알 수 없는 오류"}`);
    }
    router.refresh();
  }

  function closeModal() {
    setEditing(null);
    setAddingCat(false);
    setManagingCat(false);
    setNewCat({ label_kr: "", label_en: "" });
  }

  /**
   * Category editor. Rendered both from the toolbar (own modal) and from the
   * category field inside the 용어 modal, so it lives here rather than inline.
   */
  const catPanel = (onDone: () => void) => (
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
          onClick={onDone}
          className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium"
        >
          완료
        </button>
      </div>
    </div>
  );

  return (
    <>
      <AdminPageHeader
        title="용어사전 관리"
        actions={
          <>
          {/* Categories are the headings on this screen, so they need to be
              editable from here — not only from inside the 용어 modal. */}
          <button
            type="button"
            onClick={() => setCatModal(true)}
            className="inline-flex items-center gap-2 rounded-[0.625rem] border border-line bg-white px-4 py-2 text-[1rem] font-medium text-[#364153] hover:border-brand hover:text-brand"
          >
            카테고리 관리
          </button>
          <button
            type="button"
            onClick={() => setEditing({ ...empty })}
            className="inline-flex items-center gap-2 rounded-[0.625rem] bg-[#FD7304] px-4 py-2 text-[1rem] font-medium text-white hover:bg-brand-dark"
          >
            <Image src="/icons/admin-plus.png" alt="" width={40} height={40} className="h-4 w-4" />
            용어 추가
          </button>
          </>
        }
      />

      {catModal && (
        <Modal title="카테고리 관리" onClose={() => setCatModal(false)}>
          {catPanel(() => setCatModal(false))}
        </Modal>
      )}

      {rows.length === 0 ? (
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-muted shadow-sm">
          등록된 용어가 없습니다.
        </p>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ cat, items }) => (
            <div key={cat.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="border-b border-line px-5 py-3">
                <h2 className="text-lg max-[500px]:text-[0.9375rem] font-bold text-[#101828]">
                  {cat.label_en}{" "}
                  <span className="text-[1.0625rem] max-[500px]:text-[0.875rem] font-normal text-[#6A7282]">({cat.label_kr})</span>
                </h2>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full min-w-max text-left text-sm">
                <thead className="border-b border-line bg-[#F9FAFB] text-xs text-[#6A7282]">
                  <tr>
                    <th className="px-6 py-4 font-medium">용어 (영문)</th>
                    <th className="px-6 py-4 font-medium">용어 (한글)</th>
                    <th className="px-6 py-4 font-medium">이미지</th>
                    <th className="px-6 py-4 font-medium">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r) => (
                    <tr key={r.id} className="border-b border-line last:border-0">
                      <td className="whitespace-nowrap px-6 py-4 font-medium">{r.term_en}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-muted">{r.term_kr}</td>
                      <td className="px-6 py-4 text-muted">
                        {(r.images?.length ?? 0)}개
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditing({ ...r, tags_en: r.tags_en ?? [], tags_kr: r.tags_kr ?? [], images: r.images ?? [], when_used_en: r.when_used_en ?? "", when_used_kr: r.when_used_kr ?? "", recommended_for_en: r.recommended_for_en ?? "", recommended_for_kr: r.recommended_for_kr ?? "" })}
                            aria-label="수정"
                            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
                          >
                            <EditIcon className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(r.id)}
                            aria-label="삭제"
                            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-red-50"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? "용어 수정" : "용어 추가"} onClose={closeModal}>
          <form onSubmit={onSave} className="space-y-4">
            <Field label="카테고리">
              {managingCat ? (
                catPanel(() => setManagingCat(false))
              ) : !addingCat ? (
                <div className="flex gap-2">
                  <select
                    className={adminSelect}
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  >
                    {cats.length === 0 && (
                      <option value="">카테고리를 추가하세요</option>
                    )}
                    {cats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label_kr}
                      </option>
                    ))}
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
                    <input
                      className={adminInput}
                      placeholder="이름 (한글)"
                      value={newCat.label_kr}
                      onChange={(e) => setNewCat({ ...newCat, label_kr: e.target.value })}
                    />
                    <input
                      className={adminInput}
                      placeholder="이름 (영문)"
                      value={newCat.label_en}
                      onChange={(e) => setNewCat({ ...newCat, label_en: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAddingCat(false);
                        setNewCat({ label_kr: "", label_en: "" });
                      }}
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
              <Field label="용어 (영문)"><input className={adminInput} value={editing.term_en} onChange={(e) => setEditing({ ...editing, term_en: e.target.value })} /></Field>
              <Field label="용어 (한글)"><input className={adminInput} value={editing.term_kr} onChange={(e) => setEditing({ ...editing, term_kr: e.target.value })} /></Field>
            </div>
            <Field label="설명 (영문)"><textarea className={`${adminInput} min-h-20`} value={editing.desc_en} onChange={(e) => setEditing({ ...editing, desc_en: e.target.value })} /></Field>
            <Field label="설명 (한글)"><textarea className={`${adminInput} min-h-20`} value={editing.desc_kr} onChange={(e) => setEditing({ ...editing, desc_kr: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="태그 (영문, 쉼표 구분)"><input className={adminInput} value={tagsEnStr} onChange={(e) => { setTagsEnStr(e.target.value); setEditing((prev) => prev ? { ...prev, tags_en: fromCsv(e.target.value) } : prev); }} /></Field>
              <Field label="태그 (한글, 쉼표 구분)"><input className={adminInput} value={tagsKrStr} onChange={(e) => { setTagsKrStr(e.target.value); setEditing((prev) => prev ? { ...prev, tags_kr: fromCsv(e.target.value) } : prev); }} /></Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="어떤 경우에 사용하나요? (영문)"><textarea className={`${adminInput} min-h-20`} value={editing.when_used_en} onChange={(e) => setEditing({ ...editing, when_used_en: e.target.value })} /></Field>
              <Field label="어떤 경우에 사용하나요? (한글)"><textarea className={`${adminInput} min-h-20`} value={editing.when_used_kr} onChange={(e) => setEditing({ ...editing, when_used_kr: e.target.value })} /></Field>
              <Field label="추천 분야 (영문)"><textarea className={`${adminInput} min-h-20`} value={editing.recommended_for_en} onChange={(e) => setEditing({ ...editing, recommended_for_en: e.target.value })} /></Field>
              <Field label="추천 분야 (한글)"><textarea className={`${adminInput} min-h-20`} value={editing.recommended_for_kr} onChange={(e) => setEditing({ ...editing, recommended_for_kr: e.target.value })} /></Field>
            </div>

            <Field label="이미지">
              <div className="space-y-3">
                {editing.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editing.images.map((url, i) => (
                      <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-line">
                        <Image src={url} alt="" fill sizes="64px" className="object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setEditing((e) =>
                              e ? { ...e, images: e.images.filter((_, j) => j !== i) } : e,
                            )
                          }
                          aria-label="이미지 제거"
                          className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <ImageUpload
                  folder="glossary"
                  value=""
                  onChange={(url) =>
                    url &&
                    setEditing((e) => (e ? { ...e, images: [...e.images, url] } : e))
                  }
                />
              </div>
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

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { adminInput, adminSelect, btnGhost, btnPrimary, Field, Modal } from "@/components/admin/fields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { EditIcon, TrashIcon } from "@/components/icons";
import {
  saveGuideSection,
  deleteGuideSection,
  saveGuideItem,
  deleteGuideItem,
} from "@/app/admin/content-actions";

type Section = { id: string; key: string; title_en: string; title_kr: string; desc_en?: string; desc_kr?: string };
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
  images: string[];
};

export function GuideManager({
  sections,
  items,
}: {
  sections: Section[];
  items: Item[];
}) {
  const router = useRouter();
  const [secs, setSecs] = useState<Section[]>(sections);
  const [secEdit, setSecEdit] = useState<Section | null>(null);
  const [itemEdit, setItemEdit] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);

  // Inline "add section" state (inside the item modal)
  const [addingSec, setAddingSec] = useState(false);
  const [newSec, setNewSec] = useState({ key: "", title_kr: "", title_en: "" });

  const newItem = (sectionId?: string): Item => ({
    id: "", section_id: sectionId ?? secs[0]?.id ?? "", title_en: "", title_kr: "",
    subtitle: "", desc_en: "", desc_kr: "", tip_en: "", tip_kr: "", images: [],
  });

  async function delSection(id: string) {
    if (!confirm("섹션과 하위 항목을 모두 삭제할까요?")) return;
    const res = await deleteGuideSection(id);
    if (!res.ok) {
      alert(`삭제 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    router.refresh();
  }
  async function delItem(id: string) {
    if (!confirm("이 항목을 삭제할까요?")) return;
    const res = await deleteGuideItem(id);
    if (!res.ok) {
      alert(`삭제 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    router.refresh();
  }

  async function saveSec(e: React.FormEvent) {
    e.preventDefault();
    if (!secEdit) return;
    setSaving(true);
    const p: Record<string, unknown> = { ...secEdit };
    if (!secEdit.id) delete p.id;
    const res = await saveGuideSection(p);
    setSaving(false);
    if (!res.ok) {
      alert(`저장 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    setSecEdit(null);
    router.refresh();
  }
  async function saveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!itemEdit) return;
    setSaving(true);
    const p: Record<string, unknown> = { ...itemEdit };
    if (!itemEdit.id) delete p.id;
    const res = await saveGuideItem(p);
    setSaving(false);
    if (!res.ok) {
      alert(`저장 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    setItemEdit(null);
    router.refresh();
  }

  // Add a new section from inside the item modal, then select it.
  async function onAddSec() {
    if (!newSec.key.trim() || !newSec.title_kr.trim() || !itemEdit) return;
    const sec: Section = {
      id: crypto.randomUUID(),
      key: newSec.key.trim(),
      title_kr: newSec.title_kr.trim(),
      title_en: newSec.title_en.trim(),
    };
    setSaving(true);
    const res = await saveGuideSection({ ...sec, sort: secs.length + 1 });
    setSaving(false);
    if (!res.ok) {
      alert(`섹션 추가 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    setSecs([...secs, sec]);
    setItemEdit({ ...itemEdit, section_id: sec.id });
    setNewSec({ key: "", title_kr: "", title_en: "" });
    setAddingSec(false);
    router.refresh();
  }

  function closeItemModal() {
    setItemEdit(null);
    setAddingSec(false);
    setNewSec({ key: "", title_kr: "", title_en: "" });
  }

  return (
    <>
      <AdminPageHeader
        title="제작가이드 관리"
        actions={
          <button
            type="button"
            onClick={() => setItemEdit(newItem())}
            className="inline-flex items-center gap-2 rounded-[0.625rem] bg-[#FD7304] px-4 py-2 text-[1rem] font-medium text-white hover:bg-brand-dark"
          >
            <Image src="/icons/admin-plus.png" alt="" width={40} height={40} className="h-4 w-4" />
            항목 추가
          </button>
        }
      />

      {sections.length === 0 ? (
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-muted shadow-sm">
          섹션이 없습니다. 먼저 섹션을 추가하세요.
        </p>
      ) : (
        <div className="space-y-6">
          {sections.map((s) => {
            const secItems = items.filter((it) => it.section_id === s.id);
            return (
              <div key={s.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <h2 className="text-sm font-bold">
                    {s.title_kr}{" "}
                    <span className="font-normal text-muted">({s.title_en})</span>
                  </h2>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSecEdit(s)}
                      aria-label="섹션 수정"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-gray-100 hover:text-ink"
                    >
                      <EditIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => delSection(s.id)}
                      aria-label="섹션 삭제"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-red-50 hover:text-red-500"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                <table className="w-full min-w-max text-left text-sm">
                  <thead className="border-b border-line bg-[#F9FAFB] text-xs text-[#6A7282]">
                    <tr>
                      <th className="px-6 py-4 font-medium">제목 (영문)</th>
                      <th className="px-6 py-4 font-medium">제목 (한글)</th>
                      <th className="px-6 py-4 font-medium">이미지</th>
                      <th className="px-6 py-4 font-medium">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {secItems.map((it) => (
                      <tr key={it.id} className="border-b border-line last:border-0">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{it.title_en}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-muted">{it.title_kr}</td>
                        <td className="px-6 py-4 text-muted">
                          {(it.images?.length ?? 0)}개
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setItemEdit({ ...it, images: it.images ?? [] })}
                              aria-label="수정"
                              className="flex h-9 w-9 items-center justify-center rounded-md text-brand hover:bg-brand-soft"
                            >
                              <EditIcon className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => delItem(it.id)}
                              aria-label="삭제"
                              className="flex h-9 w-9 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {secItems.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-5 py-6 text-center text-sm text-faint">
                          항목이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {secEdit && (
        <Modal title={secEdit.id ? "섹션 수정" : "섹션 추가"} onClose={() => setSecEdit(null)}>
          <form onSubmit={saveSec} className="space-y-4">
            <Field label="키 (영문 식별자, 예: printing)"><input className={adminInput} value={secEdit.key} onChange={(e) => setSecEdit({ ...secEdit, key: e.target.value })} required /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="제목 (영문)"><input className={adminInput} value={secEdit.title_en} onChange={(e) => setSecEdit({ ...secEdit, title_en: e.target.value })} /></Field>
              <Field label="제목 (한글)"><input className={adminInput} value={secEdit.title_kr} onChange={(e) => setSecEdit({ ...secEdit, title_kr: e.target.value })} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="설명 (한글, 제목 아래 2–3줄)"><textarea rows={3} className={adminInput} value={secEdit.desc_kr ?? ""} onChange={(e) => setSecEdit({ ...secEdit, desc_kr: e.target.value })} /></Field>
              <Field label="설명 (영문)"><textarea rows={3} className={adminInput} value={secEdit.desc_en ?? ""} onChange={(e) => setSecEdit({ ...secEdit, desc_en: e.target.value })} /></Field>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setSecEdit(null)} className={btnGhost}>취소</button>
              <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "저장 중…" : "저장"}</button>
            </div>
          </form>
        </Modal>
      )}

      {itemEdit && (
        <Modal title={itemEdit.id ? "항목 수정" : "항목 추가"} onClose={closeItemModal}>
          <form onSubmit={saveItem} className="space-y-4">
            <Field label="섹션">
              {!addingSec ? (
                <div className="flex gap-2">
                  <select
                    className={adminSelect}
                    value={itemEdit.section_id}
                    onChange={(e) => setItemEdit({ ...itemEdit, section_id: e.target.value })}
                  >
                    {secs.length === 0 && <option value="">섹션을 추가하세요</option>}
                    {secs.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title_kr} ({s.title_en})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setAddingSec(true)}
                    className="shrink-0 rounded-lg border border-line px-3 text-sm font-semibold whitespace-nowrap hover:border-brand hover:text-brand"
                  >
                    + 새 섹션
                  </button>
                </div>
              ) : (
                <div className="space-y-2 rounded-lg border border-line bg-gray-50 p-3">
                  <input
                    className={adminInput}
                    placeholder="키 (영문 식별자, 예: printing)"
                    value={newSec.key}
                    onChange={(e) => setNewSec({ ...newSec, key: e.target.value })}
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      className={adminInput}
                      placeholder="제목 (한글)"
                      value={newSec.title_kr}
                      onChange={(e) => setNewSec({ ...newSec, title_kr: e.target.value })}
                    />
                    <input
                      className={adminInput}
                      placeholder="제목 (영문)"
                      value={newSec.title_en}
                      onChange={(e) => setNewSec({ ...newSec, title_en: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAddingSec(false);
                        setNewSec({ key: "", title_kr: "", title_en: "" });
                      }}
                      className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={onAddSec}
                      disabled={saving || !newSec.key.trim() || !newSec.title_kr.trim()}
                      className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                      추가
                    </button>
                  </div>
                </div>
              )}
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="제목 (영문)"><input className={adminInput} value={itemEdit.title_en} onChange={(e) => setItemEdit({ ...itemEdit, title_en: e.target.value })} /></Field>
              <Field label="제목 (한글)"><input className={adminInput} value={itemEdit.title_kr} onChange={(e) => setItemEdit({ ...itemEdit, title_kr: e.target.value })} /></Field>
            </div>
            <Field label="부제 (작은 영문 라벨)"><input className={adminInput} value={itemEdit.subtitle} onChange={(e) => setItemEdit({ ...itemEdit, subtitle: e.target.value })} /></Field>
            <Field label="설명 (영문)"><textarea className={`${adminInput} min-h-20`} value={itemEdit.desc_en} onChange={(e) => setItemEdit({ ...itemEdit, desc_en: e.target.value })} /></Field>
            <Field label="설명 (한글)"><textarea className={`${adminInput} min-h-20`} value={itemEdit.desc_kr} onChange={(e) => setItemEdit({ ...itemEdit, desc_kr: e.target.value })} /></Field>

            <Field label="이미지">
              <div className="space-y-3">
                {itemEdit.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {itemEdit.images.map((url, i) => (
                      <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-line">
                        <Image src={url} alt="" fill sizes="64px" className="object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setItemEdit((e) =>
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
                  folder="guide"
                  value=""
                  onChange={(url) =>
                    url &&
                    setItemEdit((e) => (e ? { ...e, images: [...e.images, url] } : e))
                  }
                />
              </div>
            </Field>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeItemModal} className={btnGhost}>취소</button>
              <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "저장 중…" : "저장"}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

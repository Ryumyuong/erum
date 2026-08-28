"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { adminInput, adminSelect, btnGhost, btnPrimary, Field, Modal } from "@/components/admin/fields";
import { Pagination } from "@/components/admin/Pagination";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  savePortfolio,
  deletePortfolio,
  setPortfolioHidden,
  setPortfolioSort,
  saveUseField,
  deleteUseField,
} from "@/app/admin/content-actions";
import { cn } from "@/lib/utils";
import type { L } from "@/lib/content";

type Row = {
  id: string;
  item_no: string;
  name_en: string;
  name_kr: string;
  hover_en: string;
  hover_kr: string;
  use_field: string | null;
  material: string | null;
  package_type: string | null;
  package_form: string | null;
  printing: string[];
  coating_en: string;
  coating_kr: string;
  finishing_en: string;
  finishing_kr: string;
  dim_l: number | null;
  dim_w: number | null;
  dim_h: number | null;
  thumbnail: string | null;
  images: string[];
  categories: Record<string, string[]>;
  hidden: boolean;
  sort: number;
};

type Taxonomy = { key: string; label: L; items: { id: string; label: L }[] }[];

const empty: Row = {
  id: "", item_no: "", name_en: "", name_kr: "", hover_en: "", hover_kr: "",
  use_field: "", material: "", package_type: "", package_form: "", printing: [],
  coating_en: "", coating_kr: "", finishing_en: "", finishing_kr: "",
  dim_l: null, dim_w: null, dim_h: null, thumbnail: "", images: [], categories: {},
  hidden: false, sort: 0,
};


function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

// The guide section that drives the auto-generated 품번 (BD-{CODE}-NNN).
const PACKAGE_TYPE_KEY = "package-types";

export function PortfolioManager({
  rows,
  taxonomy,
  useFields,
}: {
  rows: Row[];
  taxonomy: Taxonomy;
  useFields: { id: string; label: L }[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // 사용분야 옵션(동적) + 모달 내 인라인 추가 상태
  const [useFieldOpts, setUseFieldOpts] = useState(useFields);
  const [addingUseField, setAddingUseField] = useState(false);
  const [managingUseField, setManagingUseField] = useState(false);
  const [newUseField, setNewUseField] = useState({ label_kr: "", label_en: "" });

  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.item_no.toLowerCase().includes(q) ||
        r.name_en.toLowerCase().includes(q) ||
        r.name_kr.toLowerCase().includes(q),
    );
  }, [rows, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const paged = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  function set<K extends keyof Row>(key: K, value: Row[K]) {
    setEditing((e) => (e ? { ...e, [key]: value } : e));
  }

  // 이미지: 순서가 곧 상세페이지 노출 순서이고, 첫 장이 목록/카드 대표 이미지다.
  function addImage(url: string) {
    setEditing((e) => (e ? { ...e, images: [...e.images, url] } : e));
  }

  function removeImage(index: number) {
    setEditing((e) =>
      e ? { ...e, images: e.images.filter((_, i) => i !== index) } : e,
    );
  }

  function moveImage(index: number, dir: -1 | 1) {
    setEditing((e) => {
      if (!e) return e;
      const j = index + dir;
      if (j < 0 || j >= e.images.length) return e;
      const next = [...e.images];
      [next[index], next[j]] = [next[j], next[index]];
      return { ...e, images: next };
    });
  }

  // Item numbers follow BD-{CODE}-{NNN}, where CODE is the first two letters of
  // the selected 패키지 종류 guide item's English label; NNN auto-increments.
  function nextItemNo(code: string, excludeId?: string) {
    if (!code) return "";
    const prefix = `BD-${code}-`;
    let max = 0;
    for (const r of rows) {
      if (r.id === excludeId) continue;
      if (r.item_no?.startsWith(prefix)) {
        const n = parseInt(r.item_no.slice(prefix.length), 10);
        if (!Number.isNaN(n) && n > max) max = n;
      }
    }
    return `${prefix}${String(max + 1).padStart(3, "0")}`;
  }

  // Guide-driven category selects (single choice each), stored in `categories`
  // so they directly drive the public portfolio filter. Choosing the 패키지
  // 종류 also re-derives the 품번.
  function onCatChange(sectionKey: string, id: string) {
    setEditing((e) => {
      if (!e) return e;
      const next = {
        ...e,
        categories: { ...e.categories, [sectionKey]: id ? [id] : [] },
      };
      if (sectionKey === PACKAGE_TYPE_KEY) {
        const item = taxonomy
          .find((s) => s.key === PACKAGE_TYPE_KEY)
          ?.items.find((x) => x.id === id);
        const code = item
          ? item.label.en.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase()
          : "";
        next.item_no = code ? nextItemNo(code, e.id) : "";
      }
      return next;
    });
  }

  // 모달 안에서 새 사용분야를 추가하고 바로 선택한다.
  async function onAddUseField() {
    if (!newUseField.label_kr.trim() || !editing) return;
    const opt = {
      id: crypto.randomUUID(),
      label_kr: newUseField.label_kr.trim(),
      label_en: newUseField.label_en.trim() || newUseField.label_kr.trim(),
      sort: useFieldOpts.length + 1,
    };
    setSaving(true);
    const res = await saveUseField(opt);
    setSaving(false);
    if (!res.ok) {
      alert(`사용분야 추가 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    setUseFieldOpts([
      ...useFieldOpts,
      { id: opt.id, label: { en: opt.label_en, ko: opt.label_kr } },
    ]);
    set("use_field", opt.id);
    setAddingUseField(false);
    setNewUseField({ label_kr: "", label_en: "" });
  }

  // 관리 패널: 사용분야 라벨 인라인 수정(로컬) → 저장 시 DB upsert.
  function setUseFieldLabel(id: string, key: "en" | "ko", value: string) {
    setUseFieldOpts((opts) =>
      opts.map((o) =>
        o.id === id ? { ...o, label: { ...o.label, [key]: value } } : o,
      ),
    );
  }

  async function onSaveUseFieldEdit(o: { id: string; label: L }, index: number) {
    if (!o.label.ko.trim()) return;
    setSaving(true);
    const res = await saveUseField({
      id: o.id,
      label_kr: o.label.ko.trim(),
      label_en: (o.label.en || o.label.ko).trim(),
      sort: index + 1,
    });
    setSaving(false);
    if (!res.ok) alert(`사용분야 저장 실패\n${res.error ?? "알 수 없는 오류"}`);
  }

  async function onDeleteUseFieldOpt(id: string) {
    if (
      !confirm(
        "이 사용분야를 삭제할까요?\n이 분야로 지정된 포트폴리오는 '사용분야 없음'이 됩니다.",
      )
    )
      return;
    setSaving(true);
    const res = await deleteUseField(id);
    setSaving(false);
    if (!res.ok) {
      alert(`삭제 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    setUseFieldOpts((opts) => opts.filter((o) => o.id !== id));
    setEditing((e) => (e && e.use_field === id ? { ...e, use_field: "" } : e));
  }

  // 순서 변경: 두 사용분야를 맞바꾸고 sort를 위치 기준으로 다시 저장.
  async function moveUseField(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= useFieldOpts.length) return;
    const next = useFieldOpts.map((o) => ({ ...o }));
    [next[index], next[j]] = [next[j], next[index]];
    setUseFieldOpts(next);
    setSaving(true);
    const results = await Promise.all(
      [
        { o: next[index], sort: index + 1 },
        { o: next[j], sort: j + 1 },
      ].map(({ o, sort }) =>
        saveUseField({
          id: o.id,
          label_kr: o.label.ko,
          label_en: o.label.en || o.label.ko,
          sort,
        }),
      ),
    );
    setSaving(false);
    const failed = results.find((r) => !r.ok);
    if (failed) alert(`순서 변경 실패\n${failed.error ?? "알 수 없는 오류"}`);
  }

  async function onDelete(id: string) {
    if (!confirm("이 포트폴리오를 삭제할까요?")) return;
    const res = await deletePortfolio(id);
    if (!res.ok) {
      alert(`삭제 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    router.refresh();
  }

  // 순서 변경: 전체 목록에서 인접 항목과 위치를 맞바꾸고 sort를 재지정해 저장.
  async function moveRow(r: Row, dir: -1 | 1) {
    const idx = rows.findIndex((x) => x.id === r.id);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[idx], next[j]] = [next[j], next[idx]];
    const res = await setPortfolioSort(
      next.map((x, i) => ({ id: x.id, sort: i + 1 })),
    );
    if (!res.ok) {
      alert(`순서 변경 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    router.refresh();
  }

  async function onToggleHidden(r: Row) {
    const res = await setPortfolioHidden(r.id, !r.hidden);
    if (!res.ok) {
      alert(`상태 변경 실패\n${res.error ?? "알 수 없는 오류"}`);
      return;
    }
    router.refresh();
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!editing.item_no.trim()) {
      alert("품번을 입력해 주세요. 패키지 종류를 고르면 자동으로 채워집니다.");
      return;
    }
    setSaving(true);
    const payload: Record<string, unknown> = {
      ...editing,
      dim_l: editing.dim_l ? Number(editing.dim_l) : null,
      dim_w: editing.dim_w ? Number(editing.dim_w) : null,
      dim_h: editing.dim_h ? Number(editing.dim_h) : null,
    };
    if (!editing.id) delete payload.id;
    const result = await savePortfolio(payload);
    setSaving(false);
    if (!result.ok) {
      alert(`저장에 실패했습니다.\n${result.error ?? "알 수 없는 오류"}`);
      return;
    }
    setEditing(null);
    router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        title="포트폴리오 관리"
        actions={
          <button
            type="button"
            onClick={() => setEditing({ ...empty })}
            className="inline-flex items-center gap-2 rounded-[0.625rem] bg-brand px-4 py-2 text-[1rem] font-semibold text-white hover:bg-brand-dark"
          >
            <Image src="/icons/admin-plus.png" alt="" width={40} height={40} className="h-4 w-4" />
            포트폴리오 추가
          </button>
        }
      />

      <div className="overflow-hidden rounded-[0.625rem] bg-white shadow">
        {/* Search (inside card) */}
        <div className="px-6 pt-6 pb-4">
          <div className="relative">
            <Image
              src="/icons/search.png"
              alt=""
              width={40}
              height={40}
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
            />
            <input
              className="w-full rounded-[0.625rem] border border-[#D1D5DC] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-brand"
              placeholder="품번·제품명 검색"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[0.75rem] font-medium text-[#6A7282]">
              <th className="px-6 py-4 text-left text-[0.75rem] font-medium whitespace-nowrap text-[#6A7282]">THUMBNAIL</th>
              <th className="px-6 py-4 text-left text-[0.75rem] font-medium whitespace-nowrap text-[#6A7282]">ITEM NO.</th>
              <th className="px-6 py-4 text-left text-[0.75rem] font-medium whitespace-nowrap text-[#6A7282]">NAME</th>
              <th className="px-6 py-4 text-left text-[0.75rem] font-medium whitespace-nowrap text-[#6A7282]">CATEGORY</th>
              <th className="px-6 py-4 text-left text-[0.75rem] font-medium whitespace-nowrap text-[#6A7282]">LANGUAGE</th>
              <th className="px-6 py-4 text-left text-[0.75rem] font-medium whitespace-nowrap text-[#6A7282]">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr
                key={r.id}
                className={cn(
                  "border-b border-line last:border-0",
                  r.hidden && "opacity-40",
                )}
              >
                <td className="px-6 py-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-[0.25rem] bg-gray-100">
                    {r.thumbnail && (
                      <Image src={r.thumbnail} alt="" fill sizes="80px" className="object-cover" />
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-[0.875rem] text-[#101828]">{r.item_no}</td>
                <td className="whitespace-nowrap px-6 py-4 text-[0.875rem] font-medium text-[#101828]">
                  {r.name_en}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-[0.875rem] text-[#4A5565]">
                  {useFieldOpts.find((o) => o.id === r.use_field)?.label.en ?? "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1.5">
                    {r.name_en && (
                      <span className="rounded-[0.25rem] bg-[#DCFCE7] px-2 py-0.5 text-[0.75rem] text-[#008236]">
                        EN
                      </span>
                    )}
                    {r.name_kr && (
                      <span className="rounded-[0.25rem] bg-[#DCFCE7] px-2 py-0.5 text-[0.75rem] text-[#008236]">
                        KR
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => moveRow(r, -1)}
                        disabled={!!query || rows[0]?.id === r.id}
                        aria-label="위로"
                        title={query ? "검색 중에는 순서를 바꿀 수 없습니다" : "위로"}
                        className="px-1 text-[0.6875rem] leading-none text-muted hover:text-brand disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveRow(r, 1)}
                        disabled={!!query || rows[rows.length - 1]?.id === r.id}
                        aria-label="아래로"
                        title={query ? "검색 중에는 순서를 바꿀 수 없습니다" : "아래로"}
                        className="px-1 text-[0.6875rem] leading-none text-muted hover:text-brand disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleHidden(r)}
                      aria-label={r.hidden ? "노출하기" : "숨기기"}
                      title={r.hidden ? "숨김 상태 — 클릭하면 노출" : "노출 중 — 클릭하면 숨김"}
                      className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
                    >
                      {r.hidden ? (
                        <EyeOffIcon className="h-5 w-5 text-slate-400" />
                      ) : (
                        <Image src="/icons/admin-eye.png" alt="" width={36} height={36} className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...r,
                          printing: r.printing ?? [],
                          // Rows saved before multi-image start from their thumbnail.
                          images: r.images?.length
                            ? r.images
                            : r.thumbnail
                              ? [r.thumbnail]
                              : [],
                        })
                      }
                      aria-label="수정"
                      className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
                    >
                      <Image src="/icons/admin-edit-slate.png" alt="" width={36} height={36} className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(r.id)}
                      aria-label="삭제"
                      className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-red-50"
                    >
                      <Image src="/icons/admin-delete.png" alt="" width={36} height={36} className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  포트폴리오가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <Pagination page={current} pageCount={pageCount} onChange={setPage} />

      {editing && (
        <Modal title={editing.id ? "포트폴리오 수정" : "포트폴리오 추가"} onClose={() => setEditing(null)}>
          <form onSubmit={onSave} className="space-y-4">
            <Field label="이미지 (여러 장)">
              <div className="space-y-3">
                {editing.images.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {editing.images.map((url, i) => (
                      <div key={`${url}-${i}`} className="w-24">
                        <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-line">
                          <Image src={url} alt="" fill sizes="96px" className="object-cover" />
                          {i === 0 && (
                            <span className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center text-[0.625rem] font-semibold text-white">
                              대표
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            aria-label="이미지 제거"
                            className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="mt-1 flex justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveImage(i, -1)}
                            disabled={i === 0}
                            aria-label="앞으로"
                            className="px-1.5 text-xs leading-none text-muted hover:text-brand disabled:opacity-30"
                          >
                            ◀
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(i, 1)}
                            disabled={i === editing.images.length - 1}
                            aria-label="뒤로"
                            className="px-1.5 text-xs leading-none text-muted hover:text-brand disabled:opacity-30"
                          >
                            ▶
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <ImageUpload
                  folder="portfolio"
                  multiple
                  onChange={(url) => url && addImage(url)}
                />
                <p className="text-xs text-faint">
                  한 번에 여러 장을 선택하면 고른 순서대로 뒤에 추가됩니다. 첫 번째
                  이미지가 목록·카드의 대표 이미지이고, 상세페이지에는 이 순서대로
                  세로로 나열됩니다.
                </p>
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="품번 (Item No.)"
                hint="패키지 종류를 고르면 자동으로 채워집니다. 쓰시는 양식이 있으면 직접 고치세요."
              >
                <input
                  className={adminInput}
                  value={editing.item_no}
                  onChange={(e) => set("item_no", e.target.value)}
                  placeholder="예: BD-FO-001"
                />
              </Field>
              <div />
              <Field label="제품명 (영문)">
                <input className={adminInput} value={editing.name_en} onChange={(e) => set("name_en", e.target.value)} />
              </Field>
              <Field label="제품명 (국문)">
                <input className={adminInput} value={editing.name_kr} onChange={(e) => set("name_kr", e.target.value)} />
              </Field>
            </div>

            <Field label="사용분야">
              {managingUseField ? (
                <div className="space-y-2 rounded-lg border border-line bg-gray-50 p-3">
                  {useFieldOpts.length === 0 && (
                    <p className="text-sm text-muted">항목이 없습니다.</p>
                  )}
                  {useFieldOpts.map((o, i) => (
                    <div key={o.id} className="flex items-center gap-2">
                      <div className="flex shrink-0 flex-col">
                        <button
                          type="button"
                          onClick={() => moveUseField(i, -1)}
                          disabled={saving || i === 0}
                          aria-label="위로"
                          className="px-1 text-xs leading-none text-muted hover:text-brand disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveUseField(i, 1)}
                          disabled={saving || i === useFieldOpts.length - 1}
                          aria-label="아래로"
                          className="px-1 text-xs leading-none text-muted hover:text-brand disabled:opacity-30"
                        >
                          ▼
                        </button>
                      </div>
                      <input
                        className={adminInput}
                        placeholder="이름 (한글)"
                        value={o.label.ko}
                        onChange={(e) => setUseFieldLabel(o.id, "ko", e.target.value)}
                      />
                      <input
                        className={adminInput}
                        placeholder="이름 (영문)"
                        value={o.label.en}
                        onChange={(e) => setUseFieldLabel(o.id, "en", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => onSaveUseFieldEdit(o, i)}
                        disabled={saving || !o.label.ko.trim()}
                        className="shrink-0 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteUseFieldOpt(o.id)}
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
                      onClick={() => setManagingUseField(false)}
                      className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium"
                    >
                      완료
                    </button>
                  </div>
                </div>
              ) : !addingUseField ? (
                <div className="flex gap-2">
                  <select
                    className={adminSelect}
                    value={editing.use_field ?? ""}
                    onChange={(e) => set("use_field", e.target.value)}
                  >
                    <option value="">선택 안 함</option>
                    {useFieldOpts.map((o) => (
                      <option key={o.id} value={o.id}>{o.label.ko}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setAddingUseField(true)}
                    className="shrink-0 rounded-lg border border-line px-3 text-sm font-semibold whitespace-nowrap hover:border-brand hover:text-brand"
                  >
                    + 새 사용분야
                  </button>
                  <button
                    type="button"
                    onClick={() => setManagingUseField(true)}
                    disabled={useFieldOpts.length === 0}
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
                      value={newUseField.label_kr}
                      onChange={(e) => setNewUseField({ ...newUseField, label_kr: e.target.value })}
                    />
                    <input
                      className={adminInput}
                      placeholder="이름 (영문)"
                      value={newUseField.label_en}
                      onChange={(e) => setNewUseField({ ...newUseField, label_en: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAddingUseField(false);
                        setNewUseField({ label_kr: "", label_en: "" });
                      }}
                      className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={onAddUseField}
                      disabled={saving || !newUseField.label_kr.trim()}
                      className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                      추가
                    </button>
                  </div>
                </div>
              )}
            </Field>

            {/* 제작가이드 섹션 기반 분류 — 단일 선택. 가이드에 항목이 늘면
                여기에도 자동 반영되고, 선택값이 공개 포트폴리오 필터를 구동한다. */}
            <div className="grid gap-4 sm:grid-cols-2">
              {taxonomy.map((s) => (
                <Field key={s.key} label={s.label.ko}>
                  <select
                    className={adminSelect}
                    value={editing.categories?.[s.key]?.[0] ?? ""}
                    onChange={(e) => onCatChange(s.key, e.target.value)}
                  >
                    <option value="">선택 안 함</option>
                    {s.items.map((it) => (
                      <option key={it.id} value={it.id}>{it.label.ko}</option>
                    ))}
                  </select>
                </Field>
              ))}
            </div>

            <Field label="장폭고 (mm)">
              <div className="grid grid-cols-3 gap-3">
                <input className={adminInput} type="number" placeholder="가로" value={editing.dim_l ?? ""} onChange={(e) => set("dim_l", e.target.value === "" ? null : Number(e.target.value))} />
                <input className={adminInput} type="number" placeholder="세로" value={editing.dim_w ?? ""} onChange={(e) => set("dim_w", e.target.value === "" ? null : Number(e.target.value))} />
                <input className={adminInput} type="number" placeholder="높이" value={editing.dim_h ?? ""} onChange={(e) => set("dim_h", e.target.value === "" ? null : Number(e.target.value))} />
              </div>
            </Field>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className={btnGhost}>
                취소
              </button>
              <button type="submit" disabled={saving} className={btnPrimary}>
                {saving ? "저장 중…" : "저장"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { adminInput, Field, Modal } from "@/components/admin/fields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { savePortfolio, deletePortfolio } from "@/app/admin/content-actions";
import { portfolioFilters, type FilterGroupId } from "@/lib/data/portfolio";

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
};

const empty: Row = {
  id: "", item_no: "", name_en: "", name_kr: "", hover_en: "", hover_kr: "",
  use_field: "", material: "", package_type: "", package_form: "", printing: [],
  coating_en: "", coating_kr: "", finishing_en: "", finishing_kr: "",
  dim_l: null, dim_w: null, dim_h: null, thumbnail: "",
};

function group(id: FilterGroupId) {
  return portfolioFilters.find((g) => g.id === id)!;
}

const selectGroups: { gid: FilterGroupId; key: keyof Row }[] = [
  { gid: "useField", key: "use_field" },
  { gid: "material", key: "material" },
  { gid: "packageType", key: "package_type" },
  { gid: "packageForm", key: "package_form" },
];

export function PortfolioManager({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

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

  function set<K extends keyof Row>(key: K, value: Row[K]) {
    setEditing((e) => (e ? { ...e, [key]: value } : e));
  }

  async function onDelete(id: string) {
    if (!confirm("이 포트폴리오를 삭제할까요?")) return;
    await deletePortfolio(id);
    router.refresh();
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload: Record<string, unknown> = {
      ...editing,
      dim_l: editing.dim_l ? Number(editing.dim_l) : null,
      dim_w: editing.dim_w ? Number(editing.dim_w) : null,
      dim_h: editing.dim_h ? Number(editing.dim_h) : null,
    };
    if (!editing.id) delete payload.id;
    await savePortfolio(payload);
    setSaving(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          className={`${adminInput} max-w-xs`}
          placeholder="품번·제품명 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setEditing({ ...empty })}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + 포트폴리오 추가
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs text-faint">
            <tr>
              <th className="px-4 py-3 font-medium">썸네일</th>
              <th className="px-4 py-3 font-medium">품번</th>
              <th className="px-4 py-3 font-medium">제품명</th>
              <th className="px-4 py-3 font-medium">종류</th>
              <th className="px-4 py-3 text-right font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="px-4 py-2">
                  <div className="relative h-10 w-10 overflow-hidden rounded bg-gray-100">
                    {r.thumbnail && (
                      <Image src={r.thumbnail} alt="" fill sizes="40px" className="object-cover" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{r.item_no}</td>
                <td className="px-4 py-3 font-medium">{r.name_en}</td>
                <td className="px-4 py-3 text-muted">
                  {group("packageType").options.find((o) => o.id === r.package_type)?.label.ko ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setEditing({ ...r, printing: r.printing ?? [] })} className="text-brand hover:underline">
                      수정
                    </button>
                    <button type="button" onClick={() => onDelete(r.id)} className="text-red-500 hover:underline">
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  포트폴리오가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing.id ? "포트폴리오 수정" : "포트폴리오 추가"} onClose={() => setEditing(null)}>
          <form onSubmit={onSave} className="space-y-4">
            <Field label="이미지">
              <ImageUpload
                folder="portfolio"
                value={editing.thumbnail ?? ""}
                onChange={(url) => set("thumbnail", url)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="품번 (Item No.)">
                <input className={adminInput} value={editing.item_no} onChange={(e) => set("item_no", e.target.value)} required />
              </Field>
              <div />
              <Field label="제품명 (영문)">
                <input className={adminInput} value={editing.name_en} onChange={(e) => set("name_en", e.target.value)} />
              </Field>
              <Field label="제품명 (국문)">
                <input className={adminInput} value={editing.name_kr} onChange={(e) => set("name_kr", e.target.value)} />
              </Field>
              <Field label="호버 정보 (영문)">
                <input className={adminInput} value={editing.hover_en} onChange={(e) => set("hover_en", e.target.value)} />
              </Field>
              <Field label="호버 정보 (국문)">
                <input className={adminInput} value={editing.hover_kr} onChange={(e) => set("hover_kr", e.target.value)} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {selectGroups.map(({ gid, key }) => (
                <Field key={gid} label={group(gid).label.ko}>
                  <select
                    className={adminInput}
                    value={(editing[key] as string) ?? ""}
                    onChange={(e) => set(key, e.target.value as Row[typeof key])}
                  >
                    <option value="">선택 안 함</option>
                    {group(gid).options.map((o) => (
                      <option key={o.id} value={o.id}>{o.label.ko}</option>
                    ))}
                  </select>
                </Field>
              ))}
            </div>

            <Field label="인쇄 (복수 선택)">
              <div className="flex flex-wrap gap-3">
                {group("printing").options.map((o) => {
                  const checked = editing.printing.includes(o.id);
                  return (
                    <label key={o.id} className="flex items-center gap-1.5 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          set(
                            "printing",
                            checked ? editing.printing.filter((p) => p !== o.id) : [...editing.printing, o.id],
                          )
                        }
                        className="h-4 w-4 accent-[var(--color-brand)]"
                      />
                      {o.label.ko}
                    </label>
                  );
                })}
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="코팅 (영문)">
                <input className={adminInput} value={editing.coating_en} onChange={(e) => set("coating_en", e.target.value)} />
              </Field>
              <Field label="코팅 (국문)">
                <input className={adminInput} value={editing.coating_kr} onChange={(e) => set("coating_kr", e.target.value)} />
              </Field>
              <Field label="후가공 (영문)">
                <input className={adminInput} value={editing.finishing_en} onChange={(e) => set("finishing_en", e.target.value)} />
              </Field>
              <Field label="후가공 (국문)">
                <input className={adminInput} value={editing.finishing_kr} onChange={(e) => set("finishing_kr", e.target.value)} />
              </Field>
            </div>

            <Field label="장폭고 (mm)">
              <div className="grid grid-cols-3 gap-3">
                <input className={adminInput} type="number" placeholder="가로" value={editing.dim_l ?? ""} onChange={(e) => set("dim_l", e.target.value === "" ? null : Number(e.target.value))} />
                <input className={adminInput} type="number" placeholder="세로" value={editing.dim_w ?? ""} onChange={(e) => set("dim_w", e.target.value === "" ? null : Number(e.target.value))} />
                <input className={adminInput} type="number" placeholder="높이" value={editing.dim_h ?? ""} onChange={(e) => set("dim_h", e.target.value === "" ? null : Number(e.target.value))} />
              </div>
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

"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal, btnGhost, btnPrimary } from "@/components/admin/fields";
import { saveMessages } from "@/app/admin/language/actions";

type Tree = Record<string, unknown>;
export type LangPage = {
  name: string;
  ns: string; // dot-path namespace within messages JSON
  en: boolean; // EN complete?
  kr: boolean; // KR complete?
  enData: Tree;
  koData: Tree;
};

// Flatten a nested object into ordered [dotPath, stringValue] leaf pairs.
function flatten(obj: Tree, prefix = ""): [string, string][] {
  const out: [string, string][] = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out.push(...flatten(v as Tree, key));
    } else if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item && typeof item === "object") {
          out.push(...flatten(item as Tree, `${key}.${i}`));
        } else {
          out.push([`${key}.${i}`, String(item ?? "")]);
        }
      });
    } else {
      out.push([key, String(v ?? "")]);
    }
  }
  return out;
}

function humanize(path: string) {
  return path
    .split(".")
    .map((p) =>
      p
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^\w/, (c) => c.toUpperCase()),
    )
    .join(" › ");
}

export function LanguageManager({ pages }: { pages: LangPage[] }) {
  const [editing, setEditing] = useState<LangPage | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-sm">
          <thead className="border-b border-line text-xs text-[#6A7282]">
            <tr>
              <th className="px-5 py-3 font-medium">PAGE</th>
              <th className="px-4 py-3 font-medium">EN STATUS</th>
              <th className="px-4 py-3 font-medium">KR STATUS</th>
              <th className="px-4 py-3 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.name} className="border-b border-line last:border-0">
                <td className="px-5 py-3.5 text-sm font-medium text-[#101828]">{p.name}</td>
                <td className="px-4 py-3.5">
                  <StatusCell ok={p.en} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusCell ok={p.kr} />
                </td>
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => setEditing(p)}
                    className="font-semibold text-brand hover:underline"
                  >
                    Edit Translations
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {editing && (
        <TranslateModal page={editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}

function TranslateModal({ page, onClose }: { page: LangPage; onClose: () => void }) {
  const router = useRouter();
  const enLeaves = flatten(page.enData);
  const koLeaves = flatten(page.koData);
  // Union of keys, preserving EN order then any KR-only keys.
  const koMap = new Map(koLeaves);
  const enMap = new Map(enLeaves);
  const keys = [
    ...enLeaves.map(([k]) => k),
    ...koLeaves.map(([k]) => k).filter((k) => !enMap.has(k)),
  ];

  const [vals, setVals] = useState<Record<string, { en: string; ko: string }>>(
    () =>
      Object.fromEntries(
        keys.map((k) => [k, { en: enMap.get(k) ?? "", ko: koMap.get(k) ?? "" }]),
      ),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const en: Record<string, string> = {};
    const ko: Record<string, string> = {};
    for (const k of keys) {
      en[`${page.ns}.${k}`] = vals[k].en;
      ko[`${page.ns}.${k}`] = vals[k].ko;
    }
    const res = await saveMessages({ en, ko });
    setSaving(false);
    if (res.ok) {
      onClose();
      router.refresh();
    } else {
      setError(res.error ?? "저장에 실패했습니다.");
    }
  }

  return (
    <Modal title={`${page.name} — 번역 수정`} onClose={onClose}>
      <form onSubmit={onSave} className="space-y-4">
        <div className="max-h-[60vh] space-y-5 overflow-y-auto pr-1">
          {keys.map((k) => (
            <div key={k} className="space-y-2">
              <p className="text-xs font-semibold text-[#6A7282]">{humanize(k)}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[0.6875rem] font-medium text-faint">한글 (KR)</span>
                  <textarea
                    className="min-h-[2.625rem] w-full rounded-lg border border-[#D1D5DC] px-3 py-2 text-sm outline-none focus:border-brand"
                    value={vals[k].ko}
                    onChange={(ev) =>
                      setVals((s) => ({ ...s, [k]: { ...s[k], ko: ev.target.value } }))
                    }
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[0.6875rem] font-medium text-faint">English (EN)</span>
                  <textarea
                    className="min-h-[2.625rem] w-full rounded-lg border border-[#D1D5DC] px-3 py-2 text-sm outline-none focus:border-brand"
                    value={vals[k].en}
                    onChange={(ev) =>
                      setVals((s) => ({ ...s, [k]: { ...s[k], en: ev.target.value } }))
                    }
                  />
                </label>
              </div>
            </div>
          ))}
          {keys.length === 0 && (
            <p className="py-6 text-center text-sm text-faint">편집할 텍스트가 없습니다.</p>
          )}
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 border-t border-line pt-4">
          <button type="button" onClick={onClose} className={btnGhost}>
            취소
          </button>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function StatusCell({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00A63E]">
      <Image src="/icons/status-complete.png" alt="" width={20} height={20} className="h-5 w-5" />
      Complete
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#E7000B]">
      <Image src="/icons/status-missing.png" alt="" width={20} height={20} className="h-5 w-5" />
      Missing
    </span>
  );
}

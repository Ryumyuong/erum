"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { adminInput, btnGhost, btnPrimary } from "@/components/admin/fields";
import { TrashIcon } from "@/components/icons";
import { deleteFilterOption, saveFilterOption } from "@/app/admin/content-actions";
import type { L } from "@/lib/content";

export type FilterGroupRow = {
  id: string;
  label: L;
  /** Groups whose options are picture cards in the portfolio filter. */
  hasImage: boolean;
  options: { id: string; label_en: string; label_kr: string; image: string }[];
};

const ctrlBtn =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-white text-sm font-bold text-[#364153] hover:border-brand hover:text-brand disabled:opacity-30";

/**
 * Editor for every portfolio filter group. Option ids are never shown or
 * edited — portfolio rows reference them, so renaming happens on the labels
 * only and a new option always gets a fresh id.
 */
export function FilterOptionManager({ groups }: { groups: FilterGroupRow[] }) {
  const router = useRouter();
  const [openGroup, setOpenGroup] = useState<string | null>(groups[0]?.id ?? null);
  const [rows, setRows] = useState(groups);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const patch = (
    gid: string,
    oid: string,
    changes: Partial<FilterGroupRow["options"][number]>,
  ) =>
    setRows((gs) =>
      gs.map((g) =>
        g.id !== gid
          ? g
          : {
              ...g,
              options: g.options.map((o) =>
                o.id === oid ? { ...o, ...changes } : o,
              ),
            },
      ),
    );

  const move = (gid: string, index: number, dir: -1 | 1) =>
    setRows((gs) =>
      gs.map((g) => {
        if (g.id !== gid) return g;
        const next = index + dir;
        if (next < 0 || next >= g.options.length) return g;
        const opts = [...g.options];
        [opts[index], opts[next]] = [opts[next], opts[index]];
        return { ...g, options: opts };
      }),
    );

  const addOption = (gid: string) =>
    setRows((gs) =>
      gs.map((g) =>
        g.id !== gid
          ? g
          : {
              ...g,
              options: [
                ...g.options,
                { id: crypto.randomUUID(), label_en: "", label_kr: "", image: "" },
              ],
            },
      ),
    );

  async function removeOption(gid: string, oid: string) {
    if (
      !confirm(
        "이 항목을 삭제할까요?\n이 항목으로 지정된 포트폴리오에서는 해당 값이 사라집니다.",
      )
    )
      return;
    setBusy(true);
    setError(null);
    const existed = groups
      .find((g) => g.id === gid)
      ?.options.some((o) => o.id === oid);
    const res = existed
      ? await deleteFilterOption(gid, oid)
      : { ok: true as const };
    if (!res.ok) setError(res.error ?? "삭제 실패");
    else
      setRows((gs) =>
        gs.map((g) =>
          g.id === gid
            ? { ...g, options: g.options.filter((o) => o.id !== oid) }
            : g,
        ),
      );
    setBusy(false);
    router.refresh();
  }

  async function saveGroup(gid: string) {
    const group = rows.find((g) => g.id === gid);
    if (!group) return;
    setBusy(true);
    setError(null);
    for (let i = 0; i < group.options.length; i++) {
      const o = group.options[i];
      const res = await saveFilterOption({
        id: o.id,
        group_id: gid,
        label_en: o.label_en,
        label_kr: o.label_kr,
        image: o.image,
        sort: i + 1,
      });
      if (!res.ok) {
        setError(res.error ?? "저장 실패");
        setBusy(false);
        return;
      }
    }
    setSavedAt(new Date().toLocaleTimeString("ko-KR"));
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-white p-6">
      <h2 className="text-lg max-[500px]:text-[0.9375rem] font-bold text-[#101828]">필터 항목 관리</h2>
      <p className="mt-1 text-sm text-muted">
        포트폴리오 목록의 필터에 표시되는 항목입니다. 그룹을 열어 이름과 순서를
        수정하고 그룹별로 저장하세요.
      </p>

      <div className="mt-5 space-y-3">
        {rows.map((group) => {
          const open = openGroup === group.id;
          return (
            <div key={group.id} className="rounded-lg border border-line">
              <button
                type="button"
                onClick={() => setOpenGroup(open ? null : group.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-bold text-[#101828]">
                  {group.label.ko}
                  <span className="ml-2 font-normal text-muted">
                    {group.options.length}개
                  </span>
                </span>
                <span className="text-muted">{open ? "▲" : "▼"}</span>
              </button>

              {open && (
                <div className="border-t border-line p-4">
                  <div className="space-y-3">
                    {group.options.map((o, i) => (
                      <div
                        key={o.id}
                        className="flex flex-wrap items-start gap-3 rounded-md border border-line p-3"
                      >
                        {group.hasImage && (
                          <div className="w-[200px] shrink-0">
                            <ImageUpload
                              value={o.image}
                              folder="filters"
                              onChange={(url) =>
                                patch(group.id, o.id, { image: url })
                              }
                            />
                          </div>
                        )}
                        <div className="grid min-w-[16rem] flex-1 gap-2 desktop:grid-cols-2">
                          <input
                            className={adminInput}
                            value={o.label_kr}
                            onChange={(e) =>
                              patch(group.id, o.id, { label_kr: e.target.value })
                            }
                            placeholder="한글 이름"
                          />
                          <input
                            className={adminInput}
                            value={o.label_en}
                            onChange={(e) =>
                              patch(group.id, o.id, { label_en: e.target.value })
                            }
                            placeholder="영문 이름"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className={ctrlBtn}
                            onClick={() => move(group.id, i, -1)}
                            disabled={i === 0 || busy}
                            aria-label="위로"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className={ctrlBtn}
                            onClick={() => move(group.id, i, 1)}
                            disabled={i === group.options.length - 1 || busy}
                            aria-label="아래로"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className={ctrlBtn}
                            onClick={() => removeOption(group.id, o.id)}
                            disabled={busy}
                            aria-label="삭제"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() => addOption(group.id)}
                      disabled={busy}
                    >
                      + 항목 추가
                    </button>
                    <button
                      type="button"
                      className={btnPrimary}
                      onClick={() => saveGroup(group.id)}
                      disabled={busy}
                    >
                      {busy ? "저장 중…" : `${group.label.ko} 저장`}
                    </button>
                    {error && (
                      <span className="text-sm text-red-600">{error}</span>
                    )}
                    {!error && savedAt && (
                      <span className="text-sm text-muted">
                        저장됨 · {savedAt}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

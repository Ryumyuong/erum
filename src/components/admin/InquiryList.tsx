"use client";

import { useState } from "react";
import { InquiryStatusSelect } from "@/components/admin/InquiryStatusSelect";
import { HEAR_OPTIONS, PRIORITY_OPTIONS } from "@/lib/quote-options";
import { Pagination } from "@/components/admin/Pagination";
import { Modal } from "@/components/admin/fields";
import { cn } from "@/lib/utils";
import {
  packageTypeGroup,
  boxStructureGroup,
  materialGroup,
  printingGroup,
  finishingGroup,
} from "@/lib/data/quote";
import type { L } from "@/lib/content";

type Taxonomy = { key: string; label: L; items: { id: string; label: L }[] }[];

// Quote-form selections are stored as option ids; map each inquiry field to its
// quote group so we can render the human-readable 국문 label instead of the id.
const QUOTE_GROUP_BY_FIELD: Record<string, { options: { id: string; label: L }[] }> = {
  package_type: packageTypeGroup,
  box_structure: boxStructureGroup,
  material: materialGroup,
  printing: printingGroup,
  finishing: finishingGroup,
};

export type Inquiry = {
  id: string;
  company: string | null;
  type: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  category: string | null;
  hear_about: string[] | null;
  status: string;
  created_at: string;
  source_item_no: string | null;
  product: string | null;
  quantity: string | null;
  package_type: string | null;
  box_structure: string | null;
  material: string | null;
  printing: string | null;
  finishing: string | null;
  size_w: number | null;
  size_d: number | null;
  size_h: number | null;
  budget: string | null;
  lead_time: string | null;
  design_link: string | null;
  message: string | null;
  files: string[] | null;
  /** Redesigned quote form (migration 0033). */
  spec: Record<string, { id: string; label: string; note?: string }> | null;
  design_needed: string | null;
  privacy_agreed: boolean | null;
  promo_agreed: boolean | null;
  priority: string | null;
  contains_product: string | null;
};

/** Question group ids → the label shown in the admin, in form order. */
const SPEC_LABELS: Record<string, string> = {
  packageType: "패키지 종류",
  materialPaper: "종이 재질",
  materialCorrugated: "골판지 재질",
  materialSurface: "표면지(합지)",
  materialInnerColor: "골판지 내부 색상",
  materialRigidOuter: "겉지 재질",
  materialRigidInner: "내지 재질",
  materialOppAdhesive: "접착여부",
  materialPoly: "비닐 재질",
  materialBagPaper: "쇼핑백 재질",
  materialBagHandleManual: "손잡이 재질",
  materialBagHandleAuto: "손잡이 재질",
  materialEtc: "재질(직접입력)",
  accessoryNeeded: "부자재 유무",
  printNeeded: "인쇄 필요 여부",
  printColorsOpp: "인쇄 도수",
  printColorsPoly: "인쇄 도수",
  printColorsDefault: "인쇄 도수",
  printSpot: "별색 인쇄",
  finishHandle: "손잡이 가공",
  finishCoating: "코팅",
  finishSpecialCoating: "특수 코팅",
  finishFoil: "박",
  finishEmboss: "형압",
  finishDiecut: "타공(도무송)",
};
const SPEC_ORDER = Object.keys(SPEC_LABELS);

/**
 * Answers are stored by their English key so the value is stable across
 * locales; the admin is Korean, so translate on the way out. A free-typed
 * "Other: …" keeps its text.
 */
function koLabel(list: { en: string; ko: string }[], value: string | null) {
  if (!value) return null;
  return value
    .split(",")
    .map((raw) => {
      const v = raw.trim();
      const [key, ...rest] = v.split(":");
      const hit = list.find((o) => o.en === key.trim());
      if (!hit) return v;
      return rest.length ? `${hit.ko}: ${rest.join(":").trim()}` : hit.ko;
    })
    .join(", ");
}

const isImage = (url: string) => /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(url);

const STATUS_META: Record<string, { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-[#FFEDD4] text-[#E56700]" },
  reviewing: { label: "Reviewing", cls: "bg-[#FEF9C2] text-[#A65F00]" },
  quoted: { label: "Quoted", cls: "bg-[#DCFCE7] text-[#008236]" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_META[status] ?? STATUS_META.new;
  return (
    <span className={cn("rounded-[62.4375rem] px-2.5 py-0.5 text-[0.75rem] font-medium", s.cls)}>
      {s.label}
    </span>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-faint">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

const PER_PAGE = 10;

export function InquiryList({
  inquiries,
  taxonomy = [],
}: {
  inquiries: Inquiry[];
  taxonomy?: Taxonomy;
}) {
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  // Resolve a stored selection id to its 국문 label: try the static quote group
  // for that field, then the guide taxonomy (uuid ids), else show the raw value.
  function resolveOption(field: string, value?: string | null): string | null {
    if (!value) return null;
    const fromQuote = QUOTE_GROUP_BY_FIELD[field]?.options.find(
      (o) => o.id === value,
    )?.label.ko;
    if (fromQuote) return fromQuote;
    for (const s of taxonomy) {
      const it = s.items.find((i) => i.id === value);
      if (it) return it.label.ko;
    }
    return value;
  }

  if (inquiries.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-10 text-center text-sm text-muted shadow-sm">
        아직 문의가 없습니다.
      </p>
    );
  }

  const pageCount = Math.max(1, Math.ceil(inquiries.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const paged = inquiries.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const open = openId ? inquiries.find((q) => q.id === openId) : undefined;

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-sm">
          <thead className="border-b border-line bg-[#F9FAFB] text-xs text-[#6A7282]">
            <tr>
              <th className="px-6 py-4 font-medium">업체</th>
              <th className="px-6 py-4 font-medium">이메일</th>
              <th className="px-6 py-4 font-medium">상태</th>
              <th className="px-6 py-4 font-medium">날짜</th>
              <th className="px-6 py-4 font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((q) => (
              <tr key={q.id} className="border-b border-line last:border-0">
                <td className="px-6 py-4 font-medium">{q.company}</td>
                <td className="px-6 py-4 text-muted">{q.email}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={q.status} />
                </td>
                <td className="px-6 py-4 text-muted">
                  {(q.created_at ?? "").slice(0, 10)}
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setOpenId(q.id)}
                    className="font-semibold text-brand hover:underline"
                  >
                    상세 보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <Pagination page={current} pageCount={pageCount} onChange={setPage} />

      {open && (
        <Modal title={open.company || "문의 상세"} onClose={() => setOpenId(null)}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-muted">
                  {open.type === "recommended" ? "추천" : "표준"}
                </span>
                <span className="text-xs text-faint">
                  {new Date(open.created_at).toLocaleString("ko-KR")}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                {open.contact_name} · {open.email} · {open.phone}
              </p>
            </div>
            <InquiryStatusSelect id={open.id} value={open.status} />
          </div>

          {/* Legacy columns, kept for inquiries submitted before the form was
              rebuilt. Newer ones carry `spec`, which prints readable labels. */}
          {!open.spec || Object.keys(open.spec).length === 0
            ? (() => {
            const specs = [
              { label: "패키지 종류", value: resolveOption("package_type", open.package_type) },
              { label: "박스 구조", value: resolveOption("box_structure", open.box_structure) },
              { label: "재질", value: resolveOption("material", open.material) },
              { label: "인쇄", value: resolveOption("printing", open.printing) },
              { label: "후가공", value: resolveOption("finishing", open.finishing) },
            ].filter((s) => s.value);
            return (
              <div className="mt-4 border-t border-line pt-4">
                <p className="mb-2 text-xs font-semibold text-faint">견적 선택 사양</p>
                {specs.length > 0 ? (
                  <ul className="divide-y divide-line rounded-xl border border-line">
                    {specs.map((s) => (
                      <li
                        key={s.label}
                        className="flex items-center justify-between px-4 py-2.5 text-sm"
                      >
                        <span className="text-muted">{s.label}</span>
                        <span className="font-medium">{s.value}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted">선택한 사양이 없습니다.</p>
                )}
              </div>
            );
              })()
            : null}

          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-4 text-sm sm:grid-cols-3">
            <Detail label="유입 제품" value={open.source_item_no} />
            <Detail label="도시" value={open.city} />
            <Detail label="국가" value={open.country} />
            <Detail label="카테고리" value={open.category} />
            <Detail label="제품명" value={open.product} />
            <Detail label="수량" value={open.quantity} />
            <Detail
              label="유입 경로"
              value={
                open.hear_about?.length
                  ? koLabel(HEAR_OPTIONS, open.hear_about.join(", "))
                  : null
              }
            />
            <Detail
              label="크기(mm)"
              value={
                [open.size_w, open.size_d, open.size_h]
                  .filter(Boolean)
                  .join(" × ") || null
              }
            />
            <Detail label="담을 제품" value={open.contains_product} />
            <Detail label="중요 요소" value={koLabel(PRIORITY_OPTIONS, open.priority)} />
            <Detail
              label="디자인 작업"
              value={open.design_needed ? (open.design_needed === "yes" ? "필요" : "불필요") : null}
            />
            <Detail
              label="개인정보 동의"
              value={open.privacy_agreed === null ? null : open.privacy_agreed ? "동의" : "미동의"}
            />
            <Detail
              label="홍보 활용 동의"
              value={open.promo_agreed === null || open.promo_agreed === undefined ? null : open.promo_agreed ? "동의" : "비동의"}
            />
            <Detail label="예산" value={open.budget} />
            <Detail label="희망 납기" value={open.lead_time} />
            <Detail label="디자인 링크" value={open.design_link} />
          </dl>

          {/* Option answers from the redesigned form, in the order they are
              asked. Labels are stored alongside the ids, so this stays readable
              even after the admin renames an option. */}
          {open.spec && Object.keys(open.spec).length > 0 && (
            <div className="mt-4 rounded-xl border border-line p-4">
              <p className="mb-2 text-xs text-faint">선택 사양</p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                {SPEC_ORDER.filter((g) => open.spec?.[g]).map((g) => {
                  const a = open.spec![g];
                  return (
                    <div key={g}>
                      <dt className="text-xs text-faint">{SPEC_LABELS[g]}</dt>
                      <dd className="font-medium text-[#101828]">
                        {a.label}
                        {a.note && (
                          <span className="block text-xs font-normal text-muted">
                            {a.note}
                          </span>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          )}

          {open.message && (
            <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm">
              <p className="mb-1 text-xs text-faint">메시지</p>
              <p className="whitespace-pre-wrap">{open.message}</p>
            </div>
          )}

          {open.files && open.files.length > 0 && (
            <div className="mt-4 border-t border-line pt-4">
              <p className="mb-2 text-xs text-faint">첨부파일 ({open.files.length})</p>
              <div className="flex flex-wrap gap-2">
                {open.files.map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-line bg-gray-50 text-center text-[0.625rem] text-muted hover:border-brand"
                  >
                    {isImage(url) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="p-1">파일 보기</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}

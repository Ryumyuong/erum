"use client";

import { useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { OptionCardGroup } from "./OptionCardGroup";
import { PackageTypePicker, type PackageOption } from "./PackageTypePicker";
import {
  MaterialQuestions,
  materialQuestionsFor,
  type MaterialOption,
} from "./MaterialQuestions";
import {
  FinishingSelects,
  YesNoQuestion,
  finishingGroupsFor,
  printColorsGroup,
  showsAccessory,
  showsSpotColour,
} from "./SpecQuestions";
import { ConsentFields } from "./ConsentFields";
import { SizeDiagram } from "./SizeDiagram";
import { Tooltip } from "./Tooltip";
import { FileUpload } from "./FileUpload";
import { SendIcon } from "@/components/icons";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import {
  getSavedReferences,
  getSavedReferencesServer,
  subscribeSavedReferences,
} from "@/lib/saved-references";
import { submitInquiry } from "@/app/quote/actions";
import type { InquiryType } from "@/lib/data/inquiry";
import {
  finishingGroup,
  materialGroup,
  packageTypeGroup,
  printingGroup,
  type QuoteGroup,
} from "@/lib/data/quote";
import type { L } from "@/lib/content";
import {
  CATEGORY_OPTIONS,
  HEAR_OPTIONS,
  PRIORITY_OPTIONS,
} from "@/lib/quote-options";
import { sizeGuideFor, type SizeField } from "@/lib/size-guide";

/** Which form field each measurement writes to. */
const SIZE_KEY: Record<SizeField, "width" | "depth" | "height"> = {
  length: "width",
  width: "depth",
  height: "height",
};

const inputCls =
  "w-full rounded-[0.625rem] border border-[#D1D5DC] px-4 py-2.5 text-[min(3.4vw,14px)] desktop:text-[1rem] text-[#101828] outline-none placeholder:text-[#0A0A0A]/50 focus:border-brand";





type SelKey = "packageType" | "boxStructure" | "material" | "printing" | "finishing";
type Taxonomy = {
  key: string;
  label: L;
  items: { id: string; label: L; image?: string }[];
}[];

export type RefProduct = { itemNo: string; name: L; thumbnail?: string };

export function QuoteForm({
  taxonomy,
  categoryOptions = CATEGORY_OPTIONS,
  hearOptions = HEAR_OPTIONS,
  refProducts = [],
  packageOptions = [],
  tabNotes = {},
  sectionTips = {},
  materialOptions = {},
  specOptions = {},
}: {
  taxonomy: Taxonomy;
  /** Admin-managed lists; the module constants are the fallback. */
  categoryOptions?: L[];
  hearOptions?: L[];
  /** Portfolio lookup so saved item numbers can render as product cards. */
  refProducts?: RefProduct[];
  /** 1-1 패키지 종류 cards, admin-managed (quote_option). */
  packageOptions?: PackageOption[];
  /** (?) note per category tab, admin-managed. */
  tabNotes?: Record<string, L>;
  /** (?) note per section heading, admin-managed. */
  sectionTips?: Record<string, L>;
  /** 1-2 재질 options keyed by question group. */
  materialOptions?: Record<string, MaterialOption[]>;
  /** 부자재 / 인쇄 / 후가공 options keyed by question group. */
  specOptions?: Record<string, MaterialOption[]>;
}) {
  const t = useTranslations("page.quote");
  const tn = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const params = useSearchParams();

  const sourceItem = params.get("item") ?? "";
  // Reference item numbers carried into the inquiry: the one this page was
  // opened from, plus anything bookmarked with "참고 제품으로 저장하기".
  // Dropping one only affects this enquiry — the saved list is left alone.
  const savedRefs = useSyncExternalStore(
    subscribeSavedReferences,
    getSavedReferences,
    getSavedReferencesServer,
  );
  const [droppedRefs, setDroppedRefs] = useState<string[]>([]);
  const refs = [...new Set([sourceItem, ...savedRefs])].filter(
    (x) => x && !droppedRefs.includes(x),
  );
  const dropRef = (itemNo: string) =>
    setDroppedRefs((list) => [...list, itemNo]);

  const [mode, setMode] = useState<InquiryType>(
    // `?type=recommended` comes from the chooser. `?type=easy` and
    // `?mode=recommended` are older deep links and still work.
    ["recommended", "easy"].includes(params.get("type") ?? "") ||
    params.get("mode") === "recommended"
      ? "recommended"
      : "standard",
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errorKey, setErrorKey] = useState<"required" | "generic" | null>(null);

  const [form, setForm] = useState({
    company: "",
    contactName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    category: "",
    product: "",
    quantity: "",
    width: "",
    depth: "",
    height: "",
    designLink: "",
    budget: "",
    leadTime: "",
    message: "",
    requirements: "",
  });
  const [sel, setSel] = useState<Record<SelKey, string>>({
    packageType: "",
    boxStructure: "",
    material: "",
    printing: "",
    finishing: "",
  });
  const [files, setFiles] = useState<string[]>([]);
  // Which filter tab the chosen package type belongs to. Drives which
  // material / printing / finishing questions the rest of the form shows.
  const [packageTab, setPackageTab] = useState("");
  // 재질 answers: one selected option id per question group, plus the free
  // text the 직접 입력 / 기타 choices reveal.
  const [materialValues, setMaterialValues] = useState<Record<string, string>>({});
  const [materialNotes, setMaterialNotes] = useState<Record<string, string>>({});
  const materialQuestions = materialQuestionsFor(packageTab, sel.packageType);
  // 부자재 / 인쇄 / 후가공 answers share one map — every question is a single
  // choice out of a group, with optional free text behind 기타 / 그 외.
  const [specValues, setSpecValues] = useState<Record<string, string>>({});
  const [specNotes, setSpecNotes] = useState<Record<string, string>>({});
  const setSpecValue = (g: string, id: string) =>
    setSpecValues((v) => ({ ...v, [g]: id }));
  const setSpecNote = (g: string, text: string) =>
    setSpecNotes((n) => ({ ...n, [g]: text }));
  const finishingGroups = finishingGroupsFor(packageTab, sel.packageType);
  // Section (?) copy: the admin row wins, the translation file is the fallback.
  const sectionTip = (key: string, fallback: string) =>
    sectionTips[key] ? pick(sectionTips[key], locale) : fallback;
  // 재질 intro: the paper-stock sentence is meaningless for 비닐류, where the
  // only question is 접착여부 (OPP) or the stock list itself.
  const materialIntro =
    packageTab === "비닐류"
      ? sel.packageType === "opp"
        ? t("field.materialIntroOpp")
        : ""
      : t("field.materialIntro").split("|").join("\n");
  // 6. 연락처 — consents. Privacy is required; promo is a free choice.
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [promoAgreed, setPromoAgreed] = useState<"" | "yes" | "no">("");
  // 5. 추가 정보
  const [priority, setPriority] = useState("");
  const [priorityNote, setPriorityNote] = useState("");
  const [containsProduct, setContainsProduct] = useState("");
  const [hearOther, setHearOther] = useState("");
  // 추천 견적문의: 치수 입력은 "알고 있다"를 고른 경우에만 보여준다.
  const [sizeKnown, setSizeKnown] = useState<"" | "yes" | "no">("");

  // Which measurements to ask for, and how to explain them — both depend on the
  // package type. The guidance sits in the section (?) rather than inline.
  const sizeInfo = sizeGuideFor(packageTab, sel.packageType);
  const sizeFigure = sizeInfo.figure ? (
    <SizeDiagram kind={sizeInfo.figure} className="w-full" />
  ) : undefined;
  const sizeTipText = [
    ...sizeInfo.bullets.map((b) => pick(b, locale)),
    ...(sizeInfo.bullets.length && sizeInfo.notes.length ? [""] : []),
    ...sizeInfo.notes.map((n) => pick(n, locale)),
  ]
    .join("\n")
    .trim();
  // "디자인 작업이 필요하신가요?" — required in both modes.
  const [designNeeded, setDesignNeeded] = useState<"" | "yes" | "no">("");
  // "How did you hear about us?" — stored as the English label of each checked option.
  const [hearAbout, setHearAbout] = useState<string[]>([]);
  const toggleHear = (en: string) =>
    setHearAbout((h) =>
      h.includes(en) ? h.filter((v) => v !== en) : [...h, en],
    );

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const selectOpt = (k: SelKey, id: string) =>
    setSel((s) => ({ ...s, [k]: id }));

  // Each group comes from the matching guide section when present, else the
  // static dummy group (so the form works before real guide data is entered).
  // The special "None" / "Recommend for me" options always stay pinned to the
  // end, even once real guide items are added.
  function guideGroup(sectionKey: string, fallback: QuoteGroup): QuoteGroup {
    const sec = taxonomy.find((s) => s.key === sectionKey && s.items.length > 0);
    if (!sec) return fallback;
    const tail = fallback.options.filter((o) => o.recommend || o.id === "none");
    const items = sec.items
      .filter((it) => !tail.some((t) => t.id === it.id))
      .map((it) => ({ id: it.id, label: it.label, image: it.image }));
    return {
      id: fallback.id,
      label: sec.label,
      options: [...items, ...tail],
    };
  }
  const pkgGroup = guideGroup("package-types", packageTypeGroup);
  const matGroup = guideGroup("paper-materials", materialGroup);
  const printGroup = guideGroup("printing", printingGroup);
  const finGroup = guideGroup("finishing", finishingGroup);

  // Both quote modes ask these two, so build them once and drop them into each.
  const designNeededField = (
    <Field label={t("field.designNeeded")} required tip={t("field.designNeededTip")}>
      <div className="flex flex-wrap gap-3">
        {(["yes", "no"] as const).map((v) => (
          <label
            key={v}
            className={cn(
              "flex-1 basis-0 min-w-[7rem] max-w-[10.5rem] cursor-pointer justify-center rounded-[0.625rem] px-5 py-3 text-center text-[min(3.4vw,14px)] desktop:text-[1rem] transition-colors",
              designNeeded === v
                ? "border-2 border-[#FD7304] font-medium text-[#FD7304]"
                : "border border-[#D1D5DC] text-[#6A7282] hover:border-brand/40",
            )}
          >
            <input
              type="radio"
              name="designNeeded"
              className="sr-only"
              checked={designNeeded === v}
              onChange={() => setDesignNeeded(v)}
            />
            {t(`field.${v}`)}
          </label>
        ))}
      </div>
    </Field>
  );

  // Last section in both modes, but the two forms have different lengths.
  // Rendered inside 추가 정보 rather than as its own section, and without
  // checkbox squares — the pill already shows the selected state.
  const hearAboutBlock = (
    <div>
      <span className="mb-2.5 block text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#364153]">
        {t("field.hearAbout")}{" "}
        <span className="font-normal text-[#6A7282]">{t("field.optional")}</span>
      </span>
      <div className="flex flex-wrap gap-2.5">
        {hearOptions.map((opt) => {
          const checked = hearAbout.includes(opt.en);
          return (
            <label
              key={opt.en}
              onClick={() => toggleHear(opt.en)}
              className={cn(
                "flex cursor-pointer items-center rounded-[0.625rem] border px-4 py-2 text-[min(3.15vw,13px)] desktop:text-[0.9375rem] transition-colors",
                checked
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-[#D1D5DC] text-[#364153] hover:border-brand/40",
              )}
            >
              {pick(opt, locale)}
            </label>
          );
        })}
      </div>
      {hearAbout.includes("Other") && (
        <input
          className={cn(inputCls, "mt-2.5")}
          value={hearOther}
          onChange={(e) => setHearOther(e.target.value)}
          placeholder={t("field.priorityOtherPh")}
        />
      )}
    </div>
  );

  /** Option answers as { group: { id, label, note } }, labels resolved. */
  function buildSpec() {
    const all = { ...materialOptions, ...specOptions };
    const answers = { ...materialValues, ...specValues };
    const notes = { ...materialNotes, ...specNotes };
    const out: Record<string, { id: string; label: string; note?: string }> = {};
    for (const [group, id] of Object.entries(answers)) {
      if (!id) continue;
      const opt = (all[group] ?? []).find((o) => o.id === id);
      out[group] = {
        id,
        label: opt ? pick(opt.label, locale) : id,
        ...(notes[group]?.trim() ? { note: notes[group].trim() } : {}),
      };
    }
    if (sel.packageType) {
      const opt = packageOptions.find((o) => o.id === sel.packageType);
      out.packageType = {
        id: sel.packageType,
        label: opt ? pick(opt.label, locale) : sel.packageType,
      };
    }
    return out;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const baseOk =
      [form.company, form.contactName, form.email, form.phone].every((v) =>
        v.trim(),
      ) && designNeeded !== "" && privacyAgreed && promoAgreed !== "";
    // Standard mode also stars 수량 and 패키지 종류 — they were shown as
    // required but never checked, so an empty form could be submitted.
    const modeOk =
      mode === "recommended"
        ? form.quantity.trim() && form.requirements.trim()
        : form.quantity.trim() && sel.packageType;
    if (!baseOk || !modeOk) {
      setErrorKey("required");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorKey(null);
    const res = await submitInquiry({
      type: mode,
      company: form.company,
      contactName: form.contactName,
      email: form.email,
      phone: form.phone,
      city: form.city || undefined,
      country: form.country || undefined,
      category: form.category || undefined,
      hearAbout: hearAbout.length
        ? hearAbout.map((h) =>
            h === "Other" && hearOther.trim() ? `Other: ${hearOther.trim()}` : h,
          )
        : undefined,
      designNeeded: designNeeded || undefined,
      privacyAgreed,
      promoAgreed: promoAgreed ? promoAgreed === "yes" : undefined,
      priority: priority
        ? priority === "Other" && priorityNote.trim()
          ? `Other: ${priorityNote.trim()}`
          : priority
        : undefined,
      containsProduct: containsProduct || undefined,
      // Flatten option answers to labels so an inquiry reads plainly in admin.
      spec: buildSpec(),
      product: form.product,
      quantity: form.quantity,
      sourceItemNo: refs.length ? refs.join(", ") : undefined,
      packageType: sel.packageType || undefined,
      boxStructure: sel.boxStructure || undefined,
      material: sel.material || undefined,
      printing: sel.printing || undefined,
      finishing: sel.finishing || undefined,
      size:
        mode === "standard" || sizeKnown === "yes"
          ? { w: form.width, d: form.depth, h: form.height }
          : undefined,
      designLink: form.designLink || undefined,
      budget: form.budget || undefined,
      leadTime: form.leadTime || undefined,
      message: (mode === "recommended" ? form.requirements : form.message) || undefined,
      files,
      locale,
    });

    if (res.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorKey(res.error);
    }
  }

  if (status === "success") {
    return (
      <div className="container-admin pb-44">
        <div className="rounded-[var(--radius-card)] border border-line bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-[min(4.85vw,20px)] desktop:text-2xl font-bold">{t("successTitle")}</h2>
          <p className="mt-3 text-[min(2.91vw,12px)] desktop:text-sm leading-relaxed text-muted">{t("successBody")}</p>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setForm({
                company: "", contactName: "", email: "", phone: "",
                city: "", country: "", category: "", product: "",
                quantity: "", width: "", depth: "", height: "", designLink: "",
                budget: "", leadTime: "", message: "", requirements: "",
              });
              setSel({ packageType: "", boxStructure: "", material: "", printing: "", finishing: "" });
              setFiles([]);
              setHearAbout([]);
            }}
            className="mt-6 rounded-full border border-line px-5 py-2.5 text-[min(2.91vw,12px)] desktop:text-sm font-medium hover:border-brand hover:text-brand"
          >
            {t("successAnother")}
          </button>
        </div>
      </div>
    );
  }

  // Sections are conditional (부자재 and 후가공 disappear for some package
  // types), so number them as they render rather than hard-coding.
  let sectionNo = 0;

  return (
    <form onSubmit={onSubmit} className="container-admin pb-44">
      {/* Header + mode toggle */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h1 className="text-[min(4.85vw,20px)] desktop:text-2xl font-bold desktop:mr-6">
          {mode === "standard" ? t("standardTitle") : t("recommendedTitle")}
        </h1>
        <button
          type="button"
          onClick={() =>
            setMode((m) => (m === "standard" ? "recommended" : "standard"))
          }
          className="inline-flex items-center gap-2 rounded-[0.625rem] border border-[#FD7304] bg-white px-4 py-2 text-[min(2.91vw,12px)] desktop:text-sm font-semibold text-[#FD7304] hover:bg-brand-soft"
        >
          <Image src="/icons/quote-switch.png" alt="" width={33} height={27} className="h-4 w-auto" />
          {mode === "standard" ? t("toRecommended") : t("toStandard")}
        </button>
      </div>

      <p className="mb-6 rounded-[0.625rem] border border-[#E4E4E4] bg-[#EEEEEE]/[0.38] px-4 py-3 text-[min(3.4vw,14px)] desktop:text-[1rem] text-black/70">
        💡 {mode === "standard" ? t("recommendedIntro") : t("easyIntro")}
      </p>

      {/* Reference products — from ?item= and from saved bookmarks. Removable,
          since the saved list can outlive the enquiry the visitor is writing. */}
      {refs.length > 0 && (
        <div className="mb-6 rounded-[0.625rem] border border-brand bg-white px-4 py-3">
          <p className="text-[min(2.91vw,12px)] desktop:text-sm font-medium text-muted">
            {t("sourceProduct")}
            {refs.length > 1 && (
              <span className="ml-1 font-normal">({refs.length})</span>
            )}
          </p>
          {/* Cards, not bare item numbers — a code like BD-FO-002 means nothing
              to the customer, so show the photo and name they picked. */}
          <ul className="mt-3 grid gap-3 desktop:grid-cols-2">
            {refs.map((itemNo) => {
              const p = refProducts.find((x) => x.itemNo === itemNo);
              return (
                <li
                  key={itemNo}
                  className="flex items-center gap-3 rounded-[0.625rem] border border-[#E5E7EB] bg-white p-2"
                >
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[0.5rem] bg-[#F3F4F6]">
                    {p?.thumbnail && (
                      <Image
                        src={p.thumbnail}
                        alt=""
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[min(3.4vw,14px)] desktop:text-[1rem] font-bold text-[#101828]">
                      {p ? pick(p.name, locale) : itemNo}
                    </p>
                    <p className="mt-0.5 text-[min(2.91vw,12px)] desktop:text-sm text-[#6A7282]">
                      {itemNo}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dropRef(itemNo)}
                    aria-label={`${itemNo} ${locale === "ko" ? "제외" : "remove"}`}
                    className="shrink-0 rounded-full p-2 text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#101828]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="space-y-5">
        {/* 1. 연락처 정보 — leads both forms, matching the reference layout. */}
        <Section num={++sectionNo} title={t("section.contact")}>
          <div className="grid gap-4 desktop:grid-cols-2">
            <Field label={t("field.companyBrand")} required>
              <input className={inputCls} value={form.company} onChange={set("company")} />
            </Field>
            <Field label={t("field.contactName")} required>
              <input className={inputCls} value={form.contactName} onChange={set("contactName")} />
            </Field>
            <Field label={t("field.email")} required>
              <input type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="example@email.com" />
            </Field>
            <Field label={t("field.phone")} required>
              <input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="+1-XXX-XXX-XXXX" />
            </Field>
            {/* 도시 · 국가 merged into one field. */}
            <Field label={t("field.cityCountry")}>
              <input className={inputCls} value={form.city} onChange={set("city")} />
            </Field>
          </div>
          <ConsentFields
            privacy={privacyAgreed}
            onPrivacy={setPrivacyAgreed}
            promo={promoAgreed}
            onPromo={setPromoAgreed}
          />
        </Section>

        {mode === "standard" ? (
          <>
            {/* 2. Product */}
            <Section num={++sectionNo} title={pick(pkgGroup.label, locale)} tip={sectionTip("packageType", t("tip.packageType"))}>
              <div>
                {/* Admin-managed list with filter tabs; falls back to the old
                    card group until the packageType options are seeded. */}
                {packageOptions.length > 0 ? (
                  <PackageTypePicker
                    options={packageOptions}
                    value={sel.packageType}
                    onChange={(id, tab) => {
                      selectOpt("packageType", id);
                      setPackageTab(tab);
                    }}
                    allLabel={tc("all")}
                    tabNotes={tabNotes}
                    changeLabel={t("field.changeSelection")}
                  />
                ) : (
                  <OptionCardGroup group={pkgGroup} value={sel.packageType} onChange={(id) => selectOpt("packageType", id)} columns={4} />
                )}
              </div>
            </Section>

            {/* 4. Quantity & size */}
            <Section
              num={++sectionNo}
              title={t("section.material")}
              tip={sectionTip("material", t("tip.material"))}
            >
              {/* Which questions appear depends on the 패키지 종류 tab; before a
                  package is chosen there is nothing to ask yet. */}
              {materialQuestions.length > 0 ? (
                <>
                  {materialIntro && (
                    <p className="mb-4 whitespace-pre-line text-[min(4.37vw,18px)] desktop:text-[1.125rem] leading-relaxed text-black">
                      {materialIntro}
                    </p>
                  )}
                  <MaterialQuestions
                    questions={materialQuestions}
                    options={materialOptions}
                    values={materialValues}
                    notes={materialNotes}
                    onSelect={(g, id) =>
                      setMaterialValues((v) => ({ ...v, [g]: id }))
                    }
                    onNote={(g, text) =>
                      setMaterialNotes((n) => ({ ...n, [g]: text }))
                    }
                    customPlaceholder={t("field.materialCustomPh")}
                    etcPlaceholder={t("field.materialEtcPh")}
                  />
                </>
              ) : packageOptions.length > 0 ? (
                <p className="text-[min(3.15vw,13px)] desktop:text-[0.9375rem] text-[#6A7282]">
                  {t("field.materialNeedsPackage")}
                </p>
              ) : (
                <OptionCardGroup group={matGroup} value={sel.material} onChange={(id) => selectOpt("material", id)} columns={3} />
              )}
            </Section>

            {/* 5. 패키지 사이즈 — fields and guidance both follow the package
                type; the guidance lives in the (?) so the section stays short. */}
            <Section
              num={++sectionNo}
              title={t("section.size")}
              tip={sizeTipText}
              tipFigure={sizeFigure}
            >
              <div
                className={cn(
                  "grid gap-3",
                  sizeInfo.fields.length === 2 ? "grid-cols-2" : "grid-cols-3",
                )}
              >
                {sizeInfo.fields.map((f) => (
                  <label key={f.key} className="block">
                    <span className="mb-1.5 block text-[min(2.43vw,10px)] desktop:text-xs font-medium text-[#6A7282]">
                      {pick(f.label, locale)}
                      {!sizeInfo.optional && <span className="text-[#ff0000]"> *</span>}
                    </span>
                    <input
                      className={inputCls}
                      value={form[SIZE_KEY[f.key]]}
                      onChange={set(SIZE_KEY[f.key])}
                      placeholder={f.key === "height" ? "50" : "150"}
                    />
                  </label>
                ))}
              </div>
            </Section>

            {/* 부자재 — its own card, box categories only */}
            {(showsAccessory(packageTab) || !packageTab) && specOptions.accessoryNeeded && (
              <Section num={++sectionNo} title={t("section.accessory")}>
                {!packageTab ? (
                  <p className="text-[min(3.15vw,13px)] desktop:text-[0.9375rem] text-[#6A7282]">
                    {t("field.materialNeedsPackage")}
                  </p>
                ) : (
                <YesNoQuestion
                  label={t("field.accessoryQ")}
                  options={specOptions.accessoryNeeded}
                  value={specValues.accessoryNeeded ?? ""}
                  onChange={(id) => setSpecValue("accessoryNeeded", id)}
                  note={specNotes.accessoryNeeded}
                  onNote={(text) => setSpecNote("accessoryNeeded", text)}
                  noteLabel={t("field.accessoryNoteLabel")}
                  notePlaceholder={t("field.accessoryPh")}
                />
                )}
              </Section>
            )}

            {/* 6. Printing */}
            <Section num={++sectionNo} title={t("section.printing")} tip={sectionTip("printing", t("tip.printing"))}>
              {specOptions.printNeeded ? (
                <div className="space-y-6">
                  <YesNoQuestion
                    label={t("field.printNeededQ")}
                    options={specOptions.printNeeded}
                    value={specValues.printNeeded ?? ""}
                    onChange={(id) => setSpecValue("printNeeded", id)}
                  />
                  {/* "아니요" hides the follow-up questions entirely. */}
                  {specValues.printNeeded === "yes" && (
                    <>
                      <div>
                        <span className="mb-2.5 flex items-center gap-1 text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#364153]">
                          {t("field.printColors")}
                          <Tooltip text={t("field.printColorsTip")} />
                        </span>
                        <MaterialQuestions
                          questions={[
                            {
                              group: printColorsGroup(packageTab, sel.packageType),
                              label: { ko: "", en: "" },
                            },
                          ]}
                          options={specOptions}
                          values={specValues}
                          notes={specNotes}
                          onSelect={setSpecValue}
                          onNote={setSpecNote}
                          customPlaceholder={t("field.printColorsPh")}
                          etcPlaceholder={t("field.printColorsPh")}
                        />
                      </div>
                      {showsSpotColour(packageTab) && specOptions.printSpot && (
                        <div>
                          <span className="mb-1 flex items-center gap-1 text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#364153]">
                            {t("field.printSpot")}
                            <Tooltip text={t("field.printSpotTip")} />
                          </span>
                          <p className="mb-2.5 text-[min(2.67vw,11px)] desktop:text-xs text-[#6A7282]">
                            {t("field.printSpotNote")}
                          </p>
                          <MaterialQuestions
                            questions={[{ group: "printSpot", label: { ko: "", en: "" } }]}
                            options={specOptions}
                            values={specValues}
                            notes={specNotes}
                            onSelect={setSpecValue}
                            onNote={setSpecNote}
                            customPlaceholder=""
                            etcPlaceholder=""
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {printGroup.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => selectOpt("printing", opt.id)}
                      className={cn(
                        "rounded-lg border px-4 py-3 text-[min(2.91vw,12px)] desktop:text-sm font-medium transition-colors",
                        sel.printing === opt.id
                          ? "border-brand text-brand"
                          : "border-line text-[#000] hover:border-brand/40",
                      )}
                    >
                      {pick(opt.label, locale)}
                    </button>
                  ))}
                </div>
              )}
            </Section>

            {/* 7. Finishing */}
            {/* 후가공 disappears entirely for OPP and machine-made bags. */}
            {(finishingGroups.length > 0 || !packageTab) && (
              <Section num={++sectionNo} title={t("section.finishing")} tip={sectionTip("finishing", t("field.finishTip"))}>
                {/* Subtitle under the heading, the way 재질 정보 reads. */}
                <p className="mb-4 text-[min(4.37vw,18px)] desktop:text-[1.125rem] leading-relaxed text-black">
                  {t("field.finishNote")}
                </p>
                {finishingGroups.length > 0 ? (
                  <>
                    <FinishingSelects
                      groups={finishingGroups}
                      options={specOptions}
                      values={specValues}
                      onChange={setSpecValue}
                    />
                  </>
                ) : packageOptions.length > 0 ? (
                  <p className="text-[min(3.15vw,13px)] desktop:text-[0.9375rem] text-[#6A7282]">
                    {t("field.materialNeedsPackage")}
                  </p>
                ) : (
                  <OptionCardGroup group={finGroup} value={sel.finishing} onChange={(id) => selectOpt("finishing", id)} columns={4} />
                )}
              </Section>
            )}

            {/* 6. 프로젝트 세부 정보 */}
            <Section num={++sectionNo} title={t("section.details")}>
              <div className="space-y-5">
                <div>
                  <span className="mb-1 block text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#364153]">
                    {t("field.extraRequest")}
                  </span>
                  <p className="mb-2 whitespace-pre-line text-[min(2.67vw,11px)] desktop:text-xs leading-relaxed text-[#6A7282]">
                    {t("field.extraRequestDesc").split("|").join("\n")}
                  </p>
                  <textarea className={cn(inputCls, "min-h-28")} value={form.message} onChange={set("message")} />
                </div>

                <div>
                  <span className="mb-2 block text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#364153]">
                    {t("field.designLink")}
                  </span>
                  <input className={inputCls} value={form.designLink} onChange={set("designLink")} placeholder={t("field.designLinkPh")} />
                  <div className="mt-3">
                    <FileUpload value={files} onChange={setFiles} hint1={t("field.fileUpload")} hint2={t("field.fileHint")} />
                    <p className="mt-2 text-[min(2.43vw,10px)] desktop:text-xs text-[#6A7282]">{t("field.fileNote")}</p>
                  </div>
                </div>

                {designNeededField}

                <Field label={t("field.quantity")} required tip={t("field.quantityTip")}>
                  <input className={inputCls} value={form.quantity} onChange={set("quantity")} placeholder={t("field.quantityPh")} />
                </Field>
              </div>
            </Section>

            {/* 7. 추가 정보 */}
            <Section num={++sectionNo} title={t("section.extra")}>
              <div className="space-y-5">
                <Field label={t("field.containsProduct")}>
                  <input className={inputCls} value={containsProduct} onChange={(e) => setContainsProduct(e.target.value)} placeholder={t("field.containsProductPh")} />
                </Field>

                <div className="grid gap-4 desktop:grid-cols-2">
                  <Field label={t("field.budget")} tip={t("field.budgetTip")}>
                    <input className={inputCls} value={form.budget} onChange={set("budget")} placeholder={t("field.budgetPh")} />
                  </Field>
                  <Field label={t("field.leadTime")} tip={t("field.leadTimeTip")}>
                    <input className={inputCls} value={form.leadTime} onChange={set("leadTime")} placeholder={t("field.leadTimePh")} />
                  </Field>
                </div>

                <div>
                  <span className="mb-1 block text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#364153]">
                    {t("field.priority")}{" "}
                    <span className="font-normal text-[#6A7282]">{t("field.optional")}</span>
                  </span>
                  <p className="mb-2.5 text-[min(2.67vw,11px)] desktop:text-xs text-[#6A7282]">
                    {t("field.priorityDesc")}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {PRIORITY_OPTIONS.map((o) => (
                      <button
                        key={o.en}
                        type="button"
                        onClick={() => setPriority(o.en)}
                        aria-pressed={priority === o.en}
                        className={cn(
                          "rounded-[0.625rem] border px-4 py-2 text-[min(3.15vw,13px)] desktop:text-[0.9375rem] transition-colors",
                          priority === o.en
                            ? "border-brand bg-brand-soft font-medium text-brand"
                            : "border-[#D1D5DC] text-[#364153] hover:border-brand/50",
                        )}
                      >
                        {pick(o, locale)}
                      </button>
                    ))}
                  </div>
                  {priority === "Other" && (
                    <input
                      className={cn(inputCls, "mt-2.5")}
                      value={priorityNote}
                      onChange={(e) => setPriorityNote(e.target.value)}
                      placeholder={t("field.priorityOtherPh")}
                    />
                  )}
                </div>

                {hearAboutBlock}
              </div>
            </Section>
          </>
        ) : (
          <>
            {/* 1. 패키지 종류 — the spec asks for the same picker at the very
                top of the easy quote. */}
            {packageOptions.length > 0 && (
              <Section num={++sectionNo} title={pick(pkgGroup.label, locale)}>
                <PackageTypePicker
                  options={packageOptions}
                  value={sel.packageType}
                  onChange={(id, tab) => {
                    selectOpt("packageType", id);
                    setPackageTab(tab);
                  }}
                  allLabel={tc("all")}
                  tabNotes={tabNotes}
                  changeLabel={t("field.changeSelection")}
                />
              </Section>
            )}

            {/* Recommended: product */}
            <Section num={++sectionNo} title={t("section.product")}>
              <div className="space-y-4">
                <div className="grid gap-4 desktop:grid-cols-2">
                  <Field label={t("field.category")}>
                    <select
                      className={cn(inputCls, "appearance-none bg-white")}
                      value={form.category}
                      onChange={set("category")}
                    >
                      <option value="">{t("field.categorySelect")}</option>
                      {categoryOptions.map((opt) => (
                        <option key={opt.en} value={pick(opt, locale)}>
                          {pick(opt, locale)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={t("field.productName")}>
                    <input className={inputCls} value={form.product} onChange={set("product")} placeholder={t("field.productNamePh")} />
                  </Field>
                </div>
              </div>
            </Section>

            {/* Recommended: project details. Order follows the spec —
                요구사항 → 디자인 → 사이즈 → 수량 → 예산 → 참고 파일. */}
            <Section num={++sectionNo} title={t("section.details")}>
              <div className="space-y-4">
                <Field
                  label={t("field.requirements")}
                  required
                  tip={t("field.requirementsTip")}
                >
                  <textarea className={cn(inputCls, "min-h-36")} value={form.requirements} onChange={set("requirements")} placeholder={t("field.requirementsPh")} />
                </Field>

                {designNeededField}

                <div>
                  <span className="mb-2.5 flex items-center gap-1 text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#364153]">
                    {t("field.sizeKnownQ")}
                    <Tooltip
                      text={sizeTipText}
                      figure={sizeFigure}
                    />
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {(["yes", "no"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setSizeKnown(v)}
                        aria-pressed={sizeKnown === v}
                        className={cn(
                          "flex-1 basis-0 min-w-[7rem] max-w-[10.5rem] rounded-[0.625rem] px-5 py-3 text-center text-[min(3.4vw,14px)] desktop:text-[1rem] transition-colors",
                          sizeKnown === v
                            ? "border-2 border-[#FD7304] font-medium text-[#FD7304]"
                            : "border border-[#D1D5DC] text-[#6A7282] hover:border-brand/40",
                        )}
                      >
                        {t("field." + v)}
                      </button>
                    ))}
                  </div>
                  {sizeKnown === "yes" && (
                    <div
                      className={cn(
                        "mt-4 grid gap-3",
                        sizeInfo.fields.length === 2 ? "grid-cols-2" : "grid-cols-3",
                      )}
                    >
                      {sizeInfo.fields.map((f) => (
                        <label key={f.key} className="block">
                          <span className="mb-1.5 block text-[min(2.43vw,10px)] desktop:text-xs font-medium text-[#6A7282]">
                            {pick(f.label, locale)}
                            <span className="text-[#ff0000]"> *</span>
                          </span>
                          <input
                            className={inputCls}
                            value={form[SIZE_KEY[f.key]]}
                            onChange={set(SIZE_KEY[f.key])}
                            placeholder={f.key === "height" ? "50" : "150"}
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <Field label={t("field.quantity")} required tip={t("field.quantityTip")}>
                  <input className={inputCls} value={form.quantity} onChange={set("quantity")} placeholder={t("field.quantityPh")} />
                </Field>
                <Field label={t("field.budget")} tip={t("field.budgetTip")}>
                  <input className={inputCls} value={form.budget} onChange={set("budget")} placeholder={t("field.budgetPh")} />
                </Field>

                <Field label={t("field.designLink")}>
                  <input className={inputCls} value={form.designLink} onChange={set("designLink")} placeholder={t("field.designLinkPh")} />
                </Field>
                <div>
                  <FileUpload value={files} onChange={setFiles} hint1={t("field.fileUpload")} hint2={t("field.fileHint")} />
                  <p className="mt-2 text-[min(2.43vw,10px)] desktop:text-xs text-[#6A7282]">{t("field.fileNote")}</p>
                </div>
              </div>
            </Section>

            {/* 4. 추가 정보 — easy quote keeps 중요 요소 + 유입경로 */}
            <Section num={++sectionNo} title={t("section.extra")}>
              <div className="space-y-5">
                <div>
                  <span className="mb-1 block text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#364153]">
                    {t("field.priority")}{" "}
                    <span className="font-normal text-[#6A7282]">{t("field.optional")}</span>
                  </span>
                  <p className="mb-2.5 text-[min(2.67vw,11px)] desktop:text-xs text-[#6A7282]">
                    {t("field.priorityDesc")}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {PRIORITY_OPTIONS.map((o) => (
                      <button
                        key={o.en}
                        type="button"
                        onClick={() => setPriority(o.en)}
                        aria-pressed={priority === o.en}
                        className={cn(
                          "rounded-[0.625rem] border px-4 py-2 text-[min(3.15vw,13px)] desktop:text-[0.9375rem] transition-colors",
                          priority === o.en
                            ? "border-brand bg-brand-soft font-medium text-brand"
                            : "border-[#D1D5DC] text-[#364153] hover:border-brand/50",
                        )}
                      >
                        {pick(o, locale)}
                      </button>
                    ))}
                  </div>
                  {priority === "Other" && (
                    <input
                      className={cn(inputCls, "mt-2.5")}
                      value={priorityNote}
                      onChange={(e) => setPriorityNote(e.target.value)}
                      placeholder={t("field.priorityOtherPh")}
                    />
                  )}
                </div>
                {hearAboutBlock}
              </div>
            </Section>

          </>
        )}

        {/* Next steps */}
        <div className="rounded-[0.875rem] border border-[#CDCDCD] bg-white p-8">
          <h3 className="mb-3 text-[min(3.64vw,15px)] desktop:text-[1.125rem] font-bold text-[#101828]">{t("section.nextSteps")}</h3>
          <ul className="space-y-2 text-[min(2.91vw,12px)] desktop:text-sm text-[#364153]">
            {["one", "two", "three"].map((k) => (
              <li key={k} className="flex items-center gap-2">
                <Image src="/icons/check-orange.png" alt="" width={10} height={10} className="h-2.5 w-2.5 shrink-0" />
                {t(`nextStep.${k}`)}
              </li>
            ))}
          </ul>
        </div>

      {/* Errors + submit */}
      {status === "error" && (
        <p className="mt-5 text-[min(2.91vw,12px)] desktop:text-sm font-medium text-red-600">
          {errorKey === "required" ? t("errorRequired") : t("errorGeneric")}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-2 rounded-[0.625rem] bg-brand px-5 py-3 text-[min(3.4vw,14px)] desktop:text-[1rem] font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          <SendIcon className="h-4 w-4" />
          {status === "submitting" ? t("submitting") : t("submit")}
        </button>
      </div>
      </div>

      <p className="sr-only">{tn("quote")}</p>
    </form>
  );
}

function Section({
  num,
  title,
  tip,
  tipFigure,
  children,
}: {
  num?: number;
  title: string;
  tip?: string;
  tipFigure?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-white p-4 shadow desktop:p-8">
      <h2 className="mb-3 flex items-center gap-1.5 text-[min(4.85vw,20px)] desktop:mb-5 desktop:text-[1.5rem] font-bold text-[#101828]">
        {num != null ? `${num}. ` : ""}
        {title}
        {tip && <Tooltip text={tip} figure={tipFigure} />}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  tip,
  children,
}: {
  label: string;
  required?: boolean;
  tip?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-[min(2.91vw,12px)] desktop:text-sm font-medium text-[#364153]">
        {label}
        {required && <span className="text-[#ff0000]">*</span>}
        {tip && <Tooltip text={tip} />}
      </span>
      {children}
    </label>
  );
}


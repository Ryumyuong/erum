"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { OptionCardGroup } from "./OptionCardGroup";
import { pick } from "@/lib/content";
import { cn } from "@/lib/utils";
import { submitInquiry } from "@/app/quote/actions";
import type { InquiryType } from "@/lib/data/inquiry";
import {
  boxStructureGroup,
  finishingGroup,
  materialGroup,
  packageTypeGroup,
  printingGroup,
} from "@/lib/data/quote";

const inputCls =
  "w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-brand";

type SelKey = "packageType" | "boxStructure" | "material" | "printing" | "finishing";

export function QuoteForm() {
  const t = useTranslations("page.quote");
  const tn = useTranslations("nav");
  const locale = useLocale();
  const params = useSearchParams();

  const sourceItem = params.get("item") ?? "";
  const [mode, setMode] = useState<InquiryType>(
    params.get("mode") === "recommended" ? "recommended" : "standard",
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

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const selectOpt = (k: SelKey, id: string) =>
    setSel((s) => ({ ...s, [k]: id }));

  const recommendAll = () =>
    setSel({
      packageType: "recommend",
      boxStructure: "recommend",
      material: "recommend",
      printing: "recommend",
      finishing: "recommend",
    });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const baseOk = [form.company, form.contactName, form.email, form.phone].every(
      (v) => v.trim(),
    );
    const modeOk =
      mode === "recommended"
        ? form.product.trim() && form.quantity.trim() && form.requirements.trim()
        : true;
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
      product: form.product,
      quantity: form.quantity,
      sourceItemNo: sourceItem || undefined,
      packageType: sel.packageType || undefined,
      boxStructure: sel.boxStructure || undefined,
      material: sel.material || undefined,
      printing: sel.printing || undefined,
      finishing: sel.finishing || undefined,
      size:
        mode === "standard"
          ? { w: form.width, d: form.depth, h: form.height }
          : undefined,
      designLink: form.designLink || undefined,
      budget: form.budget || undefined,
      leadTime: form.leadTime || undefined,
      message: mode === "recommended" ? form.requirements : form.message,
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
      <div className="container-page max-w-2xl py-20">
        <div className="rounded-[var(--radius-card)] border border-line bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">{t("successTitle")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t("successBody")}</p>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setForm({
                company: "", contactName: "", email: "", phone: "", product: "",
                quantity: "", width: "", depth: "", height: "", designLink: "",
                budget: "", leadTime: "", message: "", requirements: "",
              });
              setSel({ packageType: "", boxStructure: "", material: "", printing: "", finishing: "" });
            }}
            className="mt-6 rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
          >
            {t("successAnother")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="container-page max-w-3xl pb-20">
      {/* Header + mode toggle */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold md:text-3xl">
          {mode === "standard" ? t("standardTitle") : t("recommendedTitle")}
        </h1>
        <button
          type="button"
          onClick={() =>
            setMode((m) => (m === "standard" ? "recommended" : "standard"))
          }
          className="inline-flex items-center gap-2 rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-soft"
        >
          {mode === "standard" ? t("toRecommended") : t("toStandard")}
        </button>
      </div>

      {mode === "recommended" && (
        <p className="mb-6 rounded-lg bg-brand-soft px-4 py-3 text-sm text-ink">
          💡 {t("recommendedIntro")}
        </p>
      )}

      {/* Source product from portfolio */}
      {sourceItem && (
        <p className="mb-6 inline-flex items-center gap-2 rounded-lg border border-brand bg-white px-4 py-2 text-sm">
          <span className="font-medium text-muted">{t("sourceProduct")}:</span>
          <span className="font-bold text-brand">{sourceItem}</span>
        </p>
      )}

      <div className="space-y-5">
        {/* 1. Contact */}
        <Section title={t("section.contact")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("field.company")} required>
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
          </div>
        </Section>

        {mode === "standard" ? (
          <>
            {/* 2. Product */}
            <Section title={t("section.product")}>
              <Field label={t("field.productName")}>
                <input className={inputCls} value={form.product} onChange={set("product")} placeholder={t("field.productNamePh")} />
              </Field>
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium">{pick(packageTypeGroup.label, locale)}</span>
                  <button type="button" onClick={recommendAll} className="text-xs font-semibold text-brand hover:text-brand-dark">
                    ★ {t("recommendAll")}
                  </button>
                </div>
                <OptionCardGroup group={packageTypeGroup} value={sel.packageType} onChange={(id) => selectOpt("packageType", id)} />
              </div>
            </Section>

            {/* 3. Box structure */}
            <Section title={t("section.structure")}>
              <OptionCardGroup group={boxStructureGroup} value={sel.boxStructure} onChange={(id) => selectOpt("boxStructure", id)} />
            </Section>

            {/* 4. Quantity & size */}
            <Section title={t("section.quantitySize")}>
              <Field label={t("field.quantity")}>
                <input className={inputCls} value={form.quantity} onChange={set("quantity")} placeholder={t("field.quantityPh")} />
              </Field>
              <div className="mt-4">
                <span className="mb-1.5 block text-sm font-medium">{t("field.innerSize")}</span>
                <div className="grid grid-cols-3 gap-3">
                  <input className={inputCls} value={form.width} onChange={set("width")} placeholder={t("field.width")} />
                  <input className={inputCls} value={form.depth} onChange={set("depth")} placeholder={t("field.depth")} />
                  <input className={inputCls} value={form.height} onChange={set("height")} placeholder={t("field.height")} />
                </div>
              </div>
            </Section>

            {/* 5. Material */}
            <Section title={t("section.material")}>
              <OptionCardGroup group={materialGroup} value={sel.material} onChange={(id) => selectOpt("material", id)} />
            </Section>

            {/* 6. Printing */}
            <Section title={t("section.printing")}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {printingGroup.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => selectOpt("printing", opt.id)}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                      sel.printing === opt.id
                        ? "border-brand bg-brand-soft text-brand"
                        : "border-line text-muted hover:border-brand/40",
                    )}
                  >
                    {pick(opt.label, locale)}
                  </button>
                ))}
              </div>
            </Section>

            {/* 7. Finishing */}
            <Section title={t("section.finishing")}>
              <OptionCardGroup group={finishingGroup} value={sel.finishing} onChange={(id) => selectOpt("finishing", id)} />
            </Section>

            {/* 8. Additional */}
            <Section title={t("section.additional")}>
              <div className="space-y-4">
                <Field label={t("field.designLink")}>
                  <input className={inputCls} value={form.designLink} onChange={set("designLink")} placeholder={t("field.designLinkPh")} />
                </Field>
                <FileDrop hint1={t("field.fileUpload")} hint2={t("field.fileHint")} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t("field.budget")}>
                    <input className={inputCls} value={form.budget} onChange={set("budget")} placeholder={t("field.budgetPh")} />
                  </Field>
                  <Field label={t("field.leadTime")}>
                    <input className={inputCls} value={form.leadTime} onChange={set("leadTime")} placeholder={t("field.leadTimePh")} />
                  </Field>
                </div>
                <Field label={t("field.message")}>
                  <textarea className={cn(inputCls, "min-h-28")} value={form.message} onChange={set("message")} placeholder={t("field.messagePh")} />
                </Field>
              </div>
            </Section>
          </>
        ) : (
          <>
            {/* Recommended: product */}
            <Section title={t("section.product")}>
              <div className="space-y-4">
                <Field label={t("field.category")} required>
                  <input className={inputCls} value={form.product} onChange={set("product")} placeholder={t("field.categoryPh")} />
                </Field>
                <Field label={t("field.quantity")} required>
                  <input className={inputCls} value={form.quantity} onChange={set("quantity")} placeholder={t("field.quantityPh")} />
                </Field>
              </div>
            </Section>

            {/* Recommended: project details */}
            <Section title={t("section.details")}>
              <div className="space-y-4">
                <Field label={t("field.requirements")} required>
                  <textarea className={cn(inputCls, "min-h-36")} value={form.requirements} onChange={set("requirements")} placeholder={t("field.requirementsPh")} />
                </Field>
                <Field label={t("field.designLink")}>
                  <input className={inputCls} value={form.designLink} onChange={set("designLink")} placeholder={t("field.designLinkPh")} />
                </Field>
                <FileDrop hint1={t("field.fileUpload")} hint2={t("field.fileHint")} />
              </div>
            </Section>

            {/* Next steps */}
            <div className="rounded-[var(--radius-card)] border border-line bg-cream p-6">
              <h3 className="mb-3 font-bold">{t("section.nextSteps")}</h3>
              <ul className="space-y-2 text-sm text-muted">
                {["one", "two", "three"].map((k) => (
                  <li key={k} className="flex gap-2">
                    <span className="text-brand">✓</span>
                    {t(`nextStep.${k}`)}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Errors + submit */}
      {status === "error" && (
        <p className="mt-5 text-sm font-medium text-red-600">
          {errorKey === "required" ? t("errorRequired") : t("errorGeneric")}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {status === "submitting" ? t("submitting") : t("submit")}
          <span aria-hidden>↗</span>
        </button>
      </div>

      <p className="sr-only">{tn("quote")}</p>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-white p-6">
      <h2 className="mb-5 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
      {children}
    </label>
  );
}

function FileDrop({ hint1, hint2 }: { hint1: string; hint2: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-brand/40 bg-brand-soft/40 px-4 py-8 text-center">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-brand">
        <path d="M12 16V4m0 0L8 8m4-4l4 4M4 20h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-sm font-medium text-brand">{hint1}</span>
      <span className="text-xs text-faint">{hint2}</span>
    </div>
  );
}

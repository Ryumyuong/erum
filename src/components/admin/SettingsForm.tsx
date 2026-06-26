"use client";

import { useState } from "react";
import { adminInput, Field } from "@/components/admin/fields";
import { saveSettings } from "@/app/admin/content-actions";

type Settings = Record<string, string>;

const FIELDS: { key: string; label: string }[] = [
  { key: "site_name", label: "사이트명" },
  { key: "company_en", label: "회사명 (영문)" },
  { key: "company_kr", label: "회사명 (국문)" },
  { key: "ceo_en", label: "대표자명 (영문)" },
  { key: "ceo_kr", label: "대표자명 (국문)" },
  { key: "email", label: "연락 이메일" },
  { key: "phone", label: "전화번호" },
  { key: "whatsapp", label: "왓츠앱 번호" },
  { key: "biz_no", label: "사업자등록번호" },
  { key: "address_en", label: "주소 (영문)" },
  { key: "address_kr", label: "주소 (국문)" },
  { key: "instagram", label: "인스타그램 URL" },
  { key: "blog_url", label: "블로그 URL" },
];

export function SettingsForm({ initial }: { initial: Settings }) {
  const [form, setForm] = useState<Settings>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    const res = await saveSettings(form);
    if (res.ok) {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setError(res.error ?? null);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <input
              className={adminInput}
              value={form[f.key] ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
            />
          </Field>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {status === "saving" ? "저장 중…" : "저장"}
        </button>
        {status === "saved" && (
          <span className="text-sm font-medium text-green-600">저장되었습니다 ✓</span>
        )}
      </div>
    </form>
  );
}

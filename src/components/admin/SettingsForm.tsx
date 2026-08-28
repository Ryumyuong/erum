"use client";

import { useState } from "react";
import { adminInput, adminSelect, Field } from "@/components/admin/fields";
import { saveSettings } from "@/app/admin/content-actions";

type Settings = Record<string, string>;

const BASIC: { key: string; label: string }[] = [
  { key: "site_name", label: "사이트명" },
  { key: "company_en", label: "회사명 (영문)" },
  { key: "company_kr", label: "회사명 (국문)" },
  { key: "ceo_en", label: "대표자명 (영문)" },
  { key: "ceo_kr", label: "대표자명 (국문)" },
  { key: "email", label: "연락 이메일" },
  { key: "phone", label: "전화번호" },
  { key: "kakao_url", label: "카카오톡 채널 주소" },
  { key: "biz_no", label: "사업자등록번호" },
  { key: "address_en", label: "주소 (영문)" },
  { key: "address_kr", label: "주소 (국문)" },
];

const SNS: { key: string; label: string }[] = [
  { key: "instagram", label: "인스타그램 URL" },
  { key: "blog_url", label: "블로그 URL" },
];

export function SettingsForm({ initial }: { initial: Settings }) {
  const [form, setForm] = useState<Settings>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const set = (key: string, value: string) =>
    setForm((s) => ({ ...s, [key]: value }));

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
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic */}
      <section className="rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-[1.25rem] font-bold text-[#101828]">기본 설정</h2>
        <div className="space-y-4">
          {BASIC.map((f) => (
            <Field key={f.key} label={f.label}>
              <input
                className={adminInput}
                value={form[f.key] ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
              />
            </Field>
          ))}
        </div>
      </section>

      {/* Language */}
      <section className="rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-[1.25rem] font-bold text-[#101828]">언어 설정</h2>
        <Field label="기본 언어">
          <select
            className={adminSelect}
            value={form.default_lang ?? "en"}
            onChange={(e) => set("default_lang", e.target.value)}
          >
            <option value="en">English (영문)</option>
            <option value="ko">한국어 (국문)</option>
          </select>
        </Field>
      </section>

      {/* SNS */}
      <section className="rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-[1.25rem] font-bold text-[#101828]">SNS · 링크</h2>
        <div className="space-y-4">
          {SNS.map((f) => (
            <Field key={f.key} label={f.label}>
              <input
                className={adminInput}
                value={form[f.key] ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
              />
            </Field>
          ))}
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-end gap-3">
        {status === "saved" && (
          <span className="text-sm font-medium text-green-600">저장되었습니다 ✓</span>
        )}
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {status === "saving" ? "저장 중…" : "저장"}
        </button>
      </div>
    </form>
  );
}

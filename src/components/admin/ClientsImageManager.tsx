"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { btnPrimary, Field } from "@/components/admin/fields";
import { saveSettings } from "@/app/admin/content-actions";

/**
 * 거래처 logo wall — one composed image rather than a grid of separate logos.
 *
 * Two slots: the wide desktop artwork and an optional taller one for phones.
 * Leaving both empty falls back to the built-in logo grid on the About page.
 */
export function ClientsImageManager({
  settings,
}: {
  settings: Record<string, unknown>;
}) {
  const router = useRouter();
  const [pc, setPc] = useState(String(settings.clients_image ?? ""));
  const [mobile, setMobile] = useState(
    String(settings.clients_image_mobile ?? ""),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    // saveSettings upserts the whole row, so the untouched values ride along.
    const res = await saveSettings({
      ...settings,
      clients_image: pc,
      clients_image_mobile: mobile,
    });
    if (!res.ok) setError(res.error ?? "저장 실패");
    else setSavedAt(new Date().toLocaleTimeString("ko-KR"));
    setBusy(false);
    router.refresh();
  }

  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-white p-6">
      <h2 className="text-lg max-[500px]:text-[0.9375rem] font-bold text-[#101828]">
        거래처 로고
      </h2>
      <p className="mt-1 text-sm text-muted">
        로고를 한 장의 이미지로 만들어 올려주세요. 비워두면 기존 로고 목록이
        그대로 표시됩니다.
      </p>

      <div className="mt-4 grid gap-5 desktop:grid-cols-2">
        <Field label="PC 이미지" hint="가로로 넓은 버전">
          <ImageUpload
            value={pc}
            folder="about"
            previewClassName="h-40 w-full"
            onChange={setPc}
          />
        </Field>
        <Field label="모바일 이미지 (선택)" hint="비우면 PC 이미지를 함께 사용합니다">
          <ImageUpload
            value={mobile}
            folder="about"
            previewClassName="h-40 w-full"
            onChange={setMobile}
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className={btnPrimary} onClick={save} disabled={busy}>
          {busy ? "저장 중…" : "저장"}
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
        {!error && savedAt && (
          <span className="text-sm text-muted">저장됨 · {savedAt}</span>
        )}
      </div>
    </section>
  );
}

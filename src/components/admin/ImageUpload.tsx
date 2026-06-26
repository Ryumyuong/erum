"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Uploads an image to the Supabase Storage "media" bucket (authenticated admin)
 * and returns the public URL via onChange.
 */
export function ImageUpload({
  value,
  onChange,
  folder = "misc",
}: {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "png";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("media")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-gray-50">
          {value ? (
            <Image src={value} alt="" fill sizes="80px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-faint">
              없음
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex w-fit cursor-pointer items-center rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-brand hover:text-brand">
            {uploading ? "업로드 중…" : "이미지 업로드"}
            <input type="file" accept="image/*" onChange={onFile} className="hidden" disabled={uploading} />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="w-fit text-xs text-red-500 hover:underline"
            >
              제거
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

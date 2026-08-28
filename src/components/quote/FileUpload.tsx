"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const ACCEPT = "image/*,application/pdf,.ai,.psd";
const MAX_MB = 10;

const isImage = (url: string) => /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(url);
const fileName = (url: string) =>
  decodeURIComponent(url.split("/").pop() ?? "file").replace(/^\d+-\w+\./, "•.");

/**
 * Reference-file uploader for the quote form. Click or drag-and-drop to upload
 * to Supabase Storage (media/inquiries/*); shows small thumbnails with an ✕ to
 * remove. Returns the public URLs via onChange.
 */
export function FileUpload({
  value,
  onChange,
  hint1,
  hint2,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  hint1: string;
  hint2: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | File[]) {
    setError(null);
    setUploading(true);
    const supabase = createClient();
    const added: string[] = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`${file.name} — 최대 ${MAX_MB}MB까지 업로드할 수 있습니다.`);
        continue;
      }
      const ext = file.name.split(".").pop() || "dat";
      const path = `inquiries/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) {
        setError(upErr.message);
        continue;
      }
      added.push(supabase.storage.from("media").getPublicUrl(path).data.publicUrl);
    }
    setUploading(false);
    if (added.length) onChange([...value, ...added]);
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
        }
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) upload(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors",
          dragOver ? "border-brand bg-brand-soft" : "border-brand/40 bg-brand-soft/40",
        )}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-brand">
          <path d="M12 16V4m0 0L8 8m4-4l4 4M4 20h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[min(2.91vw,12px)] desktop:text-sm font-medium text-brand">
          {uploading ? "업로드 중…" : hint1}
        </span>
        <span className="text-[min(2.43vw,10px)] desktop:text-xs text-faint">{hint2}</span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) upload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="mt-2 text-[min(2.43vw,10px)] desktop:text-xs text-red-600">{error}</p>}

      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((url, i) => (
            <div
              key={url}
              className="relative h-16 w-16 overflow-hidden rounded-lg border border-line bg-gray-50"
            >
              {isImage(url) ? (
                <Image src={url} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full items-center justify-center p-1 text-center text-[min(2.18vw,9px)] desktop:text-[0.625rem] leading-tight text-muted hover:text-brand"
                >
                  {fileName(url)}
                </a>
              )}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                aria-label="삭제"
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[min(2.43vw,10px)] desktop:text-xs text-white hover:bg-black/80"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/upload-image";
import { cn } from "@/lib/utils";

/**
 * Uploads an image to the Supabase Storage "media" bucket (authenticated admin)
 * and returns the public URL via onChange. Supports click-to-select and
 * drag-and-drop.
 *
 * With `multiple`, a whole batch can be picked or dropped at once: uploads run
 * concurrently but onChange fires in the order the files were given, so callers
 * that append to a list keep the selection order. The single-image preview is
 * dropped in that mode — the parent owns the gallery.
 */
export function ImageUpload({
  value,
  onChange,
  folder = "misc",
  multiple = false,
  previewClassName = "h-20 w-20",
}: {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  multiple?: boolean;
  /** Size of the single-image preview box. */
  previewClassName?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFiles(fileList: FileList | null | undefined) {
    if (uploading) return;
    const picked = Array.from(fileList ?? []);
    if (picked.length === 0) return;

    const files = (multiple ? picked : picked.slice(0, 1)).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (files.length === 0) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    const skipped = (multiple ? picked.length : 1) - files.length;

    setUploading(true);
    setError(null);
    setProgress({ done: 0, total: files.length });

    const supabase = createClient();
    let done = 0;
    const results = await Promise.all(
      files.map(async (file) => {
        try {
          return await uploadImage(file, folder, supabase);
        } catch (e) {
          return e instanceof Error ? e : new Error("업로드 실패");
        } finally {
          done += 1;
          setProgress({ done, total: files.length });
        }
      }),
    );

    // Emit in the original file order so appended galleries stay predictable.
    for (const r of results) if (typeof r === "string") onChange(r);

    const failures = results.filter((r): r is Error => r instanceof Error);
    const notes: string[] = [];
    if (failures.length)
      notes.push(`${failures.length}장 업로드 실패 — ${failures[0].message}`);
    if (skipped > 0) notes.push(`이미지가 아닌 파일 ${skipped}개는 건너뛰었습니다.`);
    setError(notes.join(" / ") || null);

    setUploading(false);
    setProgress(null);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    uploadFiles(e.target.files);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  }

  const label = uploading
    ? progress && progress.total > 1
      ? `업로드 중… ${progress.done}/${progress.total}`
      : "업로드 중…"
    : multiple
      ? "이미지 업로드 (여러 장 선택 가능)"
      : "이미지 업로드";

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!dragOver) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={cn(
        "rounded-lg border-2 border-dashed p-3 transition-colors",
        dragOver ? "border-brand bg-brand-soft" : "border-line",
      )}
    >
      {/* flex-wrap so a large preview drops the controls onto their own row
          instead of squeezing them. */}
      <div className="flex flex-wrap items-center gap-4">
        {!multiple && (
          <div
            className={cn(
              "relative shrink-0 overflow-hidden rounded-lg border border-line bg-gray-50",
              previewClassName,
            )}
          >
            {value ? (
              <Image
                src={value}
                alt=""
                fill
                sizes="(max-width: 990px) 90vw, 400px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-xs text-faint">
                없음
              </span>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label
            className={cn(
              "inline-flex w-fit items-center rounded-full border border-line px-4 py-2 text-sm font-medium",
              uploading
                ? "cursor-default opacity-60"
                : "cursor-pointer hover:border-brand hover:text-brand",
            )}
          >
            {label}
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={onFile}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <p className="text-xs text-faint">
            {multiple
              ? "또는 이미지 여러 장을 한 번에 여기로 드래그"
              : "또는 이미지를 여기로 드래그"}
          </p>
          {!multiple && value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="w-fit text-sm font-medium text-red-500 hover:underline"
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

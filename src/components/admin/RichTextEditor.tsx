"use client";

import { useEffect, useRef, useState } from "react";
import { uploadImage } from "@/lib/upload-image";
import { cn } from "@/lib/utils";

const SIZES = [14, 16, 20, 24, 30, 40];

/**
 * Minimal rich-text editor (no external deps). Lets the user select text and
 * apply an explicit font size, bold, or a bullet list, and drop images into the
 * body. Stores HTML.
 *
 * Font sizing uses the reliable `execCommand("fontSize")` trick: it wraps the
 * selection in <font size="7">, which we then convert to a <span> with the
 * chosen px. Buttons use onMouseDown→preventDefault so the text selection in
 * the editor isn't lost when the button is pressed.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // Picking a file blurs the editor and drops the caret, so remember where it
  // was and put it back before inserting.
  const caret = useRef<Range | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.innerHTML !== (value || "")) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const emit = () => onChange(ref.current?.innerHTML ?? "");

  const applySize = (px: number) => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    // Only act on an actual drag-selection inside the editor; otherwise do nothing.
    if (
      !sel ||
      sel.rangeCount === 0 ||
      sel.isCollapsed ||
      !el.contains(sel.getRangeAt(0).commonAncestorContainer)
    ) {
      return;
    }

    document.execCommand("fontSize", false, "7");
    el.querySelectorAll('font[size="7"]').forEach((f) => {
      const span = document.createElement("span");
      span.style.fontSize = `${px}px`;
      span.style.lineHeight = "1.4";
      span.innerHTML = (f as HTMLElement).innerHTML;
      f.replaceWith(span);
    });
    emit();
  };

  const exec = (command: string) => {
    ref.current?.focus();
    document.execCommand(command, false);
    emit();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    emit();
  };

  const rememberCaret = () => {
    const sel = window.getSelection();
    if (
      sel &&
      sel.rangeCount > 0 &&
      ref.current?.contains(sel.getRangeAt(0).commonAncestorContainer)
    ) {
      caret.current = sel.getRangeAt(0).cloneRange();
    }
  };

  function insertImage(url: string) {
    const el = ref.current;
    if (!el) return;
    el.focus();

    const sel = window.getSelection();
    if (caret.current && sel) {
      sel.removeAllRanges();
      sel.addRange(caret.current);
    }

    const img = document.createElement("img");
    img.src = url;
    img.alt = "";

    const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    if (range && el.contains(range.commonAncestorContainer)) {
      range.deleteContents();
      range.insertNode(img);
      // Leave the caret after the image so typing continues below it.
      range.setStartAfter(img);
      range.collapse(true);
      sel!.removeAllRanges();
      sel!.addRange(range);
      caret.current = range.cloneRange();
    } else {
      el.appendChild(img); // no caret yet — append at the end
    }
    emit();
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("이미지 파일만 삽입할 수 있습니다.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      insertImage(await uploadImage(file, "blog"));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  // Keep the editor's selection when a toolbar button is pressed.
  const keepSelection = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className="rounded-lg border border-line">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-line bg-gray-50 p-2">
        <span className="mr-1 text-xs text-muted">글자 크기</span>
        {SIZES.map((px) => (
          <button
            key={px}
            type="button"
            title={`${px}px`}
            onMouseDown={keepSelection}
            onClick={() => applySize(px)}
            className="rounded-md border border-line bg-white px-2 py-1 text-sm font-medium text-[#364153] hover:border-brand hover:text-brand"
          >
            {px}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-line" />
        <button
          type="button"
          title="굵게"
          onMouseDown={keepSelection}
          onClick={() => exec("bold")}
          className="rounded-md border border-line bg-white px-2.5 py-1 text-sm hover:border-brand hover:text-brand"
        >
          <b>B</b>
        </button>
        <button
          type="button"
          title="글머리 목록"
          onMouseDown={keepSelection}
          onClick={() => exec("insertUnorderedList")}
          className="rounded-md border border-line bg-white px-2.5 py-1 text-sm font-medium text-[#364153] hover:border-brand hover:text-brand"
        >
          • 목록
        </button>
        <span className="mx-1 h-5 w-px bg-line" />
        <label
          title="이미지 삽입"
          onMouseDown={rememberCaret}
          className={cn(
            "rounded-md border border-line bg-white px-2.5 py-1 text-sm font-medium text-[#364153]",
            uploading
              ? "cursor-default opacity-60"
              : "cursor-pointer hover:border-brand hover:text-brand",
          )}
        >
          {uploading ? "업로드 중…" : "🖼 이미지"}
          <input
            type="file"
            accept="image/*"
            onChange={onPickImage}
            className="hidden"
            disabled={uploading}
          />
        </label>
        {uploadError && (
          <span className="text-xs text-red-600">{uploadError}</span>
        )}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onPaste={onPaste}
        onKeyUp={rememberCaret}
        onMouseUp={rememberCaret}
        onBlur={rememberCaret}
        data-placeholder={placeholder}
        className="blog-content min-h-40 px-4 py-3 text-[1rem] leading-relaxed text-[#101828] outline-none empty:before:text-[#0A0A0A]/40 empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
}

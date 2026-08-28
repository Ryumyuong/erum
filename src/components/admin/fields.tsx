"use client";

import { useEffect } from "react";

export const adminInput =
  "w-full rounded-lg border border-line px-4 py-3 max-[500px]:px-3 max-[500px]:py-2 text-[1rem] max-[500px]:text-[0.8125rem] text-[#0A0A0A] outline-none focus:border-brand";

// Selects reuse the input style but hide the native arrow (.admin-select draws
// a custom chevron inset from the right) and add right padding for the text.
export const adminSelect = `${adminInput} admin-select pr-10`;

// Shared admin button styles — match the page-level admin design.
export const btnPrimary =
  "rounded-[0.625rem] bg-[#FD7304] px-5 py-2.5 max-[500px]:px-3 max-[500px]:py-1.5 text-[1rem] max-[500px]:text-[0.8125rem] font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60";
export const btnGhost =
  "rounded-[0.625rem] border border-[#D1D5DC] px-5 py-2.5 max-[500px]:px-3 max-[500px]:py-1.5 text-[1rem] max-[500px]:text-[0.8125rem] font-medium text-[#364153] transition-colors hover:border-brand hover:text-brand";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-[#364153]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-faint">{hint}</span>}
    </label>
  );
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative flex min-h-full items-start justify-center p-4">
        <div
          className="relative z-10 my-6 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[1.25rem] max-[500px]:text-[1rem] font-bold text-[#101828]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 items-center justify-center rounded-full text-faint hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        {children}
        </div>
      </div>
    </div>
  );
}

/**
 * "참고 제품" — portfolio item numbers the visitor bookmarked, kept in
 * localStorage so it works without an account. Written by SaveReferenceButton
 * and read by the quote form, which attaches them to the inquiry.
 *
 * Exposed as a `useSyncExternalStore` source: reading in an effect would mean
 * setState-in-effect (which this project's lint rejects) and reading in a lazy
 * initialiser would desync from SSR, where there is no localStorage.
 */
const KEY = "boxdle:saved-portfolio";
const CHANGE_EVENT = "boxdle:saved-portfolio-change";

// Stable empty array — a fresh [] each call would loop useSyncExternalStore.
const EMPTY: readonly string[] = [];

function parse(raw: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string" && !!x);
  } catch {
    return []; // malformed storage — treat as empty
  }
}

// getSnapshot must return the same reference until the data actually changes.
let cachedRaw: string | null = null;
let cached: readonly string[] = EMPTY;

export function getSavedReferences(): readonly string[] {
  const raw = localStorage.getItem(KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = parse(raw);
  }
  return cached;
}

export function getSavedReferencesServer(): readonly string[] {
  return EMPTY;
}

export function subscribeSavedReferences(onChange: () => void): () => void {
  window.addEventListener("storage", onChange); // other tabs
  window.addEventListener(CHANGE_EVENT, onChange); // this tab
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function toggleSavedReference(itemNo: string): void {
  const list = getSavedReferences();
  const next = list.includes(itemNo)
    ? list.filter((x) => x !== itemNo)
    : [...list, itemNo];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable (private mode / quota) — the toggle just won't persist
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

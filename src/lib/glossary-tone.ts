/**
 * Placeholder gradient for a glossary term that has no uploaded image.
 * Derived from the term id so the same term always gets the same colour,
 * and shared by the list and the detail page's related-terms cards.
 */
const TONES = [
  "from-sky-100 to-indigo-50",
  "from-amber-200 to-yellow-50",
  "from-stone-200 to-stone-50",
  "from-rose-100 to-pink-50",
  "from-lime-100 to-green-50",
  "from-neutral-200 to-neutral-50",
];

export function glossaryTone(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
}

import type { GlossaryTerm } from "@/lib/data/glossary";

const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

/**
 * Resolve a portfolio spec label ("별색 (팬톤)", "Kraft Paper") to a glossary
 * entry, so detail pages can link the jargon they print.
 *
 * Exact matches win. Failing that it falls back to the longest glossary term
 * contained in the label, which is what catches the qualified forms the spec
 * columns actually store — "별색 (팬톤)" resolves to 별색. Single-character
 * terms are skipped; they match almost anything.
 */
export function matchGlossaryTerm(
  label: string,
  terms: GlossaryTerm[],
): GlossaryTerm | undefined {
  const target = norm(label);
  if (!target) return undefined;

  for (const term of terms) {
    if (norm(term.term.ko) === target || norm(term.term.en) === target) {
      return term;
    }
  }

  let best: GlossaryTerm | undefined;
  let bestLength = 0;
  for (const term of terms) {
    for (const candidate of [term.term.ko, term.term.en]) {
      const text = norm(candidate);
      if (text.length > 1 && text.length > bestLength && target.includes(text)) {
        best = term;
        bestLength = text.length;
      }
    }
  }
  return best;
}

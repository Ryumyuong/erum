/**
 * Renders a long Korean legal document (이용약관 / 개인정보처리방침) from a plain
 * string. Lines starting with 제N조 or 부칙 become headings; ▶ lines become
 * subheadings; everything else is a paragraph (blank lines add spacing).
 */
const HEADING = /^(제\s?\d+\s?조|부칙|Article\s+\d+|Addendum)/i;

export function LegalDoc({ title, text }: { title: string; text: string }) {
  const lines = text.split("\n");
  return (
    <div className="container-page py-16 desktop:py-24">
      <h1 className="text-[min(7.767vw,32px)] max-[500px]:text-[min(6.553vw,27.53px)] desktop:text-[2.5rem] font-bold text-[#101828]">{title}</h1>
      <div className="mt-10 max-w-3xl text-[min(3.16vw,13px)] desktop:text-[0.9375rem] leading-relaxed text-[#364153]">
        {lines.map((raw, i) => {
          const line = raw.trim();
          if (!line) return <div key={i} className="h-3" />;
          if (HEADING.test(line)) {
            return (
              <h2 key={i} className="mt-8 mb-2 text-[min(4.13vw,17px)] desktop:text-[1.25rem] font-bold text-[#101828]">
                {line}
              </h2>
            );
          }
          if (line.startsWith("▶")) {
            return (
              <h3 key={i} className="mt-4 mb-1 font-semibold text-[#101828]">
                {line}
              </h3>
            );
          }
          return (
            <p key={i} className="my-1 whitespace-pre-wrap">
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}

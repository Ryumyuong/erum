/**
 * Renders a JSON-LD structured-data block. Server-rendered from our own
 * content, so nothing user-supplied reaches the script tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

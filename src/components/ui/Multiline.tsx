import { Fragment } from "react";

/**
 * Renders `|` in admin-entered text as a line break.
 *
 * The same convention the translation files use, so someone editing an option
 * name in the admin can control where a long label wraps instead of leaving it
 * to the column width.
 */
export function multiline(text: string) {
  const parts = text.split("|");
  if (parts.length === 1) return text;
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part.trim()}
      {i < parts.length - 1 && <br />}
    </Fragment>
  ));
}

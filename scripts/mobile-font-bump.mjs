/**
 * Scale the mobile font sizes up by a fixed factor.
 *
 * Mobile type is written as `text-[min(<n>vw,<n>px)]` with a `desktop:text-[…]`
 * override beside it, so the vw pair is mobile-only and safe to scale. Lines
 * without a desktop override are skipped — their px cap is also the desktop
 * size, and raising it would change desktop too.
 *
 * Usage: node scripts/mobile-font-bump.mjs [factor]   (default 1.08)
 */
import fs from "node:fs";
import path from "node:path";

const FACTOR = Number(process.argv[2] ?? 1.08);
const ROOT = "src";

const trim = (n) => String(Number(n.toFixed(4)));

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".tsx")) out.push(p);
  }
  return out;
}

let files = 0;
let hits = 0;
const skipped = [];

for (const file of walk(ROOT)) {
  const src = fs.readFileSync(file, "utf8");
  let changed = false;

  const next = src
    .split("\n")
    .map((line, i) => {
      if (!/text-\[min\([\d.]+vw,[\d.]+px\)\]/.test(line)) return line;
      if (!line.includes("desktop:text-")) {
        skipped.push(`${file}:${i + 1}`);
        return line;
      }
      return line.replace(
        /text-\[min\(([\d.]+)vw,([\d.]+)px\)\]/g,
        (_, vw, px) => {
          changed = true;
          hits++;
          return `text-[min(${trim(vw * FACTOR)}vw,${trim(px * FACTOR)}px)]`;
        },
      );
    })
    .join("\n");

  if (changed) {
    fs.writeFileSync(file, next);
    files++;
  }
}

console.log(`factor ${FACTOR} — ${hits} sizes in ${files} files`);
console.log(`skipped (no desktop override): ${skipped.length}`);
for (const s of skipped) console.log("  " + s);

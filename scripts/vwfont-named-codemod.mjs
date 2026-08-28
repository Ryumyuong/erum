// Second codemod: convert Tailwind NAMED font sizes (text-sm, text-xs, ...) to
// fluid vw on mobile, keeping desktop via a `desktop:` override.
//   text-sm  ->  text-[min(<coeff>vw,<cap>px)] desktop:text-sm
// Same rule as the arbitrary codemod. BASE tokens only (skip variant-prefixed).
import fs from "fs";
import path from "path";

const FACTOR = 0.85;
const BASE = 412;
const WRITE = process.argv.includes("--write");
const ROOT = path.resolve("src");
const SIZES = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 30, "4xl": 36, "5xl": 48, "6xl": 60 };

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (p.includes(path.sep + "admin" + path.sep) || /[\\/]admin$/.test(p)) continue;
      out.push(...walk(p));
    } else if (e.isFile() && p.endsWith(".tsx")) out.push(p);
  }
  return out;
}

const names = Object.keys(SIZES).sort((a, b) => b.length - a.length).join("|");
const RE = new RegExp(`(^|[\\s"'\`{])text-(${names})\\b`, "g");

const conv = new Map();
let total = 0;
const perFile = [];

for (const file of walk(ROOT)) {
  const src = fs.readFileSync(file, "utf8");
  let count = 0;
  const next = src.replace(RE, (m, pre, name) => {
    const px = SIZES[name];
    const cap = Math.round(px * FACTOR);
    const coeff = Math.round((cap / BASE) * 10000) / 100;
    const repl = `text-[min(${coeff}vw,${cap}px)] desktop:text-${name}`;
    conv.set(`text-${name}`, repl);
    count++; total++;
    return `${pre}${repl}`;
  });
  if (count > 0) {
    perFile.push([file.replace(ROOT + path.sep, ""), count]);
    if (WRITE) fs.writeFileSync(file, next);
  }
}

console.log(WRITE ? "== APPLIED ==" : "== DRY RUN ==");
console.log(`files: ${perFile.length}, conversions: ${total}\n`);
for (const [o, r] of [...conv].sort()) console.log(`  ${o}  ->  ${r}`);

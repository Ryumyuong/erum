// One-off codemod: convert base `text-[Nrem|px]` font classes to fluid vw on
// mobile, keeping the desktop size via a `desktop:` override.
//   text-[1rem]  ->  text-[min(<coeff>vw,<cap>px)] desktop:text-[1rem]
// cap = round(desktopPx * FACTOR) ; coeff = cap/412*100 (so at 412px == cap).
// Only BASE tokens (not variant-prefixed like md:/sm:/hover:/desktop:) are
// touched. Run with `--write` to apply; default is a dry run.
import fs from "fs";
import path from "path";

const FACTOR = 0.85; // ~15% smaller at 412px vs desktop
const BASE = 412;
const WRITE = process.argv.includes("--write");
const ROOT = path.resolve("src");

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (/[\\/]admin$/.test(p) || p.includes(path.sep + "admin" + path.sep)) continue;
      out.push(...walk(p));
    } else if (e.isFile() && p.endsWith(".tsx")) {
      out.push(p);
    }
  }
  return out;
}

// base text-[<num>rem|px] not preceded by a variant colon / word char / dash
const RE = /(^|[\s"'`{])text-\[(\d+(?:\.\d+)?)(rem|px)\]/g;

const conversions = new Map(); // original -> replacement
let total = 0;
const perFile = [];

for (const file of walk(ROOT)) {
  let src = fs.readFileSync(file, "utf8");
  let count = 0;
  const next = src.replace(RE, (m, pre, num, unit) => {
    const px = unit === "rem" ? parseFloat(num) * 16 : parseFloat(num);
    const cap = Math.round(px * FACTOR);
    const coeff = Math.round((cap / BASE) * 10000) / 100; // 2 decimals
    const orig = `text-[${num}${unit}]`;
    const repl = `text-[min(${coeff}vw,${cap}px)] desktop:${orig}`;
    conversions.set(orig, `text-[min(${coeff}vw,${cap}px)] desktop:${orig}`);
    count++;
    total++;
    return `${pre}${repl}`;
  });
  if (count > 0) {
    perFile.push([file.replace(ROOT + path.sep, ""), count]);
    if (WRITE) fs.writeFileSync(file, next);
  }
}

console.log(WRITE ? "== APPLIED ==" : "== DRY RUN ==");
console.log(`files changed: ${perFile.length}, total conversions: ${total}\n`);
console.log("unique conversions:");
for (const [o, r] of [...conversions].sort()) console.log(`  ${o}  ->  ${r}`);
console.log("\nper file:");
for (const [f, c] of perFile.sort((a, b) => b[1] - a[1])) console.log(`  ${c}\t${f}`);

// Read-only report: which 사용분야 filter options exist, and how many portfolio
// items reference each. Used to decide which duplicates are safe to remove.
//   node scripts/usefield-report.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const [{ data: options, error: e1 }, { data: items, error: e2 }] =
  await Promise.all([
    supabase
      .from("portfolio_filter_option")
      .select("id,label_kr,label_en,sort")
      .eq("group_id", "useField")
      .order("sort"),
    supabase.from("portfolio").select("item_no,use_field"),
  ]);

if (e1 || e2) {
  console.error("query failed:", e1?.message ?? e2?.message);
  process.exit(1);
}

const usage = new Map();
for (const it of items ?? []) {
  if (!it.use_field) continue;
  usage.set(it.use_field, [...(usage.get(it.use_field) ?? []), it.item_no]);
}
console.log(`options: ${options.length}   portfolio rows: ${items.length}\n`);
console.log("사용분야 옵션별 참조 현황");
console.log("─".repeat(88));
for (const o of options) {
  const used = usage.get(o.id) ?? [];
  console.log(
    [
      String(used.length).padStart(2) + "건",
      (o.label_kr || "(빈칸)").padEnd(14),
      (o.label_en || "").padEnd(22),
      o.id,
      used.length ? "← " + used.join(", ") : "",
    ].join("  "),
  );
}

const orphans = [...usage.keys()].filter(
  (id) => !options.some((o) => o.id === id),
);
if (orphans.length) {
  console.log(
    "\n⚠ 필터 목록에 없는데 포트폴리오가 참조 중인 id:",
    orphans.join(", "),
  );
}

const dupes = new Map();
for (const o of options) {
  const key = (o.label_kr || o.label_en || "").trim();
  dupes.set(key, [...(dupes.get(key) ?? []), o]);
}
const realDupes = [...dupes.entries()].filter(([, v]) => v.length > 1);
if (realDupes.length) {
  console.log("\n이름이 겹치는 항목");
  console.log("─".repeat(88));
  for (const [label, group] of realDupes) {
    console.log(`  "${label}"`);
    for (const o of group) {
      const used = usage.get(o.id) ?? [];
      console.log(
        `     ${String(used.length).padStart(2)}건  ${o.id}`,
      );
    }
  }
}

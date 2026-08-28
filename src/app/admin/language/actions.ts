"use server";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

type Result = { ok: boolean; error?: string };
type Updates = { en: Record<string, string>; ko: Record<string, string> };

const LOCALES = ["en", "ko"] as const;

function setPath(obj: Record<string, unknown>, keys: string[], value: string) {
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (typeof cur[k] !== "object" || cur[k] === null) cur[k] = {};
    cur = cur[k] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
}

/**
 * Persist edited UI strings back into messages/{locale}.json. `updates` keys are
 * full dot-paths within the file (e.g. "page.about.title").
 */
export async function saveMessages(updates: Updates): Promise<Result> {
  try {
    for (const locale of LOCALES) {
      const file = path.join(process.cwd(), "messages", `${locale}.json`);
      const json = JSON.parse(await fs.readFile(file, "utf-8")) as Record<string, unknown>;
      for (const [dot, val] of Object.entries(updates[locale])) {
        setPath(json, dot.split("."), val);
      }
      await fs.writeFile(file, JSON.stringify(json, null, 2) + "\n", "utf-8");
    }
    // Messages feed every page via the root layout — revalidate the whole app.
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "save failed" };
  }
}

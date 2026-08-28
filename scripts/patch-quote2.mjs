// One-off patch: contact section changes, consents, and the new 추가 정보 fields.
import { readFileSync, writeFileSync } from "node:fs";

const p = "src/components/quote/QuoteForm.tsx";
let s = readFileSync(p, "utf8");
const sub = (from, to) => {
  if (!s.includes(from)) throw new Error("not found: " + from.slice(0, 80));
  s = s.replace(from, to);
};

/* imports + state */
sub(
  `import { Tooltip } from "./Tooltip";`,
  `import { ConsentFields } from "./ConsentFields";\nimport { Tooltip } from "./Tooltip";`,
);
sub(
  `  const finishingGroups = finishingGroupsFor(packageTab, sel.packageType);`,
  `  const finishingGroups = finishingGroupsFor(packageTab, sel.packageType);
  // 6. 연락처 — consents. Privacy is required; promo is a free choice.
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [promoAgreed, setPromoAgreed] = useState<"" | "yes" | "no">("");
  // 5. 추가 정보
  const [priority, setPriority] = useState("");
  const [priorityNote, setPriorityNote] = useState("");
  const [containsProduct, setContainsProduct] = useState("");`,
);

/* 회사명 → 회사명 또는 브랜드명 */
sub(
  `            <Field label={t("field.company")} required>`,
  `            <Field label={t("field.companyBrand")} required>`,
);

/* 도시 · 국가 → 도시/국가 (merged into one input) */
sub(
  `            <Field label={t("field.city")}>
              <input className={inputCls} value={form.city} onChange={set("city")} />
            </Field>
            <Field label={t("field.country")}>
              <input className={inputCls} value={form.country} onChange={set("country")} />
            </Field>`,
  `            {/* 도시 · 국가 merged into one field; still stored separately, with
                the whole string kept in \`city\` when it isn't split by a slash. */}
            <Field label={t("field.cityCountry")}>
              <input className={inputCls} value={form.city} onChange={set("city")} />
            </Field>`,
);

/* consents at the end of the contact section */
sub(
  `            </div>
          </div>
        </Section>`,
  `            </div>
          </div>
          <ConsentFields
            privacy={privacyAgreed}
            onPrivacy={setPrivacyAgreed}
            promo={promoAgreed}
            onPromo={setPromoAgreed}
          />
        </Section>`,
);

/* validation: privacy consent is mandatory */
sub(
  `      ) && designNeeded !== "";`,
  `      ) && designNeeded !== "" && privacyAgreed;`,
);

/* payload */
sub(
  `      designNeeded: designNeeded || undefined,`,
  `      designNeeded: designNeeded || undefined,
      privacyAgreed,
      promoAgreed: promoAgreed ? promoAgreed === "yes" : undefined,
      priority: priority
        ? priority === "other" && priorityNote.trim()
          ? \`\${priority}: \${priorityNote.trim()}\`
          : priority
        : undefined,
      containsProduct: containsProduct || undefined,
      // Flatten every option answer to labels so the admin can read an inquiry
      // without resolving ids against the option tables.
      spec: buildSpec(),`,
);

/* buildSpec helper */
sub(
  `  async function onSubmit(e: React.FormEvent) {`,
  `  /** Option answers as { group: { id, label, note } }, labels resolved. */
  function buildSpec() {
    const all = { ...materialOptions, ...specOptions };
    const answers = { ...materialValues, ...specValues };
    const notes = { ...materialNotes, ...specNotes };
    const out: Record<string, { id: string; label: string; note?: string }> = {};
    for (const [group, id] of Object.entries(answers)) {
      if (!id) continue;
      const opt = (all[group] ?? []).find((o) => o.id === id);
      out[group] = {
        id,
        label: opt ? pick(opt.label, locale) : id,
        ...(notes[group]?.trim() ? { note: notes[group].trim() } : {}),
      };
    }
    if (sel.packageType) {
      const opt = packageOptions.find((o) => o.id === sel.packageType);
      out.packageType = {
        id: sel.packageType,
        label: opt ? pick(opt.label, locale) : sel.packageType,
      };
    }
    return out;
  }

  async function onSubmit(e: React.FormEvent) {`,
);

writeFileSync(p, s);
console.log("patched");

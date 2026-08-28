import { AdminShell, AdminPageHeader } from "@/components/admin/AdminShell";
import { LanguageManager, type LangPage } from "@/components/admin/LanguageManager";
import { createClient } from "@/lib/supabase/server";
import enMessages from "../../../../messages/en.json";
import koMessages from "../../../../messages/ko.json";

export const dynamic = "force-dynamic";

const blank = (v: unknown) => !v || String(v).trim() === "";

// Pull a nested namespace subtree (e.g. "page.about") out of a messages object.
function ns(obj: unknown, dot: string): Record<string, unknown> {
  let cur: unknown = obj;
  for (const k of dot.split(".")) {
    cur = (cur as Record<string, unknown> | undefined)?.[k];
  }
  return (cur as Record<string, unknown>) ?? {};
}

export default async function LanguagePage() {
  const supabase = await createClient();

  const [portfolio, faq, glossary, blog, guide] = await Promise.all([
    supabase.from("portfolio").select("name_en, name_kr"),
    supabase.from("faq").select("q_en, q_kr, a_en, a_kr"),
    supabase.from("glossary").select("term_en, term_kr, desc_en, desc_kr"),
    supabase.from("blog").select("title_en, title_kr"),
    supabase.from("guide_item").select("title_en, title_kr, desc_en, desc_kr"),
  ]);

  // A page is "complete" for a locale when no row is missing that locale's text.
  function none<T>(rows: T[] | null, pred: (r: T) => boolean) {
    return !(rows ?? []).some(pred);
  }

  const pages: LangPage[] = [
    { name: "Home", nsKey: "home", en: true, kr: true },
    { name: "About", nsKey: "page.about", en: true, kr: true },
    {
      name: "Portfolio",
      nsKey: "page.portfolio",
      en: none(portfolio.data, (r) => blank(r.name_en)),
      kr: none(portfolio.data, (r) => blank(r.name_kr)),
    },
    {
      name: "Custom Guide",
      nsKey: "page.guide",
      en: none(guide.data, (r) => blank(r.title_en) || blank(r.desc_en)),
      kr: none(guide.data, (r) => blank(r.title_kr) || blank(r.desc_kr)),
    },
    {
      name: "FAQ",
      nsKey: "page.faq",
      en: none(faq.data, (r) => blank(r.q_en) || blank(r.a_en)),
      kr: none(faq.data, (r) => blank(r.q_kr) || blank(r.a_kr)),
    },
    {
      name: "Glossary",
      nsKey: "page.glossary",
      en: none(glossary.data, (r) => blank(r.term_en) || blank(r.desc_en)),
      kr: none(glossary.data, (r) => blank(r.term_kr) || blank(r.desc_kr)),
    },
    {
      name: "Blog",
      nsKey: "page.blog",
      en: none(blog.data, (r) => blank(r.title_en)),
      kr: none(blog.data, (r) => blank(r.title_kr)),
    },
    { name: "Contact", nsKey: "footer", en: true, kr: true },
  ].map(({ nsKey, ...rest }) => ({
    ...rest,
    ns: nsKey,
    enData: ns(enMessages, nsKey),
    koData: ns(koMessages, nsKey),
  }));

  return (
    <AdminShell>
      <div className="container-admin pt-12 pb-12 desktop:pt-44 desktop:pb-44">
        <AdminPageHeader title="Language Content Manager" />
        <LanguageManager pages={pages} />
      </div>
    </AdminShell>
  );
}

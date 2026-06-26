import { createClient } from "@/lib/supabase/server";
import type { PortfolioItem } from "@/lib/data/portfolio";
import type { FaqItem } from "@/lib/data/faq";
import type { GlossaryTerm } from "@/lib/data/glossary";
import type { BlogPost } from "@/lib/data/blog";
import type { GuideSection } from "@/lib/data/guide";

/**
 * Server-side data access. Maps Supabase rows (*_en / *_kr columns) back to the
 * { en, ko } shapes the existing UI components already consume.
 */

const TONES = [
  "from-amber-100 to-orange-50",
  "from-rose-100 to-pink-50",
  "from-stone-200 to-stone-50",
  "from-neutral-200 to-neutral-50",
  "from-lime-100 to-green-50",
  "from-sky-100 to-cyan-50",
  "from-violet-100 to-purple-50",
  "from-teal-100 to-cyan-50",
];

function pickTone(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio")
    .select("*")
    .order("sort", { ascending: true });
  return (data ?? []).map((r) => ({
    id: r.id,
    itemNo: r.item_no,
    name: { en: r.name_en, ko: r.name_kr },
    hover: { en: r.hover_en, ko: r.hover_kr },
    useField: r.use_field,
    material: r.material,
    packageType: r.package_type,
    packageForm: r.package_form,
    printing: r.printing ?? [],
    coating: { en: r.coating_en ?? "—", ko: r.coating_kr ?? "—" },
    finishing: { en: r.finishing_en ?? "—", ko: r.finishing_kr ?? "—" },
    dims: { l: r.dim_l, w: r.dim_w, h: r.dim_h },
    tone: r.thumbnail ? "" : pickTone(r.item_no),
    thumbnail: r.thumbnail ?? undefined,
  }));
}

export async function getPortfolioItem(
  id: string,
): Promise<PortfolioItem | undefined> {
  const all = await getPortfolio();
  return all.find((p) => p.id === id || p.itemNo === id);
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faq")
    .select("*")
    .order("sort", { ascending: true });
  return (data ?? []).map((r) => ({
    id: r.id,
    category: r.category,
    q: { en: r.q_en, ko: r.q_kr },
    a: { en: r.a_en, ko: r.a_kr },
  }));
}

export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("glossary")
    .select("*")
    .order("sort", { ascending: true });
  return (data ?? []).map((r) => ({
    id: r.id,
    category: r.category,
    term: { en: r.term_en, ko: r.term_kr },
    desc: { en: r.desc_en, ko: r.desc_kr },
    tags: (r.tags_en ?? []).map((en: string, i: number) => ({
      en,
      ko: r.tags_kr?.[i] ?? en,
    })),
    relatedPortfolioIds: r.related_portfolio_ids ?? [],
  }));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog")
    .select("*")
    .order("published_at", { ascending: false });
  return (data ?? []).map((r) => ({
    slug: r.slug,
    category: r.category,
    title: { en: r.title_en, ko: r.title_kr },
    summary: { en: r.summary_en, ko: r.summary_kr },
    date: r.published_at,
    tone: r.cover ? "" : pickTone(r.slug),
    cover: r.cover ?? undefined,
  }));
}

export async function getGuideSections(): Promise<GuideSection[]> {
  const supabase = await createClient();
  const [{ data: sections }, { data: items }] = await Promise.all([
    supabase.from("guide_section").select("*").order("sort", { ascending: true }),
    supabase.from("guide_item").select("*").order("sort", { ascending: true }),
  ]);
  return (sections ?? []).map((s) => ({
    id: s.key || s.id,
    title: { en: s.title_en, ko: s.title_kr },
    items: (items ?? [])
      .filter((it) => it.section_id === s.id)
      .map((it) => ({
        title: { en: it.title_en, ko: it.title_kr },
        subtitle: it.subtitle || undefined,
        desc: { en: it.desc_en, ko: it.desc_kr },
        tip: it.tip_en || it.tip_kr ? { en: it.tip_en, ko: it.tip_kr } : undefined,
        tone: pickTone(it.title_en || s.id),
      })),
  }));
}

export type SiteSettings = {
  siteName: string;
  companyEn: string;
  companyKo: string;
  ceoEn: string;
  ceoKo: string;
  email: string;
  phone: string;
  whatsapp: string;
  bizNo: string;
  addressEn: string;
  addressKo: string;
  instagram: string;
  blogUrl: string;
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (!data) return null;
  return {
    siteName: data.site_name,
    companyEn: data.company_en,
    companyKo: data.company_kr,
    ceoEn: data.ceo_en,
    ceoKo: data.ceo_kr,
    email: data.email,
    phone: data.phone,
    whatsapp: data.whatsapp,
    bizNo: data.biz_no,
    addressEn: data.address_en,
    addressKo: data.address_kr,
    instagram: data.instagram,
    blogUrl: data.blog_url,
  };
}

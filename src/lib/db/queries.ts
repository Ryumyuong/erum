import { createClient } from "@/lib/supabase/server";
import type { L } from "@/lib/content";
import {
  portfolioItems,
  portfolioFilters,
  type PortfolioItem,
  type FilterOption,
  type FilterGroup,
} from "@/lib/data/portfolio";
import { faqItems, faqCategories, type FaqItem, type FaqCategory } from "@/lib/data/faq";
import {
  glossaryTerms,
  glossaryCategories,
  type GlossaryTerm,
  type GlossaryCategory,
} from "@/lib/data/glossary";
import { blogCategories, type BlogPost, type BlogCategory } from "@/lib/data/blog";
import { guideSections, type GuideSection } from "@/lib/data/guide";
import { gallerySlides } from "@/lib/data/about";

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
  const [{ data }, taxonomy, useFields] = await Promise.all([
    supabase.from("portfolio").select("*").order("sort", { ascending: true }),
    getGuideTaxonomy(),
    getUseFields(),
  ]);
  if (!data || data.length === 0) return portfolioItems; // dummy until real data

  const labelById = new Map<string, L>();
  for (const s of taxonomy) for (const it of s.items) labelById.set(it.id, it.label);
  const useFieldLabelById = new Map(useFields.map((u) => [u.id, u.label] as const));

  return data.filter((r) => !r.hidden).map((r) => {
    const categories = (r.categories ?? {}) as Record<string, string[]>;
    const categoryLabels = taxonomy
      .map((s) => ({
        key: s.key,
        label: s.label,
        values: (categories[s.key] ?? [])
          .map((id) => labelById.get(id))
          .filter(Boolean) as L[],
      }))
      .filter((g) => g.values.length > 0);
    return {
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
      images: r.images ?? [],
      useFieldLabel: useFieldLabelById.get(r.use_field) ?? undefined,
      categories,
      categoryLabels,
    };
  });
}

/**
 * Guide taxonomy used to drive the portfolio filters and the quote form.
 * Each section is a filter group; each item is an option. Item ids are the
 * stable guide_item uuids that portfolio rows reference in `categories`.
 */
export type GuideTaxonomy = {
  key: string;
  label: L;
  items: { id: string; label: L; image?: string }[];
}[];

export async function getGuideTaxonomy(): Promise<GuideTaxonomy> {
  const supabase = await createClient();
  const [{ data: sections }, { data: items }] = await Promise.all([
    supabase
      .from("guide_section")
      .select("id, key, title_en, title_kr")
      .order("sort", { ascending: true }),
    supabase
      .from("guide_item")
      .select("id, section_id, title_en, title_kr, images")
      .order("sort", { ascending: true }),
  ]);
  return (sections ?? []).map((s) => ({
    key: s.key || s.id,
    label: { en: s.title_en, ko: s.title_kr },
    items: (items ?? [])
      .filter((it) => it.section_id === s.id)
      .map((it) => ({
        id: it.id,
        label: { en: it.title_en, ko: it.title_kr },
        image: it.images?.[0] ?? undefined,
      })),
  }));
}

/**
 * Admin-managed filter options for every group, keyed by group id.
 * Groups with no rows yet fall back to the static taxonomy, so the site keeps
 * working before migration 0021 runs.
 */
export async function getPortfolioFilterOptions(): Promise<
  Record<string, FilterOption[]>
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_filter_option")
    .select("*")
    .order("sort", { ascending: true });

  const fromDb = new Map<string, FilterOption[]>();
  for (const r of data ?? []) {
    const list = fromDb.get(r.group_id) ?? [];
    list.push({
      id: r.id,
      label: { en: r.label_en, ko: r.label_kr },
      ...(r.image ? { image: r.image } : {}),
    });
    fromDb.set(r.group_id, list);
  }

  const out: Record<string, FilterOption[]> = {};
  // A group present in the DB replaces its static list wholesale, so an option
  // deleted in the admin doesn't linger.
  for (const g of portfolioFilters) out[g.id] = fromDb.get(g.id) ?? g.options;
  for (const [gid, list] of fromDb) out[gid] ??= list;
  return out;
}

/** Filter groups with their admin-managed options merged in. */
export async function getPortfolioFilterGroups(): Promise<FilterGroup[]> {
  const options = await getPortfolioFilterOptions();
  return portfolioFilters.map((g) => ({ ...g, options: options[g.id] ?? [] }));
}

/** Admin-managed "사용분야" options — now a slice of the unified table. */
export async function getUseFields(): Promise<{ id: string; label: L }[]> {
  const options = await getPortfolioFilterOptions();
  return (options.useField ?? []).map((o) => ({ id: o.id, label: o.label }));
}

/**
 * Admin-managed quote-form lists (제품 카테고리 / 유입경로). Empty groups fall
 * back to `fallback` so the form works before migration 0026 runs.
 */
export async function getQuoteFormOptions(fallback: {
  category: L[];
  hearAbout: L[];
}): Promise<{ category: L[]; hearAbout: L[] }> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quote_form_option")
    .select("*")
    .order("sort", { ascending: true });

  const byGroup = new Map<string, L[]>();
  for (const r of data ?? []) {
    byGroup.set(r.group_id, [
      ...(byGroup.get(r.group_id) ?? []),
      { en: r.label_en, ko: r.label_kr },
    ]);
  }
  return {
    category: byGroup.get("category") ?? fallback.category,
    hearAbout: byGroup.get("hearAbout") ?? fallback.hearAbout,
  };
}

/** Same rows, keyed for the admin editor (needs ids). */
export async function getQuoteFormOptionRows(): Promise<
  { id: string; group_id: string; label_en: string; label_kr: string }[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quote_form_option")
    .select("*")
    .order("sort", { ascending: true });
  return (data ?? []).map((r) => ({
    id: r.id,
    group_id: r.group_id,
    label_en: r.label_en,
    label_kr: r.label_kr,
  }));
}

export type QuoteOptionRow = {
  id: string;
  group_id: string;
  tab: string | null;
  label: L;
  desc: L;
  image?: string;
  kind: "option" | "recommend" | "custom" | "other";
};

/**
 * Quote-form options, grouped by section id. Owned by the form (see migration
 * 0027) rather than shared with the guide, so the wording and pictures here can
 * differ from /guide.
 */
export async function getQuoteOptions(): Promise<
  Record<string, QuoteOptionRow[]>
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quote_option")
    .select("*")
    .order("sort", { ascending: true });

  const out: Record<string, QuoteOptionRow[]> = {};
  for (const r of data ?? []) {
    (out[r.group_id] ??= []).push({
      id: r.id,
      group_id: r.group_id,
      tab: r.tab ?? null,
      label: { en: r.label_en, ko: r.label_kr },
      desc: { en: r.desc_en ?? "", ko: r.desc_kr ?? "" },
      image: r.image ?? undefined,
      kind: r.kind ?? "option",
    });
  }
  return out;
}

export type AboutGallerySlide = {
  id: string;
  image?: string;
  caption: L;
  tone: string;
};

/** Admin-managed "공장 및 장비 갤러리" slides. Falls back to the static list. */
export async function getAboutGallery(): Promise<AboutGallerySlide[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("about_gallery")
    .select("*")
    .order("sort", { ascending: true });
  if (!data || data.length === 0) {
    return gallerySlides.map((s, i) => ({
      id: `static-${i}`,
      image: s.image,
      caption: s.caption,
      tone: s.tone,
    }));
  }
  return data.map((r, i) => ({
    id: r.id,
    image: r.image ?? undefined,
    caption: { en: r.caption_en, ko: r.caption_kr },
    // Placeholder gradient for rows with no photo yet; cycles the original set.
    tone: gallerySlides[i % gallerySlides.length].tone,
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
  if (!data || data.length === 0) return faqItems; // dummy until real data
  return data.map((r) => ({
    id: r.id,
    category: r.category,
    q: { en: r.q_en, ko: r.q_kr },
    a: { en: r.a_en, ko: r.a_kr },
    image: r.image ?? undefined,
  }));
}

export async function getFaqCategories(): Promise<FaqCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faq_category")
    .select("*")
    .order("sort", { ascending: true });
  if (!data || data.length === 0) return faqCategories; // dummy until real data
  return data.map((r) => ({
    id: r.id,
    label: { en: r.label_en, ko: r.label_kr },
  }));
}

export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("glossary")
    .select("*")
    .order("sort", { ascending: true });
  if (!data || data.length === 0) return glossaryTerms; // dummy until real data
  return data.map((r) => ({
    id: r.id,
    category: r.category,
    term: { en: r.term_en, ko: r.term_kr },
    desc: { en: r.desc_en, ko: r.desc_kr },
    tags: (r.tags_en ?? []).map((en: string, i: number) => ({
      en,
      ko: r.tags_kr?.[i] ?? en,
    })),
    relatedPortfolioIds: r.related_portfolio_ids ?? [],
    image: r.images?.[0] ?? undefined,
    images: r.images ?? [],
    whenUsed:
      r.when_used_en || r.when_used_kr
        ? { en: r.when_used_en ?? "", ko: r.when_used_kr ?? "" }
        : undefined,
    recommendedFor:
      r.recommended_for_en || r.recommended_for_kr
        ? { en: r.recommended_for_en ?? "", ko: r.recommended_for_kr ?? "" }
        : undefined,
  }));
}

export async function getGlossaryCategories(): Promise<GlossaryCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("glossary_category")
    .select("*")
    .order("sort", { ascending: true });
  if (!data || data.length === 0) return glossaryCategories; // dummy until real data
  return data.map((r) => ({
    id: r.id,
    label: { en: r.label_en, ko: r.label_kr },
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
    body: { en: r.body_en ?? "", ko: r.body_kr ?? "" },
    date: r.published_at,
    tone: r.cover ? "" : pickTone(r.slug),
    cover: r.cover ?? undefined,
  }));
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_category")
    .select("*")
    .order("sort", { ascending: true });
  if (!data || data.length === 0) return blogCategories; // dummy until real data
  return data.map((r) => ({
    id: r.id,
    label: { en: r.label_en, ko: r.label_kr },
  }));
}

export async function getGuideSections(): Promise<GuideSection[]> {
  const supabase = await createClient();
  const [{ data: sections }, { data: items }] = await Promise.all([
    supabase.from("guide_section").select("*").order("sort", { ascending: true }),
    supabase.from("guide_item").select("*").order("sort", { ascending: true }),
  ]);
  if (!sections || sections.length === 0) return guideSections; // dummy until real data
  const staticById = new Map(guideSections.map((g) => [g.id, g]));
  return sections.map((s) => ({
    id: s.key || s.id,
    title: { en: s.title_en, ko: s.title_kr },
    // Admin-entered intro (desc_en/desc_kr columns) wins; otherwise fall back to
    // the built-in copy for the standard sections. Safe if the columns are absent.
    description:
      s.desc_en || s.desc_kr
        ? { en: s.desc_en ?? "", ko: s.desc_kr ?? "" }
        : staticById.get(s.key || s.id)?.description,
    items: (items ?? [])
      .filter((it) => it.section_id === s.id)
      .map((it) => ({
        title: { en: it.title_en, ko: it.title_kr },
        subtitle: it.subtitle || undefined,
        desc: { en: it.desc_en, ko: it.desc_kr },
        tip: it.tip_en || it.tip_kr ? { en: it.tip_en, ko: it.tip_kr } : undefined,
        tone: pickTone(it.title_en || s.id),
        image: it.images?.[0] ?? undefined,
      })),
  }));
}

export type Activity = { text: string; at: string; img: string };

/** Combined recent-activity feed (new inquiries + content added/updated). */
export async function getRecentActivity(perTable = 5): Promise<Activity[]> {
  const supabase = await createClient();
  const clip = (s: string, n = 22) => {
    const v = (s || "").trim();
    return v.length > n ? `${v.slice(0, n)}…` : v;
  };

  async function recentContent(
    table: string,
    idCol: string,
    label: (id: string, edited: boolean) => string,
    img: string,
  ): Promise<Activity[]> {
    type Res = { data: Record<string, string>[] | null; error: unknown };
    let res = (await supabase
      .from(table)
      .select(`${idCol}, created_at, updated_at`)
      .order("updated_at", { ascending: false })
      .limit(perTable)) as unknown as Res;
    const hasUpdated = !res.error;
    if (!hasUpdated) {
      res = (await supabase
        .from(table)
        .select(`${idCol}, created_at`)
        .order("created_at", { ascending: false })
        .limit(perTable)) as unknown as Res;
    }
    return (res.data ?? []).map((r) => {
      const at = (hasUpdated && r.updated_at) || r.created_at;
      const edited =
        hasUpdated &&
        !!r.updated_at &&
        new Date(r.updated_at).getTime() - new Date(r.created_at).getTime() > 2000;
      return { text: label(r[idCol], edited), at, img };
    });
  }

  const [recentInq, pf, bl, fq, gl] = await Promise.all([
    supabase
      .from("inquiry")
      .select("company, created_at")
      .order("created_at", { ascending: false })
      .limit(perTable),
    recentContent("portfolio", "item_no", (id, e) => `포트폴리오 항목 ${id} ${e ? "업데이트됨" : "등록됨"}`, "/icons/admin-stat-box.png"),
    recentContent("blog", "title_kr", (id, e) => `블로그 글 「${clip(id)}」 ${e ? "업데이트됨" : "등록됨"}`, "/icons/admin-stat-blog.png"),
    recentContent("faq", "q_kr", (id, e) => `FAQ 「${clip(id)}」 ${e ? "업데이트됨" : "등록됨"}`, "/icons/admin-stat-faq.png"),
    recentContent("glossary", "term_kr", (id, e) => `용어 「${clip(id)}」 ${e ? "업데이트됨" : "등록됨"}`, "/icons/admin-stat-box.png"),
  ]);

  return [
    ...((recentInq.data ?? []).map((r) => ({
      text: `${r.company || "고객"}에서 새로운 문의`,
      at: r.created_at as string,
      img: "/icons/admin-stat-mail.png",
    })) as Activity[]),
    ...pf,
    ...bl,
    ...fq,
    ...gl,
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

export type SiteSettings = {
  siteName: string;
  companyEn: string;
  companyKo: string;
  ceoEn: string;
  ceoKo: string;
  email: string;
  phone: string;
  kakaoUrl: string;
  bizNo: string;
  addressEn: string;
  addressKo: string;
  instagram: string;
  blogUrl: string;
  homeHero: string[];
  homeFeatured: string[];
  /** 거래처 logo wall, one composed image. Empty = fall back to the grid. */
  clientsImage: string;
  clientsImageMobile: string;
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
    kakaoUrl: data.kakao_url ?? "",
    bizNo: data.biz_no,
    addressEn: data.address_en,
    addressKo: data.address_kr,
    instagram: data.instagram,
    blogUrl: data.blog_url,
    // Home management (optional; safe if the columns don't exist yet).
    homeHero: Array.isArray(data.home_hero) ? data.home_hero : [],
    homeFeatured: Array.isArray(data.home_featured) ? data.home_featured : [],
    clientsImage: data.clients_image ?? "",
    clientsImageMobile: data.clients_image_mobile ?? "",
  };
}

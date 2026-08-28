"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: boolean; error?: string };

async function db() {
  return await createClient();
}

function revalidateAll(paths: string[]) {
  for (const p of paths) revalidatePath(p);
}

/**
 * Guide sections/items are not just the /guide page — they define the taxonomy
 * that `getGuideTaxonomy()` feeds to the portfolio (category labels on cards and
 * detail pages) and to the quote form's option groups. So a guide edit has to
 * invalidate every surface that reads that taxonomy, not only /guide.
 */
function revalidateGuide() {
  revalidateAll([
    "/guide",
    "/portfolio",
    "/",
    "/quote",
    "/admin/guide",
    "/admin/portfolio",
    "/admin/inquiries",
  ]);
  // Every portfolio detail page renders taxonomy labels — invalidate the whole
  // route rather than guessing ids.
  revalidatePath("/portfolio/[id]", "page");
}

// ---------------- Portfolio ----------------
export async function savePortfolio(input: Record<string, unknown>): Promise<Result> {
  const supabase = await db();
  const id = input.id as string | undefined;
  // The admin manages one ordered image list; the first entry doubles as the
  // card/list thumbnail so legacy `thumbnail` consumers keep working.
  const images = Array.isArray(input.images)
    ? (input.images as unknown[]).filter(
        (u): u is string => typeof u === "string" && u.length > 0,
      )
    : [];
  const row = {
    item_no: input.item_no,
    name_en: input.name_en,
    name_kr: input.name_kr,
    hover_en: input.hover_en ?? "",
    hover_kr: input.hover_kr ?? "",
    use_field: input.use_field || null,
    material: input.material || null,
    package_type: input.package_type || null,
    package_form: input.package_form || null,
    printing: input.printing ?? [],
    coating_en: input.coating_en ?? "",
    coating_kr: input.coating_kr ?? "",
    finishing_en: input.finishing_en ?? "",
    finishing_kr: input.finishing_kr ?? "",
    dim_l: input.dim_l ?? null,
    dim_w: input.dim_w ?? null,
    dim_h: input.dim_h ?? null,
    thumbnail: images[0] ?? input.thumbnail ?? null,
    images,
    categories: input.categories ?? {},
  };
  const { error } = id
    ? await supabase.from("portfolio").update(row).eq("id", id)
    : await supabase.from("portfolio").insert(row);
  if (error) return { ok: false, error: error.message };
  revalidateAll([
    "/portfolio",
    "/",
    "/admin",
    "/admin/portfolio",
    // Detail route is reachable by both id and 품번.
    ...(id ? [`/portfolio/${id}`] : []),
    ...(input.item_no ? [`/portfolio/${input.item_no as string}`] : []),
  ]);
  return { ok: true };
}

export async function setPortfolioSort(
  updates: { id: string; sort: number }[],
): Promise<Result> {
  const supabase = await db();
  for (const u of updates) {
    const { error } = await supabase
      .from("portfolio")
      .update({ sort: u.sort })
      .eq("id", u.id);
    if (error) return { ok: false, error: error.message };
  }
  revalidateAll(["/portfolio", "/", "/admin", "/admin/portfolio"]);
  return { ok: true };
}

export async function deletePortfolio(id: string): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("portfolio").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/portfolio", "/", "/admin", "/admin/portfolio"]);
  return { ok: true };
}

export async function setPortfolioHidden(
  id: string,
  hidden: boolean,
): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase
    .from("portfolio")
    .update({ hidden })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/portfolio", "/", "/admin", "/admin/portfolio"]);
  return { ok: true };
}

// ---------------- Use Field (사용분야) ----------------
/** Every surface that renders a filter label. */
function revalidateFilters() {
  revalidateAll(["/portfolio", "/", "/quote", "/admin", "/admin/portfolio"]);
  revalidatePath("/portfolio/[id]", "page");
}

export async function saveFilterOption(
  input: Record<string, unknown>,
): Promise<Result> {
  const supabase = await db();
  const groupId = input.group_id as string;
  if (!groupId) return { ok: false, error: "group_id 없음" };
  const row = {
    // Slug ids are what portfolio rows store, so a new option gets a stable
    // random one rather than something derived from an editable label.
    id: (input.id as string) || crypto.randomUUID(),
    group_id: groupId,
    label_en: input.label_en ?? "",
    label_kr: input.label_kr ?? "",
    image: (input.image as string) || null,
    sort: input.sort ?? 0,
  };
  const { error } = await supabase
    .from("portfolio_filter_option")
    .upsert(row, { onConflict: "group_id,id" });
  if (error) return { ok: false, error: error.message };
  revalidateFilters();
  return { ok: true };
}

export async function deleteFilterOption(
  groupId: string,
  id: string,
): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase
    .from("portfolio_filter_option")
    .delete()
    .eq("group_id", groupId)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateFilters();
  return { ok: true };
}

/** Back-compat wrapper — the 사용분야 quick-add inside the portfolio modal. */
export async function saveUseField(input: Record<string, unknown>): Promise<Result> {
  return saveFilterOption({ ...input, group_id: "useField" });
}

export async function deleteUseField(id: string): Promise<Result> {
  return deleteFilterOption("useField", id);
}

// ---------------- Quote form option lists ----------------
export async function saveQuoteFormOption(
  input: Record<string, unknown>,
): Promise<Result> {
  const supabase = await db();
  const groupId = input.group_id as string;
  if (!groupId) return { ok: false, error: "group_id 없음" };
  const { error } = await supabase.from("quote_form_option").upsert(
    {
      id: (input.id as string) || crypto.randomUUID(),
      group_id: groupId,
      label_en: input.label_en ?? "",
      label_kr: input.label_kr ?? "",
      sort: input.sort ?? 0,
    },
    { onConflict: "group_id,id" },
  );
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/quote", "/admin/quote"]);
  return { ok: true };
}

export async function deleteQuoteFormOption(
  groupId: string,
  id: string,
): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase
    .from("quote_form_option")
    .delete()
    .eq("group_id", groupId)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/quote", "/admin/quote"]);
  return { ok: true };
}

// ---------------- Quote form: selectable options ----------------
export async function saveQuoteOption(
  input: Record<string, unknown>,
): Promise<Result> {
  const supabase = await db();
  const groupId = input.group_id as string;
  if (!groupId) return { ok: false, error: "group_id 없음" };
  const { error } = await supabase.from("quote_option").upsert(
    {
      id: (input.id as string) || crypto.randomUUID(),
      group_id: groupId,
      tab: (input.tab as string) || null,
      label_en: input.label_en ?? "",
      label_kr: input.label_kr ?? "",
      desc_en: input.desc_en ?? "",
      desc_kr: input.desc_kr ?? "",
      image: (input.image as string) || null,
      kind: (input.kind as string) || "option",
      sort: input.sort ?? 0,
    },
    { onConflict: "group_id,id" },
  );
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/quote", "/admin/quote"]);
  return { ok: true };
}

export async function deleteQuoteOption(
  groupId: string,
  id: string,
): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase
    .from("quote_option")
    .delete()
    .eq("group_id", groupId)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/quote", "/admin/quote"]);
  return { ok: true };
}

// ---------------- About: factory & equipment gallery ----------------
export async function saveAboutGallery(input: Record<string, unknown>): Promise<Result> {
  const supabase = await db();
  const id = (input.id as string) || crypto.randomUUID();
  const row = {
    id,
    image: (input.image as string) || null,
    caption_en: input.caption_en ?? "",
    caption_kr: input.caption_kr ?? "",
    sort: input.sort ?? 0,
  };
  const { error } = await supabase
    .from("about_gallery")
    .upsert(row, { onConflict: "id" });
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/about", "/admin/about"]);
  return { ok: true };
}

export async function deleteAboutGallery(id: string): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("about_gallery").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/about", "/admin/about"]);
  return { ok: true };
}

/** Persist the whole gallery in one go — used by the drag-free ↑/↓ reordering. */
export async function saveAboutGalleryOrder(
  ids: string[],
): Promise<Result> {
  const supabase = await db();
  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase
      .from("about_gallery")
      .update({ sort: i + 1 })
      .eq("id", ids[i]);
    if (error) return { ok: false, error: error.message };
  }
  revalidateAll(["/about", "/admin/about"]);
  return { ok: true };
}

// ---------------- FAQ ----------------
export async function saveFaq(input: Record<string, unknown>): Promise<Result> {
  const supabase = await db();
  const id = input.id as string | undefined;
  const row = {
    category: input.category,
    q_en: input.q_en,
    q_kr: input.q_kr,
    a_en: input.a_en,
    a_kr: input.a_kr,
    image: input.image || null,
  };
  const { error } = id
    ? await supabase.from("faq").update(row).eq("id", id)
    : await supabase.from("faq").insert(row);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/faq", "/admin", "/admin/faq"]);
  return { ok: true };
}

export async function deleteFaq(id: string): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("faq").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/faq", "/admin", "/admin/faq"]);
  return { ok: true };
}

export async function saveFaqCategory(input: Record<string, unknown>): Promise<Result> {
  const supabase = await db();
  const id = (input.id as string) || crypto.randomUUID();
  const row = {
    id,
    label_en: input.label_en ?? "",
    label_kr: input.label_kr ?? "",
    sort: input.sort ?? 0,
  };
  const { error } = await supabase
    .from("faq_category")
    .upsert(row, { onConflict: "id" });
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/faq", "/admin", "/admin/faq"]);
  return { ok: true };
}

export async function deleteFaqCategory(id: string): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("faq_category").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/faq", "/admin", "/admin/faq"]);
  return { ok: true };
}

// ---------------- Glossary ----------------
export async function saveGlossary(input: Record<string, unknown>): Promise<Result> {
  const supabase = await db();
  const id = input.id as string | undefined;
  const row = {
    category: input.category,
    term_en: input.term_en,
    term_kr: input.term_kr,
    desc_en: input.desc_en,
    desc_kr: input.desc_kr,
    tags_en: input.tags_en ?? [],
    tags_kr: input.tags_kr ?? [],
    images: input.images ?? [],
    when_used_en: input.when_used_en ?? "",
    when_used_kr: input.when_used_kr ?? "",
    recommended_for_en: input.recommended_for_en ?? "",
    recommended_for_kr: input.recommended_for_kr ?? "",
  };
  const { error } = id
    ? await supabase.from("glossary").update(row).eq("id", id)
    : await supabase.from("glossary").insert(row);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/glossary", "/admin", "/admin/glossary"]);
  return { ok: true };
}

export async function deleteGlossary(id: string): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("glossary").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/glossary", "/admin", "/admin/glossary"]);
  return { ok: true };
}

export async function saveGlossaryCategory(input: Record<string, unknown>): Promise<Result> {
  const supabase = await db();
  const id = (input.id as string) || crypto.randomUUID();
  const row = {
    id,
    label_en: input.label_en ?? "",
    label_kr: input.label_kr ?? "",
    sort: input.sort ?? 0,
  };
  const { error } = await supabase
    .from("glossary_category")
    .upsert(row, { onConflict: "id" });
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/glossary", "/admin", "/admin/glossary"]);
  return { ok: true };
}

export async function deleteGlossaryCategory(id: string): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("glossary_category").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/glossary", "/admin", "/admin/glossary"]);
  return { ok: true };
}

// ---------------- Blog ----------------
export async function saveBlog(input: Record<string, unknown>): Promise<Result> {
  const supabase = await db();
  const id = input.id as string | undefined;
  const row = {
    slug: input.slug,
    category: input.category,
    title_en: input.title_en,
    title_kr: input.title_kr,
    summary_en: input.summary_en ?? "",
    summary_kr: input.summary_kr ?? "",
    body_en: input.body_en ?? "",
    body_kr: input.body_kr ?? "",
    cover: input.cover || null,
    published_at: input.published_at,
  };
  const { error } = id
    ? await supabase.from("blog").update(row).eq("id", id)
    : await supabase.from("blog").insert(row);
  if (error) return { ok: false, error: error.message };
  const paths = ["/blog", "/admin", "/admin/blog"];
  if (input.slug) paths.push(`/blog/${input.slug}`);
  revalidateAll(paths);
  return { ok: true };
}

export async function deleteBlog(id: string): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("blog").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/blog", "/admin", "/admin/blog"]);
  return { ok: true };
}

export async function saveBlogCategory(input: Record<string, unknown>): Promise<Result> {
  const supabase = await db();
  const id = (input.id as string) || crypto.randomUUID();
  const row = {
    id,
    label_en: input.label_en ?? "",
    label_kr: input.label_kr ?? "",
    sort: input.sort ?? 0,
  };
  const { error } = await supabase
    .from("blog_category")
    .upsert(row, { onConflict: "id" });
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/blog", "/admin", "/admin/blog"]);
  return { ok: true };
}

export async function deleteBlogCategory(id: string): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("blog_category").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/blog", "/admin", "/admin/blog"]);
  return { ok: true };
}

// ---------------- Guide ----------------
export async function saveGuideSection(input: Record<string, unknown>): Promise<Result> {
  const supabase = await db();
  const id = (input.id as string) || crypto.randomUUID();
  const row = {
    id,
    key: input.key,
    title_en: input.title_en,
    title_kr: input.title_kr,
    sort: input.sort ?? 0,
  };
  const { error } = await supabase
    .from("guide_section")
    .upsert(row, { onConflict: "id" });
  if (error) return { ok: false, error: error.message };
  // Best-effort: save the optional section intro. Ignored if the desc_en/desc_kr
  // columns haven't been added to guide_section yet (see migration note).
  if (input.desc_en !== undefined || input.desc_kr !== undefined) {
    await supabase
      .from("guide_section")
      .update({ desc_en: input.desc_en ?? "", desc_kr: input.desc_kr ?? "" })
      .eq("id", id);
  }
  revalidateGuide();
  return { ok: true };
}

export async function deleteGuideSection(id: string): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("guide_section").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateGuide();
  return { ok: true };
}

export async function saveGuideItem(input: Record<string, unknown>): Promise<Result> {
  const supabase = await db();
  const id = input.id as string | undefined;
  const row = {
    section_id: input.section_id,
    title_en: input.title_en,
    title_kr: input.title_kr,
    subtitle: input.subtitle ?? "",
    desc_en: input.desc_en,
    desc_kr: input.desc_kr,
    tip_en: input.tip_en ?? "",
    tip_kr: input.tip_kr ?? "",
    images: input.images ?? [],
  };
  const { error } = id
    ? await supabase.from("guide_item").update(row).eq("id", id)
    : await supabase.from("guide_item").insert(row);
  if (error) return { ok: false, error: error.message };
  revalidateGuide();
  return { ok: true };
}

export async function deleteGuideItem(id: string): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("guide_item").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateGuide();
  return { ok: true };
}

// ---------------- Site settings ----------------
export async function saveSettings(input: Record<string, unknown>): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("site_settings").upsert(
    {
      id: 1,
      site_name: input.site_name,
      company_en: input.company_en,
      company_kr: input.company_kr,
      ceo_en: input.ceo_en,
      ceo_kr: input.ceo_kr,
      email: input.email,
      phone: input.phone,
      kakao_url: input.kakao_url,
      biz_no: input.biz_no,
      address_en: input.address_en,
      address_kr: input.address_kr,
      instagram: input.instagram,
      blog_url: input.blog_url,
      clients_image: input.clients_image,
      clients_image_mobile: input.clients_image_mobile,
      default_lang: input.default_lang || "en",
    },
    { onConflict: "id" },
  );
  if (error) return { ok: false, error: error.message };
  // Footer lives in the root layout — revalidate the whole app so every page
  // (not just "/") picks up the new contact/company info.
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------------- Home (main page) ----------------
export async function saveHomeConfig(input: {
  homeHero: string[];
  homeFeatured: string[];
}): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase
    .from("site_settings")
    .update({ home_hero: input.homeHero, home_featured: input.homeFeatured })
    .eq("id", 1);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/", "/admin/home"]);
  return { ok: true };
}

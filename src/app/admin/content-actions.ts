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

// ---------------- Portfolio ----------------
export async function savePortfolio(input: Record<string, unknown>): Promise<Result> {
  const supabase = await db();
  const id = input.id as string | undefined;
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
    thumbnail: input.thumbnail || null,
  };
  const { error } = id
    ? await supabase.from("portfolio").update(row).eq("id", id)
    : await supabase.from("portfolio").insert(row);
  if (error) return { ok: false, error: error.message };
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
  revalidateAll(["/blog", "/admin", "/admin/blog"]);
  return { ok: true };
}

export async function deleteBlog(id: string): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("blog").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/blog", "/admin", "/admin/blog"]);
  return { ok: true };
}

// ---------------- Guide ----------------
export async function saveGuideSection(input: Record<string, unknown>): Promise<Result> {
  const supabase = await db();
  const id = input.id as string | undefined;
  const row = {
    key: input.key,
    title_en: input.title_en,
    title_kr: input.title_kr,
    sort: input.sort ?? 0,
  };
  const { error } = id
    ? await supabase.from("guide_section").update(row).eq("id", id)
    : await supabase.from("guide_section").insert(row);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/guide", "/admin/guide"]);
  return { ok: true };
}

export async function deleteGuideSection(id: string): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("guide_section").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/guide", "/admin/guide"]);
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
  };
  const { error } = id
    ? await supabase.from("guide_item").update(row).eq("id", id)
    : await supabase.from("guide_item").insert(row);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/guide", "/admin/guide"]);
  return { ok: true };
}

export async function deleteGuideItem(id: string): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase.from("guide_item").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/guide", "/admin/guide"]);
  return { ok: true };
}

// ---------------- Site settings ----------------
export async function saveSettings(input: Record<string, unknown>): Promise<Result> {
  const supabase = await db();
  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name: input.site_name,
      company_en: input.company_en,
      company_kr: input.company_kr,
      ceo_en: input.ceo_en,
      ceo_kr: input.ceo_kr,
      email: input.email,
      phone: input.phone,
      whatsapp: input.whatsapp,
      biz_no: input.biz_no,
      address_en: input.address_en,
      address_kr: input.address_kr,
      instagram: input.instagram,
      blog_url: input.blog_url,
    })
    .eq("id", 1);
  if (error) return { ok: false, error: error.message };
  revalidateAll(["/", "/admin", "/admin/settings"]);
  return { ok: true };
}

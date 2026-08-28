"use server";

import { createClient } from "@/lib/supabase/server";
import { notifyInquiry } from "@/lib/notify-inquiry";
import type { InquiryPayload, InquiryResult } from "@/lib/data/inquiry";

/**
 * Receive a quote inquiry → persist to Supabase `inquiry` table.
 * (Anon insert is allowed by RLS.) A notification email goes out afterwards
 * when the Resend env vars are set — see notifyInquiry.
 */
export async function submitInquiry(
  payload: InquiryPayload,
): Promise<InquiryResult> {
  const required = [
    payload.company,
    payload.contactName,
    payload.email,
    payload.phone,
  ];
  if (required.some((v) => !v?.trim())) {
    return { ok: false, error: "required" };
  }

  const supabase = await createClient();
  const row: Record<string, unknown> = {
    type: payload.type,
    company: payload.company,
    contact_name: payload.contactName,
    email: payload.email,
    phone: payload.phone,
    city: payload.city ?? null,
    country: payload.country ?? null,
    category: payload.category ?? null,
    hear_about: payload.hearAbout && payload.hearAbout.length ? payload.hearAbout : null,
    product: payload.product || "",
    quantity: payload.quantity || "",
    source_item_no: payload.sourceItemNo ?? null,
    package_type: payload.packageType ?? null,
    box_structure: payload.boxStructure ?? null,
    material: payload.material ?? null,
    printing: payload.printing ?? null,
    finishing: payload.finishing ?? null,
    size_w: payload.size?.w ?? null,
    size_d: payload.size?.d ?? null,
    size_h: payload.size?.h ?? null,
    design_link: payload.designLink ?? null,
    budget: payload.budget ?? null,
    lead_time: payload.leadTime ?? null,
    message: payload.message ?? null,
    locale: payload.locale,
  };
  // Only set `files` when present, so submissions still work before the
  // 0003 migration adds the column (uploads need that migration anyway).
  if (payload.files && payload.files.length) row.files = payload.files;
  // Same guard for design_needed — added by migration 0018.
  if (payload.designNeeded) row.design_needed = payload.designNeeded;
  // Added by migration 0033; guarded so submissions still work before it runs.
  if (payload.spec && Object.keys(payload.spec).length) row.spec = payload.spec;
  if (payload.privacyAgreed !== undefined) row.privacy_agreed = payload.privacyAgreed;
  if (payload.promoAgreed !== undefined) row.promo_agreed = payload.promoAgreed;
  if (payload.priority) row.priority = payload.priority;
  if (payload.containsProduct) row.contains_product = payload.containsProduct;

  const { error } = await supabase.from("inquiry").insert(row);

  if (error) {
    console.error("[inquiry] insert failed:", error.message);
    return { ok: false, error: "generic" };
  }

  // The enquiry is saved; a mail problem must not fail the submission.
  await notifyInquiry(payload);
  return { ok: true };
}

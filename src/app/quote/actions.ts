"use server";

import { createClient } from "@/lib/supabase/server";
import type { InquiryPayload, InquiryResult } from "@/lib/data/inquiry";

/**
 * Receive a quote inquiry → persist to Supabase `inquiry` table.
 * (Anon insert is allowed by RLS.) Email notification via Resend is added in
 * the P4 email step once RESEND_API_KEY is configured.
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
  const { error } = await supabase.from("inquiry").insert({
    type: payload.type,
    company: payload.company,
    contact_name: payload.contactName,
    email: payload.email,
    phone: payload.phone,
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
  });

  if (error) {
    console.error("[inquiry] insert failed:", error.message);
    return { ok: false, error: "generic" };
  }

  // TODO (P4 email): notify the team via Resend when RESEND_API_KEY is set.
  return { ok: true };
}

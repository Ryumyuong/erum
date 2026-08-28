import type { InquiryPayload } from "@/lib/data/inquiry";
import { siteUrl } from "@/lib/seo";

/**
 * Emails the team when a quote inquiry arrives.
 *
 * Best-effort by design: the enquiry is already saved by the time this runs, so
 * a mail failure is logged and swallowed rather than shown to the customer.
 * Configure with RESEND_API_KEY, INQUIRY_NOTIFY_EMAIL and INQUIRY_FROM_EMAIL —
 * with none of them set, this quietly does nothing.
 */
export async function notifyInquiry(payload: InquiryPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_NOTIFY_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL;
  if (!apiKey || !to || !from) return;

  const kind = payload.type === "standard" ? "표준 견적문의" : "추천 견적문의";
  const rows: [string, string | undefined][] = [
    ["회사명", payload.company],
    ["담당자", payload.contactName],
    ["이메일", payload.email],
    ["연락처", payload.phone],
    ["도시/국가", [payload.city, payload.country].filter(Boolean).join(" ")],
    ["수량", payload.quantity],
    ["담을 제품", payload.containsProduct],
    ["예산", payload.budget],
    ["희망 납기", payload.leadTime],
  ];
  // The full spec is long and already formatted in the admin — link there
  // instead of duplicating it, so the mail stays scannable on a phone.
  const table = rows
    .filter(([, v]) => v && v.trim())
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6A7282;white-space:nowrap">${esc(k)}</td>` +
        `<td style="padding:4px 0;color:#101828">${esc(v!)}</td></tr>`,
    )
    .join("");

  const html =
    `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.6">` +
    `<h2 style="margin:0 0 12px;font-size:18px">새 ${esc(kind)}가 접수되었습니다</h2>` +
    `<table style="border-collapse:collapse;margin-bottom:16px">${table}</table>` +
    (payload.message?.trim()
      ? `<p style="margin:0 0 16px;white-space:pre-line;color:#364153">${esc(payload.message)}</p>`
      : "") +
    `<a href="${siteUrl}/admin/inquiries" style="display:inline-block;background:#FD7304;color:#fff;` +
    `padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">관리자에서 전체 내용 보기</a>` +
    `</div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        // Replying goes straight to the customer.
        reply_to: payload.email,
        subject: `[BOXDLE] ${kind} — ${payload.company || payload.contactName}`,
        html,
      }),
    });
    if (!res.ok) {
      console.error("[inquiry] notify failed:", res.status, await res.text());
    }
  } catch (e) {
    console.error("[inquiry] notify error:", e);
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

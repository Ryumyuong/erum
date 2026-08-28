export type InquiryType = "standard" | "recommended";

export type InquiryPayload = {
  type: InquiryType;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  city?: string;
  country?: string;
  category?: string;
  hearAbout?: string[];
  designNeeded?: "yes" | "no";
  /** Every option answer: { group: { id, label, note } }. */
  spec?: Record<string, { id: string; label: string; note?: string }>;
  privacyAgreed?: boolean;
  promoAgreed?: boolean;
  priority?: string;
  containsProduct?: string;
  product: string;
  quantity: string;
  sourceItemNo?: string;
  packageType?: string;
  boxStructure?: string;
  material?: string;
  printing?: string;
  finishing?: string;
  size?: { w: string; d: string; h: string };
  designLink?: string;
  budget?: string;
  leadTime?: string;
  message?: string;
  files?: string[];
  locale: string;
};

export type InquiryResult =
  | { ok: true }
  | { ok: false; error: "required" | "generic" };

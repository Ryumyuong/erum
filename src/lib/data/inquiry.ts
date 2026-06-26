export type InquiryType = "standard" | "recommended";

export type InquiryPayload = {
  type: InquiryType;
  company: string;
  contactName: string;
  email: string;
  phone: string;
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
  locale: string;
};

export type InquiryResult =
  | { ok: true }
  | { ok: false; error: "required" | "generic" };

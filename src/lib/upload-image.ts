import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/** Longest edge kept when an upload is downscaled. */
const MAX_EDGE = 2400;
/** JPEG/WebP re-encode quality. */
const QUALITY = 0.85;

/**
 * Shrink oversized photos in the browser before they are uploaded.
 *
 * Camera originals (e.g. 7360×4912, tens of MB) blow past Supabase's per-file
 * storage limit, and nothing on the site renders wider than ~1600 CSS px, so
 * the extra pixels only cost upload time and page weight.
 *
 * Format is preserved rather than normalised to JPEG: PNG logos and filter
 * icons rely on transparency, which a JPEG re-encode would flatten to black.
 * GIF (animation) and SVG (vector) are passed through untouched.
 */
async function downscale(file: File): Promise<File> {
  const passthrough = ["image/gif", "image/svg+xml"];
  if (!file.type.startsWith("image/") || passthrough.includes(file.type)) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1) {
      bitmap.close();
      return file; // already within bounds — don't re-encode and lose quality
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const type = file.type === "image/png" ? "image/png" : file.type;
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, type, QUALITY),
    );
    // If the re-encode didn't actually help, keep the original.
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name, { type: blob.type, lastModified: Date.now() });
  } catch {
    return file; // unsupported/corrupt image — let the server reject it
  }
}

/**
 * Upload one image to the Supabase Storage "media" bucket and return its public
 * URL. Shared by the admin ImageUpload dropzone and the blog editor's inline
 * image button so both write to the same place with the same naming.
 */
export async function uploadImage(
  file: File,
  folder = "misc",
  client?: SupabaseClient,
): Promise<string> {
  const supabase = client ?? createClient();
  const upload = await downscale(file);
  const ext = upload.name.split(".").pop() || "png";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("media")
    .upload(path, upload, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

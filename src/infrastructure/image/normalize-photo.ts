import { heicTo, isHeic } from "heic-to";

export async function normalizePhoto(file: File): Promise<{ blob: Blob; mimeType: string }> {
  const isHeicFile =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file.name) ||
    (await isHeic(file));

  if (!isHeicFile) {
    return { blob: file, mimeType: file.type || "image/jpeg" };
  }

  const blob = (await heicTo({ blob: file, type: "image/jpeg", quality: 0.9 })) as Blob;
  return { blob, mimeType: "image/jpeg" };
}

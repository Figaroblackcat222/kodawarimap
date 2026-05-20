import type { PinRepository } from "@application/ports/pin-repository";
import type { Pin, PinExif, PinReaction } from "@domain/entities/pin";

export async function updatePin(
  repo: PinRepository,
  pin: Pin,
  changes: {
    title?: string;
    categoryId?: string;
    comment?: string;
    event?: string;
    location?: string;
    url?: string;
    videoUrl?: string;
    exif?: PinExif;
    allowPhotoDownload?: boolean;
    reaction?: PinReaction;
  }
): Promise<Pin> {
  const updated: Pin = { ...pin, ...changes };
  await repo.save(updated);
  return updated;
}

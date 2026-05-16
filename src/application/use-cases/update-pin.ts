import type { PinRepository } from "@application/ports/pin-repository";
import type { Pin, PinExif } from "@domain/entities/pin";

export async function updatePin(
  repo: PinRepository,
  pin: Pin,
  changes: {
    title?: string;
    categoryId?: string;
    comment?: string;
    url?: string;
    videoUrl?: string;
    exif?: PinExif;
  }
): Promise<Pin> {
  const updated: Pin = { ...pin, ...changes };
  await repo.save(updated);
  return updated;
}

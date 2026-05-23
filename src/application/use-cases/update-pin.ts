import type { PinRepository } from "@application/ports/pin-repository";
import type { Pin, PinExif, PinReaction, ShoppingItem } from "@domain/entities/pin";
import { mergeHlc, nextHlc } from "@domain/value-objects/hlc";

export async function updatePin(
  repo: PinRepository,
  pin: Pin,
  changes: {
    title?: string;
    categoryId?: string;
    comment?: string;
    tag?: string;
    location?: string;
    url?: string;
    videoUrl?: string;
    exif?: PinExif;
    allowPhotoDownload?: boolean;
    reaction?: PinReaction;
    thumbnailPhotoId?: string;
    shoppingItems?: ShoppingItem[];
  }
): Promise<Pin> {
  const updatedHlc = mergeHlc(pin.hlc, nextHlc(pin.hlc));
  const updated: Pin = { ...pin, ...changes, hlc: updatedHlc };
  await repo.save(updated);
  return updated;
}

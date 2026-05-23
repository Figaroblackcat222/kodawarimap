import type { PinRepository } from "@application/ports/pin-repository";
import { createPin, type Coordinates, type Pin, type PinExif } from "@domain/entities/pin";
import type { HLC } from "@domain/value-objects/hlc";

export async function addPin(
  repo: PinRepository,
  coordinates: Coordinates,
  title: string,
  hlc: HLC,
  categoryId?: string,
  exif?: PinExif
): Promise<Pin> {
  const pin = createPin(coordinates, title, hlc, categoryId, exif);
  await repo.save(pin);
  return pin;
}

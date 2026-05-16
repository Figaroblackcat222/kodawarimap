import type { PinRepository } from "@application/ports/pin-repository";
import { createPin, type Coordinates, type Pin, type PinExif } from "@domain/entities/pin";

export async function addPin(
  repo: PinRepository,
  coordinates: Coordinates,
  title: string,
  categoryId?: string,
  exif?: PinExif
): Promise<Pin> {
  const pin = createPin(coordinates, title, categoryId, exif);
  await repo.save(pin);
  return pin;
}

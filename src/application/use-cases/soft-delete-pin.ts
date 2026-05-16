import type { PinRepository } from "@application/ports/pin-repository";
import type { PinId } from "@domain/entities/pin";

export async function softDeletePin(repo: PinRepository, id: PinId): Promise<void> {
  await repo.softDelete(id);
}

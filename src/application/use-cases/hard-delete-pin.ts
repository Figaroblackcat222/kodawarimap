import type { PinRepository } from "@application/ports/pin-repository";
import type { PinId } from "@domain/entities/pin";

export async function hardDeletePin(repo: PinRepository, id: PinId): Promise<void> {
  await repo.hardDelete(id);
}

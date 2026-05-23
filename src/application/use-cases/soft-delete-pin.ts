import type { PinRepository } from "@application/ports/pin-repository";
import type { PinId } from "@domain/entities/pin";
import { createHlc } from "@domain/value-objects/hlc";

export async function softDeletePin(repo: PinRepository, id: PinId, nodeId: string): Promise<void> {
  const hlc = createHlc(nodeId);
  await repo.softDelete(id, hlc);
}

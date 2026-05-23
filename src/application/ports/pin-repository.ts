import type { Pin, PinId } from "@domain/entities/pin";
import type { HLC } from "@domain/value-objects/hlc";

export interface PinRepository {
  save(pin: Pin): Promise<void>;
  findAll(): Promise<Pin[]>;
  findDeleted(): Promise<Pin[]>;
  softDelete(id: PinId, hlc: HLC): Promise<void>;
  restore(id: PinId, hlc: HLC): Promise<void>;
  hardDelete(id: PinId): Promise<void>;
  purgeExpired(retentionDays?: number): Promise<void>;
  findModifiedSince(hlcPhysical: number, hlcLogical: number): Promise<Pin[]>;
}

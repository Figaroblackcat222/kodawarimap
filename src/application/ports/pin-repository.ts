import type { Pin, PinId } from "@domain/entities/pin";

export interface PinRepository {
  save(pin: Pin): Promise<void>;
  findAll(): Promise<Pin[]>;
  findDeleted(): Promise<Pin[]>;
  softDelete(id: PinId): Promise<void>;
  restore(id: PinId): Promise<void>;
  hardDelete(id: PinId): Promise<void>;
  purgeExpired(retentionDays?: number): Promise<void>;
}

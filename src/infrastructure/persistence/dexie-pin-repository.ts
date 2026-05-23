import type { PinRepository } from "@application/ports/pin-repository";
import type { Pin, PinId, PinReaction, ShoppingItem } from "@domain/entities/pin";
import { db, type PinRecord } from "./db";

function recordToPin(r: PinRecord): Pin {
  const hasExif =
    r.takenAt ||
    r.cameraMake ||
    r.cameraModel ||
    r.fNumber != null ||
    r.exposureTime != null ||
    r.focalLength != null ||
    r.iso != null;

  return {
    id: r.id,
    coordinates: { lng: r.lng, lat: r.lat },
    title: r.title,
    categoryId: r.categoryId,
    comment: r.comment,
    tag: r.tag,
    location: r.location,
    url: r.url,
    videoUrl: r.videoUrl,
    allowPhotoDownload: r.allowPhotoDownload,
    reaction: r.reaction as PinReaction | undefined,
    thumbnailPhotoId: r.thumbnailPhotoId,
    shoppingItems: r.shoppingItemsJson
      ? (JSON.parse(r.shoppingItemsJson) as ShoppingItem[])
      : undefined,
    exif: hasExif
      ? {
          takenAt: r.takenAt,
          takenAtEstimated: r.takenAtEstimated ? true : undefined,
          cameraMake: r.cameraMake,
          cameraModel: r.cameraModel,
          fNumber: r.fNumber,
          exposureTime: r.exposureTime,
          focalLength: r.focalLength,
          iso: r.iso,
        }
      : undefined,
    createdAt: r.createdAt,
    deletedAt: r.deletedAt,
  };
}

export const dexiePinRepository: PinRepository = {
  async save(pin: Pin): Promise<void> {
    await db.pins.put({
      id: pin.id,
      lng: pin.coordinates.lng,
      lat: pin.coordinates.lat,
      title: pin.title,
      categoryId: pin.categoryId,
      comment: pin.comment,
      tag: pin.tag,
      location: pin.location,
      url: pin.url,
      videoUrl: pin.videoUrl,
      allowPhotoDownload: pin.allowPhotoDownload,
      reaction: pin.reaction,
      thumbnailPhotoId: pin.thumbnailPhotoId,
      shoppingItemsJson:
        pin.shoppingItems && pin.shoppingItems.length > 0
          ? JSON.stringify(pin.shoppingItems)
          : undefined,
      takenAt: pin.exif?.takenAt,
      takenAtEstimated: pin.exif?.takenAtEstimated,
      cameraMake: pin.exif?.cameraMake,
      cameraModel: pin.exif?.cameraModel,
      fNumber: pin.exif?.fNumber,
      exposureTime: pin.exif?.exposureTime,
      focalLength: pin.exif?.focalLength,
      iso: pin.exif?.iso,
      createdAt: pin.createdAt,
      deletedAt: pin.deletedAt,
    });
  },

  async findAll(): Promise<Pin[]> {
    const records = await db.pins.orderBy("createdAt").toArray();
    return records.filter((r) => r.deletedAt == null).map(recordToPin);
  },

  async findDeleted(): Promise<Pin[]> {
    const records = await db.pins.orderBy("deletedAt").toArray();
    return records.filter((r) => r.deletedAt != null).map(recordToPin);
  },

  async softDelete(id: PinId): Promise<void> {
    await db.pins.update(id, { deletedAt: new Date() });
  },

  async restore(id: PinId): Promise<void> {
    await db.pins.update(id, { deletedAt: undefined });
  },

  async hardDelete(id: PinId): Promise<void> {
    await db.pins.delete(id);
  },

  async purgeExpired(retentionDays = 30): Promise<void> {
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    await db.pins.filter((r) => r.deletedAt != null && r.deletedAt < cutoff).delete();
  },
};

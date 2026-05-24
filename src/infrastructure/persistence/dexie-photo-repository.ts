import type { PhotoRepository } from "@application/ports/photo-repository";
import type { Photo, PhotoExif, PhotoFileInfo } from "@domain/entities/photo";
import type { HLC } from "@domain/value-objects/hlc";
import { createHlc } from "@domain/value-objects/hlc";
import type { PinId } from "@domain/entities/pin";
import { getNodeId } from "@infrastructure/sync/node-id";
import { db, type PhotoRecord } from "./db";

function recordToPhoto(r: PhotoRecord): Photo {
  const hasExif =
    r.exifTakenAt ||
    r.exifCameraMake ||
    r.exifCameraModel ||
    r.exifFNumber != null ||
    r.exifExposureTime != null ||
    r.exifFocalLength != null ||
    r.exifIso != null;
  const hasFileInfo =
    r.originalFileName || r.originalFileSize != null || r.originalLastModified != null;

  const hlc: HLC = {
    physical: r.hlcPhysical ?? (r.createdAt ? new Date(r.createdAt).getTime() : 0),
    logical: r.hlcLogical ?? 0,
    nodeId: r.hlcNodeId ?? "legacy",
  };

  return {
    id: r.id,
    pinId: r.pinId,
    blob: r.blob,
    mimeType: r.mimeType,
    createdAt: r.createdAt,
    comment: r.comment,
    shoppingItemId: r.shoppingItemId,
    hlc,
    syncedAt: r.syncedAt,
    exif: hasExif
      ? {
          takenAt: r.exifTakenAt,
          takenAtEstimated: r.exifTakenAtEstimated ? true : undefined,
          cameraMake: r.exifCameraMake,
          cameraModel: r.exifCameraModel,
          fNumber: r.exifFNumber,
          exposureTime: r.exifExposureTime,
          focalLength: r.exifFocalLength,
          iso: r.exifIso,
        }
      : undefined,
    fileInfo: hasFileInfo
      ? {
          originalFileName: r.originalFileName,
          originalFileSize: r.originalFileSize,
          originalLastModified: r.originalLastModified,
        }
      : undefined,
  };
}

export const dexiePhotoRepository: PhotoRepository = {
  async save(
    pinId: PinId,
    blob: Blob,
    mimeType: string,
    exif?: PhotoExif,
    fileInfo?: PhotoFileInfo
  ): Promise<Photo> {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const hlc = createHlc(getNodeId());
    await db.photos.put({
      id,
      pinId,
      blob,
      mimeType,
      createdAt,
      comment: undefined,
      exifTakenAt: exif?.takenAt,
      exifTakenAtEstimated: exif?.takenAtEstimated,
      exifCameraMake: exif?.cameraMake,
      exifCameraModel: exif?.cameraModel,
      exifFNumber: exif?.fNumber,
      exifExposureTime: exif?.exposureTime,
      exifFocalLength: exif?.focalLength,
      exifIso: exif?.iso,
      originalFileName: fileInfo?.originalFileName,
      originalFileSize: fileInfo?.originalFileSize,
      originalLastModified: fileInfo?.originalLastModified,
      hlcPhysical: hlc.physical,
      hlcLogical: hlc.logical,
      hlcNodeId: hlc.nodeId,
      syncSchemaVersion: 1,
    });
    return {
      id,
      pinId,
      blob,
      mimeType,
      createdAt,
      comment: undefined,
      exif,
      fileInfo,
      hlc,
    };
  },

  async saveForShoppingItem(
    pinId: PinId,
    shoppingItemId: string,
    blob: Blob,
    mimeType: string
  ): Promise<Photo> {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const hlc = createHlc(getNodeId());
    await db.photos.put({
      id,
      pinId,
      blob,
      mimeType,
      createdAt,
      shoppingItemId,
      hlcPhysical: hlc.physical,
      hlcLogical: hlc.logical,
      hlcNodeId: hlc.nodeId,
      syncSchemaVersion: 1,
    });
    return { id, pinId, blob, mimeType, createdAt, shoppingItemId, hlc };
  },

  async findByPinId(pinId: PinId): Promise<Photo[]> {
    const records = await db.photos.where("pinId").equals(pinId).sortBy("createdAt");
    return records.map(recordToPhoto);
  },

  async updateComment(id: string, comment: string | undefined): Promise<void> {
    await db.photos.update(id, { comment });
  },

  async updateExif(id: string, exif: PhotoExif): Promise<void> {
    await db.photos.update(id, {
      exifTakenAt: exif.takenAt,
      exifTakenAtEstimated: exif.takenAtEstimated,
      exifCameraMake: exif.cameraMake,
      exifCameraModel: exif.cameraModel,
      exifFNumber: exif.fNumber,
      exifExposureTime: exif.exposureTime,
      exifFocalLength: exif.focalLength,
      exifIso: exif.iso,
    });
  },

  async restore(photo: Photo): Promise<void> {
    await db.photos.put({
      id: photo.id,
      pinId: photo.pinId,
      blob: photo.blob,
      mimeType: photo.mimeType,
      createdAt: photo.createdAt,
      comment: photo.comment,
      shoppingItemId: photo.shoppingItemId,
      exifTakenAt: photo.exif?.takenAt,
      exifTakenAtEstimated: photo.exif?.takenAtEstimated,
      exifCameraMake: photo.exif?.cameraMake,
      exifCameraModel: photo.exif?.cameraModel,
      exifFNumber: photo.exif?.fNumber,
      exifExposureTime: photo.exif?.exposureTime,
      exifFocalLength: photo.exif?.focalLength,
      exifIso: photo.exif?.iso,
      originalFileName: photo.fileInfo?.originalFileName,
      originalFileSize: photo.fileInfo?.originalFileSize,
      originalLastModified: photo.fileInfo?.originalLastModified,
      hlcPhysical: photo.hlc.physical,
      hlcLogical: photo.hlc.logical,
      hlcNodeId: photo.hlc.nodeId,
      syncedAt: photo.syncedAt,
      syncSchemaVersion: 1,
    });
  },

  async delete(id: string): Promise<void> {
    await db.photos.delete(id);
  },

  async deleteByPinId(pinId: PinId): Promise<void> {
    await db.photos.where("pinId").equals(pinId).delete();
  },

  async findModifiedSince(hlcPhysical: number, hlcLogical: number): Promise<Photo[]> {
    const records = await db.photos
      .filter(
        (r) =>
          r.hlcPhysical > hlcPhysical ||
          (r.hlcPhysical === hlcPhysical && r.hlcLogical > hlcLogical)
      )
      .toArray();
    return records.map(recordToPhoto);
  },

  async markSynced(id: string, syncedAt: Date): Promise<void> {
    await db.photos.update(id, { syncedAt });
  },

  async findUnsyncedPhotos(): Promise<Photo[]> {
    const records = await db.photos.filter((r) => r.syncedAt === undefined).toArray();
    return records.map(recordToPhoto);
  },
};

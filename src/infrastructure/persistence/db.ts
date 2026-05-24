import Dexie, { type EntityTable } from "dexie";

interface PinRecord {
  id: string;
  lng: number;
  lat: number;
  title: string;
  categoryId?: string;
  comment?: string;
  tag?: string;
  location?: string;
  url?: string;
  videoUrl?: string;
  allowPhotoDownload?: boolean;
  takenAt?: Date;
  takenAtEstimated?: boolean;
  cameraMake?: string;
  cameraModel?: string;
  fNumber?: number;
  exposureTime?: number;
  focalLength?: number;
  iso?: number;
  createdAt: Date;
  reaction?: string;
  thumbnailPhotoId?: string;
  shoppingItemsJson?: string;
  deletedAt?: Date;
  // v12: HLC フィールド
  hlcPhysical: number;
  hlcLogical: number;
  hlcNodeId: string;
  syncSchemaVersion: number;
}

interface PhotoRecord {
  id: string;
  pinId: string;
  blob: Blob;
  mimeType: string;
  createdAt: Date;
  comment?: string;
  exifTakenAt?: Date;
  exifTakenAtEstimated?: boolean;
  exifCameraMake?: string;
  exifCameraModel?: string;
  exifFNumber?: number;
  exifExposureTime?: number;
  exifFocalLength?: number;
  exifIso?: number;
  originalFileName?: string;
  originalFileSize?: number;
  originalLastModified?: number;
  shoppingItemId?: string;
  // v12: HLC フィールド
  hlcPhysical: number;
  hlcLogical: number;
  hlcNodeId: string;
  syncedAt?: Date;
  syncSchemaVersion: number;
}

interface SyncQueueRecord {
  id: string;
  type: "pin" | "photo";
  recordId: string;
  operation: "put" | "delete";
  retries: number;
  nextAttemptAt: number; // unix ms
  createdAt: Date;
  lastError?: string;
}

interface KeyStoreRecord {
  id: string;
  key: CryptoKey;
  createdAt: Date;
}

class KodawarimapDB extends Dexie {
  pins!: EntityTable<PinRecord, "id">;
  photos!: EntityTable<PhotoRecord, "id">;
  sync_queue!: EntityTable<SyncQueueRecord, "id">;
  key_store!: EntityTable<KeyStoreRecord, "id">;

  constructor() {
    super("kodawarimap");
    this.version(1).stores({ pins: "id, createdAt" });
    this.version(2).stores({ pins: "id, createdAt, deletedAt" });
    this.version(3).stores({ pins: "id, createdAt, deletedAt, categoryId" });
    this.version(4).stores({ pins: "id, createdAt, deletedAt, categoryId" });
    this.version(5).stores({ pins: "id, createdAt, deletedAt, categoryId" });
    this.version(6).stores({
      pins: "id, createdAt, deletedAt, categoryId",
      photos: "id, pinId, createdAt",
    });
    this.version(7).stores({
      pins: "id, createdAt, deletedAt, categoryId",
      photos: "id, pinId, createdAt",
    });
    this.version(8).stores({
      pins: "id, createdAt, deletedAt, categoryId",
      photos: "id, pinId, createdAt",
    });
    this.version(9).stores({
      pins: "id, createdAt, deletedAt, categoryId",
      photos: "id, pinId, createdAt",
    });
    this.version(10)
      .stores({
        pins: "id, createdAt, deletedAt, categoryId",
        photos: "id, pinId, createdAt",
      })
      .upgrade(async (tx) => {
        await tx
          .table("pins")
          .toCollection()
          .modify((pin) => {
            if (pin.event !== undefined) {
              pin.tag = pin.event;
              delete pin.event;
            }
          });
      });
    this.version(11).stores({
      pins: "id, createdAt, deletedAt, categoryId",
      photos: "id, pinId, createdAt",
    });
    this.version(12)
      .stores({
        pins: "id, createdAt, deletedAt, categoryId, hlcPhysical",
        photos: "id, pinId, createdAt, hlcPhysical",
        sync_queue: "id, recordId, nextAttemptAt",
      })
      .upgrade(async (tx) => {
        // 既存 pin に HLC フィールドを付与
        await tx
          .table("pins")
          .toCollection()
          .modify((pin: PinRecord) => {
            if (pin.hlcPhysical == null) {
              pin.hlcPhysical = pin.createdAt ? new Date(pin.createdAt).getTime() : Date.now();
              pin.hlcLogical = 0;
              pin.hlcNodeId = "legacy";
              pin.syncSchemaVersion = 1;
            }
          });
        // 既存 photo に HLC フィールドを付与
        await tx
          .table("photos")
          .toCollection()
          .modify((photo: PhotoRecord) => {
            if (photo.hlcPhysical == null) {
              photo.hlcPhysical = photo.createdAt
                ? new Date(photo.createdAt).getTime()
                : Date.now();
              photo.hlcLogical = 0;
              photo.hlcNodeId = "legacy";
              photo.syncSchemaVersion = 1;
            }
          });
      });
    this.version(13).stores({
      pins: "id, createdAt, deletedAt, categoryId, hlcPhysical",
      photos: "id, pinId, createdAt, hlcPhysical",
      sync_queue: "id, recordId, nextAttemptAt",
      key_store: "id",
    });
  }
}

export const db = new KodawarimapDB();
export type { PinRecord, PhotoRecord, SyncQueueRecord, KeyStoreRecord };

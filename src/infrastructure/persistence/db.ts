import Dexie, { type EntityTable } from "dexie";

interface PinRecord {
  id: string;
  lng: number;
  lat: number;
  title: string;
  categoryId?: string;
  comment?: string;
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
  deletedAt?: Date;
}

interface PhotoRecord {
  id: string;
  pinId: string;
  blob: Blob;
  mimeType: string;
  createdAt: Date;
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
}

class KodawarimapDB extends Dexie {
  pins!: EntityTable<PinRecord, "id">;
  photos!: EntityTable<PhotoRecord, "id">;

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
  }
}

export const db = new KodawarimapDB();
export type { PinRecord, PhotoRecord };

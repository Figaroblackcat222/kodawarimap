import type { HLC } from "@domain/value-objects/hlc";
import type { PinId } from "./pin";

export interface PhotoExif {
  takenAt?: Date;
  takenAtEstimated?: true;
  cameraMake?: string;
  cameraModel?: string;
  fNumber?: number;
  exposureTime?: number;
  focalLength?: number;
  iso?: number;
}

export interface PhotoFileInfo {
  originalFileName?: string;
  originalFileSize?: number;
  originalLastModified?: number;
}

export interface Photo {
  id: string;
  pinId: PinId;
  blob: Blob;
  mimeType: string;
  createdAt: Date;
  comment?: string;
  exif?: PhotoExif;
  fileInfo?: PhotoFileInfo;
  shoppingItemId?: string;
  hlc: HLC;
  syncedAt?: Date;
}

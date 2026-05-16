import type { Photo, PhotoExif, PhotoFileInfo } from "@domain/entities/photo";
import type { PinId } from "@domain/entities/pin";

export interface PhotoRepository {
  save(
    pinId: PinId,
    blob: Blob,
    mimeType: string,
    exif?: PhotoExif,
    fileInfo?: PhotoFileInfo
  ): Promise<Photo>;
  restore(photo: Photo): Promise<void>;
  findByPinId(pinId: PinId): Promise<Photo[]>;
  delete(id: string): Promise<void>;
  deleteByPinId(pinId: PinId): Promise<void>;
}

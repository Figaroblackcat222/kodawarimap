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
  saveForShoppingItem(
    pinId: PinId,
    shoppingItemId: string,
    blob: Blob,
    mimeType: string
  ): Promise<Photo>;
  restore(photo: Photo): Promise<void>;
  findByPinId(pinId: PinId): Promise<Photo[]>;
  updateComment(id: string, comment: string | undefined): Promise<void>;
  delete(id: string): Promise<void>;
  deleteByPinId(pinId: PinId): Promise<void>;
}

import type { PhotoRepository } from "@application/ports/photo-repository";
import type { Photo, PhotoExif, PhotoFileInfo } from "@domain/entities/photo";
import type { PinId } from "@domain/entities/pin";

export async function addPhoto(
  repo: PhotoRepository,
  pinId: PinId,
  blob: Blob,
  mimeType: string,
  exif?: PhotoExif,
  fileInfo?: PhotoFileInfo
): Promise<Photo> {
  return repo.save(pinId, blob, mimeType, exif, fileInfo);
}

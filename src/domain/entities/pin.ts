export type PinId = string;

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface PinExif {
  takenAt?: Date;
  takenAtEstimated?: true;
  cameraMake?: string;
  cameraModel?: string;
  fNumber?: number;
  exposureTime?: number;
  focalLength?: number;
  iso?: number;
}

export type PinReaction = "want_to_revisit" | "once_was_enough" | "never_again";

export interface Pin {
  id: PinId;
  coordinates: Coordinates;
  title: string;
  categoryId?: string;
  comment?: string;
  event?: string;
  location?: string;
  url?: string;
  videoUrl?: string;
  exif?: PinExif;
  allowPhotoDownload?: boolean;
  reaction?: PinReaction;
  createdAt: Date;
  deletedAt?: Date;
}

export function createPin(
  coordinates: Coordinates,
  title: string,
  categoryId?: string,
  exif?: PinExif
): Pin {
  return {
    id: crypto.randomUUID(),
    coordinates,
    title,
    categoryId,
    exif,
    createdAt: new Date(),
  };
}

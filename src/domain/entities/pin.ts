import type { HLC } from "@domain/value-objects/hlc";

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

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  photoId?: string;
}

/** ピンが属するスペース。未設定は個人地図 */
export type PinSpace = { kind: "private" } | { kind: "group"; groupId: string; authorId?: string };

export interface Pin {
  id: PinId;
  coordinates: Coordinates;
  title: string;
  categoryId?: string;
  comment?: string;
  tag?: string;
  location?: string;
  url?: string;
  videoUrl?: string;
  exif?: PinExif;
  allowPhotoDownload?: boolean;
  reaction?: PinReaction;
  rating?: number;
  thumbnailPhotoId?: string;
  shoppingItems?: ShoppingItem[];
  hlc: HLC;
  createdAt: Date;
  deletedAt?: Date;
  /** 家族スペース共有時のみセット。未設定は個人地図 */
  space?: PinSpace;
}

export function createPin(
  coordinates: Coordinates,
  title: string,
  hlc: HLC,
  categoryId?: string,
  exif?: PinExif
): Pin {
  return {
    id: crypto.randomUUID(),
    coordinates,
    title,
    categoryId,
    exif,
    hlc,
    createdAt: new Date(),
  };
}

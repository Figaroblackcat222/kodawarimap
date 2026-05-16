import exifr from "exifr";
import type { ExifData } from "@domain/value-objects/exif-data";

export async function parseExif(file: File): Promise<ExifData> {
  let raw: Record<string, unknown> | null | undefined;
  try {
    raw = await exifr.parse(file, {
      gps: true,
      tiff: true,
      exif: true,
    });
  } catch {
    return {};
  }

  if (!raw) return {};

  const result: ExifData = {};

  if (raw.latitude != null && raw.longitude != null) {
    result.coordinates = { lng: raw.longitude as number, lat: raw.latitude as number };
  }

  if (raw.DateTimeOriginal instanceof Date) {
    result.takenAt = raw.DateTimeOriginal;
  } else if (typeof raw.DateTimeOriginal === "string") {
    result.takenAt = new Date(raw.DateTimeOriginal);
  }

  if (raw.Make) result.cameraMake = String(raw.Make).trim();
  if (raw.Model) result.cameraModel = String(raw.Model).trim();
  if (raw.FNumber != null) result.fNumber = raw.FNumber as number;
  if (raw.ExposureTime != null) result.exposureTime = raw.ExposureTime as number;
  if (raw.FocalLength != null) result.focalLength = raw.FocalLength as number;

  const iso = raw.ISO ?? raw.ISOSpeedRatings;
  if (iso != null) result.iso = Array.isArray(iso) ? iso[0] : iso;

  return result;
}

import piexif from "piexifjs";
import type { Photo, PhotoExif } from "@domain/entities/photo";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toExifDateTime(date: Date): string {
  return `${date.getFullYear()}:${pad(date.getMonth() + 1)}:${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

async function blobToBinaryString(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

function binaryStringToBlob(binary: string, mimeType: string): Blob {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

export async function writeExifToJpeg(blob: Blob, exif: PhotoExif): Promise<Blob> {
  const zeroth: Record<number, unknown> = {};
  const exifIfd: Record<number, unknown> = {};

  if (exif.cameraMake) zeroth[piexif.ImageIFD.Make] = exif.cameraMake;
  if (exif.cameraModel) zeroth[piexif.ImageIFD.Model] = exif.cameraModel;
  if (exif.fNumber) exifIfd[piexif.ExifIFD.FNumber] = [Math.round(exif.fNumber * 100), 100];
  if (exif.exposureTime && exif.exposureTime > 0) {
    exifIfd[piexif.ExifIFD.ExposureTime] = [1, Math.round(1 / exif.exposureTime)];
  }
  if (exif.focalLength)
    exifIfd[piexif.ExifIFD.FocalLength] = [Math.round(exif.focalLength * 10), 10];
  if (exif.iso) exifIfd[piexif.ExifIFD.ISOSpeedRatings] = exif.iso;
  if (exif.takenAt) exifIfd[piexif.ExifIFD.DateTimeOriginal] = toExifDateTime(exif.takenAt);

  const exifObj = { "0th": zeroth, Exif: exifIfd };
  const exifStr = piexif.dump(exifObj);

  const binary = await blobToBinaryString(blob);
  const newBinary = piexif.insert(exifStr, binary);
  return binaryStringToBlob(newBinary, "image/jpeg");
}

export async function downloadPhoto(photo: Photo): Promise<void> {
  const ext = photo.mimeType === "image/png" ? "png" : "jpg";
  const filename = `photo-${photo.id.slice(0, 8)}.${ext}`;

  let blob = photo.blob;
  if (photo.exif && photo.mimeType === "image/jpeg") {
    try {
      blob = await writeExifToJpeg(blob, photo.exif);
    } catch {
      // EXIF書き込み失敗時は元のblobでフォールバック
    }
  }

  const file = new File([blob], filename, { type: photo.mimeType });

  // File System Access API (Chrome/Edge) → 保存先ダイアログ
  if ("showSaveFilePicker" in window) {
    try {
      const handle = await (
        window as Window & {
          showSaveFilePicker: (opts: object) => Promise<FileSystemFileHandle>;
        }
      ).showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: "Image", accept: { [photo.mimeType]: [`.${ext}`] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
    }
  }

  // Web Share API (iOS など)
  if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file], title: filename });
    return;
  }

  // fallback
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

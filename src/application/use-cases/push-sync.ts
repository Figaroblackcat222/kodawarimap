/**
 * Push Sync ユースケース
 *
 * IndexedDB の未同期 Pin / Photo を暗号化して Workers API に push する。
 * 失敗した場合は SyncQueue に追加してリトライを委ねる。
 */
import type { SyncRepository, PinSyncRecord } from "@application/ports/sync-repository";
import type { PinRepository } from "@application/ports/pin-repository";
import type { PhotoRepository } from "@application/ports/photo-repository";
import type { CryptoService } from "@application/ports/crypto-service";
import type { SyncQueueRepository } from "@application/ports/sync-queue-repository";
import type { Pin } from "@domain/entities/pin";
import type { Photo } from "@domain/entities/photo";

/** 暗号化ペイロードの内部形式 */
interface PinPayload {
  schemaVersion: 1;
  data: {
    id: string;
    coordinates: { lng: number; lat: number };
    title: string;
    categoryId?: string;
    comment?: string;
    tag?: string;
    location?: string;
    url?: string;
    videoUrl?: string;
    allowPhotoDownload?: boolean;
    reaction?: string;
    rating?: number;
    thumbnailPhotoId?: string;
    shoppingItems?: Pin["shoppingItems"];
    exif?: {
      takenAt?: string; // ISO8601
      takenAtEstimated?: boolean;
      cameraMake?: string;
      cameraModel?: string;
      fNumber?: number;
      exposureTime?: number;
      focalLength?: number;
      iso?: number;
    };
    hlc: { physical: number; logical: number; nodeId: string };
    createdAt: string; // ISO8601
    deletedAt?: string; // ISO8601
  };
}

/** Pin エンティティを暗号化ペイロード用オブジェクトに変換する */
function pinToPayload(pin: Pin): PinPayload {
  return {
    schemaVersion: 1,
    data: {
      id: pin.id,
      coordinates: pin.coordinates,
      title: pin.title,
      categoryId: pin.categoryId,
      comment: pin.comment,
      tag: pin.tag,
      location: pin.location,
      url: pin.url,
      videoUrl: pin.videoUrl,
      allowPhotoDownload: pin.allowPhotoDownload,
      reaction: pin.reaction,
      rating: pin.rating,
      thumbnailPhotoId: pin.thumbnailPhotoId,
      shoppingItems: pin.shoppingItems,
      exif: pin.exif
        ? {
            takenAt: pin.exif.takenAt?.toISOString(),
            takenAtEstimated: pin.exif.takenAtEstimated,
            cameraMake: pin.exif.cameraMake,
            cameraModel: pin.exif.cameraModel,
            fNumber: pin.exif.fNumber,
            exposureTime: pin.exif.exposureTime,
            focalLength: pin.exif.focalLength,
            iso: pin.exif.iso,
          }
        : undefined,
      hlc: pin.hlc,
      createdAt: pin.createdAt.toISOString(),
      deletedAt: pin.deletedAt?.toISOString(),
    },
  };
}

/** 写真メタデータの暗号化前ペイロード */
interface PhotoMetaPayload {
  schemaVersion: 1;
  data: {
    id: string;
    pinId: string;
    mimeType: string;
    createdAt: string; // ISO8601
    comment?: string;
    shoppingItemId?: string;
    exif?: {
      takenAt?: string; // ISO8601
      takenAtEstimated?: boolean;
      cameraMake?: string;
      cameraModel?: string;
      fNumber?: number;
      exposureTime?: number;
      focalLength?: number;
      iso?: number;
    };
    fileInfo?: {
      originalFileName?: string;
      originalFileSize?: number;
      originalLastModified?: number;
    };
    hlc: { physical: number; logical: number; nodeId: string };
  };
}

function photoToMetaPayload(photo: Photo): PhotoMetaPayload {
  return {
    schemaVersion: 1,
    data: {
      id: photo.id,
      pinId: photo.pinId,
      mimeType: photo.mimeType,
      createdAt: photo.createdAt.toISOString(),
      comment: photo.comment,
      shoppingItemId: photo.shoppingItemId,
      exif: photo.exif
        ? {
            takenAt: photo.exif.takenAt?.toISOString(),
            takenAtEstimated: photo.exif.takenAtEstimated,
            cameraMake: photo.exif.cameraMake,
            cameraModel: photo.exif.cameraModel,
            fNumber: photo.exif.fNumber,
            exposureTime: photo.exif.exposureTime,
            focalLength: photo.exif.focalLength,
            iso: photo.exif.iso,
          }
        : undefined,
      fileInfo: photo.fileInfo
        ? {
            originalFileName: photo.fileInfo.originalFileName,
            originalFileSize: photo.fileInfo.originalFileSize,
            originalLastModified: photo.fileInfo.originalLastModified,
          }
        : undefined,
      hlc: photo.hlc,
    },
  };
}

export async function pushSync(
  syncRepo: SyncRepository,
  pinRepo: PinRepository,
  cryptoService: CryptoService,
  encryptionKey: CryptoKey,
  queueRepo: SyncQueueRepository,
  since: { physical: number; logical: number },
  photoRepo?: PhotoRepository
): Promise<{ pushedCount: number; pushedPhotoCount: number }> {
  let pushedCount = 0;
  let pushedPhotoCount = 0;

  // 1. 変更済み Pin 取得（softDelete 済みも含む）
  const [modifiedPins, deletedPins] = await Promise.all([
    pinRepo.findModifiedSince(since.physical, since.logical),
    pinRepo.findDeleted(),
  ]);

  // 削除済みで since より新しいものも対象
  const deletedModified = deletedPins.filter(
    (p) =>
      p.hlc.physical > since.physical ||
      (p.hlc.physical === since.physical && p.hlc.logical > since.logical)
  );

  // 重複排除（findModifiedSince に deletedAt がある場合も含むため）
  const allModified = [
    ...modifiedPins,
    ...deletedModified.filter((d) => !modifiedPins.some((m) => m.id === d.id)),
  ];

  // 2. 各 Pin を暗号化して push（グループピンは push-group-sync が担当するのでスキップ）
  for (const pin of allModified.filter((p) => p.space?.kind !== "group")) {
    try {
      const payload = pinToPayload(pin);
      const plaintext = JSON.stringify(payload);
      const { ciphertext, iv } = await cryptoService.encrypt(encryptionKey, plaintext);

      const record: PinSyncRecord = {
        id: pin.id,
        encryptedPayload: ciphertext,
        iv,
        hlcPhysical: pin.hlc.physical,
        hlcLogical: pin.hlc.logical,
        hlcNodeId: pin.hlc.nodeId,
        isDeleted: pin.deletedAt != null,
        createdAt: pin.createdAt.toISOString(),
      };

      await syncRepo.pushPin(record);
      pushedCount++;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn("[push-sync] Failed to push pin, enqueueing for retry:", pin.id, errorMessage);
      // 失敗したら SyncQueue に追加
      await queueRepo.enqueue({
        type: "pin",
        recordId: pin.id,
        operation: "put",
      });
    }
  }

  // 3. SyncQueue の due items もリトライ処理
  const dueItems = await queueRepo.peekDue();
  for (const item of dueItems) {
    if (item.type === "pin") {
      // SyncQueue からリトライする場合は Pin を再取得
      let pin: Pin | undefined;
      try {
        const pins = await pinRepo.findModifiedSince(0, 0);
        const deleted = await pinRepo.findDeleted();
        pin = [...pins, ...deleted].find((p) => p.id === item.recordId);
      } catch {
        await queueRepo.markRetry(item.id, Date.now(), "Failed to fetch pin from repository");
        continue;
      }

      if (!pin) {
        // Pin が存在しない（hardDelete済み）: キューから除去
        await queueRepo.remove(item.id);
        continue;
      }

      try {
        const payload = pinToPayload(pin);
        const plaintext = JSON.stringify(payload);
        const { ciphertext, iv } = await cryptoService.encrypt(encryptionKey, plaintext);

        const record: PinSyncRecord = {
          id: pin.id,
          encryptedPayload: ciphertext,
          iv,
          hlcPhysical: pin.hlc.physical,
          hlcLogical: pin.hlc.logical,
          hlcNodeId: pin.hlc.nodeId,
          isDeleted: pin.deletedAt != null,
          createdAt: pin.createdAt.toISOString(),
        };

        await syncRepo.pushPin(record);
        await queueRepo.remove(item.id);
        pushedCount++;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        await queueRepo.markRetry(item.id, Date.now(), errorMessage);
      }
    } else if (item.type === "photo" && photoRepo) {
      // 写真リトライ: photoRepo から該当 photo を再取得して再 push
      let photo: Photo | undefined;
      try {
        const unsynced = await photoRepo.findUnsyncedPhotos();
        photo = unsynced.find((p) => p.id === item.recordId);
      } catch {
        await queueRepo.markRetry(item.id, Date.now(), "Failed to fetch photo from repository");
        continue;
      }

      if (!photo) {
        // すでに syncedAt が設定済みか削除済み: キューから除去
        await queueRepo.remove(item.id);
        continue;
      }

      try {
        const metaPayload = photoToMetaPayload(photo);
        const metaPlaintext = JSON.stringify(metaPayload);
        const { ciphertext: encryptedMeta, iv: metaIv } = await cryptoService.encrypt(
          encryptionKey,
          metaPlaintext
        );
        const blobArrayBuffer = await photo.blob.arrayBuffer();
        const encryptedBlob = await cryptoService.encryptBinary(encryptionKey, blobArrayBuffer);

        await syncRepo.pushPhotoBinary(photo.id, encryptedBlob, {
          encryptedMeta,
          metaIv,
          pinId: photo.pinId,
          hlcPhysical: photo.hlc.physical,
          hlcLogical: photo.hlc.logical,
          hlcNodeId: photo.hlc.nodeId,
        });
        await photoRepo.markSynced(photo.id, new Date());
        await queueRepo.remove(item.id);
        pushedPhotoCount++;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        await queueRepo.markRetry(item.id, Date.now(), errorMessage);
      }
    }
  }

  // 4. 未同期写真を push（photoRepo が渡されている場合のみ・グループピンの写真は除外）
  if (photoRepo) {
    // グループピンの写真は push-group-photo-sync で処理するため除外
    const allPins = await pinRepo.findAll();
    const groupPinIds = new Set(allPins.filter((p) => p.space?.kind === "group").map((p) => p.id));

    const unsyncedPhotos = await photoRepo.findUnsyncedPhotos();
    for (const photo of unsyncedPhotos.filter((p) => !groupPinIds.has(p.pinId))) {
      try {
        const metaPayload = photoToMetaPayload(photo);
        const metaPlaintext = JSON.stringify(metaPayload);
        const { ciphertext: encryptedMeta, iv: metaIv } = await cryptoService.encrypt(
          encryptionKey,
          metaPlaintext
        );
        const blobArrayBuffer = await photo.blob.arrayBuffer();
        const encryptedBlob = await cryptoService.encryptBinary(encryptionKey, blobArrayBuffer);

        await syncRepo.pushPhotoBinary(photo.id, encryptedBlob, {
          encryptedMeta,
          metaIv,
          pinId: photo.pinId,
          hlcPhysical: photo.hlc.physical,
          hlcLogical: photo.hlc.logical,
          hlcNodeId: photo.hlc.nodeId,
        });
        await photoRepo.markSynced(photo.id, new Date());
        pushedPhotoCount++;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.warn(
          "[push-sync] Failed to push photo, enqueueing for retry:",
          photo.id,
          errorMessage
        );
        await queueRepo.enqueue({
          type: "photo",
          recordId: photo.id,
          operation: "put",
        });
      }
    }
  }

  return { pushedCount, pushedPhotoCount };
}

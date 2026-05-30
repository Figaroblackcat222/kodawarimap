/**
 * グループピン Push Sync ユースケース
 *
 * push-sync.ts のグループ版。since HLC 以降に変更されたグループピンを
 * グループ鍵で暗号化して group_pins_sync に push する。
 */
import type { PinRepository } from "@application/ports/pin-repository";
import type { GroupSyncRepository } from "@application/ports/group-sync-repository";
import type { KeyManagementService } from "@application/ports/key-management-service";
import type { Pin } from "@domain/entities/pin";

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
      takenAt?: string;
      takenAtEstimated?: boolean;
      cameraMake?: string;
      cameraModel?: string;
      fNumber?: number;
      exposureTime?: number;
      focalLength?: number;
      iso?: number;
    };
    hlc: { physical: number; logical: number; nodeId: string };
    createdAt: string;
    deletedAt?: string;
  };
}

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

export async function pushGroupSync(
  groupId: string,
  groupKey: CryptoKey,
  keyVersion: number,
  groupSyncRepo: GroupSyncRepository,
  pinRepo: PinRepository,
  keyMgmt: KeyManagementService,
  since: { physical: number; logical: number }
): Promise<{ pushedCount: number }> {
  const modifiedPins = await pinRepo.findModifiedSince(since.physical, since.logical);
  const groupPins = modifiedPins.filter(
    (p) => p.space?.kind === "group" && p.space.groupId === groupId
  );

  if (groupPins.length === 0) return { pushedCount: 0 };

  let pushedCount = 0;
  for (const pin of groupPins) {
    const payload = pinToPayload(pin);
    const { ciphertext: encryptedPayload, iv } = await keyMgmt.encryptWithGroupKey(
      groupKey,
      JSON.stringify(payload)
    );

    await groupSyncRepo.pushGroupPin(groupId, pin.id, {
      encryptedPayload,
      iv,
      hlcPhysical: pin.hlc.physical,
      hlcLogical: pin.hlc.logical,
      hlcNodeId: pin.hlc.nodeId,
      isDeleted: !!pin.deletedAt,
      keyVersion,
    });
    pushedCount++;
  }

  return { pushedCount };
}

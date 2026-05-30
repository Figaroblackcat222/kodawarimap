/**
 * グループ写真 Push Sync ユースケース
 *
 * グループピンに紐づく未同期写真をグループ鍵で暗号化してサーバーに push する。
 */
import type { GroupSyncRepository } from "@application/ports/group-sync-repository";
import type { PinRepository } from "@application/ports/pin-repository";
import type { PhotoRepository } from "@application/ports/photo-repository";
import type { KeyManagementService } from "@application/ports/key-management-service";
import type { Photo } from "@domain/entities/photo";

interface PhotoMetaPayload {
  schemaVersion: 1;
  data: {
    shoppingItemId?: string;
    comment?: string;
  };
}

function photoToMetaPayload(photo: Photo): PhotoMetaPayload {
  return {
    schemaVersion: 1,
    data: {
      shoppingItemId: photo.shoppingItemId,
      comment: photo.comment,
    },
  };
}

export async function pushGroupPhotoSync(
  groupId: string,
  groupKey: CryptoKey,
  keyVersion: number,
  groupSyncRepo: GroupSyncRepository,
  pinRepo: PinRepository,
  photoRepo: PhotoRepository,
  keyMgmt: KeyManagementService
): Promise<{ pushedCount: number }> {
  // グループピンの ID セットを構築
  const allPins = await pinRepo.findAll();
  const groupPinIds = new Set(
    allPins.filter((p) => p.space?.kind === "group" && p.space.groupId === groupId).map((p) => p.id)
  );
  if (groupPinIds.size === 0) return { pushedCount: 0 };

  const unsyncedPhotos = await photoRepo.findUnsyncedPhotos();
  const groupPhotos = unsyncedPhotos.filter((p) => groupPinIds.has(p.pinId));
  if (groupPhotos.length === 0) return { pushedCount: 0 };

  let pushedCount = 0;
  for (const photo of groupPhotos) {
    try {
      const metaPayload = photoToMetaPayload(photo);
      const { ciphertext: encryptedMeta, iv: metaIv } = await keyMgmt.encryptWithGroupKey(
        groupKey,
        JSON.stringify(metaPayload)
      );

      const blobArrayBuffer = await photo.blob.arrayBuffer();
      const encryptedBlob = await keyMgmt.encryptBinaryWithGroupKey(groupKey, blobArrayBuffer);

      await groupSyncRepo.pushGroupPhotoBinary(groupId, photo.id, encryptedBlob, {
        encryptedMeta,
        metaIv,
        pinId: photo.pinId,
        keyVersion,
        hlcPhysical: photo.hlc.physical,
        hlcLogical: photo.hlc.logical,
        hlcNodeId: photo.hlc.nodeId,
      });

      await photoRepo.markSynced(photo.id, new Date());
      pushedCount++;
    } catch (e) {
      console.warn("[push-group-photo-sync] Failed to push photo:", photo.id, e);
    }
  }

  return { pushedCount };
}

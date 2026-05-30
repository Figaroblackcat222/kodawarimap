/**
 * ピンを家族スペースへ移動する（Phase 1: push のみ）。
 *
 * 移動セマンティクス:
 * 1. グループ鍵でピンを暗号化して group_pins_sync へ push
 * 2. 個人側の pins_sync を tombstone（soft delete）
 *    → 個人地図と家族スペースで重複表示しない
 *
 * 失敗時: push 失敗 → tombstone しない（原子性を近似）
 */
import type { Pin, PinReaction, ShoppingItem } from "@domain/entities/pin";
import type { KeyManagementService } from "@application/ports/key-management-service";
import type { GroupSyncRepository } from "@application/ports/group-sync-repository";
import type { PinRepository } from "@application/ports/pin-repository";
import type { PhotoRepository } from "@application/ports/photo-repository";
import type { SyncRepository, PinSyncRecord } from "@application/ports/sync-repository";
import type { CryptoService } from "@application/ports/crypto-service";
import { nextHlc } from "@domain/value-objects/hlc";

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
    reaction?: PinReaction;
    rating?: number;
    thumbnailPhotoId?: string;
    shoppingItems?: ShoppingItem[];
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

export async function sharePinToGroup(
  pin: Pin,
  groupId: string,
  keyVersion: number,
  groupKey: CryptoKey,
  keyMgmt: KeyManagementService,
  groupSyncRepo: GroupSyncRepository,
  pinRepo: PinRepository,
  photoRepo: PhotoRepository,
  syncRepo: SyncRepository,
  encryptionKey: CryptoKey,
  cryptoService: CryptoService
): Promise<void> {
  const newHlc = nextHlc(pin.hlc);

  const payload: PinPayload = {
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
      hlc: newHlc,
      createdAt: pin.createdAt.toISOString(),
      deletedAt: pin.deletedAt?.toISOString(),
    },
  };

  const { ciphertext: encryptedPayload, iv } = await keyMgmt.encryptWithGroupKey(
    groupKey,
    JSON.stringify(payload)
  );

  // グループへ push（失敗時は例外で停止）
  await groupSyncRepo.pushGroupPin(groupId, pin.id, {
    encryptedPayload,
    iv,
    hlcPhysical: newHlc.physical,
    hlcLogical: newHlc.logical,
    hlcNodeId: newHlc.nodeId,
    isDeleted: false,
    keyVersion,
  });

  // ローカルの pin を group space に更新
  const updatedPin: Pin = {
    ...pin,
    hlc: newHlc,
    space: { kind: "group", groupId },
  };
  await pinRepo.save(updatedPin);

  // 個人 sync レコードを tombstone（isDeleted=true で push）
  const tombstonePayload = JSON.stringify({
    schemaVersion: 1,
    data: { ...payload.data, deletedAt: new Date().toISOString() },
  });
  const { ciphertext: deletedCiphertext, iv: deletedIv } = await cryptoService.encrypt(
    encryptionKey,
    tombstonePayload
  );
  const tombstoneHlc = nextHlc(newHlc);
  const tombstoneRecord: PinSyncRecord = {
    id: pin.id,
    encryptedPayload: deletedCiphertext,
    iv: deletedIv,
    hlcPhysical: tombstoneHlc.physical,
    hlcLogical: tombstoneHlc.logical,
    hlcNodeId: tombstoneHlc.nodeId,
    isDeleted: true,
    createdAt: new Date().toISOString(),
  };
  await syncRepo.pushPin(tombstoneRecord);

  // 既存写真の syncedAt をリセットしてグループ向け再アップロードをトリガー
  await photoRepo.resetSyncedAt(pin.id);
}

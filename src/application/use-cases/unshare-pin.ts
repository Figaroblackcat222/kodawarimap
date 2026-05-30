/**
 * ピンを家族スペースから個人地図へ戻す（unshare）。
 *
 * 移動セマンティクス（share の逆）:
 * 1. グループ側に tombstone を push（is_deleted=true）
 * 2. 個人 sync に pin を re-push（is_deleted=false）
 * 3. ローカルの pin.space を undefined に更新
 *
 * 失敗時: tombstone push 失敗 → 個人側更新しない（原子性を近似）
 */
import type { Pin, PinReaction, ShoppingItem } from "@domain/entities/pin";
import type { KeyManagementService } from "@application/ports/key-management-service";
import type { GroupSyncRepository } from "@application/ports/group-sync-repository";
import type { PinRepository } from "@application/ports/pin-repository";
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

export async function unsharePin(
  pin: Pin,
  groupId: string,
  keyVersion: number,
  groupKey: CryptoKey,
  nodeId: string,
  keyMgmt: KeyManagementService,
  groupSyncRepo: GroupSyncRepository,
  pinRepo: PinRepository,
  syncRepo: SyncRepository,
  encryptionKey: CryptoKey,
  cryptoService: CryptoService
): Promise<void> {
  const tombstoneHlc = nextHlc(pin.hlc);

  // グループ側に tombstone を push
  const tombstonePayload: PinPayload = {
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
      hlc: tombstoneHlc,
      createdAt: pin.createdAt.toISOString(),
      deletedAt: new Date().toISOString(),
    },
  };

  const { ciphertext: groupCiphertext, iv: groupIv } = await keyMgmt.encryptWithGroupKey(
    groupKey,
    JSON.stringify(tombstonePayload)
  );

  await groupSyncRepo.pushGroupPin(groupId, pin.id, {
    encryptedPayload: groupCiphertext,
    iv: groupIv,
    hlcPhysical: tombstoneHlc.physical,
    hlcLogical: tombstoneHlc.logical,
    hlcNodeId: tombstoneHlc.nodeId,
    isDeleted: true,
    keyVersion,
  });

  // 個人 sync に pin を re-push（space なし）
  const personalHlc = nextHlc(tombstoneHlc);
  const personalPayload = JSON.stringify({
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
      hlc: personalHlc,
      createdAt: pin.createdAt.toISOString(),
    },
  });

  const { ciphertext: personalCiphertext, iv: personalIv } = await cryptoService.encrypt(
    encryptionKey,
    personalPayload
  );

  const personalRecord: PinSyncRecord = {
    id: pin.id,
    encryptedPayload: personalCiphertext,
    iv: personalIv,
    hlcPhysical: personalHlc.physical,
    hlcLogical: personalHlc.logical,
    hlcNodeId: personalHlc.nodeId,
    isDeleted: false,
    createdAt: new Date().toISOString(),
  };
  await syncRepo.pushPin(personalRecord);

  // ローカルを更新（space を除去）
  const updatedPin: Pin = {
    ...pin,
    hlc: personalHlc,
    space: undefined,
  };
  await pinRepo.save(updatedPin);
}

/**
 * グループピン Pull Sync ユースケース
 *
 * pull-sync.ts のグループ版。グループ鍵で復号し、
 * Pin に space: { kind: "group", groupId, authorId } を付与して PinRepository に保存する。
 * HLC LWW で競合解決（whole-pin 単位）。
 */
import type { GroupSyncRepository } from "@application/ports/group-sync-repository";
import type { PinRepository } from "@application/ports/pin-repository";
import type { KeyManagementService } from "@application/ports/key-management-service";
import type { Pin, PinExif, PinReaction, ShoppingItem } from "@domain/entities/pin";
import { compareHlc } from "@domain/value-objects/hlc";

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

function parseOptionalDate(v: string | undefined): Date | undefined {
  if (v == null) return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
}

export async function pullGroupSync(
  groupId: string,
  groupKey: CryptoKey,
  groupSyncRepo: GroupSyncRepository,
  pinRepo: PinRepository,
  keyMgmt: KeyManagementService,
  since: { physical: number; logical: number }
): Promise<{ mergedCount: number; lastHlc: { physical: number; logical: number } }> {
  const records = await groupSyncRepo.fetchGroupPinsSince(groupId, since.physical, since.logical);
  if (records.length === 0) return { mergedCount: 0, lastHlc: since };

  // groupId でフィルタしたローカルピンとの比較マップ
  const existingPins = await pinRepo.findAll();
  const deletedPins = await pinRepo.findDeleted();
  const allPins = [...existingPins, ...deletedPins];
  const localMap = new Map<string, Pin>(
    allPins
      .filter((p) => p.space?.kind === "group" && p.space.groupId === groupId)
      .map((p) => [p.id, p])
  );

  let mergedCount = 0;
  let lastHlc = since;

  for (const record of records) {
    let payload: PinPayload;
    try {
      const plaintext = await keyMgmt.decryptWithGroupKey(
        groupKey,
        record.encryptedPayload,
        record.iv
      );
      payload = JSON.parse(plaintext) as PinPayload;
    } catch {
      console.warn("[pull-group-sync] decrypt failed:", record.id);
      continue;
    }

    const remoteHlc = {
      physical: record.hlcPhysical,
      logical: record.hlcLogical,
      nodeId: record.hlcNodeId,
    };

    const localPin = localMap.get(record.id);
    if (localPin && compareHlc(localPin.hlc, remoteHlc) > 0) continue;

    const d = payload.data;
    let exif: PinExif | undefined;
    if (d.exif) {
      exif = {
        takenAt: parseOptionalDate(d.exif.takenAt),
        takenAtEstimated: d.exif.takenAtEstimated ? true : undefined,
        cameraMake: d.exif.cameraMake,
        cameraModel: d.exif.cameraModel,
        fNumber: d.exif.fNumber,
        exposureTime: d.exif.exposureTime,
        focalLength: d.exif.focalLength,
        iso: d.exif.iso,
      };
    }

    const pin: Pin = {
      id: d.id,
      coordinates: d.coordinates,
      title: d.title,
      categoryId: d.categoryId,
      comment: d.comment,
      tag: d.tag,
      location: d.location,
      url: d.url,
      videoUrl: d.videoUrl,
      allowPhotoDownload: d.allowPhotoDownload,
      reaction: d.reaction,
      rating: d.rating,
      thumbnailPhotoId: d.thumbnailPhotoId,
      shoppingItems: d.shoppingItems,
      exif,
      hlc: remoteHlc,
      createdAt: new Date(d.createdAt),
      deletedAt: parseOptionalDate(d.deletedAt),
      space: { kind: "group", groupId, authorId: record.authorId },
    };

    await pinRepo.save(pin);
    mergedCount++;

    if (
      record.hlcPhysical > lastHlc.physical ||
      (record.hlcPhysical === lastHlc.physical && record.hlcLogical > lastHlc.logical)
    ) {
      lastHlc = { physical: record.hlcPhysical, logical: record.hlcLogical };
    }
  }

  return { mergedCount, lastHlc };
}

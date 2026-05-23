/**
 * Pull Sync ユースケース
 *
 * サーバーから暗号化 Pin を取得し、HLC による LWW (Last-Write-Wins) で
 * IndexedDB に upsert する。
 */
import type { SyncRepository } from "@application/ports/sync-repository";
import type { PinRepository } from "@application/ports/pin-repository";
import type { CryptoService } from "@application/ports/crypto-service";
import type { Pin, PinExif, PinReaction, ShoppingItem } from "@domain/entities/pin";
import { compareHlc } from "@domain/value-objects/hlc";

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
    reaction?: PinReaction;
    thumbnailPhotoId?: string;
    shoppingItems?: ShoppingItem[];
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

/** ISO8601 文字列または undefined を Date または undefined に変換する */
function parseOptionalDate(value: string | undefined): Date | undefined {
  if (value == null) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

/** PinPayload.data を Pin エンティティに変換する */
function payloadDataToPin(data: PinPayload["data"]): Pin {
  let exif: PinExif | undefined;
  if (data.exif) {
    exif = {
      takenAt: parseOptionalDate(data.exif.takenAt),
      takenAtEstimated: data.exif.takenAtEstimated ? true : undefined,
      cameraMake: data.exif.cameraMake,
      cameraModel: data.exif.cameraModel,
      fNumber: data.exif.fNumber,
      exposureTime: data.exif.exposureTime,
      focalLength: data.exif.focalLength,
      iso: data.exif.iso,
    };
  }

  return {
    id: data.id,
    coordinates: data.coordinates,
    title: data.title,
    categoryId: data.categoryId,
    comment: data.comment,
    tag: data.tag,
    location: data.location,
    url: data.url,
    videoUrl: data.videoUrl,
    allowPhotoDownload: data.allowPhotoDownload,
    reaction: data.reaction,
    thumbnailPhotoId: data.thumbnailPhotoId,
    shoppingItems: data.shoppingItems,
    exif,
    hlc: data.hlc,
    createdAt: new Date(data.createdAt),
    deletedAt: parseOptionalDate(data.deletedAt),
  };
}

export async function pullSync(
  syncRepo: SyncRepository,
  pinRepo: PinRepository,
  cryptoService: CryptoService,
  encryptionKey: CryptoKey,
  since: { physical: number; logical: number }
): Promise<{ mergedCount: number; lastHlc: { physical: number; logical: number } }> {
  const records = await syncRepo.fetchPinsSince(since.physical, since.logical);

  if (records.length === 0) {
    return { mergedCount: 0, lastHlc: since };
  }

  // 既存のすべての Pin を取得して HLC 比較用に id → Pin のマップを作る
  const existingPins = await pinRepo.findAll();
  const deletedPins = await pinRepo.findDeleted();
  const allPins = [...existingPins, ...deletedPins];
  const localPinMap = new Map<string, Pin>(allPins.map((p) => [p.id, p]));

  let mergedCount = 0;
  let lastHlc: { physical: number; logical: number } = since;

  for (const record of records) {
    // 復号
    let payload: PinPayload;
    try {
      const plaintext = await cryptoService.decrypt(
        encryptionKey,
        record.encryptedPayload,
        record.iv
      );
      payload = JSON.parse(plaintext) as PinPayload;
    } catch {
      // 復号失敗: スキップ（鍵不一致や不正データ）
      console.warn("[pull-sync] Failed to decrypt pin:", record.id);
      continue;
    }

    const remoteHlc = {
      physical: record.hlcPhysical,
      logical: record.hlcLogical,
      nodeId: record.hlcNodeId,
    };

    // HLC による LWW: ローカルが新しければスキップ
    const localPin = localPinMap.get(record.id);
    if (localPin) {
      const cmp = compareHlc(localPin.hlc, remoteHlc);
      if (cmp > 0) {
        // ローカルが新しい → スキップ
        continue;
      }
    }

    // リモートが新しい または ローカルに存在しない → upsert
    const pin = payloadDataToPin(payload.data);
    // HLC はレコードから直接取る（サーバーが上書きした可能性があるため）
    pin.hlc = remoteHlc;

    await pinRepo.save(pin);
    mergedCount++;

    // 最新 HLC を追跡
    if (
      record.hlcPhysical > lastHlc.physical ||
      (record.hlcPhysical === lastHlc.physical && record.hlcLogical > lastHlc.logical)
    ) {
      lastHlc = { physical: record.hlcPhysical, logical: record.hlcLogical };
    }
  }

  return { mergedCount, lastHlc };
}

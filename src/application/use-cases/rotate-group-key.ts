/**
 * グループ鍵ローテーション。
 *
 * 1. 新しい AES-256-GCM グループ鍵を生成する。
 * 2. アクティブメンバー全員の公開鍵で新グループ鍵をラップする。
 * 3. ローカル DB のグループピンを全件取得し、新鍵で再暗号化してサーバーに push する。
 * 4. サーバーの family_groups.key_version を更新する。
 * 5. 新グループ鍵を返す（呼び出し元が key_store に保存する）。
 *
 * pending_key 状態のメンバーはスキップされる（失効後に再招待を推奨）。
 * 完全なローテーションには全グループピンの push が必要なため、
 * ピン数が多い場合は onProgress で進捗を通知する。
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

export async function rotateGroupKey(
  groupId: string,
  currentKeyVersion: number,
  currentGroupKey: CryptoKey,
  {
    keyManagementService,
    groupSyncRepository,
    pinRepository,
    groupName,
    onProgress,
  }: {
    keyManagementService: KeyManagementService;
    groupSyncRepository: GroupSyncRepository;
    pinRepository: PinRepository;
    /** 復号済みグループ名（新鍵で再暗号化してサーバーに送る） */
    groupName: string;
    onProgress?: (current: number, total: number) => void;
  }
): Promise<{ newGroupKey: CryptoKey; newKeyVersion: number }> {
  void currentGroupKey; // 将来の追加処理用（現在は新鍵で再暗号化のみ）
  const newKeyVersion = currentKeyVersion + 1;

  // 1. 新グループ鍵を生成
  const newGroupKey = await keyManagementService.generateGroupKey();

  // 2. アクティブメンバー全員の公開鍵でラップ
  const activeMembers = await groupSyncRepository.fetchActivePublicKeys(groupId);
  const wrappedKeys = await Promise.all(
    activeMembers.map(async (m) => ({
      userId: m.userId,
      wrappedGroupKey: await keyManagementService.wrapGroupKeyForMember(newGroupKey, m.publicKey),
    }))
  );

  // 3. ローカルのグループピンを全件取得して再暗号化 → push
  const allPins = await pinRepository.findAll();
  const groupPins = allPins.filter((p) => p.space?.kind === "group" && p.space.groupId === groupId);
  const total = groupPins.length;

  let current = 0;
  for (const pin of groupPins) {
    const payload = pinToPayload(pin);
    const { ciphertext: encryptedPayload, iv } = await keyManagementService.encryptWithGroupKey(
      newGroupKey,
      JSON.stringify(payload)
    );
    await groupSyncRepository.pushGroupPin(groupId, pin.id, {
      encryptedPayload,
      iv,
      hlcPhysical: pin.hlc.physical,
      hlcLogical: pin.hlc.logical,
      hlcNodeId: pin.hlc.nodeId,
      isDeleted: !!pin.deletedAt,
      keyVersion: newKeyVersion,
    });
    current++;
    onProgress?.(current, total);
  }

  // 4. グループ名を新鍵で再暗号化
  const { ciphertext: encryptedName, iv: nameIv } = await keyManagementService.encryptWithGroupKey(
    newGroupKey,
    groupName
  );

  // 5. サーバーの key_version・encrypted_name を更新
  await groupSyncRepository.rotateGroupKey(groupId, {
    newKeyVersion,
    wrappedKeys,
    encryptedName,
    nameIv,
  });

  return { newGroupKey, newKeyVersion };
}

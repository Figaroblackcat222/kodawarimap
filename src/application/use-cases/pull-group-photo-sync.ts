/**
 * グループ写真 Pull Sync ユースケース
 *
 * pull-photo-sync.ts のグループ版。
 * グループ内の全ピンに対して fetchGroupPhotoList → 差分検出 → グループ鍵で復号 → Dexie 保存。
 */
import type { GroupSyncRepository } from "@application/ports/group-sync-repository";
import type { PinRepository } from "@application/ports/pin-repository";
import type { PhotoRepository } from "@application/ports/photo-repository";
import type { KeyManagementService } from "@application/ports/key-management-service";
import type { Photo, PhotoExif } from "@domain/entities/photo";

interface PhotoMetaData {
  schemaVersion: 1;
  data: {
    shoppingItemId?: string;
    comment?: string;
  };
}

export async function pullGroupPhotoSync(
  groupId: string,
  groupKey: CryptoKey,
  groupSyncRepo: GroupSyncRepository,
  pinRepo: PinRepository,
  photoRepo: PhotoRepository,
  keyMgmt: KeyManagementService,
  extractExif?: (blob: Blob) => Promise<PhotoExif | undefined>
): Promise<{ downloadedCount: number }> {
  const allPins = await pinRepo.findAll();
  const groupPins = allPins.filter((p) => p.space?.kind === "group" && p.space.groupId === groupId);
  if (groupPins.length === 0) return { downloadedCount: 0 };

  let downloadedCount = 0;

  for (const pin of groupPins) {
    let remoteList: Awaited<ReturnType<typeof groupSyncRepo.fetchGroupPhotoList>>;
    try {
      remoteList = await groupSyncRepo.fetchGroupPhotoList(groupId, pin.id);
    } catch {
      continue;
    }
    if (remoteList.length === 0) continue;

    const localPhotos = await photoRepo.findByPinId(pin.id);
    const localIds = new Set(localPhotos.map((p) => p.id));
    const missing = remoteList.filter((r) => !localIds.has(r.id));

    for (const remote of missing) {
      try {
        const encryptedBuffer = await groupSyncRepo.fetchGroupPhotoBinary(groupId, remote.id);
        const decryptedBuffer = await keyMgmt.decryptBinaryWithGroupKey(groupKey, encryptedBuffer);
        const blob = new Blob([decryptedBuffer], { type: "image/jpeg" });
        const exif = extractExif ? await extractExif(blob).catch(() => undefined) : undefined;

        let shoppingItemId: string | undefined;
        try {
          const metaJson = await keyMgmt.decryptWithGroupKey(
            groupKey,
            remote.encryptedMeta,
            remote.metaIv
          );
          const meta = JSON.parse(metaJson) as PhotoMetaData;
          shoppingItemId = meta.data.shoppingItemId;
        } catch {
          // メタデータ復号失敗は無視
        }

        const photo: Photo = {
          id: remote.id,
          pinId: pin.id,
          blob,
          mimeType: "image/jpeg",
          exif,
          createdAt: new Date(remote.hlcPhysical),
          hlc: { physical: remote.hlcPhysical, logical: remote.hlcLogical, nodeId: "remote" },
          syncedAt: new Date(),
          shoppingItemId,
        };
        await photoRepo.restore(photo);
        downloadedCount++;
      } catch {
        // 個別写真の失敗は無視して続行
      }
    }
  }

  return { downloadedCount };
}

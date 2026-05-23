/**
 * Pull Photo Sync ユースケース
 *
 * サーバー（R2）にあってローカルにない写真を一括ダウンロードする。
 * ピンごとに fetchPhotoList → 差分検出 → 復号 → IndexedDB 保存。
 */
import type { SyncRepository } from "@application/ports/sync-repository";
import type { PinRepository } from "@application/ports/pin-repository";
import type { PhotoRepository } from "@application/ports/photo-repository";
import type { CryptoService } from "@application/ports/crypto-service";
import type { Photo } from "@domain/entities/photo";

export async function pullPhotoSync(
  syncRepo: SyncRepository,
  pinRepo: PinRepository,
  photoRepo: PhotoRepository,
  cryptoService: CryptoService,
  encryptionKey: CryptoKey
): Promise<{ downloadedCount: number }> {
  const pins = await pinRepo.findAll();
  if (pins.length === 0) return { downloadedCount: 0 };

  let downloadedCount = 0;

  for (const pin of pins) {
    let remoteList: { id: string; hlcPhysical: number; hlcLogical: number }[];
    try {
      remoteList = await syncRepo.fetchPhotoList(pin.id);
    } catch {
      continue;
    }

    if (remoteList.length === 0) continue;

    const localPhotos = await photoRepo.findByPinId(pin.id);
    const localIds = new Set(localPhotos.map((p) => p.id));
    const missing = remoteList.filter((r) => !localIds.has(r.id));

    for (const remote of missing) {
      try {
        const encryptedBuffer = await syncRepo.fetchPhotoBinary(remote.id);
        const decryptedBuffer = await cryptoService.decryptBinary(encryptionKey, encryptedBuffer);
        const blob = new Blob([decryptedBuffer], { type: "image/jpeg" });

        const photo: Photo = {
          id: remote.id,
          pinId: pin.id,
          blob,
          mimeType: "image/jpeg",
          createdAt: new Date(remote.hlcPhysical),
          hlc: { physical: remote.hlcPhysical, logical: remote.hlcLogical, nodeId: "remote" },
          syncedAt: new Date(),
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

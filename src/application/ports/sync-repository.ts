export interface PinSyncRecord {
  id: string;
  encryptedPayload: string;
  iv: string;
  hlcPhysical: number;
  hlcLogical: number;
  hlcNodeId: string;
  isDeleted: boolean;
  createdAt: string; // ISO8601
}

export interface PhotoSyncRecord {
  id: string;
  pinId: string;
  encryptedMeta: string;
  metaIv: string;
  hlcPhysical: number;
  hlcLogical: number;
  hlcNodeId: string;
  isDeleted: boolean;
  createdAt: string; // ISO8601
}

export interface SyncRepository {
  // 認証
  register(email: string, passwordHash: string, salt: string): Promise<void>;
  login(
    email: string,
    passwordHash: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    salt: string;
    plan: string;
    role: string;
  }>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
  logout(refreshToken: string): Promise<void>;

  // ピン同期
  fetchPinsSince(hlcPhysical: number, hlcLogical: number): Promise<PinSyncRecord[]>;
  pushPin(record: PinSyncRecord): Promise<{ serverHlcPhysical: number; serverHlcLogical: number }>;

  // 写真同期
  fetchPhotoList(pinId: string): Promise<{ id: string; hlcPhysical: number; hlcLogical: number }[]>;
  /**
   * 暗号化済み写真バイナリとメタデータを multipart/form-data で一括 PUT する。
   * pushPhotoMeta は廃止し、このメソッドに統合。
   */
  pushPhotoBinary(
    photoId: string,
    encryptedBlob: ArrayBuffer,
    meta: {
      encryptedMeta: string;
      metaIv: string;
      pinId: string;
      hlcPhysical: number;
      hlcLogical: number;
      hlcNodeId: string;
    }
  ): Promise<void>;
  fetchPhotoBinary(photoId: string): Promise<ArrayBuffer>;
  deletePhoto(photoId: string): Promise<void>;
}

import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/types";

export type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
};

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

export type LoginResult =
  | { accessToken: string; refreshToken: string; salt: string; plan: string; role: string }
  | {
      requires_passkey: true;
      passkey_session: string;
      challenge: string;
      credential_ids: string[];
      salt: string;
    };

export interface PasskeyCredential {
  id: string;
  deviceName: string;
  createdAt: string;
}

export interface SyncRepository {
  // 認証
  register(email: string, passwordHash: string, salt: string): Promise<void>;
  requestRegistration(email: string, passwordHash: string, salt: string): Promise<void>;
  getInviteInfo(token: string): Promise<{ email: string; isPendingSetup: boolean }>;
  activateInvite(
    token: string,
    passwordHash: string,
    salt: string
  ): Promise<{ accessToken: string; refreshToken: string; salt: string; plan: string; role: string }>;
  login(email: string, passwordHash: string): Promise<LoginResult>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
  logout(refreshToken: string): Promise<void>;

  // パスキー（WebAuthn 2FA）
  beginPasskeyRegistration(): Promise<PublicKeyCredentialCreationOptionsJSON>;
  completePasskeyRegistration(
    credential: RegistrationResponseJSON,
    deviceName: string
  ): Promise<void>;
  verifyPasskeyAuth(
    passkeySession: string,
    assertion: AuthenticationResponseJSON
  ): Promise<{ accessToken: string; refreshToken: string; plan: string; role: string }>;
  listPasskeyCredentials(): Promise<PasskeyCredential[]>;
  deletePasskeyCredential(credentialId: string): Promise<void>;

  // ピン同期
  fetchPinsSince(hlcPhysical: number, hlcLogical: number): Promise<PinSyncRecord[]>;
  pushPin(record: PinSyncRecord): Promise<{ serverHlcPhysical: number; serverHlcLogical: number }>;

  // 写真同期
  fetchPhotoList(pinId: string): Promise<
    {
      id: string;
      hlcPhysical: number;
      hlcLogical: number;
      encryptedMeta: string;
      metaIv: string;
    }[]
  >;
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
